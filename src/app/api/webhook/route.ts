import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    const isProduction = process.env.NODE_ENV === 'production';
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

    try {
        const body = await req.text();
        const sig = headers().get('stripe-signature');
        console.log('📡 Webhook called with signature:', !!sig);

        if (!sig) {
            throw new Error('No signature found');
        }

        const event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        console.log(`📦 Processing ${event.type} event`);

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('💳 Processing completed checkout:', session.id);
                const sessionOrder = await createOrderFromCheckoutSession(session);
                console.log('✅ Created Sanity order from session:', sessionOrder._id);
                break;

            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('💰 Payment succeeded:', paymentIntent.id);
                // Only create order if it's a direct PaymentIntent (not from Checkout)
                if (!paymentIntent.metadata.checkout_session_id) {
                    const piOrder = await createOrderFromPaymentIntent(paymentIntent);
                    console.log('✅ Created Sanity order from payment intent:', piOrder._id);
                } else {
                    console.log('ℹ️ Skipping order creation - handled by checkout session');
                }
                break;

            default:
                console.log(`⚠️ Unhandled event: ${event.type}`);
        }

        return NextResponse.json(
            { received: true, environment: process.env.NODE_ENV },
            { status: 200 }
        );
    } catch (err: any) {
        console.error('🔴 Webhook error:', err.message);
        return NextResponse.json(
            { error: err.message },
            { status: 400 }
        );
    }
}

async function createOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
    const {
        id,
        amount_total,
        currency,
        metadata,
        payment_intent,
        customer,
        total_details,
        customer_details
    } = session;

    // Get order details from metadata or customer details
    const orderNumber = metadata?.orderNumber || `order-${Date.now()}`;
    const customerName = metadata?.customerName || 
                        (customer_details ? `${customer_details.name || 'Unknown'}` : 'Unknown');
    const customerEmail = metadata?.customerEmail || customer_details?.email || 'unknown@example.com';

    const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
        id,
        {
            expand: ['data.price.product']
        }
    );

    const sanityProducts = lineItemsWithProduct.data.map((item) => ({
        _key: crypto.randomUUID(),
        product: {
            _type: "reference",
            _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
        },
        quantity: item.quantity || 0,
    }));

    const order = await backendClient.create({
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: typeof payment_intent === 'string' ? payment_intent : undefined,
        customerName,
        stripeCustomerId: customer?.toString() || undefined,
        email: customerEmail,
        currency,
        amountDiscount: total_details?.amount_discount ? total_details.amount_discount / 100 : 0,
        products: sanityProducts,
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
    });

    return order;
}

async function createOrderFromPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    console.log('Creating order from payment intent:', paymentIntent.id);
    
    // Check if an order with this payment intent already exists
    const existingOrder = await backendClient.fetch(
        `*[_type == "order" && stripePaymentIntentId == $piId][0]`, 
        { piId: paymentIntent.id }
    );
    
    if (existingOrder) {
        console.log(`Order already exists for payment intent ${paymentIntent.id}`);
        return existingOrder;
    }
    
    // Extract order items from metadata
    let orderItems = [];
    try {
        const itemsJson = paymentIntent.metadata.orderItems;
        if (itemsJson) {
            const parsedItems = JSON.parse(itemsJson);
            orderItems = parsedItems.map((item) => ({
                _key: crypto.randomUUID(),
                product: {
                    _type: "reference",
                    _ref: item.productId,
                },
                quantity: item.quantity || 1,
            }));
        }
    } catch (error) {
        console.error('Error parsing order items:', error);
    }
    
    // Create the order in Sanity with all required fields
    const order = await backendClient.create({
        _type: "order",
        orderNumber: paymentIntent.metadata.orderNumber || `PI-${Date.now()}-${paymentIntent.id.slice(-4)}`,
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer?.toString() || undefined,
        customerName: paymentIntent.metadata.firstName && paymentIntent.metadata.lastName ? 
            `${paymentIntent.metadata.firstName} ${paymentIntent.metadata.lastName}` : 
            (paymentIntent.shipping ? paymentIntent.shipping.name : 'Unknown'),
        email: paymentIntent.metadata.email || 'unknown@example.com',
        products: orderItems,
        currency: paymentIntent.currency,
        totalPrice: paymentIntent.amount / 100,
        status: "paid",
        orderDate: new Date().toISOString(),
        shippingMethod: paymentIntent.metadata.shippingMethod || 'standard',
        notes: paymentIntent.metadata.notes || undefined,
        shippingAddress: paymentIntent.shipping ? {
            address: paymentIntent.shipping.address.line1,
            apartment: paymentIntent.shipping.address.line2 || undefined,
            city: paymentIntent.shipping.address.city,
            state: paymentIntent.shipping.address.state,
            postalCode: paymentIntent.shipping.address.postal_code,
            country: paymentIntent.shipping.address.country,
            phone: paymentIntent.shipping.phone || undefined
        } : undefined
    });

    // Now update inventory for each product
    await updateInventory(orderItems);
    
    console.log(`Created order ${order._id} with payment intent ${paymentIntent.id}`);
    return order;
}

// Helper function to update inventory
async function updateInventory(orderItems) {
    try {
        console.log('Updating inventory for ordered items');
        
        // Process each product in the order
        for (const item of orderItems) {
            const productId = item.product._ref;
            
            console.log(`Marking product ${productId} as out of stock`);
            
            // Simply set inStock to false for each purchased product
            try {
                await backendClient
                    .patch(productId)
                    .set({ inStock: false })
                    .commit();
                    
                console.log(`✅ Successfully marked ${productId} as out of stock`);
            } catch (error) {
                console.error(`⚠️ Error updating product ${productId}:`, error);
                // Continue with other products even if this one fails
            }
        }
        
        console.log('✅ All products updated successfully');
    } catch (error) {
        console.error('🔴 Error updating inventory:', error);
        // We don't throw the error to avoid failing the order creation
    }
}
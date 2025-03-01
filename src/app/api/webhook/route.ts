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
    
    // Extract order items from metadata
    let orderItems = [];
    try {
        // Parse the order items from metadata
        const itemsJson = paymentIntent.metadata.orderItems;
        if (itemsJson) {
            const parsedItems = JSON.parse(itemsJson);
            orderItems = parsedItems.map((item: any) => ({
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
    
    // Extract shipping information
    const shippingInfo = paymentIntent.shipping;
    
    // Generate a unique order number if not provided
    const orderNumber = paymentIntent.metadata.orderNumber || `PI-${Date.now()}-${paymentIntent.id.slice(-4)}`;
    
    // Create the order in Sanity
    const order = await backendClient.create({
        _type: "order",
        orderNumber,
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer?.toString() || undefined,
        customerName: paymentIntent.metadata.firstName && paymentIntent.metadata.lastName ? 
            `${paymentIntent.metadata.firstName} ${paymentIntent.metadata.lastName}` : 
            (shippingInfo ? shippingInfo.name : 'Unknown'),
        email: paymentIntent.metadata.email || 'unknown@example.com',
        products: orderItems,
        currency: paymentIntent.currency,
        amountDiscount: 0, // No discount info in PaymentIntent
        totalPrice: paymentIntent.amount / 100, // Convert from cents
        status: "paid",
        orderDate: new Date().toISOString(),
        shippingAddress: shippingInfo ? {
            address: shippingInfo.address.line1,
            apartment: shippingInfo.address.line2 || undefined,
            city: shippingInfo.address.city,
            state: shippingInfo.address.state,
            postalCode: shippingInfo.address.postal_code,
            country: shippingInfo.address.country,
            phone: shippingInfo.phone || undefined
        } : undefined
    });

    return order;
}
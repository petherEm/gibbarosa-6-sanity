import stripe from "@/lib/stripe";
import { backendClient} from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { Metadata } from "../../../../actions/createCheckoutSession";

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
                const order = await createOrderInSanity(session);
                console.log('✅ Created Sanity order:', order._id);
                break;

            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('💰 Payment succeeded:', paymentIntent.id);
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

async function createOrderInSanity(session: Stripe.Checkout.Session) {
    const {
        id,
        amount_total,
        currency,
        metadata,
        payment_intent,
        customer,
        total_details
    } = session;

    const { orderNumber, customerName, customerEmail } = metadata as Metadata;

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
        stripePaymentIntentId: payment_intent,
        customerName,
        stripeCustomerId: customer,
        email: customerEmail,
        currency,
        amountDiscount: total_details?.amount_discount ? total_details.amount_discount / 100 : 0,
        products: sanityProducts,
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
    })

    return order;

}
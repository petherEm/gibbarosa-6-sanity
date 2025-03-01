import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe secret key is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    
    // Extract necessary data from the request body
    const { items, shipping, currency, totalAmount } = body;
    
    // Log the incoming data for debugging
    console.log("Creating payment intent with:", { 
      itemCount: items?.length || 0,
      totalAmount,
      currency,
      shipping: shipping ? `${shipping.firstName} ${shipping.lastName}` : 'Missing shipping info'
    });

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Calculate the amount in smallest currency unit (cents)
    const amount = Math.round(totalAmount * 100);

    if (!amount || amount <= 0) {
      console.error("Invalid amount:", totalAmount);
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderNumber,
        firstName: shipping?.firstName,
        lastName: shipping?.lastName,
        email: shipping?.email,
        // Store order items data in metadata (truncate if too large)
        orderItems: JSON.stringify(items?.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })) || []).slice(0, 499), // Stripe metadata has a 500 character limit per field
        shippingMethod: shipping?.shippingMethod || 'standard',
      },
      shipping: shipping ? {
        name: `${shipping.firstName} ${shipping.lastName}`,
        address: {
          line1: shipping.address,
          line2: shipping.apartment || "",
          city: shipping.city,
          state: shipping.state || "",
          postal_code: shipping.postalCode,
          country: shipping.country,
        },
        phone: shipping.phone,
      } : undefined,
      description: `Order ${orderNumber} with ${items?.length || 0} item(s)`,
    });

    console.log("Payment intent created successfully:", paymentIntent.id);

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderNumber
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    
    return NextResponse.json(
      { 
        error: "Error creating payment intent", 
        message: error.message,
        code: error.code,
        type: error.type
      },
      { status: 500 }
    );
  }
}


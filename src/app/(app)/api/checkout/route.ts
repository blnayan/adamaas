import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "@/lib/cart-context";
import { generateOrderId } from "@/lib/utils";

// Ensure STRIPE_SECRET_KEY is set in .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
        return new NextResponse("No items in cart", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.variant
            ? `${item.product.name} (${item.variant.name})`
            : item.product.name,
          description: item.product.tagline,
          // images: [item.product.image], // Add real images later
        },
        unit_amount: Math.round(
          (item.variant?.price ?? item.product.basePrice) * 100,
        ), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const orderId = generateOrderId();

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      automatic_tax: {
        enabled: true,
      },
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // order id is stored in payment intent metadata so that it is available in the stripe transaction details
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/shop`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

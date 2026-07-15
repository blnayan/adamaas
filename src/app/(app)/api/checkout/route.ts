import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { generateOrderId } from "@/lib/utils";
import {
  buildLineItems,
  checkoutRequestSchema,
} from "@/lib/checkout/line-items";

// Ensure STRIPE_SECRET_KEY is set in .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const parsed = checkoutRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout request" },
        { status: 400 },
      );
    }

    // Prices always come from the catalog, never from the client.
    const { items } = parsed.data;
    const payload = await getPayload({ config });
    const productIds = [...new Set(items.map((item) => item.productId))];
    const { docs: products } = await payload.find({
      collection: "products",
      where: { id: { in: productIds } },
      pagination: false,
    });

    const result = buildLineItems(items, products);
    if (!result.ok) {
      return NextResponse.json(
        {
          error: "Some items in your cart are no longer available",
          code: "CART_OUTDATED",
        },
        { status: 409 },
      );
    }

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
      line_items: result.lineItems,
      mode: "payment",
      // order id is stored in payment intent metadata so that it is available in the stripe transaction details
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/shop/1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

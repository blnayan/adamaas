import Stripe from "stripe";
import { Card, CardContent } from "@/components/ui/card";
import { PackageCheck } from "lucide-react";

// Initialize Stripe (Server-side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface ReceiptProps {
  sessionId: string;
}

export async function Receipt({ sessionId }: ReceiptProps) {
  if (!sessionId) return null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

    const amountTotal = session.amount_total ?? 0;
    const lineItems = session.line_items?.data ?? [];

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    const orderId = paymentIntent?.metadata?.orderId;

    if (!orderId) {
      return null;
    }

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col gap-1 items-center">
          <p className="text-sm font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Order ID: {orderId}
          </p>
        </div>

        <Card className="w-full bg-card border-border py-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-lg font-bold">
              <PackageCheck className="h-5 w-5 text-primary" />
              <span>Order Summary</span>
            </div>
            <div className="space-y-4">
              {lineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start text-sm"
                >
                  <div className="flex gap-3">
                    <div className="font-medium">
                      <span className="text-primary font-bold">
                        {item.quantity}x
                      </span>{" "}
                      {item.description}
                    </div>
                  </div>
                  <div className="font-bold">
                    ${((item.amount_total ?? 0) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-4 flex justify-between items-center font-bold text-lg">
                <span>Total Paid</span>
                <span>${(amountTotal / 100).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch receipt:", error);
    return (
      <div className="text-red-500 text-sm">
        Unable to load receipt details.
      </div>
    );
  }
}

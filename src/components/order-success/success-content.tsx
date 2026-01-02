"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface SuccessContentProps {
  children?: React.ReactNode;
  sessionId: string;
}

export function SuccessContent({ children, sessionId }: SuccessContentProps) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-20 space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-24 w-24 text-primary mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Order Confirmed!
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Thank you for your purchase. You will receive an email verification
          shortly.
        </p>
      </div>

      {children}

      <div className="flex gap-4">
        <Link href="/shop/1">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue Shopping
          </Button>
        </Link>
        <Link href="/downloads">
          <Button size="lg" variant="outline">
            View Downloads
          </Button>
        </Link>
      </div>
    </div>
  );
}

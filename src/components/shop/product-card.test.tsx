import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartProvider } from "@/lib/cart-context";
import { makeProduct } from "@/lib/cart/test-helpers";
import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  it("preselects the variant flagged as default in the admin", () => {
    render(
      <CartProvider>
        <ProductCard
          product={makeProduct({
            variants: [
              { name: "Frame Pack", price: 29 },
              { name: "Full Kit", price: 269, isDefault: true },
            ],
          })}
        />
      </CartProvider>,
    );

    expect(screen.getByText("$269")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Full Kit");
  });
});

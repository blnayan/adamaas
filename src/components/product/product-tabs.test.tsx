import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { makeMedia, makeProduct } from "@/lib/cart/test-helpers";
import { ProductTabs } from "./product-tabs";

describe("ProductTabs", () => {
  it("has no Gallery tab — images live in the hero instead", () => {
    render(<ProductTabs product={makeProduct()} />);
    expect(screen.queryByRole("tab", { name: "Gallery" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Overview",
      "Flight Footage",
      "Downloads",
    ]);
  });

  describe("use cases", () => {
    it("shows each use case in the overview", () => {
      render(
        <ProductTabs
          product={makeProduct({
            useCases: [
              { title: "Wildlife Filming", description: "Near-silent operation." },
              { title: "Mapping & Surveying", description: "Stable, quiet platform." },
            ],
          })}
        />,
      );
      expect(screen.getByText("Wildlife Filming")).toBeInTheDocument();
      expect(screen.getByText("Near-silent operation.")).toBeInTheDocument();
      expect(screen.getByText("Mapping & Surveying")).toBeInTheDocument();
    });

    it("omits the use cases section when the product has none", () => {
      render(<ProductTabs product={makeProduct()} />);
      expect(screen.queryByText("Use Cases")).not.toBeInTheDocument();
    });
  });

  it("has no pricing options section — variants live in the hero buy box", () => {
    render(
      <ProductTabs
        product={makeProduct({
          variants: [
            { name: "Electronics Kit", price: 199 },
            { name: "Frame Pack", price: 29 },
          ],
        })}
      />,
    );
    expect(screen.queryByText("Pricing Options")).not.toBeInTheDocument();
    expect(screen.queryByText("$199.00")).not.toBeInTheDocument();
  });

  describe("downloads tab", () => {
    it("offers a download link for each attached file", async () => {
      const user = userEvent.setup();
      render(
        <ProductTabs
          product={makeProduct({
            downloadFiles: [
              {
                label: "3D Print Project (.3mf)",
                file: makeMedia({ id: 1, url: "/media/adamaas-nomad.3mf" }),
              },
              {
                label: "Full Assembly (.zip)",
                file: makeMedia({ id: 2, url: "/media/nomad-full-assembly.zip" }),
              },
            ],
          })}
        />,
      );

      await user.click(screen.getByRole("tab", { name: "Downloads" }));

      expect(
        screen.getByRole("link", { name: /3D Print Project \(\.3mf\)/ }),
      ).toHaveAttribute("href", "/media/adamaas-nomad.3mf");
      expect(
        screen.getByRole("link", { name: /Full Assembly \(\.zip\)/ }),
      ).toHaveAttribute("href", "/media/nomad-full-assembly.zip");
    });

    it("shows no download card when the product has no files", async () => {
      const user = userEvent.setup();
      render(<ProductTabs product={makeProduct()} />);

      await user.click(screen.getByRole("tab", { name: "Downloads" }));

      expect(screen.queryByText("Open Source Files")).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });
});

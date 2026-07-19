import { Product } from "@/payload-types";
import {
  type CollectionConfig,
  type CollectionAfterChangeHook,
  type CollectionAfterDeleteHook,
  type PayloadRequest,
} from "payload";
import { revalidatePath } from "next/cache";
import { shopPagePaths } from "@/lib/shop/pagination";

// Coarse but bulletproof: any catalog change refreshes every shop page,
// instead of computing which page a product lands on. Bundle edits matter
// too — the bundle renders in the hero of every shop page. The shop pages
// must be revalidated by their concrete paths: revalidatePath with the
// "/shop/[page]" pattern does not purge the prerendered pages (Next 16).
async function revalidateShopPaths(req: PayloadRequest, doc: Product) {
  revalidatePath("/");
  revalidatePath(`/product/${doc.slug}`);
  const { totalDocs } = await req.payload.count({
    collection: "products",
    where: { type: { equals: "product" } },
  });
  for (const path of shopPagePaths(totalDocs)) revalidatePath(path);
}

// Scripts run outside a Next request, where revalidatePath throws — they
// opt out by passing `context: { disableRevalidate: true }`.
const revalidateAfterChange: CollectionAfterChangeHook<Product> = async ({
  doc,
  req,
}) => {
  if (!req.context?.disableRevalidate) await revalidateShopPaths(req, doc);
};

const revalidateAfterDelete: CollectionAfterDeleteHook<Product> = async ({
  doc,
  req,
}) => {
  if (!req.context?.disableRevalidate) await revalidateShopPaths(req, doc);
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Product", value: "product" },
        { label: "Bundle", value: "bundle" },
      ],
      defaultValue: "product",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true, // Slugs must be unique
    },
    {
      name: "tagline",
      type: "text",
      required: true,
    },
    {
      name: "basePrice",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "heroDescription",
      type: "textarea",
      admin: {
        description: "Short punchy copy shown in the hero under the tagline.",
      },
    },
    {
      name: "downloadFiles",
      type: "array",
      label: "Download Files",
      admin: {
        description:
          "Open-source files offered for direct download on the product's Downloads tab.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "file",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "flightFootageUrl",
      type: "text",
      label: "Flight Footage URL",
      admin: {
        description:
          "YouTube link (watch, share, or Shorts URL) shown as an embed on the product's Flight Footage tab. Leave empty to hide the tab.",
      },
    },
    {
      name: "useCases",
      type: "array",
      label: "Use Cases",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "badges",
      type: "array",
      label: "Badges",
      minRows: 0,
      fields: [
        {
          name: "text",
          type: "text",
        },
      ],
    },
    {
      name: "variants",
      type: "array",
      label: "Variants",
      validate: (value: unknown) => {
        const rows = Array.isArray(value) ? value : [];
        const defaults = rows.filter(
          (row) => (row as { isDefault?: boolean } | null)?.isDefault,
        );
        return (
          defaults.length <= 1 ||
          "Only one variant can be marked as the default selection."
        );
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "description",
          type: "text",
          admin: {
            description:
              'One-line tier description, e.g. "Core performance bundle (VTX not included)".',
          },
        },
        {
          name: "isDefault",
          type: "checkbox",
          label: "Default selection",
          defaultValue: false,
          admin: {
            description:
              "Preselect this variant on the product page and shop card. Check at most one.",
          },
        },
        {
          name: "images",
          type: "array",
          label: "Images",
          admin: {
            description:
              "Gallery photos shown while this variant is selected. Falls back to the hero image when empty.",
          },
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "techSpecs",
      type: "array",
      label: "Technical Specifications",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "Hero Image",
      admin: {
        description:
          "Default image for this product — shown on shop cards, the featured carousel, the cart, and as the product page fallback when the selected variant has no images.",
      },
    },
  ],
};

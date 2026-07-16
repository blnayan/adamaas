import { Product } from "@/payload-types";
import {
  type CollectionConfig,
  type CollectionAfterChangeHook,
  type CollectionAfterDeleteHook,
} from "payload";
import { revalidatePath } from "next/cache";

// Coarse but bulletproof: any catalog change refreshes every shop page in
// one call, instead of computing which page a product lands on. Bundle
// edits matter too — the bundle renders in the hero of every shop page.
function revalidateShopPaths(doc: Product) {
  revalidatePath("/");
  revalidatePath(`/product/${doc.slug}`);
  revalidatePath("/shop/[page]", "page");
}

// Scripts run outside a Next request, where revalidatePath throws — they
// opt out by passing `context: { disableRevalidate: true }`.
const revalidateAfterChange: CollectionAfterChangeHook<Product> = ({
  doc,
  req,
}) => {
  if (!req.context?.disableRevalidate) revalidateShopPaths(doc);
};

const revalidateAfterDelete: CollectionAfterDeleteHook<Product> = ({
  doc,
  req,
}) => {
  if (!req.context?.disableRevalidate) revalidateShopPaths(doc);
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
          "Default image for this product — shown on shop cards, the featured carousel, the cart, and as the product page fallback when there are no gallery images.",
      },
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Gallery Images",
      admin: {
        description:
          "Product photos shown in the hero gallery beside the name and description.",
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
};

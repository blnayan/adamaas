import { type CollectionConfig } from "payload";

// No on-demand revalidation on changes — the shop, home, and product pages
// refresh through their hourly ISR windows (`export const revalidate`)
// instead, so content scripts and admin edits never call revalidatePath.
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
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
    {
      name: "model3d",
      type: "upload",
      relationTo: "media",
      label: "3D Model (GLB)",
      admin: {
        description:
          "Interactive 3D model shown as an extra slide in the product page gallery. Must be a .glb (binary glTF) file.",
      },
    },
    {
      name: "modelUsdz",
      type: "upload",
      relationTo: "media",
      label: "3D Model (USDZ, optional)",
      admin: {
        description:
          "Apple USDZ version of the 3D model. When set, iPhone/iPad users get an AR Quick Look button to view the product in their space.",
      },
    },
  ],
};

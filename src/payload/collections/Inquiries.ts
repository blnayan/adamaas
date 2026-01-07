import { CollectionConfig } from "payload";

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  admin: {
    useAsTitle: "projectName",
    description: "Contact form submissions",
    group: "Form Submissions",
  },
  fields: [
    {
      name: "customerName",
      type: "text",
      required: true,
      label: "Customer Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "Phone",
      validate: (value: string | null | undefined) => {
        if (!value) return "Phone number is required";
        if (/^\d{10}$/.test(value)) return true;
        return "Phone number must be exactly 10 digits";
      },
    },
    {
      name: "projectName",
      type: "text",
      required: true,
      label: "Project Name",
    },
    {
      name: "timeline",
      type: "text",
      required: true,
      label: "Timeline",
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
    },
  ],
};

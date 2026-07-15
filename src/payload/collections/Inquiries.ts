import { CollectionConfig } from "payload";
import { PHONE_REGEX, PHONE_FORMAT_MESSAGE } from "@/lib/phone";

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
        if (PHONE_REGEX.test(value)) return true;
        return PHONE_FORMAT_MESSAGE;
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

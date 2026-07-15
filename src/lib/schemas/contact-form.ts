import { z } from "zod";
import { PHONE_REGEX, PHONE_FORMAT_MESSAGE } from "@/lib/phone";

export const contactFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  timeline: z.string().min(1, "Timeline is required"),
  email: z.email("Invalid email address"),
  phone: z.string().regex(PHONE_REGEX, PHONE_FORMAT_MESSAGE),
  description: z
    .string()
    .min(10, "Please provide more detail (at least 10 characters)"),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

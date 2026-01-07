import { z } from "zod";

export const contactFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  timeline: z.string().min(1, "Timeline is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Phone number must be in the format (xxx) xxx-xxxx",
    ),
  description: z
    .string()
    .min(10, "Please provide more detail (at least 10 characters)"),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

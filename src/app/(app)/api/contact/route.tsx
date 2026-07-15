import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { z } from "zod";
import { contactFormSchema } from "@/lib/schemas/contact-form";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { render } from "@react-email/components";
import ContactInquiry from "@/emails/ContactInquiry";

const tokenSchema = z.looseObject({ token: z.string().min(1) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const withToken = tokenSchema.safeParse(body);
  if (!withToken.success) {
    return NextResponse.json(
      { error: "Missing Turnstile token" },
      { status: 400 },
    );
  }
  const { token, ...formData } = withToken.data;

  const parsed = contactFormSchema.safeParse(formData);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data", issues: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }
  const validatedData = parsed.data;

  try {
    if (!(await verifyTurnstileToken(token))) {
      return NextResponse.json(
        { error: "Invalid Turnstile token" },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });

    // Persist first: the stored inquiry is the source of truth, the email is
    // a notification. If the email were sent first and the write failed, a
    // retry would notify the team twice with no record either time.
    await payload.create({
      collection: "inquiries",
      data: validatedData,
    });

    try {
      const emailHtml = await render(ContactInquiry(validatedData));
      await payload.sendEmail({
        from: process.env.INQUIRIES_FROM_EMAIL,
        to: process.env.INQUIRIES_TO_EMAIL,
        subject: `New Inquiry from ${validatedData.customerName}`,
        html: emailHtml,
      });
    } catch (emailError) {
      // The inquiry is saved and visible in the admin panel; a failed
      // notification email should not fail the submission.
      console.error("Inquiry notification email failed:", emailError);
    }

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}

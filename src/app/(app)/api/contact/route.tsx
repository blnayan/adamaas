import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas/contact-form";
import { render } from "@react-email/components";
import ContactInquiry from "@/emails/ContactInquiry";

const verifyEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, ...formData } = body;

    // Verify Turnstile
    if (!token) {
      return NextResponse.json(
        { error: "Missing Turnstile token" },
        { status: 400 },
      );
    }

    const verificationResponse = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || "",
        response: token,
      }),
    });

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      return NextResponse.json(
        { error: "Invalid Turnstile token" },
        { status: 400 },
      );
    }

    // Turnstile verification successful
    const validatedData = contactFormSchema.parse(formData);

    const payload = await getPayload({ config });

    const emailHtml = await render(
      <ContactInquiry
        customerName={ validatedData.customerName }
        email={ validatedData.email }
        phone={ validatedData.phone }
        projectName={ validatedData.projectName }
        timeline={ validatedData.timeline }
        description={ validatedData.description }
      />
    );

    await payload.sendEmail({
      from: process.env.INQUIRIES_FROM_EMAIL,
      to: process.env.INQUIRIES_TO_EMAIL,
      subject: `New Inquiry from ${validatedData.customerName}`,
      html: emailHtml,
    })

    await payload.create({
      collection: "inquiries",
      data: validatedData,
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}

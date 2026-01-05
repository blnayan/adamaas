import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas/contact-form";

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
    // TODO: Add email functionality

    const validatedData = contactFormSchema.parse(formData);

    const payload = await getPayload({ config });

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

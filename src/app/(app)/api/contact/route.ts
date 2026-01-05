import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas/contact-form";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate with Zod
    const validatedData = contactFormSchema.parse(body);

    const payload = await getPayload({ config });

    await payload.create({
      collection: "inquiries",
      data: validatedData,
    });

    return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

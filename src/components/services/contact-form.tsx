"use client";

import { useForm } from "@tanstack/react-form";
import {
  contactFormSchema,
  type ContactFormSchema,
} from "@/lib/schemas/contact-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/lib/phone";

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";

export function ContactForm() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [token, setToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      customerName: "",
      projectName: "",
      timeline: "",
      email: "",
      phone: "",
      description: "",
    } as ContactFormSchema,
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Please complete the verification check.");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...value, token }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit inquiry");
        }

        toast.success("Message sent! We'll be in touch shortly.");
        form.reset();
        setToken("");
        turnstileRef.current?.reset();
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Start your project</CardTitle>
          <CardDescription>
            Tell us about what you want to build.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-6">
            <form.Field name="customerName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Your name"
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="you@company.com"
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(formatPhoneNumber(e.target.value))
                      }
                      placeholder="(555) 000-0000"
                      maxLength={14} // (555) 555-5555 is 14 chars
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="projectName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Project Name</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Project Alpha"
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="timeline">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Timeline</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. 3 months, ASAP, Q4"
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe your project goals, technical requirements, and current status..."
                      className="min-h-[120px]"
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-6 items-start">
          <Turnstile
            ref={turnstileRef}
            className="leading-none"
            onSuccess={setToken}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            options={{
              theme: "auto",
              appearance: "always",
            }}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !token}
          >
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

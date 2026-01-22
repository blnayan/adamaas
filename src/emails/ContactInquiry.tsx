import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ContactInquiryProps {
  customerName: string;
  email: string;
  phone: string;
  projectName: string;
  timeline: string;
  description: string;
}

const config = {
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#18181b",
        card: "#ffffff",
        "card-foreground": "#18181b",
        primary: "#dc2626",
        "primary-foreground": "#fef2f2",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        border: "#e4e4e7",
        input: "#e4e4e7",
      },
      fontFamily: {
        sans: ['"Geist"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
};

export const ContactInquiry = ({
  customerName,
  email,
  phone,
  projectName,
  timeline,
  description,
}: ContactInquiryProps) => {
  const previewText = `New inquiry from ${customerName}`;

  // Fix: Head must be INSIDE Tailwind for styles to be injected
  return (
    <Html>
      <Tailwind config={config}>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-background my-auto mx-auto font-sans text-foreground">
          <Container className="border border-solid border-border rounded-xl my-10 mx-auto p-8 max-w-lg bg-card shadow-sm">
            <Section className="mb-8">
              <Heading className="text-foreground text-2xl font-bold text-center m-0">
                Inquiry Received
              </Heading>
              <Text className="text-muted-foreground text-center text-sm mt-2 mb-0">
                A new project inquiry has been submitted via the contact form.
              </Text>
            </Section>

            <Section className="bg-muted/30 rounded-lg p-6 mb-6 border border-border/50">
              <Text className="text-foreground text-sm font-semibold m-0 mb-1 uppercase tracking-wider text-xs text-muted-foreground">
                Customer Details
              </Text>
              <Text className="text-foreground text-base font-medium m-0">
                {customerName}
              </Text>
              <Text className="text-muted-foreground text-sm m-0 mt-1">
                <a href={`mailto:${email}`} className="text-primary hover:underline decoration-primary/30 underline-offset-4">{email}</a>
              </Text>
              <Text className="text-muted-foreground text-sm m-0">
                {phone}
              </Text>
            </Section>

            <Section className="mb-6">
                <Text className="text-foreground text-sm font-semibold m-0 mb-2 uppercase tracking-wider text-xs text-muted-foreground">
                    Project Info
                </Text>
                <div className="bg-muted p-4 rounded-lg mb-2">
                    <Text className="text-xs text-muted-foreground uppercase font-semibold m-0 mb-1">Project Name</Text>
                    <Text className="text-foreground text-sm font-medium m-0">{projectName}</Text>
                </div>
                 <div className="bg-muted p-4 rounded-lg">
                    <Text className="text-xs text-muted-foreground uppercase font-semibold m-0 mb-1">Timeline</Text>
                    <Text className="text-foreground text-sm font-medium m-0">{timeline}</Text>
                </div>
            </Section>

            <Section>
              <Text className="text-foreground text-sm font-semibold m-0 mb-2 uppercase tracking-wider text-xs text-muted-foreground">
                Description
              </Text>
              <Text className="text-foreground text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border border-border/50">
                {description}
              </Text>
            </Section>

            <Hr className="border-border my-8" />

            <Text className="text-muted-foreground text-xs text-center">
              © {new Date().getFullYear()} Adamaas. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactInquiry;

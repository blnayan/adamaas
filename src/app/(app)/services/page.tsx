import { SERVICES } from "@/lib/data";
import { ContactForm } from "@/components/services/contact-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="bg-background py-20 px-4">
      <div className="container max-w-4xl mx-auto text-center space-y-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
          Prototype Development for{" "}
          <span className="text-primary">Hardware Startups</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I turn concepts into physical, functional prototypes — built in-house,
          field-tested, and fully documented.
        </p>
        <div className="inline-block bg-muted/50 rounded-full px-6 py-2 text-sm font-medium border border-border">
          Currently accepting 2–3 client projects per quarter
        </div>
      </div>

      <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {SERVICES.map((service, i) => (
          <Card
            key={i}
            className="flex flex-col border-border bg-card hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {service.name}
              </CardTitle>
              <div className="text-primary font-bold text-xl mt-2">
                {service.priceRange}
              </div>
              <div className="text-sm text-muted-foreground">
                {service.timeline}
              </div>
            </CardHeader>
            <CardContent className="grow">
              <ul className="space-y-4">
                {service.deliverables.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="mailto:adamaas@gmail.com" className="w-full">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Inquire Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="container max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-24 space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">
              Ready to build?
            </h2>
            <p className="text-xl text-muted-foreground">
              Schedule a free 30-minute feasibility call. No commitments, just
              engineering talk.
            </p>
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-semibold text-lg">What happens next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    1
                  </div>
                  <p className="text-muted-foreground">
                    We review your requirements to ensure we're a good fit.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    2
                  </div>
                  <p className="text-muted-foreground">
                    We schedule a call to discuss technical feasibility and
                    scope.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    3
                  </div>
                  <p className="text-muted-foreground">
                    You receive a detailed proposal with timeline and pricing.
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

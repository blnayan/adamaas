import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t bg-background text-foreground py-12">
      <div className="container px-4 md:px-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4">Adamaas</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Hardware that works. Built in-house. Shipped fast. Open-source
              drone frames and engineering services.
            </p>
            <div className="flex gap-2 max-w-sm">
              <Input
                placeholder="Enter your email"
                className="bg-muted border-input"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/product/reaper"
                  className="hover:text-foreground transition-colors"
                >
                  Reaper
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/nomad"
                  className="hover:text-foreground transition-colors"
                >
                  Nomad
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/nexus"
                  className="hover:text-foreground transition-colors"
                >
                  Nexus
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/bundle"
                  className="hover:text-foreground transition-colors"
                >
                  Full Bundle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/mission"
                  className="hover:text-foreground transition-colors"
                >
                  Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-foreground transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/downloads"
                  className="hover:text-foreground transition-colors"
                >
                  Downloads
                </Link>
              </li>
              <li>
                <a
                  href="mailto:adamaas@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Adamaas. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

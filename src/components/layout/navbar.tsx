import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavbarCart } from "./navbar-cart";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter sm:inline-block">
              ADAMAAS
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/shop/1"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/services"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Services
            </Link>
            <Link
              href="/mission"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Mission
            </Link>
            <Link
              href="/blog"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <NavbarCart />
          <Link href="/services">
            <Button className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
              Hire For Prototyping
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavbarCart } from "./navbar-cart";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 rounded-md overflow-hidden">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src="/Adamaas_Logo_v2.jpg"
                  alt="ADAMAAS Logo"
                  className="object-contain"
                  fill
                  sizes="32px"
                />
              </AspectRatio>
            </div>

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
        <div className="flex items-center gap-2 sm:gap-4">
          <NavbarCart />
          <div className="hidden sm:block">
            <Link href="/services">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Hire For Prototyping
              </Button>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle>Navigation</DrawerTitle>
                  <DrawerDescription>Explore our site</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 p-4">
                  <DrawerClose asChild>
                    <Link
                      href="/shop/1"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Shop
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/services"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Services
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/mission"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Mission
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/blog"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Blog
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link href="/services" className="sm:hidden mt-2">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Hire For Prototyping
                      </Button>
                    </Link>
                  </DrawerClose>
                </div>
                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Product } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <section className="container px-4 md:px-8 max-w-screen-2xl py-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted h-auto">
          <TabsTrigger value="overview" className="h-12 text-md">
            Overview
          </TabsTrigger>
          <TabsTrigger value="gallery" className="h-12 text-md">
            Gallery
          </TabsTrigger>
          <TabsTrigger value="footage" className="h-12 text-md">
            Flight Footage
          </TabsTrigger>
          <TabsTrigger value="downloads" className="h-12 text-md">
            Downloads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Built for the Mission</h2>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
              <p className="text-muted-foreground">
                Detailed specs and features regarding the {product.name}{" "}
                platform would go here. Highlighting the specific engineering
                decisions made during in-house development.
              </p>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  Technical Specifications
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Weight</TableCell>
                      <TableCell>245g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Material</TableCell>
                      <TableCell>Carbon Fiber + PETG</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Motor Mount</TableCell>
                      <TableCell>12x12 M2</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Stack</TableCell>
                      <TableCell>20x20 / 25.5x25.5</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Pricing Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  tier: "Open-Source Files",
                  price: "FREE",
                  desc: "STL + STEP + BOM",
                },
                {
                  tier: "Frame Pack",
                  price: "$89–99",
                  desc: "Printed PETG + TPU",
                },
                {
                  tier: "Electronics Kit",
                  price: "$179–249",
                  desc: "SpeedyBee + motors + VTX",
                },
                {
                  tier: "Full BNF",
                  price: "$349–449",
                  desc: "Bind-N-Fly (add RX/batts)",
                },
              ].map((tier, i) => (
                <Card key={i} className="bg-card border-border text-center">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <div className="font-bold text-lg mb-2">{tier.tier}</div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {tier.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tier.desc}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg grid place-items-center"
              >
                <span className="text-muted-foreground">Photo {i}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="footage" className="mt-8">
          <div className="aspect-video bg-black rounded-lg grid place-items-center border border-zinc-800">
            <span className="text-white text-xl">
              Cinematic Flight Footage Embed
            </span>
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="mt-8">
          <Card className="bg-card border-border">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Open Source Files</h3>
                <p className="text-muted-foreground">
                  Get the STL, STEP, and BOM files for the {product.name} frame.
                </p>
              </div>
              <div className="flex gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Download className="h-4 w-4" /> Download Files
                </Button>
                <Button
                  variant="outline"
                  className="text-foreground border-border hover:bg-muted"
                >
                  Star on Printables
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

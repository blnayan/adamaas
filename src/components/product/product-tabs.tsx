"use client";

import { Product } from "@/payload-types";
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
              <CardContent className="px-6">
                <h3 className="text-xl font-bold mb-4">
                  Technical Specifications
                </h3>
                <Table>
                  <TableBody>
                    {product.techSpecs?.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell className="font-medium">
                          {spec.label}
                        </TableCell>
                        <TableCell>{spec.value}</TableCell>
                      </TableRow>
                    ))}
                    {(!product.techSpecs || product.techSpecs.length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center text-muted-foreground"
                        >
                          No specifications available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Pricing Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {product.variants.map((variant, i) => (
                  <Card key={i} className="bg-card border-border text-center">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="font-bold text-lg mb-2">
                        {variant.name}
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${variant.price}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
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

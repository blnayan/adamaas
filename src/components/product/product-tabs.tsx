"use client";

import { Product } from "@/payload-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { resolveFileUrl } from "@/lib/media";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  // Upload relations are only URLs when populated; drop anything unresolved
  // so the tab never renders a dead link.
  const downloads = (product.downloadFiles ?? []).flatMap((entry) => {
    const url = resolveFileUrl(entry.file);
    return url ? [{ id: entry.id, label: entry.label, url }] : [];
  });

  return (
    <section className="container px-4 md:px-8 max-w-screen-2xl py-12">
      <Tabs defaultValue="overview" className="w-full">
        {/* The list's default height uses this group-data variant, so a plain
            h-auto never replaces it in tailwind-merge — match the variant. */}
        <TabsList className="grid w-full grid-cols-3 group-data-[orientation=horizontal]/tabs:h-auto">
          <TabsTrigger value="overview" className="h-12 text-base">
            Overview
          </TabsTrigger>
          <TabsTrigger value="footage" className="h-12 text-base">
            Flight Footage
          </TabsTrigger>
          <TabsTrigger value="downloads" className="h-12 text-base">
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
                        <TableCell className="font-medium align-top">
                          {spec.label}
                        </TableCell>
                        {/* Long spec values wrap instead of forcing the
                            table's default nowrap + horizontal scroll. */}
                        <TableCell className="whitespace-normal break-words align-top">
                          {spec.value}
                        </TableCell>
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

          {product.useCases && product.useCases.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.useCases.map((useCase) => (
                  <Card key={useCase.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="font-bold text-lg mb-2">
                        {useCase.title}
                      </div>
                      <p className="text-muted-foreground">
                        {useCase.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </TabsContent>

        <TabsContent value="footage" className="mt-8">
          <div className="aspect-video bg-black rounded-lg grid place-items-center border border-zinc-800">
            <span className="text-white text-xl">
              Cinematic Flight Footage Embed
            </span>
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="mt-8">
          {downloads.length > 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Open Source Files</h3>
                  <p className="text-muted-foreground">
                    Free, open-source design files for the {product.name} —
                    download, remix, and print your own.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {downloads.map(({ id, label, url }) => (
                    <Button
                      key={id}
                      asChild
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    >
                      <a href={url} download>
                        <Download className="h-4 w-4" /> {label}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No downloads available for this product yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

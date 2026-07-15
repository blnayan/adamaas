'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

type SimplifiedBlog = {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  imageUrl: string;
  imageAlt: string;
};

type ClientBlogListProps = {
  blogs: SimplifiedBlog[];
};

export function ClientBlogList({ blogs }: ClientBlogListProps) {
  const [page, setPage] = useState(1);
  const limit = 9;
  const totalPages = Math.ceil(blogs.length / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Newspaper className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          We are currently working on some exciting new content. Check back soon for the latest updates and deep dives!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {currentBlogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.id} className="block group">
            <Card className="h-full flex flex-col border-border bg-card hover:border-primary/50 transition-colors overflow-hidden">
              <div className="w-full relative">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={blog.imageUrl}
                    alt={blog.imageAlt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </AspectRatio>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold line-clamp-2">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <p className="text-muted-foreground line-clamp-3">
                  {blog.excerpt}
                </p>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={(e) => { e.preventDefault(); setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  href="#" 
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={(e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    href="#" 
                    isActive={page === p}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={(e) => { e.preventDefault(); setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  href="#" 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

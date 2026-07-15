import { getPayload } from 'payload';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { resolveImageOrFallback } from '@/lib/media';
import { formatLongDate } from '@/lib/format';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'blogs',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const post = docs[0];

  if (!post) {
    notFound();
  }

  const image = resolveImageOrFallback(post.heroImage, post.title);

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:py-20">
      <article className="container max-w-3xl mx-auto space-y-8">
        <Link href="/blog" className="inline-block mb-8">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            {post.title}
          </h1>
          <div className="flex items-center text-muted-foreground space-x-4">
            <time dateTime={post.createdAt}>{formatLongDate(post.createdAt)}</time>
          </div>
        </div>

        <div className="w-full relative rounded-xl overflow-hidden bg-muted border border-border">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </AspectRatio>
        </div>

        {/* Rich Text Content */}
        <div className="
          mt-10
          [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:text-foreground
          [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-foreground
          [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-foreground
          [&_p]:text-lg [&_p]:text-muted-foreground [&_p]:mb-6 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-muted-foreground [&_ul]:text-lg [&_ul]:space-y-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-muted-foreground [&_ol]:text-lg [&_ol]:space-y-2
          [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
          [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6 [&_blockquote]:py-2 [&_blockquote]:bg-muted/50 [&_blockquote]:rounded-r-lg
          [&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full [&_img]:object-cover [&_img]:border [&_img]:border-border
          [&_strong]:text-foreground [&_strong]:font-semibold
          [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm [&_code]:text-foreground
          [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_pre]:border [&_pre]:border-border
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm
        ">
          <RichText data={post.content} />
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  
  const { docs } = await payload.find({
    collection: 'blogs',
    limit: 100, // Pre-render up to 100 most recent blog posts
  });

  return docs.map((post) => ({
    slug: post.slug,
  }));
}

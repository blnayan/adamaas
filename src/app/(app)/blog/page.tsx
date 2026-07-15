import { getPayload } from 'payload';
import config from '@payload-config';
import { ClientBlogList } from '@/components/blog/client-blog-list';

export const revalidate = 3600; // default revalidation if hooks miss

export default async function BlogIndexPage() {
  const payload = await getPayload({ config });

  // Fetch all blogs (or a large limit if there are thousands)
  const { docs: blogs } = await payload.find({
    collection: 'blogs',
    limit: 1000,
    sort: '-createdAt',
  });

  const simplifiedBlogs = blogs.map(blog => {
    const image = typeof blog.heroImage === 'object' ? blog.heroImage : null;
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      createdAt: blog.createdAt,
      imageUrl: image?.url || '/Adamaas_Logo_v2.jpg',
      imageAlt: image?.alt || blog.title,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 container px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, updates, and deep dives from the ADAMAAS team.
          </p>
        </div>

        <ClientBlogList blogs={simplifiedBlogs} />
      </section>
    </div>
  );
}

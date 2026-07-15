import { CollectionConfig } from 'payload';
import { revalidatePath } from 'next/cache';

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Everyone can read blogs
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        // Revalidate the blog index and the specific blog post
        revalidatePath('/blog');
        if (doc.slug) {
          revalidatePath(`/blog/${doc.slug}`);
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePath('/blog');
        if (doc.slug) {
          revalidatePath(`/blog/${doc.slug}`);
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A short summary of the blog post to display on the blog list page.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
};

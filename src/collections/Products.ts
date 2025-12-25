import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Product', value: 'product' },
        { label: 'Bundle', value: 'bundle' },
      ],
      defaultValue: 'product',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // Slugs must be unique
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Badges',
      minRows: 0,
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Variants',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

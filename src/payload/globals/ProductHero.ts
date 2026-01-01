import type { GlobalConfig } from 'payload'

export const ProductHero: GlobalConfig = {
  slug: 'product-hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'featuredProduct',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
      required: true,
      label: 'Featured Product',
    },
  ],
}
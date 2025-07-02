import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access since this is demo content
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'featured', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      type: 'select',
      options: [
        { label: '5 Stars', value: '5' },
        { label: '4 Stars', value: '4' },
        { label: '3 Stars', value: '3' },
      ],
      defaultValue: '5',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Display this testimonial prominently',
      },
    },
    {
      name: 'testimonialType',
      type: 'select',
      options: [
        { label: 'Exporter', value: 'exporter' },
        { label: 'Importer', value: 'importer' },
        { label: 'Partner', value: 'partner' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

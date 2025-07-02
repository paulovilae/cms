import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Features: CollectionConfig = {
  slug: 'features',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access since this is demo content
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'longDescription',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures],
      }),
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'screenshot',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Smart Escrow', value: 'escrow' },
        { label: 'Blockchain', value: 'blockchain' },
        { label: 'Oracle Verification', value: 'oracle' },
        { label: 'KYC/KYB', value: 'kyc' },
        { label: 'Payments', value: 'payments' },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'userType',
      type: 'select',
      options: [
        { label: 'Exporter', value: 'exporter' },
        { label: 'Importer', value: 'importer' },
        { label: 'Both', value: 'both' },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    ...slugField(),
  ],
}

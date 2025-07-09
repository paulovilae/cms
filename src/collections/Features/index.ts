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
    defaultColumns: ['title', 'category', 'business', 'order', 'updatedAt'],
  },
  fields: [
    {
      name: 'business',
      type: 'select',
      options: [
        { label: 'IntelliTrade', value: 'intellitrade' },
        { label: 'Salarium', value: 'salarium' },
        { label: 'Latinos', value: 'latinos' },
        { label: 'Capacita', value: 'capacita' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Which business this feature belongs to',
      },
    },
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
        // IntelliTrade categories
        { label: 'Smart Escrow', value: 'escrow' },
        { label: 'Blockchain', value: 'blockchain' },
        { label: 'Oracle Verification', value: 'oracle' },
        { label: 'KYC/KYB', value: 'kyc' },
        { label: 'Payments', value: 'payments' },
        // Salarium categories
        { label: 'AI Assistance', value: 'ai-assistance' },
        { label: 'Compensation', value: 'compensation' },
        { label: 'Market Data', value: 'market-data' },
        { label: 'Benefits', value: 'benefits' },
        { label: 'Automation', value: 'automation' },
        { label: 'Analytics', value: 'analytics' },
        // Latinos categories
        { label: 'Trading Bots', value: 'trading-bots' },
        { label: 'Strategy', value: 'strategy' },
        { label: 'Risk Management', value: 'risk-management' },
        { label: 'Execution', value: 'execution' },
        { label: 'Portfolio', value: 'portfolio' },
        // Capacita categories
        { label: 'Avatar Training', value: 'avatar-training' },
        { label: 'Gamification', value: 'gamification' },
        { label: 'Evaluation', value: 'evaluation' },
        { label: 'Training Engine', value: 'training-engine' },
        { label: 'Scalability', value: 'scalability' },
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
        // IntelliTrade user types
        { label: 'Exporter', value: 'exporter' },
        { label: 'Importer', value: 'importer' },
        { label: 'Both', value: 'both' },
        // Salarium user types
        { label: 'HR Professional', value: 'hr' },
        { label: 'Manager', value: 'manager' },
        { label: 'Employee', value: 'employee' },
        // Latinos user types
        { label: 'Trader', value: 'trader' },
        { label: 'Investor', value: 'investor' },
        // Capacita user types
        { label: 'Trainee', value: 'trainee' },
        { label: 'Admin', value: 'admin' },
        { label: 'Instructor', value: 'instructor' },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    ...slugField(),
  ],
}

import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const Companies: CollectionConfig = {
  slug: 'companies',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access since this is demo content
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'country', 'updatedAt'],
    group: 'IntelliTrade', // Changed from 'Demo Content'
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
        { label: 'Exporter', value: 'exporter' },
        { label: 'Importer', value: 'importer' },
        { label: 'Both', value: 'both' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    // Address Information
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'streetAddress',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'stateProvince',
          type: 'text',
        },
        {
          name: 'postalCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'gpsCoordinates',
          type: 'text',
          admin: {
            description: 'Format: latitude,longitude (e.g., 34.0522,-118.2437)',
          },
        },
      ],
    },
    // Contact Information
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'primaryPhone',
          type: 'text',
        },
        {
          name: 'alternatePhone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'contactPerson',
          type: 'text',
        },
        {
          name: 'contactPosition',
          type: 'text',
        },
      ],
    },
    // Business Details
    {
      name: 'businessDetails',
      type: 'group',
      fields: [
        {
          name: 'registrationNumber',
          type: 'text',
        },
        {
          name: 'taxId',
          type: 'text',
        },
        {
          name: 'yearEstablished',
          type: 'number',
        },
        {
          name: 'industrySector',
          type: 'select',
          dbName: 'industry_sector',
          options: [
            { label: 'Agriculture', value: 'agriculture' },
            { label: 'Manufacturing', value: 'manufacturing' },
            { label: 'Food Processing', value: 'food-processing' },
            { label: 'Textiles', value: 'textiles' },
            { label: 'Electronics', value: 'electronics' },
            { label: 'Pharmaceuticals', value: 'pharmaceuticals' },
            { label: 'Automotive', value: 'automotive' },
            { label: 'Commodities', value: 'commodities' },
            { label: 'Retail', value: 'retail' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'employeeCount',
          type: 'number',
        },
        {
          name: 'annualRevenue',
          type: 'number',
          admin: {
            description: 'Annual revenue in USD',
          },
        },
        {
          name: 'certifications',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'issuingBody',
              type: 'text',
            },
            {
              name: 'issueDate',
              type: 'date',
            },
            {
              name: 'expiryDate',
              type: 'date',
            },
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Full URL including https://',
      },
    },
    ...slugField(),
  ],
}

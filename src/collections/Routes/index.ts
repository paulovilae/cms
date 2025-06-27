import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const Routes: CollectionConfig = {
  slug: 'routes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'originPort', 'destinationPort', 'transportMode', 'updatedAt'],
    group: 'IntelliTrade',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'originCountry',
      type: 'text',
      required: true,
    },
    {
      name: 'originPort',
      type: 'text',
      required: true,
    },
    {
      name: 'destinationCountry',
      type: 'text',
      required: true,
    },
    {
      name: 'destinationPort',
      type: 'text',
      required: true,
    },
    {
      name: 'transitPorts',
      type: 'array',
      fields: [
        {
          name: 'portName',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'estimatedDaysFromOrigin',
          type: 'number',
        },
        {
          name: 'services',
          type: 'select',
          dbName: 'transit_services',
          options: [
            { label: 'Transshipment', value: 'transshipment' },
            { label: 'Customs Clearance', value: 'customs' },
            { label: 'Inspection', value: 'inspection' },
            { label: 'Container Handling', value: 'container-handling' },
            { label: 'Other', value: 'other' },
          ],
          hasMany: true,
        },
      ],
    },
    {
      name: 'estimatedTransitTime',
      type: 'number',
      admin: {
        description: 'Total transit time in days',
      },
    },
    {
      name: 'distance',
      type: 'number',
      admin: {
        description: 'Distance in nautical miles',
      },
    },
    {
      name: 'transportMode',
      type: 'select',
      options: [
        { label: 'Ocean Freight', value: 'ocean' },
        { label: 'Air Freight', value: 'air' },
        { label: 'Road Transport', value: 'road' },
        { label: 'Rail Transport', value: 'rail' },
        { label: 'Multimodal', value: 'multimodal' },
      ],
      required: true,
    },
    {
      name: 'carriers',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'service',
          type: 'text',
        },
        {
          name: 'frequency',
          type: 'text',
          admin: {
            description: 'How often this carrier serves this route (e.g., weekly, bi-weekly)',
          },
        },
      ],
    },
    {
      name: 'frequencyOfService',
      type: 'text',
      admin: {
        description: 'How often ships/vehicles depart on this route (e.g., daily, weekly)',
      },
    },
    {
      name: 'averageCost',
      type: 'number',
      admin: {
        description: 'Average cost in USD for standard container/shipment',
      },
    },
    {
      name: 'riskLevel',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
    },
    ...slugField(),
  ],
}

import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'feature-grid',
  interfaceName: 'FeatureGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: '2 Columns', value: '2col' },
        { label: '3 Columns', value: '3col' },
        { label: '4 Columns', value: '4col' },
      ],
      defaultValue: '3col',
    },
    {
      name: 'features',
      type: 'relationship',
      relationTo: 'features',
      hasMany: true,
      admin: {
        description: 'Select features to display in the grid',
      },
    },
    {
      name: 'showNumbers',
      type: 'checkbox',
      label: 'Show numbered features',
      defaultValue: true,
    },
    {
      name: 'animated',
      type: 'checkbox',
      label: 'Animate features on scroll',
      defaultValue: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Brand', value: 'brand' },
      ],
      defaultValue: 'light',
    },
  ],
}

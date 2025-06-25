import type { Block } from 'payload'

export const StatCounter: Block = {
  slug: 'stat-counter',
  interfaceName: 'StatCounterBlock',
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
        { label: 'Row', value: 'row' },
        { label: 'Grid', value: 'grid' },
      ],
      defaultValue: 'row',
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          required: true,
        },
        {
          name: 'prefix',
          type: 'text',
        },
        {
          name: 'suffix',
          type: 'text',
        },
        {
          name: 'duration',
          type: 'number',
          defaultValue: 2,
          admin: {
            description: 'Animation duration in seconds',
          },
        },
        {
          name: 'color',
          type: 'text',
        },
      ],
      admin: {
        initCollapsed: false,
      },
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

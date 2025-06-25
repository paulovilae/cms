import type { Block } from 'payload'

export const FloatingCTA: Block = {
  slug: 'floating-cta',
  interfaceName: 'FloatingCTABlock',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'select',
      options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom Center', value: 'bottom-center' },
      ],
      defaultValue: 'bottom-right',
    },
    {
      name: 'scrollTrigger',
      type: 'number',
      defaultValue: 500,
      admin: {
        description: 'Show after scrolling this many pixels',
      },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      defaultValue: '#1E4EFF',
    },
    {
      name: 'textColor',
      type: 'text',
      defaultValue: '#FFFFFF',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'dismissible',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

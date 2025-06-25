import type { Block } from 'payload'

export const AnimatedTimeline: Block = {
  slug: 'animated-timeline',
  interfaceName: 'AnimatedTimelineBlock',
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
      name: 'orientation',
      type: 'radio',
      options: [
        {
          label: 'Horizontal',
          value: 'horizontal',
        },
        {
          label: 'Vertical',
          value: 'vertical',
        },
      ],
      defaultValue: 'horizontal',
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'highlightColor',
          type: 'text',
        },
      ],
      admin: {
        initCollapsed: false,
      },
    },
    {
      name: 'animationSpeed',
      type: 'select',
      options: [
        { label: 'Slow', value: 'slow' },
        { label: 'Medium', value: 'medium' },
        { label: 'Fast', value: 'fast' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'showProgress',
      type: 'checkbox',
      label: 'Show progress indicator',
      defaultValue: true,
    },
  ],
}

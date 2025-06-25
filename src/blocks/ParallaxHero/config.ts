import type { Block } from 'payload'

export const ParallaxHero: Block = {
  slug: 'parallax-hero',
  interfaceName: 'ParallaxHeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'backgroundType',
      type: 'radio',
      options: [
        {
          label: 'Image',
          value: 'image',
        },
        {
          label: 'Video',
          value: 'video',
        },
        {
          label: 'Color',
          value: 'color',
        },
      ],
      defaultValue: 'image',
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data, siblingData) => siblingData?.backgroundType === 'image',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data, siblingData) => siblingData?.backgroundType === 'video',
      },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      admin: {
        condition: (data, siblingData) => siblingData?.backgroundType === 'color',
      },
    },
    {
      name: 'foregroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'parallaxSpeed',
      type: 'select',
      options: [
        { label: 'Slow', value: 'slow' },
        { label: 'Medium', value: 'medium' },
        { label: 'Fast', value: 'fast' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
    {
      name: 'height',
      type: 'select',
      options: [
        { label: 'Full Screen', value: 'full' },
        { label: 'Large', value: 'large' },
        { label: 'Medium', value: 'medium' },
      ],
      defaultValue: 'large',
    },
    {
      name: 'textColor',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      defaultValue: 'light',
    },
    {
      name: 'mouseParallax',
      type: 'checkbox',
      label: 'Enable mouse-based parallax',
      defaultValue: true,
    },
  ],
}

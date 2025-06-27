import type { Block } from 'payload'

export const SmartContractDemo: Block = {
  slug: 'smart-contract-demo',
  interfaceName: 'SmartContractDemoBlock',
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
      name: 'transaction',
      type: 'relationship',
      relationTo: 'export-transactions',
      required: true,
      admin: {
        description: 'Select an export transaction to showcase in this demo',
      },
    },
    {
      name: 'showTechnicalDetails',
      type: 'checkbox',
      label: 'Show technical code snippets',
      defaultValue: true,
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
      name: 'interactiveMode',
      type: 'select',
      options: [
        { label: 'Step by Step (Manual)', value: 'manual' },
        { label: 'Automatic Playthrough', value: 'auto' },
        { label: 'Both Options', value: 'both' },
      ],
      defaultValue: 'both',
    },
  ],
}

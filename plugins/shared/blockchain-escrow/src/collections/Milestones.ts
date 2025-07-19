import type { CollectionConfig } from 'payload'

export const Milestones: CollectionConfig = {
  slug: 'milestones',
  admin: {
    useAsTitle: 'title',
    group: 'Escrow',
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
    },
    {
      name: 'escrowAgreement',
      type: 'relationship',
      relationTo: 'escrow-agreements',
      required: true,
    },
    {
      name: 'sequence',
      type: 'number',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'dueDate',
      type: 'date',
    },
    {
      name: 'completionDate',
      type: 'date',
    },
    {
      name: 'requirements',
      type: 'richText',
    },
  ],
}

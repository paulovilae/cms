import type { CollectionConfig } from 'payload'

export const PaymentReleases: CollectionConfig = {
  slug: 'payment-releases',
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
      name: 'escrowAgreement',
      type: 'relationship',
      relationTo: 'escrow-agreements',
      required: true,
    },
    {
      name: 'milestone',
      type: 'relationship',
      relationTo: 'milestones',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'COP', value: 'COP' },
      ],
      defaultValue: 'USD',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Released', value: 'released' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'requestedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'requestDate',
      type: 'date',
      required: true,
    },
    {
      name: 'releaseDate',
      type: 'date',
    },
    {
      name: 'paymentProof',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}

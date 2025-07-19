import type { CollectionConfig } from 'payload'

export const EscrowAgreements: CollectionConfig = {
  slug: 'escrow-agreements',
  admin: {
    useAsTitle: 'title',
    group: 'Escrow',
    defaultColumns: ['title', 'status', 'totalAmount', 'currency', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      validate: (val: string | undefined) => {
        if (!val || val.length === 0) {
          return 'Title is required'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the escrow agreement',
      },
    },
    {
      name: 'exporter',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The party exporting goods/services',
      },
    },
    {
      name: 'importer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The party importing goods/services',
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total amount to be held in escrow',
      },
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'COP', value: 'COP' },
        { label: 'BTC', value: 'BTC' },
        { label: 'ETH', value: 'ETH' },
      ],
      defaultValue: 'USD',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Funds Deposited', value: 'funded' },
        { label: 'Goods Shipped', value: 'shipped' },
        { label: 'Goods Received', value: 'received' },
        { label: 'Completed', value: 'completed' },
        { label: 'Disputed', value: 'disputed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        description: 'Current status of the escrow agreement',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date when the escrow agreement becomes active',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'Expected completion date (optional)',
      },
    },
    {
      name: 'terms',
      type: 'richText',
      admin: {
        description: 'Detailed terms and conditions of the escrow agreement',
      },
    },
    {
      name: 'blockchainTxHash',
      type: 'text',
      admin: {
        description: 'Blockchain transaction hash for escrow creation',
        readOnly: true,
      },
    },
    {
      name: 'smartContractAddress',
      type: 'text',
      admin: {
        description: 'Smart contract address managing this escrow',
        readOnly: true,
      },
    },
    {
      name: 'milestones',
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
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Disputed', value: 'disputed' },
          ],
          defaultValue: 'pending',
        },
        {
          name: 'dueDate',
          type: 'date',
        },
        {
          name: 'completedDate',
          type: 'date',
        },
      ],
      admin: {
        description: 'Payment milestones for the escrow agreement',
      },
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media' as const,
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Contract', value: 'contract' },
            { label: 'Invoice', value: 'invoice' },
            { label: 'Shipping Document', value: 'shipping' },
            { label: 'Insurance', value: 'insurance' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'uploadedBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            readOnly: true,
          },
        },
      ],
      admin: {
        description: 'Supporting documents for the escrow agreement',
      },
    },
    {
      name: 'disputeReason',
      type: 'textarea',
      admin: {
        condition: (data) => data.status === 'disputed',
        description: 'Reason for dispute (only visible when status is disputed)',
      },
    },
    {
      name: 'resolutionNotes',
      type: 'richText',
      admin: {
        condition: (data) => ['disputed', 'completed', 'cancelled'].includes(data.status),
        description: 'Notes about dispute resolution or completion',
      },
    },
    // Audit fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'lastModifiedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user) {
          if (!data.id) {
            // Creating new document
            data.createdBy = req.user.id
          }
          // Always update lastModifiedBy
          data.lastModifiedBy = req.user.id
        }
        return data
      },
    ],
  },
  timestamps: true,
}

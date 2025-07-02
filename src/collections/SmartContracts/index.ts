import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const SmartContracts: CollectionConfig = {
  slug: 'smart-contracts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access since this is demo content
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'version', 'contractType', 'status', 'updatedAt'],
    group: 'IntelliTrade',
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
      name: 'version',
      type: 'text',
      admin: {
        description: 'Semantic versioning (e.g., 1.0.0)',
      },
    },
    {
      name: 'contractType',
      type: 'select',
      options: [
        { label: 'Export Escrow', value: 'export-escrow' },
        { label: 'Trade Finance', value: 'trade-finance' },
        { label: 'Supply Chain', value: 'supply-chain' },
        { label: 'Letter of Credit', value: 'letter-of-credit' },
        { label: 'Insurance', value: 'insurance' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'templateOrInstance',
      type: 'select',
      options: [
        { label: 'Template', value: 'template' },
        { label: 'Instance', value: 'instance' },
      ],
      defaultValue: 'template',
      required: true,
    },
    {
      name: 'associatedTransaction',
      type: 'relationship',
      relationTo: 'export-transactions',
      admin: {
        condition: (data) => data?.templateOrInstance === 'instance',
      },
    },
    {
      name: 'parentTemplate',
      type: 'relationship',
      relationTo: 'smart-contracts' as any,
      admin: {
        condition: (data) => data?.templateOrInstance === 'instance',
        description: 'The template this contract instance is based on',
      },
    },
    {
      name: 'blockchainNetwork',
      type: 'select',
      options: [
        { label: 'Ethereum Mainnet', value: 'ethereum-mainnet' },
        { label: 'Ethereum Goerli', value: 'ethereum-goerli' },
        { label: 'Polygon', value: 'polygon' },
        { label: 'Avalanche', value: 'avalanche' },
        { label: 'Arbitrum', value: 'arbitrum' },
        { label: 'Optimism', value: 'optimism' },
        { label: 'Local Development', value: 'local' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'contractAddress',
      type: 'text',
      admin: {
        description: 'The blockchain address where this contract is deployed',
      },
    },
    {
      name: 'sourceCode',
      type: 'textarea',
      admin: {
        description: 'Solidity source code',
      },
    },
    {
      name: 'abiInterface',
      type: 'textarea',
      admin: {
        description: 'ABI JSON interface',
      },
    },
    {
      name: 'deploymentDate',
      type: 'date',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Deployed', value: 'deployed' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Terminated', value: 'terminated' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'auditInformation',
      type: 'textarea',
      admin: {
        description: 'Information about security audits performed on this contract',
      },
    },
    {
      name: 'deploymentTransaction',
      type: 'text',
      admin: {
        description: 'Transaction hash of the deployment transaction',
      },
    },
    {
      name: 'gasUsed',
      type: 'number',
      admin: {
        description: 'Gas used for deployment',
      },
    },
    {
      name: 'parameters',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'dataType',
          type: 'select',
          dbName: 'param_data_type',
          options: [
            { label: 'Address', value: 'address' },
            { label: 'Uint256', value: 'uint256' },
            { label: 'String', value: 'string' },
            { label: 'Boolean', value: 'bool' },
            { label: 'Bytes32', value: 'bytes32' },
            { label: 'Array', value: 'array' },
            { label: 'Struct', value: 'struct' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
    {
      name: 'events',
      type: 'array',
      fields: [
        {
          name: 'eventName',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'emittedAt',
          type: 'date',
        },
        {
          name: 'transactionHash',
          type: 'text',
        },
        {
          name: 'blockNumber',
          type: 'number',
        },
        {
          name: 'parameters',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    ...slugField(),
  ],
}

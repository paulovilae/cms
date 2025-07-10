import { BusinessSearchConfig } from '../../types/business-config.types'

/**
 * IntelliTrade-specific search configuration
 * Focused on trade finance, blockchain verification, company relationships,
 * and contract status tracking
 */
export const intellitradeSearchConfig: BusinessSearchConfig = {
  searchFields: [
    // Contract information fields with high weights
    { name: 'title', weight: 2.5, boost: 'exact' },
    { name: 'productDescription', weight: 2.0, type: 'richText' },
    { name: 'contractTerms', weight: 1.8, type: 'richText' },

    // Company relationship fields with high weights
    { name: 'exporter.name', weight: 2.2, type: 'relationship' },
    { name: 'importer.name', weight: 2.2, type: 'relationship' },

    // Shipping and logistics fields with medium weights
    { name: 'route.name', weight: 1.5, type: 'relationship' },
    { name: 'shippingTerms', weight: 1.3 },
    { name: 'destination', weight: 1.2 },
    { name: 'origin', weight: 1.2 },

    // Financial fields with medium weights
    { name: 'contractValue', weight: 1.4, type: 'number' },
    { name: 'paymentTerms', weight: 1.3 },

    // Verification fields
    { name: 'verificationStatus', weight: 1.0 },
    { name: 'blockchainHash', weight: 0.8 },
  ],

  filters: [
    // Company filters
    {
      key: 'exporter',
      label: 'Exporter',
      type: 'relationship',
      relationTo: 'companies',
      fieldPath: 'exporter',
    },
    {
      key: 'importer',
      label: 'Importer',
      type: 'relationship',
      relationTo: 'companies',
      fieldPath: 'importer',
    },

    // Route and shipping filters
    {
      key: 'route',
      label: 'Shipping Route',
      type: 'relationship',
      relationTo: 'routes',
      fieldPath: 'route',
    },
    {
      key: 'shippingTerms',
      label: 'Shipping Terms',
      type: 'select',
      options: [
        { label: 'FOB', value: 'fob' },
        { label: 'CIF', value: 'cif' },
        { label: 'EXW', value: 'exw' },
        { label: 'DAP', value: 'dap' },
        { label: 'DDP', value: 'ddp' },
      ],
      fieldPath: 'shippingTerms',
    },

    // Financial filters
    {
      key: 'contractValue',
      label: 'Contract Value',
      type: 'range',
      min: 0,
      max: 10000000,
      step: 50000,
      unit: '$',
      fieldPath: 'contractValue',
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        { label: 'Advance Payment', value: 'advance' },
        { label: 'Net 30', value: 'net30' },
        { label: 'Net 60', value: 'net60' },
        { label: 'Net 90', value: 'net90' },
        { label: 'Letter of Credit', value: 'loc' },
      ],
      fieldPath: 'paymentTerms',
    },

    // Verification status filter
    {
      key: 'verificationStatus',
      label: 'Verification Status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Verified', value: 'verified' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'In Progress', value: 'inProgress' },
      ],
      fieldPath: 'verificationStatus',
    },

    // Date range filter for contract creation
    {
      key: 'createdAt',
      label: 'Contract Date',
      type: 'dateRange',
      fieldPath: 'createdAt',
    },
  ],

  actions: [
    {
      id: 'view',
      label: 'View Contract',
      icon: 'Eye',
      requiresSelection: true,
      handler: 'viewContract',
      permission: ({ user }) => !!user,
    },
    {
      id: 'edit',
      label: 'Edit Contract',
      icon: 'Edit',
      requiresSelection: true,
      handler: 'editContract',
      permission: ({ user, item }) =>
        !!user && (user.role === 'admin' || user.id === item.createdBy),
    },
    {
      id: 'verifyContract',
      label: 'Verify Contract',
      icon: 'CheckCircle',
      requiresSelection: true,
      handler: 'verifyContract',
      permission: ({ user, item }) =>
        !!user && user.role === 'verifier' && item.verificationStatus === 'pending',
      dynamicLabel: (item) => {
        if (item.verificationStatus === 'verified') return 'Contract Verified'
        if (item.verificationStatus === 'rejected') return 'Verification Rejected'
        return 'Verify Contract'
      },
    },
    {
      id: 'viewBlockchainRecord',
      label: 'View Blockchain Record',
      icon: 'Link',
      requiresSelection: true,
      handler: 'viewBlockchainRecord',
      permission: ({ user, item }) => !!user && !!item.blockchainHash,
    },
    {
      id: 'downloadContractPdf',
      label: 'Download PDF',
      icon: 'Download',
      requiresSelection: true,
      handler: 'downloadContractPdf',
      permission: ({ user }) => !!user,
    },
  ],

  previewConfig: {
    layout: 'card',
    fields: [
      {
        key: 'title',
        label: 'Contract Title',
        formatter: 'highlightMatch',
        typographyVariant: 'h3',
        highlightMatches: true,
      },
      {
        key: 'exporter.name',
        label: 'Exporter',
        formatter: 'relationship',
        typographyVariant: 'body1',
      },
      {
        key: 'importer.name',
        label: 'Importer',
        formatter: 'relationship',
        typographyVariant: 'body1',
      },
      {
        key: 'contractValue',
        label: 'Contract Value',
        formatter: 'currency',
        typographyVariant: 'h4',
      },
      {
        key: 'route.name',
        label: 'Shipping Route',
        formatter: 'relationship',
        typographyVariant: 'body2',
      },
      {
        key: 'shippingTerms',
        label: 'Shipping Terms',
        formatter: 'text',
        typographyVariant: 'body2',
      },
      {
        key: 'verificationStatus',
        label: 'Verification Status',
        formatter: 'badge',
        statusColors: {
          pending: 'yellow',
          verified: 'green',
          rejected: 'red',
          inProgress: 'blue',
        },
      },
      {
        key: 'createdAt',
        label: 'Contract Date',
        formatter: 'date',
        typographyVariant: 'body2',
      },
      {
        key: 'blockchainHash',
        label: 'Blockchain Verification',
        formatter: 'truncatedHash',
        typographyVariant: 'body2',
      },
    ],
    thumbnail: {
      field: 'exporter.logo',
      fallback: '/images/default-exporter-logo.png',
      width: 64,
      height: 64,
      alt: 'Exporter Logo',
    },
  },

  aiPromptCustomizations: {
    systemPrompt:
      'You are a trade finance assistant helping to find contracts, export transactions, and company information. ' +
      'You understand international shipping terms, blockchain verification, and trade finance terminology.',

    queryEnhancement:
      'Given the user\'s search query "{query}" about trade contracts, expand this into a more comprehensive search. ' +
      'Consider exporters, importers, shipping routes, contract types, and verification statuses that might be relevant. ' +
      'If shipping terms abbreviations are used (like "FOB" or "CIF"), include both the abbreviation and full term.',

    contextData: {
      entityType: 'trade contract',
      terminology: {
        fob: 'Free On Board',
        cif: 'Cost, Insurance, and Freight',
        exw: 'Ex Works',
        dap: 'Delivered At Place',
        ddp: 'Delivered Duty Paid',
        loc: 'Letter of Credit',
        'b/l': 'Bill of Lading',
        'l/c': 'Letter of Credit',
        incoterms: 'International Commercial Terms',
        kyc: 'Know Your Customer',
      },
      shippingTerms: ['FOB', 'CIF', 'EXW', 'DAP', 'DDP'],
      verificationStatuses: ['pending', 'verified', 'rejected', 'in progress'],
    },

    suggestionPrompt:
      "Based on the user's search for '{query}' related to trade contracts, suggest 3-5 related searches that might help them find relevant contracts. " +
      'Consider related exporters, importers, shipping routes, or payment terms.',
  },
}

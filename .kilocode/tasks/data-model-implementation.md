# IntelliTrade Data Model Implementation Guide

This document provides the specific code changes needed to implement the enhanced data models for the IntelliTrade CMS. It includes code for updating existing collections and creating new collections.

## 1. Update Companies Collection

Replace the content of `src/collections/Companies/index.ts` with:

```typescript
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const Companies: CollectionConfig = {
  slug: 'companies',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'country', 'updatedAt'],
    group: 'IntelliTrade', // Changed from 'Demo Content'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Exporter', value: 'exporter' },
        { label: 'Importer', value: 'importer' },
        { label: 'Both', value: 'both' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    // Address Information
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'streetAddress',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'stateProvince',
          type: 'text',
        },
        {
          name: 'postalCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'gpsCoordinates',
          type: 'text',
          admin: {
            description: 'Format: latitude,longitude (e.g., 34.0522,-118.2437)',
          },
        },
      ],
    },
    // Contact Information
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'primaryPhone',
          type: 'text',
        },
        {
          name: 'alternatePhone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'contactPerson',
          type: 'text',
        },
        {
          name: 'contactPosition',
          type: 'text',
        },
      ],
    },
    // Business Details
    {
      name: 'businessDetails',
      type: 'group',
      fields: [
        {
          name: 'registrationNumber',
          type: 'text',
        },
        {
          name: 'taxId',
          type: 'text',
        },
        {
          name: 'yearEstablished',
          type: 'number',
        },
        {
          name: 'industrySector',
          type: 'select',
          options: [
            { label: 'Agriculture', value: 'agriculture' },
            { label: 'Manufacturing', value: 'manufacturing' },
            { label: 'Food Processing', value: 'food-processing' },
            { label: 'Textiles', value: 'textiles' },
            { label: 'Electronics', value: 'electronics' },
            { label: 'Pharmaceuticals', value: 'pharmaceuticals' },
            { label: 'Automotive', value: 'automotive' },
            { label: 'Commodities', value: 'commodities' },
            { label: 'Retail', value: 'retail' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'employeeCount',
          type: 'number',
        },
        {
          name: 'annualRevenue',
          type: 'number',
          admin: {
            description: 'Annual revenue in USD',
          },
        },
        {
          name: 'certifications',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'issuingBody',
              type: 'text',
            },
            {
              name: 'issueDate',
              type: 'date',
            },
            {
              name: 'expiryDate',
              type: 'date',
            },
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Full URL including https://',
      },
    },
    ...slugField(),
  ],
}
```

## 2. Update Export Transactions Collection

Replace the content of `src/collections/ExportTransactions/index.ts` with:

```typescript
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const ExportTransactions: CollectionConfig = {
  slug: 'export-transactions',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'exporter', 'importer', 'status', 'updatedAt'],
    group: 'IntelliTrade', // Changed from 'Demo Content'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'contractAddress',
      type: 'text',
      admin: {
        description: 'The blockchain address of the smart contract',
      },
    },
    {
      name: 'exporter',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      admin: {
        description: 'Select a company with type "exporter" or "both"',
      },
    },
    {
      name: 'importer',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      admin: {
        description: 'Select a company with type "importer" or "both"',
      },
    },
    // Product Details
    {
      name: 'productDetails',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Agricultural Products', value: 'agricultural' },
            { label: 'Food and Beverages', value: 'food-beverages' },
            { label: 'Textiles and Apparel', value: 'textiles' },
            { label: 'Raw Materials', value: 'raw-materials' },
            { label: 'Electronics', value: 'electronics' },
            { label: 'Machinery', value: 'machinery' },
            { label: 'Pharmaceuticals', value: 'pharmaceuticals' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'unitOfMeasurement',
          type: 'select',
          options: [
            { label: 'Metric Tons', value: 'mt' },
            { label: 'Kilograms', value: 'kg' },
            { label: 'Pounds', value: 'lb' },
            { label: 'Units', value: 'units' },
            { label: 'Barrels', value: 'barrels' },
            { label: 'Cubic Meters', value: 'cbm' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'weight',
          type: 'number',
        },
        {
          name: 'weightUnit',
          type: 'select',
          options: [
            { label: 'Kilograms', value: 'kg' },
            { label: 'Pounds', value: 'lb' },
            { label: 'Metric Tons', value: 'mt' },
          ],
          defaultValue: 'kg',
        },
        {
          name: 'dimensions',
          type: 'text',
          admin: {
            description: 'Format: length x width x height (e.g., 120cm x 80cm x 100cm)',
          },
        },
        {
          name: 'hazardousClassification',
          type: 'text',
        },
      ],
    },
    // Route Information
    {
      name: 'routeInformation',
      type: 'group',
      fields: [
        {
          name: 'route',
          type: 'relationship',
          relationTo: 'routes',
        },
        {
          name: 'originPort',
          type: 'text',
          required: true,
        },
        {
          name: 'destinationPort',
          type: 'text',
          required: true,
        },
        {
          name: 'estimatedDepartureDate',
          type: 'date',
        },
        {
          name: 'estimatedArrivalDate',
          type: 'date',
        },
        {
          name: 'actualDepartureDate',
          type: 'date',
        },
        {
          name: 'actualArrivalDate',
          type: 'date',
        },
        {
          name: 'transitTime',
          type: 'number',
          admin: {
            description: 'Transit time in days',
          },
        },
      ],
    },
    // Shipping Details
    {
      name: 'shippingDetails',
      type: 'group',
      fields: [
        {
          name: 'carrier',
          type: 'text',
        },
        {
          name: 'vesselName',
          type: 'text',
        },
        {
          name: 'voyageNumber',
          type: 'text',
        },
        {
          name: 'containerNumbers',
          type: 'array',
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: '20ft Standard', value: '20ft-standard' },
                { label: '40ft Standard', value: '40ft-standard' },
                { label: '40ft High Cube', value: '40ft-high-cube' },
                { label: 'Refrigerated', value: 'reefer' },
                { label: 'Open Top', value: 'open-top' },
                { label: 'Flat Rack', value: 'flat-rack' },
                { label: 'Other', value: 'other' },
              ],
            },
          ],
        },
        {
          name: 'sealNumbers',
          type: 'array',
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Carrier Seal', value: 'carrier' },
                { label: 'Shipper Seal', value: 'shipper' },
                { label: 'Customs Seal', value: 'customs' },
                { label: 'Other', value: 'other' },
              ],
            },
          ],
        },
        {
          name: 'shipmentType',
          type: 'select',
          options: [
            { label: 'Full Container Load (FCL)', value: 'fcl' },
            { label: 'Less than Container Load (LCL)', value: 'lcl' },
            { label: 'Break Bulk', value: 'break-bulk' },
            { label: 'Bulk', value: 'bulk' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'incoterms',
          type: 'select',
          options: [
            { label: 'FOB - Free On Board', value: 'fob' },
            { label: 'CIF - Cost, Insurance, Freight', value: 'cif' },
            { label: 'CFR - Cost and Freight', value: 'cfr' },
            { label: 'EXW - Ex Works', value: 'exw' },
            { label: 'DAP - Delivered at Place', value: 'dap' },
            { label: 'DDP - Delivered Duty Paid', value: 'ddp' },
            { label: 'FCA - Free Carrier', value: 'fca' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'fob',
        },
        {
          name: 'insuranceProvider',
          type: 'text',
        },
        {
          name: 'insuranceValue',
          type: 'number',
        },
      ],
    },
    // Document References
    {
      name: 'documentReferences',
      type: 'group',
      fields: [
        {
          name: 'commercialInvoice',
          type: 'text',
          admin: {
            description: 'Commercial invoice number',
          },
        },
        {
          name: 'billOfLading',
          type: 'text',
          admin: {
            description: 'Bill of lading number',
          },
        },
        {
          name: 'packingList',
          type: 'text',
          admin: {
            description: 'Packing list reference',
          },
        },
        {
          name: 'certificateOfOrigin',
          type: 'text',
          admin: {
            description: 'Certificate of origin reference',
          },
        },
        {
          name: 'insurancePolicy',
          type: 'text',
          admin: {
            description: 'Insurance policy number',
          },
        },
        {
          name: 'inspectionCertificate',
          type: 'text',
          admin: {
            description: 'Inspection certificate reference',
          },
        },
        {
          name: 'exportLicense',
          type: 'text',
          admin: {
            description: 'Export license number',
          },
        },
        {
          name: 'importLicense',
          type: 'text',
          admin: {
            description: 'Import license number',
          },
        },
        {
          name: 'customsDeclaration',
          type: 'text',
          admin: {
            description: 'Customs declaration number',
          },
        },
        {
          name: 'documents',
          type: 'array',
          fields: [
            {
              name: 'documentType',
              type: 'select',
              options: [
                { label: 'Commercial Invoice', value: 'commercial-invoice' },
                { label: 'Bill of Lading', value: 'bill-of-lading' },
                { label: 'Packing List', value: 'packing-list' },
                { label: 'Certificate of Origin', value: 'certificate-of-origin' },
                { label: 'Insurance Policy', value: 'insurance-policy' },
                { label: 'Inspection Certificate', value: 'inspection-certificate' },
                { label: 'Export License', value: 'export-license' },
                { label: 'Import License', value: 'import-license' },
                { label: 'Customs Declaration', value: 'customs-declaration' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
            {
              name: 'referenceNumber',
              type: 'text',
            },
            {
              name: 'issueDate',
              type: 'date',
            },
            {
              name: 'issuer',
              type: 'text',
            },
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'verificationStatus',
              type: 'select',
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Verified', value: 'verified' },
                { label: 'Rejected', value: 'rejected' },
              ],
              defaultValue: 'pending',
            },
          ],
        },
      ],
    },
    {
      name: 'product',
      type: 'text',
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
        { label: 'USD', value: 'usd' },
        { label: 'USDC', value: 'usdc' },
        { label: 'USDT', value: 'usdt' },
      ],
      defaultValue: 'usdc',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Created', value: 'created' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'created',
    },
    {
      name: 'verificationSteps',
      type: 'array',
      fields: [
        {
          name: 'stepName',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Verified', value: 'verified' },
            { label: 'Failed', value: 'failed' },
            { label: 'Disputed', value: 'disputed' },
          ],
          defaultValue: 'pending',
        },
        {
          name: 'verifiedBy',
          type: 'text',
        },
        {
          name: 'timestamp',
          type: 'date',
        },
        {
          name: 'paymentReleased',
          type: 'number',
          admin: {
            description: 'Percentage of total payment released at this step',
          },
        },
        // New fields
        {
          name: 'location',
          type: 'text',
          admin: {
            description: 'Location where verification occurred',
          },
        },
        {
          name: 'gpsCoordinates',
          type: 'text',
          admin: {
            description: 'Format: latitude,longitude (e.g., 34.0522,-118.2437)',
          },
        },
        {
          name: 'evidenceType',
          type: 'select',
          options: [
            { label: 'Photo', value: 'photo' },
            { label: 'GPS', value: 'gps' },
            { label: 'Document', value: 'document' },
            { label: 'Multiple', value: 'multiple' },
          ],
        },
        {
          name: 'evidence',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
        },
        {
          name: 'dataPoints',
          type: 'array',
          fields: [
            {
              name: 'dataType',
              type: 'select',
              options: [
                { label: 'Temperature', value: 'temperature' },
                { label: 'Humidity', value: 'humidity' },
                { label: 'Weight', value: 'weight' },
                { label: 'Location', value: 'location' },
                { label: 'Document Hash', value: 'document-hash' },
                { label: 'Timestamp', value: 'timestamp' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
            {
              name: 'unit',
              type: 'text',
            },
            {
              name: 'source',
              type: 'text',
              admin: {
                description: 'Source of this data point (e.g., IoT sensor, GPS device)',
              },
            },
            {
              name: 'timestamp',
              type: 'date',
            },
          ],
        },
        {
          name: 'verificationMethod',
          type: 'select',
          options: [
            { label: 'Automated Oracle', value: 'automated-oracle' },
            { label: 'Manual Oracle', value: 'manual-oracle' },
            { label: 'Document Verification', value: 'document-verification' },
            { label: 'Blockchain Consensus', value: 'blockchain-consensus' },
            { label: 'Multi-signature', value: 'multi-signature' },
          ],
        },
        {
          name: 'contractCode',
          type: 'textarea',
          admin: {
            description: 'Smart contract code for this verification step',
          },
        },
        {
          name: 'oracleInteraction',
          type: 'textarea',
          admin: {
            description: 'Oracle interaction code for this verification step',
          },
        },
        {
          name: 'transactionHash',
          type: 'text',
          admin: {
            description: 'Blockchain transaction hash for this verification',
          },
        },
      ],
      admin: {
        initCollapsed: false,
      },
    },
    {
      name: 'smartContractCode',
      type: 'textarea',
      admin: {
        description: 'Complete smart contract code',
      },
    },
    ...slugField(),
  ],
}
```

## 3. Create Routes Collection

Create a new file `src/collections/Routes/index.ts` with:

```typescript
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const Routes: CollectionConfig = {
  slug: 'routes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'originPort', 'destinationPort', 'transportMode', 'updatedAt'],
    group: 'IntelliTrade',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'originCountry',
      type: 'text',
      required: true,
    },
    {
      name: 'originPort',
      type: 'text',
      required: true,
    },
    {
      name: 'destinationCountry',
      type: 'text',
      required: true,
    },
    {
      name: 'destinationPort',
      type: 'text',
      required: true,
    },
    {
      name: 'transitPorts',
      type: 'array',
      fields: [
        {
          name: 'portName',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'estimatedDaysFromOrigin',
          type: 'number',
        },
        {
          name: 'services',
          type: 'select',
          options: [
            { label: 'Transshipment', value: 'transshipment' },
            { label: 'Customs Clearance', value: 'customs' },
            { label: 'Inspection', value: 'inspection' },
            { label: 'Container Handling', value: 'container-handling' },
            { label: 'Other', value: 'other' },
          ],
          hasMany: true,
        },
      ],
    },
    {
      name: 'estimatedTransitTime',
      type: 'number',
      admin: {
        description: 'Total transit time in days',
      },
    },
    {
      name: 'distance',
      type: 'number',
      admin: {
        description: 'Distance in nautical miles',
      },
    },
    {
      name: 'transportMode',
      type: 'select',
      options: [
        { label: 'Ocean Freight', value: 'ocean' },
        { label: 'Ocean Freight', value: 'ocean' },
        { label: 'Air Freight', value: 'air' },
        { label: 'Road Transport', value: 'road' },
        { label: 'Rail Transport', value: 'rail' },
        { label: 'Multimodal', value: 'multimodal' },
      ],
      required: true,
    },
    {
      name: 'carriers',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'service',
          type: 'text',
        },
        {
          name: 'frequency',
          type: 'text',
          admin: {
            description: 'How often this carrier serves this route (e.g., weekly, bi-weekly)',
          },
        },
      ],
    },
    {
      name: 'frequencyOfService',
      type: 'text',
      admin: {
        description: 'How often ships/vehicles depart on this route (e.g., daily, weekly)',
      },
    },
    {
      name: 'averageCost',
      type: 'number',
      admin: {
        description: 'Average cost in USD for standard container/shipment',
      },
    },
    {
      name: 'riskLevel',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
    },
    ...slugField(),
  ],
}
```

## 4. Create Smart Contracts Collection

Create a new file `src/collections/SmartContracts/index.ts` with:

```typescript
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const SmartContracts: CollectionConfig = {
  slug: 'smart-contracts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
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
      relationTo: 'smart-contracts',
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
```

## 5. Update Payload Config

Update `src/payload.config.ts` to include the new collections:

1. Import the new collections at the top of the file:

```typescript
import { Routes } from './collections/Routes'
import { SmartContracts } from './collections/SmartContracts'
```

2. Add them to the collections array in the Payload config:

```typescript
collections: [
  Pages,
  Posts,
  Media,
  Categories,
  Users,
  TeamMembers,
  Testimonials,
  Features,
  PricingPlans,
  Companies, 
  ExportTransactions,
  Routes, // Add new Routes collection
  SmartContracts, // Add new SmartContracts collection
  {
    slug: 'redirects',
    // ...rest of redirects config
  }
],
```

## 6. Update Seed Data

### 6.1 Update Companies Seed Data

Update `src/endpoints/seed/companies.ts` to include the additional fields:

```typescript
import type { Payload } from 'payload'

export const seedCompanies = async (payload: Payload): Promise<Record<string, any>> => {
  const existingDocs = await payload.find({
    collection: 'companies',
    limit: 1,
  })

  // Return map of company names to IDs for reference in other seed functions
  const companyMap: Record<string, any> = {}

  if (existingDocs.docs.length === 0) {
    // Create exporters
    const donHugo = await payload.create({
      collection: 'companies',
      data: {
        name: 'Don Hugo Farms',
        type: 'exporter',
        description:
          'Premium peanut producer from Argentina specializing in high-quality peanut cultivation using sustainable farming practices.',
        country: 'Argentina',
        slug: 'don-hugo-farms',
        address: {
          streetAddress: 'Ruta Provincial 18, Km 15',
          city: 'Córdoba',
          stateProvince: 'Córdoba',
          postalCode: '5000',
          country: 'Argentina',
          gpsCoordinates: '-31.4201,-64.1888',
        },
        contactInfo: {
          primaryPhone: '+54 351 555 7890',
          alternatePhone: '+54 351 555 7891',
          email: 'info@donhugofarms.com',
          contactPerson: 'Hugo Martínez',
          contactPosition: 'Export Manager',
        },
        businessDetails: {
          registrationNumber: 'ARG-2010-45678',
          taxId: '30-71234567-8',
          yearEstablished: 1995,
          industrySector: 'agriculture',
          employeeCount: 120,
          annualRevenue: 3500000,
          certifications: [
            {
              name: 'Global GAP',
              issuingBody: 'FoodPLUS GmbH',
              issueDate: '2024-01-15',
              expiryDate: '2026-01-14',
            },
            {
              name: 'Organic Certification',
              issuingBody: 'Argentina Organic',
              issueDate: '2024-02-10',
              expiryDate: '2025-02-09',
            },
          ],
        },
        website: 'https://www.donhugofarms.com',
      },
    })
    companyMap['Don Hugo Farms'] = donHugo.id

    const colombianCoffee = await payload.create({
      collection: 'companies',
      data: {
        name: 'Colombian Coffee Cooperative',
        type: 'exporter',
        description:
          'Farmer-owned cooperative producing premium Arabica coffee beans using traditional growing methods.',
        country: 'Colombia',
        slug: 'colombian-coffee-cooperative',
        address: {
          streetAddress: 'Carrera 12 #85-34',
          city: 'Medellín',
          stateProvince: 'Antioquia',
          postalCode: '050022',
          country: 'Colombia',
          gpsCoordinates: '6.2476,-75.5658',
        },
        contactInfo: {

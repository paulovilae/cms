import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const ExportTransactions: CollectionConfig = {
  slug: 'export-transactions',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access since this is demo content
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
          dbName: 'product_category',
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
          dbName: 'unit_measure',
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
          dbName: 'weight_unit',
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
          type: 'text',
          admin: {
            description:
              'Will be converted to a relationship when Routes collection is implemented',
          },
          // Will be updated to use relationship when Routes collection is implemented
          // type: 'relationship',
          // relationTo: 'routes',
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
              dbName: 'cont_type',
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
              dbName: 'seal_type',
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
          dbName: 'shipment_type',
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
          dbName: 'incoterms',
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
              dbName: 'doc_type',
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
              dbName: 'verify_status',
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
      dbName: 'currency',
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
      dbName: 'tx_status',
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
          dbName: 'verification_status',
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
          dbName: 'evidence_type',
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
              dbName: 'data_point_type',
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
          dbName: 'verify_method',
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

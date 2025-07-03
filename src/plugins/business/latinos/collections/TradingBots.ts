import { CollectionConfig } from 'payload/types'

export const TradingBots: CollectionConfig = {
  slug: 'trading-bots',
  admin: {
    useAsTitle: 'name',
    group: 'Latinos Trading',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Unique name for this trading bot',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Stopped', value: 'stopped' },
        { label: 'Error', value: 'error' },
      ],
      defaultValue: 'stopped',
    },
    {
      name: 'strategy',
      type: 'relationship',
      relationTo: 'trading-strategies',
      required: true,
    },
    {
      name: 'symbol',
      type: 'text',
      required: true,
      admin: {
        description: 'Trading symbol (e.g., AAPL, BTC-USD)',
      },
    },
    {
      name: 'exchange',
      type: 'select',
      options: [
        { label: 'NASDAQ', value: 'NASDAQ' },
        { label: 'NYSE', value: 'NYSE' },
        { label: 'AMEX', value: 'AMEX' },
        { label: 'Crypto', value: 'CRYPTO' },
      ],
      defaultValue: 'NASDAQ',
    },
    {
      name: 'investmentAmount',
      type: 'number',
      required: true,
      min: 100,
      admin: {
        description: 'Amount to invest per trade (USD)',
      },
    },
    {
      name: 'riskLevel',
      type: 'select',
      options: [
        { label: 'Conservative', value: 'conservative' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Aggressive', value: 'aggressive' },
      ],
      defaultValue: 'moderate',
    },
    {
      name: 'maxDailyTrades',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 50,
    },
    {
      name: 'stopLossPercentage',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 20,
      admin: {
        description: 'Stop loss percentage (1-20%)',
      },
    },
    {
      name: 'takeProfitPercentage',
      type: 'number',
      defaultValue: 10,
      min: 2,
      max: 50,
      admin: {
        description: 'Take profit percentage (2-50%)',
      },
    },
    {
      name: 'microserviceId',
      type: 'text',
      admin: {
        description: 'ID in the Python microservice',
        readOnly: true,
      },
    },
    {
      name: 'lastExecution',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalTrades',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'successfulTrades',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalProfit',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }: { data: any; req: any; operation: 'create' | 'update' }) => {
        // Sync with Python microservice when bot is created/updated
        if (operation === 'create' || operation === 'update') {
          // Call microservice API to create/update formula
          // Store microservice ID in microserviceId field
        }
      },
    ],
    afterDelete: [
      async ({ doc }: { doc: any }) => {
        // Clean up microservice formula when bot is deleted
        if (doc && doc.microserviceId) {
          // Call microservice API to delete formula
        }
      },
    ],
  },
}

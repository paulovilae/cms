import { CollectionConfig } from 'payload/types'

export const MarketData: CollectionConfig = {
  slug: 'market-data',
  admin: {
    useAsTitle: 'symbol',
    group: 'Latinos Trading',
  },
  fields: [
    {
      name: 'symbol',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'currentPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'volume',
      type: 'number',
    },
    {
      name: 'change24h',
      type: 'number',
    },
    {
      name: 'changePercent24h',
      type: 'number',
    },
    {
      name: 'high24h',
      type: 'number',
    },
    {
      name: 'low24h',
      type: 'number',
    },
    {
      name: 'marketCap',
      type: 'number',
    },
    {
      name: 'lastUpdated',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}

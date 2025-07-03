import { CollectionConfig } from 'payload/types'

export const TradingTrades: CollectionConfig = {
  slug: 'trading-trades',
  admin: {
    useAsTitle: 'id',
    group: 'Latinos Trading',
    defaultColumns: ['bot', 'symbol', 'side', 'quantity', 'price', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'bot',
      type: 'relationship',
      relationTo: 'trading-bots',
      required: true,
    },
    {
      name: 'symbol',
      type: 'text',
      required: true,
    },
    {
      name: 'side',
      type: 'select',
      options: [
        { label: 'Buy', value: 'buy' },
        { label: 'Sell', value: 'sell' },
      ],
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Filled', value: 'filled' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Rejected', value: 'rejected' },
      ],
      required: true,
    },
    {
      name: 'stopLoss',
      type: 'number',
      min: 0,
    },
    {
      name: 'takeProfit',
      type: 'number',
      min: 0,
    },
    {
      name: 'filledAt',
      type: 'date',
    },
    {
      name: 'profit',
      type: 'number',
      admin: {
        description: 'Profit/Loss for this trade',
      },
    },
    {
      name: 'isSuccessful',
      type: 'checkbox',
    },
    {
      name: 'microserviceTradeId',
      type: 'text',
      admin: {
        description: 'Trade ID from Python microservice',
      },
    },
  ],
}

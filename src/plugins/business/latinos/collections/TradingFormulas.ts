import { CollectionConfig } from 'payload/types'

export const TradingFormulas: CollectionConfig = {
  slug: 'trading-formulas',
  admin: {
    useAsTitle: 'name',
    group: 'Latinos Trading',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bot',
      type: 'relationship',
      relationTo: 'trading-bots',
      required: true,
    },
    {
      name: 'interval',
      type: 'select',
      options: [
        { label: '1 Minute', value: '1m' },
        { label: '5 Minutes', value: '5m' },
        { label: '15 Minutes', value: '15m' },
        { label: '1 Hour', value: '1h' },
        { label: '1 Day', value: '1d' },
      ],
      required: true,
    },
    {
      name: 'parameters',
      type: 'json',
      admin: {
        description: 'Formula-specific parameters (RSI periods, MA lengths, etc.)',
      },
    },
    {
      name: 'conditions',
      type: 'array',
      fields: [
        {
          name: 'indicator',
          type: 'select',
          options: [
            { label: 'RSI', value: 'rsi' },
            { label: 'Moving Average', value: 'ma' },
            { label: 'MACD', value: 'macd' },
            { label: 'Bollinger Bands', value: 'bb' },
            { label: 'Volume', value: 'volume' },
          ],
        },
        {
          name: 'operator',
          type: 'select',
          options: [
            { label: 'Greater Than', value: 'gt' },
            { label: 'Less Than', value: 'lt' },
            { label: 'Crosses Above', value: 'cross_above' },
            { label: 'Crosses Below', value: 'cross_below' },
          ],
        },
        {
          name: 'value',
          type: 'number',
        },
        {
          name: 'action',
          type: 'select',
          options: [
            { label: 'Buy', value: 'buy' },
            { label: 'Sell', value: 'sell' },
            { label: 'Hold', value: 'hold' },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

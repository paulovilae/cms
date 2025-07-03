import { CollectionConfig } from 'payload/types'

export const TradingStrategies: CollectionConfig = {
  slug: 'trading-strategies',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'RSI Strategy', value: 'rsi' },
        { label: 'Moving Average Crossover', value: 'ma_crossover' },
        { label: 'MACD Strategy', value: 'macd' },
        { label: 'Bollinger Bands', value: 'bollinger' },
        { label: 'Custom', value: 'custom' },
      ],
      required: true,
    },
    {
      name: 'defaultParameters',
      type: 'json',
      admin: {
        description: 'Default parameters for this strategy type',
      },
    },
    {
      name: 'riskProfile',
      type: 'select',
      options: [
        { label: 'Conservative', value: 'conservative' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Aggressive', value: 'aggressive' },
      ],
    },
    {
      name: 'backtestResults',
      type: 'group',
      fields: [
        {
          name: 'totalReturn',
          type: 'number',
        },
        {
          name: 'sharpeRatio',
          type: 'number',
        },
        {
          name: 'maxDrawdown',
          type: 'number',
        },
        {
          name: 'winRate',
          type: 'number',
        },
      ],
    },
  ],
}

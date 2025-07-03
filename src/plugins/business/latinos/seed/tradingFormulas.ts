import type { Payload } from 'payload'

/**
 * Seed trading formulas with realistic sample data
 */
export const seedTradingFormulas = async (
  payload: Payload,
  botIds: string[],
): Promise<string[]> => {
  // Ensure we have enough bot IDs
  if (botIds.length < 8) {
    throw new Error('Not enough bot IDs provided for formula seeding')
  }

  const formulas = [
    {
      name: 'Apple RSI Formula',
      bot: parseInt(botIds[0]!), // Apple RSI Bot
      interval: '15m' as const,
      parameters: {
        rsiPeriod: 14,
        oversoldThreshold: 30,
        overboughtThreshold: 70,
        confirmationPeriods: 2,
      },
      conditions: [
        {
          indicator: 'rsi' as const,
          operator: 'lt' as const,
          value: 30,
          action: 'buy' as const,
        },
        {
          indicator: 'rsi' as const,
          operator: 'gt' as const,
          value: 70,
          action: 'sell' as const,
        },
      ],
      isActive: true,
    },
    {
      name: 'Google MA Crossover Formula',
      bot: parseInt(botIds[1]!), // Google MA Crossover
      interval: '1h' as const,
      parameters: {
        shortPeriod: 50,
        longPeriod: 200,
        confirmationVolume: true,
        minVolumeMultiplier: 1.5,
      },
      conditions: [
        {
          indicator: 'ma' as const,
          operator: 'cross_above' as const,
          value: 0,
          action: 'buy' as const,
        },
        {
          indicator: 'ma' as const,
          operator: 'cross_below' as const,
          value: 0,
          action: 'sell' as const,
        },
      ],
      isActive: true,
    },
    {
      name: 'Tesla MACD Formula',
      bot: parseInt(botIds[2]!), // Tesla MACD Momentum
      interval: '15m' as const,
      parameters: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        histogramThreshold: 0.1,
      },
      conditions: [
        {
          indicator: 'macd' as const,
          operator: 'cross_above' as const,
          value: 0,
          action: 'buy' as const,
        },
        {
          indicator: 'macd' as const,
          operator: 'cross_below' as const,
          value: 0,
          action: 'sell' as const,
        },
      ],
      isActive: false,
    },
    {
      name: 'NVIDIA Bollinger Formula',
      bot: parseInt(botIds[3]!), // NVIDIA Bollinger Squeeze
      interval: '1h' as const,
      parameters: {
        period: 20,
        standardDeviations: 2,
        squeezeThreshold: 0.1,
        breakoutConfirmation: true,
      },
      conditions: [
        {
          indicator: 'bb' as const,
          operator: 'lt' as const,
          value: 0.2,
          action: 'buy' as const,
        },
        {
          indicator: 'bb' as const,
          operator: 'gt' as const,
          value: 0.8,
          action: 'sell' as const,
        },
      ],
      isActive: true,
    },
    {
      name: 'Microsoft Multi-Timeframe Formula',
      bot: parseInt(botIds[4]!), // Multi-Timeframe Microsoft
      interval: '1h' as const,
      parameters: {
        timeframes: ['1h', '4h', '1d'],
        rsiPeriod: 14,
        confluenceRequired: 2,
        divergenceDetection: true,
      },
      conditions: [
        {
          indicator: 'rsi' as const,
          operator: 'lt' as const,
          value: 35,
          action: 'buy' as const,
        },
        {
          indicator: 'rsi' as const,
          operator: 'gt' as const,
          value: 65,
          action: 'sell' as const,
        },
      ],
      isActive: true,
    },
    {
      name: 'Amazon Scalping Formula',
      bot: parseInt(botIds[5]!), // Amazon Scalper
      interval: '5m' as const,
      parameters: {
        timeframe: '5m',
        profitTarget: 0.5,
        stopLoss: 0.3,
        maxHoldTime: 30,
        volumeFilter: true,
      },
      conditions: [
        {
          indicator: 'volume' as const,
          operator: 'gt' as const,
          value: 1.5,
          action: 'buy' as const,
        },
        {
          indicator: 'rsi' as const,
          operator: 'gt' as const,
          value: 80,
          action: 'sell' as const,
        },
      ],
      isActive: false,
    },
    {
      name: 'Bitcoin RSI Pro Formula',
      bot: parseInt(botIds[6]!), // Bitcoin RSI Pro
      interval: '1h' as const,
      parameters: {
        rsiPeriod: 14,
        oversoldThreshold: 25,
        overboughtThreshold: 75,
        confirmationPeriods: 3,
      },
      conditions: [
        {
          indicator: 'rsi' as const,
          operator: 'lt' as const,
          value: 25,
          action: 'buy' as const,
        },
        {
          indicator: 'rsi' as const,
          operator: 'gt' as const,
          value: 75,
          action: 'sell' as const,
        },
      ],
      isActive: true,
    },
    {
      name: 'Meta MACD Formula',
      bot: parseInt(botIds[7]!), // Meta MACD Trader
      interval: '15m' as const,
      parameters: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        histogramThreshold: 0.05,
      },
      conditions: [
        {
          indicator: 'macd' as const,
          operator: 'cross_above' as const,
          value: 0,
          action: 'buy' as const,
        },
        {
          indicator: 'macd' as const,
          operator: 'cross_below' as const,
          value: 0,
          action: 'sell' as const,
        },
      ],
      isActive: false,
    },
  ]

  const createdIds: string[] = []

  for (const formula of formulas) {
    try {
      const result = await payload.create({
        collection: 'trading-formulas',
        data: formula,
      })
      createdIds.push(String(result.id))
    } catch (error) {
      console.error(`Error creating formula ${formula.name}:`, error)
    }
  }

  return createdIds
}

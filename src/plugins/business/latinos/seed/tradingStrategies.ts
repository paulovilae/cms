import type { Payload } from 'payload'

/**
 * Seed trading strategies with realistic sample data
 */
export const seedTradingStrategies = async (payload: Payload): Promise<string[]> => {
  const strategies = [
    {
      name: 'RSI Oversold/Overbought',
      description:
        'Classic RSI strategy that buys when RSI is below 30 (oversold) and sells when RSI is above 70 (overbought). Conservative approach with proven track record.',
      type: 'rsi' as const,
      defaultParameters: {
        rsiPeriod: 14,
        oversoldThreshold: 30,
        overboughtThreshold: 70,
        confirmationPeriods: 2,
      },
      riskProfile: 'conservative' as const,
      backtestResults: {
        totalReturn: 18.5,
        sharpeRatio: 1.42,
        maxDrawdown: -8.3,
        winRate: 62.4,
      },
    },
    {
      name: 'Golden Cross MA Strategy',
      description:
        'Moving average crossover strategy using 50-day and 200-day moving averages. Generates buy signals when short MA crosses above long MA.',
      type: 'ma_crossover' as const,
      defaultParameters: {
        shortPeriod: 50,
        longPeriod: 200,
        confirmationVolume: true,
        minVolumeMultiplier: 1.5,
      },
      riskProfile: 'moderate' as const,
      backtestResults: {
        totalReturn: 24.7,
        sharpeRatio: 1.68,
        maxDrawdown: -12.1,
        winRate: 58.9,
      },
    },
    {
      name: 'MACD Momentum',
      description:
        'MACD-based momentum strategy focusing on signal line crossovers and histogram divergence. Excellent for trending markets.',
      type: 'macd' as const,
      defaultParameters: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        histogramThreshold: 0.1,
      },
      riskProfile: 'moderate' as const,
      backtestResults: {
        totalReturn: 31.2,
        sharpeRatio: 1.89,
        maxDrawdown: -15.7,
        winRate: 64.3,
      },
    },
    {
      name: 'Bollinger Band Squeeze',
      description:
        'Advanced Bollinger Bands strategy that identifies periods of low volatility followed by explosive moves. High-risk, high-reward approach.',
      type: 'bollinger' as const,
      defaultParameters: {
        period: 20,
        standardDeviations: 2,
        squeezeThreshold: 0.1,
        breakoutConfirmation: true,
      },
      riskProfile: 'aggressive' as const,
      backtestResults: {
        totalReturn: 45.8,
        sharpeRatio: 2.14,
        maxDrawdown: -22.4,
        winRate: 52.7,
      },
    },
    {
      name: 'Multi-Timeframe RSI',
      description:
        'Custom strategy combining RSI signals from multiple timeframes for higher accuracy. Uses 1H, 4H, and 1D RSI confluence.',
      type: 'custom' as const,
      defaultParameters: {
        timeframes: ['1h', '4h', '1d'],
        rsiPeriod: 14,
        confluenceRequired: 2,
        divergenceDetection: true,
      },
      riskProfile: 'moderate' as const,
      backtestResults: {
        totalReturn: 28.9,
        sharpeRatio: 1.76,
        maxDrawdown: -11.8,
        winRate: 67.2,
      },
    },
    {
      name: 'Scalping Quick Profits',
      description:
        'High-frequency scalping strategy for quick profits on small price movements. Requires tight risk management and fast execution.',
      type: 'custom' as const,
      defaultParameters: {
        timeframe: '5m',
        profitTarget: 0.5,
        stopLoss: 0.3,
        maxHoldTime: 30,
        volumeFilter: true,
      },
      riskProfile: 'aggressive' as const,
      backtestResults: {
        totalReturn: 52.3,
        sharpeRatio: 2.41,
        maxDrawdown: -18.9,
        winRate: 71.8,
      },
    },
  ]

  const createdIds: string[] = []

  for (const strategy of strategies) {
    try {
      const result = await payload.create({
        collection: 'trading-strategies',
        data: strategy,
      })
      createdIds.push(String(result.id))
    } catch (error) {
      console.error(`Error creating strategy ${strategy.name}:`, error)
    }
  }

  return createdIds
}

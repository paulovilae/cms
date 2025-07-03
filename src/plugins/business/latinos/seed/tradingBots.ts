import type { Payload } from 'payload'

/**
 * Seed trading bots with realistic sample data
 */
export const seedTradingBots = async (
  payload: Payload,
  strategyIds: string[],
): Promise<string[]> => {
  // Ensure we have enough strategy IDs
  if (strategyIds.length < 6) {
    throw new Error('Not enough strategy IDs provided for bot seeding')
  }

  const bots = [
    {
      name: 'Apple RSI Bot',
      status: 'active' as const,
      strategy: parseInt(strategyIds[0]!), // RSI strategy
      symbol: 'AAPL',
      exchange: 'NASDAQ' as const,
      investmentAmount: 5000,
      riskLevel: 'conservative' as const,
      maxDailyTrades: 3,
      stopLossPercentage: 3,
      takeProfitPercentage: 8,
      microserviceId: 'bot_aapl_rsi_001',
      lastExecution: new Date('2024-01-15T14:30:00Z').toISOString(),
      totalTrades: 47,
      successfulTrades: 32,
      totalProfit: 1247.85,
    },
    {
      name: 'Google MA Crossover',
      status: 'active' as const,
      strategy: parseInt(strategyIds[1]!), // MA Crossover strategy
      symbol: 'GOOGL',
      exchange: 'NASDAQ' as const,
      investmentAmount: 8000,
      riskLevel: 'moderate' as const,
      maxDailyTrades: 5,
      stopLossPercentage: 4,
      takeProfitPercentage: 12,
      microserviceId: 'bot_googl_ma_002',
      lastExecution: new Date('2024-01-15T16:45:00Z').toISOString(),
      totalTrades: 23,
      successfulTrades: 15,
      totalProfit: 892.34,
    },
    {
      name: 'Tesla MACD Momentum',
      status: 'paused' as const,
      strategy: parseInt(strategyIds[2]!), // MACD strategy
      symbol: 'TSLA',
      exchange: 'NASDAQ' as const,
      investmentAmount: 10000,
      riskLevel: 'aggressive' as const,
      maxDailyTrades: 8,
      stopLossPercentage: 6,
      takeProfitPercentage: 15,
      microserviceId: 'bot_tsla_macd_003',
      lastExecution: new Date('2024-01-14T11:20:00Z').toISOString(),
      totalTrades: 67,
      successfulTrades: 38,
      totalProfit: -234.67,
    },
    {
      name: 'NVIDIA Bollinger Squeeze',
      status: 'active' as const,
      strategy: parseInt(strategyIds[3]!), // Bollinger strategy
      symbol: 'NVDA',
      exchange: 'NASDAQ' as const,
      investmentAmount: 15000,
      riskLevel: 'aggressive' as const,
      maxDailyTrades: 6,
      stopLossPercentage: 8,
      takeProfitPercentage: 20,
      microserviceId: 'bot_nvda_bb_004',
      lastExecution: new Date('2024-01-15T13:15:00Z').toISOString(),
      totalTrades: 34,
      successfulTrades: 19,
      totalProfit: 2156.78,
    },
    {
      name: 'Multi-Timeframe Microsoft',
      status: 'active' as const,
      strategy: parseInt(strategyIds[4]!), // Multi-timeframe RSI strategy
      symbol: 'MSFT',
      exchange: 'NASDAQ' as const,
      investmentAmount: 7500,
      riskLevel: 'moderate' as const,
      maxDailyTrades: 4,
      stopLossPercentage: 4,
      takeProfitPercentage: 10,
      microserviceId: 'bot_msft_multi_005',
      lastExecution: new Date('2024-01-15T15:30:00Z').toISOString(),
      totalTrades: 56,
      successfulTrades: 41,
      totalProfit: 1834.92,
    },
    {
      name: 'Amazon Scalper',
      status: 'stopped' as const,
      strategy: parseInt(strategyIds[5]!), // Scalping strategy
      symbol: 'AMZN',
      exchange: 'NASDAQ' as const,
      investmentAmount: 3000,
      riskLevel: 'aggressive' as const,
      maxDailyTrades: 15,
      stopLossPercentage: 2,
      takeProfitPercentage: 3,
      microserviceId: 'bot_amzn_scalp_006',
      lastExecution: new Date('2024-01-12T09:45:00Z').toISOString(),
      totalTrades: 189,
      successfulTrades: 142,
      totalProfit: 567.23,
    },
    {
      name: 'Bitcoin RSI Pro',
      status: 'active' as const,
      strategy: parseInt(strategyIds[0]!), // RSI strategy
      symbol: 'BTC-USD',
      exchange: 'CRYPTO' as const,
      investmentAmount: 12000,
      riskLevel: 'moderate' as const,
      maxDailyTrades: 6,
      stopLossPercentage: 5,
      takeProfitPercentage: 12,
      microserviceId: 'bot_btc_rsi_007',
      lastExecution: new Date('2024-01-15T18:20:00Z').toISOString(),
      totalTrades: 78,
      successfulTrades: 52,
      totalProfit: 3456.78,
    },
    {
      name: 'Meta MACD Trader',
      status: 'error' as const,
      strategy: parseInt(strategyIds[2]!), // MACD strategy
      symbol: 'META',
      exchange: 'NASDAQ' as const,
      investmentAmount: 6000,
      riskLevel: 'moderate' as const,
      maxDailyTrades: 4,
      stopLossPercentage: 5,
      takeProfitPercentage: 11,
      microserviceId: 'bot_meta_macd_008',
      lastExecution: new Date('2024-01-13T14:10:00Z').toISOString(),
      totalTrades: 12,
      successfulTrades: 7,
      totalProfit: -89.45,
    },
  ]

  const createdIds: string[] = []

  for (const bot of bots) {
    try {
      const result = await payload.create({
        collection: 'trading-bots',
        data: bot,
      })
      createdIds.push(String(result.id))
    } catch (error) {
      console.error(`Error creating bot ${bot.name}:`, error)
    }
  }

  return createdIds
}

import type { Payload } from 'payload'

/**
 * Seed trading trades with realistic sample data
 */
export const seedTradingTrades = async (payload: Payload, botIds: string[]): Promise<string[]> => {
  // Ensure we have enough bot IDs
  if (botIds.length < 8) {
    throw new Error('Not enough bot IDs provided for trade seeding')
  }

  const trades = [
    // Apple RSI Bot trades
    {
      bot: parseInt(botIds[0]!),
      symbol: 'AAPL',
      side: 'buy' as const,
      quantity: 27,
      price: 182.5,
      status: 'filled' as const,
      stopLoss: 177.23,
      takeProfit: 197.1,
      filledAt: new Date('2024-01-15T14:30:00Z').toISOString(),
      profit: 394.65,
      isSuccessful: true,
      microserviceTradeId: 'trade_aapl_001',
    },
    {
      bot: parseInt(botIds[0]!),
      symbol: 'AAPL',
      side: 'sell' as const,
      quantity: 27,
      price: 197.1,
      status: 'filled' as const,
      filledAt: new Date('2024-01-15T16:45:00Z').toISOString(),
      profit: 394.65,
      isSuccessful: true,
      microserviceTradeId: 'trade_aapl_002',
    },
    {
      bot: parseInt(botIds[0]!),
      symbol: 'AAPL',
      side: 'buy' as const,
      quantity: 28,
      price: 179.8,
      status: 'open' as const,
      stopLoss: 174.81,
      takeProfit: 194.38,
      microserviceTradeId: 'trade_aapl_003',
    },

    // Google MA Crossover trades
    {
      bot: parseInt(botIds[1]!),
      symbol: 'GOOGL',
      side: 'buy' as const,
      quantity: 58,
      price: 138.21,
      status: 'filled' as const,
      stopLoss: 132.68,
      takeProfit: 154.8,
      filledAt: new Date('2024-01-14T10:15:00Z').toISOString(),
      profit: 962.22,
      isSuccessful: true,
      microserviceTradeId: 'trade_googl_001',
    },
    {
      bot: parseInt(botIds[1]!),
      symbol: 'GOOGL',
      side: 'sell' as const,
      quantity: 58,
      price: 154.8,
      status: 'filled' as const,
      filledAt: new Date('2024-01-15T11:30:00Z').toISOString(),
      profit: 962.22,
      isSuccessful: true,
      microserviceTradeId: 'trade_googl_002',
    },

    // Tesla MACD trades (some losses)
    {
      bot: parseInt(botIds[2]!),
      symbol: 'TSLA',
      side: 'buy' as const,
      quantity: 40,
      price: 248.42,
      status: 'filled' as const,
      stopLoss: 233.52,
      takeProfit: 285.68,
      filledAt: new Date('2024-01-13T09:20:00Z').toISOString(),
      profit: -594.0,
      isSuccessful: false,
      microserviceTradeId: 'trade_tsla_001',
    },
    {
      bot: parseInt(botIds[2]!),
      symbol: 'TSLA',
      side: 'sell' as const,
      quantity: 40,
      price: 233.52,
      status: 'filled' as const,
      filledAt: new Date('2024-01-13T14:45:00Z').toISOString(),
      profit: -594.0,
      isSuccessful: false,
      microserviceTradeId: 'trade_tsla_002',
    },

    // NVIDIA Bollinger trades (profitable)
    {
      bot: parseInt(botIds[3]!),
      symbol: 'NVDA',
      side: 'buy' as const,
      quantity: 17,
      price: 875.28,
      status: 'filled' as const,
      stopLoss: 805.26,
      takeProfit: 1050.34,
      filledAt: new Date('2024-01-12T13:15:00Z').toISOString(),
      profit: 2975.02,
      isSuccessful: true,
      microserviceTradeId: 'trade_nvda_001',
    },
    {
      bot: parseInt(botIds[3]!),
      symbol: 'NVDA',
      side: 'sell' as const,
      quantity: 17,
      price: 1050.34,
      status: 'filled' as const,
      filledAt: new Date('2024-01-15T10:20:00Z').toISOString(),
      profit: 2975.02,
      isSuccessful: true,
      microserviceTradeId: 'trade_nvda_002',
    },

    // Microsoft Multi-timeframe trades
    {
      bot: parseInt(botIds[4]!),
      symbol: 'MSFT',
      side: 'buy' as const,
      quantity: 20,
      price: 378.85,
      status: 'filled' as const,
      stopLoss: 363.7,
      takeProfit: 416.74,
      filledAt: new Date('2024-01-14T15:30:00Z').toISOString(),
      profit: 757.8,
      isSuccessful: true,
      microserviceTradeId: 'trade_msft_001',
    },
    {
      bot: parseInt(botIds[4]!),
      symbol: 'MSFT',
      side: 'sell' as const,
      quantity: 20,
      price: 416.74,
      status: 'filled' as const,
      filledAt: new Date('2024-01-15T12:45:00Z').toISOString(),
      profit: 757.8,
      isSuccessful: true,
      microserviceTradeId: 'trade_msft_002',
    },

    // Amazon Scalper trades (many small trades)
    {
      bot: parseInt(botIds[5]!),
      symbol: 'AMZN',
      side: 'buy' as const,
      quantity: 19,
      price: 155.89,
      status: 'filled' as const,
      stopLoss: 152.67,
      takeProfit: 159.11,
      filledAt: new Date('2024-01-12T09:45:00Z').toISOString(),
      profit: 61.18,
      isSuccessful: true,
      microserviceTradeId: 'trade_amzn_001',
    },
    {
      bot: parseInt(botIds[5]!),
      symbol: 'AMZN',
      side: 'sell' as const,
      quantity: 19,
      price: 159.11,
      status: 'filled' as const,
      filledAt: new Date('2024-01-12T09:52:00Z').toISOString(),
      profit: 61.18,
      isSuccessful: true,
      microserviceTradeId: 'trade_amzn_002',
    },

    // Bitcoin RSI Pro trades (crypto)
    {
      bot: parseInt(botIds[6]!),
      symbol: 'BTC-USD',
      side: 'buy' as const,
      quantity: 0.177,
      price: 67845.32,
      status: 'filled' as const,
      stopLoss: 64453.05,
      takeProfit: 76026.76,
      filledAt: new Date('2024-01-15T18:20:00Z').toISOString(),
      profit: 1448.45,
      isSuccessful: true,
      microserviceTradeId: 'trade_btc_001',
    },
    {
      bot: parseInt(botIds[6]!),
      symbol: 'BTC-USD',
      side: 'sell' as const,
      quantity: 0.177,
      price: 76026.76,
      status: 'open' as const,
      microserviceTradeId: 'trade_btc_002',
    },

    // Meta MACD trades (error bot - failed trades)
    {
      bot: parseInt(botIds[7]!),
      symbol: 'META',
      side: 'buy' as const,
      quantity: 12,
      price: 484.2,
      status: 'cancelled' as const,
      stopLoss: 459.99,
      takeProfit: 537.02,
      microserviceTradeId: 'trade_meta_001',
    },
    {
      bot: parseInt(botIds[7]!),
      symbol: 'META',
      side: 'buy' as const,
      quantity: 12,
      price: 490.15,
      status: 'rejected' as const,
      microserviceTradeId: 'trade_meta_002',
    },
  ]

  const createdIds: string[] = []

  for (const trade of trades) {
    try {
      const result = await payload.create({
        collection: 'trading-trades',
        data: trade,
      })
      createdIds.push(String(result.id))
    } catch (error) {
      console.error(`Error creating trade for ${trade.symbol}:`, error)
    }
  }

  return createdIds
}

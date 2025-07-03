import type { Payload } from 'payload'

/**
 * Seed market data with realistic sample data for common stocks
 */
export const seedMarketData = async (payload: Payload): Promise<string[]> => {
  const marketData = [
    {
      symbol: 'AAPL',
      currentPrice: 182.52,
      volume: 45678900,
      change24h: 2.34,
      changePercent24h: 1.3,
      high24h: 184.95,
      low24h: 179.8,
      marketCap: 2847000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'GOOGL',
      currentPrice: 138.21,
      volume: 23456780,
      change24h: -1.87,
      changePercent24h: -1.33,
      high24h: 141.5,
      low24h: 137.25,
      marketCap: 1750000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'MSFT',
      currentPrice: 378.85,
      volume: 34567890,
      change24h: 4.12,
      changePercent24h: 1.1,
      high24h: 381.2,
      low24h: 375.3,
      marketCap: 2810000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'TSLA',
      currentPrice: 248.42,
      volume: 67890123,
      change24h: -8.73,
      changePercent24h: -3.4,
      high24h: 259.8,
      low24h: 246.15,
      marketCap: 790000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'AMZN',
      currentPrice: 155.89,
      volume: 28901234,
      change24h: 3.45,
      changePercent24h: 2.26,
      high24h: 157.2,
      low24h: 152.1,
      marketCap: 1620000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'NVDA',
      currentPrice: 875.28,
      volume: 45123456,
      change24h: 15.67,
      changePercent24h: 1.82,
      high24h: 882.5,
      low24h: 858.9,
      marketCap: 2150000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'META',
      currentPrice: 484.2,
      volume: 19876543,
      change24h: -6.78,
      changePercent24h: -1.38,
      high24h: 492.5,
      low24h: 481.3,
      marketCap: 1230000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'NFLX',
      currentPrice: 598.73,
      volume: 12345678,
      change24h: 12.45,
      changePercent24h: 2.12,
      high24h: 605.2,
      low24h: 585.8,
      marketCap: 265000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'AMD',
      currentPrice: 152.34,
      volume: 38765432,
      change24h: -2.89,
      changePercent24h: -1.86,
      high24h: 156.7,
      low24h: 150.25,
      marketCap: 246000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'INTC',
      currentPrice: 43.67,
      volume: 56789012,
      change24h: 0.89,
      changePercent24h: 2.08,
      high24h: 44.25,
      low24h: 42.8,
      marketCap: 186000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'BTC-USD',
      currentPrice: 67845.32,
      volume: 1234567890,
      change24h: 1234.56,
      changePercent24h: 1.85,
      high24h: 69200.0,
      low24h: 66500.0,
      marketCap: 1340000000000,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'ETH-USD',
      currentPrice: 3456.78,
      volume: 987654321,
      change24h: -89.45,
      changePercent24h: -2.52,
      high24h: 3580.2,
      low24h: 3420.15,
      marketCap: 415000000000,
      lastUpdated: new Date().toISOString(),
    },
  ]

  const createdIds: string[] = []

  for (const data of marketData) {
    try {
      const result = await payload.create({
        collection: 'market-data',
        data: data,
      })
      createdIds.push(String(result.id))
    } catch (error) {
      console.error(`Error creating market data for ${data.symbol}:`, error)
    }
  }

  return createdIds
}

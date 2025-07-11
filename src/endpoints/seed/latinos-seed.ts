import type { Payload } from 'payload'

/**
 * Seed data for Latinos Trading Bot System collections
 * 
 * This function creates comprehensive sample data for all Latinos collections:
 * - Market Data: Real-time market data for popular stocks and cryptocurrencies
 * - Trading Strategies: Various algorithmic trading strategies
 * - Trading Bots: Sample trading bots using different strategies
 * - Trading Formulas: Formula configurations linked to specific bots
 * - Trading Trades: Historical trade records with realistic profit/loss data
 */
export const seedLatinosCollections = async (payload: Payload): Promise<void> => {
  console.log('🤖 Starting Latinos Trading Bot System seed...')

  try {
    // 1. Seed market data first (no dependencies)
    console.log('📊 Seeding market data...')
    const marketDataIds = await seedMarketData(payload)
    console.log(`✅ Created ${marketDataIds.length} market data entries`)

    // 2. Seed trading strategies (no dependencies)
    console.log('📈 Seeding trading strategies...')
    const strategyIds = await seedTradingStrategies(payload)
    console.log(`✅ Created ${strategyIds.length} trading strategies`)

    // 3. Seed trading bots (depends on strategies)
    console.log('🤖 Seeding trading bots...')
    const botIds = await seedTradingBots(payload, strategyIds)
    console.log(`✅ Created ${botIds.length} trading bots`)

    // 4. Seed trading formulas (depends on bots)
    console.log('📋 Seeding trading formulas...')
    const formulaIds = await seedTradingFormulas(payload, botIds)
    console.log(`✅ Created ${formulaIds.length} trading formulas`)

    // 5. Seed trading trades (depends on bots)
    console.log('💰 Seeding trading trades...')
    const tradeIds = await seedTradingTrades(payload, botIds)
    console.log(`✅ Created ${tradeIds.length} trading trades`)

    console.log('🎉 Latinos Trading Bot System seed completed successfully!')
    console.log(
      `📊 Summary: ${marketDataIds.length} market data, ${strategyIds.length} strategies, ${botIds.length} bots, ${formulaIds.length} formulas, ${tradeIds.length} trades`,
    )
  } catch (error) {
    console.error('❌ Error seeding Latinos data:', error)
    throw error
  }
}

/**
 * Seed market data with realistic sample data
 */
const seedMarketData = async (payload: Payload): Promise<string[]> => {
  const marketData = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 175.43,
      previousClose: 172.89,
      change: 2.54,
      changePercent: 1.47,
      volume: 52847392,
      marketCap: 2756000000000,
      high52Week: 199.62,
      low52Week: 164.08,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 138.21,
      previousClose: 136.55,
      change: 1.66,
      changePercent: 1.22,
      volume: 28934756,
      marketCap: 1750000000000,
      high52Week: 153.78,
      low52Week: 121.46,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 378.85,
      previousClose: 376.04,
      change: 2.81,
      changePercent: 0.75,
      volume: 19847362,
      marketCap: 2810000000000,
      high52Week: 384.30,
      low52Week: 309.45,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 248.42,
      previousClose: 251.05,
      change: -2.63,
      changePercent: -1.05,
      volume: 67234891,
      marketCap: 790000000000,
      high52Week: 299.29,
      low52Week: 138.80,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 155.89,
      previousClose: 154.23,
      change: 1.66,
      changePercent: 1.08,
      volume: 34567123,
      marketCap: 1620000000000,
      high52Week: 170.00,
      low52Week: 118.35,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 875.28,
      previousClose: 863.17,
      change: 12.11,
      changePercent: 1.40,
      volume: 45123789,
      marketCap: 2150000000000,
      high52Week: 974.00,
      low52Week: 365.00,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'META',
      name: 'Meta Platforms, Inc.',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 484.20,
      previousClose: 478.32,
      change: 5.88,
      changePercent: 1.23,
      volume: 23456789,
      marketCap: 1230000000000,
      high52Week: 531.49,
      low52Week: 274.39,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'NFLX',
      name: 'Netflix, Inc.',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 487.83,
      previousClose: 485.12,
      change: 2.71,
      changePercent: 0.56,
      volume: 12345678,
      marketCap: 210000000000,
      high52Week: 700.99,
      low52Week: 344.73,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices, Inc.',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 142.18,
      previousClose: 139.87,
      change: 2.31,
      changePercent: 1.65,
      volume: 34567890,
      marketCap: 230000000000,
      high52Week: 227.30,
      low52Week: 93.12,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'INTC',
      name: 'Intel Corporation',
      exchange: 'NASDAQ' as const,
      assetType: 'stock' as const,
      currentPrice: 43.61,
      previousClose: 43.12,
      change: 0.49,
      changePercent: 1.14,
      volume: 45678901,
      marketCap: 185000000000,
      high52Week: 51.28,
      low52Week: 18.51,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'BTC-USD',
      name: 'Bitcoin',
      exchange: 'CRYPTO' as const,
      assetType: 'crypto' as const,
      currentPrice: 67234.56,
      previousClose: 65789.23,
      change: 1445.33,
      changePercent: 2.20,
      volume: 28934567890,
      marketCap: 1320000000000,
      high52Week: 73750.07,
      low52Week: 38505.00,
      lastUpdated: new Date().toISOString(),
    },
    {
      symbol: 'ETH-USD',
      name: 'Ethereum',
      exchange: 'CRYPTO' as const,
      assetType: 'crypto' as const,
      currentPrice: 3456.78,
      previousClose: 3398.45,
      change: 58.33,
      changePercent: 1.72,
      volume: 15678901234,
      marketCap: 415000000000,
      high52Week: 4891.70,
      low52Week: 1523.24,
      lastUpdated: new Date().toISOString(),
    },
  ]

  const createdIds: string[] = []

  for (const data of marketData) {
    try {
      const result = await payload.create({
        collection: 'market-data',
        data,
      })
      createdIds.push(String(result.id))
    } catch (error) {
      console.error(`Error creating market data for ${data.symbol}:`, error)
    }
  }

  return createdIds
}

/**
 * Seed trading strategies with realistic sample data
 */
const seedTradingStrategies = async (payload: Payload): Promise<string[]> => {
  const strategies = [
    {
      name: 'RSI Oversold/Overbought',
      description: 'Conservative strategy based on RSI indicator to identify oversold and overbought conditions',
      category: 'momentum' as const,
      riskLevel: 'conservative' as const,
      timeframe: '1h' as const,
      indicators: ['rsi'],
      parameters: {
        rsiPeriod: 14,
        oversoldThreshold: 30,
        overboughtThreshold: 70,
        confirmationPeriods: 2,
      },
      performance: {
        winRate: 68.5,
        avgReturn: 4.2,
        maxDrawdown: 8.7,
        sharpeRatio: 1.34,
        totalTrades: 247,
        profitableTrades: 169,
      },
      isActive: true,
    },
    {
      name: 'Golden Cross MA Strategy',
      description: 'Moving average crossover strategy using 50-day and 200-day moving averages',
      category: 'trend' as const,
      riskLevel: 'moderate' as const,
      timeframe: '1d' as const,
      indicators: ['sma_50', 'sma_200'],
      parameters: {
        shortPeriod: 50,
        longPeriod: 200,
        confirmationVolume: true,
        minVolumeMultiplier: 1.5,
      },
      performance: {
        winRate: 72.3,
        avgReturn: 8.9,
        maxDrawdown: 12.4,
        sharpeRatio: 1.67,
        totalTrades: 89,
        profitableTrades: 64,
      },
      isActive: true,
    },
    {
      name: 'MACD Momentum',
      description: 'MACD-based momentum strategy for capturing trend changes',
      category: 'momentum' as const,
      riskLevel: 'moderate' as const,
      timeframe: '4h' as const,
      indicators: ['macd'],
      parameters: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        histogramThreshold: 0.1,
      },
      performance: {
        winRate: 61.8,
        avgReturn: 6.7,
        maxDrawdown: 15.2,
        sharpeRatio: 1.12,
        totalTrades: 156,
        profitableTrades: 96,
      },
      isActive: true,
    },
    {
      name: 'Bollinger Band Squeeze',
      description: 'Volatility-based strategy using Bollinger Bands to identify breakout opportunities',
      category: 'volatility' as const,
      riskLevel: 'aggressive' as const,
      timeframe: '1h' as const,
      indicators: ['bb', 'volume'],
      parameters: {
        period: 20,
        standardDeviations: 2,
        squeezeThreshold: 0.1,
        breakoutConfirmation: true,
      },
      performance: {
        winRate: 58.4,
        avgReturn: 12.3,
        maxDrawdown: 22.1,
        sharpeRatio: 1.45,
        totalTrades: 203,
        profitableTrades: 119,
      },
      isActive: true,
    },
    {
      name: 'Multi-Timeframe RSI',
      description: 'Advanced RSI strategy using multiple timeframes for confluence',
      category: 'momentum' as const,
      riskLevel: 'moderate' as const,
      timeframe: '1h' as const,
      indicators: ['rsi_1h', 'rsi_4h', 'rsi_1d'],
      parameters: {
        timeframes: ['1h', '4h', '1d'],
        rsiPeriod: 14,
        confluenceRequired: 2,
        divergenceDetection: true,
      },
      performance: {
        winRate: 74.2,
        avgReturn: 7.8,
        maxDrawdown: 9.6,
        sharpeRatio: 1.89,
        totalTrades: 134,
        profitableTrades: 99,
      },
      isActive: true,
    },
    {
      name: 'Scalping Quick Profits',
      description: 'High-frequency scalping strategy for quick profits on small price movements',
      category: 'scalping' as const,
      riskLevel: 'aggressive' as const,
      timeframe: '5m' as const,
      indicators: ['rsi', 'volume', 'price_action'],
      parameters: {
        timeframe: '5m',
        profitTarget: 0.5,
        stopLoss: 0.3,
        maxHoldTime: 30,
        volumeFilter: true,
      },
      performance: {
        winRate: 82.1,
        avgReturn: 0.8,
        maxDrawdown: 4.2,
        sharpeRatio: 2.34,
        totalTrades: 1247,
        profitableTrades: 1024,
      },
      isActive: false,
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

/**
 * Seed trading bots with realistic sample data
 */
const seedTradingBots = async (payload: Payload, strategyIds: string[]): Promise<string[]> => {
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

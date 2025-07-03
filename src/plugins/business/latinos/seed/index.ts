import type { Payload } from 'payload'
import { seedTradingStrategies } from './tradingStrategies'
import { seedTradingBots } from './tradingBots'
import { seedTradingFormulas } from './tradingFormulas'
import { seedTradingTrades } from './tradingTrades'
import { seedMarketData } from './marketData'

/**
 * Main seed function for Latinos Trading Bot System
 *
 * Seeds all collections with realistic sample data for testing and demonstration.
 * Order is important due to relationships between collections.
 */
export const seedLatinosData = async (payload: Payload): Promise<void> => {
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

    // Log summary
    console.log(
      `📊 Summary: ${marketDataIds.length} market data, ${strategyIds.length} strategies, ${botIds.length} bots, ${formulaIds.length} formulas, ${tradeIds.length} trades`,
    )
  } catch (error) {
    console.error('❌ Error seeding Latinos data:', error)
    throw error
  }
}

/**
 * Clear all Latinos data (useful for re-seeding)
 */
export const clearLatinosData = async (payload: Payload): Promise<void> => {
  console.log('🧹 Clearing Latinos Trading Bot System data...')

  try {
    // Clear in reverse order due to relationships
    await payload.delete({ collection: 'trading-trades', where: {} })
    await payload.delete({ collection: 'trading-formulas', where: {} })
    await payload.delete({ collection: 'trading-bots', where: {} })
    await payload.delete({ collection: 'trading-strategies', where: {} })
    await payload.delete({ collection: 'market-data', where: {} })

    console.log('✅ Latinos data cleared successfully')
  } catch (error) {
    console.error('❌ Error clearing Latinos data:', error)
    throw error
  }
}

export default seedLatinosData

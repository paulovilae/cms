import { Plugin } from 'payload'

// Import Latinos collections (to be created)
// import { TradingBots } from './collections/TradingBots'
// import { TradingStrategies } from './collections/TradingStrategies'
// import { MarketData } from './collections/MarketData'

/**
 * Latinos Plugin
 *
 * Automated trading platform with bot functionality for stock market operations.
 */
export const latinosPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      // TradingBots,
      // TradingStrategies,
      // MarketData,
    ],
  }
}

export default latinosPlugin

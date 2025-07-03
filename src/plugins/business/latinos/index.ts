import type { Plugin } from 'payload'

// Import Latinos collections
import { TradingBots } from './collections/TradingBots'
import { TradingFormulas } from './collections/TradingFormulas'
import { TradingStrategies } from './collections/TradingStrategies'
import { TradingTrades } from './collections/TradingTrades'
import { MarketData } from './collections/MarketData'

// Import Latinos blocks
import { LiveTradingDashboard } from './blocks/LiveTradingDashboard'
import { BotPerformanceAnalytics } from './blocks/BotPerformanceAnalytics'

// Import API endpoints
import {
  getBotsEndpoint,
  createBotEndpoint,
  getBotEndpoint,
  updateBotEndpoint,
  deleteBotEndpoint,
  startBotEndpoint,
  stopBotEndpoint,
} from './endpoints/bots'

import {
  liveDataEndpoint,
  systemStatusEndpoint,
  startSystemEndpoint,
  stopSystemEndpoint,
  activeTradesEndpoint,
  recentTradesEndpoint,
  marketDataEndpoint,
  testConnectionEndpoint,
} from './endpoints/realtime'

import {
  connectionDebugEndpoint,
  retryConnectionEndpoint,
  microserviceHealthEndpoint,
} from './endpoints/debug'

import { seedEndpoint } from './endpoints/seed'

/**
 * Latinos Plugin
 *
 * Automated trading platform with bot functionality for stock market operations.
 *
 * Phase 3 Implementation: Advanced Features
 * - Complete React components for live trading monitoring
 * - Bot configuration interface with full CRUD operations
 * - API endpoints for bot management and real-time data
 * - Integration with Phase 2 microservice and real-time sync services
 */
export const latinosPlugin = (): Plugin => (incomingConfig: any) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      TradingBots,
      TradingFormulas,
      TradingStrategies,
      TradingTrades,
      MarketData,
    ],
    endpoints: [
      ...(incomingConfig.endpoints || []),
      // Bot management endpoints
      getBotsEndpoint,
      createBotEndpoint,
      getBotEndpoint,
      updateBotEndpoint,
      deleteBotEndpoint,
      startBotEndpoint,
      stopBotEndpoint,
      // Real-time data endpoints
      liveDataEndpoint,
      systemStatusEndpoint,
      startSystemEndpoint,
      stopSystemEndpoint,
      activeTradesEndpoint,
      recentTradesEndpoint,
      marketDataEndpoint,
      testConnectionEndpoint,
      // Debug endpoints
      connectionDebugEndpoint,
      retryConnectionEndpoint,
      microserviceHealthEndpoint,
      // Seed endpoint
      seedEndpoint,
    ],
    admin: {
      ...incomingConfig.admin,
      components: {
        ...incomingConfig.admin?.components,
        // Add custom admin components here if needed
      },
    },
    // Add custom blocks to the global blocks array
    blocks: [...(incomingConfig.blocks || []), LiveTradingDashboard, BotPerformanceAnalytics],
  }
}

export default latinosPlugin

// Export services for external use
export { botMicroservice } from './services/botMicroservice'
export { realTimeSync } from './services/realTimeSync'
export type { RealTimeDataSync, WebSocketMessage, ConnectionStatus } from './services/realTimeSync'
export type { BotMicroserviceIntegration } from './services/botMicroservice'

// Export seed functions for external use
export { seedLatinosData, clearLatinosData } from './seed'

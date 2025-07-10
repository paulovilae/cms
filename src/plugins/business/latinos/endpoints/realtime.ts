import { botMicroservice } from '../services/botMicroservice'
import { getBusinessContext, isValidBusinessMode } from '../../../../utilities/businessContext'

/**
 * Get live trading data (system status, active trades, market data)
 */
export const liveDataEndpoint = {
  path: '/live-data',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Live data request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Live trading data not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const microservice = botMicroservice

      const [tradesResult, statusResult, recentTrades] = await Promise.allSettled([
        microservice.getTrades(),
        microservice.getSystemStatus(),
        req.payload.find({
          collection: 'trading-trades',
          limit: 10,
          sort: '-createdAt',
        }),
      ])

      const response: any = {
        success: true,
        data: {
          trades: [],
          status: null,
          recentTrades: [],
        },
      }

      // Process trades result
      if (tradesResult.status === 'fulfilled' && tradesResult.value.success) {
        response.data.trades = tradesResult.value.data || []
      } else {
        console.warn(
          'Failed to fetch trades from microservice:',
          tradesResult.status === 'rejected' ? tradesResult.reason : tradesResult.value.error,
        )
      }

      // Process system status result
      if (statusResult.status === 'fulfilled' && statusResult.value.success) {
        response.data.status = statusResult.value.data
      } else {
        console.warn(
          'Failed to fetch system status from microservice:',
          statusResult.status === 'rejected' ? statusResult.reason : statusResult.value.error,
        )
      }

      // Process recent trades from CMS
      if (recentTrades.status === 'fulfilled') {
        response.data.recentTrades = recentTrades.value.docs || []
      } else {
        console.warn('Failed to fetch recent trades from CMS:', recentTrades.reason)
      }

      res.json(response)
    } catch (error) {
      console.error('Error fetching live data:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch live trading data',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Get system status
 */
export const systemStatusEndpoint = {
  path: '/system/status',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `System status request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `System status not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const result = await botMicroservice.getSystemStatus()

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch system status',
          message: result.error,
        })
      }
    } catch (error) {
      console.error('Error fetching system status:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch system status',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Start the trading system
 */
export const startSystemEndpoint = {
  path: '/system/start',
  method: 'post',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Start system request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `System control not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const result = await botMicroservice.startSystem()

      if (result.success) {
        res.json({
          success: true,
          message: 'Trading system started successfully',
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to start trading system',
          message: result.error,
        })
      }
    } catch (error) {
      console.error('Error starting system:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to start trading system',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Stop the trading system
 */
export const stopSystemEndpoint = {
  path: '/system/stop',
  method: 'post',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Stop system request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `System control not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const result = await botMicroservice.stopSystem()

      if (result.success) {
        res.json({
          success: true,
          message: 'Trading system stopped successfully',
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to stop trading system',
          message: result.error,
        })
      }
    } catch (error) {
      console.error('Error stopping system:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to stop trading system',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Get active trades
 */
export const activeTradesEndpoint = {
  path: '/trades/active',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Active trades request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading data not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      // Get active trades from CMS
      const activeTrades = await req.payload.find({
        collection: 'trading-trades',
        where: {
          status: {
            equals: 'open',
          },
        },
        limit: 50,
        sort: '-createdAt',
      })

      res.json({
        success: true,
        data: activeTrades.docs,
        totalDocs: activeTrades.totalDocs,
      })
    } catch (error) {
      console.error('Error fetching active trades:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch active trades',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Get recent trades
 */
export const recentTradesEndpoint = {
  path: '/trades/recent',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Recent trades request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading data not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const limit = parseInt(req.query.limit as string) || 20
      const page = parseInt(req.query.page as string) || 1

      // Get recent trades from CMS
      const recentTrades = await req.payload.find({
        collection: 'trading-trades',
        limit,
        page,
        sort: '-createdAt',
      })

      res.json({
        success: true,
        data: recentTrades.docs,
        totalDocs: recentTrades.totalDocs,
        page: recentTrades.page,
        totalPages: recentTrades.totalPages,
      })
    } catch (error) {
      console.error('Error fetching recent trades:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recent trades',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Get market data
 */
export const marketDataEndpoint = {
  path: '/market-data',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Market data request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Market data not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      // Get market data from CMS
      const marketData = await req.payload.find({
        collection: 'market-data',
        limit: 50,
        sort: '-lastUpdated',
      })

      // Transform to object format for easier consumption
      const marketDataObject: Record<string, any> = {}
      marketData.docs.forEach((item: any) => {
        if (item.symbol) {
          marketDataObject[item.symbol] = item
        }
      })

      res.json({
        success: true,
        data: marketDataObject,
        totalSymbols: marketData.totalDocs,
      })
    } catch (error) {
      console.error('Error fetching market data:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market data',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Test microservice connection
 */
export const testConnectionEndpoint = {
  path: '/test-connection',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Test connection request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Connection testing not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const result = await botMicroservice.testConnection()

      res.json({
        success: result.success,
        connected: result.success,
        microserviceUrl: botMicroservice.getBaseUrl(),
        configured: botMicroservice.isConfigured(),
        message: result.success ? 'Connection successful' : result.error,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error testing connection:', error)
      res.status(500).json({
        success: false,
        connected: false,
        error: 'Failed to test microservice connection',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  },
}

import { botMicroservice } from '../services/botMicroservice'
import { getBusinessContext, isValidBusinessMode } from '../../../../utilities/businessContext'

/**
 * Get all trading bots
 */
export const getBotsEndpoint = {
  path: '/bots',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Get bots request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading bots not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const bots = await req.payload.find({
        collection: 'trading-bots',
        limit: 100,
        sort: '-createdAt',
        where: {
          // Optional: filter by user if needed
          // createdBy: { equals: req.user.id }
        },
      })

      res.json({
        success: true,
        data: bots.docs,
        totalDocs: bots.totalDocs,
        page: bots.page,
        totalPages: bots.totalPages,
      })
    } catch (error) {
      console.error('Error fetching bots:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trading bots',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Create a new trading bot
 */
export const createBotEndpoint = {
  path: '/bots',
  method: 'post',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Create bot request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading bots not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const botData = req.body

      // Validate required fields
      if (!botData.name || !botData.symbol || !botData.strategy) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, symbol, strategy',
        })
      }

      // Create bot in Payload CMS
      const bot = await req.payload.create({
        collection: 'trading-bots',
        data: {
          ...botData,
          status: 'stopped', // Default status
          totalTrades: 0,
          successfulTrades: 0,
          totalProfit: 0,
        },
      })

      // Sync with microservice
      try {
        const microserviceResult = await botMicroservice.createFormula(botData)

        if (microserviceResult.success && microserviceResult.data?.id) {
          // Update bot with microservice ID
          const updatedBot = await req.payload.update({
            collection: 'trading-bots',
            id: bot.id,
            data: {
              microserviceId: microserviceResult.data.id,
            },
          })

          res.status(201).json({
            success: true,
            data: updatedBot,
            message: 'Bot created successfully',
          })
        } else {
          // Bot created in CMS but microservice sync failed
          res.status(201).json({
            success: true,
            data: bot,
            warning: 'Bot created but microservice sync failed',
            microserviceError: microserviceResult.error,
          })
        }
      } catch (microserviceError) {
        console.error('Microservice sync error:', microserviceError)
        res.status(201).json({
          success: true,
          data: bot,
          warning: 'Bot created but microservice sync failed',
          microserviceError:
            microserviceError instanceof Error
              ? microserviceError.message
              : 'Unknown microservice error',
        })
      }
    } catch (error) {
      console.error('Error creating bot:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create trading bot',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Get a specific trading bot
 */
export const getBotEndpoint = {
  path: '/bots/:id',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Get bot request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading bots not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { id } = req.params

      const bot = await req.payload.findByID({
        collection: 'trading-bots',
        id: id as string,
      })

      if (!bot) {
        return res.status(404).json({
          success: false,
          error: 'Bot not found',
        })
      }

      // Optionally fetch real-time status from microservice
      let microserviceStatus = null
      if (bot.microserviceId) {
        try {
          const statusResult = await botMicroservice.getBotStatus(bot.microserviceId)
          if (statusResult.success) {
            microserviceStatus = statusResult.data
          }
        } catch (error) {
          console.warn('Failed to fetch microservice status:', error)
        }
      }

      res.json({
        success: true,
        data: {
          ...bot,
          microserviceStatus,
        },
      })
    } catch (error) {
      console.error('Error fetching bot:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trading bot',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Update a trading bot
 */
export const updateBotEndpoint = {
  path: '/bots/:id',
  method: 'patch',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Update bot request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading bots not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { id } = req.params
      const updates = req.body

      // Get existing bot
      const existingBot = await req.payload.findByID({
        collection: 'trading-bots',
        id: id as string,
      })

      if (!existingBot) {
        return res.status(404).json({
          success: false,
          error: 'Bot not found',
        })
      }

      // Update bot in Payload CMS
      const updatedBot = await req.payload.update({
        collection: 'trading-bots',
        id: id as string,
        data: updates,
      })

      // Sync with microservice if microserviceId exists
      if (existingBot.microserviceId) {
        try {
          const microserviceResult = await botMicroservice.updateFormula(
            existingBot.microserviceId,
            {
              name: updates.name || existingBot.name,
              symbol: updates.symbol || existingBot.symbol,
              exchange: updates.exchange || existingBot.exchange,
              is_active: updates.status === 'active',
              parameters: updates.parameters || existingBot.parameters || {},
            },
          )

          if (!microserviceResult.success) {
            console.warn('Microservice update failed:', microserviceResult.error)
          }
        } catch (microserviceError) {
          console.error('Microservice sync error:', microserviceError)
        }
      }

      res.json({
        success: true,
        data: updatedBot,
        message: 'Bot updated successfully',
      })
    } catch (error) {
      console.error('Error updating bot:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update trading bot',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Delete a trading bot
 */
export const deleteBotEndpoint = {
  path: '/bots/:id',
  method: 'delete',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Delete bot request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading bots not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { id } = req.params

      // Get existing bot
      const existingBot = await req.payload.findByID({
        collection: 'trading-bots',
        id: id as string,
      })

      if (!existingBot) {
        return res.status(404).json({
          success: false,
          error: 'Bot not found',
        })
      }

      // Delete from microservice first
      if (existingBot.microserviceId) {
        try {
          await botMicroservice.deleteFormula(existingBot.microserviceId)
        } catch (microserviceError) {
          console.error('Microservice deletion error:', microserviceError)
          // Continue with CMS deletion even if microservice fails
        }
      }

      // Delete from Payload CMS
      await req.payload.delete({
        collection: 'trading-bots',
        id: id as string,
      })

      res.json({
        success: true,
        message: 'Bot deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting bot:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete trading bot',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Start a trading bot
 */
export const startBotEndpoint = {
  path: '/bots/:id/start',
  method: 'post',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Start bot request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading bots not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { id } = req.params

      // Get existing bot
      const bot = await req.payload.findByID({
        collection: 'trading-bots',
        id: id as string,
      })

      if (!bot) {
        return res.status(404).json({
          success: false,
          error: 'Bot not found',
        })
      }

      if (!bot.microserviceId) {
        return res.status(400).json({
          success: false,
          error: 'Bot not synchronized with microservice',
        })
      }

      // Start bot in microservice
      const result = await botMicroservice.startBot(bot.microserviceId)

      if (result.success) {
        // Update status in CMS
        const updatedBot = await req.payload.update({
          collection: 'trading-bots',
          id: id as string,
          data: { status: 'active' },
        })

        res.json({
          success: true,
          data: updatedBot,
          message: 'Bot started successfully',
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to start bot',
          message: result.error,
        })
      }
    } catch (error) {
      console.error('Error starting bot:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to start trading bot',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Stop a trading bot
 */
export const stopBotEndpoint = {
  path: '/bots/:id/stop',
  method: 'post',
  handler: async (req: any, res: any) => {
    try {
      // Extract business context from request
      const businessContext = getBusinessContext(req)
      console.log(
        `Stop bot request for business: ${businessContext.business} (source: ${businessContext.source})`,
      )

      // Validate business context for Latinos-specific processing
      if (businessContext.business !== 'latinos' && businessContext.business !== 'default') {
        return res.status(400).json({
          success: false,
          error: `Trading bots not available for business: ${businessContext.business}`,
        })
      }

      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { id } = req.params

      // Get existing bot
      const bot = await req.payload.findByID({
        collection: 'trading-bots',
        id: id as string,
      })

      if (!bot) {
        return res.status(404).json({
          success: false,
          error: 'Bot not found',
        })
      }

      if (!bot.microserviceId) {
        return res.status(400).json({
          success: false,
          error: 'Bot not synchronized with microservice',
        })
      }

      // Stop bot in microservice
      const result = await botMicroservice.stopBot(bot.microserviceId)

      if (result.success) {
        // Update status in CMS
        const updatedBot = await req.payload.update({
          collection: 'trading-bots',
          id: id as string,
          data: { status: 'stopped' },
        })

        res.json({
          success: true,
          data: updatedBot,
          message: 'Bot stopped successfully',
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to stop bot',
          message: result.error,
        })
      }
    } catch (error) {
      console.error('Error stopping bot:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to stop trading bot',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

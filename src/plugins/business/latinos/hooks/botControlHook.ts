import { CollectionBeforeChangeHook } from 'payload'
import { botMicroservice } from '../services/botMicroservice'

/**
 * Bot Control Hook for Latinos Trading Bots
 * Handles bot start/stop operations via microservice integration
 * Replaces custom /bots/:id/start and /bots/:id/stop endpoints
 */
export const botControlHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only process for Latinos business context
  const businessHeader = req.headers.get?.('x-business') || (req.headers as any)['x-business']
  if (businessHeader !== 'latinos') {
    return data
  }

  // Handle bot start/stop based on status change
  if (operation === 'update' && data.status !== originalDoc?.status) {
    const microserviceId = data.microserviceId || originalDoc?.microserviceId

    if (microserviceId) {
      try {
        console.log(`Bot status change detected: ${originalDoc?.status} → ${data.status}`)

        if (data.status === 'active') {
          console.log(`Starting bot ${microserviceId} via microservice`)
          const result = await botMicroservice.startBot(microserviceId)

          if (!result.success) {
            console.error('Failed to start bot in microservice:', result.error)
            // Don't fail the update, but log the error
          } else {
            console.log('Bot started successfully in microservice')
          }
        } else if (data.status === 'stopped') {
          console.log(`Stopping bot ${microserviceId} via microservice`)
          const result = await botMicroservice.stopBot(microserviceId)

          if (!result.success) {
            console.error('Failed to stop bot in microservice:', result.error)
            // Don't fail the update, but log the error
          } else {
            console.log('Bot stopped successfully in microservice')
          }
        }
      } catch (error) {
        console.error('Bot control error:', error)
        // Don't fail the update, just log the error
        // This ensures the CMS update succeeds even if microservice is down
      }
    } else {
      console.warn('Bot status change detected but no microserviceId found')
    }
  }

  // Handle microservice sync for new bots
  if (operation === 'create' && data.status === 'active') {
    try {
      // Create bot in microservice first
      const microserviceResult = await botMicroservice.createFormula({
        name: data.name,
        symbol: data.symbol,
        exchange: data.exchange,
        strategy: data.strategy,
        parameters: data.parameters || {},
      })

      if (microserviceResult.success && microserviceResult.data?.id) {
        // Add microservice ID to the data
        data.microserviceId = microserviceResult.data.id
        console.log(`Bot created in microservice with ID: ${microserviceResult.data.id}`)

        // Start the bot if status is active
        const startResult = await botMicroservice.startBot(microserviceResult.data.id)
        if (!startResult.success) {
          console.error('Failed to start newly created bot:', startResult.error)
        }
      } else {
        console.error('Failed to create bot in microservice:', microserviceResult.error)
      }
    } catch (error) {
      console.error('Microservice sync error during bot creation:', error)
    }
  }

  return data
}

/**
 * Bot Deletion Hook
 * Handles cleanup in microservice when bot is deleted
 */
export const botDeletionHook: CollectionBeforeChangeHook = async ({ req, originalDoc }) => {
  // Only process for Latinos business context
  const businessHeader = req.headers.get?.('x-business') || (req.headers as any)['x-business']
  if (businessHeader !== 'latinos') {
    return
  }

  if (originalDoc?.microserviceId) {
    try {
      console.log(`Deleting bot ${originalDoc.microserviceId} from microservice`)
      await botMicroservice.deleteFormula(originalDoc.microserviceId)
      console.log('Bot deleted successfully from microservice')
    } catch (error) {
      console.error('Failed to delete bot from microservice:', error)
      // Continue with CMS deletion even if microservice fails
    }
  }
}

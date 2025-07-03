import { seedLatinosData, clearLatinosData } from '../seed'

/**
 * Seed endpoint for Latinos Trading Bot System
 *
 * Provides on-demand seeding capabilities for the Latinos collections.
 * Accessible at /api/latinos/seed
 */
export const seedEndpoint = {
  path: '/latinos/seed',
  method: 'post',
  handler: async (req: any, res: any) => {
    try {
      const { action = 'seed' } = req.body || {}

      // Check if user is authenticated (optional - remove if you want public access)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const startTime = Date.now()

      if (action === 'clear') {
        await clearLatinosData(req.payload)
        const duration = Date.now() - startTime

        return res.status(200).json({
          success: true,
          message: 'Latinos Trading Bot System data cleared successfully',
          duration: `${duration}ms`,
        })
      }

      if (action === 'reseed') {
        // Clear existing data first
        await clearLatinosData(req.payload)
        // Then seed fresh data
        await seedLatinosData(req.payload)
        const duration = Date.now() - startTime

        return res.status(200).json({
          success: true,
          message: 'Latinos Trading Bot System data reseeded successfully',
          duration: `${duration}ms`,
        })
      }

      // Default action: seed
      await seedLatinosData(req.payload)
      const duration = Date.now() - startTime

      return res.status(200).json({
        success: true,
        message: 'Latinos Trading Bot System seeded successfully',
        duration: `${duration}ms`,
      })
    } catch (error) {
      console.error('Error in Latinos seed endpoint:', error)

      return res.status(500).json({
        success: false,
        message: 'Failed to seed Latinos Trading Bot System',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

export default seedEndpoint

import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

// Define the collections as a standard CollectionSlug array for type safety
const standardCollections: CollectionSlug[] = [
  'team-members',
  'testimonials',
  'features',
  'pricing-plans',
  'export-transactions',
  'companies',
  'pages',
  'posts',
  'categories',
  'forms',
  'form-submissions',
  'search',
  'media',
]

// Custom collections that aren't yet in the CollectionSlug type
const customCollections = [
  'routes',
  'smart-contracts',
  'ai-providers',
  'flow-templates',
  'flow-instances',
  'organizations',
  'job-families',
  'departments',
]

// Latinos collections (trading bot system)
const latinosCollections = [
  'trading-bots',
  'trading-strategies',
  'trading-formulas',
  'trading-trades',
  'market-data',
]

const globals: GlobalSlug[] = ['header', 'footer']

export const cleanupDatabase = async (payload: Payload, req: PayloadRequest): Promise<void> => {
  payload.logger.info(`— Clearing collections and globals...`)

  // Clear the database globals
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  // We need to be careful about the order of deletion due to foreign key constraints
  // First delete collections that depend on other collections
  payload.logger.info(`— Deleting dependent collections first...`)

  // 1. First delete flow_templates since they depend on ai_providers
  try {
    await payload.db.deleteMany({ collection: 'flow-templates' as any, req, where: {} })
  } catch (error: any) {
    payload.logger.info(`— Skipping flow-templates deletion: ${error?.message || 'Unknown error'}`)
  }

  // 2. Then delete flow_instances since they depend on flow_templates
  try {
    await payload.db.deleteMany({ collection: 'flow-instances' as any, req, where: {} })
  } catch (error: any) {
    payload.logger.info(`— Skipping flow-instances deletion: ${error?.message || 'Unknown error'}`)
  }

  // 3. Delete standard collections
  for (const collection of standardCollections) {
    try {
      await payload.db.deleteMany({ collection, req, where: {} })
    } catch (error: any) {
      payload.logger.info(`— Error deleting ${collection}: ${error?.message || 'Unknown error'}`)
    }
  }

  // 4. Delete Latinos collections (trading system)
  for (const collection of latinosCollections) {
    try {
      await payload.db.deleteMany({ collection: collection as any, req, where: {} })
    } catch (error: any) {
      payload.logger.info(`— Error deleting ${collection}: ${error?.message || 'Unknown error'}`)
    }
  }

  // 5. Delete remaining custom collections
  for (const collection of customCollections) {
    try {
      await payload.db.deleteMany({ collection: collection as any, req, where: {} })
    } catch (error: any) {
      payload.logger.info(`— Error deleting ${collection}: ${error?.message || 'Unknown error'}`)
    }
  }

  // Delete versions for standard collections
  await Promise.all(
    standardCollections
      .filter((collection) => Boolean(payload.collections[collection]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  // Delete versions for custom collections (if they have versions)
  await Promise.all(
    customCollections
      .filter((collection) => Boolean((payload.collections as any)[collection]?.config.versions))
      .map((collection) =>
        payload.db.deleteVersions({ collection: collection as any, req, where: {} }),
      ),
  )

  // Delete versions for Latinos collections (if they have versions)
  await Promise.all(
    latinosCollections
      .filter((collection) => Boolean((payload.collections as any)[collection]?.config.versions))
      .map((collection) =>
        payload.db.deleteVersions({ collection: collection as any, req, where: {} }),
      ),
  )

  payload.logger.info(`— Database cleanup completed`)
}

export { standardCollections, customCollections, latinosCollections, globals }

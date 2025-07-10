import type { Payload } from 'payload'
import { teamMembers } from '../team-members'
import { getBusinessFeatures } from '../business-features'
import { testimonials } from '../testimonials'
import { pricingPlans } from '../pricing-plans'
import { businessesData } from '../businesses'

export const seedBusinessData = async (payload: Payload, image1Doc: any): Promise<void> => {
  payload.logger.info(`— Seeding custom collections...`)

  // Seed businesses first (required for dynamic business configuration)
  await Promise.all(
    businessesData.map((business) =>
      payload.create({
        collection: 'businesses',
        data: business,
      }),
    ),
  )

  // Seed team members for each business
  const businesses = ['intellitrade', 'salarium', 'latinos', 'capacita']

  for (const business of businesses) {
    await Promise.all(
      teamMembers.map((member, index) =>
        payload.create({
          collection: 'team-members',
          data: {
            ...member,
            name: `${member.name} (${business.charAt(0).toUpperCase() + business.slice(1)})`,
            business: business as 'intellitrade' | 'salarium' | 'latinos' | 'capacita',
            order: index + 1,
            // For now, use a placeholder media ID that will be replaced later
            photo: image1Doc.id,
            // Add rich text bio
            bio: {
              root: {
                children: [
                  {
                    children: [
                      {
                        text: `Bio for ${member.name} - ${member.position} at ${business.charAt(0).toUpperCase() + business.slice(1)}. This is a placeholder biography that will be replaced with real content.`,
                        type: 'text',
                      },
                    ],
                    type: 'paragraph',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1,
              },
            },
          },
        }),
      ),
    )
  }

  // Seed features for each business with business-specific features
  for (const business of businesses) {
    const businessFeatures = getBusinessFeatures(business)
    await Promise.all(
      businessFeatures.map((feature, index) =>
        payload.create({
          collection: 'features',
          data: {
            ...feature,
            business: business as 'intellitrade' | 'salarium' | 'latinos' | 'capacita',
            order: index + 1,
            // Convert string to proper enum value for category
            category: feature.category as any,
            // Assign icon ID for all features
            icon: image1Doc.id,
            // Add rich text longDescription
            longDescription: {
              root: {
                children: [
                  {
                    children: [
                      {
                        text: `${feature.description} This feature is specifically designed for ${business.charAt(0).toUpperCase() + business.slice(1)} users to enhance their workflow and productivity.`,
                        type: 'text',
                      },
                    ],
                    type: 'paragraph',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1,
              },
            },
          },
        }),
      ),
    )
  }

  // Seed testimonials for each business
  for (const business of businesses) {
    await Promise.all(
      testimonials.map((testimonial, index) =>
        payload.create({
          collection: 'testimonials',
          data: {
            ...testimonial,
            name: `${testimonial.name} (${business.charAt(0).toUpperCase() + business.slice(1)} Client)`,
            business: business as 'intellitrade' | 'salarium' | 'latinos' | 'capacita',
            // TypeScript needs help with these enum values
            rating: testimonial.rating as '3' | '4' | '5',
            // Optional photo field can use the same placeholder
            photo: image1Doc.id,
          },
        }),
      ),
    )
  }

  // Seed pricing plans for each business
  for (const business of businesses) {
    await Promise.all(
      pricingPlans.map((plan, index) =>
        payload.create({
          collection: 'pricing-plans',
          data: {
            ...plan,
            name: `${plan.name} (${business.charAt(0).toUpperCase() + business.slice(1)})`,
            business: business as 'intellitrade' | 'salarium' | 'latinos' | 'capacita',
            order: index + 1,
            // Ensure planType is properly typed
            planType: plan.planType as 'starter' | 'professional' | 'enterprise',
          },
        }),
      ),
    )
  }

  payload.logger.info(`— Business data seeded successfully`)
}

export const seedBusinessCollections = async (payload: Payload): Promise<void> => {
  payload.logger.info(`— Seeding business-specific collections...`)

  // Import seeding functions
  const { seedCompanies } = await import('../companies')
  const { seedRoutes } = await import('../routes')
  const { seedExportTransactions } = await import('../export-transactions')
  const { seedSmartContracts } = await import('../smart-contracts')
  const { seedAIProviders } = await import('../ai-providers')
  const { seedSalariumCollections } = await import('../salarium-seed')
  const { seedLatinosData } = await import('@/plugins/business/latinos/seed')

  // Seed the business data collections in the correct order
  // (1) Companies first
  const companyMap = await seedCompanies(payload)

  // (2) Routes second
  const routeMap = await seedRoutes(payload)

  // (3) Export Transactions third (with references to companies and routes)
  const transactionMap = await seedExportTransactions(payload, companyMap, routeMap)

  // (4) Smart Contracts last (with references to companies and transactions)
  await seedSmartContracts(payload, companyMap, transactionMap)

  // (5) AI Providers (independent collection)
  await seedAIProviders(payload)

  // (6) Salarium collections (HR workflow system)
  await seedSalariumCollections(payload)

  // (7) Latinos collections (Trading bot system)
  await seedLatinosData(payload)

  payload.logger.info(`— Business collections seeded successfully`)
}

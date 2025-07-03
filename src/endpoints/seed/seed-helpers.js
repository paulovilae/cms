/**
 * Seed Helper Functions
 *
 * These functions break down the seeding process into smaller, more manageable parts
 * to help identify where issues might be occurring.
 */

import { fetchFileByURL } from './fetch-helpers'
import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { features } from './features'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { intellitradeShowcase } from './intellitrade-showcase'
import { pricingPlans } from './pricing-plans'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { teamMembers } from './team-members'
import { testimonials } from './testimonials'
import { seedCompanies } from './companies'
import { seedExportTransactions } from './export-transactions'
import { seedRoutes } from './routes'
import { seedSmartContracts } from './smart-contracts'
import { seedAIProviders } from './ai-providers'
import { seedSalariumCollections } from './salarium-seed'

// Define the collections for cleaning
const standardCollections = [
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

const globals = ['header', 'footer']

/**
 * Clear all collections and globals
 */
export async function clearCollections(payload, req) {
  payload.logger.info('— Clearing collections and globals...')

  // Clear globals
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

  // Delete standard collections
  await Promise.all(
    standardCollections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  // Delete custom collections
  await Promise.all(
    customCollections.map((collection) =>
      payload.db.deleteMany({ collection: collection, req, where: {} }),
    ),
  )

  // Delete versions for standard collections
  await Promise.all(
    standardCollections
      .filter((collection) => Boolean(payload.collections[collection]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  // Delete versions for custom collections
  await Promise.all(
    customCollections
      .filter((collection) => Boolean(payload.collections[collection]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection: collection, req, where: {} })),
  )

  payload.logger.info('✅ Collections cleared successfully')
  return true
}

/**
 * Create demo author and basic categories
 */
export async function seedBasicContent(payload) {
  payload.logger.info('— Seeding demo author and categories...')

  try {
    // Delete existing demo author if exists
    await payload
      .delete({
        collection: 'users',
        depth: 0,
        where: {
          email: {
            equals: 'demo-author@example.com',
          },
        },
      })
      .catch(() => null) // Ignore if doesn't exist

    // Create demo author
    const demoAuthor = await payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    })

    // Create categories
    const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

    await Promise.all(
      categories.map((title) =>
        payload.create({
          collection: 'categories',
          data: {
            title,
            breadcrumbs: [
              {
                label: title,
                url: `/${title.toLowerCase()}`,
              },
            ],
          },
        }),
      ),
    )

    payload.logger.info('✅ Basic content seeded successfully')
    return { demoAuthor }
  } catch (error) {
    payload.logger.error('Error seeding basic content:', error)
    throw error
  }
}

/**
 * Seed media files
 */
export async function seedMedia(payload) {
  payload.logger.info('— Seeding media...')

  try {
    const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
      ),
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
      ),
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
      ),
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
      ),
    ])

    const [image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
      payload.create({
        collection: 'media',
        data: image1,
        file: image1Buffer,
      }),
      payload.create({
        collection: 'media',
        data: image2,
        file: image2Buffer,
      }),
      payload.create({
        collection: 'media',
        data: image2, // Note this uses image2 data with image3Buffer
        file: image3Buffer,
      }),
      payload.create({
        collection: 'media',
        data: imageHero1,
        file: hero1Buffer,
      }),
    ])

    payload.logger.info('✅ Media seeded successfully')
    return { image1Doc, image2Doc, image3Doc, imageHomeDoc }
  } catch (error) {
    payload.logger.error('Error seeding media:', error)
    throw error
  }
}

/**
 * Seed the custom collections (team members, features, testimonials, pricing)
 */
export async function seedCustomCollections(payload, { image1Doc }) {
  payload.logger.info('— Seeding custom collections...')

  try {
    // Seed team members
    await Promise.all(
      teamMembers.map((member) =>
        payload.create({
          collection: 'team-members',
          data: {
            ...member,
            photo: image1Doc.id,
            bio: {
              root: {
                children: [
                  {
                    children: [
                      {
                        text: `Bio for ${member.name} - ${member.position}. This is a placeholder biography that will be replaced with real content.`,
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

    // Seed features
    await Promise.all(
      features.map((feature) =>
        payload.create({
          collection: 'features',
          data: {
            ...feature,
            category: feature.category,
            icon: image1Doc.id,
            longDescription: {
              root: {
                children: [
                  {
                    children: [
                      {
                        text: `Extended description for ${feature.title}. This is a placeholder that will be replaced with real content.`,
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

    // Seed testimonials
    await Promise.all(
      testimonials.map((testimonial) =>
        payload.create({
          collection: 'testimonials',
          data: {
            ...testimonial,
            rating: testimonial.rating,
            photo: image1Doc.id,
          },
        }),
      ),
    )

    // Seed pricing plans
    await Promise.all(
      pricingPlans.map((plan) =>
        payload.create({
          collection: 'pricing-plans',
          data: {
            ...plan,
            planType: plan.planType,
          },
        }),
      ),
    )

    payload.logger.info('✅ Custom collections seeded successfully')
    return true
  } catch (error) {
    payload.logger.error('Error seeding custom collections:', error)
    throw error
  }
}

/**
 * Seed the business data collections (companies, routes, transactions, contracts)
 */
export async function seedBusinessData(payload) {
  payload.logger.info('— Seeding business data collections...')

  try {
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

    payload.logger.info('✅ Business data seeded successfully')
    return { companyMap, routeMap, transactionMap }
  } catch (error) {
    payload.logger.error('Error seeding business data:', error)
    throw error
  }
}

/**
 * Export for easy use in the API route
 */
export const seedHelpers = {
  clearCollections,
  seedBasicContent,
  seedMedia,
  seedCustomCollections,
  seedBusinessData,
}

export default seedHelpers

import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { features } from './features'
import { getBusinessFeatures } from './business-features'
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
import { seedLatinosData } from '@/plugins/business/latinos/seed'
import { seedBusinessHomepages } from './business-homepages'
import { businessesData } from './businesses'
import type { ExportTransaction } from '@/payload-types'

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

// Combined array for use in operations
const collections = [...standardCollections, ...customCollections, ...latinosCollections]

const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
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

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

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

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
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
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Technology',
        breadcrumbs: [
          {
            label: 'Technology',
            url: '/technology',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'News',
        breadcrumbs: [
          {
            label: 'News',
            url: '/news',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Finance',
        breadcrumbs: [
          {
            label: 'Finance',
            url: '/finance',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Design',
        breadcrumbs: [
          {
            label: 'Design',
            url: '/design',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Software',
        breadcrumbs: [
          {
            label: 'Software',
            url: '/software',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Engineering',
        breadcrumbs: [
          {
            label: 'Engineering',
            url: '/engineering',
          },
        ],
      },
    }),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

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

  // Get the first export transaction for the demo page
  const exportTransactions = await payload.find({
    collection: 'export-transactions',
    limit: 1,
  })

  if (exportTransactions.docs.length === 0) {
    throw new Error('No export transactions found for demo page')
  }

  const demoTransaction = exportTransactions.docs[0]

  // Get features for the demo page
  const demoFeatures = await payload.find({
    collection: 'features',
    where: {
      category: {
        in: ['escrow', 'oracle', 'payments'],
      },
    },
    limit: 4,
  })

  payload.logger.info(`— Seeding pages...`)

  const [homePage, contactPage, intellitradePage, smartContractDemoPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: {
        title: 'IntelliTrade Platform',
        slug: 'intellitrade-platform',
        meta: {
          title: 'IntelliTrade - Blockchain-Powered Trade Finance Platform',
          description:
            'Discover how IntelliTrade leverages blockchain technology and smart contracts to digitalize and streamline international trade finance for Latin American exporters and global buyers.',
          image: image2Doc.id,
        },
        hero: {
          type: 'highImpact',
          media: imageHomeDoc.id, // Add the required media field
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Revolutionizing International Trade Finance',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h1',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'A blockchain-powered platform connecting Latin American exporters with global buyers through smart escrow and oracle verification.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          links: [
            {
              link: {
                type: 'custom',
                label: 'Explore Features',
                url: '#features',
              },
            },
          ],
        },
        layout: [
          {
            blockName: 'About IntelliTrade',
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'heading',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'About IntelliTrade',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        tag: 'h2',
                        version: 1,
                      },
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'IntelliTrade is a fin-tech trade-finance platform that leverages blockchain technology and smart contracts to digitalize and streamline international trade finance, specifically focused on Latin American exporters and global buyers.',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        textFormat: 0,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            ],
          },
          {
            blockName: 'Call to Action',
            blockType: 'cta',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Ready to transform your trade finance operations?',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    tag: 'h3',
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Contact us today to learn more about how IntelliTrade can streamline your international trade process.',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            links: [
              {
                link: {
                  type: 'custom',
                  appearance: 'outline',
                  label: 'Request Demo',
                  url: '/contact',
                },
              },
            ],
          },
        ],
      },
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: {
        title: 'Smart Contract Export Demo',
        slug: 'smart-contract-export-demo',
        pageType: 'product',
        meta: {
          title: 'IntelliTrade Smart Contract Export Process Demo',
          description:
            'Interactive demonstration of how IntelliTrade uses blockchain smart contracts and oracle verification to streamline international trade finance.',
          image: image2Doc.id,
        },
        hero: {
          type: 'mediumImpact',
          media: imageHomeDoc.id,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Smart Contract Export Process',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h1',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'See how IntelliTrade uses blockchain technology and oracle verification to streamline the export verification process',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          links: [
            {
              link: {
                type: 'custom',
                label: 'Learn More',
                url: '/intellitrade-platform',
                appearance: 'outline',
              },
            },
          ],
        },
        layout: [
          {
            blockName: 'Introduction',
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'heading',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'Understanding Smart Contract Verification',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        tag: 'h2',
                        version: 1,
                      },
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'IntelliTrade leverages blockchain technology to create a transparent, secure, and efficient export verification process. Our platform uses smart contracts to automate payments based on verified milestones, eliminating traditional delays and reducing friction in international trade.',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        textFormat: 0,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            ],
          },
          {
            blockName: 'Key Benefits',
            blockType: 'feature-grid',
            heading: 'Key Benefits of Smart Contract Verification',
            description: 'See how blockchain technology transforms trade finance verification',
            layout: '2col',
            features: demoFeatures.docs.map((feature) => feature.id),
            showNumbers: true,
            animated: true,
            backgroundColor: 'light',
          },
          {
            blockName: 'Interactive Demo Content',
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'heading',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'Interactive Smart Contract Demo',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        tag: 'h2',
                        version: 1,
                      },
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'Explore the Don Hugo Peanut Export process with our interactive demonstration. Step through each verification milestone to see how oracles verify information and trigger smart contract payments.',
                            version: 1,
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        textFormat: 0,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            ],
          },
          {
            blockName: 'Statistics',
            blockType: 'stat-counter',
            heading: 'IntelliTrade Performance Metrics',
            stats: [
              {
                value: 48,
                label: 'Hours Average Processing Time',
                suffix: 'hrs',
              },
              {
                value: 35,
                label: 'Cost Savings vs Traditional Methods',
                suffix: '%',
              },
              {
                value: 99.8,
                label: 'Oracle Verification Accuracy',
                suffix: '%',
              },
              {
                value: 85,
                label: 'Advance Payment for Exporters',
                suffix: '%',
              },
            ],
          },
          {
            blockName: 'Implementation Call to Action',
            blockType: 'cta',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Ready to Implement Smart Contract Verification?',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    tag: 'h2',
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Our team can help you integrate blockchain-based verification into your export processes. Contact us today to learn how IntelliTrade can transform your international trade operations.',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            links: [
              {
                link: {
                  type: 'custom',
                  label: 'Request a Demo',
                  url: '/contact',
                  appearance: 'default',
                },
              },
              {
                link: {
                  type: 'custom',
                  label: 'Learn More',
                  url: '/intellitrade-platform',
                  appearance: 'outline',
                },
              },
            ],
          },
        ],
      },
    }),
  ])

  // Seed business-specific homepage pages
  await seedBusinessHomepages(payload, imageHomeDoc, image2Doc)

  // Seed comprehensive business pages (features, pricing, team, about, contact)
  await seedComprehensiveBusinessPages(payload, imageHomeDoc, image2Doc)

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'reference',
              label: 'IntelliTrade',
              reference: {
                relationTo: 'pages',
                value: intellitradePage.id,
              },
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Smart Contract Demo',
              reference: {
                relationTo: 'pages',
                value: smartContractDemoPage.id,
              },
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/main/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

// Seed comprehensive business pages (features, pricing, team, about, contact)
async function seedComprehensiveBusinessPages(
  payload: Payload,
  imageHomeDoc: any,
  image2Doc: any,
): Promise<void> {
  payload.logger.info('— Seeding comprehensive business pages...')

  const businesses = ['salarium', 'intellitrade', 'latinos']
  const pageTypes = ['features', 'pricing', 'team', 'about', 'contact']

  // Create pages for each business
  for (const business of businesses) {
    for (const pageType of pageTypes) {
      const businessInfo = getBusinessInfo(business)
      const pageInfo = getPageInfo(business, pageType, businessInfo)

      await payload.create({
        collection: 'pages',
        depth: 0,
        data: {
          _status: 'published',
          title: `${businessInfo.name} - ${pageInfo.title}`,
          slug: `${business}-${pageType}`,
          business: business as any,
          pageType: 'standard',
          meta: {
            title: `${businessInfo.name} ${pageInfo.title} - ${businessInfo.tagline}`,
            description: pageInfo.description,
            image: image2Doc.id,
          },
          hero: {
            type: 'mediumImpact',
            media: imageHomeDoc.id,
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: pageInfo.heroTitle,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    tag: 'h1',
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: pageInfo.heroDescription,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            links: [
              {
                link: {
                  type: 'custom',
                  label: 'Try Demo',
                  url: `/${business}?autoLogin=true`,
                },
              },
            ],
          },
          layout: [
            {
              blockName: `${pageInfo.title} Overview`,
              blockType: 'content',
              columns: [
                {
                  size: 'full',
                  richText: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'heading',
                          children: [
                            {
                              type: 'text',
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: `${businessInfo.name} ${pageInfo.title}`,
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          tag: 'h2',
                          version: 1,
                        },
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: pageInfo.content,
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          format: '',
                          indent: 0,
                          textFormat: 0,
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  },
                },
              ],
            },
          ],
        },
      })

      payload.logger.info(`— Created ${business} ${pageType} page`)
    }
  }

  payload.logger.info('— Comprehensive business pages seeded successfully!')
}

function getBusinessInfo(business: string): { name: string; tagline: string; color: string } {
  const businessData: Record<string, { name: string; tagline: string; color: string }> = {
    salarium: {
      name: 'Salarium',
      tagline: 'AI-Powered HR Solutions',
      color: 'violet',
    },
    intellitrade: {
      name: 'IntelliTrade',
      tagline: 'Blockchain-Powered Trade Finance',
      color: 'blue',
    },
    latinos: {
      name: 'Latinos',
      tagline: 'AI-Powered Trading Platform',
      color: 'orange',
    },
  }
  return businessData[business] || businessData.salarium
}

function getPageInfo(business: string, pageType: string, businessInfo: any) {
  const pageData: Record<string, any> = {
    features: {
      title: 'Features',
      heroTitle: `${businessInfo.name} Features`,
      heroDescription: `Discover the powerful features that make ${businessInfo.name} the perfect solution for your needs.`,
      description: `Explore the comprehensive features and capabilities of ${businessInfo.name}.`,
      content: `${businessInfo.name} offers a comprehensive suite of features designed to streamline your workflow and improve efficiency. Our platform combines cutting-edge technology with user-friendly design to deliver exceptional results.`,
    },
    pricing: {
      title: 'Pricing',
      heroTitle: `${businessInfo.name} Pricing`,
      heroDescription: `Choose the perfect plan for your ${businessInfo.name} needs. Transparent pricing with no hidden fees.`,
      description: `Explore ${businessInfo.name} pricing plans and find the perfect fit for your organization.`,
      content: `${businessInfo.name} offers flexible pricing plans designed to grow with your business. Choose from our range of options to find the perfect fit for your needs and budget.`,
    },
    team: {
      title: 'Team',
      heroTitle: `Meet the ${businessInfo.name} Team`,
      heroDescription: `Get to know the talented professionals behind ${businessInfo.name} who are dedicated to your success.`,
      description: `Meet the expert team behind ${businessInfo.name} and learn about their experience and expertise.`,
      content: `The ${businessInfo.name} team brings together decades of experience in technology, business, and innovation. We're passionate about delivering exceptional solutions and supporting our clients' success.`,
    },
    about: {
      title: 'About',
      heroTitle: `About ${businessInfo.name}`,
      heroDescription: `Learn about our mission, vision, and the story behind ${businessInfo.name}.`,
      description: `Discover the story behind ${businessInfo.name}, our mission, and our commitment to excellence.`,
      content: `${businessInfo.name} was founded with a vision to revolutionize the industry through innovative technology and exceptional service. Our team is committed to delivering solutions that make a real difference for our clients.`,
    },
    contact: {
      title: 'Contact',
      heroTitle: `Contact ${businessInfo.name}`,
      heroDescription: `Get in touch with our team. We're here to help you succeed with ${businessInfo.name}.`,
      description: `Contact the ${businessInfo.name} team for support, sales inquiries, or partnership opportunities.`,
      content: `We'd love to hear from you! Whether you have questions about ${businessInfo.name}, need support, or want to explore partnership opportunities, our team is ready to help.`,
    },
  }

  return pageData[pageType] || pageData.features
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}

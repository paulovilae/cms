import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

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
]

// Combined array for use in operations
const collections = [...standardCollections, ...customCollections]

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

  // Delete standard collections
  await Promise.all(
    standardCollections.map((collection) => 
      payload.db.deleteMany({ collection, req, where: {} })
    ),
  )
  
  // Delete custom collections with type assertion
  await Promise.all(
    customCollections.map((collection) => 
      payload.db.deleteMany({ collection: collection as any, req, where: {} })
    ),
  )

  // Delete versions for standard collections
  await Promise.all(
    standardCollections
      .filter((collection) => Boolean(payload.collections[collection]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )
  
  // Delete versions for custom collections (if they have versions)
  await Promise.all(
    customCollections
      .filter((collection) => Boolean(payload.collections[collection as any]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection: collection as any, req, where: {} })),
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

  // Seed team members
  await Promise.all(
    teamMembers.map((member) =>
      payload.create({
        collection: 'team-members',
        data: {
          ...member,
          // For now, use a placeholder media ID that will be replaced later
          photo: image1Doc.id,
          // Add rich text bio
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
          // TypeScript needs help with these enum values
          rating: testimonial.rating as '3' | '4' | '5',
          // Optional photo field can use the same placeholder
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
          // Ensure planType is properly typed
          planType: plan.planType as 'starter' | 'professional' | 'enterprise',
        },
      }),
    ),
  )

  // Seed the business data collections in the correct order
  // (1) Companies first
  const companyMap = await seedCompanies(payload)
  
  // (2) Routes second
  const routeMap = await seedRoutes(payload)
  
  // (3) Export Transactions third (with references to companies and routes)
  const transactionMap = await seedExportTransactions(payload, companyMap, routeMap)
  
  // (4) Smart Contracts last (with references to companies and transactions)
  await seedSmartContracts(payload, companyMap, transactionMap)

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
            blockName: 'Interactive Demo',
            blockType: 'smart-contract-demo',
            heading: 'Interactive Smart Contract Demo',
            description:
              'Explore the Don Hugo Peanut Export process with our interactive demonstration. Step through each verification milestone to see how oracles verify information and trigger smart contract payments.',
            // Use a number type for the ID since that's what the relationship field expects
            transaction: demoTransaction ? demoTransaction.id : 0,
            showTechnicalDetails: true,
            animationSpeed: 'medium',
            interactiveMode: 'both',
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

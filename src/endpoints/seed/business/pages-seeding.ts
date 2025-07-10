import type { Payload } from 'payload'
import { home } from '../home'
import { contact as contactPageData } from '../contact-page'
import { seedBusinessHomepages } from '../business-homepages'

export const seedPages = async (
  payload: Payload,
  imageHomeDoc: any,
  image2Doc: any,
  contactForm: any,
): Promise<{
  homePage: any
  contactPage: any
  intellitradePage: any
  smartContractDemoPage: any
}> => {
  payload.logger.info(`— Seeding pages...`)

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
    createSmartContractDemoPage(payload, imageHomeDoc, image2Doc, demoFeatures),
  ])

  // Seed business-specific homepage pages
  await seedBusinessHomepages(payload, imageHomeDoc, image2Doc)

  // Seed comprehensive business pages (features, pricing, team, about, contact)
  await seedComprehensiveBusinessPages(payload, imageHomeDoc, image2Doc)

  return {
    homePage,
    contactPage,
    intellitradePage,
    smartContractDemoPage,
  }
}

async function createSmartContractDemoPage(
  payload: Payload,
  imageHomeDoc: any,
  image2Doc: any,
  demoFeatures: any,
): Promise<any> {
  return payload.create({
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
          features: demoFeatures.docs.map((feature: any) => feature.id),
          showNumbers: true,
          animated: true,
          backgroundColor: 'light',
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
      ],
    },
  })
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
  return businessData[business] ?? businessData.salarium
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

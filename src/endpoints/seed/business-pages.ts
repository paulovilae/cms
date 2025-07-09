import type { Payload } from 'payload'

type BusinessMode = 'salarium' | 'intellitrade' | 'latinos'
type PageType = 'features' | 'pricing' | 'team' | 'about' | 'contact'

export const seedBusinessPages = async (payload: Payload, imageHomeDoc: any, image2Doc: any) => {
  payload.logger.info('— Seeding comprehensive business pages...')

  const businesses: BusinessMode[] = ['salarium', 'intellitrade', 'latinos']
  const pageTypes: PageType[] = ['features', 'pricing', 'team', 'about', 'contact']

  // Create pages for each business
  for (const business of businesses) {
    for (const pageType of pageTypes) {
      const pageData = getPageData(business, pageType, imageHomeDoc, image2Doc)

      await payload.create({
        collection: 'pages',
        depth: 0,
        data: pageData,
      })

      payload.logger.info(`— Created ${business} ${pageType} page`)
    }
  }

  payload.logger.info('— Comprehensive business pages seeded successfully!')
}

function getPageData(
  business: BusinessMode,
  pageType: PageType,
  imageHomeDoc: any,
  image2Doc: any,
) {
  const businessInfo = getBusinessInfo(business)
  const pageInfo = getPageInfo(business, pageType)

  return {
    _status: 'published' as const,
    title: `${businessInfo.name} - ${pageInfo.title}`,
    slug: `${business}-${pageType}`,
    business: business as BusinessMode,
    pageType: 'standard' as const,
    meta: {
      title: `${businessInfo.name} ${pageInfo.title} - ${businessInfo.tagline}`,
      description: pageInfo.description,
      image: image2Doc.id,
    },
    hero: {
      type: 'mediumImpact' as const,
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
      links: pageInfo.heroLinks,
    },
    layout: pageInfo.layout,
  }
}

function getBusinessInfo(business: BusinessMode) {
  const businessData: Record<BusinessMode, { name: string; tagline: string; color: string }> = {
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
  return businessData[business]
}

function getPageInfo(business: BusinessMode, pageType: PageType) {
  const businessInfo = getBusinessInfo(business)

  const pageData: Record<PageType, any> = {
    features: {
      title: 'Features',
      heroTitle: `${businessInfo.name} Features`,
      heroDescription: `Discover the powerful features that make ${businessInfo.name} the perfect solution for your needs.`,
      description: `Explore the comprehensive features and capabilities of ${businessInfo.name}.`,
      heroLinks: [
        {
          link: {
            type: 'custom',
            label: 'Try Demo',
            url: `/${business}?autoLogin=true`,
          },
        },
      ],
      layout: [
        {
          blockName: 'Features Overview',
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
                          text: `${businessInfo.name} Features`,
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
                          text: `${businessInfo.name} offers a comprehensive suite of features designed to streamline your workflow and improve efficiency. Our platform combines cutting-edge technology with user-friendly design to deliver exceptional results.`,
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
          blockName: 'Features Grid',
          blockType: 'feature-grid',
          heading: 'Core Features',
          description: 'Everything you need to succeed',
          layout: '3col',
          showNumbers: true,
          animated: true,
          backgroundColor: 'light',
          features: [], // Will be populated with business-specific features
        },
      ],
    },
    pricing: {
      title: 'Pricing',
      heroTitle: `${businessInfo.name} Pricing`,
      heroDescription: `Choose the perfect plan for your ${businessInfo.name} needs. Transparent pricing with no hidden fees.`,
      description: `Explore ${businessInfo.name} pricing plans and find the perfect fit for your organization.`,
      heroLinks: [
        {
          link: {
            type: 'custom',
            label: 'Start Free Trial',
            url: `/${business}?autoLogin=true`,
          },
        },
      ],
      layout: [
        {
          blockName: 'Pricing Overview',
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
                          text: 'Simple, Transparent Pricing',
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
                          text: `${businessInfo.name} offers flexible pricing plans designed to grow with your business. Choose from our range of options to find the perfect fit for your needs and budget.`,
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
    team: {
      title: 'Team',
      heroTitle: `Meet the ${businessInfo.name} Team`,
      heroDescription: `Get to know the talented professionals behind ${businessInfo.name} who are dedicated to your success.`,
      description: `Meet the expert team behind ${businessInfo.name} and learn about their experience and expertise.`,
      heroLinks: [
        {
          link: {
            type: 'custom',
            label: 'Join Our Team',
            url: `/${business}/contact`,
          },
        },
      ],
      layout: [
        {
          blockName: 'Team Overview',
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
                          text: `Our Expert Team`,
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
                          text: `The ${businessInfo.name} team brings together decades of experience in technology, business, and innovation. We're passionate about delivering exceptional solutions and supporting our clients' success.`,
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
    about: {
      title: 'About',
      heroTitle: `About ${businessInfo.name}`,
      heroDescription: `Learn about our mission, vision, and the story behind ${businessInfo.name}.`,
      description: `Discover the story behind ${businessInfo.name}, our mission, and our commitment to excellence.`,
      heroLinks: [
        {
          link: {
            type: 'custom',
            label: 'Contact Us',
            url: `/${business}/contact`,
          },
        },
      ],
      layout: [
        {
          blockName: 'About Overview',
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
                          text: `Our Story`,
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
                          text: `${businessInfo.name} was founded with a vision to revolutionize the industry through innovative technology and exceptional service. Our team is committed to delivering solutions that make a real difference for our clients.`,
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
    contact: {
      title: 'Contact',
      heroTitle: `Contact ${businessInfo.name}`,
      heroDescription: `Get in touch with our team. We're here to help you succeed with ${businessInfo.name}.`,
      description: `Contact the ${businessInfo.name} team for support, sales inquiries, or partnership opportunities.`,
      heroLinks: [
        {
          link: {
            type: 'custom',
            label: 'Try Demo',
            url: `/${business}?autoLogin=true`,
          },
        },
      ],
      layout: [
        {
          blockName: 'Contact Information',
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
                          text: `Get in Touch`,
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
                          text: `We'd love to hear from you! Whether you have questions about ${businessInfo.name}, need support, or want to explore partnership opportunities, our team is ready to help.`,
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
  }

  return pageData[pageType]
}

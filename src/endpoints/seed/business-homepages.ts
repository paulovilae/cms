import type { Payload } from 'payload'

export const seedBusinessHomepages = async (
  payload: Payload,
  imageHomeDoc: any,
  image2Doc: any,
) => {
  payload.logger.info('— Seeding business homepage pages...')

  // Salarium Homepage
  const salariumHomepage = await payload.create({
    collection: 'pages',
    depth: 0,
    data: {
      _status: 'published',
      title: 'Salarium - Streamline Your HR Workflows',
      slug: 'salarium-home',
      business: 'salarium',
      pageType: 'homepage',
      meta: {
        title: 'Salarium - AI-Powered HR Document Workflow Platform',
        description:
          'Transform how you create, manage, and process HR documentation with our AI-powered workflow platform designed for modern organizations.',
        image: image2Doc.id,
      },
      hero: {
        type: 'highImpact',
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
                    text: 'Streamline Your HR Workflows',
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
                    text: 'AI-powered HR document workflow platform that transforms how you create, manage, and process HR documentation.',
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
              label: 'Try Live Demo',
              url: '/salarium/demo',
            },
          },
        ],
      },
      layout: [
        {
          blockName: 'Salarium Features',
          blockType: 'feature-grid',
          heading: 'Powerful HR Features',
          description: 'Everything you need to manage HR workflows efficiently',
          layout: '2col',
          showNumbers: false,
          animated: true,
          backgroundColor: 'light',
          features: [], // Will be populated with HR-specific features
        },
        {
          blockName: 'HR Statistics',
          blockType: 'stat-counter',
          heading: 'Salarium Performance',
          stats: [
            {
              value: 75,
              label: 'Time Saved on Document Processing',
              suffix: '%',
            },
            {
              value: 24,
              label: 'Hours Faster Document Generation',
              suffix: 'hrs',
            },
            {
              value: 99,
              label: 'Document Accuracy Rate',
              suffix: '%',
            },
            {
              value: 50,
              label: 'Reduction in Manual Tasks',
              suffix: '%',
            },
          ],
        },
        {
          blockName: 'Salarium CTA',
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
                      text: 'Ready to Transform Your HR Operations?',
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
                      text: 'Join thousands of HR professionals who have streamlined their workflows with Salarium.',
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
                label: 'Start Free Trial',
                url: '/salarium/signup',
                appearance: 'default',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Schedule Demo',
                url: '/contact',
                appearance: 'outline',
              },
            },
          ],
        },
      ],
    },
  })

  // IntelliTrade Homepage
  const intellitradeHomepage = await payload.create({
    collection: 'pages',
    depth: 0,
    data: {
      _status: 'published',
      title: 'IntelliTrade - Blockchain Trade Finance Platform',
      slug: 'intellitrade-home',
      business: 'intellitrade',
      pageType: 'homepage',
      meta: {
        title: 'IntelliTrade - Revolutionize International Trade Finance',
        description:
          'Blockchain-powered trade finance platform connecting Latin American exporters with global buyers through smart contracts and oracle verification.',
        image: image2Doc.id,
      },
      hero: {
        type: 'highImpact',
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
                    text: 'Revolutionary Trade Finance',
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
                    text: 'Blockchain-powered platform connecting Latin American exporters with global buyers through smart escrow and oracle verification.',
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
              url: '/smart-contract-export-demo',
            },
          },
        ],
      },
      layout: [
        {
          blockName: 'IntelliTrade Features',
          blockType: 'feature-grid',
          heading: 'Revolutionary Trade Finance',
          description: 'Blockchain technology meets international trade',
          layout: '2col',
          showNumbers: false,
          animated: true,
          backgroundColor: 'light',
          features: [], // Will be populated with trade finance features
        },
        {
          blockName: 'Trade Finance Statistics',
          blockType: 'stat-counter',
          heading: 'IntelliTrade Performance',
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
          blockName: 'IntelliTrade CTA',
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
                      text: 'Ready to Transform Your Trade Finance?',
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
                      text: 'Join the revolution in international trade finance with blockchain technology.',
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
                label: 'Request Demo',
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
  })

  // Latinos Homepage
  const latinosHomepage = await payload.create({
    collection: 'pages',
    depth: 0,
    data: {
      _status: 'published',
      title: 'Latinos - Automated Trading Bot Platform',
      slug: 'latinos-home',
      business: 'latinos',
      pageType: 'homepage',
      meta: {
        title: 'Latinos - Advanced AI-Powered Trading Platform',
        description:
          'Automated trading platform with AI-powered bots for stock market operations, real-time analytics, and performance optimization.',
        image: image2Doc.id,
      },
      hero: {
        type: 'highImpact',
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
                    text: 'Advanced Trading Features',
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
                    text: 'AI-powered automated trading platform with advanced bots for stock market operations and real-time performance optimization.',
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
              url: '/latinos/dashboard',
            },
          },
        ],
      },
      layout: [
        {
          blockName: 'Latinos Features',
          blockType: 'feature-grid',
          heading: 'Advanced Trading Features',
          description: 'Everything you need for automated trading success',
          layout: '2col',
          showNumbers: false,
          animated: true,
          backgroundColor: 'light',
          features: [], // Will be populated with trading features
        },
        {
          blockName: 'Trading Statistics',
          blockType: 'stat-counter',
          heading: 'Latinos Performance',
          stats: [
            {
              value: 95,
              label: 'Trading Accuracy Rate',
              suffix: '%',
            },
            {
              value: 24,
              label: 'Hours of Continuous Trading',
              suffix: '/7',
            },
            {
              value: 150,
              label: 'Milliseconds Average Execution Time',
              suffix: 'ms',
            },
            {
              value: 8,
              label: 'Active Trading Strategies',
              suffix: '+',
            },
          ],
        },
        {
          blockName: 'Latinos CTA',
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
                      text: 'Ready to Automate Your Trading?',
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
                      text: 'Join thousands of traders who have automated their strategies with Latinos.',
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
                label: 'Start Trading',
                url: '/latinos/signup',
                appearance: 'default',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'View Strategies',
                url: '/latinos/strategies',
                appearance: 'outline',
              },
            },
          ],
        },
      ],
    },
  })

  payload.logger.info('— Business homepage pages seeded successfully!')

  return {
    salariumHomepage,
    intellitradeHomepage,
    latinosHomepage,
  }
}

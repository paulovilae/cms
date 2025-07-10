import type { Payload } from 'payload'

export const seedPosts = async (
  payload: Payload,
  demoAuthor: any,
  image1Doc: any,
  image2Doc: any,
  image3Doc: any,
): Promise<void> => {
  payload.logger.info('— Seeding posts...')

  await payload.create({
    collection: 'posts',
    data: {
      title: 'Revolutionizing Trade Finance with Blockchain Technology',
      slug: 'revolutionizing-trade-finance-blockchain',
      _status: 'published',
      meta: {
        title: 'Revolutionizing Trade Finance with Blockchain Technology',
        description:
          'Discover how blockchain technology is transforming international trade finance, reducing processing times from weeks to hours.',
        image: image1Doc.id,
      },
      heroImage: image1Doc.id,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The traditional trade finance industry has long been plagued by inefficiencies, with transactions taking weeks to process and involving multiple intermediaries. Our blockchain-based platform is changing this paradigm by introducing smart contracts, automated verification, and real-time transparency.',
                },
              ],
              version: 1,
            },
            {
              type: 'heading',
              children: [
                {
                  text: 'Key Benefits of Blockchain Trade Finance:',
                },
              ],
              tag: 'h3',
              version: 1,
            },
            {
              type: 'list',
              children: [
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Reduced processing time from weeks to under 48 hours',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Lower transaction costs through elimination of intermediaries',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Enhanced security through cryptographic verification',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Real-time tracking and transparency for all parties',
                    },
                  ],
                  version: 1,
                },
              ],
              listType: 'bullet',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: 'industry',
      readingTime: 5,
      expertiseLevel: 'intermediate',
      featuredPost: true,
      authors: [demoAuthor.id],
      categories: [],
      publishedAt: new Date().toISOString(),
      populatedAuthors: [
        {
          id: demoAuthor.id,
          name: demoAuthor.name,
        },
      ],
    },
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: 'The Future of AI-Powered HR: Transforming Talent Management',
      slug: 'future-ai-powered-hr-talent-management',
      _status: 'published',
      meta: {
        title: 'The Future of AI-Powered HR: Transforming Talent Management',
        description:
          'Explore how artificial intelligence is revolutionizing human resources, from automated job descriptions to predictive analytics.',
        image: image2Doc.id,
      },
      heroImage: image2Doc.id,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The human resources landscape is undergoing a dramatic transformation driven by artificial intelligence and machine learning technologies. Modern HR platforms are moving beyond simple automation to provide intelligent insights that help organizations make better decisions about their most valuable asset: their people.',
                },
              ],
              version: 1,
            },
            {
              type: 'heading',
              children: [
                {
                  text: 'AI-Powered HR Capabilities:',
                },
              ],
              tag: 'h3',
              version: 1,
            },
            {
              type: 'list',
              children: [
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Intelligent job description generation with market alignment',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Automated compensation analysis and pay equity recommendations',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Predictive analytics for employee retention and performance',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Streamlined workflow automation and compliance tracking',
                    },
                  ],
                  version: 1,
                },
              ],
              listType: 'bullet',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: 'educational',
      readingTime: 4,
      expertiseLevel: 'beginner',
      featuredPost: false,
      authors: [demoAuthor.id],
      categories: [],
      publishedAt: new Date().toISOString(),
      populatedAuthors: [
        {
          id: demoAuthor.id,
          name: demoAuthor.name,
        },
      ],
    },
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: 'Automated Trading: The Evolution of Financial Markets',
      slug: 'automated-trading-evolution-financial-markets',
      _status: 'published',
      meta: {
        title: 'Automated Trading: The Evolution of Financial Markets',
        description:
          'Learn how automated trading systems are reshaping financial markets with algorithmic strategies and real-time execution.',
        image: image3Doc.id,
      },
      heroImage: image3Doc.id,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The financial markets have evolved dramatically with the introduction of sophisticated automated trading systems. These platforms leverage advanced algorithms, real-time market data, and machine learning to execute trades with unprecedented speed and accuracy.',
                },
              ],
              version: 1,
            },
            {
              type: 'heading',
              children: [
                {
                  text: 'Advantages of Automated Trading:',
                },
              ],
              tag: 'h3',
              version: 1,
            },
            {
              type: 'list',
              children: [
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Elimination of emotional decision-making in trading',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: '24/7 market monitoring and execution capabilities',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Backtesting and optimization of trading strategies',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'listitem',
                  children: [
                    {
                      text: 'Risk management through automated stop-losses and position sizing',
                    },
                  ],
                  version: 1,
                },
              ],
              listType: 'bullet',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: 'industry',
      readingTime: 6,
      expertiseLevel: 'advanced',
      featuredPost: false,
      authors: [demoAuthor.id],
      categories: [],
      publishedAt: new Date().toISOString(),
      populatedAuthors: [
        {
          id: demoAuthor.id,
          name: demoAuthor.name,
        },
      ],
    },
  })

  payload.logger.info('✓ Posts seeded successfully')
}

export const seedContactForm = async (payload: Payload): Promise<any> => {
  payload.logger.info('— Seeding contact form...')

  const contactForm = await payload.create({
    collection: 'forms',
    data: {
      title: 'Contact Form',
      fields: [
        {
          name: 'name',
          label: 'Name',
          width: 50,
          required: true,
          blockType: 'text',
        },
        {
          name: 'email',
          label: 'Email',
          width: 50,
          required: true,
          blockType: 'email',
        },
        {
          name: 'company',
          label: 'Company',
          width: 50,
          required: false,
          blockType: 'text',
        },
        {
          name: 'industry',
          label: 'Industry',
          width: 50,
          required: false,
          blockType: 'select',
          options: [
            {
              label: 'Trade Finance',
              value: 'trade-finance',
            },
            {
              label: 'Human Resources',
              value: 'human-resources',
            },
            {
              label: 'Financial Trading',
              value: 'financial-trading',
            },
            {
              label: 'Training & Education',
              value: 'training-education',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
        },
        {
          name: 'message',
          label: 'Message',
          width: 100,
          required: true,
          blockType: 'textarea',
        },
      ],
      confirmationType: 'message',
      confirmationMessage: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Thank you for your message. We will get back to you soon.',
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      emails: [
        {
          emailTo: 'contact@example.com',
          cc: '',
          bcc: '',
          replyTo: '',
          emailFrom: '',
          subject: 'New Contact Form Submission',
          message: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'A new contact form submission has been received.',
                    },
                  ],
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
  })

  payload.logger.info('✓ Contact form seeded successfully')
  return contactForm
}

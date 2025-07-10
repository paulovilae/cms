import type { Payload } from 'payload'

export const seedGlobals = async (
  payload: Payload,
  intellitradePage: any,
  smartContractDemoPage: any,
  contactPage: any,
): Promise<void> => {
  payload.logger.info('— Seeding globals...')

  // Seed Header global
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: intellitradePage.id,
            },
            label: 'IntelliTrade',
          },
        },
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: smartContractDemoPage.id,
            },
            label: 'Smart Contract Demo',
          },
        },
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: contactPage.id,
            },
            label: 'Contact',
          },
        },
      ],
    },
  })

  // Seed Footer global
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      navItems: [
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: intellitradePage.id,
            },
            label: 'IntelliTrade',
          },
        },
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: smartContractDemoPage.id,
            },
            label: 'Smart Contract Demo',
          },
        },
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: contactPage.id,
            },
            label: 'Contact',
          },
        },
      ],
    },
  })

  payload.logger.info('✓ Globals seeded successfully')
}

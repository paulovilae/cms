import React from 'react'
import { draftMode } from 'next/headers'

import type { Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { IntelliTradeHomepage } from '@/components/business/intellitrade/Homepage'

// Force dynamic rendering to ensure business mode is detected correctly
export const dynamic = 'force-dynamic'

export default async function IntelliTradePage() {
  const { isEnabled: isDraftMode } = await draftMode()

  let url: string
  if (isDraftMode) {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=intellitrade-home&draft=true&depth=1`
  } else {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=intellitrade-home&depth=1`
  }

  const page: Page = await fetch(url, {
    next: { revalidate: isDraftMode ? 0 : 600 },
  })
    ?.then((res) => res.json())
    ?.then((res) => res?.docs?.[0])
    ?.catch(() => null)

  // If we have a CMS page, render it
  if (page) {
    return (
      <article>
        <RenderHero {...page.hero} />
        <RenderBlocks blocks={page.layout} />
      </article>
    )
  }

  // Otherwise, render the IntelliTrade homepage component
  return <IntelliTradeHomepage />
}

export async function generateMetadata() {
  return generateMeta({
    doc: {
      meta: {
        title: 'IntelliTrade - Blockchain Trade Finance Platform',
        description:
          'Revolutionize international trade finance with blockchain technology, smart contracts, and automated verification for Latin American exporters.',
      },
    },
  })
}

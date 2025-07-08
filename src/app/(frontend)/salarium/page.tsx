import React from 'react'
import { draftMode } from 'next/headers'

import type { Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { SalariumHomepage } from '@/components/business/salarium/Homepage'

// Force dynamic rendering to ensure business mode is detected correctly
export const dynamic = 'force-dynamic'

export default async function SalariumPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  let url: string
  if (isDraftMode) {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=salarium-home&draft=true&depth=1`
  } else {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=salarium-home&depth=1`
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

  // Otherwise, render the Salarium homepage component
  return <SalariumHomepage />
}

export async function generateMetadata() {
  return generateMeta({
    doc: {
      meta: {
        title: 'Salarium - Streamline Your HR Workflows',
        description:
          'AI-powered HR document workflow platform that transforms how you create, manage, and process HR documentation.',
      },
    },
  })
}

import React from 'react'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import type { Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { getCurrentBranding, getOrganizationInfo } from '@/utilities/branding'
import { getBusinessMode } from '@/utilities/environment'
import { shouldRedirectToBusiness, getBusinessBaseURL } from '@/utilities/urlBranding'

// Import business-specific homepage components
import { IntelliTradeHomepage } from '@/components/business/intellitrade/Homepage'
import { SalariumHomepage } from '@/components/business/salarium/Homepage'
import { LatinosHomepage } from '@/components/business/latinos/Homepage'
import { MultiTenantHomepage } from '@/components/business/all/Homepage'

export default async function Page() {
  // Check if we should redirect to a business-specific URL
  const redirectInfo = shouldRedirectToBusiness()
  if (redirectInfo.redirect && redirectInfo.business) {
    const businessURL = getBusinessBaseURL(redirectInfo.business)
    redirect(businessURL)
  }

  const { isEnabled: isDraftMode } = await draftMode()
  const businessMode = getBusinessMode()
  const branding = getCurrentBranding()

  let url: string
  if (isDraftMode) {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=home&draft=true&depth=1`
  } else {
    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=home&depth=1`
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

  // Otherwise, render business-specific homepage
  switch (businessMode) {
    case 'intellitrade':
      return <IntelliTradeHomepage />
    case 'salarium':
      return <SalariumHomepage />
    case 'latinos':
      return <LatinosHomepage />
    case 'all':
      return <MultiTenantHomepage />
    default:
      return <IntelliTradeHomepage />
  }
}

export async function generateMetadata() {
  const branding = getCurrentBranding()

  return generateMeta({
    doc: {
      meta: {
        title: `${branding.displayName} - ${branding.tagline}`,
        description: branding.description,
      },
    },
  })
}

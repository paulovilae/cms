import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { BusinessHeader } from '@/components/business/universal/BusinessHeader'
import { BusinessFooter } from '@/components/business/universal/BusinessFooter'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode, headers } from 'next/headers'
import { getCurrentBranding, getBrandingCSSVars } from '@/utilities/branding'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const branding = getCurrentBranding()
  const brandingVars = getBrandingCSSVars()

  // Check if we're on a business route - ONLY for specific business paths
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // Only match exact business routes, not admin, api, posts, etc.
  const businessMatch = pathname.match(/^\/(intellitrade|salarium|latinos|capacita)(?:\/|$)/)
  const business = businessMatch?.[1]
  const isBusinessRoute = !!business

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { ${Object.entries(brandingVars)
              .map(([key, value]) => `${key}: ${value}`)
              .join('; ')} }`,
          }}
        />
      </head>
      <body data-business={branding.name}>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          {isBusinessRoute ? <BusinessHeader business={business} /> : <Header />}
          {children}
          {isBusinessRoute ? <BusinessFooter business={business} /> : <Footer />}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: getCurrentBranding().social.twitter,
  },
}

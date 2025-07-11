import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import React from 'react'
// Remove the non-existent import
// import PageClient from '../[slug]/page.client'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export const metadata: Metadata = {
  title: 'Features | IntelliTrade Platform',
  description: 'Explore the powerful features of the IntelliTrade platform',
}

export default async function FeaturesPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch the features page
  const pageResult = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'features',
      },
    },
    depth: 2, // Ensure we load related content
  })

  const page = pageResult.docs[0]

  return (
    <article className="pt-16 pb-24">
      {/* Just render the hero and layout blocks as configured in the CMS */}
      {page && (
        <>
          {page.hero && (
            <div className="mb-12">
              <RenderHero {...page.hero} />
            </div>
          )}

          {page.layout && (
            <div>
              <RenderBlocks blocks={page.layout} />
            </div>
          )}
        </>
      )}

      {/* Fallback if no page is found */}
      {!page && (
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Platform Features</h1>
          <p className="text-center">
            Please create a &ldquo;features&rdquo; page in the CMS to manage feature content.
          </p>
        </div>
      )}
    </article>
  )
}

import type { Payload, PayloadRequest } from 'payload'

// Import core modules
import { cleanupDatabase } from './core/cleanup'
import { seedMediaAndUsers, seedCategories } from './core/media-seeding'
import { seedPosts, seedContactForm } from './core/posts-seeding'
import { seedGlobals } from './core/globals-seeding'

// Import business modules
import { seedBusinessData, seedBusinessCollections } from './business/business-data'
import { seedPages } from './business/pages-seeding'

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // Step 1: Clean up existing data
  await cleanupDatabase(payload, req)

  // Step 2: Seed media, users, and categories
  const { demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc } =
    await seedMediaAndUsers(payload)
  await seedCategories(payload)

  // Step 3: Seed posts and contact form
  await seedPosts(payload, demoAuthor, image1Doc, image2Doc, image3Doc)
  const contactForm = await seedContactForm(payload)

  // Step 4: Seed business data (team members, features, testimonials, pricing plans)
  await seedBusinessData(payload, image1Doc)

  // Step 5: Seed business-specific collections (companies, routes, transactions, etc.)
  await seedBusinessCollections(payload)

  // Step 6: Seed pages (home, contact, business pages)
  const { homePage, contactPage, intellitradePage, smartContractDemoPage } = await seedPages(
    payload,
    imageHomeDoc,
    image2Doc,
    contactForm,
  )

  // Step 7: Seed globals (header, footer navigation)
  await seedGlobals(payload, intellitradePage, smartContractDemoPage, contactPage)

  payload.logger.info('Seeded database successfully!')
}

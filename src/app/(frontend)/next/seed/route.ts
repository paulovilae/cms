import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed'
import { seedHelpers } from '@/endpoints/seed/seed-helpers'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 300 // Increase timeout for full seeding process

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    // Parse URL and check for parameters
    const url = new URL(request.url)
    const testMode = url.searchParams.get('mode') === 'test'
    const phase = url.searchParams.get('phase')

    // Create a Payload request object to pass to the Local API for transactions
    const payloadReq = await createLocalReq({ user }, payload)

    // Test mode - just return success without seeding
    if (testMode) {
      payload.logger.info('Running in test mode - minimal seeding for debugging')
      return Response.json({ success: true, message: 'Test mode successful' })
    }

    // Phased seeding
    if (phase) {
      payload.logger.info(`Running seeding phase: ${phase}`)

      try {
        let result = null

        switch (phase) {
          case 'clear':
            // Clear collections and globals
            await seedHelpers.clearCollections(payload, payloadReq)
            break

          case 'basic':
            // Seed basic content (users, categories)
            result = await seedHelpers.seedBasicContent(payload)
            break

          case 'media':
            // Seed media
            result = await seedHelpers.seedMedia(payload)
            break

          case 'custom':
            // Need media first
            const media = await seedHelpers.seedMedia(payload)
            // Seed custom collections
            await seedHelpers.seedCustomCollections(payload, { image1Doc: media.image1Doc })
            break

          case 'business':
            // Seed business data
            await seedHelpers.seedBusinessData(payload)
            break

          default:
            return Response.json(
              {
                success: false,
                message: `Unknown phase: ${phase}`,
              },
              { status: 400 },
            )
        }

        return Response.json({
          success: true,
          message: `Phase '${phase}' completed successfully`,
          result,
        })
      } catch (phaseError) {
        const error = phaseError as Error
        payload.logger.error({
          err: error,
          message: `Error in seeding phase: ${phase}`,
          stack: error.stack,
        })

        return Response.json(
          {
            success: false,
            message: `Phase '${phase}' failed: ${error.message}`,
            error: error.message,
          },
          { status: 500 },
        )
      }
    }

    // Full seeding (no phase specified)
    await seed({ payload, req: payloadReq })
    return Response.json({ success: true })
  } catch (e) {
    // Enhanced error logging
    const error = e as Error
    payload.logger.error({
      err: e,
      message: 'Error seeding data',
      stack: error.stack,
      name: error.name,
    })

    // Return more detailed error information
    return new Response(
      JSON.stringify({
        error: 'Error seeding data',
        message: error.message || 'Unknown error',
        name: error.name || 'UnknownError',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

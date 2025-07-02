import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { testConnection } from '@/plugins/shared/ai-management/endpoints/test-connection'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Parse request body
    const body = await request.json()
    const { id, provider, baseUrl, apiKey, model, testEndpoint } = body

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 })
    }

    // Test the connection
    const testResult = await testConnection(
      { user: null } as any, // Mock request for now
      {
        provider,
        baseUrl,
        apiKey,
        model,
        testEndpoint,
      },
    )

    // If we have an ID, update the provider record with test results
    if (id) {
      try {
        await payload.update({
          collection: 'ai-providers',
          id,
          data: {
            connectionStatus: testResult.status,
            lastTestDate: new Date().toISOString(),
            lastTestError: testResult.error || null,
            responseTimeMs: testResult.responseTimeMs || null,
            availableModels: testResult.availableModels
              ? JSON.stringify(testResult.availableModels)
              : null,
          },
        })
      } catch (updateError) {
        console.error('Failed to update provider record:', updateError)
        // Don't fail the test if we can't update the record
      }
    }

    return NextResponse.json({
      success: testResult.success,
      status: testResult.status,
      responseTimeMs: testResult.responseTimeMs,
      error: testResult.error,
      availableModels: testResult.availableModels,
    })
  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}

// Also support GET for simple health checks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const provider = searchParams.get('provider')
  const baseUrl = searchParams.get('baseUrl')

  if (!provider) {
    return NextResponse.json({ error: 'Provider parameter is required' }, { status: 400 })
  }

  try {
    const testResult = await testConnection({ user: null } as any, {
      provider,
      baseUrl: baseUrl || undefined,
    })

    return NextResponse.json({
      success: testResult.success,
      status: testResult.status,
      responseTimeMs: testResult.responseTimeMs,
      error: testResult.error,
      availableModels: testResult.availableModels,
    })
  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}

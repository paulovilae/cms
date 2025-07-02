import { PayloadRequest } from 'payload'

interface TestConnectionRequest {
  provider: string
  baseUrl?: string
  apiKey?: string
  model?: string
  testEndpoint?: string
}

interface TestConnectionResponse {
  success: boolean
  status: 'connected' | 'disconnected' | 'error'
  responseTimeMs?: number
  error?: string
  availableModels?: string[]
}

export const testConnection = async (
  req: PayloadRequest,
  data: TestConnectionRequest,
): Promise<TestConnectionResponse> => {
  const startTime = Date.now()

  try {
    switch (data.provider) {
      case 'ollama':
        return await testOllamaConnection(data, startTime)
      case 'openai':
        return await testOpenAIConnection(data, startTime)
      case 'anthropic':
        return await testAnthropicConnection(data, startTime)
      case 'google':
        return await testGoogleConnection(data, startTime)
      case 'azure':
        return await testAzureConnection(data, startTime)
      case 'lmstudio':
        return await testLMStudioConnection(data, startTime)
      default:
        return {
          success: false,
          status: 'error',
          error: `Unsupported provider: ${data.provider}`,
        }
    }
  } catch (error) {
    return {
      success: false,
      status: 'error',
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

async function testOllamaConnection(
  data: TestConnectionRequest,
  startTime: number,
): Promise<TestConnectionResponse> {
  const baseUrl = data.baseUrl || 'http://localhost:11434'
  const testUrl = data.testEndpoint || `${baseUrl}/api/tags`

  try {
    // First, test if Ollama is running by checking available models
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    const responseTime = Date.now() - startTime

    // Extract available models from Ollama response
    const availableModels = result.models?.map((model: any) => model.name) || []

    // If we have a specific model to test, try a simple generation
    if (data.model && availableModels.includes(data.model)) {
      try {
        const generateResponse = await fetch(`${baseUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: data.model,
            prompt: 'Hello',
            stream: false,
            options: {
              num_predict: 1, // Only generate 1 token for testing
            },
          }),
          signal: AbortSignal.timeout(15000), // 15 second timeout for generation
        })

        if (!generateResponse.ok) {
          console.warn(`Model test failed for ${data.model}, but connection is working`)
        }
      } catch (modelError) {
        console.warn(`Model test failed for ${data.model}:`, modelError)
        // Don't fail the connection test if model test fails
      }
    }

    return {
      success: true,
      status: 'connected',
      responseTimeMs: responseTime,
      availableModels,
    }
  } catch (error) {
    return {
      success: false,
      status: 'error',
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

async function testOpenAIConnection(
  data: TestConnectionRequest,
  startTime: number,
): Promise<TestConnectionResponse> {
  const baseUrl = data.baseUrl || 'https://api.openai.com/v1'
  const testUrl = data.testEndpoint || `${baseUrl}/models`

  if (!data.apiKey) {
    return {
      success: false,
      status: 'error',
      error: 'API key is required for OpenAI',
    }
  }

  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    const responseTime = Date.now() - startTime

    const availableModels = result.data?.map((model: any) => model.id) || []

    return {
      success: true,
      status: 'connected',
      responseTimeMs: responseTime,
      availableModels,
    }
  } catch (error) {
    return {
      success: false,
      status: 'error',
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

async function testAnthropicConnection(
  data: TestConnectionRequest,
  startTime: number,
): Promise<TestConnectionResponse> {
  if (!data.apiKey) {
    return {
      success: false,
      status: 'error',
      error: 'API key is required for Anthropic',
    }
  }

  // Anthropic doesn't have a models endpoint, so we test with a simple message
  const baseUrl = data.baseUrl || 'https://api.anthropic.com'
  const testUrl = data.testEndpoint || `${baseUrl}/v1/messages`

  try {
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'x-api-key': data.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: data.model || 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseTime = Date.now() - startTime

    return {
      success: true,
      status: 'connected',
      responseTimeMs: responseTime,
      availableModels: [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
      ],
    }
  } catch (error) {
    return {
      success: false,
      status: 'error',
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

async function testGoogleConnection(
  data: TestConnectionRequest,
  startTime: number,
): Promise<TestConnectionResponse> {
  if (!data.apiKey) {
    return {
      success: false,
      status: 'error',
      error: 'API key is required for Google',
    }
  }

  const baseUrl = data.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'
  const testUrl = data.testEndpoint || `${baseUrl}/models?key=${data.apiKey}`

  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    const responseTime = Date.now() - startTime

    const availableModels =
      result.models?.map((model: any) => model.name.replace('models/', '')) || []

    return {
      success: true,
      status: 'connected',
      responseTimeMs: responseTime,
      availableModels,
    }
  } catch (error) {
    return {
      success: false,
      status: 'error',
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

async function testAzureConnection(
  data: TestConnectionRequest,
  startTime: number,
): Promise<TestConnectionResponse> {
  if (!data.apiKey || !data.baseUrl) {
    return {
      success: false,
      status: 'error',
      error: 'API key and base URL are required for Azure OpenAI',
    }
  }

  const testUrl = data.testEndpoint || `${data.baseUrl}/openai/deployments?api-version=2023-05-15`

  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'api-key': data.apiKey,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    const responseTime = Date.now() - startTime

    const availableModels = result.data?.map((deployment: any) => deployment.id) || []

    return {
      success: true,
      status: 'connected',
      responseTimeMs: responseTime,
      availableModels,
    }
  } catch (error) {
    return {
      success: false,
      status: 'error',
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

async function testLMStudioConnection(
  data: TestConnectionRequest,
  startTime: number,
): Promise<TestConnectionResponse> {
  const baseUrl = data.baseUrl || 'http://localhost:1234/v1'
  const testUrl = data.testEndpoint || `${baseUrl}/models`

  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    const responseTime = Date.now() - startTime

    const availableModels = result.data?.map((model: any) => model.id) || []

    return {
      success: true,
      status: 'connected',
      responseTimeMs: responseTime,
      availableModels,
    }
  } catch (error) {
    return {
      success: false,
      status: 'error',
      responseTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

import type { Payload } from 'payload'

export const seedAIProviders = async (payload: Payload): Promise<void> => {
  await payload.logger.info('Seeding AI Providers...')

  // Define types for allowed models from the AiProvider interface
  type AiModelType =
    | 'gpt-4o'
    | 'gpt-4o-mini'
    | 'gpt-3.5-turbo'
    | 'claude-3-5-sonnet-20241022'
    | 'claude-3-5-haiku-20241022'
    | 'gemini-1.5-pro'
    | 'gemini-1.5-flash'
    | 'llama3.2:latest'
    | 'llama2'
    | 'deepseek-r1:1.5b'
    | 'lucasmg/deepseek-r1-8b-0528-qwen3-q4_K_M-tool-true:latest'
    | 'nomic-embed-text:latest'
    | 'qwen2.5:7b-instruct-q4_K_M'
    | 'mychen76/qwen3_cline_roocode:8b'

  const aiProviders = [
    // Cloud Providers
    {
      name: 'OpenAI',
      provider: 'openai' as const,
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o' as AiModelType,
      description:
        'Leading AI research company providing GPT models, DALL-E, and other AI services.',
      documentation: 'https://platform.openai.com/docs',
      metadata: {
        website: 'https://openai.com',
        supportContact: 'https://help.openai.com',
        version: 'v1',
      },
    },
    {
      name: 'Anthropic',
      provider: 'anthropic' as const,
      baseUrl: 'https://api.anthropic.com',
      model: 'claude-3-5-sonnet-20241022' as AiModelType,
      description:
        'AI safety company creating helpful, harmless, and honest AI systems like Claude.',
      documentation: 'https://docs.anthropic.com',
      metadata: {
        website: 'https://anthropic.com',
        supportContact: 'https://support.anthropic.com',
        version: '2023-06-01',
      },
    },
    {
      name: 'OpenRouter',
      provider: 'openai' as const,
      baseUrl: 'https://openrouter.ai/api/v1',
      model: 'gpt-4o' as AiModelType, // Changed to a valid model type from the allowed list
      description:
        'Unified API for accessing 100+ AI models from various providers with competitive pricing.',
      documentation: 'https://openrouter.ai/docs',
      metadata: {
        website: 'https://openrouter.ai',
        supportContact: 'https://openrouter.ai/docs#support',
        version: 'v1',
      },
    },
    // Local Providers - Ollama as primary default
    {
      name: 'Ollama',
      provider: 'ollama' as const,
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2:latest' as AiModelType,
      description:
        'Run large language models locally with ease. Supports Llama 3.2, Mistral, and many other models. Primary local AI provider.',
      documentation: 'https://ollama.ai/docs',
      metadata: {
        website: 'https://ollama.ai',
        supportContact: 'https://github.com/ollama/ollama/issues',
        version: '0.1.0',
      },
    },
    {
      name: 'LM Studio',
      provider: 'lmstudio' as const,
      baseUrl: 'http://localhost:1234/v1',
      model: 'llama3.2:latest' as AiModelType,
      description:
        'Desktop application for running local LLMs with a user-friendly interface and model discovery.',
      documentation: 'https://lmstudio.ai/docs',
      metadata: {
        website: 'https://lmstudio.ai',
        supportContact: 'https://lmstudio.ai/support',
        version: '0.2.0',
      },
    },
  ]

  for (const providerData of aiProviders) {
    try {
      // Convert camelCase to snake_case field names and use only allowed fields
      // Cast the entire object to any to avoid TypeScript errors related to field mapping
      const formattedData: any = {
        name: providerData.name,
        provider: providerData.provider,
        base_url: providerData.baseUrl,
        model: providerData.model, // Already properly typed as AiModelType
        description: providerData.description,
        documentation: providerData.documentation,
        website: providerData.metadata?.website,
        support_contact: providerData.metadata?.supportContact,
        version: providerData.metadata?.version,
        temperature: 0.7,
        connection_status: 'disconnected',
        supports_images:
          providerData.provider === 'openai' || providerData.provider === 'anthropic',
        supports_function_calling: providerData.provider === 'openai',
        supports_vision:
          providerData.provider === 'openai' || providerData.provider === 'anthropic',
        supports_computer_use: providerData.provider === 'anthropic',
      }

      // Check for existing providers by name instead of slug
      const existingProvider = await payload.find({
        collection: 'ai-providers',
        where: {
          name: {
            equals: providerData.name,
          },
        },
      })

      if (existingProvider.docs.length === 0) {
        await payload.create({
          collection: 'ai-providers',
          data: formattedData,
        })
        await payload.logger.info(`✓ Created AI Provider: ${providerData.name}`)
      } else {
        await payload.logger.info(`⚠ AI Provider already exists: ${providerData.name}`)
      }
    } catch (error) {
      await payload.logger.error(`✗ Failed to create AI Provider ${providerData.name}: ${error}`)
    }
  }

  await payload.logger.info('AI Providers seeding completed.')
}

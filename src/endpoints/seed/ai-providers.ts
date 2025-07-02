import type { Payload } from 'payload'

export const seedAIProviders = async (payload: Payload): Promise<void> => {
  await payload.logger.info('Seeding AI Providers...')

  const aiProviders = [
    // Cloud Providers
    {
      name: 'OpenAI',
      slug: 'openai',
      provider: 'openai' as const,
      baseUrl: 'https://api.openai.com/v1',
      providerType: 'cloud' as const,
      authType: 'api-key' as const,
      status: 'active' as const,
      description:
        'Leading AI research company providing GPT models, DALL-E, and other AI services.',
      documentation: 'https://platform.openai.com/docs',
      cloudConfig: {
        rateLimits: {
          requestsPerMinute: 3500,
          tokensPerMinute: 90000,
          requestsPerDay: 10000,
        },
        regions: [
          {
            region: 'US East',
            endpoint: 'https://api.openai.com/v1',
          },
        ],
      },
      metadata: {
        website: 'https://openai.com',
        supportContact: 'https://help.openai.com',
        version: 'v1',
        tags: [
          { tag: 'text-generation' },
          { tag: 'image-generation' },
          { tag: 'function-calling' },
          { tag: 'vision' },
        ],
      },
    },
    {
      name: 'Anthropic',
      slug: 'anthropic',
      provider: 'anthropic' as const,
      baseUrl: 'https://api.anthropic.com',
      providerType: 'cloud' as const,
      authType: 'api-key' as const,
      status: 'active' as const,
      description:
        'AI safety company creating helpful, harmless, and honest AI systems like Claude.',
      documentation: 'https://docs.anthropic.com',
      cloudConfig: {
        rateLimits: {
          requestsPerMinute: 1000,
          tokensPerMinute: 40000,
          requestsPerDay: 5000,
        },
        regions: [
          {
            region: 'US',
            endpoint: 'https://api.anthropic.com',
          },
        ],
      },
      metadata: {
        website: 'https://anthropic.com',
        supportContact: 'https://support.anthropic.com',
        version: '2023-06-01',
        tags: [
          { tag: 'text-generation' },
          { tag: 'vision' },
          { tag: 'computer-use' },
          { tag: 'prompt-caching' },
        ],
      },
    },
    {
      name: 'OpenRouter',
      slug: 'openrouter',
      provider: 'openai' as const,
      baseUrl: 'https://openrouter.ai/api/v1',
      providerType: 'proxy' as const,
      authType: 'api-key' as const,
      status: 'active' as const,
      description:
        'Unified API for accessing 100+ AI models from various providers with competitive pricing.',
      documentation: 'https://openrouter.ai/docs',
      cloudConfig: {
        rateLimits: {
          requestsPerMinute: 200,
          tokensPerMinute: 20000,
          requestsPerDay: 1000,
        },
        regions: [
          {
            region: 'Global',
            endpoint: 'https://openrouter.ai/api/v1',
          },
        ],
      },
      metadata: {
        website: 'https://openrouter.ai',
        supportContact: 'https://openrouter.ai/docs#support',
        version: 'v1',
        tags: [{ tag: 'multi-provider' }, { tag: 'cost-optimization' }, { tag: 'model-variety' }],
      },
    },
    // Local Providers
    {
      name: 'Ollama',
      slug: 'ollama',
      provider: 'ollama' as const,
      baseUrl: 'http://localhost:11434',
      providerType: 'local' as const,
      authType: 'none' as const,
      status: 'active' as const,
      description:
        'Run large language models locally with ease. Supports Llama, Mistral, and many other models.',
      documentation: 'https://ollama.ai/docs',
      localConfig: {
        defaultPort: 11434,
        installationPath: '/usr/local/bin/ollama',
        requiresGPU: false,
        supportedFormats: [{ format: 'gguf' as const }, { format: 'ggml' as const }],
        minSystemRequirements: {
          ramGB: 8,
          diskSpaceGB: 10,
          cpuCores: 4,
        },
      },
      metadata: {
        website: 'https://ollama.ai',
        supportContact: 'https://github.com/ollama/ollama/issues',
        version: '0.1.0',
        tags: [{ tag: 'local' }, { tag: 'privacy' }, { tag: 'open-source' }, { tag: 'no-cost' }],
      },
    },
    {
      name: 'LM Studio',
      slug: 'lm-studio',
      provider: 'lmstudio' as const,
      baseUrl: 'http://localhost:1234',
      providerType: 'local' as const,
      authType: 'none' as const,
      status: 'active' as const,
      description:
        'Desktop application for running local LLMs with a user-friendly interface and model discovery.',
      documentation: 'https://lmstudio.ai/docs',
      localConfig: {
        defaultPort: 1234,
        installationPath: '/Applications/LM Studio.app',
        requiresGPU: false,
        supportedFormats: [
          { format: 'gguf' as const },
          { format: 'ggml' as const },
          { format: 'safetensors' as const },
        ],
        minSystemRequirements: {
          ramGB: 8,
          diskSpaceGB: 20,
          cpuCores: 4,
        },
      },
      metadata: {
        website: 'https://lmstudio.ai',
        supportContact: 'https://lmstudio.ai/support',
        version: '0.2.0',
        tags: [{ tag: 'local' }, { tag: 'gui' }, { tag: 'model-discovery' }, { tag: 'no-cost' }],
      },
    },
  ]

  for (const providerData of aiProviders) {
    try {
      const existingProvider = await payload.find({
        collection: 'ai-providers',
        where: {
          slug: {
            equals: providerData.slug,
          },
        },
      })

      if (existingProvider.docs.length === 0) {
        await payload.create({
          collection: 'ai-providers',
          data: providerData,
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

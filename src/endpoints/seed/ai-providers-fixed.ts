import type { Payload } from 'payload'

export const seedAIProviders = async (payload: Payload): Promise<void> => {
  await payload.logger.info('Seeding AI Providers...')

  const aiProviders = [
    // Cloud Providers
    {
      name: 'OpenAI',
      provider: 'openai',
      base_url: 'https://api.openai.com/v1',
      model: 'gpt-4o',
      description:
        'Leading AI research company providing GPT models, DALL-E, and other AI services.',
      documentation: 'https://platform.openai.com/docs',
      website: 'https://openai.com',
      support_contact: 'https://help.openai.com',
      version: 'v1',
      temperature: 0.7,
      connection_status: 'disconnected',
      supports_images: true,
      supports_function_calling: true,
      supports_vision: true,
    },
    {
      name: 'Anthropic',
      provider: 'anthropic',
      base_url: 'https://api.anthropic.com',
      model: 'claude-3-5-sonnet-20241022',
      description:
        'AI safety company creating helpful, harmless, and honest AI systems like Claude.',
      documentation: 'https://docs.anthropic.com',
      website: 'https://anthropic.com',
      support_contact: 'https://support.anthropic.com',
      version: '2023-06-01',
      temperature: 0.7,
      connection_status: 'disconnected',
      supports_images: true,
      supports_computer_use: true,
      supports_prompt_caching: true,
      supports_vision: true,
    },
    {
      name: 'OpenRouter',
      provider: 'openai',
      base_url: 'https://openrouter.ai/api/v1',
      model: 'anthropic/claude-3.5-sonnet',
      description:
        'Unified API for accessing 100+ AI models from various providers with competitive pricing.',
      documentation: 'https://openrouter.ai/docs',
      website: 'https://openrouter.ai',
      support_contact: 'https://openrouter.ai/docs#support',
      version: 'v1',
      temperature: 0.7,
      connection_status: 'disconnected',
    },
    // Local Providers
    {
      name: 'Ollama',
      provider: 'ollama',
      base_url: 'http://localhost:11434',
      model: 'llama3.2:latest',
      description:
        'Run large language models locally with ease. Supports Llama, Mistral, and many other models.',
      documentation: 'https://ollama.ai/docs',
      website: 'https://ollama.ai',
      support_contact: 'https://github.com/ollama/ollama/issues',
      version: '0.1.0',
      temperature: 0.7,
      connection_status: 'disconnected',
    },
    {
      name: 'LM Studio',
      provider: 'lmstudio',
      base_url: 'http://localhost:1234',
      model: 'llama-3.2-3b-instruct',
      description:
        'Desktop application for running local LLMs with a user-friendly interface and model discovery.',
      documentation: 'https://lmstudio.ai/docs',
      website: 'https://lmstudio.ai',
      support_contact: 'https://lmstudio.ai/support',
      version: '0.2.0',
      temperature: 0.7,
      connection_status: 'disconnected',
    },
  ]

  for (const providerData of aiProviders) {
    try {
      // Check for existing provider by name instead of slug
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

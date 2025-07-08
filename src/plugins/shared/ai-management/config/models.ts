/**
 * AI Provider Model Configuration
 *
 * This file contains the model definitions for each AI provider.
 * To add or remove models, simply update the arrays below.
 * No code changes required - just edit this configuration file.
 */

export const PROVIDER_MODELS = {
  ollama: [
    'llama3.2:latest',
    'llama3.1:latest',
    'llama2:latest',
    'codellama:latest',
    'mistral:latest',
    'qwen2.5:7b-instruct-q4_K_M',
    'deepseek-r1:1.5b',
    'phi3:latest',
    'gemma2:latest',
    'neural-chat:latest',
  ],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  google: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-1.0-pro-vision'],
  lmstudio: [
    'llama3.2:latest',
    'llama3.1:latest',
    'codellama:latest',
    'mistral:latest',
    'phi3:latest',
  ],
  azure: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-35-turbo', 'gpt-35-turbo-16k'],
}

/**
 * Generate select options for all models, grouped by provider
 * This creates a flat list with provider headers for easy selection
 */
export function getAllModelOptions() {
  const options = []

  // Add Ollama models first (prioritized)
  options.push({ label: '--- Ollama Models (Local) ---', value: '', disabled: true })
  PROVIDER_MODELS.ollama.forEach((model) => {
    options.push({ label: `${model}`, value: model })
  })

  // Add OpenAI models
  options.push({ label: '--- OpenAI Models ---', value: '', disabled: true })
  PROVIDER_MODELS.openai.forEach((model) => {
    options.push({ label: `${model}`, value: model })
  })

  // Add Anthropic models
  options.push({ label: '--- Anthropic Models ---', value: '', disabled: true })
  PROVIDER_MODELS.anthropic.forEach((model) => {
    options.push({ label: `${model}`, value: model })
  })

  // Add Google models
  options.push({ label: '--- Google Models ---', value: '', disabled: true })
  PROVIDER_MODELS.google.forEach((model) => {
    options.push({ label: `${model}`, value: model })
  })

  // Add LM Studio models
  options.push({ label: '--- LM Studio Models ---', value: '', disabled: true })
  PROVIDER_MODELS.lmstudio.forEach((model) => {
    options.push({ label: `${model}`, value: model })
  })

  // Add Azure models
  options.push({ label: '--- Azure OpenAI Models ---', value: '', disabled: true })
  PROVIDER_MODELS.azure.forEach((model) => {
    options.push({ label: `${model}`, value: model })
  })

  return options
}

/**
 * Get models for a specific provider
 */
export function getModelsForProvider(provider: string) {
  return PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS] || []
}

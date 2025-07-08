'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields, SelectField } from '@payloadcms/ui'

interface ProviderAwareModelSelectorProps {
  path: string
  field: any
  value?: string
  onChange: (value: string) => void
}

// Provider-specific model lists (can be easily updated)
const PROVIDER_MODELS = {
  ollama: [
    'llama3.2:latest',
    'llama3.1:latest',
    'llama2:latest',
    'codellama:latest',
    'mistral:latest',
    'qwen2.5:7b-instruct-q4_K_M',
    'deepseek-r1:1.5b',
  ],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
  google: ['gemini-1.5-pro', 'gemini-1.5-flash'],
  lmstudio: ['llama3.2:latest', 'llama3.1:latest', 'codellama:latest', 'mistral:latest'],
}

export const ProviderAwareModelSelector: React.FC<ProviderAwareModelSelectorProps> = ({
  path,
  field,
  value,
  onChange,
}) => {
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get form data to access provider
  const { fields } = useFormFields(([fields]) => ({ fields }))
  const provider = fields?.provider?.value

  // Update available models when provider changes
  useEffect(() => {
    if (provider && PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS]) {
      const providerModels = PROVIDER_MODELS[provider as keyof typeof PROVIDER_MODELS]
      setAvailableModels(providerModels)
    } else {
      setAvailableModels([])
    }
  }, [provider])

  // Try to fetch additional models from connection test if available
  useEffect(() => {
    const fetchDiscoveredModels = async () => {
      if (!provider || !fields?.baseUrl?.value) return

      setIsLoading(true)
      try {
        const response = await fetch('/api/ai-providers/test-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            baseUrl: fields.baseUrl.value,
            apiKey: fields.apiKey?.value,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.availableModels && data.availableModels.length > 0) {
            // Merge discovered models with default models, removing duplicates
            const allModels = [...new Set([...availableModels, ...data.availableModels])]
            setAvailableModels(allModels)
          }
        }
      } catch (error) {
        console.error('Failed to fetch discovered models:', error)
        // Keep the default models we already set
      } finally {
        setIsLoading(false)
      }
    }

    // Only try to discover if we have a connection and some default models
    if (availableModels.length > 0) {
      fetchDiscoveredModels()
    }
  }, [provider, fields?.baseUrl?.value, fields?.apiKey?.value, availableModels.length])

  // Create options for the select field
  const options = availableModels.map((model) => ({
    label: model,
    value: model,
  }))

  // Add a "no provider selected" option if no provider is chosen
  if (!provider) {
    return (
      <div className="field-type select">
        <div style={{ marginBottom: '8px' }}>
          <label className="field-label" style={{ display: 'block', marginBottom: '4px' }}>
            Model {field.required && <span style={{ color: 'var(--theme-error)' }}>*</span>}
          </label>
          <select
            disabled
            title="Model selection - requires provider to be selected first"
            aria-label="Model selection (disabled until provider is selected)"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '4px',
              backgroundColor: 'var(--theme-elevation-100)',
              color: 'var(--theme-text-muted)',
              fontSize: '14px',
            }}
          >
            <option>Select a provider first</option>
          </select>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--theme-text-muted)' }}>
          Please select a provider type first to see available models.
        </div>
      </div>
    )
  }

  return (
    <div className="field-type select">
      <div style={{ marginBottom: '8px' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '4px' }}>
          Model {field.required && <span style={{ color: 'var(--theme-error)' }}>*</span>}
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectField
              {...field}
              path={path}
              value={value}
              onChange={onChange}
              options={options}
              placeholder={isLoading ? 'Loading models...' : 'Select a model'}
              disabled={isLoading || options.length === 0}
            />
          </div>
          {isLoading && (
            <div style={{ fontSize: '12px', color: 'var(--theme-text-muted)' }}>Discovering...</div>
          )}
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--theme-text-muted)' }}>
        {options.length > 0 ? (
          <>
            Showing {options.length} models for {provider}.
            {isLoading
              ? ' Discovering additional models...'
              : ' Test connection to discover more models.'}
          </>
        ) : (
          `No models available for ${provider}. Check your provider configuration.`
        )}
      </div>
    </div>
  )
}

export default ProviderAwareModelSelector

'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields, SelectField } from '@payloadcms/ui'

// Model specifications database
const MODEL_SPECS = {
  // OpenAI Models
  'gpt-4o': {
    contextWindow: 128000,
    maxOutputTokens: 16384,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    inputPriceCents: 250,
    outputPriceCents: 1000,
  },
  'gpt-4o-mini': {
    contextWindow: 128000,
    maxOutputTokens: 16384,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    inputPriceCents: 15,
    outputPriceCents: 60,
  },
  'gpt-4-turbo': {
    contextWindow: 128000,
    maxOutputTokens: 4096,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    inputPriceCents: 1000,
    outputPriceCents: 3000,
  },
  'gpt-3.5-turbo': {
    contextWindow: 16385,
    maxOutputTokens: 4096,
    supportsImages: false,
    supportsVision: false,
    supportsFunctionCalling: true,
    inputPriceCents: 50,
    outputPriceCents: 150,
  },

  // Anthropic Models
  'claude-3-5-sonnet-20241022': {
    contextWindow: 200000,
    maxOutputTokens: 8192,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    supportsComputerUse: true,
    inputPriceCents: 300,
    outputPriceCents: 1500,
  },
  'claude-3-5-haiku-20241022': {
    contextWindow: 200000,
    maxOutputTokens: 8192,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    inputPriceCents: 100,
    outputPriceCents: 500,
  },
  'claude-3-opus-20240229': {
    contextWindow: 200000,
    maxOutputTokens: 4096,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    inputPriceCents: 1500,
    outputPriceCents: 7500,
  },

  // Google Models
  'gemini-1.5-pro': {
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    inputPriceCents: 125,
    outputPriceCents: 375,
  },
  'gemini-1.5-flash': {
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    supportsImages: true,
    supportsVision: true,
    supportsFunctionCalling: true,
    inputPriceCents: 7.5,
    outputPriceCents: 30,
  },

  // Ollama Models (Local)
  'llama3.2:latest': {
    contextWindow: 131072, // 128K context window
    maxOutputTokens: 4096,
    supportsImages: false,
    supportsVision: false,
    supportsFunctionCalling: false,
    supportsComputerUse: false,
    inputPriceCents: 0, // Free for local models
    outputPriceCents: 0,
  },
  'llama3.1:latest': {
    contextWindow: 131072, // 128K context window
    maxOutputTokens: 4096,
    supportsImages: false,
    supportsVision: false,
    supportsFunctionCalling: false,
    supportsComputerUse: false,
    inputPriceCents: 0,
    outputPriceCents: 0,
  },
  'llama2:latest': {
    contextWindow: 4096,
    maxOutputTokens: 4096,
    supportsImages: false,
    supportsVision: false,
    supportsFunctionCalling: false,
    supportsComputerUse: false,
    inputPriceCents: 0,
    outputPriceCents: 0,
  },
  'codellama:latest': {
    contextWindow: 16384,
    maxOutputTokens: 4096,
    supportsImages: false,
    supportsVision: false,
    supportsFunctionCalling: false,
    supportsComputerUse: false,
    inputPriceCents: 0,
    outputPriceCents: 0,
  },
  'mistral:latest': {
    contextWindow: 32768,
    maxOutputTokens: 4096,
    supportsImages: false,
    supportsVision: false,
    supportsFunctionCalling: false,
    supportsComputerUse: false,
    inputPriceCents: 0,
    outputPriceCents: 0,
  },

  // Default for unknown models
  default: {
    contextWindow: 4096,
    maxOutputTokens: 4096,
    supportsImages: false,
    supportsVision: false,
    supportsFunctionCalling: false,
    supportsComputerUse: false,
    inputPriceCents: 0,
    outputPriceCents: 0,
  },
}

interface ModelSelectorProps {
  path: string
  field: any
  value?: string
  onChange: (value: string) => void
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ path, field, value, onChange }) => {
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get form data to access provider and connection details
  const { fields, dispatchFields } = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatchFields: dispatch,
  }))

  const provider = fields?.provider?.value
  const baseUrl = fields?.baseUrl?.value
  const apiKey = fields?.apiKey?.value
  const connectionStatus = fields?.connectionStatus?.value

  // Auto-update model parameters when model changes
  useEffect(() => {
    if (value && dispatchFields) {
      const modelSpec = MODEL_SPECS[value as keyof typeof MODEL_SPECS] || MODEL_SPECS.default

      // Update related fields
      dispatchFields({
        type: 'UPDATE',
        path: 'maxOutputTokens',
        value: modelSpec.maxOutputTokens,
      })

      dispatchFields({
        type: 'UPDATE',
        path: 'contextWindow',
        value: modelSpec.contextWindow,
      })

      dispatchFields({
        type: 'UPDATE',
        path: 'supportsImages',
        value: modelSpec.supportsImages,
      })

      dispatchFields({
        type: 'UPDATE',
        path: 'supportsVision',
        value: modelSpec.supportsVision,
      })

      dispatchFields({
        type: 'UPDATE',
        path: 'supportsFunctionCalling',
        value: modelSpec.supportsFunctionCalling,
      })

      if ('supportsComputerUse' in modelSpec && modelSpec.supportsComputerUse !== undefined) {
        dispatchFields({
          type: 'UPDATE',
          path: 'supportsComputerUse',
          value: modelSpec.supportsComputerUse,
        })
      }

      dispatchFields({
        type: 'UPDATE',
        path: 'inputPriceCents',
        value: modelSpec.inputPriceCents,
      })

      dispatchFields({
        type: 'UPDATE',
        path: 'outputPriceCents',
        value: modelSpec.outputPriceCents,
      })
    }
  }, [value, dispatchFields])

  // Set provider-specific models when provider changes
  useEffect(() => {
    if (provider) {
      const providerModels = getFallbackModels(provider as string)
      setAvailableModels(providerModels)
    } else {
      setAvailableModels([])
    }
  }, [provider])

  // Optionally fetch additional models from connection test
  useEffect(() => {
    const fetchAdditionalModels = async () => {
      if (!provider || !baseUrl || connectionStatus !== 'connected') return

      setIsLoading(true)
      try {
        const response = await fetch('/api/ai-providers/test-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            baseUrl,
            apiKey,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.availableModels && data.availableModels.length > 0) {
            setAvailableModels(data.availableModels)
          }
        }
      } catch (error) {
        console.error('Failed to fetch additional models:', error)
        // Keep the fallback models we already set
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdditionalModels()
  }, [provider, baseUrl, apiKey, connectionStatus])

  const getFallbackModels = (provider: string): string[] => {
    switch (provider) {
      case 'openai':
        return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
      case 'anthropic':
        return ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229']
      case 'google':
        return ['gemini-1.5-pro', 'gemini-1.5-flash']
      case 'ollama':
        return [
          'llama3.2:latest',
          'llama3.1:latest',
          'llama2:latest',
          'codellama:latest',
          'mistral:latest',
          'qwen2.5:7b-instruct-q4_K_M',
          'deepseek-r1:1.5b',
        ]
      case 'lmstudio':
        return ['llama3.2:latest', 'llama3.1:latest', 'codellama:latest', 'mistral:latest']
      default:
        return []
    }
  }

  // Create options for the select field
  const options = availableModels.map((model) => ({
    label: model,
    value: model,
  }))

  // Add a refresh button to re-fetch models
  const handleRefreshModels = async () => {
    if (!provider || !baseUrl) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai-providers/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          baseUrl,
          apiKey,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.models) {
          setAvailableModels(data.models)
        }
      }
    } catch (error) {
      console.error('Failed to refresh models:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
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
        <button
          type="button"
          onClick={handleRefreshModels}
          disabled={isLoading || !provider || !baseUrl}
          className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : '↻'}
        </button>
      </div>

      {connectionStatus === 'connected' && (
        <div className="text-sm text-green-600">✓ Connection verified - models auto-discovered</div>
      )}

      {options.length === 0 && !isLoading && (
        <div className="text-sm text-amber-600">
          ⚠ Test connection first to discover available models
        </div>
      )}

      {value && MODEL_SPECS[value as keyof typeof MODEL_SPECS] && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Model specs auto-applied:</strong>{' '}
          {MODEL_SPECS[value as keyof typeof MODEL_SPECS].contextWindow.toLocaleString()} context
          window,
          {MODEL_SPECS[value as keyof typeof MODEL_SPECS].maxOutputTokens.toLocaleString()} max
          output tokens
        </div>
      )}
    </div>
  )
}

export default ModelSelector

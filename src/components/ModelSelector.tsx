'use client'

import React, { useState, useEffect } from 'react'
import { useFormFields, useDocumentInfo, useField } from '@payloadcms/ui'

interface ModelSelectorProps {
  path: string
  required?: boolean
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ path, required }) => {
  const { value, setValue } = useField<string>({ path })
  const [selectedModel, setSelectedModel] = useState(value || '')
  const [isManualEntry, setIsManualEntry] = useState(false)

  // Get form data to access availableModels
  const formFields = useFormFields(([fields]) => ({ fields }))
  const documentInfo = useDocumentInfo()

  // Try to get data from multiple sources
  const docData =
    (documentInfo as any)?.savedDocumentData || (documentInfo as any)?.data || documentInfo
  const fields = formFields?.fields

  // Get available models from various sources
  const availableModelsRaw =
    docData?.availableModels ||
    fields?.availableModels?.value ||
    docData?.available_models ||
    fields?.available_models?.value

  // Parse available models (could be JSON string or array)
  let availableModels: string[] = []
  try {
    if (typeof availableModelsRaw === 'string') {
      availableModels = JSON.parse(availableModelsRaw)
    } else if (Array.isArray(availableModelsRaw)) {
      availableModels = availableModelsRaw
    }
  } catch (error) {
    console.warn('Failed to parse available models:', error)
    availableModels = []
  }

  // Update selected model when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedModel(value)
      // Check if current value is in available models
      setIsManualEntry(availableModels.length > 0 && !availableModels.includes(value))
    }
  }, [value, availableModels])

  const handleModelChange = (newValue: string) => {
    if (newValue === '__manual__') {
      setIsManualEntry(true)
      setSelectedModel('')
    } else {
      setIsManualEntry(false)
      setSelectedModel(newValue)
      setValue(newValue)
    }
  }

  const handleManualInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setSelectedModel(newValue)
    setValue(newValue)
  }

  // Create options for the select dropdown
  const options = [
    { label: 'Select a model...', value: '', disabled: true },
    // Add all available models
    ...availableModels.map((model) => ({
      label: model,
      value: model,
      disabled: false,
    })),
    // Add manual entry option if models are available
    ...(availableModels.length > 0
      ? [{ label: '--- Enter manually ---', value: '__manual__', disabled: false }]
      : []),
  ]

  // If no models available or manual entry is selected, show text input
  if (availableModels.length === 0 || isManualEntry) {
    return (
      <div className="field-type text">
        <div style={{ marginBottom: '8px' }}>
          <label className="field-label" style={{ display: 'block', marginBottom: '4px' }}>
            Model {required && <span style={{ color: 'var(--theme-error)' }}>*</span>}
          </label>
          <input
            type="text"
            value={selectedModel}
            onChange={handleManualInput}
            placeholder="Enter model name (e.g., gpt-4o, claude-3-5-sonnet-20241022, llama3.2:latest)"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '4px',
              backgroundColor: 'var(--theme-elevation-50)',
              color: 'var(--theme-text)',
              fontSize: '14px',
            }}
            required={required}
          />
          {availableModels.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsManualEntry(false)
                setSelectedModel('')
              }}
              style={{
                marginTop: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'var(--theme-text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              ← Back to model selection
            </button>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--theme-text-muted)' }}>
          {availableModels.length === 0
            ? 'No models discovered yet. Enter model name manually or test connection to discover available models.'
            : 'Enter model name manually or select from the dropdown above.'}
        </div>
      </div>
    )
  }

  return (
    <div className="field-type select">
      <div style={{ marginBottom: '8px' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '4px' }}>
          Model {required && <span style={{ color: 'var(--theme-error)' }}>*</span>}
        </label>
        <select
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '4px',
            backgroundColor: 'var(--theme-elevation-50)',
            color: 'var(--theme-text)',
            fontSize: '14px',
          }}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--theme-text-muted)' }}>
        Select from {availableModels.length} discovered models.
        <details style={{ marginTop: '8px' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--theme-text-muted)' }}>
            Available models ({availableModels.length})
          </summary>
          <ul
            style={{
              margin: '4px 0',
              paddingLeft: '16px',
              fontSize: '12px',
              color: 'var(--theme-text-muted)',
            }}
          >
            {availableModels.map((model) => (
              <li key={model}>{model}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  )
}

export default ModelSelector

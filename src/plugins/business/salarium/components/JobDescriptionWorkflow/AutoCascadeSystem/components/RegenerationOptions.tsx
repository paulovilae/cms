'use client'

import React, { useState } from 'react'
import { CascadeOptions } from '../hooks/useCascadeGeneration'

interface DocumentSection {
  id: string
  title: string
  stepNumber?: number
  isCompleted?: boolean
}

interface RegenerationOptionsProps {
  sections: DocumentSection[]
  options: CascadeOptions
  onOptionsChange: (options: CascadeOptions) => void
  disabled?: boolean
  className?: string
}

/**
 * Component to configure options for the cascade generation process
 */
export const RegenerationOptions: React.FC<RegenerationOptionsProps> = ({
  sections,
  options,
  onOptionsChange,
  disabled = false,
  className = '',
}) => {
  // Local state to track selected sections to preserve
  const [preservedSectionIds, setPreservedSectionIds] = useState<string[]>(
    options.preserveSections || [],
  )

  // Handle style preference change
  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange({
      ...options,
      stylePreference: e.target.value as 'detailed' | 'concise' | 'technical',
    })
  }

  // Handle start section change
  const handleStartSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange({
      ...options,
      startFromSection: parseInt(e.target.value, 10),
    })
  }

  // Toggle regenerate completed sections
  const handleRegenerateCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      regenerateCompleted: e.target.checked,
    })
  }

  // Toggle generate all sections
  const handleGenerateAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      generateAll: e.target.checked,
    })
  }

  // Toggle section preservation
  const handleSectionPreservationChange = (
    sectionId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e.target.checked
    const newPreservedSections = checked
      ? [...preservedSectionIds, sectionId]
      : preservedSectionIds.filter((id) => id !== sectionId)

    setPreservedSectionIds(newPreservedSections)

    onOptionsChange({
      ...options,
      preserveSections: newPreservedSections,
    })
  }

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Generation Options</h3>
        <p className="text-sm text-gray-500">Configure how the auto-generation process works</p>
      </div>

      <div className="space-y-6">
        {/* Starting Section */}
        <div>
          <label htmlFor="startSection" className="block text-sm font-medium mb-1">
            Start from section
          </label>
          <select
            id="startSection"
            className="w-full p-2 border rounded"
            disabled={disabled}
            value={options.startFromSection.toString()}
            onChange={handleStartSectionChange}
          >
            {sections.map((section, index) => (
              <option key={section.id} value={index.toString()}>
                {section.stepNumber ? `${section.stepNumber}. ` : ''}
                {section.title}
              </option>
            ))}
          </select>
        </div>

        {/* Style Preference */}
        <div>
          <label className="block text-sm font-medium mb-1">Output style</label>
          <select
            className="w-full p-2 border rounded"
            disabled={disabled}
            value={options.stylePreference}
            onChange={handleStyleChange}
          >
            <option value="detailed">Detailed</option>
            <option value="concise">Concise</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        {/* Generation Options */}
        <div>
          <label className="block text-sm font-medium mb-1">Additional options</label>

          <div className="flex items-start mb-2">
            <input
              type="checkbox"
              id="regenerateCompleted"
              className="mt-1"
              checked={options.regenerateCompleted}
              onChange={handleRegenerateCompletedChange}
              disabled={disabled}
            />
            <div className="ml-2">
              <label htmlFor="regenerateCompleted" className="block text-sm font-medium">
                Regenerate completed sections
              </label>
              <p className="text-sm text-gray-500">Rewrite sections that already have content</p>
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="generateAll"
              className="mt-1"
              checked={options.generateAll}
              onChange={handleGenerateAllChange}
              disabled={disabled}
            />
            <div className="ml-2">
              <label htmlFor="generateAll" className="block text-sm font-medium">
                Generate all at once
              </label>
              <p className="text-sm text-gray-500">
                Generate all sections in a single operation (faster but less contextual)
              </p>
            </div>
          </div>
        </div>

        {/* Preserve Sections */}
        {sections.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">Preserve these sections</label>
            <div className="space-y-2">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`preserve-${section.id}`}
                    checked={preservedSectionIds.includes(section.id)}
                    onChange={(e) => handleSectionPreservationChange(section.id, e)}
                    disabled={disabled}
                    className="mr-2"
                  />
                  <label htmlFor={`preserve-${section.id}`} className="text-sm">
                    {section.stepNumber ? `${section.stepNumber}. ` : ''}
                    {section.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegenerationOptions

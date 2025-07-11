'use client'

import React, { useState, useEffect } from 'react'
import { useCascadeGeneration, CascadeOptions } from './hooks/useCascadeGeneration'
import AutoGenerateButton from './components/AutoGenerateButton'
import CascadeProgress from './components/CascadeProgress'
import RegenerationOptions from './components/RegenerationOptions'

interface DocumentSection {
  id: string
  title: string
  content: any
  stepNumber?: number
  isCompleted?: boolean
}

interface AutoCascadeSystemProps {
  documentId: string
  sections: DocumentSection[]
  onSectionUpdate?: (sectionId: string, content: any) => void
  onComplete?: () => void
  className?: string
}

/**
 * Main component for the Auto-Cascade system which handles auto-generation of job description sections
 */
export const AutoCascadeSystem: React.FC<AutoCascadeSystemProps> = ({
  documentId,
  sections,
  onSectionUpdate,
  onComplete,
  className = '',
}) => {
  // Default cascade options
  const [options, setOptions] = useState<CascadeOptions>({
    startFromSection: 0,
    regenerateCompleted: false,
    preserveSections: [],
    stylePreference: 'detailed',
    generateAll: false,
  })

  // Use the cascade generation hook
  const {
    isGenerating,
    currentSectionIndex,
    completedSections,
    queuedSections,
    generationProgress,
    error,
    startCascadeGeneration,
    cancelGeneration,
  } = useCascadeGeneration(documentId, options)

  // Get the current section title
  const currentSectionTitle = sections[currentSectionIndex]?.title || ''

  // Call onComplete when generation finishes successfully
  useEffect(() => {
    if (!isGenerating && completedSections.length > 0 && error === null) {
      if (
        completedSections.length === sections.length ||
        completedSections.length === queuedSections.length + completedSections.length
      ) {
        onComplete?.()
      }
    }
  }, [isGenerating, completedSections, queuedSections, sections, error, onComplete])

  // Start generation handler
  const handleStartGeneration = async () => {
    await startCascadeGeneration()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Auto-Generate Job Description</h2>
        <AutoGenerateButton
          isGenerating={isGenerating}
          onGenerate={handleStartGeneration}
          onCancel={cancelGeneration}
          disabled={sections.length === 0}
        />
      </div>

      {/* Show progress when generating or if there's an error */}
      {(isGenerating || error) && (
        <CascadeProgress
          progress={generationProgress}
          currentSectionTitle={currentSectionTitle}
          completedCount={completedSections.length}
          totalCount={sections.length}
          error={error}
          isGenerating={isGenerating}
        />
      )}

      {/* Options for configuration */}
      <RegenerationOptions
        sections={sections}
        options={options}
        onOptionsChange={setOptions}
        disabled={isGenerating}
      />

      {/* Information message */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
        <p>
          <strong>Tip:</strong> The auto-generation feature uses AI to create content for each
          section of your job description based on the job title and any existing content.
        </p>
        <p className="mt-1">
          For best results, enter a detailed job title and customize the options above to match your
          needs.
        </p>
      </div>
    </div>
  )
}

export default AutoCascadeSystem

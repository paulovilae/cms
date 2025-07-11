import React, { useState, useEffect } from 'react'
import {
  useCascadeGeneration,
  CascadeOptions,
} from '../AutoCascadeSystem/hooks/useCascadeGeneration'
import { AutoGenerateButton } from '../AutoCascadeSystem/components/AutoGenerateButton'
import { CascadeProgress } from '../AutoCascadeSystem/components/CascadeProgress'
import { RegenerationOptions } from '../AutoCascadeSystem/components/RegenerationOptions'
import { DocumentSection } from '../types'

interface AutoCascadeIntegrationProps {
  isVisible: boolean
  onSectionsGenerated: (sections: DocumentSection[]) => void
  onClose: () => void
  documentId: string
}

const AutoCascadeIntegration: React.FC<AutoCascadeIntegrationProps> = ({
  isVisible,
  onSectionsGenerated,
  onClose,
  documentId,
}) => {
  const [jobTitle, setJobTitle] = useState('')
  const [generatedSections, setGeneratedSections] = useState<DocumentSection[]>([])
  const [cascadeOptions, setCascadeOptions] = useState<CascadeOptions>({
    startFromSection: 0,
    regenerateCompleted: false,
    preserveSections: [],
    stylePreference: 'detailed',
    generateAll: true,
  })

  // Initialize useCascadeGeneration hook with required parameters
  const {
    isGenerating,
    currentSectionIndex,
    completedSections,
    queuedSections,
    generationProgress,
    error,
    startCascadeGeneration,
    cancelGeneration,
  } = useCascadeGeneration(documentId, cascadeOptions)

  // Keep track of whether generation has started
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false)

  // Update generated sections when completed
  useEffect(() => {
    if (hasStartedGeneration && !isGenerating && completedSections.length > 0 && !error) {
      // In a real implementation, we would fetch the latest sections here
      fetchGeneratedSections()
    }
  }, [hasStartedGeneration, isGenerating, completedSections.length, error])

  // Simulate fetching generated sections
  const fetchGeneratedSections = async () => {
    try {
      // In a real implementation, this would make an API call to get the latest sections
      const mockSections: DocumentSection[] = [
        {
          id: 'job-title',
          title: 'Job Title',
          content: jobTitle,
          isCompleted: true,
          stepNumber: 1,
        },
        {
          id: 'job-mission',
          title: 'Job Mission',
          content: 'Generated mission text...',
          isCompleted: true,
          stepNumber: 2,
        },
        {
          id: 'job-scope',
          title: 'Job Scope & Reach',
          content: 'Generated scope text...',
          isCompleted: true,
          stepNumber: 3,
        },
        {
          id: 'responsibilities',
          title: 'Key Responsibilities',
          content: 'Generated responsibilities...',
          isCompleted: true,
          stepNumber: 4,
        },
        {
          id: 'qualifications',
          title: 'Required Qualifications',
          content: 'Generated qualifications...',
          isCompleted: true,
          stepNumber: 5,
        },
      ]

      setGeneratedSections(mockSections)

      // Notify parent component
      onSectionsGenerated(mockSections)
    } catch (err) {
      console.error('Error fetching generated sections:', err)
    }
  }

  // Start the cascade generation process
  const handleStartGeneration = async () => {
    if (!jobTitle.trim()) return

    setHasStartedGeneration(true)

    // Update cascade options based on job title
    setCascadeOptions((prev) => ({
      ...prev,
      // In a real implementation, we might set additional options here
    }))

    // Start the cascade generation
    await startCascadeGeneration()
  }

  // Handle style preference changes
  const handleStylePreferenceChange = (style: 'detailed' | 'concise' | 'technical') => {
    setCascadeOptions((prev) => ({
      ...prev,
      stylePreference: style,
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Auto-Generate Job Description</h3>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {!hasStartedGeneration ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Enter a job title and we'll automatically generate all sections of your job
                description.
              </p>

              <div className="mb-4">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Product Manager"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm border rounded-md ${
                      cascadeOptions.stylePreference === 'detailed'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                    onClick={() => handleStylePreferenceChange('detailed')}
                  >
                    Detailed
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm border rounded-md ${
                      cascadeOptions.stylePreference === 'concise'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                    onClick={() => handleStylePreferenceChange('concise')}
                  >
                    Concise
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm border rounded-md ${
                      cascadeOptions.stylePreference === 'technical'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                    onClick={() => handleStylePreferenceChange('technical')}
                  >
                    Technical
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleStartGeneration}
                  disabled={isGenerating || !jobTitle.trim()}
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Generate with AI'
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Generation Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isGenerating
                    ? `Generating section ${currentSectionIndex + 1}...`
                    : completedSections.length > 0
                      ? 'Generation complete!'
                      : 'Ready to generate'}
                </p>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => {
                    cancelGeneration()
                    onClose()
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    onSectionsGenerated(generatedSections)
                    onClose()
                  }}
                  disabled={isGenerating || completedSections.length === 0}
                >
                  Use Generated Content
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AutoCascadeIntegration

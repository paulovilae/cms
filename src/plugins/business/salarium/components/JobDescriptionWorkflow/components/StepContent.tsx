import React, { useState, useEffect } from 'react'
import { Step, StepResponse } from '../types'
import { validateStepInput } from '../utils/validationHelpers'

interface StepContentProps {
  step: Step
  stepResponse: StepResponse | undefined
  onUpdateResponse: (updatedResponse: Partial<StepResponse>) => void
  onGenerateAI: (userInput: string) => Promise<void>
  onNextStep: () => void
  onPrevStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isGenerating: boolean
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  stepResponse,
  onUpdateResponse,
  onGenerateAI,
  onNextStep,
  onPrevStep,
  isFirstStep,
  isLastStep,
  isGenerating,
}) => {
  const [userInput, setUserInput] = useState('')
  const [aiContent, setAiContent] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Initialize with existing data if available
  useEffect(() => {
    if (stepResponse) {
      setUserInput(stepResponse.userInput || '')
      setAiContent(stepResponse.aiGeneratedContent || '')
      // Start in edit mode if this step hasn't been completed yet
      setIsEditing(!stepResponse.isCompleted)
    } else {
      setUserInput('')
      setAiContent('')
      setIsEditing(true)
    }
  }, [stepResponse, step.stepNumber])

  // Generate AI content
  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setValidationError('Please enter some input before generating')
      return
    }

    setValidationError(null)

    try {
      // Update the user input first
      onUpdateResponse({
        stepNumber: step.stepNumber,
        stepTitle: step.stepTitle,
        userInput,
      })

      // Then generate AI content
      await onGenerateAI(userInput)
    } catch (error) {
      console.error('Error generating content:', error)
      setValidationError('Failed to generate content. Please try again.')
    }
  }

  // Save the current step
  const handleSave = () => {
    const error = validateStepInput(step.stepNumber, aiContent)
    if (error) {
      setValidationError(error)
      return
    }

    onUpdateResponse({
      stepNumber: step.stepNumber,
      stepTitle: step.stepTitle,
      userInput,
      aiGeneratedContent: aiContent,
      isCompleted: true,
      lastUpdated: new Date().toISOString(),
    })

    setIsEditing(false)
    setValidationError(null)
  }

  // Handle AI content editing
  const handleAiContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiContent(e.target.value)
  }

  // Navigate to next step after saving
  const handleSaveAndContinue = () => {
    handleSave()
    if (!validationError) {
      onNextStep()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {step.stepNumber}. {step.stepTitle}
        </h2>
        <p className="text-gray-600">{step.description}</p>
      </div>

      {/* User Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Input</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter details for this section..."
          disabled={isGenerating}
        />
        <div className="mt-2 flex justify-end">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerate}
            disabled={isGenerating || !userInput.trim()}
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
      </div>

      {/* AI-Generated Content Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">AI-Generated Content</label>
          {stepResponse?.isCompleted && !isEditing && (
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={8}
            value={aiContent}
            onChange={handleAiContentChange}
            placeholder="AI-generated content will appear here..."
            disabled={isGenerating}
          />
        ) : (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[200px] prose max-w-none">
            {aiContent ? (
              <div dangerouslySetInnerHTML={{ __html: aiContent.replace(/\n/g, '<br />') }} />
            ) : (
              <p className="text-gray-500 italic">No content generated yet</p>
            )}
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {validationError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPrevStep}
          disabled={isFirstStep || isGenerating}
        >
          Previous
        </button>
        <div className="flex space-x-3">
          {isEditing && (
            <button
              className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isGenerating || !aiContent.trim()}
            >
              Save
            </button>
          )}
          {!isLastStep ? (
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={isEditing ? handleSaveAndContinue : onNextStep}
              disabled={isGenerating || (isEditing && !aiContent.trim())}
            >
              {isEditing ? 'Save & Continue' : 'Next'}
            </button>
          ) : (
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={isEditing ? handleSave : () => {}}
              disabled={isGenerating || (isEditing && !aiContent.trim())}
            >
              {isEditing ? 'Complete' : 'Completed'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default StepContent

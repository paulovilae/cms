import React, { useState, useEffect, useCallback } from 'react'
import { createBusinessHeaders } from './utils/businessContext'
import StepSelector from './components/StepSelector'
import StepContent from './components/StepContent'
import DocumentPreview from './components/DocumentPreview'
import AutoCascadeIntegration from './components/AutoCascadeIntegration'
import { buildPreviousStepsContext, buildAIPrompt } from './utils/contextHelpers'
import { FlowInstance, Step, StepResponse, DocumentSection } from './types'

interface JobDescriptionWorkflowProps {
  flowInstanceId: string
}

const JobDescriptionWorkflow: React.FC<JobDescriptionWorkflowProps> = ({ flowInstanceId }) => {
  // Workflow state
  const [flowInstance, setFlowInstance] = useState<FlowInstance | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showAutoCascade, setShowAutoCascade] = useState<boolean>(false)

  // Steps configuration
  const steps: Step[] = [
    {
      stepNumber: 1,
      stepTitle: 'Job Title',
      description: 'Enter a specific, market-standard job title',
      systemPrompt:
        'You are a professional HR advisor. Help refine this job title to be clear, specific, and industry-standard.',
    },
    {
      stepNumber: 2,
      stepTitle: 'Job Mission',
      description: 'What is the core purpose of this role?',
      systemPrompt:
        'You are a professional HR advisor. Create a compelling mission statement that clearly defines the purpose and impact of this role.',
    },
    {
      stepNumber: 3,
      stepTitle: 'Job Scope & Reach',
      description: 'Define the boundaries and influence of this position',
      systemPrompt:
        'You are a professional HR advisor. Outline the scope of this position including team size, budget responsibility, geographic coverage, and decision-making authority.',
    },
    {
      stepNumber: 4,
      stepTitle: 'Key Responsibilities',
      description: 'What are the primary duties of this role?',
      systemPrompt:
        'You are a professional HR advisor. List the key responsibilities for this position using action verbs and specific, measurable outcomes.',
    },
    {
      stepNumber: 5,
      stepTitle: 'Required Qualifications',
      description: 'What experience, skills, and education are needed?',
      systemPrompt:
        'You are a professional HR advisor. Specify the required and preferred qualifications for this role, including experience, skills, education, and certifications.',
    },
  ]

  // Fetch flow instance data
  const fetchFlowInstance = useCallback(async () => {
    try {
      const response = await fetch(`/api/flow-instances/${flowInstanceId}`, {
        headers: createBusinessHeaders('salarium'),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch flow instance: ${response.status}`)
      }

      const data = await response.json()
      setFlowInstance(data)

      // If first time, set to step 1, otherwise find the first incomplete step
      if (!data.stepResponses || data.stepResponses.length === 0) {
        setCurrentStep(1)
      } else {
        const firstIncompleteStep = steps.find((step) => {
          const response = data.stepResponses.find(
            (resp: StepResponse) => resp.stepNumber === step.stepNumber,
          )
          return !response || !response.isCompleted
        })

        setCurrentStep(firstIncompleteStep ? firstIncompleteStep.stepNumber : 1)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load flow instance')
    }
  }, [flowInstanceId])

  // Initialize workflow
  useEffect(() => {
    fetchFlowInstance()
  }, [fetchFlowInstance])

  // Handle step change
  const handleStepChange = (stepNumber: number) => {
    setCurrentStep(stepNumber)
  }

  // Move to next step
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Move to previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Generate AI content
  const handleGenerateAI = async (userInput: string) => {
    if (!flowInstance) return

    const step = steps.find((s) => s.stepNumber === currentStep)
    if (!step) return

    try {
      setIsGenerating(true)
      setError(null)

      // Build context from previous steps
      const context = buildPreviousStepsContext(flowInstance, currentStep)

      // Build AI prompt
      const prompt = buildAIPrompt(
        currentStep,
        step.stepTitle,
        step.systemPrompt,
        userInput,
        context,
      )

      // Send to API for processing
      const response = await fetch(`/api/flow-instances/${flowInstanceId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...createBusinessHeaders('salarium'),
        },
        body: JSON.stringify({
          stepNumber: currentStep,
          prompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      const data = await response.json()

      // Update flow instance with new data
      if (flowInstance) {
        const updatedInstance = { ...flowInstance }

        const existingResponseIndex = updatedInstance.stepResponses?.findIndex(
          (resp) => resp.stepNumber === currentStep,
        )

        if (existingResponseIndex !== undefined && existingResponseIndex >= 0) {
          updatedInstance.stepResponses[existingResponseIndex] = {
            ...updatedInstance.stepResponses[existingResponseIndex],
            aiGeneratedContent: data.content,
          }
        } else {
          updatedInstance.stepResponses = [
            ...(updatedInstance.stepResponses || []),
            {
              stepNumber: currentStep,
              stepTitle: step.stepTitle,
              userInput,
              aiGeneratedContent: data.content,
              isCompleted: false,
              lastUpdated: new Date().toISOString(),
            },
          ]
        }

        setFlowInstance(updatedInstance)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  // Update step response
  const handleUpdateResponse = async (updatedResponse: Partial<StepResponse>) => {
    if (!flowInstance) return

    try {
      setError(null)

      // Update locally first
      const updatedInstance = { ...flowInstance }
      const existingResponseIndex = updatedInstance.stepResponses?.findIndex(
        (resp) => resp.stepNumber === updatedResponse.stepNumber,
      )

      if (existingResponseIndex !== undefined && existingResponseIndex >= 0) {
        updatedInstance.stepResponses[existingResponseIndex] = {
          ...updatedInstance.stepResponses[existingResponseIndex],
          ...updatedResponse,
        }
      } else {
        updatedInstance.stepResponses = [
          ...(updatedInstance.stepResponses || []),
          {
            stepNumber: updatedResponse.stepNumber || currentStep,
            stepTitle:
              updatedResponse.stepTitle ||
              steps.find((s) => s.stepNumber === currentStep)?.stepTitle ||
              '',
            userInput: updatedResponse.userInput || '',
            aiGeneratedContent: updatedResponse.aiGeneratedContent || '',
            isCompleted: updatedResponse.isCompleted || false,
            lastUpdated: new Date().toISOString(),
          },
        ]
      }

      setFlowInstance(updatedInstance)

      // Then update on the server
      const response = await fetch(`/api/flow-instances/${flowInstanceId}/update-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...createBusinessHeaders('salarium'),
        },
        body: JSON.stringify(updatedResponse),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      // Check if we need to update status
      if (
        updatedResponse.isCompleted &&
        updatedInstance.stepResponses.every((resp) => resp.isCompleted) &&
        updatedInstance.stepResponses.length === steps.length
      ) {
        // All steps are complete, update the flow instance status
        await fetch(`/api/flow-instances/${flowInstanceId}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...createBusinessHeaders('salarium'),
          },
          body: JSON.stringify({ status: 'completed' }),
        })

        // Update local state with the new status
        setFlowInstance({
          ...updatedInstance,
          status: 'completed',
        })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update step')
    }
  }

  // Handle document export
  const handleExportDocument = async (format: 'pdf' | 'docx' | 'markdown') => {
    try {
      const response = await fetch(`/api/flow-instances/${flowInstanceId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...createBusinessHeaders('salarium'),
        },
        body: JSON.stringify({ format }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error exporting document: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `job-description.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to export document')
    }
  }

  // Handle sections from auto-cascade
  const handleSectionsGenerated = (sections: DocumentSection[]) => {
    if (!flowInstance) return

    const updatedInstance = { ...flowInstance }
    const updatedResponses = [...(updatedInstance.stepResponses || [])]

    // Map document sections to step responses
    sections.forEach((section) => {
      if (!section.stepNumber) return

      const existingResponseIndex = updatedResponses.findIndex(
        (resp) => resp.stepNumber === section.stepNumber,
      )

      const step = steps.find((s) => s.stepNumber === section.stepNumber)
      if (!step) return

      if (existingResponseIndex !== -1) {
        updatedResponses[existingResponseIndex] = {
          ...updatedResponses[existingResponseIndex],
          aiGeneratedContent:
            typeof section.content === 'string' ? section.content : JSON.stringify(section.content),
          isCompleted: true,
          lastUpdated: new Date().toISOString(),
        }
      } else {
        updatedResponses.push({
          stepNumber: section.stepNumber,
          stepTitle: step.stepTitle,
          userInput: section.title,
          aiGeneratedContent:
            typeof section.content === 'string' ? section.content : JSON.stringify(section.content),
          isCompleted: true,
          lastUpdated: new Date().toISOString(),
        })
      }
    })

    updatedInstance.stepResponses = updatedResponses
    setFlowInstance(updatedInstance)

    // Save all step responses to the server
    updatedResponses.forEach((response) => {
      handleUpdateResponse(response)
    })
  }

  // Get current step data
  const getCurrentStepData = () => {
    if (!flowInstance) return null

    const step = steps.find((s) => s.stepNumber === currentStep)
    if (!step) return null

    const stepResponse = flowInstance.stepResponses?.find(
      (response) => response.stepNumber === currentStep,
    )

    return { step, stepResponse }
  }

  // Loading state
  if (!flowInstance) {
    return (
      <div className="w-full flex justify-center p-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 w-full max-w-3xl bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  const currentStepData = getCurrentStepData()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Description Builder</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setShowAutoCascade(true)}
        >
          Auto-Generate All Sections
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StepSelector
            steps={steps}
            currentStep={currentStep}
            flowInstance={flowInstance}
            onStepChange={handleStepChange}
          />

          {currentStepData && (
            <StepContent
              step={currentStepData.step}
              stepResponse={currentStepData.stepResponse}
              onUpdateResponse={handleUpdateResponse}
              onGenerateAI={handleGenerateAI}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === steps.length}
              isGenerating={isGenerating}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <DocumentPreview flowInstance={flowInstance} onExport={handleExportDocument} />
        </div>
      </div>

      {/* Auto Cascade Integration */}
      <AutoCascadeIntegration
        isVisible={showAutoCascade}
        onSectionsGenerated={handleSectionsGenerated}
        onClose={() => setShowAutoCascade(false)}
        documentId={flowInstanceId}
      />
    </div>
  )
}

export default JobDescriptionWorkflow

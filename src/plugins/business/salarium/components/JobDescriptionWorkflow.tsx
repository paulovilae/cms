'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createBusinessHeaders } from '../../../../utilities/businessContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  Clock,
  FileText,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Download,
  Save,
  Printer,
  Eye,
  X,
  Search,
  Play,
  Zap,
  Settings,
} from 'lucide-react'
// Import QuickSearch components
import { QuickSearch } from './JobDescriptionWorkflow/components/QuickSearch'
import { ReferencePanel } from './JobDescriptionWorkflow/components/QuickSearch/ReferencePanel'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import jsPDF from 'jspdf'
import { Copy, Share2, CheckCircle2 } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// Import utility functions
import {
  loadOrCreateInstance,
  createNewInstance,
  updateStepResponse,
  generateFinalDocument,
} from './JobDescriptionWorkflow/utils/instanceHelpers'
import { FlowTemplate, FlowStep, FlowInstance, StepResponse } from './JobDescriptionWorkflow/types'

// Helper function to calculate relevance between steps
const calculateRelevance = (sourceStep: number, targetStep: number): number => {
  const relevanceMatrix: Record<number, Record<number, number>> = {
    // Job Title is highly relevant to all steps
    1: { 2: 0.9, 3: 0.8, 4: 0.7, 5: 0.8 },
    // Mission is very relevant to scope and responsibilities
    2: { 3: 0.9, 4: 0.8, 5: 0.6 },
    // Scope influences responsibilities and qualifications
    3: { 4: 0.9, 5: 0.7 },
    // Responsibilities directly influence qualifications
    4: { 5: 0.9 },
  }

  return relevanceMatrix[sourceStep]?.[targetStep] || 0.3
}

// Helper function to build context from previous steps
const buildPreviousStepsContext = (instance: FlowInstance, currentStep: number) => {
  if (!instance?.stepResponses || !Array.isArray(instance.stepResponses)) {
    return []
  }

  return instance.stepResponses
    .filter(
      (response) =>
        response.isCompleted &&
        response.stepNumber !== currentStep &&
        response.aiGeneratedContent.trim(),
    )
    .map((response) => ({
      stepNumber: response.stepNumber,
      stepTitle: response.stepTitle,
      content: response.aiGeneratedContent,
      relevanceWeight: calculateRelevance(response.stepNumber, currentStep),
    }))
    .sort((a, b) => b.relevanceWeight - a.relevanceWeight) // Sort by relevance
}

// Context Indicator Component
interface ContextIndicatorProps {
  previousContext: Array<{
    stepNumber: number
    stepTitle: string
    content: string
    relevanceWeight: number
  }>
}

const ContextIndicator: React.FC<ContextIndicatorProps> = ({ previousContext }) => {
  if (!previousContext || previousContext.length === 0) {
    return null
  }

  const relevantContext = previousContext.filter((ctx) => ctx.relevanceWeight > 0.3)

  if (relevantContext.length === 0) {
    return null
  }

  return (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <CheckCircle className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Using Context from Previous Steps
        </span>
      </div>
      <div className="space-y-1">
        {relevantContext.map((ctx) => (
          <div key={ctx.stepNumber} className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">{ctx.stepTitle}</span>
            <span className="text-blue-600 dark:text-blue-400">
              (Relevance: {Math.round(ctx.relevanceWeight * 100)}%)
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
        💡 AI will use this information to create a cohesive response
      </p>
    </div>
  )
}

// New Auto-Cascade Panel Component
interface AutoCascadePanelProps {
  isOpen: boolean
  onClose: () => void
  onStartCascade: () => void
  isCascading: boolean
  currentStepTitle: string
  progress: number
  completedCount: number
  totalCount: number
  stylePreference: 'detailed' | 'concise' | 'technical'
  onStylePreferenceChange: (style: 'detailed' | 'concise' | 'technical') => void
}

const AutoCascadePanel: React.FC<AutoCascadePanelProps> = ({
  isOpen,
  onClose,
  onStartCascade,
  isCascading,
  currentStepTitle,
  progress,
  completedCount,
  totalCount,
  stylePreference,
  onStylePreferenceChange,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Auto-Generate All Sections
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Automatically generate all sections of your job description
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCascading ? (
            <>
              {/* Progress Display */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Generating sections...</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Currently generating: <span className="font-medium">{currentStepTitle}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {completedCount} of {totalCount} sections completed
                </p>
              </div>

              {/* Cancel Button */}
              <Button variant="outline" className="w-full" onClick={onClose}>
                Cancel Generation
              </Button>
            </>
          ) : (
            <>
              {/* Configuration Options */}
              <div className="space-y-6 mb-6">
                <div>
                  <Label className="text-base mb-2 block">Output Style</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="style-detailed"
                        name="style"
                        checked={stylePreference === 'detailed'}
                        onChange={() => onStylePreferenceChange('detailed')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <Label
                        htmlFor="style-detailed"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Detailed — Comprehensive with specific examples
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="style-concise"
                        name="style"
                        checked={stylePreference === 'concise'}
                        onChange={() => onStylePreferenceChange('concise')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <Label htmlFor="style-concise" className="text-sm font-normal cursor-pointer">
                        Concise — Brief and to the point
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="style-technical"
                        name="style"
                        checked={stylePreference === 'technical'}
                        onChange={() => onStylePreferenceChange('technical')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <Label
                        htmlFor="style-technical"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Technical — Focus on skills and requirements
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Message */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800 mb-6">
                <p>
                  <strong>How it works:</strong> This will use the job title you've entered to
                  generate all sections of your job description automatically.
                </p>
                <p className="mt-1">
                  Each section will build upon previous ones for a cohesive document.
                </p>
              </div>

              {/* Start Button */}
              <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={onStartCascade}>
                <Zap className="w-4 h-4 mr-2" />
                Generate All Sections
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function JobDescriptionWorkflow() {
  const [template, setTemplate] = useState<FlowTemplate | null>(null)
  const [instance, setInstance] = useState<FlowInstance | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [userInput, setUserInput] = useState('')
  const [aiContent, setAiContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasProcessed, setHasProcessed] = useState(false)
  const [editableFinalDocument, setEditableFinalDocument] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({})
  const [showContextPreview, setShowContextPreview] = useState(false)

  // Reference search states
  const [referenceJob, setReferenceJob] = useState<any>(null)
  const [showReferencePanel, setShowReferencePanel] = useState(false)

  // Auto-cascade states
  const [showAutoCascadePanel, setShowAutoCascadePanel] = useState(false)
  const [isCascading, setIsCascading] = useState(false)
  const [cascadeProgress, setCascadeProgress] = useState(0)
  const [completedSections, setCompletedSections] = useState<number[]>([])
  const [currentCascadeStep, setCurrentCascadeStep] = useState(1)
  const [stylePreference, setStylePreference] = useState<'detailed' | 'concise' | 'technical'>(
    'detailed',
  )

  // Ref to prevent double execution in React StrictMode
  const hasInitialized = useRef(false)

  // Load the job description template on component mount
  useEffect(() => {
    // Prevent double execution in React StrictMode (development)
    if (hasInitialized.current) {
      console.log('🔍 useEffect skipped - already initialized (StrictMode protection)')
      return
    }
    hasInitialized.current = true

    console.log('🔍 useEffect triggered - loadTemplate called')
    loadTemplate()

    // Check if we have a reference job in localStorage
    try {
      const storedReference = localStorage.getItem('jobDescriptionReference')
      if (storedReference) {
        const parsedReference = JSON.parse(storedReference)
        setReferenceJob(parsedReference)
        setShowReferencePanel(true)
        // Clear storage after loading
        localStorage.removeItem('jobDescriptionReference')
      }
    } catch (error) {
      console.error('Failed to load reference job:', error)
    }
  }, [])

  // Initialize current step accordion as open
  useEffect(() => {
    if (template && currentStep <= template.steps.length) {
      setOpenAccordions((prev) => ({
        ...prev,
        [currentStep]: true,
      }))
    }
  }, [currentStep, template])

  const loadTemplate = async () => {
    console.log('🔍 loadTemplate called')
    try {
      setIsLoading(true)
      setError(null)

      // Load the job description creation template using standard Payload API
      const response = await fetch(
        '/api/flow-templates?where[category][equals]=hr&where[isActive][equals]=true',
        {
          headers: createBusinessHeaders('salarium'),
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle Payload's default response format
      if (!data.docs || data.docs.length === 0) {
        throw new Error('No templates found')
      }

      // Find the job description template
      const jobDescTemplate = data.docs.find((t: any) =>
        t.name.toLowerCase().includes('job description'),
      )

      console.log('🔍 Found', data.docs.length, 'templates')
      if (jobDescTemplate) {
        console.log('🔍 Selected template:', jobDescTemplate.name)
      }

      if (!jobDescTemplate) {
        throw new Error('Job Description template not found')
      }

      setTemplate(jobDescTemplate)

      // Check for existing instance first, create new one only if needed
      const loadedInstance = await loadOrCreateInstance(jobDescTemplate.id, jobDescTemplate.steps)

      if (loadedInstance) {
        setInstance(loadedInstance)
        setCurrentStep(loadedInstance.currentStep || 1)

        // Load existing response for current step if any
        const stepResponses = Array.isArray(loadedInstance.stepResponses)
          ? loadedInstance.stepResponses
          : []
        const currentStepResponse = stepResponses.find(
          (r: StepResponse) => r.stepNumber === (loadedInstance.currentStep || 1),
        )

        if (currentStepResponse) {
          setUserInput(currentStepResponse.userInput || '')
          setAiContent(currentStepResponse.aiGeneratedContent || '')
          setHasProcessed(!!currentStepResponse.aiGeneratedContent)
        }
      }
    } catch (error) {
      console.error('Error loading template:', error)
      setError(error instanceof Error ? error.message : 'Failed to load workflow')
    } finally {
      setIsLoading(false)
    }
  }

  const processWithAI = async () => {
    if (!template || !instance) return

    try {
      setIsProcessing(true)
      setError(null)

      // Get the current step data
      const currentStepData = template.steps.find((s) => s.stepNumber === currentStep)
      if (!currentStepData) {
        throw new Error(`Step ${currentStep} not found`)
      }

      // Build context from previous steps
      const previousContext = buildPreviousStepsContext(instance, currentStep)

      // Call AI processing endpoint
      const response = await fetch('/api/salarium/process-job-description', {
        method: 'POST',
        headers: createBusinessHeaders('salarium'),
        body: JSON.stringify({
          step: currentStep,
          stepTitle: currentStepData.title,
          userInput: userInput.trim(),
          systemPrompt: currentStepData.systemPrompt,
          previousContext,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Update component state
      setAiContent(data.generatedContent || '')
      setHasProcessed(true)

      // Save the processed data
      const updatedResponse = await updateStepResponse(
        instance.id,
        {
          stepNumber: currentStep,
          stepTitle: currentStepData.title,
          userInput: userInput.trim(),
          aiGeneratedContent: data.generatedContent,
          isCompleted: true,
        },
        Array.isArray(instance.stepResponses) ? instance.stepResponses : [],
        template.steps.length,
      )

      if (updatedResponse) {
        setInstance(updatedResponse)
      }
    } catch (error) {
      console.error('AI processing error:', error)
      if (error instanceof Error && error.name === 'AbortError') {
        setError('AI processing timed out. The model may be slow to respond. Please try again.')
      } else {
        setError(error instanceof Error ? error.message : 'AI processing failed')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const saveCurrentStep = async (generatedContent?: string) => {
    if (!instance || !template || !instance.id) {
      console.error('Cannot save: missing instance, template, or instance ID')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      // Get the current step data
      const currentStepData = template.steps.find((s) => s.stepNumber === currentStep)
      if (!currentStepData) {
        throw new Error(`Step ${currentStep} not found`)
      }

      // Use AI content as the final content (user can edit it directly)
      const finalContent = generatedContent || aiContent

      const updatedResponse = await updateStepResponse(
        instance.id,
        {
          stepNumber: currentStep,
          stepTitle: currentStepData.title,
          userInput: userInput.trim(),
          aiGeneratedContent: finalContent,
          isCompleted: !!finalContent,
        },
        Array.isArray(instance.stepResponses) ? instance.stepResponses : [],
        template.steps.length,
      )

      if (updatedResponse) {
        setInstance(updatedResponse)
      }

      // If this is step 1 (Job Title) and we have AI content, update the instance title
      if (currentStep === 1 && finalContent) {
        const jobTitle = finalContent.trim()
        if (jobTitle) {
          const now = new Date()
          const dateStr = now.toLocaleDateString()
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          const updatedTitle = `${jobTitle} - ${dateStr} - ${timeStr}`

          // Update instance title
          const response = await fetch(`/api/flow-instances/${instance.id}`, {
            method: 'PATCH',
            headers: createBusinessHeaders('salarium'),
            body: JSON.stringify({
              title: updatedTitle,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            const instanceData = data.doc || data
            setInstance(instanceData)
          }
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      setError(error instanceof Error ? error.message : 'Failed to save progress')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAccordion = (stepNumber: number) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }))
  }

  const navigateToStep = (stepNumber: number) => {
    const totalSteps = template ? template.steps.length + 1 : 0
    if (!template || stepNumber < 1 || stepNumber > totalSteps) return

    console.log('Navigating to step:', stepNumber, 'from step:', currentStep)

    // Save current step before navigating
    if ((userInput.trim() || aiContent) && instance?.id) {
      saveCurrentStep()
    }

    setCurrentStep(stepNumber)

    // If navigating to final step, clear form data
    if (stepNumber === totalSteps) {
      setUserInput('')
      setAiContent('')
      setHasProcessed(false)
      return
    }

    // Load data for the new step - ensure stepResponses is an array
    const stepResponses = Array.isArray(instance?.stepResponses) ? instance.stepResponses : []
    const stepResponse = stepResponses.find((r) => r.stepNumber === stepNumber)

    console.log('Step responses:', stepResponses)
    console.log('Found step response for step', stepNumber, ':', stepResponse)

    if (stepResponse) {
      console.log('Loading existing step data:', {
        userInput: stepResponse.userInput,
        aiContent: stepResponse.aiGeneratedContent,
        hasProcessed: !!stepResponse.aiGeneratedContent,
      })
      setUserInput(stepResponse.userInput || '')
      setAiContent(stepResponse.aiGeneratedContent || '')
      setHasProcessed(!!stepResponse.aiGeneratedContent)
    } else {
      console.log('No existing step data, clearing form')
      setUserInput('')
      setAiContent('')
      setHasProcessed(false)
    }
  }

  // Rest of your component methods here...
  // ... downloadAsPDF, downloadAsTXT, downloadAsWord, copyToClipboard, shareOnSocial, printDocument, saveFinalDocument ...

  // Render the component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading workflow...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={loadTemplate} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 dark:text-gray-300">Template not available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If no instance exists, show a start screen
  if (!instance) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Job Description Creator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create professional job descriptions in minutes with AI assistance
          </p>
        </div>

        {/* Start Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Ready to Create a Job Description?</CardTitle>
            <CardDescription className="text-center">
              Enter the job title to get started. The AI will help you create a comprehensive job
              description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {/* Add QuickSearch at the top of step 1 */}
              <QuickSearch
                onSelectReference={(job) => {
                  setReferenceJob(job)
                  setShowReferencePanel(true)
                  // Suggest the title as a starting point but don't auto-fill
                  if (job.title) {
                    setUserInput(`Similar to: ${job.title}`)
                  }
                }}
              />

              <Label htmlFor="job-title-input" className="text-base font-medium">
                Job Title
              </Label>
              <Input
                id="job-title-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., Senior Software Engineer, Marketing Manager, Sales Director"
                className="mt-2"
              />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                💡 Be specific about the role level and department for better results
              </p>
            </div>

            <Button
              onClick={processWithAI}
              disabled={!userInput.trim() || isProcessing}
              className="w-full bg-violet-600 hover:bg-violet-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Job Description...
                </>
              ) : (
                'Start Creating Job Description'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Add hardcoded final step to the workflow
  const totalSteps = template.steps.length + 1 // +1 for hardcoded "Review & Finalize" step
  const currentStepData = template.steps.find((s) => s.stepNumber === currentStep)
  const isLastDatabaseStep = currentStep === template.steps.length
  const isFinalStep = currentStep === totalSteps
  const canProceed = hasProcessed && aiContent.trim() !== ''

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Job Description Creator
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Create professional job descriptions in minutes with AI assistance
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <Badge variant={instance.status === 'completed' ? 'default' : 'secondary'}>
              {instance.status === 'completed' ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
          <Progress value={instance.progress} className="mb-4" />

          {/* Step Navigation */}
          <div className="flex space-x-2 overflow-x-auto">
            {template.steps.map((step) => {
              const stepResponse = instance.stepResponses?.find(
                (r) => r.stepNumber === step.stepNumber,
              )
              const isCompleted = stepResponse?.isCompleted || false
              const isCurrent = step.stepNumber === currentStep

              return (
                <button
                  key={step.stepNumber}
                  onClick={() => navigateToStep(step.stepNumber)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                      : isCompleted
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span>{step.title}</span>
                  </div>
                </button>
              )
            })}

            {/* Final Review Step */}
            <button
              onClick={() => navigateToStep(totalSteps)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isFinalStep
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                  : instance.finalDocument
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
              disabled={!instance.finalDocument}
            >
              <div className="flex items-center space-x-1">
                {instance.finalDocument ? (
                  isFinalStep ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-current" />
                )}
                <span>Review & Finalize</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main content area - conditionally show editing interface or final document */}
      {currentStepData && !isFinalStep && (
        <Card>
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {currentStepData.title}
            </CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question */}
            <div>
              <Label htmlFor="content-input" className="text-base font-medium">
                {currentStepData.questionText}
              </Label>
              {currentStepData.isRequired && <span className="text-red-500 ml-1">*</span>}
            </div>

            {/* Reference Panel - show if reference is selected */}
            {showReferencePanel && referenceJob && (
              <ReferencePanel
                reference={referenceJob}
                onClose={() => setShowReferencePanel(false)}
                currentStep={currentStep}
              />
            )}

            {/* Context Indicator */}
            <ContextIndicator previousContext={buildPreviousStepsContext(instance, currentStep)} />

            {!hasProcessed ? (
              <>
                {/* Initial User Input */}
                <div>
                  {currentStepData.stepType === 'textarea' ? (
                    <Textarea
                      id="user-input"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter your response..."
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <Input
                      id="user-input"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter your response..."
                    />
                  )}
                </div>

                {/* Process Button */}
                <Button
                  onClick={processWithAI}
                  disabled={!userInput.trim() || isProcessing}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing with AI...
                    </>
                  ) : (
                    'Generate with AI'
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* Editable AI Generated Content */}
                <div>
                  <Label htmlFor="ai-content" className="text-sm font-medium mb-2 block">
                    AI Generated Content (Editable):
                  </Label>
                  <Textarea
                    id="ai-content"
                    value={aiContent}
                    onChange={(e) => setAiContent(e.target.value)}
                    placeholder="AI generated content will appear here..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    💡 You can edit this content directly. Changes will be saved automatically.
                  </p>
                </div>

                {/* Regenerate Button */}
                <div className="flex space-x-2">
                  <Button
                    onClick={processWithAI}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      'Regenerate with AI'
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setHasProcessed(false)
                      setAiContent('')
                    }}
                    variant="outline"
                  >
                    Start Over
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigateToStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => saveCurrentStep()} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>

          {isLastDatabaseStep ? (
            <Button
              onClick={async () => {
                await generateFinalDocument(
                  instance.id,
                  template.outputTemplate,
                  instance.stepResponses,
                )
                navigateToStep(totalSteps) // Navigate to final step after generating
              }}
              disabled={!canProceed || isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Generate & Review
            </Button>
          ) : (
            <Button onClick={() => navigateToStep(currentStep + 1)} disabled={!canProceed}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

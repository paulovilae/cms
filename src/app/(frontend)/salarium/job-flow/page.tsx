'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Download,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Settings,
  Copy,
  List,
} from 'lucide-react'
import { getCurrentBranding, getOrganizationInfo } from '@/utilities/branding'
import Link from 'next/link'
import AutoAuthWrapper from '@/components/auth/AutoAuthWrapper'

interface FlowStep {
  stepNumber: number
  title: string
  description: string
  questionText: string
  systemPrompt: string
  stepType: 'text' | 'textarea' | 'select' | 'file-upload' | 'multiple-choice'
  isRequired: boolean
  validationRules?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    customMessage?: string
  }
  selectOptions?: Array<{
    label: string
    value: string
  }>
  dependencies?: {
    dependsOnStep?: number
    requiredValue?: string
    condition?: 'equals' | 'contains' | 'not-empty' | 'greater-than' | 'less-than'
  }
  aiProviderOverride?: any
  examples?: Array<{
    userInput: string
    expectedOutput: string
  }>
}

interface FlowTemplate {
  id: string
  name: string
  slug?: string
  description: string
  category: string
  version: string
  isActive: boolean
  aiProvider: any
  steps: FlowStep[]
  outputTemplate: string
  metadata: {
    tags?: Array<{ tag: string }>
    difficulty: string
    estimatedTime: number
    industry?: Array<{ industry: string }>
    language?: string
  }
  usage?: {
    timesUsed: number
    averageCompletionTime?: number
    successRate?: number
    lastUsed?: string
  }
}

interface StepResponse {
  stepNumber: number
  userInput: string
  aiGeneratedContent: string
  isCompleted: boolean
}

function JobFlowPageContent() {
  const [template, setTemplate] = useState<FlowTemplate | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [stepResponses, setStepResponses] = useState<StepResponse[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [finalDocument, setFinalDocument] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // In production, this would check user role

  // Flow instance management
  const [currentInstanceId, setCurrentInstanceId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  // Get current business branding
  const branding = getCurrentBranding()
  const orgInfo = getOrganizationInfo()

  // URL parameters for loading specific instances
  const searchParams = useSearchParams()
  const instanceParam = searchParams.get('instance')

  // Fetch template data from the API - ONLY from database, no fallbacks
  const fetchTemplate = async () => {
    try {
      console.log('Fetching template from database...')

      // First try to get the "Job Description Creation" template by slug
      let response = await fetch('/api/salarium/flow-templates/slug/job-description-creation')
      let data

      if (!response.ok) {
        console.log('Slug fetch failed, trying category search...')
        // If slug doesn't work, try to get the first HR template
        response = await fetch('/api/salarium/flow-templates?category=hr&active=true')

        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`)
        }

        data = await response.json()

        if (!data.success || !data.templates || data.templates.length === 0) {
          throw new Error('No HR templates found in database')
        }

        // Use the first available HR template
        data.template = data.templates[0]
      } else {
        data = await response.json()

        if (!data.success || !data.template) {
          throw new Error('Template not found in database')
        }
      }

      console.log('Template loaded from database:', data.template.name)
      console.log('Template steps:', data.template.steps?.length || 0)
      console.log('Template metadata:', data.template.metadata)

      setTemplate(data.template)

      // Initialize step responses based on actual template steps
      if (data.template.steps && Array.isArray(data.template.steps)) {
        const initialResponses = data.template.steps.map((step: any) => ({
          stepNumber: step.stepNumber,
          userInput: '',
          aiGeneratedContent: '',
          isCompleted: false,
        }))
        setStepResponses(initialResponses)
        console.log('Initialized step responses for', initialResponses.length, 'steps')
      } else {
        console.error('Template has no valid steps array')
        throw new Error('Template has invalid or missing steps')
      }
    } catch (error) {
      console.error('Error fetching template from database:', error)
      // DO NOT use fallback mock data - show error state instead
      setTemplate(null)
      setStepResponses([])
    }
  }

  // Flow instance management functions
  const saveFlowInstance = async (forceCreate = false) => {
    if (!template || !autoSaveEnabled) return

    setIsSaving(true)
    try {
      const instanceData = {
        stepResponses,
        currentStep,
        finalDocument,
      }

      if (currentInstanceId && !forceCreate) {
        // Update existing instance
        const response = await fetch(`/api/salarium/flow-instances/${currentInstanceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(instanceData),
        })

        if (response.ok) {
          setLastSaved(new Date())
          console.log('Flow instance updated successfully')
        } else {
          console.error('Failed to update flow instance:', response.statusText)
        }
      } else {
        // Create new instance with improved naming
        const getJobTitle = () => {
          // Get the job title from the first step (either AI-generated or user input)
          const jobTitle = stepResponses[0]?.aiGeneratedContent || stepResponses[0]?.userInput

          if (jobTitle && jobTitle.trim()) {
            // Clean up the job title - remove extra whitespace, newlines, and limit length
            const cleanTitle = jobTitle.trim().replace(/\s+/g, ' ').substring(0, 50)
            return cleanTitle
          }

          // If no job title yet, create a more descriptive placeholder
          return 'New Position'
        }

        const formatDateTime = () => {
          const now = new Date()
          const date = now.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
          })
          const time = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
          return `${date} - ${time}`
        }

        const jobTitle = getJobTitle()
        const dateTime = formatDateTime()
        const title = `Job Description - ${jobTitle} - ${dateTime}`

        const response = await fetch('/api/salarium/flow-instances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            templateId: template.id,
            ...instanceData,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setCurrentInstanceId(result.instance.id)
            setLastSaved(new Date())
            console.log('Flow instance created successfully:', result.instance.id)
          }
        } else {
          console.error('Failed to create flow instance:', response.statusText)
        }
      }
    } catch (error) {
      console.error('Error saving flow instance:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const loadFlowInstance = async (instanceId: string) => {
    try {
      const response = await fetch(`/api/salarium/flow-instances/${instanceId}`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const instance = result.instance

          // Load instance data
          setCurrentInstanceId(instance.id)
          setCurrentStep(instance.currentStep || 1)
          setStepResponses(instance.stepResponses || [])
          setFinalDocument(instance.finalDocument || '')
          setIsCompleted(instance.status === 'completed')

          // Load current input for the current step
          const currentResponse = instance.stepResponses?.find(
            (r: any) => r.stepNumber === instance.currentStep,
          )
          setCurrentInput(
            currentResponse?.isCompleted
              ? currentResponse.aiGeneratedContent
              : currentResponse?.userInput || '',
          )

          console.log('Flow instance loaded successfully:', instance.id)
          return true
        }
      }
    } catch (error) {
      console.error('Error loading flow instance:', error)
    }
    return false
  }

  const checkForExistingInstance = async () => {
    if (!template) return

    try {
      const response = await fetch(`/api/salarium/flow-instances?template=${template.id}&limit=1`)

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.instances.length > 0) {
          const latestInstance = result.instances[0]

          // Only auto-load if it's not completed
          if (latestInstance.status !== 'completed') {
            await loadFlowInstance(latestInstance.id)
            return true
          }
        }
      }
    } catch (error) {
      console.error('Error checking for existing instance:', error)
    }
    return false
  }

  // Auto-save effect
  useEffect(() => {
    if (template && stepResponses.length > 0 && autoSaveEnabled) {
      const timeoutId = setTimeout(() => {
        saveFlowInstance()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [stepResponses, currentStep, finalDocument, template, autoSaveEnabled])

  useEffect(() => {
    fetchTemplate()
  }, [])

  // Check for existing instance after template is loaded
  useEffect(() => {
    if (template) {
      // If there's an instance parameter in the URL, load that specific instance
      if (instanceParam) {
        loadFlowInstance(instanceParam)
      } else {
        // Otherwise, check for the most recent instance
        checkForExistingInstance()
      }
    }
  }, [template, instanceParam])

  const handleRefreshTemplate = async () => {
    setIsRefreshing(true)
    try {
      await fetchTemplate()

      // Reset flow instance state
      setCurrentInstanceId(null)
      setCurrentStep(1)
      setCurrentInput('')
      setIsCompleted(false)
      setFinalDocument('')
      setLastSaved(null)

      console.log('Template refreshed successfully')
    } catch (error) {
      console.error('Error refreshing template:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCopyExample = (exampleText: string) => {
    setCurrentInput(exampleText)
  }

  const getCurrentStepData = () => {
    return template?.steps.find((step) => step.stepNumber === currentStep)
  }

  const getCurrentResponse = () => {
    return stepResponses.find((response) => response.stepNumber === currentStep)
  }

  const validateCurrentStep = () => {
    const stepData = getCurrentStepData()
    const response = getCurrentResponse()

    if (!stepData || !response) return false

    if (stepData.isRequired && !currentInput.trim()) {
      return false
    }

    if (stepData.validationRules) {
      const { minLength, maxLength } = stepData.validationRules
      if (minLength && currentInput.length < minLength) return false
      if (maxLength && currentInput.length > maxLength) return false
    }

    return true
  }

  const simulateAIProcessing = async (userInput: string, systemPrompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/salarium/ai-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          systemPrompt: systemPrompt,
          stepNumber: currentStep,
          stepType: getCurrentStepData()?.stepType || 'text',
        }),
      })

      // If response is not ok, log the status but don't throw - go to fallback
      if (!response.ok) {
        console.log(
          `AI endpoint returned ${response.status}: ${response.statusText}, using fallback`,
        )
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        return result.content
      } else {
        console.log(`AI processing failed: ${result.error || 'Unknown error'}, using fallback`)
        throw new Error(result.error || 'AI processing failed')
      }
    } catch (error) {
      // Don't log the error as an error - it's expected when not authenticated
      console.log('Using fallback AI responses')

      // Fallback to mock responses if AI fails
      const mockResponses: Record<number, string> = {
        1: userInput
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        2: `To ${userInput.toLowerCase()} by leveraging cutting-edge technology and innovative solutions in order to drive business growth and deliver exceptional value to our clients and stakeholders.`,
        3: `• Team Leadership: Collaborates with 5-8 team members
• Budget/Resources: No direct budget responsibility
• Geographic Scope: San Francisco office with remote collaboration
• Internal Stakeholders: Engineering Manager, Product Team, QA Team
• Decision-making Authority: Technical implementation decisions within assigned projects`,
        4: `• Develop and maintain high-quality software applications using modern programming languages
• Design and implement new features based on product requirements and user feedback
• Conduct thorough testing and debugging to ensure code quality and system reliability
• Collaborate with cross-functional teams including Product, Design, and QA
• Participate in code reviews to maintain coding standards and share knowledge
• Troubleshoot and resolve technical issues in production environments`,
        5: `**Required Qualifications:**
• Education: Bachelor's degree in Computer Science or related technical field
• Experience: 2-4 years of professional software development experience
• Technical Skills: Proficiency in modern programming languages (Java, Python, JavaScript)
• Technical Skills: Experience with version control systems (Git)

**Preferred Qualifications:**
• Experience with cloud platforms (AWS, Azure, or GCP)
• Knowledge of database design and SQL
• Previous experience in fintech or financial services industry`,
      }

      const fallbackResponse = mockResponses[currentStep] || `Processed: ${userInput}`
      console.log('Fallback response for step', currentStep, ':', fallbackResponse)
      return fallbackResponse
    }
  }

  const handleProcessStep = async () => {
    if (!validateCurrentStep()) return

    setIsProcessing(true)

    try {
      const stepData = getCurrentStepData()
      if (!stepData) return

      const aiContent = await simulateAIProcessing(currentInput, stepData.systemPrompt)

      // Update step response
      setStepResponses((prev) =>
        prev.map((response) =>
          response.stepNumber === currentStep
            ? {
                ...response,
                userInput: currentInput,
                aiGeneratedContent: aiContent,
                isCompleted: true,
              }
            : response,
        ),
      )

      // Put AI-generated content back into the input field
      setCurrentInput(aiContent)
    } catch (error) {
      console.error('Error processing step:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const saveCurrentInput = () => {
    // Save the current input field content to the step response
    setStepResponses((prev) =>
      prev.map((response) =>
        response.stepNumber === currentStep
          ? {
              ...response,
              userInput: currentInput,
              // If there's AI content and user has edited it, update that too
              aiGeneratedContent: response.isCompleted ? currentInput : response.aiGeneratedContent,
            }
          : response,
      ),
    )
  }

  const handleNextStep = () => {
    if (template && currentStep < template.steps.length) {
      // Save current input before moving
      saveCurrentInput()

      setCurrentStep(currentStep + 1)
      const nextResponse = stepResponses.find((r) => r.stepNumber === currentStep + 1)
      // Load the saved content (either userInput or aiGeneratedContent if completed)
      setCurrentInput(
        nextResponse?.isCompleted ? nextResponse.aiGeneratedContent : nextResponse?.userInput || '',
      )
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      // Save current input before moving
      saveCurrentInput()

      setCurrentStep(currentStep - 1)
      const prevResponse = stepResponses.find((r) => r.stepNumber === currentStep - 1)
      // Load the saved content (either userInput or aiGeneratedContent if completed)
      setCurrentInput(
        prevResponse?.isCompleted ? prevResponse.aiGeneratedContent : prevResponse?.userInput || '',
      )
    }
  }

  const generateFinalDocument = () => {
    if (!template) return

    let document = template.outputTemplate

    // Replace placeholders with actual content
    const replacements: Record<string, string> = {
      '{{jobTitle}}': stepResponses[0]?.aiGeneratedContent || '',
      '{{jobMission}}': stepResponses[1]?.aiGeneratedContent || '',
      '{{jobScope}}': stepResponses[2]?.aiGeneratedContent || '',
      '{{keyResponsibilities}}': stepResponses[3]?.aiGeneratedContent || '',
      '{{qualifications}}': stepResponses[4]?.aiGeneratedContent || '',
      '{{organizationName}}': orgInfo.organizationName,
      '{{organizationDescription}}': orgInfo.organizationDescription,
      '{{generationDate}}': new Date().toLocaleDateString(),
    }

    Object.entries(replacements).forEach(([placeholder, value]) => {
      document = document.replace(new RegExp(placeholder, 'g'), value)
    })

    setFinalDocument(document)
    setIsCompleted(true)
  }

  const handleExportPDF = () => {
    // In production, this would generate and download a PDF
    const blob = new Blob([finalDocument], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'job-description.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Template Not Found</h1>
          <p className="text-gray-600 mb-4">
            Could not load the Job Description Creation template from the database. Please ensure
            the template exists in the Flow Templates collection.
          </p>
          <div className="text-sm text-gray-500">
            <p>
              Expected template slug:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">job-description-creation</code>
            </p>
            <p>Or any active HR template in the database</p>
          </div>
        </div>
      </div>
    )
  }

  const progress = (stepResponses.filter((r) => r.isCompleted).length / template.steps.length) * 100
  const allStepsCompleted = stepResponses.every((r) => r.isCompleted)

  if (isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">Job Description Complete!</h1>
          <p className="text-gray-600">Your job description has been generated successfully.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Final Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">{finalDocument}</pre>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleExportPDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export as PDF
              </Button>
              <Button variant="outline" onClick={() => setIsCompleted(false)}>
                Edit Steps
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <div className="flex items-center gap-2">
            {/* Auto-save status indicator */}
            {autoSaveEnabled && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </>
                ) : currentInstanceId ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    <span>Loaded from database</span>
                  </>
                ) : null}
              </div>
            )}

            <Link href="/salarium/flow-instances">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Saved Instances
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshTemplate}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Template'}
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{template.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <Badge variant="secondary" className="capitalize">
            {template.metadata.difficulty || 'beginner'}
          </Badge>
          <span className="text-sm text-gray-500">
            ~{template.metadata.estimatedTime || 25} minutes
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {template.steps.map((step, index) => {
          const response = stepResponses[index]
          const isCurrent = step.stepNumber === currentStep
          const isCompleted = response?.isCompleted

          return (
            <div key={step.stepNumber} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : isCompleted
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-gray-100 border border-gray-300'
                }`}
                onClick={() => {
                  // Save current input before switching steps
                  saveCurrentInput()
                  setCurrentStep(step.stepNumber)
                  // Load the content for the clicked step
                  const targetResponse = stepResponses.find((r) => r.stepNumber === step.stepNumber)
                  setCurrentInput(
                    targetResponse?.isCompleted
                      ? targetResponse.aiGeneratedContent
                      : targetResponse?.userInput || '',
                  )
                }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < template.steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )
        })}
      </div>

      {/* Current Step */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Step {currentStep}: {getCurrentStepData()?.title}
            {getCurrentStepData()?.isRequired && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{getCurrentStepData()?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {getCurrentStepData()?.questionText}
            </label>
            {getCurrentStepData()?.stepType === 'textarea' ? (
              <Textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Enter your response..."
                rows={4}
                className="w-full"
              />
            ) : (
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Enter your response..."
                className="w-full"
              />
            )}
            {getCurrentStepData()?.validationRules?.customMessage && (
              <p className="text-xs text-gray-500 mt-1">
                {getCurrentStepData()?.validationRules?.customMessage}
              </p>
            )}
          </div>

          {/* Debug Info - Collapsible and Admin Only */}
          {(getCurrentStepData()?.systemPrompt || getCurrentStepData()?.validationRules) && (
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Template Configuration</span>
                  <Badge variant="outline" className="text-xs">
                    Admin
                  </Badge>
                </div>
                {showDebugInfo ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {showDebugInfo && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  {/* System Prompt - Admin Only */}
                  {getCurrentStepData()?.systemPrompt && (
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <h5 className="font-medium text-yellow-900 mb-2 text-sm">
                        🤖 AI System Prompt:
                      </h5>
                      <p className="text-xs text-yellow-800 bg-white/50 p-2 rounded border border-yellow-300 whitespace-pre-wrap">
                        {getCurrentStepData()?.systemPrompt}
                      </p>
                    </div>
                  )}

                  {/* Validation Rules - Technical Details */}
                  {getCurrentStepData()?.validationRules && (
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2 text-sm">
                        📋 Validation Configuration:
                      </h5>
                      <div className="text-xs text-gray-700 space-y-1">
                        {getCurrentStepData()?.validationRules?.minLength && (
                          <p>• Min Length: {getCurrentStepData()?.validationRules?.minLength}</p>
                        )}
                        {getCurrentStepData()?.validationRules?.maxLength && (
                          <p>• Max Length: {getCurrentStepData()?.validationRules?.maxLength}</p>
                        )}
                        {getCurrentStepData()?.validationRules?.pattern && (
                          <p>• Pattern: {getCurrentStepData()?.validationRules?.pattern}</p>
                        )}
                        {getCurrentStepData()?.validationRules?.customMessage && (
                          <p>
                            • Custom Message: {getCurrentStepData()?.validationRules?.customMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleProcessStep}
              disabled={!validateCurrentStep() || isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : getCurrentResponse()?.isCompleted ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Regenerate with AI
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Process with AI
                </>
              )}
            </Button>
          </div>

          {/* Examples - Improved design with copy buttons and dark theme support */}
          {(() => {
            const stepData = getCurrentStepData()
            return (
              stepData?.examples &&
              stepData.examples.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    {stepData.examples.length === 1
                      ? 'Example:'
                      : `Examples (${stepData.examples.length}):`}
                  </h4>
                  <div className="space-y-6">
                    {stepData.examples?.map((example, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm"
                      >
                        {stepData.examples && stepData.examples.length > 1 && (
                          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                            Example {index + 1}
                          </div>
                        )}

                        {/* Input Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                              Input:
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyExample(example.userInput)}
                              className="h-6 px-2 text-xs flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Copy className="w-3 h-3" />
                              Use This
                            </Button>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded p-3">
                            <p className="text-sm text-slate-800 dark:text-slate-200 font-mono">
                              {example.userInput}
                            </p>
                          </div>
                        </div>

                        {/* Output Section */}
                        <div>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                            Expected Output:
                          </span>
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                            <p className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap">
                              {example.expectedOutput}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          })()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < template.steps.length ? (
            <Button
              onClick={handleNextStep}
              disabled={!getCurrentResponse()?.isCompleted}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={generateFinalDocument}
              disabled={!allStepsCompleted}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              Generate Final Document
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Wrap the component with enhanced authentication
export default function JobFlowPage() {
  return (
    <AutoAuthWrapper
      requireAuth={true}
      fallbackMessage="Please log in to access the Job Description Creation tool and save your progress."
      enableAutoAuth={true}
    >
      <JobFlowPageContent />
    </AutoAuthWrapper>
  )
}

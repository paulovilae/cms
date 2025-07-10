'use client'

import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'
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

interface FlowTemplate {
  id: string
  name: string
  description: string
  steps: FlowStep[]
  outputTemplate: string
  metadata?: {
    difficulty?: string
    estimatedTime?: number
    tags?: Array<{ tag: string }>
    industry?: Array<{ industry: string }>
    language?: string
  }
}

interface FlowStep {
  stepNumber: number
  title: string
  description: string
  questionText: string
  systemPrompt: string
  stepType: 'text' | 'textarea' | 'select'
  isRequired: boolean
  validationRules?: {
    minLength?: number
    maxLength?: number
    customMessage?: string
  }
  examples?: Array<{
    userInput: string
    expectedOutput: string
  }>
}

interface FlowInstance {
  id: string
  title: string
  template: string
  status: 'draft' | 'in-progress' | 'completed'
  currentStep: number
  totalSteps: number
  progress: number
  stepResponses: StepResponse[]
  finalDocument: string
}

interface StepResponse {
  stepNumber: number
  stepTitle: string
  userInput: string
  aiGeneratedContent: string
  isCompleted: boolean
  completedAt?: string
}

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

  // Load the job description template on component mount
  useEffect(() => {
    loadTemplate()
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

      if (!jobDescTemplate) {
        throw new Error('Job Description template not found')
      }

      setTemplate(jobDescTemplate)

      // Check for existing instance first, create new one only if needed
      await loadOrCreateInstance(jobDescTemplate)
    } catch (error) {
      console.error('Error loading template:', error)
      setError(error instanceof Error ? error.message : 'Failed to load workflow')
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrCreateInstance = async (template: FlowTemplate) => {
    try {
      // First, try to find an existing draft instance for this user and template
      let existingResponse = await fetch(
        `/api/flow-instances?where[template][equals]=${template.id}&where[status][equals]=draft&limit=1`,
        {
          headers: createBusinessHeaders('salarium'),
        },
      )

      if (!existingResponse.ok) {
        throw new Error(`HTTP error! status: ${existingResponse.status}`)
      }

      let existingData = await existingResponse.json()

      // If no draft found, try in-progress
      if (!existingData.docs || existingData.docs.length === 0) {
        existingResponse = await fetch(
          `/api/flow-instances?where[template][equals]=${template.id}&where[status][equals]=in-progress&limit=1`,
          {
            headers: createBusinessHeaders('salarium'),
          },
        )

        if (existingResponse.ok) {
          existingData = await existingResponse.json()
        }
      }

      if (existingData.docs && existingData.docs.length > 0) {
        // Use existing instance
        const existingInstance = existingData.docs[0]
        setInstance(existingInstance)
        setCurrentStep(existingInstance.currentStep || 1)

        // Load existing response for current step if any
        const stepResponses = Array.isArray(existingInstance.stepResponses)
          ? existingInstance.stepResponses
          : []
        const currentStepResponse = stepResponses.find(
          (r: StepResponse) => r.stepNumber === (existingInstance.currentStep || 1),
        )
        if (currentStepResponse) {
          setUserInput(currentStepResponse.userInput || '')
          setAiContent(currentStepResponse.aiGeneratedContent || '')
          setHasProcessed(!!currentStepResponse.aiGeneratedContent)
        }
      } else {
        // Create a new instance
        await createNewInstance(template)
      }
    } catch (error) {
      console.error('Error loading or creating instance:', error)
      // Fallback to creating new instance
      await createNewInstance(template)
    }
  }

  const createNewInstance = async (template: FlowTemplate) => {
    try {
      // First get the current user info
      const userResponse = await fetch('/api/users/me', {
        headers: createBusinessHeaders('salarium'),
      })

      if (!userResponse.ok) {
        throw new Error('Failed to get user information')
      }

      const userData = await userResponse.json()

      const response = await fetch('/api/flow-instances', {
        method: 'POST',
        headers: createBusinessHeaders('salarium'),
        body: JSON.stringify({
          title: `Job Description - New Position - ${new Date().toLocaleDateString()}`,
          template: template.id,
          user: userData.user.id, // ✅ Include user ID
          currentStep: 1,
          totalSteps: template.steps.length,
          stepResponses: template.steps.map((step, index) => ({
            stepNumber: step.stepNumber,
            stepTitle: step.title,
            userInput: '',
            aiGeneratedContent: '',
            isCompleted: false,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.[0]?.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle Payload's response format - the document is in data.doc
      const instanceData = data.doc || data
      setInstance(instanceData)
      setCurrentStep(1)

      // Load existing response for current step if any
      const stepResponses = Array.isArray(instanceData.stepResponses)
        ? instanceData.stepResponses
        : []
      const currentStepResponse = stepResponses.find((r: StepResponse) => r.stepNumber === 1)
      if (currentStepResponse) {
        setUserInput(currentStepResponse.userInput || '')
        setAiContent(currentStepResponse.aiGeneratedContent || '')
        setHasProcessed(!!currentStepResponse.aiGeneratedContent)
      }
    } catch (error) {
      console.error('Error creating instance:', error)
      setError(error instanceof Error ? error.message : 'Failed to create workflow')
    }
  }

  const processWithAI = async () => {
    console.log('processWithAI called for step:', currentStep)
    console.log('Current state:', {
      userInput,
      hasProcessed,
      template: !!template,
      instance: !!instance,
    })

    if (!template || !instance || !userInput.trim()) {
      console.log('Early return - missing requirements:', {
        template: !!template,
        instance: !!instance,
        userInput: userInput.trim(),
      })
      return
    }

    const currentStepData = template.steps.find((s) => s.stepNumber === currentStep)
    console.log('Current step data:', currentStepData)

    if (!currentStepData) {
      console.log('No step data found for step:', currentStep)
      return
    }

    // Check if instance has an ID
    if (!instance.id) {
      throw new Error('Missing ID of document to update.')
    }

    try {
      setIsProcessing(true)
      setError(null)

      // Build context from previous completed steps
      const previousStepsContext = buildPreviousStepsContext(instance, currentStep)
      console.log('Previous steps context:', previousStepsContext)

      const requestBody = {
        triggerAI: true,
        aiPrompt: userInput.trim(),
        systemPrompt: currentStepData.systemPrompt,
        stepNumber: currentStep,
        stepType: currentStepData.stepType,
        previousStepsContext,
      }

      console.log('Sending AI request:', requestBody)

      // Create AbortController for timeout handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout

      // Use standard Payload API for flow instances with AI processing trigger
      const response = await fetch(`/api/flow-instances/${instance.id}`, {
        method: 'PATCH',
        headers: createBusinessHeaders('salarium'),
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()
      console.log('AI response received:', data)

      if (!response.ok) {
        console.error('AI request failed:', data)
        throw new Error(data.errors?.[0]?.message || 'AI processing failed')
      }

      // Extract AI generated content from the updated instance
      const updatedInstance = data.doc || data
      setInstance(updatedInstance)

      // Find the current step response with AI content
      const stepResponses = Array.isArray(updatedInstance.stepResponses)
        ? updatedInstance.stepResponses
        : []

      const currentStepResponse = stepResponses.find((r: any) => r.stepNumber === currentStep)
      console.log('Looking for step response for step:', currentStep)
      console.log(
        'Available step responses:',
        stepResponses.map((r) => ({ stepNumber: r.stepNumber, hasAI: !!r.aiGeneratedContent })),
      )
      console.log('Found current step response:', currentStepResponse)

      if (currentStepResponse?.aiGeneratedContent) {
        setAiContent(currentStepResponse.aiGeneratedContent)
        setHasProcessed(true)
        console.log(
          '✅ AI content updated successfully:',
          currentStepResponse.aiGeneratedContent.substring(0, 100) + '...',
        )
      } else {
        console.log('❌ No AI content found in response:', {
          stepResponses,
          currentStep,
          currentStepResponse,
        })
      }

      // Note: User can manually save when ready
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

      // Update the step response - ensure stepResponses exists and is an array
      const updatedStepResponses = Array.isArray(instance.stepResponses)
        ? [...instance.stepResponses]
        : []
      const stepIndex = updatedStepResponses.findIndex((r) => r.stepNumber === currentStep)

      if (stepIndex >= 0) {
        const existingResponse = updatedStepResponses[stepIndex]
        if (existingResponse) {
          // Use AI content as the final content (user can edit it directly)
          const finalContent = generatedContent || aiContent
          updatedStepResponses[stepIndex] = {
            stepNumber: existingResponse.stepNumber,
            stepTitle: existingResponse.stepTitle,
            userInput: hasProcessed ? userInput.trim() : userInput.trim(), // Keep original input for reference
            aiGeneratedContent: finalContent,
            isCompleted: !!finalContent,
            completedAt: finalContent ? new Date().toISOString() : undefined,
          }
        }
      }

      const response = await fetch(`/api/flow-instances/${instance.id}`, {
        method: 'PATCH',
        headers: createBusinessHeaders('salarium'),
        body: JSON.stringify({
          stepResponses: updatedStepResponses,
          currentStep: currentStep,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.[0]?.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // Handle Payload's response format - the document is in data.doc
      const instanceData = data.doc || data
      setInstance(instanceData)
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

  const generateFinalDocument = async () => {
    if (!instance || !template) return

    try {
      setIsProcessing(true)

      // Generate final document using the template's outputTemplate
      let finalDoc =
        template.outputTemplate ||
        `# {{jobTitle}}

## Position Overview
{{jobMission}}

## Scope & Impact
{{jobScope}}

## Key Responsibilities
{{keyResponsibilities}}

## Qualifications
{{qualifications}}

## About {{organizationName}}
{{organizationDescription}}

---
*Generated by IntelliTrade Salarium on {{generationDate}}*`

      // Replace placeholders with actual content
      const stepResponses = Array.isArray(instance.stepResponses) ? instance.stepResponses : []
      stepResponses.forEach((response, index) => {
        const stepData = template.steps[index]
        if (stepData && response.aiGeneratedContent) {
          const placeholder = getPlaceholderForStep(stepData.title)
          finalDoc = finalDoc.replace(placeholder, response.aiGeneratedContent)
        }
      })

      // Add generation metadata
      finalDoc = finalDoc.replace('{{generationDate}}', new Date().toLocaleDateString())
      finalDoc = finalDoc.replace('{{organizationName}}', 'Your Organization')
      finalDoc = finalDoc.replace(
        '{{organizationDescription}}',
        'A forward-thinking organization committed to excellence.',
      )

      // Save the final document
      const response = await fetch(`/api/flow-instances/${instance.id}`, {
        method: 'PATCH',
        headers: createBusinessHeaders('salarium'),
        body: JSON.stringify({
          finalDocument: finalDoc,
          status: 'completed',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Handle Payload's response format - the document is in data.doc
        const instanceData = data.doc || data
        setInstance(instanceData)
      }
    } catch (error) {
      console.error('Document generation error:', error)
      setError('Failed to generate final document')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPlaceholderForStep = (stepTitle: string): string => {
    const placeholders: Record<string, string> = {
      'Job Title': '{{jobTitle}}',
      'Job Mission': '{{jobMission}}',
      'Job Scope & Reach': '{{jobScope}}',
      'Key Responsibilities': '{{keyResponsibilities}}',
      'Required Qualifications': '{{qualifications}}',
    }
    return placeholders[stepTitle] || `{{${stepTitle.toLowerCase().replace(/\s+/g, '')}}}`
  }

  const downloadAsPDF = async () => {
    if (!instance?.finalDocument) return

    try {
      const doc = new jsPDF()

      // Add Salarium branding header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('SALARIUM', 20, 30)

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('AI-Powered HR Solutions', 20, 40)

      // Add a line separator
      doc.line(20, 45, 190, 45)

      // Add document title
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(instance.title, 20, 60)

      // Process the markdown content for PDF
      const lines = instance.finalDocument.split('\n')
      let yPosition = 80
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      const lineHeight = 6

      for (const line of lines) {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 30
        }

        if (line.startsWith('# ')) {
          // Main heading
          doc.setFontSize(16)
          doc.setFont('helvetica', 'bold')
          doc.text(line.substring(2), margin, yPosition)
          yPosition += lineHeight + 4
        } else if (line.startsWith('## ')) {
          // Sub heading
          doc.setFontSize(14)
          doc.setFont('helvetica', 'bold')
          doc.text(line.substring(3), margin, yPosition)
          yPosition += lineHeight + 2
        } else if (line.startsWith('### ')) {
          // Sub-sub heading
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text(line.substring(4), margin, yPosition)
          yPosition += lineHeight + 1
        } else if (line.startsWith('• ') || line.startsWith('* ')) {
          // Bullet points
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          const bulletText = line.substring(2)
          const splitText = doc.splitTextToSize(bulletText, 160)
          doc.text('• ' + splitText[0], margin + 5, yPosition)
          for (let i = 1; i < splitText.length; i++) {
            yPosition += lineHeight
            if (yPosition > pageHeight - 30) {
              doc.addPage()
              yPosition = 30
            }
            doc.text('  ' + splitText[i], margin + 5, yPosition)
          }
          yPosition += lineHeight
        } else if (line.trim() === '') {
          // Empty line
          yPosition += lineHeight / 2
        } else if (line.startsWith('---')) {
          // Separator line
          doc.line(margin, yPosition, 190, yPosition)
          yPosition += lineHeight
        } else {
          // Regular text
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          const splitText = doc.splitTextToSize(line, 170)
          for (const textLine of splitText) {
            if (yPosition > pageHeight - 30) {
              doc.addPage()
              yPosition = 30
            }
            doc.text(textLine, margin, yPosition)
            yPosition += lineHeight
          }
        }
      }

      // Add footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(
          `Generated by Salarium AI-Powered HR Solutions - Page ${i} of ${pageCount}`,
          margin,
          pageHeight - 10,
        )
      }

      // Save the PDF
      doc.save(`${instance.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
    } catch (error) {
      console.error('PDF download error:', error)
      setError('Failed to download PDF')
    }
  }

  const downloadAsTXT = async () => {
    if (!instance?.finalDocument) return

    try {
      // Add Salarium branding to the document
      const brandedContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                            SALARIUM                                          ║
║                    AI-Powered HR Solutions                                   ║
║                                                                              ║
║    Professional Job Description Generated with AI Assistance                ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

${instance.finalDocument}

────────────────────────────────────────────────────────────────────────────────

Generated by Salarium AI-Powered HR Solutions
Visit us at: https://salarium.com
Contact: info@salarium.com

This document was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
`

      const blob = new Blob([brandedContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${instance.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('TXT download error:', error)
      setError('Failed to download TXT file')
    }
  }

  const downloadAsWord = async () => {
    if (!instance?.finalDocument) return

    try {
      // Convert markdown to a simple HTML format for Word
      const htmlContent = instance.finalDocument
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^\* (.+)$/gm, '<li>$1</li>')
        .replace(/^• (.+)$/gm, '<li>$1</li>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')

      const wordContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>${instance.title}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
              h1 { color: #333; border-bottom: 2px solid #333; }
              h2 { color: #555; margin-top: 30px; }
              h3 { color: #777; }
              li { margin: 5px 0; }
              ul { padding-left: 20px; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `

      const blob = new Blob([wordContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${instance.title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Word download error:', error)
      setError('Failed to download Word document')
    }
  }

  const copyToClipboard = async () => {
    if (!editableFinalDocument && !instance?.finalDocument) return

    try {
      const textToCopy = editableFinalDocument || instance?.finalDocument || ''
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      setError('Failed to copy to clipboard')
    }
  }

  const shareOnSocial = (platform: 'linkedin' | 'twitter' | 'facebook') => {
    if (!instance?.title) return

    const jobTitle = instance.title.replace('Job Description - ', '')
    const shareText = `Check out this job opportunity: ${jobTitle} - Created with Salarium AI-Powered HR Solutions`
    const shareUrl = window.location.href

    const urls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  const printDocument = () => {
    if (!editableFinalDocument && !instance?.finalDocument) return

    const printContent = editableFinalDocument || instance?.finalDocument || ''

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // Convert markdown to HTML for better printing
    const htmlContent = printContent
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${instance?.title || 'Job Description'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 40px;
              color: #333;
            }
            h1 {
              color: #333;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            h2 {
              color: #555;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            h3 {
              color: #777;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            li {
              margin: 5px 0;
            }
            ul {
              padding-left: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #6366f1;
              border: none;
              margin: 0;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            @media print {
              body { margin: 20px; }
              .header { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SALARIUM</h1>
            <p>AI-Powered HR Solutions</p>
            <p>Professional Job Description</p>
          </div>
          ${htmlContent}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            Generated by Salarium AI-Powered HR Solutions on ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const saveFinalDocument = async () => {
    if (!instance || !editableFinalDocument) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/flow-instances/${instance.id}`, {
        method: 'PATCH',
        headers: createBusinessHeaders('salarium'),
        body: JSON.stringify({
          finalDocument: editableFinalDocument,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Handle Payload's response format - the document is in data.doc
        const instanceData = data.doc || data
        setInstance(instanceData)
      }
    } catch (error) {
      console.error('Save final document error:', error)
      setError('Failed to save document changes')
    } finally {
      setIsSaving(false)
    }
  }

  // Update editable document when final document changes
  React.useEffect(() => {
    if (instance?.finalDocument && !editableFinalDocument) {
      setEditableFinalDocument(instance.finalDocument)
    }
  }, [instance?.finalDocument, editableFinalDocument])

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

  if (!template || !instance) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 dark:text-gray-300">Workflow not available</p>
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
        {template.metadata && (
          <div className="flex justify-center space-x-4 text-sm">
            {template.metadata.difficulty && (
              <Badge variant="outline">
                Difficulty:{' '}
                {template.metadata.difficulty.charAt(0).toUpperCase() +
                  template.metadata.difficulty.slice(1)}
              </Badge>
            )}
            {template.metadata.estimatedTime && (
              <Badge variant="outline">
                Estimated Time: {template.metadata.estimatedTime} minutes
              </Badge>
            )}
          </div>
        )}
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

            {/* Hardcoded Final Step */}
            <button
              onClick={() => setCurrentStep(totalSteps)}
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

      {/* Accordion Steps (1-5) and Final Step */}
      {isFinalStep ? (
        /* Final Step - Review & Finalize (Not in accordion, always expanded) */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span>Review & Finalize</span>
            </CardTitle>
            <CardDescription>
              Your job description is complete! Review, edit if needed, and share or download.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {instance.finalDocument ? (
              <>
                {/* Editable Final Document */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="final-document" className="text-base font-medium">
                      Final Job Description (Editable)
                    </Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="flex items-center space-x-1"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveFinalDocument}
                        disabled={isSaving || !editableFinalDocument}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    id="final-document"
                    value={editableFinalDocument}
                    onChange={(e) => setEditableFinalDocument(e.target.value)}
                    placeholder="Your job description will appear here..."
                    rows={20}
                    className="resize-none bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900 border-gray-300 dark:border-gray-400 font-mono text-sm leading-relaxed"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                    💡 You can edit this job description directly. Click &ldquo;Save Changes&rdquo;
                    to update.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Download Options */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Download Options
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={downloadAsPDF}
                          className="flex-1 min-w-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          onClick={downloadAsWord}
                          className="flex-1 min-w-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Word
                        </Button>
                        <Button
                          variant="outline"
                          onClick={downloadAsTXT}
                          className="flex-1 min-w-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          TXT
                        </Button>
                        <Button
                          variant="outline"
                          onClick={printDocument}
                          className="flex-1 min-w-0"
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>

                    {/* Share Options */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Share Job Posting
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => shareOnSocial('linkedin')}
                          className="flex-1 min-w-0 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => shareOnSocial('twitter')}
                          className="flex-1 min-w-0 bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => shareOnSocial('facebook')}
                          className="flex-1 min-w-0 bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Facebook
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <h5 className="font-medium text-green-800 dark:text-green-200">
                        Job Description Complete!
                      </h5>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your professional job description has been generated successfully. You can
                        now download it, share it, or make final edits before posting.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Complete all previous steps to generate your job description.
                </p>
                <Button onClick={() => setCurrentStep(1)} variant="outline">
                  Go to Step 1
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Steps 1-5 in Accordion */
        <Accordion>
          {template.steps.map((step) => {
            const stepResponse = instance.stepResponses?.find(
              (r) => r.stepNumber === step.stepNumber,
            )
            const isCompleted = stepResponse?.isCompleted || false
            const isCurrent = step.stepNumber === currentStep
            const isOpen = openAccordions[step.stepNumber] || isCurrent

            return (
              <AccordionItem key={step.stepNumber} value={step.stepNumber.toString()}>
                <AccordionTrigger
                  isOpen={isOpen}
                  onClick={() => {
                    toggleAccordion(step.stepNumber)
                    if (!isCurrent) {
                      navigateToStep(step.stepNumber)
                    }
                  }}
                  className={`text-left hover:no-underline ${
                    isCurrent
                      ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800'
                      : isCompleted
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : isCurrent ? (
                      <Clock className="w-5 h-5 text-violet-600" />
                    ) : (
                      <span className="w-5 h-5 rounded-full border-2 border-gray-400" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent isOpen={isOpen}>
                  {step.stepNumber === currentStep && (
                    <div className="space-y-4">
                      {/* Question */}
                      <div>
                        <Label htmlFor="content-input" className="text-base font-medium">
                          {step.questionText}
                        </Label>
                        {step.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </div>

                      {/* Context Indicator */}
                      {step.stepNumber === currentStep && (
                        <ContextIndicator
                          previousContext={buildPreviousStepsContext(instance, currentStep)}
                        />
                      )}

                      {!hasProcessed ? (
                        <>
                          {/* Initial User Input - Before AI Processing */}
                          <div>
                            {step.stepType === 'textarea' ? (
                              <Textarea
                                id="user-input"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Enter your response..."
                                rows={4}
                                className="resize-none bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900 border-gray-300 dark:border-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:border-violet-500 dark:focus:border-violet-500"
                              />
                            ) : (
                              <Input
                                id="user-input"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Enter your response..."
                                className="bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900 border-gray-300 dark:border-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:border-violet-500 dark:focus:border-violet-500"
                              />
                            )}

                            {step.validationRules?.minLength && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                Minimum {step.validationRules.minLength} characters
                              </p>
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
                            <Label
                              htmlFor="ai-content"
                              className="text-sm font-medium text-gray-900 dark:text-white mb-2 block"
                            >
                              AI Generated Content (Editable):
                            </Label>
                            <Textarea
                              id="ai-content"
                              value={aiContent}
                              onChange={(e) => setAiContent(e.target.value)}
                              placeholder="AI generated content will appear here..."
                              rows={6}
                              className="resize-none bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900 border-gray-300 dark:border-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:border-violet-500 dark:focus:border-violet-500"
                            />
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                              💡 You can edit this content directly. Changes will be saved
                              automatically.
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

                      {/* Examples - Show in both states */}
                      {step.examples && step.examples.length > 0 && (
                        <div className="border-t pt-4">
                          <Label className="text-sm font-medium text-gray-900 dark:text-white">
                            Examples:
                          </Label>
                          <div className="mt-2 space-y-2">
                            {step.examples.map((example, index) => (
                              <div
                                key={index}
                                className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-transparent hover:border-violet-300 dark:hover:border-violet-500"
                                onClick={() => {
                                  setUserInput(example.userInput)
                                  // If we're in processed state, also clear the AI content to allow regeneration
                                  if (hasProcessed) {
                                    setAiContent('')
                                    setHasProcessed(false)
                                  }
                                }}
                                title="Click to use this example"
                              >
                                <div className="font-medium text-gray-900 dark:text-white">
                                  Input: {example.userInput}
                                </div>
                                <div className="text-gray-800 dark:text-gray-100">
                                  Output: {example.expectedOutput}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                            💡 Click any example to auto-fill the input field
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}

      {/* Navigation */}
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
          {!isFinalStep && (
            <>
              <Button variant="outline" onClick={() => saveCurrentStep()} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowContextPreview(true)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Context
              </Button>
            </>
          )}

          {isFinalStep /* Final step - no next button needed */ ? null : isLastDatabaseStep ? (
            <Button
              onClick={async () => {
                await generateFinalDocument()
                setCurrentStep(totalSteps) // Navigate to final step after generating
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

      {/* Context Preview Modal */}
      {showContextPreview && (
        <ContextPreviewModal
          currentStep={currentStep}
          instance={instance}
          template={template}
          userInput={userInput}
          onClose={() => setShowContextPreview(false)}
        />
      )}
    </div>
  )
}

// Context Preview Modal Component
interface ContextPreviewModalProps {
  currentStep: number
  instance: FlowInstance | null
  template: FlowTemplate | null
  userInput: string
  onClose: () => void
}

const ContextPreviewModal: React.FC<ContextPreviewModalProps> = ({
  currentStep,
  instance,
  template,
  userInput,
  onClose,
}) => {
  if (!instance || !template) return null

  const currentStepData = template.steps.find((s) => s.stepNumber === currentStep)
  const previousContext = buildPreviousStepsContext(instance, currentStep)

  // Build the exact prompt that would be sent to AI
  const buildFullPrompt = () => {
    if (!currentStepData) return ''

    const contextMap: Record<number, string> = {
      1: 'You are helping create a professional job title. Make it clear, concise, and industry-standard.',
      2: 'You are creating a compelling job mission statement. Focus on purpose, value, and organizational alignment.',
      3: 'You are defining job scope and organizational impact. Be specific about team size, responsibilities, and reach.',
      4: 'You are listing key responsibilities. Create 5-8 clear, action-oriented bullet points using strong action verbs.',
      5: 'You are organizing qualifications into clear categories: Education, Experience, Technical Skills, and Certifications.',
    }

    const formatInstructions: Record<number, string> = {
      1: 'Return only the refined job title, nothing else.',
      2: 'Return a 2-3 sentence mission statement that is compelling and professional.',
      3: 'Format as bullet points covering: Team Leadership, Budget/Resources, Geographic Scope, Internal Stakeholders, Decision-making Authority.',
      4: 'Format as bullet points (•) with each responsibility starting with a strong action verb.',
      5: 'Format with clear section headers: **Required Qualifications:** and **Preferred Qualifications:** with bullet points under each.',
    }

    // Build context section
    let contextSection = ''
    if (previousContext.length > 0) {
      const relevantContext = previousContext.filter((ctx) => ctx.relevanceWeight > 0.3)
      if (relevantContext.length > 0) {
        const contextLines = relevantContext
          .map((ctx) => `${ctx.stepTitle}: ${ctx.content}`)
          .join('\n')

        contextSection = `
CONTEXT FROM PREVIOUS STEPS:
${contextLines}

Please use this context to ensure your response is consistent and builds upon the information already provided.
`
      }
    }

    return `${contextMap[currentStep] || currentStepData.systemPrompt}

${contextSection}

${formatInstructions[currentStep] || ''}

User Input: "${userInput}"

Instructions: ${currentStepData.systemPrompt}

IMPORTANT: Use the context from previous steps to create a cohesive response that aligns with the overall job description being created. Reference specific details from previous steps when relevant.

Response:`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Context Preview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              This is exactly what the AI receives as context for Step {currentStep}:{' '}
              {currentStepData?.title}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Previous Steps Context */}
          {previousContext.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Previous Steps Context ({previousContext.length} steps)
              </h3>
              <div className="space-y-3">
                {previousContext.map((ctx) => (
                  <div
                    key={ctx.stepNumber}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        {ctx.stepTitle}
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        Relevance: {Math.round(ctx.relevanceWeight * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                      {ctx.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current User Input */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Current User Input
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {userInput || '(No input yet)'}
              </p>
            </div>
          </div>

          {/* Full AI Prompt */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Complete AI Prompt
            </h3>
            <div className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">{buildFullPrompt()}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle, Download, Share2, Copy, Printer } from 'lucide-react'

import type { FlowInstance, FlowTemplate, StepResponse } from '../types/workflow.types'
import { getBusinessContext } from '../utils/contextUtils'
import {
  fetchFlowTemplates,
  fetchFlowInstance,
  updateFlowInstance,
  processAIStep,
  generateFinalDocument,
  formatErrorMessage,
  shouldRetry,
  retryWithExponentialBackoff,
  type APIResponse,
} from '../utils/apiUtils'
import {
  downloadAsPDF,
  downloadAsTXT,
  downloadAsWord,
  printDocument,
  copyToClipboard,
  shareOnSocial,
} from '../utils/documentUtils'

interface WorkflowMainProps {
  instanceId?: string
  templateId?: number
  onInstanceCreated?: (instance: FlowInstance) => void
  onInstanceUpdated?: (instance: FlowInstance) => void
  onError?: (error: string) => void
}

export const WorkflowMain: React.FC<WorkflowMainProps> = ({
  instanceId,
  templateId,
  onInstanceCreated,
  onInstanceUpdated,
  onError,
}) => {
  // State management
  const [instance, setInstance] = useState<FlowInstance | null>(null)
  const [template, setTemplate] = useState<FlowTemplate | null>(null)
  const [templates, setTemplates] = useState<FlowTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState<number | null>(null)
  const [editableFinalDocument, setEditableFinalDocument] = useState<string>('')

  // Business context
  const businessContext = getBusinessContext()

  // Error handling
  const handleError = useCallback(
    (err: unknown) => {
      const message = formatErrorMessage(err)
      setError(message)
      onError?.(message)
    },
    [onError],
  )

  // Load templates
  const loadTemplates = useCallback(async () => {
    try {
      const response = await fetchFlowTemplates()
      if (response.success && response.data) {
        setTemplates(response.data)
      } else {
        throw new Error(response.error || 'Failed to load templates')
      }
    } catch (err) {
      handleError(err)
    }
  }, [handleError])

  // Load instance
  const loadInstance = useCallback(
    async (id: string) => {
      if (!id) return

      setLoading(true)
      try {
        const response = await fetchFlowInstance(id)
        if (response.success && response.data) {
          setInstance(response.data)
          setEditableFinalDocument(response.data.finalDocument || '')
          onInstanceUpdated?.(response.data)
        } else {
          throw new Error(response.error || 'Failed to load instance')
        }
      } catch (err) {
        handleError(err)
      } finally {
        setLoading(false)
      }
    },
    [handleError, onInstanceUpdated],
  )

  // Initialize
  useEffect(() => {
    loadTemplates()
    if (instanceId) {
      loadInstance(instanceId)
    }
  }, [instanceId, loadTemplates, loadInstance])

  // Set template when templateId changes
  useEffect(() => {
    if (templateId && templates.length > 0) {
      const foundTemplate = templates.find((t) => t.id === String(templateId))
      if (foundTemplate) {
        setTemplate(foundTemplate)
      }
    }
  }, [templateId, templates])

  // Process AI step
  const handleProcessAIStep = async (
    stepNumber: number,
    userInput: string,
    systemPrompt: string,
  ) => {
    if (!instance || !template) return

    setProcessingStep(stepNumber)
    setError(null)

    try {
      const stepData = template.steps[stepNumber - 1]
      if (!stepData) {
        throw new Error(`Step ${stepNumber} not found in template`)
      }

      const operation = () =>
        processAIStep(
          instance.id,
          {
            triggerAI: true,
            aiPrompt: userInput,
            systemPrompt,
            stepNumber,
            stepType: stepData.stepType || 'text',
          },
          instance.stepResponses,
        )

      const response = shouldRetry(error)
        ? await retryWithExponentialBackoff(operation)
        : await operation()

      if (response.success && response.data) {
        setInstance(response.data)
        onInstanceUpdated?.(response.data)
      } else {
        throw new Error(response.error || 'AI processing failed')
      }
    } catch (err) {
      handleError(err)
    } finally {
      setProcessingStep(null)
    }
  }

  // Update step response
  const handleUpdateStepResponse = async (stepNumber: number, updates: Partial<StepResponse>) => {
    if (!instance) return

    try {
      const stepResponses = Array.isArray(instance.stepResponses) ? [...instance.stepResponses] : []
      const existingIndex = stepResponses.findIndex((r) => r.stepNumber === stepNumber)

      if (existingIndex >= 0 && stepResponses[existingIndex]) {
        const existing = stepResponses[existingIndex]
        stepResponses[existingIndex] = {
          stepNumber: existing.stepNumber,
          stepTitle: existing.stepTitle,
          userInput: existing.userInput,
          aiGeneratedContent: existing.aiGeneratedContent,
          isCompleted: existing.isCompleted,
          completedAt: existing.completedAt,
          ...updates,
        }
      } else {
        const newStepResponse: StepResponse = {
          stepNumber,
          stepTitle: updates.stepTitle || `Step ${stepNumber}`,
          userInput: updates.userInput || '',
          aiGeneratedContent: updates.aiGeneratedContent || '',
          isCompleted: updates.isCompleted || false,
          completedAt: updates.completedAt,
        }
        stepResponses.push(newStepResponse)
      }

      const response = await updateFlowInstance(instance.id, {
        stepResponses,
        currentStep: stepNumber,
      })

      if (response.success && response.data) {
        setInstance(response.data)
        onInstanceUpdated?.(response.data)
      } else {
        throw new Error(response.error || 'Failed to update step')
      }
    } catch (err) {
      handleError(err)
    }
  }

  // Generate final document
  const handleGenerateFinalDocument = async () => {
    if (!instance) return

    setLoading(true)
    try {
      const response = await generateFinalDocument(instance.id)
      if (response.success && response.data) {
        setInstance(response.data)
        setEditableFinalDocument(response.data.finalDocument || '')
        onInstanceUpdated?.(response.data)
      } else {
        throw new Error(response.error || 'Failed to generate final document')
      }
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  // Document actions
  const handleDownloadPDF = async () => {
    if (!instance) return
    try {
      await downloadAsPDF(instance)
    } catch (err) {
      handleError(err)
    }
  }

  const handleDownloadTXT = async () => {
    if (!instance) return
    try {
      await downloadAsTXT(instance)
    } catch (err) {
      handleError(err)
    }
  }

  const handleDownloadWord = async () => {
    if (!instance) return
    try {
      await downloadAsWord(instance)
    } catch (err) {
      handleError(err)
    }
  }

  const handlePrint = () => {
    if (!instance) return
    printDocument(instance, editableFinalDocument)
  }

  const handleCopyToClipboard = async () => {
    if (!instance?.finalDocument) return
    try {
      await copyToClipboard(editableFinalDocument || instance.finalDocument)
      // You might want to show a toast notification here
    } catch (err) {
      handleError(err)
    }
  }

  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook') => {
    if (!instance) return
    shareOnSocial(platform, instance)
  }

  // Render loading state
  if (loading && !instance) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading workflow...</span>
        </CardContent>
      </Card>
    )
  }

  // Render error state
  if (error && !instance) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center p-4 border border-red-200 bg-red-50 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
          <Button
            onClick={() => {
              setError(null)
              if (instanceId) loadInstance(instanceId)
              else loadTemplates()
            }}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Render main workflow interface
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {instance?.title || 'Job Description Workflow'}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={instance?.status === 'completed' ? 'default' : 'secondary'}>
                  {instance?.status || 'draft'}
                </Badge>
                {template && <Badge variant="outline">{template.name || 'Template'}</Badge>}
                <Badge variant="outline">
                  Step {instance?.currentStep || 1} of {template?.steps.length || 0}
                </Badge>
              </div>
            </div>
            {instance?.status === 'completed' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTXT}>
                  <Download className="h-4 w-4 mr-1" />
                  TXT
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadWord}>
                  <Download className="h-4 w-4 mr-1" />
                  Word
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center p-4 border border-red-200 bg-red-50 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Workflow Steps */}
      {template && instance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Steps Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Workflow Steps</h3>
            {template.steps.map((step, index) => {
              const stepNumber = index + 1
              const stepResponse = instance.stepResponses?.find((r) => r.stepNumber === stepNumber)
              const isCurrentStep = instance.currentStep === stepNumber
              const isCompleted = stepResponse?.isCompleted || false
              const isProcessing = processingStep === stepNumber

              return (
                <Card key={stepNumber} className={isCurrentStep ? 'ring-2 ring-primary' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {stepNumber}. {step.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                        <Badge
                          variant={
                            isCompleted ? 'default' : isCurrentStep ? 'secondary' : 'outline'
                          }
                        >
                          {isCompleted ? 'Complete' : isCurrentStep ? 'Current' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                    {/* Step content would go here - input fields, AI processing, etc. */}
                    {/* This would be implemented as separate step components */}

                    <div className="text-xs text-muted-foreground">
                      Type: {step.stepType || 'text'} | Required: {step.isRequired ? 'Yes' : 'No'}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Preview</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                {instance.finalDocument ? (
                  <div className="space-y-4">
                    <textarea
                      value={editableFinalDocument}
                      onChange={(e) => setEditableFinalDocument(e.target.value)}
                      className="w-full h-96 p-3 border rounded-md font-mono text-sm"
                      placeholder="Final document will appear here..."
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleGenerateFinalDocument} disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Complete the workflow steps to generate the final document</p>
                    <Button
                      onClick={handleGenerateFinalDocument}
                      disabled={loading || !instance.stepResponses?.some((r) => r.isCompleted)}
                      className="mt-4"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                      Generate Document
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Business Context Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded">
              {JSON.stringify({ businessContext, instanceId, templateId }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WorkflowMain

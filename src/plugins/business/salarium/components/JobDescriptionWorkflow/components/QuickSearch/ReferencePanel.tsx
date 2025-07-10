'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { X, FileText, Copy, ExternalLink } from 'lucide-react'

interface ReferencePanelProps {
  reference: any // Reference job description
  onClose: () => void
  currentStep: number
}

/**
 * Panel to display reference job description content relevant to the current step
 */
export const ReferencePanel: React.FC<ReferencePanelProps> = ({
  reference,
  onClose,
  currentStep,
}) => {
  // Find the relevant content for the current step
  const getRelevantContent = () => {
    if (!reference || !reference.stepResponses) return null

    // If we have an exact step match, show that content
    const exactMatch = reference.stepResponses.find((resp: any) => resp.stepNumber === currentStep)

    if (exactMatch && exactMatch.aiGeneratedContent) {
      return {
        title: exactMatch.stepTitle,
        content: exactMatch.aiGeneratedContent,
        match: 'exact',
      }
    }

    // Otherwise, show the most relevant step based on a simple heuristic
    // For example, if we're on step 2 (job mission), step 2 from reference is most relevant
    // If that doesn't exist, fall back to step 1
    const fallbackSteps = [currentStep, 1, 2, 3, 4, 5]

    for (const step of fallbackSteps) {
      const fallback = reference.stepResponses.find((resp: any) => resp.stepNumber === step)

      if (fallback && fallback.aiGeneratedContent) {
        return {
          title: fallback.stepTitle,
          content: fallback.aiGeneratedContent,
          match: 'related',
        }
      }
    }

    // Last resort - just use first non-empty response
    const firstValid = reference.stepResponses.find((resp: any) => resp.aiGeneratedContent?.trim())

    if (firstValid) {
      return {
        title: firstValid.stepTitle,
        content: firstValid.aiGeneratedContent,
        match: 'fallback',
      }
    }

    return null
  }

  // Get relevant content based on current step
  const relevantContent = getRelevantContent()

  // Copy content to clipboard
  const copyToClipboard = () => {
    if (relevantContent?.content) {
      navigator.clipboard
        .writeText(relevantContent.content)
        .then(() => {
          // Show temporary copy success message
          const button = document.getElementById('copy-button')
          if (button) {
            const originalText = button.innerText
            button.innerText = 'Copied!'
            setTimeout(() => {
              button.innerText = originalText
            }, 2000)
          }
        })
        .catch((err) => console.error('Failed to copy: ', err))
    }
  }

  // View original reference in new tab
  const viewOriginal = () => {
    if (reference?.id) {
      window.open(`/salarium/job-flow/${reference.id}`, '_blank')
    }
  }

  if (!reference || !relevantContent) return null

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-800">Reference: {reference.title}</h4>

          {relevantContent.match === 'exact' ? (
            <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
              Exact match
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              Related content
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-3 h-3" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="mb-2 text-xs text-blue-700 font-medium">
        Showing content from: {relevantContent.title}
      </div>

      <div className="p-3 bg-white border border-blue-100 rounded text-gray-800 whitespace-pre-wrap mb-3">
        {relevantContent.content}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-blue-600">Use this as reference for your content</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 text-xs"
            id="copy-button"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={viewOriginal} className="h-7 text-xs">
            <ExternalLink className="w-3 h-3 mr-1" />
            View Full
          </Button>
        </div>
      </div>
    </div>
  )
}

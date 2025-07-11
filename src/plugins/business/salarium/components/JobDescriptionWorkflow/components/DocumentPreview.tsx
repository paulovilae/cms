import React, { useState } from 'react'
import { FlowInstance } from '../types'
import { isDocumentComplete } from '../utils/validationHelpers'

interface DocumentPreviewProps {
  flowInstance: FlowInstance
  onExport: (format: 'pdf' | 'docx' | 'markdown') => void
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ flowInstance, onExport }) => {
  const [showExportOptions, setShowExportOptions] = useState(false)

  if (!flowInstance || !flowInstance.stepResponses) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center">No content available for preview</p>
      </div>
    )
  }

  // Get step responses in order
  const orderedSteps = [...flowInstance.stepResponses]
    .filter((step) => step.isCompleted)
    .sort((a, b) => a.stepNumber - b.stepNumber)

  // Document is considered complete when all steps are completed
  const isComplete = isDocumentComplete(flowInstance.stepResponses)

  // Format step content for display
  const formatContent = (content: string, stepNumber: number) => {
    // For job title (step 1), make it an H1
    if (stepNumber === 1) {
      return `<h1 class="text-2xl font-bold mb-4">${content}</h1>`
    }

    // For other steps, preserve formatting but replace newlines with <br>
    return content.replace(/\n/g, '<br />')
  }

  // Get appropriate heading for step
  const getStepHeading = (stepTitle: string, stepNumber: number) => {
    // Don't show heading for job title (step 1) as it's already displayed as H1
    if (stepNumber === 1) {
      return ''
    }

    // For other steps, use H2 headings
    return `<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-6">${stepTitle}</h2>`
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
        <div className="relative">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
              isComplete
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => isComplete && setShowExportOptions(!showExportOptions)}
            disabled={!isComplete}
          >
            Export Document
          </button>

          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    onExport('pdf')
                    setShowExportOptions(false)
                  }}
                >
                  Export as PDF
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    onExport('docx')
                    setShowExportOptions(false)
                  }}
                >
                  Export as DOCX
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    onExport('markdown')
                    setShowExportOptions(false)
                  }}
                >
                  Export as Markdown
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        {orderedSteps.length > 0 ? (
          <div className="prose max-w-none">
            {orderedSteps.map((step) => (
              <div key={step.stepNumber} className="mb-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                      ${getStepHeading(step.stepTitle, step.stepNumber)}
                      ${formatContent(step.aiGeneratedContent, step.stepNumber)}
                    `,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Complete at least one step to see the preview
          </p>
        )}
      </div>

      {!isComplete && orderedSteps.length > 0 && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Note:</span> Complete all sections to enable document
            export.
          </p>
        </div>
      )}
    </div>
  )
}

export default DocumentPreview

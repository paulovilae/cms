'use client'

import React from 'react'
import { AlertCircle, RefreshCw, FileText, HelpCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface ErrorDetails {
  userMessage: string
  technicalDetails?: string
  errorCode?: string
  suggestions?: Array<{
    label: string
    action: () => void
    icon?: React.ReactNode
    primary?: boolean
  }>
  retryAction?: () => void
  learnMoreUrl?: string
}

interface ErrorHandlerProps {
  error: ErrorDetails
  className?: string
}

/**
 * Enhanced error handler component with user-friendly messages
 * and recovery suggestions
 */
export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, className = '' }) => {
  // Auto-retry after 30 seconds if a retry action is provided
  React.useEffect(() => {
    if (error.retryAction) {
      const timer = setTimeout(() => {
        error.retryAction?.()
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-5 animate-fadeIn ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
            {error.userMessage}
          </h3>

          {error.errorCode && (
            <p className="text-sm text-red-700 dark:text-red-400 mb-1">
              Reference code: <span className="font-mono">{error.errorCode}</span>
            </p>
          )}

          {/* Primary suggested actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            {error.retryAction && (
              <Button
                variant="outline"
                onClick={error.retryAction}
                className="bg-white dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-800 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Try Again
              </Button>
            )}

            {error.suggestions
              ?.filter((s) => s.primary)
              .map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={suggestion.action}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  {suggestion.icon}
                  {suggestion.label}
                </Button>
              ))}

            <Button
              variant="outline"
              onClick={() => (window.location.href = '/salarium/job-flow')}
              className="bg-white dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-300"
            >
              <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
              Go to Job Flow
            </Button>
          </div>

          {/* Additional suggestions */}
          {error.suggestions?.filter((s) => !s.primary).length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                Other things you can try:
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {error.suggestions
                  ?.filter((s) => !s.primary)
                  .map((suggestion, i) => (
                    <li key={i}>
                      <button
                        onClick={suggestion.action}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline focus:outline-none focus:underline"
                      >
                        {suggestion.label}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Technical details (hidden by default) */}
          {error.technicalDetails && (
            <div className="mt-5">
              <Accordion type="single" collapsible>
                <AccordionItem
                  value="technical-details"
                  className="border-red-200 dark:border-red-800"
                >
                  <AccordionTrigger className="text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    Technical Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="text-xs font-mono bg-red-100 dark:bg-red-900/40 p-3 rounded overflow-auto max-h-40 text-red-800 dark:text-red-300">
                      {error.technicalDetails}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {/* Learn more link */}
          {error.learnMoreUrl && (
            <div className="mt-4">
              <a
                href={error.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline"
              >
                <HelpCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                Learn more about this issue
                <ChevronRight className="w-3 h-3 ml-1" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorHandler

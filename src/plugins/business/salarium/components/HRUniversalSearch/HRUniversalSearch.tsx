'use client'

import React, { useState } from 'react'
import { UniversalSearch } from '@/plugins/shared/universal-search/components/UniversalSearch'
import { jobDescriptionSearchConfig } from '../../configs/jobDescriptionSearchConfig'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Columns, ExternalLink } from 'lucide-react'

/**
 * HR-specific Universal Search component
 * This provides a dedicated search interface for HR professionals to find job descriptions
 */
export const HRUniversalSearch: React.FC = () => {
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null)

  // Handle HR-specific actions
  const handleAction = (actionId: string, result: any) => {
    switch (actionId) {
      case 'useAsReference':
        // Store selected job description and redirect to creator with reference
        localStorage.setItem('jobDescriptionReference', JSON.stringify(result))
        window.location.href = '/salarium/job-flow?reference=true'
        break

      case 'viewSideBySide':
        // Open in side-by-side comparison view
        if (result?.id) {
          setReferenceUrl(`/salarium/job-flow/compare/${result.id}`)
          window.open(`/salarium/job-flow/compare/${result.id}`, '_blank')
        }
        break

      case 'view':
        // View the full job description
        if (result?.id) {
          window.open(`/salarium/job-flow/${result.id}`, '_blank')
        }
        break

      case 'edit':
        // Open in edit mode
        if (result?.id) {
          window.location.href = `/salarium/job-flow/${result.id}/edit`
        }
        break

      default:
        console.log(`Action ${actionId} not implemented for result:`, result)
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Job Description Search
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Find existing job descriptions to use as references or templates
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1">
              <span className="text-green-600 font-medium">Universal Search</span>
            </Badge>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/salarium/job-flow')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Create New
            </Button>
          </div>
        </div>
      </div>

      {/* Tips card */}
      <Card className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200">Search Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">
                1
              </Badge>
              <p>
                Use <strong>specific skills</strong> in your search terms (e.g., "react developer",
                "project management")
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">
                2
              </Badge>
              <p>
                Include <strong>seniority levels</strong> for better matches (e.g., "senior",
                "lead", "junior")
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">
                3
              </Badge>
              <p>
                Apply <strong>filters</strong> to narrow results by department, status, or date
                created
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main universal search component */}
      <UniversalSearch
        config={jobDescriptionSearchConfig}
        onAction={handleAction}
        aiEnabled={true}
        showFilters={true}
        showStats={true}
        autoFocus={true}
        placeholder="Search job titles, skills, requirements..."
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
      />

      {/* Reference link notification */}
      {referenceUrl && (
        <div className="fixed bottom-4 right-4 max-w-md bg-green-100 border border-green-200 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Comparison view opened</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReferenceUrl(null)}
              className="h-6 w-6 p-0 rounded-full"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-green-700 mt-1">Side-by-side comparison opened in a new tab</p>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-green-700 p-0 h-auto mt-2"
            onClick={() => window.open(referenceUrl, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open again
          </Button>
        </div>
      )}
    </div>
  )
}

// X icon for close button
const X = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

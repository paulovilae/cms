'use client'

import React, { useState, useEffect } from 'react'
import { UniversalSearch } from '@/plugins/shared/universal-search/components/UniversalSearch'
import { jobDescriptionSearchConfig } from '../../configs/jobDescriptionSearchConfig'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Columns,
  ExternalLink,
  Search,
  Info,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react'

// Import all styles from the central styles index
import '@/styles/index'

/**
 * HR-specific Universal Search component
 * This provides a dedicated search interface for HR professionals to find job descriptions
 */
export const HRUniversalSearch: React.FC = () => {
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: 'success' | 'info' | 'error' }>
  >([])
  const [popularSearches] = useState<string[]>([
    'senior software engineer',
    'marketing manager',
    'project coordinator',
    'data analyst',
    'human resources specialist',
  ])

  // Check if the collection is accessible on mount
  useEffect(() => {
    const checkCollection = async () => {
      try {
        const response = await fetch('/api/flow-instances?limit=1', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-business': 'salarium',
          },
        })

        if (response.ok) {
          setIsInitialized(true)
        } else {
          console.error('Failed to access flow-instances collection:', response.status)
          setErrorState(`Collection access failed (${response.status}). Please check permissions.`)
        }
      } catch (err) {
        console.error('Error checking collection:', err)
        setErrorState('Failed to connect to server. Please try again later.')
      }
    }

    checkCollection()
  }, [])

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}`
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  // Dismiss a toast notification
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Handle HR-specific actions
  const handleAction = (actionId: string, result: any) => {
    switch (actionId) {
      case 'useAsReference':
        // Show feedback toast
        showToast('Job description selected as reference', 'success')

        // Store selected job description and redirect to creator with reference
        localStorage.setItem('jobDescriptionReference', JSON.stringify(result))
        window.location.href = '/salarium/job-flow?reference=true'
        break

      case 'viewSideBySide':
        // Show feedback toast
        showToast('Opening side-by-side comparison view', 'info')

        // Open in side-by-side comparison view
        if (result?.id) {
          setReferenceUrl(`/salarium/job-flow/compare/${result.id}`)
          window.open(`/salarium/job-flow/compare/${result.id}`, '_blank')
        }
        break

      case 'view':
        // Show feedback toast
        showToast('Opening job description', 'info')

        // View the full job description
        if (result?.id) {
          window.open(`/salarium/job-flow/${result.id}`, '_blank')
        }
        break

      case 'edit':
        // Show feedback toast
        showToast('Opening job description in edit mode', 'info')

        // Open in edit mode
        if (result?.id) {
          window.location.href = `/salarium/job-flow/${result.id}/edit`
        }
        break

      default:
        console.log(`Action ${actionId} not implemented for result:`, result)
    }
  }

  // Handle filter changes
  const handleFilterChange = (filterId: string, values: string[]) => {
    if (values.length === 0) {
      showToast(`${filterId} filter cleared`, 'info')
    } else {
      showToast(`${filterId} filter applied: ${values.join(', ')}`, 'info')
    }
  }

  // Handle clear all filters
  const handleClearAllFilters = () => {
    showToast('All filters have been cleared', 'info')
  }

  // Handle popular search term click
  const handlePopularSearchClick = (term: string) => {
    // Implementation would update the search query
    showToast(`Searching for "${term}"`, 'info')
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-high-contrast">Job Description Search</h1>
            <p className="text-readable mt-2">
              Find existing job descriptions to use as references or templates
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 transition-all duration-300">
              <span className="text-primary-600 font-medium">Universal Search</span>
            </Badge>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/salarium/job-flow')}
              className="flex items-center gap-2 transition-all duration-300 hover:bg-primary-50 hover:border-primary-200 active:bg-primary-100"
            >
              <FileText className="w-4 h-4" />
              Create New
            </Button>
          </div>
        </div>
      </div>

      {/* Tips card with improved contrast */}
      <Card className="mb-6 search-tips bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Search Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm search-tips-text text-blue-700 dark:text-blue-300">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 transition-all">
                1
              </Badge>
              <p className="text-readable">
                Use <strong>specific skills</strong> in your search terms (e.g., "react developer",
                "project management")
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 transition-all">
                2
              </Badge>
              <p className="text-readable">
                Include <strong>seniority levels</strong> for better matches (e.g., "senior",
                "lead", "junior")
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 transition-all">
                3
              </Badge>
              <p className="text-readable">
                Apply <strong>filters</strong> to narrow results by department, status, or date
                created
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditional rendering based on error state */}
      {errorState ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6 animate-fadeIn">
          <h3 className="text-lg font-medium text-red-800 mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Search System Unavailable
          </h3>
          <p className="text-red-700 mb-4">{errorState}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mr-2 transition-all duration-300 hover:bg-red-100 hover:border-red-300"
          >
            Refresh Page
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/salarium/job-flow')}
            className="transition-all duration-300 hover:bg-blue-100 hover:border-blue-300"
          >
            Go to Job Flow
          </Button>
        </div>
      ) : (
        /* Main universal search component with improved contrast styles */
        <div className="search-container">
          <UniversalSearch
            config={{
              ...jobDescriptionSearchConfig,
              // Explicitly set collection to ensure consistency
              collection: 'flow-instances',
              displayName: 'Job Descriptions',
              business: 'salarium',
            }}
            onAction={handleAction}
            onFilterChange={handleFilterChange}
            onClearAllFilters={handleClearAllFilters}
            aiEnabled={true}
            showFilters={true}
            showStats={true}
            autoFocus={true}
            placeholder="Search job titles, skills, requirements..."
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            emptyStateComponent={
              <div className="empty-state py-10 px-6 text-center animate-fadeIn">
                <div className="empty-state-icon mb-4">
                  <Search className="w-12 h-12 mx-auto text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  No Job Descriptions Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any job descriptions matching your search. Try adjusting your
                  search terms or filters.
                </p>

                <div className="suggestions mb-8">
                  <h4 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">
                    Try these popular searches:
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handlePopularSearchClick(term)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                                  rounded-full text-sm text-gray-700 dark:text-gray-300 transition-all duration-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tips text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg max-w-md mx-auto">
                  <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">
                    Search Tips:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-disc pl-5">
                    <li>Try using different keywords or abbreviations</li>
                    <li>Check for spelling mistakes</li>
                    <li>Use broader terms to widen your search</li>
                    <li>Try searching by department or job level</li>
                  </ul>
                </div>
              </div>
            }
          />
        </div>
      )}

      {/* Reference link notification */}
      {referenceUrl && (
        <div className="fixed bottom-4 right-4 max-w-md bg-green-100 border border-green-200 p-4 rounded-lg shadow-md animate-slideUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Comparison view opened</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReferenceUrl(null)}
              className="h-6 w-6 p-0 rounded-full hover:bg-green-200 transition-colors duration-300"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-green-700 mt-1">Side-by-side comparison opened in a new tab</p>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-green-700 p-0 h-auto mt-2 hover:text-green-900 transition-colors duration-300"
            onClick={() => window.open(referenceUrl, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open again
          </Button>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-notification flex items-center justify-between p-3 rounded-lg shadow-md animate-slideUp max-w-md
              ${
                toast.type === 'success'
                  ? 'bg-green-100 border border-green-200 text-green-800'
                  : toast.type === 'error'
                    ? 'bg-red-100 border border-red-200 text-red-800'
                    : 'bg-blue-100 border border-blue-200 text-blue-800'
              }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
              <span>{toast.message}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissToast(toast.id)}
              className={`h-6 w-6 p-0 rounded-full 
                ${
                  toast.type === 'success'
                    ? 'hover:bg-green-200'
                    : toast.type === 'error'
                      ? 'hover:bg-red-200'
                      : 'hover:bg-blue-200'
                } transition-colors duration-300`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add custom styles specific to this component for feedback mechanisms */}
      <style jsx global>{`
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }

        /* Animation utility classes */
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        /* Loading state styling */
        .loading-skeleton {
          background: linear-gradient(
            to right,
            var(--skeleton-from) 8%,
            var(--skeleton-to) 18%,
            var(--skeleton-from) 33%
          );
          background-size: 800px 100px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 0.25rem;
        }

        /* Improved search input */
        .universal-search .search-input-wrapper {
          transition: all 0.2s ease-in-out;
        }

        .universal-search .search-input-wrapper:focus-within {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Improved filter buttons */
        .universal-search .filter-header {
          transition: all 0.2s ease;
        }

        .universal-search .filter-header:hover {
          background-color: var(--background-hover);
        }

        .universal-search .filter-header:active {
          background-color: var(--background-active);
          transform: scale(0.98);
        }

        /* Clear filters button animation */
        .universal-search .clear-filters-button {
          transition: all 0.3s ease;
        }

        .universal-search .clear-filters-button:hover {
          background-color: var(--clear-button-hover);
          transform: translateY(-1px);
        }

        .universal-search .clear-filters-button:active {
          transform: translateY(1px);
        }

        /* Active filter highlights */
        .universal-search .option-label input:checked + .option-text {
          font-weight: 600;
          color: var(--filter-active-text);
        }

        /* Loading spinner enhancement */
        .universal-search .loading-spinner {
          box-shadow: 0 0 12px var(--spinner-glow);
          border-radius: 50%;
        }

        /* Skeleton loading state for results */
        .search-skeleton-item {
          height: 100px;
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 0.375rem;
          background-color: var(--background-secondary);
          overflow: hidden;
          position: relative;
        }

        .search-skeleton-title {
          height: 24px;
          width: 70%;
          margin-bottom: 0.75rem;
        }

        .search-skeleton-content {
          height: 16px;
          width: 100%;
          margin-bottom: 0.5rem;
        }

        .search-skeleton-content-short {
          height: 16px;
          width: 60%;
        }

        /* Additional styles specific to this component for contrast improvements */
        .universal-search .search-sidebar {
          background-color: var(--sidebar-bg);
          border: 1px solid var(--sidebar-border);
          border-radius: 0.375rem;
          transition: all 0.3s ease;
        }

        .universal-search .option-label {
          color: var(--filter-label-text) !important;
          transition: color 0.2s ease;
        }

        .universal-search .option-checkbox {
          border: 2px solid var(--checkbox-border) !important;
          background-color: var(--checkbox-bg) !important;
          transition: all 0.2s ease;
        }

        .universal-search .filter-title {
          color: var(--filter-title-text) !important;
          font-weight: 600;
        }

        .universal-search .clear-filters-button {
          color: var(--clear-button-text) !important;
          background-color: var(--clear-button-bg) !important;
          border: 1px solid var(--clear-button-border) !important;
          font-weight: 500;
        }

        .universal-search .search-input input::placeholder {
          color: var(--input-placeholder) !important;
        }

        /* Results transition animation */
        .universal-search .results-list {
          transition: opacity 0.3s ease;
        }

        .universal-search .result-item {
          transition: all 0.2s ease;
        }

        .universal-search .result-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Improved visual separation in dark mode */
        .dark .universal-search .search-sidebar,
        [data-theme='dark'] .universal-search .search-sidebar {
          background-color: var(--background-sidebar);
          border-color: var(--border-medium);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        /* Clear filter button contrast improvement */
        .dark .universal-search .clear-filters-button,
        [data-theme='dark'] .universal-search .clear-filters-button {
          background-color: var(--clear-button-bg);
          color: var(--clear-button-text);
          border-color: var(--clear-button-border);
        }

        /* Date filter options text */
        .universal-search .filter-option {
          color: var(--filter-label-text) !important;
        }

        /* Search placeholder text */
        .universal-search .search-input input::placeholder {
          color: var(--input-placeholder) !important;
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

export default HRUniversalSearch

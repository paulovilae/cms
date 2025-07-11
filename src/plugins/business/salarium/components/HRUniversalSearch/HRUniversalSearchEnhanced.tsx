'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  RefreshCw,
  HelpCircle,
  BellRing,
  Settings,
  ChevronRight,
} from 'lucide-react'

// Import enhanced components
import ErrorHandler, { ErrorDetails } from './ErrorHandler'
import { NotificationCenter, useNotifications, NotificationItem } from './NotificationCenter'
import { EnhancedToastContainer } from './EnhancedToast'
import EmptyState from './EmptyState'

// Import accessibility components
import SkipLink from './SkipLink'
import ScreenReaderAnnouncer from './ScreenReaderAnnouncer'
import KeyboardShortcuts from './KeyboardShortcuts'

/**
 * Enhanced HR-specific Universal Search component with improved
 * accessibility, error handling and notification system
 */
export const HRUniversalSearchEnhanced: React.FC = () => {
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorState, setErrorState] = useState<ErrorDetails | null>(null)
  const [popularSearches] = useState<string[]>([
    'senior software engineer',
    'marketing manager',
    'project coordinator',
    'data analyst',
    'human resources specialist',
  ])

  // Screen reader announcements
  const [announcements, setAnnouncements] = useState<string[]>([])

  // Ref for main content area
  const mainContentRef = useRef<HTMLDivElement>(null)

  // Focus management for modal dialogs and popups
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false)

  // Use the notifications hook for centralized notification management
  const {
    notifications,
    addNotification,
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification,
    addWarningNotification,
    addIssueNotification,
    dismissNotification,
    dismissAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotifications()

  // Enhanced toast management
  const [toasts, setToasts] = useState<
    Array<{
      id: string
      title: string
      message: string
      type: 'success' | 'error' | 'info' | 'warning'
      actions?: Array<{
        label: string
        onClick: () => void
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
        icon?: React.ReactNode
      }>
      technicalDetails?: string
      retryAction?: () => void
      learnMoreLink?: string
    }>
  >([])

  // Check if the collection is accessible on mount
  useEffect(() => {
    const checkCollection = async () => {
      setIsLoading(true)
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
          setErrorState(null)
          // Add welcome notification
          addInfoNotification(
            'Welcome to HR Search',
            'Use the search bar to find job descriptions that match your criteria',
            {
              actions: [
                {
                  label: 'View tutorial',
                  onClick: () => window.open('/salarium/tutorials/hr-search', '_blank'),
                  primary: true,
                },
              ],
            },
          )

          // Announce to screen readers
          announceToScreenReader('HR Search system loaded successfully')
        } else {
          console.error('Failed to access flow-instances collection:', response.status)

          // Create user-friendly error with technical details
          setErrorState({
            userMessage: "We're having trouble accessing job descriptions",
            technicalDetails: `API Error: ${response.status} ${response.statusText}\nEndpoint: /api/flow-instances`,
            errorCode: `API-${response.status}`,
            suggestions: [
              {
                label: 'Refresh the page',
                action: () => window.location.reload(),
                icon: <RefreshCw className="w-4 h-4 mr-2" />,
                primary: true,
              },
              {
                label: 'Check your network connection',
                action: () => window.open('https://downdetector.com', '_blank'),
                primary: false,
              },
              {
                label: 'Contact IT support',
                action: () => window.open('mailto:support@salarium.com', '_blank'),
                primary: false,
              },
            ],
            retryAction: () => checkCollection(),
            learnMoreUrl: '/help/troubleshooting/api-errors',
          })

          // Also add a notification about the issue
          addIssueNotification(
            'Search System Unavailable',
            `We couldn't connect to the job descriptions database (Error ${response.status})`,
            {
              persistent: true,
              actions: [
                {
                  label: 'Try again',
                  onClick: () => checkCollection(),
                  primary: true,
                },
                {
                  label: 'Report issue',
                  onClick: () => window.open('mailto:support@salarium.com', '_blank'),
                },
              ],
            },
          )

          // Announce error to screen readers
          announceToScreenReader(
            'Error loading HR Search system. Search functionality is currently unavailable.',
          )
        }
      } catch (err) {
        console.error('Error checking collection:', err)

        // Create user-friendly error with recovery options
        setErrorState({
          userMessage: 'Unable to connect to the search service',
          technicalDetails: err instanceof Error ? err.message : String(err),
          errorCode: 'CONN-ERR',
          suggestions: [
            {
              label: 'Refresh the page',
              action: () => window.location.reload(),
              icon: <RefreshCw className="w-4 h-4 mr-2" />,
              primary: true,
            },
            {
              label: 'Go to Job Flow',
              action: () => (window.location.href = '/salarium/job-flow'),
              icon: <FileText className="w-4 h-4 mr-2" />,
              primary: true,
            },
            {
              label: 'Check your internet connection',
              action: () => window.open('https://fast.com', '_blank'),
              primary: false,
            },
          ],
          retryAction: () => checkCollection(),
        })

        // Also add a notification about the connection issue
        addErrorNotification(
          'Connection Error',
          "We couldn't connect to the Salarium search service",
          {
            persistent: true,
            actions: [
              {
                label: 'Try again',
                onClick: () => checkCollection(),
                primary: true,
              },
            ],
            technicalDetails: err instanceof Error ? err.message : String(err),
          },
        )

        // Announce error to screen readers
        announceToScreenReader(
          'Error connecting to search service. Please check your network connection and try again.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    checkCollection()

    // Return cleanup function
    return () => {
      // Clean up any pending operations if component unmounts
    }
  }, [addInfoNotification, addIssueNotification, addErrorNotification])

  // Helper function to announce messages to screen readers
  const announceToScreenReader = (message: string) => {
    setAnnouncements((prev) => [...prev, message])
  }

  // Clear announcements after they're read
  const clearAnnouncements = () => {
    setAnnouncements([])
  }

  // Show enhanced toast notification
  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    options: {
      actions?: Array<{
        label: string
        onClick: () => void
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
        icon?: React.ReactNode
      }>
      technicalDetails?: string
      retryAction?: () => void
      learnMoreLink?: string
    } = {},
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        message,
        type,
        ...options,
      },
    ])

    // Auto-dismiss after 8 seconds (except errors which stay until dismissed)
    if (type !== 'error') {
      setTimeout(() => {
        dismissToast(id)
      }, 8000)
    }

    // Announce to screen readers
    announceToScreenReader(`${type}: ${title}. ${message}`)

    return id
  }

  // Dismiss a toast notification
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Handle HR-specific actions
  const handleAction = (actionId: string, result: any) => {
    switch (actionId) {
      case 'useAsReference':
        // Show feedback notification
        addSuccessNotification('Reference Selected', 'Job description selected as reference', {
          actions: [
            {
              label: 'Open creator',
              onClick: () => (window.location.href = '/salarium/job-flow?reference=true'),
              primary: true,
            },
          ],
        })

        // Store selected job description and redirect to creator with reference
        localStorage.setItem('jobDescriptionReference', JSON.stringify(result))
        window.location.href = '/salarium/job-flow?reference=true'

        // Announce to screen readers
        announceToScreenReader('Job description selected as reference. Redirecting to creator.')
        break

      case 'viewSideBySide':
        // Show feedback toast
        showToast('Comparison View', 'Opening side-by-side comparison view in a new tab', 'info', {
          actions: [
            {
              label: 'Open again',
              onClick: () => window.open(`/salarium/job-flow/compare/${result.id}`, '_blank'),
              variant: 'link',
              icon: <ExternalLink className="w-3 h-3 mr-1" />,
            },
          ],
        })

        // Open in side-by-side comparison view
        if (result?.id) {
          setReferenceUrl(`/salarium/job-flow/compare/${result.id}`)
          window.open(`/salarium/job-flow/compare/${result.id}`, '_blank')
        }

        // Announce to screen readers
        announceToScreenReader('Opening side-by-side comparison view in a new tab.')
        break

      case 'view':
        // Show feedback notification
        showToast('Opening Job Description', 'Viewing job description details', 'info')

        // View the full job description
        if (result?.id) {
          window.open(`/salarium/job-flow/${result.id}`, '_blank')
        }

        // Announce to screen readers
        announceToScreenReader('Opening job description in a new tab.')
        break

      case 'edit':
        // Show feedback notification
        showToast('Edit Mode', 'Opening job description in edit mode', 'info')

        // Open in edit mode
        if (result?.id) {
          window.location.href = `/salarium/job-flow/${result.id}/edit`
        }

        // Announce to screen readers
        announceToScreenReader('Opening job description in edit mode. Redirecting.')
        break

      default:
        console.log(`Action ${actionId} not implemented for result:`, result)
        showToast('Unknown Action', `The action "${actionId}" is not implemented yet`, 'warning')

        // Announce to screen readers
        announceToScreenReader(
          `Unknown action ${actionId}. This functionality is not implemented yet.`,
        )
    }
  }

  // Handle filter changes
  const handleFilterChange = (filterId: string, values: string[]) => {
    if (values.length === 0) {
      showToast('Filter Cleared', `The ${filterId} filter has been cleared`, 'info')

      // Announce to screen readers
      announceToScreenReader(`${filterId} filter cleared.`)
    } else {
      showToast('Filter Applied', `${filterId} filter: ${values.join(', ')}`, 'info')

      // Announce to screen readers
      announceToScreenReader(`${filterId} filter applied: ${values.join(', ')}`)
    }
  }

  // Handle clear all filters
  const handleClearAllFilters = () => {
    showToast('Filters Cleared', 'All filters have been cleared', 'info')

    // Announce to screen readers
    announceToScreenReader('All filters cleared.')
  }

  // Handle popular search term click
  const handlePopularSearchClick = (term: string) => {
    // Implementation would update the search query
    showToast('Searching', `Searching for "${term}"`, 'info')

    // Announce to screen readers
    announceToScreenReader(`Searching for ${term}`)
  }

  // Handle search errors
  const handleSearchError = (error: any) => {
    console.error('Search error:', error)

    showToast('Search Error', 'An error occurred while searching. Please try again.', 'error', {
      technicalDetails: error instanceof Error ? error.message : String(error),
      retryAction: () => window.location.reload(),
    })

    // Also add to notification center for persistent reference
    addErrorNotification(
      'Search System Error',
      'There was a problem with the search system. Our team has been notified.',
      {
        technicalDetails: error instanceof Error ? error.message : String(error),
        actions: [
          {
            label: 'Refresh page',
            onClick: () => window.location.reload(),
            primary: true,
          },
        ],
      },
    )

    // Announce to screen readers
    announceToScreenReader('Search error occurred. Please try refreshing the page.')
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      {/* Skip link for keyboard navigation */}
      <SkipLink />

      {/* Screen reader announcer */}
      <ScreenReaderAnnouncer
        announcements={announcements}
        clearAfter={7000}
        onClear={clearAnnouncements}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-high-contrast">Job Description Search</h1>
            <p className="text-readable mt-2 text-base">
              Find existing job descriptions to use as references or templates
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Keyboard shortcuts component */}
            <KeyboardShortcuts />

            {/* Notification center */}
            <NotificationCenter
              notifications={notifications}
              onDismiss={dismissNotification}
              onDismissAll={dismissAllNotifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
              maxVisibleNotifications={5}
              aria-label="Notifications"
            />

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="px-3 py-1 transition-all duration-300 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                Universal Search
              </Badge>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/salarium/job-flow')}
                className="flex items-center gap-2 transition-all duration-300 hover:bg-primary-50 hover:border-primary-200 active:bg-primary-100"
                aria-label="Create new job description"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                Create New
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips card with improved contrast and accessibility */}
      <Card className="mb-6 search-tips bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center">
            <Info className="w-4 h-4 mr-2" aria-hidden="true" />
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

      {/* Loading state with proper ARIA attributes */}
      {isLoading && (
        <div
          className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] border border-gray-200 dark:border-gray-700 animate-pulse"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400 animate-spin mb-4"
            role="progressbar"
            aria-label="Loading search system"
          ></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-center text-base">
            Loading search system...
          </p>
        </div>
      )}

      {/* Error state with accessible error handling */}
      {errorState && !isLoading && (
        <ErrorHandler error={errorState} className="mt-6 animate-fadeIn" aria-live="assertive" />
      )}

      {/* Main universal search component with improved accessibility */}
      {!errorState && !isLoading && (
        <div ref={mainContentRef} id="main-content" className="search-container" tabIndex={-1}>
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
            onError={handleSearchError}
            aiEnabled={true}
            showFilters={true}
            showStats={true}
            autoFocus={true}
            placeholder="Search job titles, skills, requirements..."
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            emptyStateComponent={
              <EmptyState
                onSampleSearchClick={handlePopularSearchClick}
                sampleSearches={popularSearches}
              />
            }
          />
        </div>
      )}

      {/* Enhanced toast notifications with ARIA support */}
      <EnhancedToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        position="bottom-left"
        maxToasts={3}
        aria-live="polite"
      />

      {/* Animation and styling */}
      <style jsx global>{`
        /* Base typography improvements for accessibility */
        body {
          font-size: 16px;
          line-height: 1.5;
        }

        /* Ensure minimum touch target size for interactive elements */
        button,
        a,
        input,
        select,
        textarea,
        [role='button'],
        [role='link'] {
          min-height: 44px;
          min-width: 44px;
        }

        /* Ensure proper spacing for inline elements */
        button:not(.icon-only),
        a:not(.icon-only) {
          padding: 0.5rem 1rem;
        }

        /* Improve focus indicators for keyboard navigation */
        :focus-visible {
          outline: 3px solid #0070f3 !important;
          outline-offset: 2px !important;
          border-radius: 0.25rem;
        }

        /* Support high contrast mode */
        @media (forced-colors: active) {
          :focus-visible {
            outline: 3px solid CanvasText !important;
          }

          .button,
          button,
          [role='button'] {
            border: 1px solid CanvasText !important;
          }
        }

        /* Improve form element accessibility */
        input,
        select,
        textarea {
          font-size: 1rem;
        }

        /* Hide elements visually but keep them accessible to screen readers */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Improved color contrast for text */
        .text-high-contrast {
          color: #1a202c;
        }

        .dark .text-high-contrast {
          color: #f7fafc;
        }

        .text-readable {
          color: #4a5568;
          font-size: 1rem;
        }

        .dark .text-readable {
          color: #cbd5e0;
        }

        /* Animation and transitions with reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          ::before,
          ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
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

        /* Animation utility classes */
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
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
      `}</style>
    </div>
  )
}

export default HRUniversalSearchEnhanced

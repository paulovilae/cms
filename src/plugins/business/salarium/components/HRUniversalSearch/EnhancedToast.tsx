'use client'

import React, { useEffect, useState } from 'react'
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  icon?: React.ReactNode
}

export interface ToastProps {
  id: string
  title: string
  message: string
  type?: ToastType
  duration?: number
  onDismiss: (id: string) => void
  actions?: ToastAction[]
  technicalDetails?: string
  retryAction?: () => void
  learnMoreLink?: string
  progressBar?: boolean
  showIcon?: boolean
}

/**
 * Enhanced toast notification component with improved accessibility,
 * better visual design, and more interactive features
 */
export const EnhancedToast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onDismiss,
  actions,
  technicalDetails,
  retryAction,
  learnMoreLink,
  progressBar = true,
  showIcon = true,
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const [progress, setProgress] = useState(100)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration <= 0 || isPaused) return

    const startTime = Date.now()
    const endTime = startTime + duration

    const updateProgress = () => {
      const now = Date.now()
      const remaining = endTime - now
      const calculatedProgress = (remaining / duration) * 100

      if (calculatedProgress <= 0) {
        onDismiss(id)
      } else {
        setProgress(calculatedProgress)
        requestAnimationFrame(updateProgress)
      }
    }

    const animationId = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [id, duration, onDismiss, isPaused])

  // Get toast styles based on type
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
      case 'error':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    }
  }

  // Get progress bar styles based on type
  const getProgressStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 dark:bg-green-400'
      case 'error':
        return 'bg-red-500 dark:bg-red-400'
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-400'
      case 'info':
      default:
        return 'bg-blue-500 dark:bg-blue-400'
    }
  }

  // Get icon based on toast type
  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return (
          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" aria-hidden="true" />
        )
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" aria-hidden="true" />
      case 'warning':
        return (
          <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
        )
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
    }
  }

  // Get button styles based on type
  const getButtonStyles = (variant: string = 'default') => {
    if (variant !== 'default') return ''

    switch (type) {
      case 'success':
        return 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-800 dark:text-green-300'
      case 'error':
        return 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-800 dark:text-red-300'
      case 'warning':
        return 'bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/50 dark:hover:bg-amber-800 dark:text-amber-300'
      case 'info':
      default:
        return 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-800 dark:text-blue-300'
    }
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`enhanced-toast relative overflow-hidden rounded-lg border p-4 shadow-md animate-slideInRight w-full max-w-md ${getToastStyles()}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Progress bar */}
      {progressBar && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full ${getProgressStyles()}`}
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        {showIcon && <div className="flex-shrink-0 pt-0.5">{getToastIcon()}</div>}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium">{title}</h3>

            <button
              type="button"
              aria-label="Close notification"
              onClick={() => onDismiss(id)}
              className="ml-2 flex-shrink-0 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-1 text-sm">{message}</div>

          {/* Actions */}
          {((actions && actions.length > 0) || retryAction || learnMoreLink) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {retryAction && (
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-7 px-2 py-0 text-xs ${getButtonStyles('outline')}`}
                  onClick={retryAction}
                >
                  <RefreshCw className="mr-1 h-3 w-3" aria-hidden="true" />
                  Retry
                </Button>
              )}

              {actions?.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'default'}
                  className={`h-7 px-2 py-0 text-xs ${action.variant === 'default' ? getButtonStyles('default') : ''}`}
                  onClick={() => {
                    action.onClick()
                    if (action.variant !== 'link') {
                      onDismiss(id)
                    }
                  }}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}

              {learnMoreLink && (
                <Button
                  size="sm"
                  variant="link"
                  className="h-7 px-2 py-0 text-xs"
                  onClick={() => window.open(learnMoreLink, '_blank')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" aria-hidden="true" />
                  Learn more
                </Button>
              )}
            </div>
          )}

          {/* Technical details collapsible */}
          {technicalDetails && (
            <div className="mt-2">
              <button
                type="button"
                className="flex items-center text-xs hover:underline focus:outline-none focus:underline"
                onClick={() => setShowDetails(!showDetails)}
                aria-expanded={showDetails}
              >
                <HelpCircle className="mr-1 h-3 w-3" aria-hidden="true" />
                {showDetails ? 'Hide technical details' : 'Show technical details'}
              </button>

              {showDetails && (
                <div className="mt-2 rounded bg-black/5 dark:bg-white/5 p-2 text-xs font-mono overflow-auto max-h-32">
                  {technicalDetails}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onDismiss'>>
  onDismiss: (id: string) => void
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
  maxToasts?: number
  className?: string
}

/**
 * Container component for displaying multiple enhanced toast notifications
 * with configurable positioning and maximum visible toasts
 */
export const EnhancedToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  position = 'bottom-left',
  maxToasts = 3,
  className = '',
}) => {
  const [visibleToasts, setVisibleToasts] = useState<Array<Omit<ToastProps, 'onDismiss'>>>([])

  // Update visible toasts when toasts change
  useEffect(() => {
    if (toasts.length <= maxToasts) {
      setVisibleToasts(toasts)
    } else {
      // Show newest toasts based on maxToasts
      setVisibleToasts(toasts.slice(0, maxToasts))
    }
  }, [toasts, maxToasts])

  // Skip rendering if no toasts
  if (visibleToasts.length === 0) return null

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4 items-end'
      case 'top-left':
        return 'top-4 left-4 items-start'
      case 'bottom-right':
        return 'bottom-4 right-4 items-end'
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2 items-center'
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2 items-center'
      case 'bottom-left':
      default:
        return 'bottom-4 left-4 items-start'
    }
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`enhanced-toast-container fixed z-50 flex flex-col gap-2 ${getPositionClasses()} ${className}`}
    >
      {visibleToasts.map((toast) => (
        <EnhancedToast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}

      {toasts.length > maxToasts && (
        <div
          className={`rounded-lg bg-gray-800 text-white px-3 py-1 text-xs shadow-md animate-fadeIn ${position.includes('right') ? 'self-end' : ''}`}
          title={`${toasts.length - maxToasts} more notifications are hidden`}
        >
          +{toasts.length - maxToasts} more notifications
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .animate-slideInUp {
          animation: slideInUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .animate-slideInDown {
          animation: slideInDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease both;
        }
      `}</style>
    </div>
  )
}

export default EnhancedToastContainer

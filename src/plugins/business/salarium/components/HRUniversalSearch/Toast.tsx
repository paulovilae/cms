'use client'

import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export interface ToastProps {
  id: string
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onDismiss: (id: string) => void
}

/**
 * Toast notification component for providing feedback
 * Supports success, error, and info message types
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  onDismiss,
}) => {
  // Auto-dismiss after specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id)
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  // Get toast styles based on type
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-100 border-red-200 text-red-800'
      case 'info':
      default:
        return 'bg-blue-100 border-blue-200 text-blue-800'
    }
  }

  // Get icon based on toast type
  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      case 'info':
      default:
        return <Info className="w-5 h-5" />
    }
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`toast-notification flex items-center justify-between p-3 rounded-lg shadow-md animate-slideUp ${getToastStyles()}`}
    >
      <div className="flex items-center gap-2">
        {getToastIcon()}
        <span>{message}</span>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className={`h-6 w-6 p-0 rounded-full flex items-center justify-center 
          ${
            type === 'success'
              ? 'hover:bg-green-200'
              : type === 'error'
                ? 'hover:bg-red-200'
                : 'hover:bg-blue-200'
          } transition-colors duration-300`}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>

      <style jsx>{`
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

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .toast-notification {
          max-width: 24rem;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-width: 1px;
        }
      `}</style>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    type?: 'success' | 'error' | 'info'
  }>
  onDismiss: (id: string) => void
}

/**
 * Container component for displaying multiple toast notifications
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}

export default ToastContainer

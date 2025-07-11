'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  XCircle,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'issue'

export interface NotificationAction {
  label: string
  onClick: () => void
  primary?: boolean
  icon?: React.ReactNode
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: Date
  read: boolean
  dismissible?: boolean
  persistent?: boolean
  actions?: NotificationAction[]
  technicalDetails?: string
  relatedLink?: {
    url: string
    label: string
  }
}

interface NotificationCenterProps {
  notifications: NotificationItem[]
  onDismiss: (id: string) => void
  onDismissAll: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  maxVisibleNotifications?: number
  className?: string
}

/**
 * Comprehensive notification center component
 * Displays user notifications with different severity levels
 * and provides actions to resolve issues
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
  onDismissAll,
  onMarkAsRead,
  onMarkAllAsRead,
  maxVisibleNotifications = 5,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [filteredType, setFilteredType] = useState<NotificationType | 'all'>('all')
  const [notificationSound] = useState<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio('/sounds/notification.mp3') : null,
  )

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Play sound when new notification appears
  useEffect(() => {
    const hasUnread = notifications.some((notification) => !notification.read)
    if (hasUnread && notificationSound && !isOpen) {
      // Only play sound for new notifications when panel is closed
      notificationSound.volume = 0.3
      notificationSound.play().catch((e) => console.log('Audio play prevented:', e))
    }
  }, [notifications, notificationSound, isOpen])

  // Count unread notifications by type
  const unreadCount = notifications.filter((notification) => !notification.read).length
  const errorCount = notifications.filter(
    (notification) => notification.type === 'error' && !notification.read,
  ).length
  const issueCount = notifications.filter(
    (notification) => notification.type === 'issue' && !notification.read,
  ).length

  // Filter notifications by selected type
  const filteredNotifications = notifications.filter(
    (notification) => filteredType === 'all' || notification.type === filteredType,
  )

  // Sort notifications: unread first, then by timestamp (newest first)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    // Unread notifications first
    if (a.read !== b.read) {
      return a.read ? 1 : -1
    }
    // Then sort by timestamp (newest first)
    return b.timestamp.getTime() - a.timestamp.getTime()
  })

  // Get visible notifications
  const visibleNotifications = sortedNotifications.slice(0, maxVisibleNotifications)
  const hasMoreNotifications = sortedNotifications.length > maxVisibleNotifications

  // Get notification icon by type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
      case 'issue':
        return <XCircle className="w-5 h-5 text-purple-500 dark:text-purple-400" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />
    }
  }

  // Get notification background color by type
  const getNotificationBackground = (type: NotificationType, read: boolean) => {
    const opacity = read ? '30' : '50' // Lower opacity for read notifications

    switch (type) {
      case 'success':
        return `bg-green-${opacity} dark:bg-green-900/30 border-green-200 dark:border-green-800`
      case 'error':
        return `bg-red-${opacity} dark:bg-red-900/30 border-red-200 dark:border-red-800`
      case 'warning':
        return `bg-amber-${opacity} dark:bg-amber-900/30 border-amber-200 dark:border-amber-800`
      case 'issue':
        return `bg-purple-${opacity} dark:bg-purple-900/30 border-purple-200 dark:border-purple-800`
      case 'info':
      default:
        return `bg-blue-${opacity} dark:bg-blue-900/30 border-blue-200 dark:border-blue-800`
    }
  }

  // Notification badge styles
  const getBadgeStyles = () => {
    if (errorCount > 0) {
      return 'bg-red-500 text-white hover:bg-red-600'
    }
    if (issueCount > 0) {
      return 'bg-purple-500 text-white hover:bg-purple-600'
    }
    if (unreadCount > 0) {
      return 'bg-blue-500 text-white hover:bg-blue-600'
    }
    return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }

  return (
    <div className={`notification-center relative ${className}`} ref={notificationRef}>
      {/* Notification bell with badge */}
      <button
        type="button"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="notification-bell relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />

        {/* Notification count badge */}
        {unreadCount > 0 && (
          <span
            className={`absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${getBadgeStyles()} transition-all duration-300 transform -translate-y-1/4 translate-x-1/4`}
            aria-hidden="true"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {isOpen && (
        <div
          className="notification-panel absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Notifications"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Notifications</h3>

            <div className="flex items-center gap-2">
              {/* Filter options */}
              <div className="relative">
                <select
                  value={filteredType}
                  onChange={(e) => setFilteredType(e.target.value as NotificationType | 'all')}
                  className="h-8 pl-2 pr-8 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter notifications"
                >
                  <option value="all">All</option>
                  <option value="error">Errors</option>
                  <option value="issue">Issues</option>
                  <option value="warning">Warnings</option>
                  <option value="success">Success</option>
                  <option value="info">Info</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>

              {/* Settings button */}
              <button
                aria-label="Notification settings"
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div
            className="notification-list max-h-96 overflow-y-auto p-1 divide-y divide-gray-100 dark:divide-gray-800"
            role="log"
            aria-live="polite"
          >
            {visibleNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No notifications to display</p>
                <p className="text-sm mt-1">
                  {filteredType !== 'all'
                    ? `Try changing the filter from "${filteredType}"`
                    : "You're all caught up!"}
                </p>
              </div>
            ) : (
              <>
                {visibleNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item p-3 ${!notification.read ? 'animate-highlight' : ''} border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-md transition-all duration-200 m-1`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Notification content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            {notification.title}
                          </h4>

                          {/* Time badge */}
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {notification.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Message */}
                        <p
                          className={`text-sm mt-1 ${!notification.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                          {notification.message}
                        </p>

                        {/* Actions */}
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant={action.primary ? 'default' : 'outline'}
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => {
                                  action.onClick()
                                  if (!notification.persistent) {
                                    onMarkAsRead(notification.id)
                                  }
                                }}
                              >
                                {action.icon}
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Related link */}
                        {notification.relatedLink && (
                          <a
                            href={notification.relatedLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline mt-2"
                          >
                            {notification.relatedLink.label}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>

                      {/* Dismiss button */}
                      {notification.dismissible !== false && (
                        <button
                          aria-label="Dismiss notification"
                          className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                          onClick={() => onDismiss(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Show more indicator */}
                {hasMoreNotifications && (
                  <div className="text-center p-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <button className="flex items-center justify-center w-full py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200">
                      <span>Show {sortedNotifications.length - maxVisibleNotifications} more</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Panel footer */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {unreadCount > 0 ? (
              <button
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                onClick={onMarkAllAsRead}
              >
                Mark all as read
              </button>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No unread notifications
              </span>
            )}

            <button
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline"
              onClick={onDismissAll}
              disabled={notifications.length === 0}
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Global styles for notification animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes highlight {
          0% {
            background-color: rgba(59, 130, 246, 0.1);
          }
          50% {
            background-color: rgba(59, 130, 246, 0.2);
          }
          100% {
            background-color: transparent;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-highlight {
          animation: highlight 2s ease-out;
        }

        /* Improve scrollbar for notification list */
        .notification-list::-webkit-scrollbar {
          width: 6px;
        }

        .notification-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .notification-list::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }

        .notification-list::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }

        /* For Firefox */
        .notification-list {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
      `}</style>
    </div>
  )
}

/**
 * Notification provider with custom hook for managing notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  // Add a new notification
  const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`

    setNotifications((prev) => [
      ...prev,
      {
        ...notification,
        id,
        timestamp: new Date(),
        read: false,
      },
    ])

    return id
  }

  // Convenience methods for different notification types
  const addSuccessNotification = (
    title: string,
    message: string,
    options?: Partial<
      Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'title' | 'message' | 'type'>
    >,
  ) => {
    return addNotification({ title, message, type: 'success', ...options })
  }

  const addErrorNotification = (
    title: string,
    message: string,
    options?: Partial<
      Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'title' | 'message' | 'type'>
    >,
  ) => {
    return addNotification({ title, message, type: 'error', ...options })
  }

  const addInfoNotification = (
    title: string,
    message: string,
    options?: Partial<
      Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'title' | 'message' | 'type'>
    >,
  ) => {
    return addNotification({ title, message, type: 'info', ...options })
  }

  const addWarningNotification = (
    title: string,
    message: string,
    options?: Partial<
      Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'title' | 'message' | 'type'>
    >,
  ) => {
    return addNotification({ title, message, type: 'warning', ...options })
  }

  const addIssueNotification = (
    title: string,
    message: string,
    options?: Partial<
      Omit<NotificationItem, 'id' | 'timestamp' | 'read' | 'title' | 'message' | 'type'>
    >,
  ) => {
    return addNotification({ title, message, type: 'issue', ...options })
  }

  // Dismiss a notification
  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Dismiss all notifications
  const dismissAllNotifications = () => {
    setNotifications([])
  }

  // Mark a notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return {
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
  }
}

export default NotificationCenter

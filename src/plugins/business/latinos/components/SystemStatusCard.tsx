'use client'

import React from 'react'

interface SystemStatus {
  is_running: boolean
  active_bots: number
  total_trades_today: number
  system_health: 'healthy' | 'warning' | 'error'
  last_update: string
}

interface SystemStatusCardProps {
  status: SystemStatus | null
  loading?: boolean
  className?: string
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  status,
  loading = false,
  className = '',
}) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">System Status</dt>
                <dd className="text-lg font-medium text-gray-900">Unavailable</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Unable to connect to trading system</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${getHealthColor(status.system_health)}`}
            >
              {getHealthIcon(status.system_health)}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">System Status</dt>
              <dd className="flex items-center">
                <span className="text-lg font-medium text-gray-900 capitalize">
                  {status.system_health}
                </span>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    status.is_running ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {status.is_running ? 'Running' : 'Stopped'}
                </span>
              </dd>
            </dl>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Active Bots:</span>
              <span className="ml-1 font-medium text-gray-900">{status.active_bots}</span>
            </div>
            <div>
              <span className="text-gray-500">Trades Today:</span>
              <span className="ml-1 font-medium text-gray-900">{status.total_trades_today}</span>
            </div>
          </div>

          {status.last_update && (
            <div className="mt-2 text-xs text-gray-500">
              Last update: {new Date(status.last_update).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemStatusCard

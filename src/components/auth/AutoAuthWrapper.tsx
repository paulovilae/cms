'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthWrapper from './AuthWrapper'

interface AutoAuthWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallbackMessage?: string
  enableAutoAuth?: boolean
}

/**
 * Enhanced AuthWrapper with automatic authentication support
 *
 * Supports:
 * - URL parameters: ?email=test@test.com&password=test
 * - Token authentication: ?token=your-jwt-token
 * - Auto-login for development: ?autoLogin=true
 */
export default function AutoAuthWrapper({
  children,
  requireAuth = true,
  fallbackMessage,
  enableAutoAuth = true,
}: AutoAuthWrapperProps) {
  const [isAutoAuthenticating, setIsAutoAuthenticating] = useState(false)
  const [autoAuthError, setAutoAuthError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const searchParams = useSearchParams()

  // Check for authentication parameters in URL
  useEffect(() => {
    if (!enableAutoAuth) return

    const email = searchParams.get('email')
    const password = searchParams.get('password')
    const token = searchParams.get('token')
    const autoLogin = searchParams.get('autoLogin')

    // Auto-login with default test credentials
    if (autoLogin === 'true') {
      performAutoLogin('test@test.com', 'Test12345%')
      return
    }

    // Login with URL parameters
    if (email && password) {
      performAutoLogin(email, password)
      return
    }

    // Token-based authentication
    if (token) {
      performTokenAuth(token)
      return
    }

    // Check if already authenticated
    checkAuthStatus()
  }, [searchParams, enableAutoAuth])

  const performAutoLogin = async (email: string, password: string) => {
    setIsAutoAuthenticating(true)
    setAutoAuthError(null)

    try {
      console.log('Attempting auto-login with:', email)

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Auto-login successful:', result.user?.email)
        setIsAuthenticated(true)

        // Clean URL parameters after successful login
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.delete('email')
          url.searchParams.delete('password')
          url.searchParams.delete('autoLogin')
          window.history.replaceState({}, '', url.toString())
        }
      } else {
        const error = await response.json()
        setAutoAuthError(`Auto-login failed: ${error.message || response.statusText}`)
        console.error('Auto-login failed:', error)
      }
    } catch (error) {
      setAutoAuthError(
        `Auto-login error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
      console.error('Auto-login error:', error)
    } finally {
      setIsAutoAuthenticating(false)
    }
  }

  const performTokenAuth = async (token: string) => {
    setIsAutoAuthenticating(true)
    setAutoAuthError(null)

    try {
      console.log('Attempting token authentication')

      // Set token in cookie or localStorage for subsequent requests
      document.cookie = `payload-token=${token}; path=/; max-age=86400` // 24 hours

      // Verify token by making a test request
      const response = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Token authentication successful:', result.user?.email)
        setIsAuthenticated(true)

        // Clean URL parameters after successful authentication
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.delete('token')
          window.history.replaceState({}, '', url.toString())
        }
      } else {
        setAutoAuthError('Invalid or expired token')
        console.error('Token authentication failed')
      }
    } catch (error) {
      setAutoAuthError(
        `Token auth error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
      console.error('Token authentication error:', error)
    } finally {
      setIsAutoAuthenticating(false)
    }
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include',
      })

      if (response.ok) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log('Not authenticated')
    }
  }

  // Show loading state during auto-authentication
  if (isAutoAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Show auto-auth error if it occurred
  if (autoAuthError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
          <p className="text-gray-400 mb-4">{autoAuthError}</p>
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <strong className="text-gray-400">Quick access options:</strong>
            </p>
            <p>
              • Add{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">?autoLogin=true</code>{' '}
              to URL for default test login
            </p>
            <p>
              • Add{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                ?email=your@email.com&password=yourpass
              </code>{' '}
              for custom login
            </p>
            <p>
              • Add{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                ?token=your-jwt-token
              </code>{' '}
              for token authentication
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Use the regular AuthWrapper for normal authentication flow
  return (
    <AuthWrapper requireAuth={requireAuth} fallbackMessage={fallbackMessage}>
      {children}
    </AuthWrapper>
  )
}

// Helper function to generate quick access URLs
export const generateQuickAccessUrl = (
  baseUrl: string,
  options: {
    email?: string
    password?: string
    token?: string
    autoLogin?: boolean
  } = {},
) => {
  const url = new URL(baseUrl)

  if (options.autoLogin) {
    url.searchParams.set('autoLogin', 'true')
  } else if (options.email && options.password) {
    url.searchParams.set('email', options.email)
    url.searchParams.set('password', options.password)
  } else if (options.token) {
    url.searchParams.set('token', options.token)
  }

  return url.toString()
}

// Development helper component
export const QuickAccessLinks: React.FC<{ currentUrl?: string }> = ({ currentUrl }) => {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'development') return null

  const baseUrl = (currentUrl || '').split('?')[0]

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg max-w-sm">
      <h4 className="font-semibold text-sm mb-2 text-white">Quick Access (Dev Only)</h4>
      <div className="space-y-2 text-xs">
        <a
          href={generateQuickAccessUrl(baseUrl, { autoLogin: true })}
          className="block text-blue-400 hover:text-blue-300"
        >
          🚀 Auto-login (test@test.com)
        </a>
        <a
          href={generateQuickAccessUrl(baseUrl, { email: 'admin@admin.com', password: 'admin' })}
          className="block text-blue-400 hover:text-blue-300"
        >
          👑 Admin login
        </a>
        <div className="pt-2 border-t border-gray-600">
          <p className="text-gray-400">Or add to URL:</p>
          <code className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
            ?autoLogin=true
          </code>
        </div>
      </div>
    </div>
  )
}

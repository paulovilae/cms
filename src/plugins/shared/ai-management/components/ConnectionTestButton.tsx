'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

interface ConnectionTestButtonProps {
  path?: string
}

export const ConnectionTestButton: React.FC<ConnectionTestButtonProps> = ({ path }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    status: string
    responseTimeMs?: number
    error?: string
    availableModels?: string[]
  } | null>(null)

  const { id } = useDocumentInfo()
  const fields = useFormFields(([fields]) => fields)

  // Extract current form data with proper typing
  const provider = fields?.provider?.value as string
  const baseUrl = fields?.baseUrl?.value as string
  const apiKey = fields?.apiKey?.value as string
  const model = fields?.model?.value as string
  const testEndpoint = fields?.testEndpoint?.value as string
  const connectionStatus = fields?.connectionStatus?.value as string
  const lastTestError = fields?.lastTestError?.value as string
  const lastTestDate = fields?.lastTestDate?.value as string
  const responseTimeMs = fields?.responseTimeMs?.value as number

  const handleTestConnection = async () => {
    if (!provider) return

    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/ai-providers/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          provider,
          baseUrl,
          apiKey,
          model,
          testEndpoint,
        }),
      })

      const result = await response.json()
      setTestResult(result)

      // Refresh the page to show updated connection status
      if (result.success) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      setTestResult({
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to test connection',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600'
      case 'disconnected':
        return 'text-gray-500'
      case 'error':
        return 'text-red-600'
      case 'testing':
        return 'text-yellow-600'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return '✅'
      case 'disconnected':
        return '⚪'
      case 'error':
        return '❌'
      case 'testing':
        return '🔄'
      default:
        return '⚪'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={handleTestConnection}
          disabled={isLoading || !provider}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">🔄</span>
              Testing Connection...
            </>
          ) : (
            <>
              <span className="mr-2">🔌</span>
              Test Connection
            </>
          )}
        </Button>

        {connectionStatus && (
          <div className="flex items-center gap-2">
            <span>{getStatusIcon(connectionStatus)}</span>
            <span className={`text-sm font-medium ${getStatusColor(connectionStatus)}`}>
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </span>
            {responseTimeMs && <span className="text-xs text-gray-500">({responseTimeMs}ms)</span>}
          </div>
        )}
      </div>

      {testResult && (
        <div
          className={`p-3 rounded-md border ${
            testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span>{testResult.success ? '✅' : '❌'}</span>
            <span
              className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}
            >
              {testResult.success ? 'Connection Successful' : 'Connection Failed'}
            </span>
            {testResult.responseTimeMs && (
              <span className="text-sm text-gray-600">({testResult.responseTimeMs}ms)</span>
            )}
          </div>

          {testResult.error && (
            <div className="text-sm text-red-700 mb-2">
              <strong>Error:</strong> {testResult.error}
            </div>
          )}

          {testResult.availableModels && testResult.availableModels.length > 0 && (
            <div className="text-sm text-green-700">
              <strong>Available Models:</strong>
              <div className="mt-1 flex flex-wrap gap-1">
                {testResult.availableModels.slice(0, 5).map((model, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                  >
                    {model}
                  </span>
                ))}
                {testResult.availableModels.length > 5 && (
                  <span className="text-xs text-green-600">
                    +{testResult.availableModels.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {testResult.success && (
            <div className="text-xs text-green-600 mt-2">
              Connection status will be updated automatically. Page will refresh in 2 seconds.
            </div>
          )}
        </div>
      )}

      {lastTestError && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <div className="text-sm text-red-700">
            <strong>Last Test Error:</strong> {lastTestError}
          </div>
          {lastTestDate && (
            <div className="text-xs text-red-600 mt-1">
              Last tested: {new Date(lastTestDate).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ConnectionTestButton

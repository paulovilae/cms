'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Activity,
  Globe,
  Server,
  Clock,
  Wifi,
  WifiOff,
  Settings,
  Bug,
} from 'lucide-react'

// Simple Badge component
const Badge: React.FC<{
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'warning'
  className?: string
}> = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 bg-white text-gray-700',
    secondary: 'bg-gray-100 text-gray-800',
    warning: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</span>
  )
}

// Simple Alert component
const Alert: React.FC<{
  children: React.ReactNode
  variant?: 'default' | 'destructive'
  className?: string
}> = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'relative w-full rounded-lg border p-4 mb-4'
  const variantClasses = {
    default: 'border-blue-200 bg-blue-50 text-blue-900',
    destructive: 'border-red-200 bg-red-50 text-red-900',
  }

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>
}

const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h5 className="mb-1 font-medium leading-none tracking-tight">{children}</h5>
)

const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm [&_p]:leading-relaxed">{children}</div>
)

interface ConnectionStatus {
  isConnected: boolean
  baseUrl: string
  timeout: number
  lastTestTime?: string
  lastSuccessTime?: string
  consecutiveFailures: number
  averageResponseTime?: number
  microserviceInfo?: {
    version?: string
    status?: string
    uptime?: number
  }
  networkInfo: {
    canReachHost: boolean
    dnsResolution: boolean
    portOpen: boolean
  }
  diagnoses: Array<{
    issue: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    possibleCauses: string[]
    troubleshootingSteps: string[]
    autoFixAvailable: boolean
  }>
}

interface EndpointTestResults {
  health: { success: boolean; responseTime?: number; error?: string }
  systemStatus: { success: boolean; responseTime?: number; error?: string }
  formulas: { success: boolean; responseTime?: number; error?: string }
  trades: { success: boolean; responseTime?: number; error?: string }
}

interface DebugData {
  connectionStatus: ConnectionStatus
  endpointTests: EndpointTestResults
  configuration: {
    baseUrl: string
    timeout: number
    wsUrl: string
    isConfigured: boolean
  }
  timestamp: string
}

export const ConnectionDebugPanel: React.FC = () => {
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Load initial debug data
  useEffect(() => {
    loadDebugData()
  }, [])

  const loadDebugData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/latinos/debug/connection')
      const result = await response.json()

      if (result.success) {
        setDebugData(result.data)
      } else {
        setError(result.error || 'Failed to load debug data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const retryConnection = async () => {
    setRetrying(true)
    setError(null)

    try {
      const response = await fetch('/api/latinos/debug/retry-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxRetries: 3,
          retryDelay: 2000,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Reload debug data to get updated status
        await loadDebugData()
      } else {
        setError(result.error || 'Connection retry failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry failed')
    } finally {
      setRetrying(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'warning'
      case 'low':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4" />
      case 'high':
        return <AlertTriangle className="h-4 w-4" />
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />
      case 'low':
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatResponseTime = (time?: number) => {
    if (!time) return 'N/A'
    return `${time}ms`
  }

  const formatUptime = (uptime?: number) => {
    if (!uptime) return 'N/A'
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (loading && !debugData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Connection Debug Panel
          </CardTitle>
          <CardDescription>Loading connection diagnostics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Connection Debug Panel
              </CardTitle>
              <CardDescription>
                Diagnose and resolve connection issues with the Python FastAPI microservice
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadDebugData} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={retryConnection} disabled={retrying || loading} size="sm">
                <Wifi className={`h-4 w-4 mr-2 ${retrying ? 'animate-pulse' : ''}`} />
                Test Connection
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugData && (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'endpoints', label: 'Endpoints' },
                  { id: 'diagnostics', label: 'Diagnostics' },
                  { id: 'configuration', label: 'Configuration' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          {debugData.connectionStatus.isConnected ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">Connection Status</p>
                            <p className="text-xs text-gray-500">
                              {debugData.connectionStatus.isConnected
                                ? 'Connected'
                                : 'Disconnected'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">Response Time</p>
                            <p className="text-xs text-gray-500">
                              {formatResponseTime(debugData.connectionStatus.averageResponseTime)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          {debugData.connectionStatus.networkInfo.canReachHost ? (
                            <Wifi className="h-5 w-5 text-green-500" />
                          ) : (
                            <WifiOff className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">Network</p>
                            <p className="text-xs text-gray-500">
                              {debugData.connectionStatus.networkInfo.canReachHost
                                ? 'Reachable'
                                : 'Unreachable'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Server className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm font-medium">Microservice</p>
                            <p className="text-xs text-gray-500">
                              {debugData.connectionStatus.microserviceInfo?.status || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {debugData.connectionStatus.microserviceInfo && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Microservice Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">Version</p>
                            <p className="text-sm text-gray-500">
                              {debugData.connectionStatus.microserviceInfo.version || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <Badge variant="outline">
                              {debugData.connectionStatus.microserviceInfo.status || 'Unknown'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Uptime</p>
                            <p className="text-sm text-gray-500">
                              {formatUptime(debugData.connectionStatus.microserviceInfo.uptime)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Endpoints Tab */}
              {activeTab === 'endpoints' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(debugData.endpointTests).map(([endpoint, result]) => (
                    <Card key={endpoint}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          {endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Status:</span>
                            <Badge variant={result.success ? 'default' : 'destructive'}>
                              {result.success ? 'OK' : 'Failed'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Response Time:</span>
                            <span className="text-sm">
                              {formatResponseTime(result.responseTime)}
                            </span>
                          </div>
                          {result.error && (
                            <div>
                              <span className="text-sm font-medium">Error:</span>
                              <p className="text-xs text-red-600 mt-1">{result.error}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Diagnostics Tab */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-4">
                  {debugData.connectionStatus.diagnoses.length > 0 ? (
                    debugData.connectionStatus.diagnoses.map((diagnosis, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            {getSeverityIcon(diagnosis.severity)}
                            {diagnosis.issue}
                            <Badge variant={getSeverityColor(diagnosis.severity) as any}>
                              {diagnosis.severity}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{diagnosis.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Possible Causes:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {diagnosis.possibleCauses.map((cause, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-xs mt-1">•</span>
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Troubleshooting Steps:</h4>
                            <ol className="text-sm text-gray-600 space-y-1">
                              {diagnosis.troubleshootingSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-xs mt-1">{i + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                          {diagnosis.autoFixAvailable && (
                            <Alert>
                              <Settings className="h-4 w-4" />
                              <AlertTitle>Auto-fix Available</AlertTitle>
                              <AlertDescription>
                                This issue may be automatically resolvable. Check the
                                troubleshooting steps above.
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Issues Detected</h3>
                        <p className="text-gray-500">
                          The connection appears to be working properly. No diagnostic issues found.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Configuration Tab */}
              {activeTab === 'configuration' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Configuration</CardTitle>
                      <CardDescription>
                        Environment variables and connection settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Base URL</p>
                          <p className="text-sm text-gray-500 font-mono">
                            {debugData.configuration.baseUrl}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">WebSocket URL</p>
                          <p className="text-sm text-gray-500 font-mono">
                            {debugData.configuration.wsUrl}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Timeout</p>
                          <p className="text-sm text-gray-500">
                            {debugData.configuration.timeout}ms
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Configuration Status</p>
                          <Badge
                            variant={
                              debugData.configuration.isConfigured ? 'default' : 'destructive'
                            }
                          >
                            {debugData.configuration.isConfigured ? 'Configured' : 'Not Configured'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Required Environment Variables</CardTitle>
                      <CardDescription>
                        Make sure these environment variables are properly set
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <code className="text-sm">
                            BOT_MICROSERVICE_URL=http://localhost:8000
                          </code>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <code className="text-sm">
                            BOT_MICROSERVICE_WS_URL=ws://localhost:8000/ws/trades
                          </code>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <code className="text-sm">BOT_MICROSERVICE_TIMEOUT=10000</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ConnectionDebugPanel

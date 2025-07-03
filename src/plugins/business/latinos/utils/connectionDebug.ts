/**
 * Connection Debugging and Resolution Utilities
 *
 * Provides comprehensive debugging tools for the Latinos Trading Bot System
 * to diagnose and resolve connection issues with the Python FastAPI microservice.
 */

export interface ConnectionTestResult {
  success: boolean
  responseTime?: number
  error?: string
  statusCode?: number
  details?: Record<string, any>
}

export interface ConnectionDiagnosis {
  issue: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  possibleCauses: string[]
  troubleshootingSteps: string[]
  autoFixAvailable: boolean
}

export interface DetailedConnectionStatus {
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
  diagnoses: ConnectionDiagnosis[]
}

/**
 * Test basic connectivity to the microservice
 */
export async function testConnection(
  url: string,
  timeout: number = 10000,
): Promise<ConnectionTestResult> {
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${url}/api/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Latinos-CMS-Debug/1.0',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    if (response.ok) {
      let details = {}
      try {
        details = await response.json()
      } catch (e) {
        // Response might not be JSON
        details = { rawResponse: await response.text() }
      }

      return {
        success: true,
        responseTime,
        statusCode: response.status,
        details,
      }
    } else {
      return {
        success: false,
        responseTime,
        statusCode: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          responseTime,
          error: `Connection timeout after ${timeout}ms`,
        }
      }

      return {
        success: false,
        responseTime,
        error: error.message,
      }
    }

    return {
      success: false,
      responseTime,
      error: 'Unknown connection error',
    }
  }
}

/**
 * Test DNS resolution for the microservice URL
 */
async function testDnsResolution(hostname: string): Promise<boolean> {
  try {
    // Simple DNS test by trying to fetch a basic endpoint
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    await fetch(`http://${hostname}`, {
      method: 'HEAD',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return true
  } catch (error) {
    // DNS resolution failed or connection refused (but DNS worked)
    if (error instanceof Error && error.message.includes('fetch')) {
      return true // DNS worked, connection failed for other reasons
    }
    return false
  }
}

/**
 * Test if we can reach the host (basic network connectivity)
 */
async function testHostReachability(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    // Try a simple HEAD request to see if we can reach the host
    await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return true
  } catch (error) {
    // Even if we get an error, if it's not a network error, the host is reachable
    if (error instanceof Error) {
      return !error.message.includes('network') && !error.message.includes('ENOTFOUND')
    }
    return false
  }
}

/**
 * Diagnose common microservice connection issues
 */
export async function diagnoseMicroserviceIssue(
  baseUrl: string,
  timeout: number = 10000,
): Promise<ConnectionDiagnosis[]> {
  const diagnoses: ConnectionDiagnosis[] = []

  // Test basic connection
  const connectionTest = await testConnection(baseUrl, timeout)

  if (!connectionTest.success) {
    // Analyze the error to provide specific diagnoses
    const error = connectionTest.error || ''

    if (error.includes('timeout')) {
      diagnoses.push({
        issue: 'Connection Timeout',
        severity: 'high',
        description: 'The microservice is not responding within the configured timeout period.',
        possibleCauses: [
          'Microservice is not running',
          'Microservice is overloaded',
          'Network latency issues',
          'Firewall blocking the connection',
          'Timeout setting too low',
        ],
        troubleshootingSteps: [
          'Check if the Python FastAPI microservice is running',
          'Verify the microservice URL and port',
          'Increase the timeout setting',
          'Check network connectivity',
          'Review microservice logs for errors',
        ],
        autoFixAvailable: false,
      })
    }

    if (error.includes('ECONNREFUSED') || error.includes('Connection refused')) {
      diagnoses.push({
        issue: 'Connection Refused',
        severity: 'critical',
        description: 'The connection to the microservice is being actively refused.',
        possibleCauses: [
          'Microservice is not running',
          'Wrong port number configured',
          'Microservice crashed or failed to start',
          'Port is blocked by firewall',
        ],
        troubleshootingSteps: [
          'Start the Python FastAPI microservice',
          'Verify the correct port in BOT_MICROSERVICE_URL',
          'Check microservice startup logs',
          'Ensure no other service is using the same port',
          'Test with curl: curl http://localhost:8000/api/health',
        ],
        autoFixAvailable: false,
      })
    }

    if (error.includes('ENOTFOUND') || error.includes('getaddrinfo')) {
      diagnoses.push({
        issue: 'DNS Resolution Failed',
        severity: 'high',
        description: 'Cannot resolve the hostname of the microservice.',
        possibleCauses: [
          'Invalid hostname in configuration',
          'DNS server issues',
          'Network connectivity problems',
          'Typo in the microservice URL',
        ],
        troubleshootingSteps: [
          'Verify the BOT_MICROSERVICE_URL is correct',
          'Try using IP address instead of hostname',
          'Check DNS settings',
          'Test with ping or nslookup commands',
        ],
        autoFixAvailable: false,
      })
    }

    if (error.includes('HTTP 404')) {
      diagnoses.push({
        issue: 'Health Endpoint Not Found',
        severity: 'medium',
        description: 'The microservice is running but the health endpoint is not available.',
        possibleCauses: [
          'Microservice API structure changed',
          'Health endpoint not implemented',
          'Wrong API path configuration',
          'Microservice version mismatch',
        ],
        troubleshootingSteps: [
          'Check microservice API documentation',
          'Verify the health endpoint path (/api/health)',
          'Update microservice to latest version',
          'Test other endpoints to confirm service is running',
        ],
        autoFixAvailable: false,
      })
    }

    if (error.includes('HTTP 500')) {
      diagnoses.push({
        issue: 'Microservice Internal Error',
        severity: 'high',
        description: 'The microservice is running but experiencing internal errors.',
        possibleCauses: [
          'Database connection issues',
          'Configuration errors in microservice',
          'Missing dependencies',
          'Runtime errors in microservice code',
        ],
        troubleshootingSteps: [
          'Check microservice logs for detailed error messages',
          'Verify microservice database connections',
          'Restart the microservice',
          'Check microservice configuration files',
        ],
        autoFixAvailable: false,
      })
    }
  }

  // Test network connectivity
  try {
    const url = new URL(baseUrl)
    const canReachHost = await testHostReachability(baseUrl)
    const dnsWorks = await testDnsResolution(url.hostname)

    if (!canReachHost) {
      diagnoses.push({
        issue: 'Network Connectivity',
        severity: 'critical',
        description: 'Cannot establish basic network connection to the microservice host.',
        possibleCauses: [
          'Network is down',
          'Firewall blocking connections',
          'VPN or proxy issues',
          'Host is unreachable',
        ],
        troubleshootingSteps: [
          'Check internet connectivity',
          'Verify firewall settings',
          'Test with different network',
          'Check VPN/proxy configuration',
        ],
        autoFixAvailable: false,
      })
    }

    if (!dnsWorks) {
      diagnoses.push({
        issue: 'DNS Resolution',
        severity: 'high',
        description: 'Cannot resolve the microservice hostname to an IP address.',
        possibleCauses: ['DNS server issues', 'Invalid hostname', 'Network configuration problems'],
        troubleshootingSteps: [
          'Use IP address instead of hostname',
          'Check DNS server settings',
          'Try different DNS servers (8.8.8.8, 1.1.1.1)',
        ],
        autoFixAvailable: true,
      })
    }
  } catch (urlError) {
    diagnoses.push({
      issue: 'Invalid URL Configuration',
      severity: 'critical',
      description: 'The configured microservice URL is malformed.',
      possibleCauses: [
        'Typo in BOT_MICROSERVICE_URL',
        'Missing protocol (http:// or https://)',
        'Invalid URL format',
      ],
      troubleshootingSteps: [
        'Check BOT_MICROSERVICE_URL format',
        'Ensure URL includes protocol (http://)',
        'Verify no extra spaces or characters',
      ],
      autoFixAvailable: true,
    })
  }

  // If no specific issues found but connection failed
  if (diagnoses.length === 0 && !connectionTest.success) {
    diagnoses.push({
      issue: 'Unknown Connection Issue',
      severity: 'medium',
      description: 'Connection failed for an unknown reason.',
      possibleCauses: [
        'Temporary network issues',
        'Microservice temporarily unavailable',
        'Unusual configuration',
      ],
      troubleshootingSteps: [
        'Retry the connection',
        'Check microservice status',
        'Review error logs',
        'Contact system administrator',
      ],
      autoFixAvailable: false,
    })
  }

  return diagnoses
}

/**
 * Get comprehensive connection status with diagnostics
 */
export async function getConnectionStatus(
  baseUrl: string,
  timeout: number = 10000,
): Promise<DetailedConnectionStatus> {
  const startTime = Date.now()

  // Test basic connection
  const connectionTest = await testConnection(baseUrl, timeout)

  // Get network info
  let networkInfo = {
    canReachHost: false,
    dnsResolution: false,
    portOpen: false,
  }

  try {
    const url = new URL(baseUrl)
    networkInfo.canReachHost = await testHostReachability(baseUrl)
    networkInfo.dnsResolution = await testDnsResolution(url.hostname)
    networkInfo.portOpen = connectionTest.success || connectionTest.statusCode !== undefined
  } catch (e) {
    // URL parsing failed, will be caught in diagnoses
  }

  // Run diagnostics
  const diagnoses = await diagnoseMicroserviceIssue(baseUrl, timeout)

  // Try to get microservice info if connected
  let microserviceInfo = undefined
  if (connectionTest.success && connectionTest.details) {
    microserviceInfo = {
      version: connectionTest.details.version,
      status: connectionTest.details.status,
      uptime: connectionTest.details.uptime,
    }
  }

  const status: DetailedConnectionStatus = {
    isConnected: connectionTest.success,
    baseUrl,
    timeout,
    lastTestTime: new Date().toISOString(),
    consecutiveFailures: connectionTest.success ? 0 : 1,
    averageResponseTime: connectionTest.responseTime,
    microserviceInfo,
    networkInfo,
    diagnoses,
  }

  if (connectionTest.success) {
    status.lastSuccessTime = new Date().toISOString()
  }

  return status
}

/**
 * Attempt to auto-fix common connection issues
 */
export async function attemptAutoFix(diagnosis: ConnectionDiagnosis): Promise<{
  attempted: boolean
  success: boolean
  message: string
}> {
  if (!diagnosis.autoFixAvailable) {
    return {
      attempted: false,
      success: false,
      message: 'No auto-fix available for this issue',
    }
  }

  // Currently, auto-fixes are limited to configuration suggestions
  // In the future, this could include automatic service restarts, etc.

  return {
    attempted: true,
    success: false,
    message: 'Auto-fix suggestions provided in troubleshooting steps',
  }
}

import { botMicroservice } from '../services/botMicroservice'
import {
  testConnection,
  getConnectionStatus,
  diagnoseMicroserviceIssue,
  attemptAutoFix,
} from '../utils/connectionDebug'

/**
 * Test connection and return detailed status
 */
export const connectionDebugEndpoint = {
  path: '/latinos/debug/connection',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const baseUrl = botMicroservice.getBaseUrl()
      const timeout = parseInt(process.env.BOT_MICROSERVICE_TIMEOUT || '10000')

      // Get comprehensive connection status
      const status = await getConnectionStatus(baseUrl, timeout)

      // Also test specific endpoints
      const endpointTests = await Promise.allSettled([
        testConnection(`${baseUrl}/api/health`, timeout),
        testConnection(`${baseUrl}/api/system/status`, timeout),
        testConnection(`${baseUrl}/api/formulas`, timeout),
        testConnection(`${baseUrl}/api/trades`, timeout),
      ])

      const endpointResults = {
        health:
          endpointTests[0].status === 'fulfilled'
            ? endpointTests[0].value
            : { success: false, error: 'Test failed' },
        systemStatus:
          endpointTests[1].status === 'fulfilled'
            ? endpointTests[1].value
            : { success: false, error: 'Test failed' },
        formulas:
          endpointTests[2].status === 'fulfilled'
            ? endpointTests[2].value
            : { success: false, error: 'Test failed' },
        trades:
          endpointTests[3].status === 'fulfilled'
            ? endpointTests[3].value
            : { success: false, error: 'Test failed' },
      }

      // Get environment configuration
      const config = {
        baseUrl,
        timeout,
        wsUrl: process.env.BOT_MICROSERVICE_WS_URL || 'ws://localhost:8000/ws/trades',
        isConfigured: botMicroservice.isConfigured(),
      }

      res.json({
        success: true,
        data: {
          connectionStatus: status,
          endpointTests: endpointResults,
          configuration: config,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error('Error in connection debug:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to perform connection debug',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Force reconnection attempt
 */
export const retryConnectionEndpoint = {
  path: '/latinos/debug/retry-connection',
  method: 'post',
  handler: async (req: any, res: any) => {
    try {
      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { maxRetries = 3, retryDelay = 2000 } = req.body
      const baseUrl = botMicroservice.getBaseUrl()
      const timeout = parseInt(process.env.BOT_MICROSERVICE_TIMEOUT || '10000')

      const retryResults = []
      let lastError = null
      let successfulConnection = false

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`Connection retry attempt ${attempt}/${maxRetries}`)

        const startTime = Date.now()
        const result = await testConnection(baseUrl, timeout)
        const duration = Date.now() - startTime

        retryResults.push({
          attempt,
          success: result.success,
          responseTime: result.responseTime,
          duration,
          error: result.error,
          statusCode: result.statusCode,
          timestamp: new Date().toISOString(),
        })

        if (result.success) {
          successfulConnection = true
          console.log(`Connection successful on attempt ${attempt}`)
          break
        } else {
          lastError = result.error
          console.log(`Connection failed on attempt ${attempt}: ${result.error}`)

          // Wait before next retry (except on last attempt)
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay))
          }
        }
      }

      // If connection was successful, try to get system status
      let systemStatus = null
      if (successfulConnection) {
        try {
          const statusResult = await botMicroservice.getSystemStatus()
          if (statusResult.success) {
            systemStatus = statusResult.data
          }
        } catch (error) {
          console.warn('Failed to get system status after successful connection:', error)
        }
      }

      // Run fresh diagnostics
      const diagnoses = successfulConnection
        ? []
        : await diagnoseMicroserviceIssue(baseUrl, timeout)

      res.json({
        success: successfulConnection,
        data: {
          connectionEstablished: successfulConnection,
          totalAttempts: maxRetries,
          successfulAttempt: successfulConnection
            ? retryResults.findIndex((r) => r.success) + 1
            : null,
          retryResults,
          systemStatus,
          diagnoses,
          recommendations: successfulConnection
            ? ['Connection restored successfully', 'Monitor for stability']
            : [
                'Connection could not be established',
                'Check microservice status',
                'Review troubleshooting steps in diagnoses',
              ],
        },
        error: successfulConnection ? null : lastError,
        message: successfulConnection
          ? 'Connection retry successful'
          : `Connection failed after ${maxRetries} attempts`,
      })
    } catch (error) {
      console.error('Error in retry connection:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to retry connection',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Get microservice health and detailed information
 */
export const microserviceHealthEndpoint = {
  path: '/latinos/debug/microservice-health',
  method: 'get',
  handler: async (req: any, res: any) => {
    try {
      // Check authentication
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const baseUrl = botMicroservice.getBaseUrl()
      const timeout = parseInt(process.env.BOT_MICROSERVICE_TIMEOUT || '10000')

      // Test multiple endpoints to get comprehensive health info
      const healthChecks = await Promise.allSettled([
        botMicroservice.testConnection(),
        botMicroservice.getSystemStatus(),
        testConnection(`${baseUrl}/docs`, timeout), // FastAPI docs endpoint
        testConnection(`${baseUrl}/openapi.json`, timeout), // OpenAPI spec
      ])

      const healthResults = {
        basicHealth:
          healthChecks[0].status === 'fulfilled'
            ? healthChecks[0].value
            : { success: false, error: 'Health check failed' },
        systemStatus:
          healthChecks[1].status === 'fulfilled'
            ? healthChecks[1].value
            : { success: false, error: 'System status failed' },
        docsAvailable:
          healthChecks[2].status === 'fulfilled' ? healthChecks[2].value.success : false,
        openApiAvailable:
          healthChecks[3].status === 'fulfilled' ? healthChecks[3].value.success : false,
      }

      // Calculate overall health score
      const healthScore = [
        healthResults.basicHealth.success,
        healthResults.systemStatus.success,
        healthResults.docsAvailable,
        healthResults.openApiAvailable,
      ].filter(Boolean).length

      const overallHealth = healthScore >= 3 ? 'healthy' : healthScore >= 2 ? 'warning' : 'critical'

      // Get configuration info
      const configInfo = {
        baseUrl,
        timeout,
        wsUrl: process.env.BOT_MICROSERVICE_WS_URL || 'ws://localhost:8000/ws/trades',
        isConfigured: botMicroservice.isConfigured(),
        environment: process.env.NODE_ENV || 'development',
      }

      res.json({
        success: true,
        data: {
          overallHealth,
          healthScore: `${healthScore}/4`,
          healthChecks: healthResults,
          configuration: configInfo,
          recommendations: generateHealthRecommendations(healthResults, overallHealth),
          timestamp: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error('Error in microservice health check:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to check microservice health',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
}

/**
 * Generate health recommendations based on test results
 */
function generateHealthRecommendations(healthResults: any, overallHealth: string): string[] {
  const recommendations = []

  if (overallHealth === 'critical') {
    recommendations.push('🚨 Critical: Microservice appears to be down or unreachable')
    recommendations.push('Check if the Python FastAPI service is running')
    recommendations.push('Verify the BOT_MICROSERVICE_URL configuration')
  }

  if (!healthResults.basicHealth.success) {
    recommendations.push('❌ Basic health check failed - microservice may not be responding')
    recommendations.push('Try restarting the microservice')
  }

  if (!healthResults.systemStatus.success) {
    recommendations.push('⚠️ System status endpoint not responding')
    recommendations.push('Check microservice logs for errors')
  }

  if (!healthResults.docsAvailable) {
    recommendations.push('📚 API documentation not available')
    recommendations.push('This may indicate the microservice is not fully started')
  }

  if (!healthResults.openApiAvailable) {
    recommendations.push('📋 OpenAPI specification not available')
    recommendations.push('API schema validation may not work properly')
  }

  if (overallHealth === 'healthy') {
    recommendations.push('✅ All systems operational')
    recommendations.push('Microservice is responding normally')
  } else if (overallHealth === 'warning') {
    recommendations.push('⚠️ Some issues detected but core functionality available')
    recommendations.push('Monitor for stability and check logs')
  }

  return recommendations
}

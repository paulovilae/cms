/**
 * Bot Microservice Integration Service
 *
 * Handles communication with the Python FastAPI trading microservice
 * for bot management, trade execution, and real-time data synchronization.
 */

export interface FormulaData {
  name: string
  symbol: string
  exchange: string
  interval: string
  parameters: Record<string, any>
  is_active: boolean
}

export interface TradeData {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  status: 'open' | 'filled' | 'cancelled' | 'expired' | 'rejected'
  filled_at?: string
  profit?: number
  is_successful?: boolean
}

export interface SystemStatus {
  is_running: boolean
  active_bots: number
  total_trades_today: number
  system_health: 'healthy' | 'warning' | 'error'
  last_update: string
}

export interface BotStatus {
  id: string
  last_execution: string
  total_trades: number
  successful_trades: number
  total_profit: number
  status: 'active' | 'paused' | 'stopped' | 'error'
}

export interface MicroserviceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class BotMicroserviceIntegration {
  private baseUrl: string
  private timeout: number
  private maxRetries: number
  private retryDelay: number
  private consecutiveFailures: number
  private lastSuccessTime: Date | null
  private connectionHistory: Array<{
    timestamp: Date
    success: boolean
    responseTime?: number
    error?: string
  }>

  constructor() {
    this.baseUrl = process.env.BOT_MICROSERVICE_URL || 'http://localhost:8000'
    this.timeout = parseInt(process.env.BOT_MICROSERVICE_TIMEOUT || '10000')
    this.maxRetries = parseInt(process.env.BOT_MICROSERVICE_MAX_RETRIES || '3')
    this.retryDelay = parseInt(process.env.BOT_MICROSERVICE_RETRY_DELAY || '2000')
    this.consecutiveFailures = 0
    this.lastSuccessTime = null
    this.connectionHistory = []
  }

  /**
   * Create a new formula in the microservice
   */
  async createFormula(botData: any): Promise<MicroserviceResponse<{ id: string }>> {
    try {
      const formulaData: FormulaData = {
        name: botData.name,
        symbol: botData.symbol,
        exchange: botData.exchange,
        interval: botData.interval || '1h',
        parameters: botData.parameters || {},
        is_active: botData.status === 'active',
      }

      const response = await this.makeRequest('/api/formulas', {
        method: 'POST',
        body: JSON.stringify(formulaData),
      })

      return response
    } catch (error) {
      console.error('Error creating formula:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Update an existing formula in the microservice
   */
  async updateFormula(
    microserviceId: string,
    updates: Partial<FormulaData>,
  ): Promise<MicroserviceResponse> {
    try {
      const response = await this.makeRequest(`/api/formulas/${microserviceId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })

      return response
    } catch (error) {
      console.error('Error updating formula:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Delete a formula from the microservice
   */
  async deleteFormula(microserviceId: string): Promise<MicroserviceResponse> {
    try {
      const response = await this.makeRequest(`/api/formulas/${microserviceId}`, {
        method: 'DELETE',
      })

      return response
    } catch (error) {
      console.error('Error deleting formula:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get all trades from the microservice
   */
  async getTrades(): Promise<MicroserviceResponse<TradeData[]>> {
    try {
      const response = await this.makeRequest('/api/trades')
      return response
    } catch (error) {
      console.error('Error fetching trades:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get trades for a specific bot
   */
  async getBotTrades(microserviceId: string): Promise<MicroserviceResponse<TradeData[]>> {
    try {
      const response = await this.makeRequest(`/api/trades?bot_id=${microserviceId}`)
      return response
    } catch (error) {
      console.error('Error fetching bot trades:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get system status from the microservice
   */
  async getSystemStatus(): Promise<MicroserviceResponse<SystemStatus>> {
    try {
      const response = await this.makeRequest('/api/system/status')
      return response
    } catch (error) {
      console.error('Error fetching system status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Start the trading system
   */
  async startSystem(): Promise<MicroserviceResponse> {
    try {
      const response = await this.makeRequest('/api/system/start', {
        method: 'POST',
      })

      return response
    } catch (error) {
      console.error('Error starting system:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Stop the trading system
   */
  async stopSystem(): Promise<MicroserviceResponse> {
    try {
      const response = await this.makeRequest('/api/system/stop', {
        method: 'POST',
      })

      return response
    } catch (error) {
      console.error('Error stopping system:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Start a specific bot
   */
  async startBot(microserviceId: string): Promise<MicroserviceResponse> {
    try {
      const response = await this.makeRequest(`/api/bots/${microserviceId}/start`, {
        method: 'POST',
      })

      return response
    } catch (error) {
      console.error('Error starting bot:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Stop a specific bot
   */
  async stopBot(microserviceId: string): Promise<MicroserviceResponse> {
    try {
      const response = await this.makeRequest(`/api/bots/${microserviceId}/stop`, {
        method: 'POST',
      })

      return response
    } catch (error) {
      console.error('Error stopping bot:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get bot status from the microservice
   */
  async getBotStatus(microserviceId: string): Promise<MicroserviceResponse<BotStatus>> {
    try {
      const response = await this.makeRequest(`/api/bots/${microserviceId}/status`)
      return response
    } catch (error) {
      console.error('Error fetching bot status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Test connection to the microservice
   */
  async testConnection(): Promise<MicroserviceResponse> {
    try {
      const response = await this.makeRequest('/api/health')
      return response
    } catch (error) {
      console.error('Error testing connection:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }
    }
  }

  /**
   * Private method to make HTTP requests to the microservice with retry logic
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<MicroserviceResponse> {
    const url = `${this.baseUrl}${endpoint}`
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const startTime = Date.now()

      try {
        this.logDebug(`Attempt ${attempt}/${this.maxRetries} for ${endpoint}`)

        const defaultOptions: RequestInit = {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': 'Latinos-CMS/1.0',
            'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
        }

        const requestOptions = {
          ...defaultOptions,
          ...options,
          headers: {
            ...defaultOptions.headers,
            ...options.headers,
          },
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const responseTime = Date.now() - startTime

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error')
          const error = new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)

          this.recordConnectionAttempt(false, responseTime, error.message)

          // Don't retry on client errors (4xx), only server errors (5xx) and network issues
          if (response.status >= 400 && response.status < 500) {
            this.consecutiveFailures++
            throw error
          }

          lastError = error

          if (attempt < this.maxRetries) {
            this.logDebug(`HTTP ${response.status} error, retrying in ${this.retryDelay}ms...`)
            await this.delay(this.retryDelay)
            continue
          }

          throw error
        }

        let data
        try {
          data = await response.json()
        } catch (parseError) {
          // Response might not be JSON
          data = { message: 'Response received but not JSON', rawResponse: await response.text() }
        }

        // Success - reset failure counter and record success
        this.consecutiveFailures = 0
        this.lastSuccessTime = new Date()
        this.recordConnectionAttempt(true, responseTime)

        this.logDebug(`Request successful in ${responseTime}ms`)

        return {
          success: true,
          data: data,
        }
      } catch (error) {
        const responseTime = Date.now() - startTime
        lastError = error instanceof Error ? error : new Error('Unknown error occurred')

        if (lastError.name === 'AbortError') {
          lastError = new Error(`Request timeout after ${this.timeout}ms`)
        }

        this.recordConnectionAttempt(false, responseTime, lastError.message)
        this.consecutiveFailures++

        this.logError(`Attempt ${attempt} failed: ${lastError.message}`)

        // Don't retry on timeout or abort errors immediately
        if (lastError.name === 'AbortError' || lastError.message.includes('timeout')) {
          if (attempt < this.maxRetries) {
            this.logDebug(`Timeout error, retrying in ${this.retryDelay}ms...`)
            await this.delay(this.retryDelay)
            continue
          }
        }

        // For network errors, retry with exponential backoff
        if (attempt < this.maxRetries) {
          const backoffDelay = this.retryDelay * Math.pow(2, attempt - 1)
          this.logDebug(`Network error, retrying in ${backoffDelay}ms...`)
          await this.delay(backoffDelay)
          continue
        }

        // Last attempt failed
        throw lastError
      }
    }

    // This should never be reached, but just in case
    throw lastError || new Error('All retry attempts failed')
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Record connection attempt for monitoring
   */
  private recordConnectionAttempt(success: boolean, responseTime?: number, error?: string): void {
    const record = {
      timestamp: new Date(),
      success,
      responseTime,
      error,
    }

    this.connectionHistory.push(record)

    // Keep only last 50 records to prevent memory issues
    if (this.connectionHistory.length > 50) {
      this.connectionHistory = this.connectionHistory.slice(-50)
    }
  }

  /**
   * Debug logging
   */
  private logDebug(message: string): void {
    if (process.env.NODE_ENV === 'development' || process.env.BOT_MICROSERVICE_DEBUG === 'true') {
      console.log(`[BotMicroservice] ${message}`)
    }
  }

  /**
   * Error logging
   */
  private logError(message: string): void {
    console.error(`[BotMicroservice] ${message}`)
  }

  /**
   * Get the microservice base URL
   */
  getBaseUrl(): string {
    return this.baseUrl
  }

  /**
   * Check if the microservice is configured
   */
  isConfigured(): boolean {
    return (
      (!!this.baseUrl && this.baseUrl !== 'http://localhost:8000') ||
      !!process.env.BOT_MICROSERVICE_URL
    )
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    consecutiveFailures: number
    lastSuccessTime: Date | null
    totalAttempts: number
    successRate: number
    averageResponseTime: number
    recentHistory: Array<{
      timestamp: Date
      success: boolean
      responseTime?: number
      error?: string
    }>
  } {
    const totalAttempts = this.connectionHistory.length
    const successfulAttempts = this.connectionHistory.filter((h) => h.success).length
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0

    const responseTimes = this.connectionHistory
      .filter((h) => h.success && h.responseTime)
      .map((h) => h.responseTime!)
    const averageResponseTime =
      responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0

    return {
      consecutiveFailures: this.consecutiveFailures,
      lastSuccessTime: this.lastSuccessTime,
      totalAttempts,
      successRate,
      averageResponseTime,
      recentHistory: this.connectionHistory.slice(-10), // Last 10 attempts
    }
  }

  /**
   * Reset connection statistics
   */
  resetConnectionStats(): void {
    this.consecutiveFailures = 0
    this.lastSuccessTime = null
    this.connectionHistory = []
  }

  /**
   * Force a connection test with detailed results
   */
  async performDetailedConnectionTest(): Promise<{
    success: boolean
    responseTime: number
    error?: string
    details: {
      canConnect: boolean
      healthEndpoint: boolean
      systemStatus: boolean
      apiDocumentation: boolean
    }
  }> {
    const startTime = Date.now()
    const details = {
      canConnect: false,
      healthEndpoint: false,
      systemStatus: false,
      apiDocumentation: false,
    }

    try {
      // Test basic connectivity
      const healthResult = await this.testConnection()
      details.canConnect = true
      details.healthEndpoint = healthResult.success

      // Test system status endpoint
      try {
        const statusResult = await this.getSystemStatus()
        details.systemStatus = statusResult.success
      } catch (e) {
        // System status failed but connection works
      }

      // Test API documentation endpoint
      try {
        const docsResponse = await fetch(`${this.baseUrl}/docs`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000),
        })
        details.apiDocumentation = docsResponse.ok
      } catch (e) {
        // Docs endpoint failed
      }

      const responseTime = Date.now() - startTime
      const overallSuccess = details.canConnect && details.healthEndpoint

      return {
        success: overallSuccess,
        responseTime,
        details,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        details,
      }
    }
  }

  /**
   * Get current configuration
   */
  getConfiguration(): {
    baseUrl: string
    timeout: number
    maxRetries: number
    retryDelay: number
    wsUrl: string
    debugMode: boolean
  } {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
      wsUrl: process.env.BOT_MICROSERVICE_WS_URL || 'ws://localhost:8000/ws/trades',
      debugMode:
        process.env.NODE_ENV === 'development' || process.env.BOT_MICROSERVICE_DEBUG === 'true',
    }
  }
}

// Export a singleton instance
export const botMicroservice = new BotMicroserviceIntegration()

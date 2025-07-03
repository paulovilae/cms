/**
 * Real-Time Data Synchronization Service
 *
 * Manages WebSocket connections for real-time updates from the Python trading microservice
 * and synchronizes data with Payload CMS collections.
 */

import { botMicroservice, type TradeData, type BotStatus } from './botMicroservice'

export interface WebSocketMessage {
  type:
    | 'trade_update'
    | 'bot_status_update'
    | 'system_status_update'
    | 'market_data_update'
    | 'error'
  data: any
  timestamp: string
}

export interface SyncOptions {
  autoReconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  enableLogging?: boolean
}

export interface ConnectionStatus {
  isConnected: boolean
  lastConnected?: Date
  lastDisconnected?: Date
  reconnectAttempts: number
  error?: string
}

export class RealTimeDataSync {
  private wsConnection: WebSocket | null = null
  private wsUrl: string
  private options: Required<SyncOptions>
  private connectionStatus: ConnectionStatus
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map()

  constructor(options: SyncOptions = {}) {
    this.wsUrl = process.env.BOT_MICROSERVICE_WS_URL || 'ws://localhost:8000/ws/trades'
    this.options = {
      autoReconnect: options.autoReconnect ?? true,
      reconnectInterval: options.reconnectInterval ?? 5000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
      enableLogging: options.enableLogging ?? true,
    }

    this.connectionStatus = {
      isConnected: false,
      reconnectAttempts: 0,
    }
  }

  /**
   * Start the real-time synchronization
   */
  async startSync(): Promise<void> {
    try {
      await this.connect()
      this.log('Real-time sync started successfully')
    } catch (error) {
      this.log('Failed to start real-time sync:', error)
      throw error
    }
  }

  /**
   * Stop the real-time synchronization
   */
  async stopSync(): Promise<void> {
    this.disconnect()
    this.log('Real-time sync stopped')
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus }
  }

  /**
   * Add event listener for specific message types
   */
  addEventListener(eventType: string, callback: (...args: any[]) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType)!.push(callback)
  }

  /**
   * Remove event listener
   */
  removeEventListener(eventType: string, callback: (...args: any[]) => void): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Establish WebSocket connection
   */
  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.wsConnection = new WebSocket(this.wsUrl)

        this.wsConnection.onopen = () => {
          this.connectionStatus.isConnected = true
          this.connectionStatus.lastConnected = new Date()
          this.connectionStatus.reconnectAttempts = 0
          this.connectionStatus.error = undefined

          this.startHeartbeat()
          this.log('WebSocket connected successfully')
          this.emit('connected', this.connectionStatus)
          resolve()
        }

        this.wsConnection.onmessage = (event) => {
          this.handleMessage(event)
        }

        this.wsConnection.onclose = (event) => {
          this.handleDisconnection(event)
        }

        this.wsConnection.onerror = (error) => {
          this.log('WebSocket error:', error)
          this.connectionStatus.error = 'WebSocket connection error'
          this.emit('error', error)
          reject(error)
        }

        // Connection timeout
        setTimeout(() => {
          if (this.wsConnection?.readyState !== WebSocket.OPEN) {
            this.wsConnection?.close()
            reject(new Error('Connection timeout'))
          }
        }, 10000)
      } catch (error) {
        this.log('Failed to create WebSocket connection:', error)
        reject(error)
      }
    })
  }

  /**
   * Disconnect WebSocket
   */
  private disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    if (this.wsConnection) {
      this.wsConnection.close()
      this.wsConnection = null
    }

    this.connectionStatus.isConnected = false
    this.connectionStatus.lastDisconnected = new Date()
  }

  /**
   * Handle incoming WebSocket messages
   */
  private async handleMessage(event: MessageEvent): Promise<void> {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)

      this.log('Received message:', message.type)
      this.emit('message', message)

      switch (message.type) {
        case 'trade_update':
          await this.syncTradeData(message.data)
          break
        case 'bot_status_update':
          await this.syncBotStatus(message.data)
          break
        case 'system_status_update':
          await this.syncSystemStatus(message.data)
          break
        case 'market_data_update':
          await this.syncMarketData(message.data)
          break
        case 'error':
          this.log('Received error message:', message.data)
          this.emit('error', message.data)
          break
        default:
          this.log('Unknown message type:', message.type)
      }
    } catch (error) {
      this.log('Error handling message:', error)
      this.emit('error', error)
    }
  }

  /**
   * Handle WebSocket disconnection
   */
  private handleDisconnection(event: CloseEvent): void {
    this.connectionStatus.isConnected = false
    this.connectionStatus.lastDisconnected = new Date()

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    this.log(`WebSocket disconnected: ${event.code} - ${event.reason}`)
    this.emit('disconnected', { code: event.code, reason: event.reason })

    // Auto-reconnect if enabled
    if (
      this.options.autoReconnect &&
      this.connectionStatus.reconnectAttempts < this.options.maxReconnectAttempts
    ) {
      this.scheduleReconnect()
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.connectionStatus.reconnectAttempts++
    const delay =
      this.options.reconnectInterval *
      Math.pow(2, Math.min(this.connectionStatus.reconnectAttempts - 1, 5))

    this.log(
      `Scheduling reconnect attempt ${this.connectionStatus.reconnectAttempts} in ${delay}ms`,
    )

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect()
      } catch (error) {
        this.log('Reconnection failed:', error)
        if (this.connectionStatus.reconnectAttempts < this.options.maxReconnectAttempts) {
          this.scheduleReconnect()
        } else {
          this.log('Max reconnection attempts reached')
          this.emit('maxReconnectAttemptsReached', this.connectionStatus)
        }
      }
    }, delay)
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.wsConnection?.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // Send ping every 30 seconds
  }

  /**
   * Sync trade data with Payload CMS
   */
  private async syncTradeData(tradeData: TradeData): Promise<void> {
    try {
      this.log(`Syncing trade data: ${tradeData.id}`)

      // For now, just emit the event - actual Payload integration will be handled
      // when the collections are properly registered in the plugin
      this.emit('tradeSync', tradeData)

      // TODO: Implement actual Payload CMS sync when collections are available
      // This will require proper collection slug registration
    } catch (error) {
      this.log('Error syncing trade data:', error)
      this.emit('syncError', { type: 'trade', data: tradeData, error })
    }
  }

  /**
   * Sync bot status with Payload CMS
   */
  private async syncBotStatus(botData: BotStatus): Promise<void> {
    try {
      this.log(`Syncing bot status: ${botData.id}`)

      // For now, just emit the event - actual Payload integration will be handled
      // when the collections are properly registered in the plugin
      this.emit('botStatusSync', botData)

      // TODO: Implement actual Payload CMS sync when collections are available
    } catch (error) {
      this.log('Error syncing bot status:', error)
      this.emit('syncError', { type: 'bot_status', data: botData, error })
    }
  }

  /**
   * Sync system status
   */
  private async syncSystemStatus(statusData: any): Promise<void> {
    try {
      this.log('System status update:', statusData)
      this.emit('systemStatusSync', statusData)
    } catch (error) {
      this.log('Error syncing system status:', error)
      this.emit('syncError', { type: 'system_status', data: statusData, error })
    }
  }

  /**
   * Sync market data
   */
  private async syncMarketData(marketData: any): Promise<void> {
    try {
      this.log(`Syncing market data: ${marketData.symbol}`)

      // For now, just emit the event - actual Payload integration will be handled
      // when the collections are properly registered in the plugin
      this.emit('marketDataSync', marketData)

      // TODO: Implement actual Payload CMS sync when collections are available
    } catch (error) {
      this.log('Error syncing market data:', error)
      this.emit('syncError', { type: 'market_data', data: marketData, error })
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(eventType: string, data?: any): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          this.log('Error in event listener:', error)
        }
      })
    }
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, ...args: any[]): void {
    if (this.options.enableLogging) {
      console.log(`[RealTimeDataSync] ${message}`, ...args)
    }
  }

  /**
   * Force reconnection
   */
  async reconnect(): Promise<void> {
    this.disconnect()
    this.connectionStatus.reconnectAttempts = 0
    await this.connect()
  }

  /**
   * Send message to microservice
   */
  sendMessage(message: any): boolean {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(message))
      return true
    }
    return false
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.connectionStatus.isConnected && this.wsConnection?.readyState === WebSocket.OPEN
  }
}

// Export a singleton instance
export const realTimeSync = new RealTimeDataSync()

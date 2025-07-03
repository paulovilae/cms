'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { SystemStatusCard } from './SystemStatusCard'
import { ActiveTradesCard } from './ActiveTradesCard'
import { MarketDataCard } from './MarketDataCard'
import { RecentTradesTable } from './RecentTradesTable'

interface LiveTradingData {
  systemStatus: {
    is_running: boolean
    active_bots: number
    total_trades_today: number
    system_health: 'healthy' | 'warning' | 'error'
    last_update: string
  } | null
  activeTrades: any[]
  marketData: Record<string, any>
  recentTrades: any[]
}

interface LiveTradingMonitorProps {
  refreshInterval?: number
  className?: string
}

export const LiveTradingMonitor: React.FC<LiveTradingMonitorProps> = ({
  refreshInterval = 5000,
  className = '',
}) => {
  const [data, setData] = useState<LiveTradingData>({
    systemStatus: null,
    activeTrades: [],
    marketData: {},
    recentTrades: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchLiveData = useCallback(async () => {
    try {
      setError(null)

      const [systemResponse, tradesResponse, marketResponse, recentResponse] =
        await Promise.allSettled([
          fetch('/api/latinos/system/status'),
          fetch('/api/latinos/trades/active'),
          fetch('/api/latinos/market-data'),
          fetch('/api/latinos/trades/recent'),
        ])

      const newData: LiveTradingData = {
        systemStatus: null,
        activeTrades: [],
        marketData: {},
        recentTrades: [],
      }

      // Process system status
      if (systemResponse.status === 'fulfilled' && systemResponse.value.ok) {
        const systemData = await systemResponse.value.json()
        newData.systemStatus = systemData.data || systemData
      }

      // Process active trades
      if (tradesResponse.status === 'fulfilled' && tradesResponse.value.ok) {
        const tradesData = await tradesResponse.value.json()
        newData.activeTrades = tradesData.data || tradesData.docs || []
      }

      // Process market data
      if (marketResponse.status === 'fulfilled' && marketResponse.value.ok) {
        const marketData = await marketResponse.value.json()
        newData.marketData = marketData.data || {}
      }

      // Process recent trades
      if (recentResponse.status === 'fulfilled' && recentResponse.value.ok) {
        const recentData = await recentResponse.value.json()
        newData.recentTrades = recentData.data || recentData.docs || []
      }

      setData(newData)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (err) {
      console.error('Error fetching live trading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch trading data')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchLiveData()

    // Set up interval for real-time updates
    const interval = setInterval(fetchLiveData, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchLiveData, refreshInterval])

  const handleRefresh = () => {
    setLoading(true)
    fetchLiveData()
  }

  if (loading && !data.systemStatus) {
    return (
      <div className={`live-trading-monitor ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading trading data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`live-trading-monitor space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Trading Monitor</h2>
          {lastUpdate && (
            <p className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading trading data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SystemStatusCard status={data.systemStatus} loading={loading} />
        <ActiveTradesCard trades={data.activeTrades} loading={loading} />
        <MarketDataCard data={data.marketData} loading={loading} />
      </div>

      {/* Recent Trades Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Trades</h3>
          <RecentTradesTable trades={data.recentTrades} loading={loading} />
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Auto-refreshing every {refreshInterval / 1000} seconds</span>
        </div>
      </div>
    </div>
  )
}

export default LiveTradingMonitor

/**
 * Custom React hook for fetching and managing trade data
 *
 * Provides a centralized way to manage trade data state, including
 * fetching active trades, recent trades, and trade history with
 * real-time updates and filtering capabilities.
 */

import { useState, useEffect, useCallback } from 'react'

export interface Trade {
  id: string
  bot: {
    id: string
    name: string
  }
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  status: 'open' | 'filled' | 'cancelled' | 'expired' | 'rejected'
  stopLoss?: number
  takeProfit?: number
  filledAt?: string
  profit?: number
  isSuccessful?: boolean
  microserviceTradeId?: string
  createdAt: string
  updatedAt: string
}

export interface TradeFilters {
  botId?: string
  symbol?: string
  side?: 'buy' | 'sell'
  status?: string
  dateFrom?: string
  dateTo?: string
}

export interface TradeStats {
  totalTrades: number
  activeTrades: number
  successfulTrades: number
  totalProfit: number
  totalVolume: number
  averageProfit: number
  winRate: number
  bestTrade: Trade | null
  worstTrade: Trade | null
}

export interface UseTradeDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  initialFetch?: boolean
  filters?: TradeFilters
}

export interface UseTradeDataReturn {
  // Data state
  trades: Trade[]
  activeTrades: Trade[]
  recentTrades: Trade[]
  filteredTrades: Trade[]

  // Loading states
  loading: boolean
  refreshing: boolean

  // Error state
  error: string | null

  // Actions
  fetchTrades: () => Promise<void>
  fetchActiveTrades: () => Promise<void>
  fetchRecentTrades: () => Promise<void>
  fetchTradesByBot: (botId: string) => Promise<void>
  setFilters: (filters: TradeFilters) => void
  clearFilters: () => void
  clearError: () => void
  refresh: () => Promise<void>

  // Computed values
  stats: TradeStats
  filters: TradeFilters
}

export const useTradeData = (options: UseTradeDataOptions = {}): UseTradeDataReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 10000, // 10 seconds for trades (more frequent than bots)
    initialFetch = true,
    filters: initialFilters = {},
  } = options

  // State
  const [trades, setTrades] = useState<Trade[]>([])
  const [activeTrades, setActiveTrades] = useState<Trade[]>([])
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<TradeFilters>(initialFilters)

  // Fetch all trades
  const fetchTrades = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/latinos/trades')

      if (!response.ok) {
        throw new Error(`Failed to fetch trades: ${response.statusText}`)
      }

      const data = await response.json()
      setTrades(data.docs || data)
    } catch (err) {
      console.error('Error fetching trades:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch trades')
    }
  }, [])

  // Fetch active trades
  const fetchActiveTrades = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/latinos/trades/active')

      if (!response.ok) {
        throw new Error(`Failed to fetch active trades: ${response.statusText}`)
      }

      const data = await response.json()
      setActiveTrades(data.docs || data)
    } catch (err) {
      console.error('Error fetching active trades:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch active trades')
    }
  }, [])

  // Fetch recent trades
  const fetchRecentTrades = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/latinos/trades/recent')

      if (!response.ok) {
        throw new Error(`Failed to fetch recent trades: ${response.statusText}`)
      }

      const data = await response.json()
      setRecentTrades(data.docs || data)
    } catch (err) {
      console.error('Error fetching recent trades:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch recent trades')
    }
  }, [])

  // Fetch trades for a specific bot
  const fetchTradesByBot = useCallback(async (botId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/latinos/trades?botId=${botId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch bot trades: ${response.statusText}`)
      }

      const data = await response.json()
      setTrades(data.docs || data)
    } catch (err) {
      console.error('Error fetching bot trades:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch bot trades')
    }
  }, [])

  // Set filters
  const setFilters = useCallback((newFilters: TradeFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({})
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Refresh all data
  const refresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([fetchTrades(), fetchActiveTrades(), fetchRecentTrades()])
    setRefreshing(false)
  }, [fetchTrades, fetchActiveTrades, fetchRecentTrades])

  // Filter trades based on current filters
  const filteredTrades = trades.filter((trade) => {
    if (filters.botId && trade.bot.id !== filters.botId) return false
    if (filters.symbol && trade.symbol !== filters.symbol) return false
    if (filters.side && trade.side !== filters.side) return false
    if (filters.status && trade.status !== filters.status) return false

    if (filters.dateFrom) {
      const tradeDate = new Date(trade.createdAt)
      const fromDate = new Date(filters.dateFrom)
      if (tradeDate < fromDate) return false
    }

    if (filters.dateTo) {
      const tradeDate = new Date(trade.createdAt)
      const toDate = new Date(filters.dateTo)
      if (tradeDate > toDate) return false
    }

    return true
  })

  // Calculate trade statistics
  const stats: TradeStats = {
    totalTrades: filteredTrades.length,
    activeTrades: filteredTrades.filter((trade) => trade.status === 'open').length,
    successfulTrades: filteredTrades.filter((trade) => trade.isSuccessful).length,
    totalProfit: filteredTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0),
    totalVolume: filteredTrades.reduce((sum, trade) => sum + trade.quantity * trade.price, 0),
    averageProfit: 0,
    winRate: 0,
    bestTrade: null,
    worstTrade: null,
  }

  // Calculate derived stats
  if (stats.totalTrades > 0) {
    stats.averageProfit = stats.totalProfit / stats.totalTrades
    stats.winRate = (stats.successfulTrades / stats.totalTrades) * 100

    // Find best and worst trades
    const tradesWithProfit = filteredTrades.filter((trade) => trade.profit !== undefined)
    if (tradesWithProfit.length > 0) {
      stats.bestTrade = tradesWithProfit.reduce((best, trade) =>
        (trade.profit || 0) > (best.profit || 0) ? trade : best,
      )
      stats.worstTrade = tradesWithProfit.reduce((worst, trade) =>
        (trade.profit || 0) < (worst.profit || 0) ? trade : worst,
      )
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (initialFetch) {
      setLoading(true)
      refresh().finally(() => setLoading(false))
    }
  }, [initialFetch, refresh])

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refresh])

  return {
    // Data state
    trades,
    activeTrades,
    recentTrades,
    filteredTrades,

    // Loading states
    loading,
    refreshing,

    // Error state
    error,

    // Actions
    fetchTrades,
    fetchActiveTrades,
    fetchRecentTrades,
    fetchTradesByBot,
    setFilters,
    clearFilters,
    clearError,
    refresh,

    // Computed values
    stats,
    filters,
  }
}

export default useTradeData

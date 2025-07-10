/**
 * Custom React hook for fetching and managing bot data
 *
 * Provides a centralized way to manage bot data state, including
 * fetching, creating, updating, and deleting bots with proper
 * error handling and loading states.
 */

import { useState, useEffect, useCallback } from 'react'
import { createBusinessHeaders } from '../../../../utilities/businessContext'

export interface Bot {
  id: string
  name: string
  status: 'active' | 'paused' | 'stopped' | 'error'
  strategy: {
    id: string
    name: string
  }
  symbol: string
  exchange: string
  investmentAmount: number
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  maxDailyTrades: number
  stopLossPercentage: number
  takeProfitPercentage: number
  totalTrades: number
  successfulTrades: number
  totalProfit: number
  lastExecution?: string
  microserviceId?: string
  createdAt: string
  updatedAt: string
}

export interface Strategy {
  id: string
  name: string
  type: string
  description: string
  riskProfile: string
  defaultParameters?: Record<string, any>
}

export interface UseBotDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  initialFetch?: boolean
}

export interface UseBotDataReturn {
  // Data state
  bots: Bot[]
  strategies: Strategy[]
  selectedBot: Bot | null

  // Loading states
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean

  // Error state
  error: string | null

  // Actions
  fetchBots: () => Promise<void>
  fetchStrategies: () => Promise<void>
  createBot: (botData: Partial<Bot>) => Promise<Bot | null>
  updateBot: (botId: string, updates: Partial<Bot>) => Promise<Bot | null>
  deleteBot: (botId: string) => Promise<boolean>
  selectBot: (bot: Bot | null) => void
  clearError: () => void
  refresh: () => Promise<void>

  // Computed values
  activeBots: Bot[]
  totalProfit: number
  totalTrades: number
  successRate: number
}

export const useBotData = (options: UseBotDataOptions = {}): UseBotDataReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    initialFetch = true,
  } = options

  // State
  const [bots, setBots] = useState<Bot[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch bots from API
  const fetchBots = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/bots', {
        headers: createBusinessHeaders('latinos'),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch bots: ${response.statusText}`)
      }

      const data = await response.json()
      const botsData = data.docs || data
      setBots(botsData)

      // Update selected bot if it exists in the new data
      if (selectedBot) {
        const updatedSelectedBot = botsData.find((bot: Bot) => bot.id === selectedBot.id)
        if (updatedSelectedBot) {
          setSelectedBot(updatedSelectedBot)
        } else {
          setSelectedBot(null)
        }
      }
    } catch (err) {
      console.error('Error fetching bots:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch bots')
    }
  }, [selectedBot])

  // Fetch strategies from API
  const fetchStrategies = useCallback(async () => {
    try {
      const response = await fetch('/api/trading-strategies')

      if (!response.ok) {
        throw new Error(`Failed to fetch strategies: ${response.statusText}`)
      }

      const data = await response.json()
      setStrategies(data.docs || data)
    } catch (err) {
      console.error('Error fetching strategies:', err)
      // Don't set error for strategies as it's not critical
    }
  }, [])

  // Create a new bot
  const createBot = useCallback(async (botData: Partial<Bot>): Promise<Bot | null> => {
    try {
      setCreating(true)
      setError(null)

      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: createBusinessHeaders('latinos'),
        body: JSON.stringify(botData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create bot')
      }

      const newBot = await response.json()
      setBots((prev) => [...prev, newBot])
      return newBot
    } catch (err) {
      console.error('Error creating bot:', err)
      setError(err instanceof Error ? err.message : 'Failed to create bot')
      return null
    } finally {
      setCreating(false)
    }
  }, [])

  // Update an existing bot
  const updateBot = useCallback(
    async (botId: string, updates: Partial<Bot>): Promise<Bot | null> => {
      try {
        setUpdating(true)
        setError(null)

        const response = await fetch(`/api/bots/${botId}`, {
          method: 'PATCH',
          headers: createBusinessHeaders('latinos'),
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update bot')
        }

        const updatedBot = await response.json()
        setBots((prev) => prev.map((bot) => (bot.id === botId ? updatedBot : bot)))

        if (selectedBot?.id === botId) {
          setSelectedBot(updatedBot)
        }

        return updatedBot
      } catch (err) {
        console.error('Error updating bot:', err)
        setError(err instanceof Error ? err.message : 'Failed to update bot')
        return null
      } finally {
        setUpdating(false)
      }
    },
    [selectedBot],
  )

  // Delete a bot
  const deleteBot = useCallback(
    async (botId: string): Promise<boolean> => {
      try {
        setDeleting(true)
        setError(null)

        const response = await fetch(`/api/bots/${botId}`, {
          method: 'DELETE',
          headers: createBusinessHeaders('latinos'),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to delete bot')
        }

        setBots((prev) => prev.filter((bot) => bot.id !== botId))

        if (selectedBot?.id === botId) {
          setSelectedBot(null)
        }

        return true
      } catch (err) {
        console.error('Error deleting bot:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete bot')
        return false
      } finally {
        setDeleting(false)
      }
    },
    [selectedBot],
  )

  // Select a bot
  const selectBot = useCallback((bot: Bot | null) => {
    setSelectedBot(bot)
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Refresh all data
  const refresh = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchBots(), fetchStrategies()])
    setLoading(false)
  }, [fetchBots, fetchStrategies])

  // Computed values
  const activeBots = bots.filter((bot) => bot.status === 'active')
  const totalProfit = bots.reduce((sum, bot) => sum + bot.totalProfit, 0)
  const totalTrades = bots.reduce((sum, bot) => sum + bot.totalTrades, 0)
  const totalSuccessfulTrades = bots.reduce((sum, bot) => sum + bot.successfulTrades, 0)
  const successRate = totalTrades > 0 ? (totalSuccessfulTrades / totalTrades) * 100 : 0

  // Initial data fetch
  useEffect(() => {
    if (initialFetch) {
      refresh()
    }
  }, [initialFetch, refresh])

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchBots() // Only refresh bots, strategies don't change often
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchBots])

  return {
    // Data state
    bots,
    strategies,
    selectedBot,

    // Loading states
    loading,
    creating,
    updating,
    deleting,

    // Error state
    error,

    // Actions
    fetchBots,
    fetchStrategies,
    createBot,
    updateBot,
    deleteBot,
    selectBot,
    clearError,
    refresh,

    // Computed values
    activeBots,
    totalProfit,
    totalTrades,
    successRate,
  }
}

export default useBotData

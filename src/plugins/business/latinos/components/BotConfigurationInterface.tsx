'use client'

import React, { useState } from 'react'
import { useBotData } from '../hooks/useBotData'
import { useTradeData } from '../hooks/useTradeData'
import { BotsList } from './BotsList'
import { BotDetailsPanel } from './BotDetailsPanel'
import { BotCreationModal } from './BotCreationModal'
import { PerformanceCharts } from './PerformanceCharts'

interface BotConfigurationInterfaceProps {
  className?: string
  showCharts?: boolean
}

export const BotConfigurationInterface: React.FC<BotConfigurationInterfaceProps> = ({
  className = '',
  showCharts = true,
}) => {
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState<'bots' | 'charts'>('bots')

  // Use custom hooks for data management
  const {
    bots,
    strategies,
    selectedBot,
    loading,
    creating,
    updating,
    deleting,
    error,
    createBot,
    updateBot,
    deleteBot,
    selectBot,
    clearError,
  } = useBotData({ autoRefresh: true, refreshInterval: 30000 })

  const {
    trades,
    recentTrades,
    loading: tradesLoading,
  } = useTradeData({ autoRefresh: true, refreshInterval: 10000 })

  const handleCreateBot = async (botData: any) => {
    const result = await createBot(botData)
    if (result) {
      setIsCreating(false)
    }
    return result
  }

  const handleUpdateBot = async (botId: string, updates: any) => {
    return await updateBot(botId, updates)
  }

  const handleDeleteBot = async (botId: string) => {
    return await deleteBot(botId)
  }

  if (loading) {
    return (
      <div className={`bot-configuration ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bot-configuration space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trading Bots</h2>
          <p className="text-sm text-gray-500">Manage your automated trading bots and strategies</p>
        </div>
        <div className="flex items-center space-x-4">
          {showCharts && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('bots')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'bots'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bots
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'charts'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
            </div>
          )}
          <button
            onClick={() => setIsCreating(true)}
            disabled={creating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Bot
          </button>
        </div>
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
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={clearError} className="text-red-400 hover:text-red-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeTab === 'bots' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bots List */}
          <BotsList
            bots={bots}
            selectedBot={selectedBot}
            onSelect={selectBot}
            onUpdate={handleUpdateBot}
            onDelete={handleDeleteBot}
            loading={loading}
          />

          {/* Bot Details Panel */}
          <BotDetailsPanel
            bot={selectedBot}
            strategies={strategies}
            recentTrades={recentTrades.filter((trade) =>
              selectedBot ? trade.bot.id === selectedBot.id : false,
            )}
            onUpdate={handleUpdateBot}
            onDelete={handleDeleteBot}
            loading={updating || deleting}
          />
        </div>
      ) : (
        /* Performance Charts */
        <PerformanceCharts bots={bots} trades={trades} timeframe="30d" />
      )}

      {/* Bot Creation Modal */}
      <BotCreationModal
        strategies={strategies}
        onSubmit={handleCreateBot}
        onCancel={() => setIsCreating(false)}
        isOpen={isCreating}
        loading={creating}
      />
    </div>
  )
}

export default BotConfigurationInterface

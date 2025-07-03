/**
 * BotDetailsPanel Component
 *
 * Displays detailed information about a selected bot, including performance
 * metrics, configuration settings, and recent activity. Provides inline
 * editing capabilities for bot configuration.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Bot, Strategy } from '../hooks/useBotData'
import { Trade } from '../hooks/useTradeData'
import {
  formatCurrency,
  formatBotStatus,
  formatRiskLevel,
  formatPercentage,
  formatDateTime,
  formatWinRate,
  formatRelativeTime,
} from '../utils/formatting'

interface BotDetailsPanelProps {
  bot: Bot | null
  strategies?: Strategy[]
  recentTrades?: Trade[]
  onUpdate?: (botId: string, updates: Partial<Bot>) => void
  onDelete?: (botId: string) => void
  loading?: boolean
  className?: string
}

export const BotDetailsPanel: React.FC<BotDetailsPanelProps> = ({
  bot,
  strategies = [],
  recentTrades = [],
  onUpdate,
  onDelete,
  loading = false,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Bot>>({})
  const [saving, setSaving] = useState(false)

  // Update edit data when bot changes
  useEffect(() => {
    if (bot) {
      setEditData({
        name: bot.name,
        symbol: bot.symbol,
        exchange: bot.exchange,
        investmentAmount: bot.investmentAmount,
        riskLevel: bot.riskLevel,
        maxDailyTrades: bot.maxDailyTrades,
        stopLossPercentage: bot.stopLossPercentage,
        takeProfitPercentage: bot.takeProfitPercentage,
        strategy: bot.strategy,
      })
    }
  }, [bot])

  const handleSave = async () => {
    if (!bot || !onUpdate) return

    setSaving(true)
    try {
      await onUpdate(bot.id, editData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating bot:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (bot) {
      setEditData({
        name: bot.name,
        symbol: bot.symbol,
        exchange: bot.exchange,
        investmentAmount: bot.investmentAmount,
        riskLevel: bot.riskLevel,
        maxDailyTrades: bot.maxDailyTrades,
        stopLossPercentage: bot.stopLossPercentage,
        takeProfitPercentage: bot.takeProfitPercentage,
        strategy: bot.strategy,
      })
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!bot || !onDelete) return

    if (
      window.confirm(`Are you sure you want to delete "${bot.name}"? This action cannot be undone.`)
    ) {
      await onDelete(bot.id)
    }
  }

  if (loading) {
    return (
      <div className={`bot-details-panel ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!bot) {
    return (
      <div className={`bot-details-panel ${className}`}>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Select a bot</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose a bot from the list to view and edit its configuration.
          </p>
        </div>
      </div>
    )
  }

  const statusInfo = formatBotStatus(bot.status)
  const riskInfo = formatRiskLevel(bot.riskLevel)
  const winRate = formatWinRate(bot.successfulTrades, bot.totalTrades)

  return (
    <div className={`bot-details-panel space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${statusInfo.dotColor}`}></div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{bot.name}</h3>
            <p className="text-sm text-gray-500">Created {formatRelativeTime(bot.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status and Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className} mt-1`}
              >
                {statusInfo.label}
              </span>
            </div>
            <div className={`w-8 h-8 rounded-full ${statusInfo.dotColor}`}></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Profit</p>
              <p
                className={`text-lg font-semibold ${bot.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {formatCurrency(bot.totalProfit)}
              </p>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${bot.totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}
            >
              {bot.totalProfit >= 0 ? (
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Win Rate</p>
              <p className="text-lg font-semibold text-gray-900">{winRate}</p>
              <p className="text-xs text-gray-500">
                {bot.successfulTrades}/{bot.totalTrades} trades
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Configuration</h4>
        </div>
        <div className="px-6 py-4 space-y-6">
          {isEditing ? (
            <EditForm data={editData} onChange={setEditData} strategies={strategies} />
          ) : (
            <ViewConfiguration bot={bot} />
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recentTrades.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Recent Trades</h4>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {recentTrades.slice(0, 5).map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${trade.side === 'buy' ? 'bg-green-400' : 'bg-red-400'}`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {trade.side.toUpperCase()} {trade.symbol}
                      </p>
                      <p className="text-xs text-gray-500">{formatDateTime(trade.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(trade.quantity * trade.price)}
                    </p>
                    {trade.profit !== undefined && (
                      <p
                        className={`text-xs ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {trade.profit >= 0 ? '+' : ''}
                        {formatCurrency(trade.profit)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// View Configuration Component
const ViewConfiguration: React.FC<{ bot: Bot }> = ({ bot }) => {
  const riskInfo = formatRiskLevel(bot.riskLevel)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Trading Symbol</label>
          <p className="mt-1 text-sm text-gray-900">{bot.symbol}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Exchange</label>
          <p className="mt-1 text-sm text-gray-900">{bot.exchange}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Investment Amount</label>
          <p className="mt-1 text-sm text-gray-900">{formatCurrency(bot.investmentAmount)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Risk Level</label>
          <p className={`mt-1 text-sm font-medium ${riskInfo.className}`}>{riskInfo.label}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Max Daily Trades</label>
          <p className="mt-1 text-sm text-gray-900">{bot.maxDailyTrades}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Stop Loss</label>
          <p className="mt-1 text-sm text-gray-900">
            {formatPercentage(bot.stopLossPercentage, 1, false)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Take Profit</label>
          <p className="mt-1 text-sm text-gray-900">
            {formatPercentage(bot.takeProfitPercentage, 1, false)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Strategy</label>
          <p className="mt-1 text-sm text-gray-900">
            {bot.strategy?.name || 'No strategy selected'}
          </p>
        </div>
      </div>
    </div>
  )
}

// Edit Form Component
const EditForm: React.FC<{
  data: Partial<Bot>
  onChange: (data: Partial<Bot>) => void
  strategies: Strategy[]
}> = ({ data, onChange, strategies }) => {
  const handleChange = (field: keyof Bot, value: any) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bot Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trading Symbol</label>
          <input
            type="text"
            value={data.symbol || ''}
            onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Exchange</label>
          <select
            value={data.exchange || ''}
            onChange={(e) => handleChange('exchange', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSE">NYSE</option>
            <option value="AMEX">AMEX</option>
            <option value="CRYPTO">Crypto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
          <input
            type="number"
            min="100"
            step="100"
            value={data.investmentAmount || ''}
            onChange={(e) => handleChange('investmentAmount', parseFloat(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Risk Level</label>
          <select
            value={data.riskLevel || ''}
            onChange={(e) => handleChange('riskLevel', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Daily Trades</label>
          <input
            type="number"
            min="1"
            max="50"
            value={data.maxDailyTrades || ''}
            onChange={(e) => handleChange('maxDailyTrades', parseInt(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stop Loss (%)</label>
          <input
            type="number"
            min="1"
            max="20"
            step="0.1"
            value={data.stopLossPercentage || ''}
            onChange={(e) => handleChange('stopLossPercentage', parseFloat(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Take Profit (%)</label>
          <input
            type="number"
            min="2"
            max="50"
            step="0.1"
            value={data.takeProfitPercentage || ''}
            onChange={(e) => handleChange('takeProfitPercentage', parseFloat(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default BotDetailsPanel

/**
 * BotsList Component
 *
 * Displays a list of trading bots with status indicators and action buttons.
 * Provides filtering, sorting, and quick actions for bot management.
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Bot } from '../hooks/useBotData'
import {
  formatCurrency,
  formatBotStatus,
  formatRiskLevel,
  formatRelativeTime,
} from '../utils/formatting'

interface BotsListProps {
  bots: Bot[]
  selectedBot?: Bot | null
  onSelect?: (bot: Bot) => void
  onUpdate?: (botId: string, updates: Partial<Bot>) => void
  onDelete?: (botId: string) => void
  loading?: boolean
  className?: string
}

type SortField = 'name' | 'status' | 'symbol' | 'totalProfit' | 'totalTrades' | 'lastExecution'
type SortDirection = 'asc' | 'desc'

export const BotsList: React.FC<BotsListProps> = ({
  bots,
  selectedBot,
  onSelect,
  onUpdate,
  onDelete,
  loading = false,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Filter and sort bots
  const filteredAndSortedBots = useMemo(() => {
    const filtered = bots.filter((bot) => {
      const matchesSearch =
        bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || bot.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort bots
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle special cases
      if (sortField === 'lastExecution') {
        aValue = a.lastExecution ? new Date(a.lastExecution).getTime() : 0
        bValue = b.lastExecution ? new Date(b.lastExecution).getTime() : 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [bots, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleStatusToggle = async (bot: Bot) => {
    if (!onUpdate) return

    const newStatus = bot.status === 'active' ? 'stopped' : 'active'
    await onUpdate(bot.id, { status: newStatus })
  }

  const handleDelete = async (bot: Bot) => {
    if (!onDelete) return

    if (
      window.confirm(`Are you sure you want to delete "${bot.name}"? This action cannot be undone.`)
    ) {
      await onDelete(bot.id)
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      )
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
        />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className={`bots-list ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bots-list space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Trading Bots ({filteredAndSortedBots.length})
        </h3>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search bots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="stopped">Stopped</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Bots List */}
      {filteredAndSortedBots.length === 0 ? (
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
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bots found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first trading bot.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {/* Table Header */}
          <div className="hidden sm:block">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Bot</span>
                    {getSortIcon('name')}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Status</span>
                    {getSortIcon('status')}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Symbol</span>
                    {getSortIcon('symbol')}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort('totalProfit')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Profit</span>
                    {getSortIcon('totalProfit')}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort('totalTrades')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Trades</span>
                    {getSortIcon('totalTrades')}
                  </button>
                </div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
          </div>

          {/* Bot Items */}
          <ul className="divide-y divide-gray-200">
            {filteredAndSortedBots.map((bot) => {
              const statusInfo = formatBotStatus(bot.status)
              const riskInfo = formatRiskLevel(bot.riskLevel)
              const isSelected = selectedBot?.id === bot.id

              return (
                <li
                  key={bot.id}
                  className={`${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                  } transition-colors duration-150`}
                >
                  <div className="px-6 py-4">
                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <button onClick={() => onSelect?.(bot)} className="text-left flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor}`}></div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{bot.name}</h4>
                              <p className="text-sm text-gray-500">
                                {bot.symbol} • {riskInfo.label}
                              </p>
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center space-x-2">
                          <BotActionButtons
                            bot={bot}
                            onStatusToggle={handleStatusToggle}
                            onDelete={handleDelete}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                        <div className="text-right">
                          <div
                            className={`font-medium ${bot.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {formatCurrency(bot.totalProfit)}
                          </div>
                          <div className="text-gray-500">{bot.totalTrades} trades</div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <button onClick={() => onSelect?.(bot)} className="text-left w-full">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor}`}></div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{bot.name}</h4>
                                <p className="text-sm text-gray-500">{riskInfo.label}</p>
                              </div>
                            </div>
                          </button>
                        </div>
                        <div className="col-span-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-gray-900">{bot.symbol}</div>
                          <div className="text-sm text-gray-500">{bot.exchange}</div>
                        </div>
                        <div className="col-span-2">
                          <div
                            className={`text-sm font-medium ${bot.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {formatCurrency(bot.totalProfit)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bot.successfulTrades}/{bot.totalTrades} wins
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-gray-900">{bot.totalTrades}</div>
                          <div className="text-sm text-gray-500">
                            {bot.lastExecution ? formatRelativeTime(bot.lastExecution) : 'Never'}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <BotActionButtons
                            bot={bot}
                            onStatusToggle={handleStatusToggle}
                            onDelete={handleDelete}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

// Bot Action Buttons Component
const BotActionButtons: React.FC<{
  bot: Bot
  onStatusToggle: (bot: Bot) => void
  onDelete: (bot: Bot) => void
}> = ({ bot, onStatusToggle, onDelete }) => {
  return (
    <div className="flex items-center space-x-1">
      {/* Start/Stop Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onStatusToggle(bot)
        }}
        className={`p-1 rounded-full ${
          bot.status === 'active'
            ? 'text-red-600 hover:bg-red-100'
            : 'text-green-600 hover:bg-green-100'
        }`}
        title={bot.status === 'active' ? 'Stop Bot' : 'Start Bot'}
      >
        {bot.status === 'active' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a3 3 0 003-3V7a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        )}
      </button>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(bot)
        }}
        className="p-1 rounded-full text-red-600 hover:bg-red-100"
        title="Delete Bot"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}

export default BotsList

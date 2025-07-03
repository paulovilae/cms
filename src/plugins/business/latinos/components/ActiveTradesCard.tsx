'use client'

import React from 'react'

interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  status: 'open' | 'filled' | 'cancelled' | 'expired' | 'rejected'
  profit?: number
  bot?: {
    name: string
  }
}

interface ActiveTradesCardProps {
  trades: Trade[]
  loading?: boolean
  className?: string
}

export const ActiveTradesCard: React.FC<ActiveTradesCardProps> = ({
  trades,
  loading = false,
  className = '',
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'filled':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'expired':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSideColor = (side: string) => {
    return side === 'buy' ? 'text-green-600' : 'text-red-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const activeTrades = trades.filter((trade) => trade.status === 'open')
  const totalValue = activeTrades.reduce((sum, trade) => sum + trade.quantity * trade.price, 0)

  if (loading) {
    return (
      <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Active Trades</dt>
              <dd className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">{activeTrades.length}</span>
                <span className="ml-2 text-sm font-medium text-gray-500">
                  of {trades.length} total
                </span>
              </dd>
            </dl>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-3">
            Total Value:{' '}
            <span className="font-medium text-gray-900">{formatCurrency(totalValue)}</span>
          </div>

          {activeTrades.length === 0 ? (
            <div className="text-center py-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No active trades</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {activeTrades.slice(0, 5).map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{trade.symbol}</span>
                      <span className={`text-xs font-medium uppercase ${getSideColor(trade.side)}`}>
                        {trade.side}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}
                      >
                        {trade.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Qty: {trade.quantity}</span>
                      <span>Price: {formatCurrency(trade.price)}</span>
                      {trade.bot && <span>Bot: {trade.bot.name}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(trade.quantity * trade.price)}
                    </div>
                    {trade.profit !== undefined && (
                      <div
                        className={`text-xs ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {trade.profit >= 0 ? '+' : ''}
                        {formatCurrency(trade.profit)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {activeTrades.length > 5 && (
                <div className="text-center py-2">
                  <span className="text-xs text-gray-500">
                    +{activeTrades.length - 5} more trades
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActiveTradesCard

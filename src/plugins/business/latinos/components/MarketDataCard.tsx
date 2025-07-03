'use client'

import React from 'react'

interface MarketDataItem {
  symbol: string
  currentPrice: number
  volume?: number
  change24h?: number
  changePercent24h?: number
  high24h?: number
  low24h?: number
  marketCap?: number
  lastUpdated?: string
}

interface MarketDataCardProps {
  data: Record<string, MarketDataItem> | MarketDataItem[]
  loading?: boolean
  className?: string
}

export const MarketDataCard: React.FC<MarketDataCardProps> = ({
  data,
  loading = false,
  className = '',
}) => {
  const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B'
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M'
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }

  const formatPercentage = (percent: number) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  // Convert data to array format
  const marketItems: MarketDataItem[] = Array.isArray(data)
    ? data
    : Object.values(data).filter((item) => item && typeof item === 'object')

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
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Market Data</dt>
              <dd className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">{marketItems.length}</span>
                <span className="ml-2 text-sm font-medium text-gray-500">symbols</span>
              </dd>
            </dl>
          </div>
        </div>

        <div className="mt-4">
          {marketItems.length === 0 ? (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No market data available</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {marketItems.slice(0, 5).map((item, index) => (
                <div
                  key={item.symbol || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{item.symbol}</span>
                      {item.changePercent24h !== undefined && (
                        <span
                          className={`text-xs font-medium ${getChangeColor(item.changePercent24h)}`}
                        >
                          {formatPercentage(item.changePercent24h)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      {item.volume && <span>Vol: {formatNumber(item.volume)}</span>}
                      {item.high24h && <span>H: {formatCurrency(item.high24h)}</span>}
                      {item.low24h && <span>L: {formatCurrency(item.low24h)}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.currentPrice)}
                    </div>
                    {item.change24h !== undefined && (
                      <div className={`text-xs ${getChangeColor(item.change24h)}`}>
                        {item.change24h >= 0 ? '+' : ''}
                        {formatCurrency(item.change24h)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {marketItems.length > 5 && (
                <div className="text-center py-2">
                  <span className="text-xs text-gray-500">
                    +{marketItems.length - 5} more symbols
                  </span>
                </div>
              )}
            </div>
          )}

          {marketItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Avg Change:</span>
                  <span
                    className={`ml-1 font-medium ${getChangeColor(
                      marketItems.reduce((sum, item) => sum + (item.changePercent24h || 0), 0) /
                        marketItems.length,
                    )}`}
                  >
                    {formatPercentage(
                      marketItems.reduce((sum, item) => sum + (item.changePercent24h || 0), 0) /
                        marketItems.length,
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Last Update:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {marketItems[0]?.lastUpdated
                      ? new Date(marketItems[0].lastUpdated).toLocaleTimeString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketDataCard

/**
 * PerformanceCharts Component
 *
 * Data visualization components for displaying trading performance metrics
 * using recharts library. Includes profit/loss charts, trade volume analysis,
 * and performance comparison visualizations.
 */

'use client'

import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Bot } from '../hooks/useBotData'
import { Trade } from '../hooks/useTradeData'
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatting'

interface PerformanceChartsProps {
  bots: Bot[]
  trades: Trade[]
  timeframe?: '24h' | '7d' | '30d' | '90d' | '1y'
  className?: string
}

interface ChartDataPoint {
  date: string
  profit: number
  cumulativeProfit: number
  trades: number
  volume: number
}

interface BotPerformanceData {
  name: string
  profit: number
  trades: number
  winRate: number
  color: string
}

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
]

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  bots,
  trades,
  timeframe = '30d',
  className = '',
}) => {
  // Process data for charts
  const chartData = useMemo(() => {
    const now = new Date()
    const days = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    }[timeframe]

    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    // Filter trades by timeframe
    const filteredTrades = trades
      .filter((trade) => new Date(trade.createdAt) >= startDate)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    // Group trades by date
    const dailyData: Record<string, ChartDataPoint> = {}
    let cumulativeProfit = 0

    filteredTrades.forEach((trade) => {
      const date = formatDate(trade.createdAt)

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          profit: 0,
          cumulativeProfit: 0,
          trades: 0,
          volume: 0,
        }
      }

      dailyData[date].profit += trade.profit || 0
      dailyData[date].trades += 1
      dailyData[date].volume += trade.quantity * trade.price
      cumulativeProfit += trade.profit || 0
      dailyData[date].cumulativeProfit = cumulativeProfit
    })

    return Object.values(dailyData)
  }, [trades, timeframe])

  // Bot performance comparison data
  const botPerformanceData: BotPerformanceData[] = useMemo(() => {
    return bots.map((bot, index) => ({
      name: bot.name,
      profit: bot.totalProfit,
      trades: bot.totalTrades,
      winRate: bot.totalTrades > 0 ? (bot.successfulTrades / bot.totalTrades) * 100 : 0,
      color: COLORS[index % COLORS.length] || '#3B82F6',
    }))
  }, [bots])

  // Trade status distribution
  const tradeStatusData = useMemo(() => {
    const statusCounts = trades.reduce(
      (acc, trade) => {
        acc[trade.status] = (acc[trade.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: COLORS[index % COLORS.length],
    }))
  }, [trades])

  // Custom tooltip components
  const ProfitTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const VolumeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Trades' ? entry.value : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className={`performance-charts ${className}`}>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trading data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start trading to see performance charts and analytics.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`performance-charts space-y-8 ${className}`}>
      {/* Profit/Loss Over Time */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Profit/Loss Over Time</h3>
          <div className="text-sm text-gray-500">
            Last{' '}
            {timeframe === '24h'
              ? '24 hours'
              : timeframe === '7d'
                ? '7 days'
                : timeframe === '30d'
                  ? '30 days'
                  : timeframe === '90d'
                    ? '90 days'
                    : '1 year'}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<ProfitTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulativeProfit"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#profitGradient)"
                name="Cumulative Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Profit/Loss */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Daily Profit/Loss</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<ProfitTooltip />} />
                <Bar dataKey="profit" name="Daily Profit">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trading Volume */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Trading Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                <YAxis
                  yAxisId="trades"
                  orientation="left"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<VolumeTooltip />} />
                <Bar yAxisId="trades" dataKey="trades" fill="#3B82F6" name="Trades" />
                <Bar yAxisId="volume" dataKey="volume" fill="#F59E0B" name="Volume" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bot Performance Comparison */}
      {botPerformanceData.length > 1 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Bot Performance Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={botPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    name === 'profit'
                      ? formatCurrency(value)
                      : name === 'winRate'
                        ? formatPercentage(value, 1, false)
                        : value,
                    name === 'profit'
                      ? 'Total Profit'
                      : name === 'winRate'
                        ? 'Win Rate'
                        : 'Total Trades',
                  ]}
                />
                <Bar dataKey="profit" name="profit">
                  {botPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Trade Status Distribution */}
      {tradeStatusData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Trade Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tradeStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tradeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Win Rate by Bot */}
          {botPerformanceData.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Win Rate by Bot</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={botPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Win Rate']} />
                    <Bar dataKey="winRate" name="Win Rate">
                      {botPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(chartData.reduce((sum, day) => sum + day.profit, 0))}
            </div>
            <div className="text-sm text-gray-500">Total Profit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {chartData.reduce((sum, day) => sum + day.trades, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Trades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(chartData.reduce((sum, day) => sum + day.volume, 0))}
            </div>
            <div className="text-sm text-gray-500">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {chartData.length > 0
                ? formatCurrency(
                    chartData.reduce((sum, day) => sum + day.profit, 0) / chartData.length,
                  )
                : formatCurrency(0)}
            </div>
            <div className="text-sm text-gray-500">Avg Daily Profit</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceCharts

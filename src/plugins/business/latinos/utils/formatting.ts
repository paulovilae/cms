/**
 * Formatting utilities for the Latinos Trading Bot System
 *
 * Helper functions for formatting numbers, dates, and trade data
 * to ensure consistent display across all components.
 */

/**
 * Format currency values with proper locale and currency symbol
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage values with proper precision
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  showSign: boolean = true,
): string => {
  const formatted = value.toFixed(decimals)
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${formatted}%`
}

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export const formatCompactNumber = (num: number, decimals: number = 1): string => {
  if (num === 0) return '0'

  const absNum = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)}B`
  } else if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)}M`
  } else if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}K`
  }

  return num.toString()
}

/**
 * Format date and time for display
 */
export const formatDateTime = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {},
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }

  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format date only (no time)
 */
export const formatDate = (date: string | Date): string => {
  return formatDateTime(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format time only (no date)
 */
export const formatTime = (date: string | Date): string => {
  return formatDateTime(date, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateObj)
  }
}

/**
 * Format trade side with appropriate styling
 */
export const formatTradeSide = (
  side: 'buy' | 'sell',
): {
  label: string
  className: string
} => {
  return {
    buy: {
      label: 'BUY',
      className: 'text-green-600 bg-green-50 border-green-200',
    },
    sell: {
      label: 'SELL',
      className: 'text-red-600 bg-red-50 border-red-200',
    },
  }[side]
}

/**
 * Format bot status with appropriate styling
 */
export const formatBotStatus = (
  status: string,
): {
  label: string
  className: string
  dotColor: string
} => {
  const statusMap = {
    active: {
      label: 'Active',
      className: 'text-green-800 bg-green-100',
      dotColor: 'bg-green-400',
    },
    paused: {
      label: 'Paused',
      className: 'text-yellow-800 bg-yellow-100',
      dotColor: 'bg-yellow-400',
    },
    stopped: {
      label: 'Stopped',
      className: 'text-gray-800 bg-gray-100',
      dotColor: 'bg-gray-400',
    },
    error: {
      label: 'Error',
      className: 'text-red-800 bg-red-100',
      dotColor: 'bg-red-400',
    },
  }

  return statusMap[status as keyof typeof statusMap] || statusMap.stopped
}

/**
 * Format risk level with appropriate styling
 */
export const formatRiskLevel = (
  risk: string,
): {
  label: string
  className: string
} => {
  const riskMap = {
    conservative: {
      label: 'Conservative',
      className: 'text-green-600',
    },
    moderate: {
      label: 'Moderate',
      className: 'text-yellow-600',
    },
    aggressive: {
      label: 'Aggressive',
      className: 'text-red-600',
    },
  }

  return riskMap[risk as keyof typeof riskMap] || riskMap.moderate
}

/**
 * Format trade status with appropriate styling
 */
export const formatTradeStatus = (
  status: string,
): {
  label: string
  className: string
} => {
  const statusMap = {
    open: {
      label: 'Open',
      className: 'text-blue-800 bg-blue-100',
    },
    filled: {
      label: 'Filled',
      className: 'text-green-800 bg-green-100',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'text-gray-800 bg-gray-100',
    },
    expired: {
      label: 'Expired',
      className: 'text-orange-800 bg-orange-100',
    },
    rejected: {
      label: 'Rejected',
      className: 'text-red-800 bg-red-100',
    },
  }

  return statusMap[status as keyof typeof statusMap] || statusMap.open
}

/**
 * Format profit/loss with appropriate styling and sign
 */
export const formatProfitLoss = (
  amount: number,
): {
  formatted: string
  className: string
  isProfit: boolean
} => {
  const isProfit = amount >= 0
  const formatted = formatCurrency(Math.abs(amount))
  const sign = isProfit ? '+' : '-'

  return {
    formatted: `${sign}${formatted}`,
    className: isProfit ? 'text-green-600' : 'text-red-600',
    isProfit,
  }
}

/**
 * Format win rate as percentage
 */
export const formatWinRate = (successful: number, total: number): string => {
  if (total === 0) return '0%'
  const rate = (successful / total) * 100
  return formatPercentage(rate, 1, false)
}

/**
 * Format volume with appropriate units
 */
export const formatVolume = (volume: number): string => {
  return formatCompactNumber(volume, 0)
}

/**
 * Format price with appropriate precision based on value
 */
export const formatPrice = (price: number, symbol?: string): string => {
  // For crypto pairs, use more decimal places
  const isCrypto = symbol?.includes('-') || symbol?.includes('BTC') || symbol?.includes('ETH')
  const decimals = isCrypto ? 6 : 2

  if (price < 1 && isCrypto) {
    return price.toFixed(8).replace(/\.?0+$/, '')
  }

  return formatCurrency(price)
}

/**
 * Format duration in human-readable format
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Format exchange name for display
 */
export const formatExchange = (exchange: string): string => {
  const exchangeMap: Record<string, string> = {
    NASDAQ: 'NASDAQ',
    NYSE: 'NYSE',
    AMEX: 'AMEX',
    CRYPTO: 'Crypto',
  }

  return exchangeMap[exchange] || exchange
}

/**
 * Format symbol for display (handle crypto pairs)
 */
export const formatSymbol = (symbol: string): string => {
  // Handle crypto pairs like BTC-USD
  if (symbol.includes('-')) {
    return symbol.replace('-', '/')
  }

  return symbol.toUpperCase()
}

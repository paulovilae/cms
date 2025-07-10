/**
 * Business Context Utility
 *
 * Provides standardized business context detection and handling for multi-tenant operations.
 * This utility is used across all endpoints and frontend components to maintain consistent
 * business isolation and routing.
 */

import type { PayloadRequest } from 'payload'

// Business mode types
export type BusinessMode = 'intellitrade' | 'salarium' | 'latinos' | 'capacita' | 'default'

// Valid business modes for validation
export const VALID_BUSINESS_MODES: BusinessMode[] = [
  'intellitrade',
  'salarium',
  'latinos',
  'capacita',
  'default',
]

// Business context interface
export interface BusinessContext {
  business: BusinessMode
  isValid: boolean
  source: 'header' | 'query' | 'body' | 'default'
}

/**
 * Extract business context from various request sources
 * Priority: headers > query > body > default
 */
export function getBusinessContext(req: PayloadRequest | Request | any): BusinessContext {
  let business: string | undefined
  let source: BusinessContext['source'] = 'default'

  // Try to extract from headers first (highest priority)
  if (req.headers) {
    const headerBusiness = req.headers['x-business'] || req.headers.get?.('x-business')
    if (headerBusiness) {
      business = headerBusiness
      source = 'header'
    }
  }

  // Try query parameters if no header found
  if (!business && req.query) {
    business = req.query.business
    source = 'query'
  }

  // Try body parameters if no query found
  if (!business && req.body) {
    business = req.body.business
    source = 'body'
  }

  // Fallback to environment or default
  if (!business) {
    business = process.env.BUSINESS_MODE || 'default'
    source = 'default'
  }

  // Validate business mode
  const normalizedBusiness = business.toLowerCase() as BusinessMode
  const isValid = VALID_BUSINESS_MODES.includes(normalizedBusiness)

  return {
    business: isValid ? normalizedBusiness : 'default',
    isValid,
    source,
  }
}

/**
 * Extract business mode string only (simplified version)
 */
export function getBusinessMode(req: PayloadRequest | Request | any): BusinessMode {
  const context = getBusinessContext(req)
  return context.business
}

/**
 * Validate if a business mode is valid
 */
export function isValidBusinessMode(business: string): business is BusinessMode {
  return VALID_BUSINESS_MODES.includes(business.toLowerCase() as BusinessMode)
}

/**
 * Create standardized headers for frontend API requests
 */
export function createBusinessHeaders(
  business: BusinessMode,
  additionalHeaders: Record<string, string> = {},
): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-business': business,
    ...additionalHeaders,
  }
}

/**
 * Create business-aware fetch options for frontend requests
 */
export function createBusinessFetchOptions(
  business: BusinessMode,
  options: RequestInit = {},
): RequestInit {
  const businessHeaders = createBusinessHeaders(business)

  return {
    ...options,
    headers: {
      ...businessHeaders,
      ...options.headers,
    },
  }
}

/**
 * Helper function for making business-aware API calls
 */
export async function businessFetch(
  url: string,
  business: BusinessMode,
  options: RequestInit = {},
): Promise<Response> {
  const fetchOptions = createBusinessFetchOptions(business, options)
  return fetch(url, fetchOptions)
}

/**
 * Add business context to URL as query parameter (fallback method)
 */
export function addBusinessToUrl(url: string, business: BusinessMode): string {
  const urlObj = new URL(url, window?.location?.origin || 'http://localhost:3000')
  urlObj.searchParams.set('business', business)
  return urlObj.toString()
}

/**
 * Extract business from URL pathname (for legacy support)
 */
export function getBusinessFromPath(pathname: string): BusinessMode | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]?.toLowerCase()

  if (firstSegment && isValidBusinessMode(firstSegment)) {
    return firstSegment as BusinessMode
  }

  return null
}

/**
 * Get current business context from browser environment
 */
export function getCurrentBusiness(): BusinessMode {
  // Try to get from current URL path
  if (typeof window !== 'undefined') {
    const pathBusiness = getBusinessFromPath(window.location.pathname)
    if (pathBusiness) {
      return pathBusiness
    }

    // Try to get from URL query parameters
    const urlParams = new URLSearchParams(window.location.search)
    const queryBusiness = urlParams.get('business')
    if (queryBusiness && isValidBusinessMode(queryBusiness)) {
      return queryBusiness as BusinessMode
    }
  }

  // Fallback to environment or default
  return (process.env.NEXT_PUBLIC_BUSINESS_MODE as BusinessMode) || 'default'
}

/**
 * Business-specific configuration helper
 */
export function getBusinessConfig(business: BusinessMode) {
  const configs = {
    intellitrade: {
      name: 'IntelliTrade',
      description: 'Blockchain-Powered Trade Finance',
      color: 'blue',
      port: 3001,
    },
    salarium: {
      name: 'Salarium',
      description: 'AI-Powered HR Solutions',
      color: 'violet',
      port: 3002,
    },
    latinos: {
      name: 'Latinos',
      description: 'AI-Powered Trading Platform',
      color: 'orange',
      port: 3003,
    },
    capacita: {
      name: 'Capacita',
      description: 'AI-Powered Training Platform',
      color: 'green',
      port: 3004,
    },
    default: {
      name: 'Multi-Business Platform',
      description: 'All Business Solutions',
      color: 'gray',
      port: 3000,
    },
  }

  return configs[business] || configs.default
}

/**
 * Check if current environment supports a specific business
 */
export function isBusinessEnabled(business: BusinessMode): boolean {
  const businessMode = process.env.BUSINESS_MODE || 'all'

  // If running in 'all' mode, all businesses are enabled
  if (businessMode === 'all') {
    return true
  }

  // If running in specific business mode, only that business is enabled
  return businessMode === business
}

/**
 * Get list of enabled businesses for current environment
 */
export function getEnabledBusinesses(): BusinessMode[] {
  const businessMode = process.env.BUSINESS_MODE || 'all'

  if (businessMode === 'all') {
    return ['intellitrade', 'salarium', 'latinos', 'capacita']
  }

  if (isValidBusinessMode(businessMode)) {
    return [businessMode as BusinessMode]
  }

  return ['default']
}

/**
 * Middleware helper for endpoint handlers
 */
export function withBusinessContext<T extends any[]>(
  handler: (business: BusinessMode, req: PayloadRequest | Request | any, ...args: T) => any,
) {
  return (req: PayloadRequest | Request | any, ...args: T) => {
    const business = getBusinessMode(req)
    return handler(business, req, ...args)
  }
}

/**
 * React hook helper for getting business context in components
 */
export function useBusinessContext(): {
  business: BusinessMode
  config: ReturnType<typeof getBusinessConfig>
  isEnabled: boolean
} {
  const business = getCurrentBusiness()
  const config = getBusinessConfig(business)
  const isEnabled = isBusinessEnabled(business)

  return {
    business,
    config,
    isEnabled,
  }
}

// Export types for external use
export type { PayloadRequest }

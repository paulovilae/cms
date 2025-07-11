/**
 * URL-based Branding System
 * Detects business context from URL path and provides appropriate branding
 */

import { type BusinessMode } from './environment'
import { getBrandingForBusiness, type BusinessBranding } from './branding'

/**
 * Extract business mode from URL pathname
 */
export const getBusinessModeFromPath = (pathname: string): BusinessMode => {
  // Ensure pathname is a string and handle edge cases
  if (!pathname || typeof pathname !== 'string') {
    console.warn('getBusinessModeFromPath received invalid pathname:', pathname)
    return 'all'
  }

  // Remove leading slash and get first segment
  const segments = pathname.replace(/^\//, '').split('/')
  const firstSegment = segments[0]

  // Check if first segment matches a business
  if (
    firstSegment === 'salarium' ||
    firstSegment === 'intellitrade' ||
    firstSegment === 'latinos'
  ) {
    return firstSegment as BusinessMode
  }

  // Default to 'all' for root paths or unmatched paths
  return 'all'
}

/**
 * Get branding based on current URL (client-side)
 */
export const getBrandingFromURL = (): BusinessBranding => {
  if (typeof window === 'undefined') {
    // Server-side: return default branding
    return getBrandingForBusiness('all')
  }

  const businessMode = getBusinessModeFromPath(window.location.pathname)
  return getBrandingForBusiness(businessMode)
}

/**
 * Get branding based on pathname (server-side compatible)
 */
export const getBrandingFromPath = (pathname: string): BusinessBranding => {
  // Ensure pathname is a string
  if (!pathname || typeof pathname !== 'string') {
    console.warn('getBrandingFromPath received invalid pathname:', pathname)
    return getBrandingForBusiness('all')
  }

  const businessMode = getBusinessModeFromPath(pathname)
  return getBrandingForBusiness(businessMode)
}

/**
 * Check if current URL is within a specific business context
 */
export const isInBusinessContext = (business: BusinessMode, pathname?: string): boolean => {
  const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '')

  // Ensure we have a valid path
  if (!path || typeof path !== 'string') {
    console.warn('isInBusinessContext received invalid path:', path)
    return false
  }

  const currentBusiness = getBusinessModeFromPath(path)
  return currentBusiness === business
}

/**
 * Get the base URL for a business
 */
export const getBusinessBaseURL = (business: BusinessMode): string => {
  if (business === 'all') {
    return '/'
  }
  return `/${business}`
}

/**
 * Check if we should redirect to business-specific URL based on environment
 */
export const shouldRedirectToBusiness = (): { redirect: boolean; business?: BusinessMode } => {
  const envBusinessMode = process.env.BUSINESS_MODE as BusinessMode

  // If environment is set to a specific business (not 'all'), redirect to that business URL
  if (envBusinessMode && envBusinessMode !== 'all') {
    return { redirect: true, business: envBusinessMode }
  }

  return { redirect: false }
}

/**
 * Environment utilities for multi-tenant plugin system
 */

import path from 'path'

export type BusinessMode = 'intellitrade' | 'salarium' | 'latinos' | 'all'

/**
 * Get the current business mode from environment variables (server-side only)
 * For URL-based business detection, use urlBranding utilities instead
 */
export const getBusinessMode = (): BusinessMode => {
  return (process.env.BUSINESS_MODE as BusinessMode) || 'all'
}

/**
 * Check if a specific business is active in the current mode
 */
export const isBusinessActive = (business: string): boolean => {
  const mode = getBusinessMode()
  return mode === 'all' || mode === business
}

/**
 * Get the database path for the current business mode
 */
export const getDatabasePath = (): string => {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH
  }

  // Get absolute path to project root
  const projectRoot = process.cwd()

  // Use single database for all businesses - better for multi-tenant architecture
  return `file:${path.join(projectRoot, 'databases', 'multi-tenant.db')}`
}

/**
 * Get enabled features from environment variables
 */
export const getEnabledFeatures = (): string[] => {
  const features = process.env.ENABLED_FEATURES || ''
  return features.split(',').filter(Boolean)
}

/**
 * Check if a specific feature is enabled
 */
export const isFeatureEnabled = (feature: string): boolean => {
  const enabledFeatures = getEnabledFeatures()
  return enabledFeatures.includes(feature)
}

/**
 * Get the frontend theme for the current business mode
 */
export const getFrontendTheme = (): string => {
  return process.env.FRONTEND_THEME || getBusinessMode()
}

/**
 * User Business Access Utilities
 * Manages user permissions for multi-tenant business access
 */

import { getBusinessMode, type BusinessMode } from './environment'
import type { User } from '@/payload-types'

/**
 * Check if user has access to a specific business
 */
export const hasBusinessAccess = (user: User | null, business: BusinessMode): boolean => {
  if (!user) return false

  // Admin users have access to everything
  if (user.role === 'admin') return true

  // Check if user has explicit access to this business or 'all'
  const businessAccess = user.businessAccess || []
  return businessAccess.includes(business) || businessAccess.includes('all')
}

/**
 * Check if user has access to current business mode
 */
export const hasCurrentBusinessAccess = (user: User | null): boolean => {
  const currentBusiness = getBusinessMode()
  return hasBusinessAccess(user, currentBusiness)
}

/**
 * Get list of businesses user has access to
 */
export const getUserBusinessAccess = (user: User | null): BusinessMode[] => {
  if (!user) return []

  // Admin users have access to everything
  if (user.role === 'admin') return ['intellitrade', 'salarium', 'latinos', 'all']

  const businessAccess = user.businessAccess || []

  // If user has 'all' access, return all businesses
  if (businessAccess.includes('all')) {
    return ['intellitrade', 'salarium', 'latinos', 'all']
  }

  return businessAccess as BusinessMode[]
}

/**
 * Filter content based on user's business access
 */
export const filterByBusinessAccess = <T extends { business?: string }>(
  items: T[],
  user: User | null,
): T[] => {
  if (!user) return []

  // Admin users see everything
  if (user.role === 'admin') return items

  const userAccess = getUserBusinessAccess(user)

  return items.filter((item) => {
    if (!item.business) return true // No business restriction
    return userAccess.includes(item.business as BusinessMode)
  })
}

/**
 * Check if user can access admin dashboard
 */
export const canAccessAdmin = (user: User | null): boolean => {
  if (!user) return false
  return user.role === 'admin' || hasCurrentBusinessAccess(user)
}

/**
 * Get user's primary business (first in their access list)
 */
export const getUserPrimaryBusiness = (user: User | null): BusinessMode => {
  if (!user) return 'all'

  const businessAccess = user.businessAccess || []

  if (businessAccess.length === 0) return 'all'
  if (businessAccess.includes('all')) return 'all'

  return businessAccess[0] as BusinessMode
}

/**
 * Check if user should see business-specific navigation
 */
export const shouldShowBusinessNav = (user: User | null, business: BusinessMode): boolean => {
  if (!user) {
    // For public users, show nav based on current business mode
    return getBusinessMode() === business || getBusinessMode() === 'all'
  }

  return hasBusinessAccess(user, business)
}

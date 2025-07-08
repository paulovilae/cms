/**
 * Dynamic Page Routing System
 * Manages business-specific page availability and routing
 */

import { getBusinessMode, isBusinessActive, type BusinessMode } from './environment'
import { getCurrentBranding } from './branding'

export interface PageRoute {
  path: string
  title: string
  description: string
  component?: string
  businesses: BusinessMode[]
  isActive: boolean
  requiresAuth?: boolean
  isDemo?: boolean
}

export interface BusinessPages {
  marketing: PageRoute[]
  demo: PageRoute[]
  admin: PageRoute[]
}

/**
 * Define all available pages for each business
 */
const businessPages: Record<BusinessMode, BusinessPages> = {
  intellitrade: {
    marketing: [
      {
        path: '/',
        title: 'Home',
        description: 'IntelliTrade homepage with product overview',
        businesses: ['intellitrade', 'all'],
        isActive: true,
      },
      {
        path: '/features',
        title: 'Features',
        description: 'Trade finance platform features',
        businesses: ['intellitrade', 'all'],
        isActive: true,
      },
      {
        path: '/pricing',
        title: 'Pricing',
        description: 'IntelliTrade pricing plans',
        businesses: ['intellitrade', 'all'],
        isActive: true,
      },
      {
        path: '/team',
        title: 'Team',
        description: 'Meet the IntelliTrade team',
        businesses: ['intellitrade', 'all'],
        isActive: true,
      },
      {
        path: '/about',
        title: 'About',
        description: 'About IntelliTrade',
        businesses: ['intellitrade', 'all'],
        isActive: true,
      },
    ],
    demo: [
      {
        path: '/demo/trade-finance',
        title: 'Trade Finance Demo',
        description: 'Interactive trade finance platform demo',
        businesses: ['intellitrade', 'all'],
        isActive: true,
        requiresAuth: true,
        isDemo: true,
      },
      {
        path: '/demo/smart-contracts',
        title: 'Smart Contracts Demo',
        description: 'Blockchain smart contracts demonstration',
        businesses: ['intellitrade', 'all'],
        isActive: true,
        requiresAuth: true,
        isDemo: true,
      },
    ],
    admin: [
      {
        path: '/admin',
        title: 'Admin Dashboard',
        description: 'IntelliTrade admin panel',
        businesses: ['intellitrade', 'all'],
        isActive: true,
        requiresAuth: true,
      },
    ],
  },
  salarium: {
    marketing: [
      {
        path: '/',
        title: 'Home',
        description: 'Salarium homepage with HR solutions overview',
        businesses: ['salarium', 'all'],
        isActive: true,
      },
      {
        path: '/features',
        title: 'Features',
        description: 'HR document workflow features',
        businesses: ['salarium', 'all'],
        isActive: true,
      },
      {
        path: '/pricing',
        title: 'Pricing',
        description: 'Salarium pricing plans',
        businesses: ['salarium', 'all'],
        isActive: true,
      },
      {
        path: '/team',
        title: 'Team',
        description: 'Meet the Salarium team',
        businesses: ['salarium', 'all'],
        isActive: true,
      },
      {
        path: '/about',
        title: 'About',
        description: 'About Salarium',
        businesses: ['salarium', 'all'],
        isActive: true,
      },
    ],
    demo: [
      {
        path: '/salarium/job-flow',
        title: 'Job Flow Demo',
        description: 'Interactive HR document workflow demo',
        businesses: ['salarium', 'all'],
        isActive: true,
        requiresAuth: false,
        isDemo: true,
      },
      {
        path: '/demo/hr-workflows',
        title: 'HR Workflows Demo',
        description: 'Complete HR workflow management demo',
        businesses: ['salarium', 'all'],
        isActive: true,
        requiresAuth: true,
        isDemo: true,
      },
    ],
    admin: [
      {
        path: '/admin',
        title: 'Admin Dashboard',
        description: 'Salarium admin panel',
        businesses: ['salarium', 'all'],
        isActive: true,
        requiresAuth: true,
      },
    ],
  },
  latinos: {
    marketing: [
      {
        path: '/',
        title: 'Home',
        description: 'Latinos trading platform homepage',
        businesses: ['latinos', 'all'],
        isActive: true,
      },
      {
        path: '/features',
        title: 'Features',
        description: 'Trading bot platform features',
        businesses: ['latinos', 'all'],
        isActive: true,
      },
      {
        path: '/pricing',
        title: 'Pricing',
        description: 'Latinos pricing plans',
        businesses: ['latinos', 'all'],
        isActive: true,
      },
      {
        path: '/team',
        title: 'Team',
        description: 'Meet the Latinos team',
        businesses: ['latinos', 'all'],
        isActive: true,
      },
      {
        path: '/about',
        title: 'About',
        description: 'About Latinos',
        businesses: ['latinos', 'all'],
        isActive: true,
      },
    ],
    demo: [
      {
        path: '/demo/trading-bots',
        title: 'Trading Bots Demo',
        description: 'Interactive trading bot platform demo',
        businesses: ['latinos', 'all'],
        isActive: true,
        requiresAuth: true,
        isDemo: true,
      },
      {
        path: '/demo/market-analysis',
        title: 'Market Analysis Demo',
        description: 'Real-time market analysis tools demo',
        businesses: ['latinos', 'all'],
        isActive: true,
        requiresAuth: true,
        isDemo: true,
      },
    ],
    admin: [
      {
        path: '/admin',
        title: 'Admin Dashboard',
        description: 'Latinos admin panel',
        businesses: ['latinos', 'all'],
        isActive: true,
        requiresAuth: true,
      },
    ],
  },
  all: {
    marketing: [
      {
        path: '/',
        title: 'Multi-Tenant CMS',
        description: 'Multi-tenant business platform homepage',
        businesses: ['all'],
        isActive: true,
      },
      {
        path: '/businesses',
        title: 'Our Businesses',
        description: 'Overview of all business products',
        businesses: ['all'],
        isActive: true,
      },
    ],
    demo: [
      {
        path: '/demo/platform',
        title: 'Platform Demo',
        description: 'Multi-tenant platform demonstration',
        businesses: ['all'],
        isActive: true,
        requiresAuth: true,
        isDemo: true,
      },
    ],
    admin: [
      {
        path: '/admin',
        title: 'Admin Dashboard',
        description: 'Multi-tenant admin panel',
        businesses: ['all'],
        isActive: true,
        requiresAuth: true,
      },
    ],
  },
}

/**
 * Get available pages for current business mode
 */
export const getCurrentBusinessPages = (): BusinessPages => {
  const businessMode = getBusinessMode()
  return businessPages[businessMode]
}

/**
 * Get all marketing pages for current business
 */
export const getMarketingPages = (): PageRoute[] => {
  const pages = getCurrentBusinessPages()
  return pages.marketing.filter(
    (page) => page.isActive && page.businesses.some((business) => isBusinessActive(business)),
  )
}

/**
 * Get all demo pages for current business
 */
export const getDemoPages = (): PageRoute[] => {
  const pages = getCurrentBusinessPages()
  return pages.demo.filter(
    (page) => page.isActive && page.businesses.some((business) => isBusinessActive(business)),
  )
}

/**
 * Get all admin pages for current business
 */
export const getAdminPages = (): PageRoute[] => {
  const pages = getCurrentBusinessPages()
  return pages.admin.filter(
    (page) => page.isActive && page.businesses.some((business) => isBusinessActive(business)),
  )
}

/**
 * Check if a specific page is available for current business
 */
export const isPageAvailable = (path: string): boolean => {
  const allPages = getCurrentBusinessPages()
  const allRoutes = [...allPages.marketing, ...allPages.demo, ...allPages.admin]

  const page = allRoutes.find((route) => route.path === path)
  if (!page) return false

  return page.isActive && page.businesses.some((business) => isBusinessActive(business))
}

/**
 * Get page metadata for current business
 */
export const getPageMetadata = (path: string) => {
  const allPages = getCurrentBusinessPages()
  const allRoutes = [...allPages.marketing, ...allPages.demo, ...allPages.admin]
  const branding = getCurrentBranding()

  const page = allRoutes.find((route) => route.path === path)

  return {
    title: page ? `${page.title} | ${branding.displayName}` : branding.displayName,
    description: page?.description || branding.description,
    businessName: branding.displayName,
    businessTagline: branding.tagline,
  }
}

/**
 * Get navigation items for current business
 */
export const getNavigationItems = () => {
  const marketingPages = getMarketingPages()
  const demoPages = getDemoPages()

  return {
    main: marketingPages.filter((page) => !page.requiresAuth),
    demo: demoPages,
    auth: marketingPages.filter((page) => page.requiresAuth),
  }
}

/**
 * Toggle page activation (for admin use)
 */
export const togglePageActivation = (path: string, isActive: boolean) => {
  // This would typically update a database or configuration
  // For now, we'll just log the change
  console.log(`Page ${path} ${isActive ? 'activated' : 'deactivated'}`)

  // In a real implementation, this would:
  // 1. Update the page configuration in the database
  // 2. Trigger a revalidation of the routing system
  // 3. Update any cached navigation data
}

/**
 * Get page management interface data (for admin panel)
 */
export const getPageManagementData = () => {
  const businessMode = getBusinessMode()
  const allPages = businessPages[businessMode]

  return {
    businessMode,
    pages: {
      marketing: allPages.marketing,
      demo: allPages.demo,
      admin: allPages.admin,
    },
    totalPages: allPages.marketing.length + allPages.demo.length + allPages.admin.length,
    activePages: [...allPages.marketing, ...allPages.demo, ...allPages.admin].filter(
      (page) => page.isActive,
    ).length,
  }
}

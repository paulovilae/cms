import { getPayload } from 'payload'
import config from '@payload-config'

export interface BusinessConfig {
  id: string
  slug: string
  displayName: string
  description: string
  tagline: string
  badge: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  contact: {
    email: string
    phone?: string
    address?: string
  }
  social: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  features: {
    hasMarketingPages: boolean
    hasDemo: boolean
    hasAuth: boolean
    hasBlog: boolean
  }
  demoUrl?: string
  isActive: boolean
  order?: number
}

// Cache for business configurations
let businessCache: BusinessConfig[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Get all active businesses from the database
 */
export async function getAllBusinesses(): Promise<BusinessConfig[]> {
  // Check cache first
  const now = Date.now()
  if (businessCache && now - cacheTimestamp < CACHE_DURATION) {
    return businessCache
  }

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'businesses' as any,
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: 'order',
      limit: 100,
    })

    businessCache = docs.map((doc: any) => ({
      id: doc.id.toString(),
      slug: doc.slug,
      displayName: doc.displayName,
      description: doc.description,
      tagline: doc.tagline,
      badge: doc.badge,
      colors: doc.colors,
      contact: doc.contact,
      social: doc.social,
      features: doc.features,
      demoUrl: doc.demoUrl,
      isActive: doc.isActive,
      order: doc.order,
    }))

    cacheTimestamp = now
    return businessCache || []
  } catch (error) {
    console.error('Error fetching businesses:', error)

    // Fallback to hardcoded businesses if database fails
    return getFallbackBusinesses()
  }
}

/**
 * Get a specific business by slug
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessConfig | null> {
  const businesses = await getAllBusinesses()
  return businesses.find((business) => business.slug === slug) || null
}

/**
 * Check if a business slug is valid
 */
export async function isValidBusinessSlug(slug: string): Promise<boolean> {
  const business = await getBusinessBySlug(slug)
  return business !== null
}

/**
 * Get all valid business slugs
 */
export async function getValidBusinessSlugs(): Promise<string[]> {
  const businesses = await getAllBusinesses()
  return businesses.map((business) => business.slug)
}

/**
 * Fallback businesses if database is not available
 */
function getFallbackBusinesses(): BusinessConfig[] {
  return [
    {
      id: 'intellitrade',
      slug: 'intellitrade',
      displayName: 'IntelliTrade',
      description:
        'A leading fintech company specializing in trade finance solutions using blockchain technology.',
      tagline: 'Revolutionizing Trade Finance with Blockchain',
      badge: 'Blockchain-Powered Trade Finance',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#059669',
      },
      contact: {
        email: 'contact@intellitrade.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
      },
      social: {
        twitter: '@intellitrade',
        linkedin: 'company/intellitrade',
        github: 'intellitrade',
      },
      features: {
        hasMarketingPages: true,
        hasDemo: true,
        hasAuth: true,
        hasBlog: true,
      },
      demoUrl: '/intellitrade/trade-flow?autoLogin=true',
      isActive: true,
      order: 1,
    },
    {
      id: 'salarium',
      slug: 'salarium',
      displayName: 'Salarium',
      description: 'Advanced HR document flow system for modern organizations.',
      tagline: 'Streamline Your HR Workflows',
      badge: 'AI-Powered HR Solutions',
      colors: {
        primary: '#7c3aed',
        secondary: '#64748b',
        accent: '#dc2626',
      },
      contact: {
        email: 'contact@salarium.com',
        phone: '+1 (555) 234-5678',
        address: 'Austin, TX',
      },
      social: {
        twitter: '@salarium',
        linkedin: 'company/salarium',
      },
      features: {
        hasMarketingPages: true,
        hasDemo: true,
        hasAuth: true,
        hasBlog: true,
      },
      demoUrl: '/salarium/job-flow?autoLogin=true',
      isActive: true,
      order: 2,
    },
    {
      id: 'latinos',
      slug: 'latinos',
      displayName: 'Latinos',
      description:
        'Automated trading platform with advanced bot functionality for stock market operations.',
      tagline: 'Intelligent Trading Automation',
      badge: 'AI-Powered Trading Platform',
      colors: {
        primary: '#ea580c',
        secondary: '#64748b',
        accent: '#16a34a',
      },
      contact: {
        email: 'contact@latinos.com',
        phone: '+1 (555) 345-6789',
        address: 'Miami, FL',
      },
      social: {
        twitter: '@latinos_trading',
        github: 'latinos-trading',
      },
      features: {
        hasMarketingPages: true,
        hasDemo: true,
        hasAuth: true,
        hasBlog: true,
      },
      demoUrl: '/latinos?autoLogin=true',
      isActive: true,
      order: 3,
    },
    {
      id: 'capacita',
      slug: 'capacita',
      displayName: 'Capacita',
      description:
        'AI-powered training platform with Avatar Arena and RPG gamification for professional development.',
      tagline: 'Revolutionary Training Experience',
      badge: 'AI-Powered Training Platform',
      colors: {
        primary: '#16a34a',
        secondary: '#64748b',
        accent: '#dc2626',
      },
      contact: {
        email: 'contact@capacita.com',
        phone: '+1 (555) 456-7890',
        address: 'New York, NY',
      },
      social: {
        twitter: '@capacita_training',
        linkedin: 'company/capacita',
      },
      features: {
        hasMarketingPages: true,
        hasDemo: true,
        hasAuth: true,
        hasBlog: true,
      },
      demoUrl: '/capacita/avatar-arena?autoLogin=true',
      isActive: true,
      order: 4,
    },
  ]
}

/**
 * Clear the business cache (useful for testing or after updates)
 */
export function clearBusinessCache(): void {
  businessCache = null
  cacheTimestamp = 0
}

/**
 * Dynamic Branding System
 * Provides business-specific branding, themes, and configuration
 */

import { getBusinessMode, type BusinessMode } from './environment'

export interface BusinessBranding {
  name: string
  displayName: string
  description: string
  tagline: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  logo: {
    light: string
    dark: string
    icon: string
  }
  social: {
    twitter: string
    linkedin?: string
    github?: string
  }
  contact: {
    email: string
    phone?: string
    address?: string
  }
  features: {
    hasMarketingPages: boolean
    hasDemo: boolean
    hasAuth: boolean
    hasBlog: boolean
  }
}

const businessBrandings: Record<BusinessMode, BusinessBranding> = {
  intellitrade: {
    name: 'intellitrade',
    displayName: 'IntelliTrade',
    description:
      'A leading fintech company specializing in trade finance solutions using blockchain technology.',
    tagline: 'Revolutionizing Trade Finance with Blockchain',
    colors: {
      primary: '#2563eb', // blue-600
      secondary: '#64748b', // slate-500
      accent: '#059669', // emerald-600
    },
    logo: {
      light: '/intellitrade-logo-light.svg',
      dark: '/intellitrade-logo-dark.svg',
      icon: '/intellitrade-icon.svg',
    },
    social: {
      twitter: '@intellitrade',
      linkedin: 'company/intellitrade',
      github: 'intellitrade',
    },
    contact: {
      email: 'contact@intellitrade.com',
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA',
    },
    features: {
      hasMarketingPages: true,
      hasDemo: true,
      hasAuth: true,
      hasBlog: true,
    },
  },
  salarium: {
    name: 'salarium',
    displayName: 'Salarium',
    description: 'Advanced HR document flow system for modern organizations.',
    tagline: 'Streamline Your HR Workflows',
    colors: {
      primary: '#7c3aed', // violet-600
      secondary: '#64748b', // slate-500
      accent: '#dc2626', // red-600
    },
    logo: {
      light: '/salarium-logo-light.svg',
      dark: '/salarium-logo-dark.svg',
      icon: '/salarium-icon.svg',
    },
    social: {
      twitter: '@salarium',
      linkedin: 'company/salarium',
    },
    contact: {
      email: 'contact@salarium.com',
      phone: '+1 (555) 234-5678',
      address: 'Austin, TX',
    },
    features: {
      hasMarketingPages: true,
      hasDemo: true,
      hasAuth: true,
      hasBlog: true,
    },
  },
  latinos: {
    name: 'latinos',
    displayName: 'Latinos',
    description:
      'Automated trading platform with advanced bot functionality for stock market operations.',
    tagline: 'Intelligent Trading Automation',
    colors: {
      primary: '#ea580c', // orange-600
      secondary: '#64748b', // slate-500
      accent: '#16a34a', // green-600
    },
    logo: {
      light: '/latinos-logo-light.svg',
      dark: '/latinos-logo-dark.svg',
      icon: '/latinos-icon.svg',
    },
    social: {
      twitter: '@latinos_trading',
      github: 'latinos-trading',
    },
    contact: {
      email: 'contact@latinos.com',
      phone: '+1 (555) 345-6789',
      address: 'Miami, FL',
    },
    features: {
      hasMarketingPages: true,
      hasDemo: true,
      hasAuth: true,
      hasBlog: true,
    },
  },
  all: {
    name: 'all',
    displayName: 'Multi-Tenant CMS',
    description: 'Comprehensive business platform serving multiple products.',
    tagline: 'One Platform, Multiple Solutions',
    colors: {
      primary: '#1f2937', // gray-800
      secondary: '#64748b', // slate-500
      accent: '#3b82f6', // blue-500
    },
    logo: {
      light: '/cms-logo-light.svg',
      dark: '/cms-logo-dark.svg',
      icon: '/cms-icon.svg',
    },
    social: {
      twitter: '@multitenant_cms',
    },
    contact: {
      email: 'contact@cms.com',
    },
    features: {
      hasMarketingPages: true,
      hasDemo: true,
      hasAuth: true,
      hasBlog: true,
    },
  },
}

/**
 * Get branding for current business mode
 */
export const getCurrentBranding = (): BusinessBranding => {
  const businessMode = getBusinessMode()
  return businessBrandings[businessMode]
}

/**
 * Get branding for specific business
 */
export const getBrandingForBusiness = (business: BusinessMode): BusinessBranding => {
  return businessBrandings[business]
}

/**
 * Get all available business brandings
 */
export const getAllBrandings = (): Record<BusinessMode, BusinessBranding> => {
  return businessBrandings
}

/**
 * Check if current business has a specific feature
 */
export const hasFeature = (feature: keyof BusinessBranding['features']): boolean => {
  const branding = getCurrentBranding()
  return branding.features[feature]
}

/**
 * Get CSS custom properties for current branding
 */
export const getBrandingCSSVars = (): Record<string, string> => {
  const branding = getCurrentBranding()
  return {
    '--brand-primary': branding.colors.primary,
    '--brand-secondary': branding.colors.secondary,
    '--brand-accent': branding.colors.accent,
  }
}

/**
 * Get organization info for templates
 */
export const getOrganizationInfo = () => {
  const branding = getCurrentBranding()
  return {
    organizationName: branding.displayName,
    organizationDescription: branding.description,
    organizationTagline: branding.tagline,
  }
}

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getBusinessBySlug } from '@/utilities/businessConfig'

interface BusinessHeaderProps {
  business: string
}

export async function BusinessHeader({ business }: BusinessHeaderProps) {
  const businessConfig = await getBusinessBySlug(business)

  // Fallback if business not found
  if (!businessConfig) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900 capitalize">{business}</div>
            <div className="text-sm text-gray-500">Business not found</div>
          </div>
        </div>
      </header>
    )
  }

  const getBusinessColor = () => {
    // Use the primary color from business config, with fallbacks for known businesses
    const primaryColor = businessConfig.colors.primary

    // Convert hex to Tailwind-like classes (simplified approach)
    switch (business) {
      case 'intellitrade':
        return 'bg-blue-600 hover:bg-blue-700'
      case 'salarium':
        return 'bg-violet-600 hover:bg-violet-700'
      case 'latinos':
        return 'bg-orange-600 hover:bg-orange-700'
      case 'capacita':
        return 'bg-green-600 hover:bg-green-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/${business}`} className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {businessConfig.displayName}
              </div>
            </Link>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {businessConfig.badge}
            </Badge>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href={`/${business}/features`}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href={`/${business}/pricing`}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={`/${business}/team`}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Team
            </Link>
            <Link
              href={`/${business}/about`}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href={`/${business}/contact`}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeSelector />
            {businessConfig.features.hasDemo && (
              <Button asChild size="sm" className={getBusinessColor()}>
                <Link href={businessConfig.demoUrl || `/${business}?autoLogin=true`}>Try Demo</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

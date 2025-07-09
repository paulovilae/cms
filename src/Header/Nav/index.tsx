'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { getBusinessModeFromPath } from '@/utilities/urlBranding'
import { getBrandingForBusiness } from '@/utilities/branding'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [businessNavItems, setBusinessNavItems] = useState<any[]>([])
  const pathname = usePathname()

  useEffect(() => {
    // Get business mode from current URL
    const businessMode = getBusinessModeFromPath(pathname)
    const branding = getBrandingForBusiness(businessMode)

    // Create navigation items based on current business context
    const getBusinessNavItems = () => {
      if (businessMode === 'salarium') {
        return [
          { title: 'Home', path: '/salarium' },
          { title: 'Features', path: '/salarium/features' },
          { title: 'Pricing', path: '/salarium/pricing' },
          { title: 'Team', path: '/salarium/team' },
          { title: 'About', path: '/salarium/about' },
          { title: 'Contact', path: '/salarium/contact' },
        ]
      } else if (businessMode === 'intellitrade') {
        return [
          { title: 'Home', path: '/intellitrade' },
          { title: 'Features', path: '/intellitrade/features' },
          { title: 'Pricing', path: '/intellitrade/pricing' },
          { title: 'Team', path: '/intellitrade/team' },
          { title: 'About', path: '/intellitrade/about' },
          { title: 'Contact', path: '/intellitrade/contact' },
        ]
      } else if (businessMode === 'latinos') {
        return [
          { title: 'Home', path: '/latinos' },
          { title: 'Features', path: '/latinos/features' },
          { title: 'Pricing', path: '/latinos/pricing' },
          { title: 'Team', path: '/latinos/team' },
          { title: 'About', path: '/latinos/about' },
          { title: 'Contact', path: '/latinos/contact' },
        ]
      } else {
        // Default 'all' mode navigation
        return [
          { title: 'Multi-Tenant CMS', path: '/' },
          { title: 'Our Businesses', path: '/businesses' },
        ]
      }
    }

    const navItems = getBusinessNavItems()

    // Convert to the format expected by CMSLink
    const formattedItems = navItems.map((page) => ({
      link: {
        type: 'reference' as const,
        label: page.title,
        url: page.path,
        newTab: false,
      },
    }))

    setBusinessNavItems(formattedItems)
  }, [pathname])

  return (
    <nav className="flex gap-3 items-center">
      {businessNavItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/admin" className="text-sm font-medium text-primary hover:text-primary/80">
        Admin
      </Link>
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}

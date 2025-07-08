'use client'

import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getBusinessModeFromPath, getBrandingFromPath } from '@/utilities/urlBranding'
import { type BusinessBranding } from '@/utilities/branding'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props
  const [branding, setBranding] = useState<BusinessBranding | null>(null)
  const pathname = usePathname()

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  useEffect(() => {
    // Get business mode from current URL and corresponding branding
    const businessBranding = getBrandingFromPath(pathname)
    setBranding(businessBranding)
  }, [pathname])

  // Show loading state until branding is loaded
  if (!branding) {
    return (
      <div className={clsx('business-logo flex flex-col', className)}>
        <h1 className="text-2xl font-bold text-white dark:text-white leading-tight">•••</h1>
      </div>
    )
  }

  return (
    <div className={clsx('business-logo flex flex-col', `${branding.name}-logo`, className)}>
      <h1 className="text-2xl font-bold text-white dark:text-white leading-tight">
        {branding.displayName}
      </h1>
      <span className="text-xs text-white/80 dark:text-white/80 font-medium tracking-wide uppercase">
        {branding.tagline}
      </span>
    </div>
  )
}

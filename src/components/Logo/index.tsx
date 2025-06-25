import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <div className={clsx('intellitrade-logo', className)}>
      <h1 className="text-2xl font-bold">IntelliTrade</h1>
      <span className="subtitle text-sm">Trade Finance Platform</span>
    </div>
  )
}

export default Logo

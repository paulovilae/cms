'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

type FloatingCTAProps = {
  text: string
  link: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  scrollTrigger?: number
  backgroundColor?: string
  textColor?: string
  icon?: any
  dismissible?: boolean
}

export const FloatingCTA: React.FC<FloatingCTAProps> = (props) => {
  const {
    text,
    link,
    position = 'bottom-right',
    scrollTrigger = 500,
    backgroundColor = '#1E4EFF',
    textColor = '#FFFFFF',
    icon,
    dismissible = true,
  } = props

  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Show CTA when user scrolls past the threshold
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollTrigger) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollTrigger])

  // Check if CTA was previously dismissed in this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('floatingCTADismissed') === 'true'
    if (wasDismissed) {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('floatingCTADismissed', 'true')
  }

  if (isDismissed) return null

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300 shadow-lg rounded-lg',
        positionClasses[position],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
      )}
      style={{ backgroundColor }}
    >
      <div className="flex items-center p-4">
        {icon && (
          <div className="mr-3">
            <Media resource={icon} className="w-6 h-6" imgClassName="w-6 h-6" />
          </div>
        )}

        <div className="flex-1">
          <CMSLink className="font-medium" style={{ color: textColor }} label={text} url={link} />
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-3 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            aria-label="Dismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

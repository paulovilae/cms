'use client'

import React, { useEffect, useRef } from 'react'

interface ScreenReaderAnnouncerProps {
  announcements: string[]
  politeness?: 'polite' | 'assertive'
  clearAfter?: number
  onClear?: () => void
}

/**
 * Component to announce dynamic content changes to screen readers
 * Uses ARIA live regions to make screen readers aware of content updates
 */
export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  announcements,
  politeness = 'polite',
  clearAfter = 5000,
  onClear,
}) => {
  const announcerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update announcer content when announcements change
  useEffect(() => {
    if (announcements.length === 0 || !announcerRef.current) return

    // Join multiple announcements with a pause
    const announcement = announcements.join('. ')
    announcerRef.current.textContent = announcement

    // Clear after specified delay
    if (clearAfter > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = ''
        }
        if (onClear) {
          onClear()
        }
      }, clearAfter)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [announcements, clearAfter, onClear])

  return (
    <div
      ref={announcerRef}
      className="sr-only"
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      aria-relevant="additions text"
    />
  )
}

export default ScreenReaderAnnouncer

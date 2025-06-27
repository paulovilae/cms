import React from 'react'
import { LanguageHandler } from './LanguageHandler'

/**
 * Admin layout that injects our language handler
 * This ensures language changes are consistently applied
 */
export default function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <>
      {/* Language handler detects and applies language changes */}
      <LanguageHandler />

      {/* Render the original page content */}
      {children}
    </>
  )
}

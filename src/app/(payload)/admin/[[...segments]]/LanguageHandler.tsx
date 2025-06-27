'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * This component detects the language parameter from the URL and applies it consistently
 * across the Payload CMS admin interface. It's separate from our UI language switcher
 * and focuses solely on ensuring the language preference is maintained.
 */
export function LanguageHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for language parameter in URL
    const langParam = searchParams.get('lang')

    if (langParam && (langParam === 'en' || langParam === 'es')) {
      // Store language in Payload's expected format in localStorage
      try {
        // Get existing preferences
        let preferences = {}
        const prefsStr = localStorage.getItem('payload-preferences')

        if (prefsStr) {
          try {
            preferences = JSON.parse(prefsStr)
          } catch (e) {
            console.error('Error parsing preferences:', e)
          }
        }

        // Update language preference
        localStorage.setItem(
          'payload-preferences',
          JSON.stringify({
            ...preferences,
            language: langParam,
          }),
        )

        // Also set in cookies for good measure
        document.cookie = `payload-language=${langParam}; path=/; max-age=31536000`

        // Set HTML lang attribute
        document.documentElement.lang = langParam

        // Force page reload without the lang parameter to avoid issues with subsequent navigation
        // but preserve other parameters
        const url = new URL(window.location.href)
        url.searchParams.delete('lang')

        // Only reload if we actually removed the parameter
        if (window.location.href !== url.toString()) {
          window.location.href = url.toString()
        }
      } catch (e) {
        console.error('Error setting language preference:', e)
      }
    }
  }, [searchParams])

  // This component doesn't render anything visible
  return null
}

'use client'

import { useEffect, useState } from 'react'

/**
 * This component directly manipulates the language settings for Payload CMS
 */
export function LanguageScript() {
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Only run this logic once per page load
    if (isProcessing) return
    setIsProcessing(true)

    // Helper to get language from URL param
    const getLangParam = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('lang')
      } catch (e) {
        console.error('Error parsing URL params:', e)
        return null
      }
    }

    // Get current language preference from localStorage or URL
    const getPreferredLanguage = () => {
      // Check URL first (highest priority)
      const urlLang = getLangParam()
      if (urlLang === 'en' || urlLang === 'es') {
        return urlLang
      }

      // Check localStorage
      try {
        // Try different storage locations
        const payloadPrefs = localStorage.getItem('payload-preferences')
        if (payloadPrefs) {
          const prefs = JSON.parse(payloadPrefs)
          if (prefs && prefs.language && (prefs.language === 'en' || prefs.language === 'es')) {
            return prefs.language
          }
        }
      } catch (e) {
        console.error('Error reading localStorage:', e)
      }

      // Default to English
      return 'en'
    }

    // Apply language change
    const applyLanguage = (lang: string) => {
      // Update payload preferences in localStorage
      try {
        localStorage.setItem('payload-preferences', JSON.stringify({ language: lang }))

        // Set language in HTML tag
        document.documentElement.lang = lang

        // Set cookies for server-side detection
        document.cookie = `payload-language=${lang}; path=/; max-age=31536000`

        // Only reload if we're switching due to URL parameter
        const urlLang = getLangParam()
        if (urlLang) {
          // Remove the parameter from URL to prevent reload loops
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('lang')
          window.history.replaceState({}, '', newUrl.toString())

          // Force reload to apply language change
          window.location.reload()
        }
      } catch (e) {
        console.error('Error applying language settings:', e)
      }
    }

    // Execute language logic
    const preferredLang = getPreferredLanguage()
    applyLanguage(preferredLang)
  }, [isProcessing])

  // This component doesn't render anything
  return null
}

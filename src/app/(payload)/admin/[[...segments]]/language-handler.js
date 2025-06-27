// This file handles server-side language setting
// We need to inject this script into the page to ensure
// language preferences are set before Payload's React app initializes

;(function () {
  // Get language from URL parameter
  function getLanguageFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('lang')
    } catch (e) {
      console.error('Error getting language from URL:', e)
      return null
    }
  }

  // Function to set language in all the places Payload might look for it
  function setLanguageEverywhere(lang) {
    if (!lang) return

    try {
      // 1. Set in payload-preferences
      let preferences = {}
      try {
        const prefsStr = localStorage.getItem('payload-preferences')
        if (prefsStr) {
          preferences = JSON.parse(prefsStr)
        }
      } catch (e) {
        preferences = {}
      }

      // Update with language
      preferences = {
        ...preferences,
        language: lang,
      }

      // Save back to localStorage
      localStorage.setItem('payload-preferences', JSON.stringify(preferences))

      // 2. Set in i18next storage
      localStorage.setItem('i18nextLng', lang)

      // 3. Set in document language
      document.documentElement.lang = lang

      // 4. Set in cookies
      document.cookie = `i18next=${lang}; path=/; max-age=31536000`
      document.cookie = `payload-language=${lang}; path=/; max-age=31536000`

      console.log(`Language set to ${lang} via language-handler.js`)
    } catch (e) {
      console.error('Error setting language:', e)
    }
  }

  // Run immediately when script loads
  const urlLang = getLanguageFromURL()
  if (urlLang) {
    setLanguageEverywhere(urlLang)

    // Force reload without the query parameter to avoid URL pollution
    // but only if we haven't already done this (to avoid reload loops)
    if (!sessionStorage.getItem('language-just-set')) {
      // Mark that we've just set the language
      sessionStorage.setItem('language-just-set', 'true')

      // Remove the lang parameter from URL and reload
      const url = new URL(window.location.href)
      url.searchParams.delete('lang')
      window.location.replace(url.toString())
    } else {
      // Clear the flag after handling it
      sessionStorage.removeItem('language-just-set')
    }
  }
})()

'use client'

import React, { useEffect, useState } from 'react'

/**
 * Language switcher that works directly with Payload's preferences system
 */
const LanguageSwitcher: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')

  // On mount, check current language
  useEffect(() => {
    // Check localStorage for current language preference
    try {
      const preferences = localStorage.getItem('payload-preferences')
      if (preferences) {
        const parsed = JSON.parse(preferences)
        if (parsed && parsed.language) {
          setCurrentLanguage(parsed.language)
        }
      }
    } catch (e) {
      console.error('Error reading language preference:', e)
    }
  }, [])

  // Function to directly change language and reload page
  const changeLanguage = (lang: string) => {
    try {
      // Set the language preference directly in payload's localStorage format
      localStorage.setItem('payload-preferences', JSON.stringify({ language: lang }))

      // Force a full page reload to apply the language change
      window.location.reload()
    } catch (e) {
      console.error('Error setting language:', e)
    }
  }

  // Basic styling for language selector
  const buttonStyle = (isActive: boolean) => ({
    padding: '6px 12px',
    margin: '0 4px 0 0',
    background: isActive ? '#2a2a2a' : 'transparent',
    border: `1px solid ${isActive ? '#444' : '#333'}`,
    borderRadius: '4px',
    color: isActive ? 'white' : '#aaa',
    cursor: 'pointer',
  })

  return (
    <div style={{ padding: '16px', borderTop: '1px solid #333' }}>
      <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
        Language / Idioma
      </div>
      <div style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={() => changeLanguage('en')}
          style={buttonStyle(currentLanguage === 'en')}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => changeLanguage('es')}
          style={buttonStyle(currentLanguage === 'es')}
        >
          Español
        </button>
      </div>
    </div>
  )
}

export default LanguageSwitcher

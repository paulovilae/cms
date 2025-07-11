'use client'

import React, { useState } from 'react'

/**
 * SkipLink component allows keyboard users to bypass navigation
 * and jump directly to the main content area
 */
export const SkipLink: React.FC = () => {
  const [focused, setFocused] = useState(false)

  return (
    <a
      href="#main-content"
      className={`skip-link ${focused ? 'focused' : ''}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      Skip to main content
      <style jsx>{`
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          padding: 8px 16px;
          background-color: #0070f3;
          color: white;
          font-weight: 500;
          font-size: 16px;
          border-radius: 0 0 4px 0;
          z-index: 100;
          text-decoration: none;
          transition: top 0.2s ease;
        }

        .skip-link.focused {
          top: 0;
          outline: 3px solid #0070f3;
          outline-offset: 2px;
        }
      `}</style>
    </a>
  )
}

export default SkipLink

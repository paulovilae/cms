'use client'

import React, { useState, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'

interface ShortcutDefinition {
  keys: string[]
  description: string
  category: 'navigation' | 'search' | 'filters' | 'results' | 'general'
}

/**
 * Component to provide keyboard shortcuts documentation and functionality
 */
export const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Define all keyboard shortcuts
  const shortcuts: ShortcutDefinition[] = [
    { keys: ['Tab'], description: 'Navigate through interactive elements', category: 'navigation' },
    { keys: ['Shift', 'Tab'], description: 'Navigate backwards', category: 'navigation' },
    { keys: ['Enter'], description: 'Activate selected element', category: 'navigation' },
    { keys: ['Escape'], description: 'Close popups or dialogs', category: 'general' },
    { keys: ['/', 'Ctrl', 'f'], description: 'Focus on search input', category: 'search' },
    { keys: ['↑', '↓'], description: 'Navigate through search suggestions', category: 'search' },
    { keys: ['Alt', 'f'], description: 'Toggle filter panel', category: 'filters' },
    { keys: ['Alt', 'c'], description: 'Clear all filters', category: 'filters' },
    { keys: ['j', 'k'], description: 'Navigate through search results', category: 'results' },
    { keys: ['o'], description: 'Open selected result', category: 'results' },
    { keys: ['r'], description: 'Use as reference', category: 'results' },
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'general' },
  ]

  // Handle keyboard shortcut to open/close this dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ? key to toggle shortcuts dialog
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setIsOpen((prev) => !prev)
      }

      // Escape key to close dialog
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }

      // Handle various shortcuts when dialog is not open
      if (!isOpen) {
        // Ctrl+F or / to focus search
        if ((e.key === 'f' && e.ctrlKey) || e.key === '/') {
          const searchInput = document.querySelector('.search-input input') as HTMLElement
          if (searchInput && document.activeElement !== searchInput) {
            e.preventDefault()
            searchInput.focus()
          }
        }

        // Alt+F to toggle filters
        if (e.key === 'f' && e.altKey) {
          e.preventDefault()
          // Implementation would expand/collapse filters
        }

        // Alt+C to clear filters
        if (e.key === 'c' && e.altKey) {
          e.preventDefault()
          const clearButton = document.querySelector('.clear-filters-button') as HTMLElement
          if (clearButton) {
            clearButton.click()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Group shortcuts by category
  const categorizedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = []
      }
      acc[shortcut.category].push(shortcut)
      return acc
    },
    {} as Record<string, ShortcutDefinition[]>,
  )

  return (
    <>
      {/* Keyboard shortcut help button */}
      <button
        className="keyboard-shortcuts-button"
        onClick={() => setIsOpen(true)}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (press ? key)"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="keyboard-shortcuts-text">Keyboard Shortcuts</span>
      </button>

      {/* Keyboard shortcuts dialog */}
      {isOpen && (
        <div
          className="keyboard-shortcuts-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div className="keyboard-shortcuts-modal" role="document" tabIndex={-1}>
            <div className="keyboard-shortcuts-header">
              <h2 id="shortcuts-title" className="keyboard-shortcuts-title">
                Keyboard Shortcuts
              </h2>
              <button
                className="keyboard-shortcuts-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close keyboard shortcuts"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="keyboard-shortcuts-content">
              {Object.entries(categorizedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category} className="keyboard-shortcuts-category">
                  <h3 className="keyboard-shortcuts-category-title">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <ul className="keyboard-shortcuts-list">
                    {categoryShortcuts.map((shortcut, index) => (
                      <li key={index} className="keyboard-shortcuts-item">
                        <div className="keyboard-shortcuts-keys">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <kbd className="keyboard-shortcut-key">{key}</kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="keyboard-shortcut-plus">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="keyboard-shortcuts-description">{shortcut.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .keyboard-shortcuts-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: transparent;
          border: 1px solid var(--border-light, #e2e8f0);
          border-radius: 0.375rem;
          padding: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary, #4a5568);
          cursor: pointer;
          transition: all 0.2s;
        }

        .keyboard-shortcuts-button:hover {
          background-color: var(--background-hover, #f7fafc);
        }

        .keyboard-shortcuts-button:focus-visible {
          outline: 2px solid var(--focus-ring, #3182ce);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .keyboard-shortcuts-text {
            display: none;
          }
        }

        .keyboard-shortcuts-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        .keyboard-shortcuts-modal {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .keyboard-shortcuts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light, #e2e8f0);
        }

        .keyboard-shortcuts-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary, #2d3748);
          margin: 0;
        }

        .keyboard-shortcuts-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-tertiary, #718096);
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: background-color 0.2s;
        }

        .keyboard-shortcuts-close:hover {
          background-color: var(--background-hover, #f7fafc);
        }

        .keyboard-shortcuts-close:focus-visible {
          outline: 2px solid var(--focus-ring, #3182ce);
          outline-offset: 2px;
        }

        .keyboard-shortcuts-content {
          padding: 1rem;
        }

        .keyboard-shortcuts-category {
          margin-bottom: 1.5rem;
        }

        .keyboard-shortcuts-category-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary, #2d3748);
          margin: 0 0 0.75rem 0;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid var(--border-light, #e2e8f0);
        }

        .keyboard-shortcuts-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .keyboard-shortcuts-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-lighter, #f7fafc);
        }

        .keyboard-shortcuts-item:last-child {
          border-bottom: none;
        }

        .keyboard-shortcuts-keys {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .keyboard-shortcut-key {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: var(--background-secondary, #f7fafc);
          border: 1px solid var(--border-light, #e2e8f0);
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: var(--text-primary, #2d3748);
          min-width: 1.5rem;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .keyboard-shortcut-plus {
          color: var(--text-tertiary, #718096);
          font-size: 0.75rem;
          margin: 0 0.25rem;
        }

        .keyboard-shortcuts-description {
          color: var(--text-secondary, #4a5568);
          font-size: 0.875rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .keyboard-shortcuts-modal-backdrop,
          .keyboard-shortcuts-modal {
            animation: none;
          }
        }

        @media (prefers-color-scheme: dark) {
          .keyboard-shortcuts-modal {
            background-color: var(--background-primary, #1a202c);
          }

          .keyboard-shortcut-key {
            background-color: var(--background-tertiary, #2d3748);
            border-color: var(--border-medium, #4a5568);
            color: var(--text-primary, #f7fafc);
          }
        }
      `}</style>
    </>
  )
}

export default KeyboardShortcuts

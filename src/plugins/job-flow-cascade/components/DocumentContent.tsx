'use client'

import React, { useState, useEffect } from 'react'
import { useDocumentState } from '../hooks/useDocumentState'
import { DocumentSection, SectionType } from '../types'
import RichTextEditor from './RichTextEditor'

interface DocumentContentProps {
  readOnly?: boolean
}

/**
 * Main document content area - fullscreen layout without left sidebar
 * Uses horizontal tabs for section navigation and fullscreen document editing
 */
export const DocumentContent: React.FC<DocumentContentProps> = ({ readOnly = false }) => {
  const { sections, getSortedSections, createNewSection, updateSection, loading, error } =
    useDocumentState()
  const [activeSection, setActiveSection] = useState<DocumentSection | null>(null)
  const [isCreatingSection, setIsCreatingSection] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Set the first section as active when sections load
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      const sortedSections = getSortedSections()
      const firstSection = sortedSections.length > 0 ? sortedSections[0] : null
      if (firstSection) {
        setActiveSection(firstSection)
      }
    }
  }, [sections, activeSection, getSortedSections])

  // Handle section selection
  const handleSectionSelect = (section: DocumentSection) => {
    setActiveSection(section)
  }

  // Handle creating a new section
  const handleCreateSection = async () => {
    setIsCreatingSection(true)
    try {
      const newSection = await createNewSection(SectionType.CUSTOM, 'New Section', sections.length)
      if (newSection) {
        setActiveSection(newSection)
      }
    } catch (error) {
      console.error('Error creating section:', error)
    } finally {
      setIsCreatingSection(false)
    }
  }

  const sortedSections = getSortedSections()

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Horizontal tabs for section navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center px-6 py-3 space-x-1 overflow-x-auto">
          {sortedSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionSelect(section)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeSection?.id === section.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {section.title}
              {section.isGenerated && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  AI
                </span>
              )}
            </button>
          ))}

          {/* Add new section button */}
          {!readOnly && (
            <button
              onClick={handleCreateSection}
              disabled={isCreatingSection}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md border border-dashed border-gray-300 transition-colors"
            >
              {isCreatingSection ? 'Creating...' : '+ Add Section'}
            </button>
          )}
        </div>
      </div>

      {/* Main document editing area */}
      <div className="flex-1 overflow-y-auto">
        {activeSection ? (
          <div className="max-w-4xl mx-auto p-8">
            {/* Section header */}
            <div className="mb-6">
              <input
                type="text"
                value={activeSection.title}
                onChange={async (e) => {
                  const newTitle = e.target.value
                  // Optimistic update
                  setActiveSection({ ...activeSection, title: newTitle })

                  // Debounced save (you might want to implement proper debouncing)
                  if (!readOnly) {
                    try {
                      await updateSection(activeSection.id, { title: newTitle })
                    } catch (error) {
                      console.error('Failed to update section title:', error)
                      // Revert on error
                      setActiveSection(activeSection)
                    }
                  }
                }}
                className="text-3xl font-bold text-gray-900 bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                placeholder="Section Title"
                readOnly={readOnly}
                disabled={loading}
              />

              {/* Section metadata */}
              <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                <span>Type: {activeSection.type || 'Custom'}</span>
                {activeSection.isGenerated && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    AI Generated
                  </span>
                )}
                {activeSection.lastGeneratedAt && (
                  <span>
                    Last generated: {new Date(activeSection.lastGeneratedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Rich text editor area */}
            <div className="prose prose-lg max-w-none">
              <RichTextEditor
                content={activeSection.content}
                onChange={async (newContent: any) => {
                  if (!readOnly) {
                    // Optimistic update
                    setActiveSection({ ...activeSection, content: newContent })

                    // Save content
                    setIsSaving(true)
                    try {
                      await updateSection(activeSection.id, {
                        content: newContent,
                        isCompleted: true, // Mark as completed when content is added
                      })
                    } catch (error) {
                      console.error('Failed to update section content:', error)
                      // Revert on error
                      setActiveSection(activeSection)
                    } finally {
                      setIsSaving(false)
                    }
                  }
                }}
                readOnly={readOnly}
                placeholder={
                  readOnly
                    ? 'No content available for this section.'
                    : 'Start typing or use AI generation to create content for this section...'
                }
              />
            </div>

            {/* Section actions */}
            {!readOnly && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading || isSaving}
                  >
                    Generate with AI
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    disabled={loading || isSaving}
                  >
                    Regenerate
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    disabled={loading || isSaving}
                  >
                    Get Alternatives
                  </button>
                </div>

                {/* Status indicators */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {isSaving && (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Saving...
                    </span>
                  )}
                  {error && (
                    <span className="text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Error saving
                    </span>
                  )}
                  {!loading && !isSaving && !error && activeSection.isCompleted && (
                    <span className="text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Saved
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl text-gray-300 mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first section to get started with document editing.
              </p>
              {!readOnly && (
                <button
                  onClick={handleCreateSection}
                  disabled={isCreatingSection}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isCreatingSection ? 'Creating...' : 'Create First Section'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentContent

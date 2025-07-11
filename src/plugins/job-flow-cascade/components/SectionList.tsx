'use client'

import React from 'react'
import { useDocumentState } from '../hooks/useDocumentState'
import { DocumentSection, SectionType } from '../types'
import { useCascadeGeneration } from '../hooks/useCascadeGeneration'

interface SectionListProps {
  sections: DocumentSection[]
  activeSection: DocumentSection | null
  onSelectSection: (section: DocumentSection) => void
  readOnly?: boolean
}

/**
 * List of document sections with status indicators and controls
 */
export const SectionList: React.FC<SectionListProps> = ({
  sections,
  activeSection,
  onSelectSection,
  readOnly = false,
}) => {
  const { createNewSection, moveSection, deleteSection } = useDocumentState()
  const { isSectionGenerating } = useCascadeGeneration()

  // Add a new section
  const handleAddSection = async (type: SectionType) => {
    if (readOnly) return

    const title = getDefaultTitleForType(type)
    const newSection = await createNewSection(type, title)

    if (newSection) {
      onSelectSection(newSection)
    }
  }

  // Move a section up or down
  const handleMoveSection = async (sectionId: string, direction: 'up' | 'down') => {
    if (readOnly) return
    await moveSection(sectionId, direction)
  }

  // Delete a section
  const handleDeleteSection = async (sectionId: string) => {
    if (readOnly) return

    if (window.confirm('Are you sure you want to delete this section?')) {
      await deleteSection(sectionId)

      // If the deleted section was active, select the first available section
      if (activeSection && activeSection.id === sectionId && sections.length > 1) {
        const remainingSections = sections.filter((s) => s.id !== sectionId)
        const firstSection = remainingSections.length > 0 ? remainingSections[0] : null
        if (firstSection) {
          onSelectSection(firstSection)
        }
      }
    }
  }

  // Get a default title based on section type
  const getDefaultTitleForType = (type: SectionType): string => {
    switch (type) {
      case SectionType.INTRODUCTION:
        return 'Introduction'
      case SectionType.SUMMARY:
        return 'Summary'
      case SectionType.RESPONSIBILITIES:
        return 'Responsibilities'
      case SectionType.REQUIREMENTS:
        return 'Requirements'
      case SectionType.QUALIFICATIONS:
        return 'Qualifications'
      case SectionType.BENEFITS:
        return 'Benefits'
      case SectionType.CUSTOM:
        return 'Custom Section'
      default:
        return 'New Section'
    }
  }

  // Get status class for a section
  const getSectionStatusClass = (section: DocumentSection): string => {
    if (isSectionGenerating(section.id)) {
      return 'bg-blue-100 border-blue-500'
    }

    if (section.isCompleted) {
      return 'bg-green-100 border-green-500'
    }

    if (section.isGenerated) {
      return 'bg-purple-100 border-purple-500'
    }

    return 'bg-gray-100 border-gray-300'
  }

  return (
    <div className="section-list p-2">
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded">
        <h2 className="text-lg font-medium">Sections</h2>

        {!readOnly && (
          <div className="relative group">
            <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Add Section
            </button>

            {/* Dropdown for section types */}
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 hidden group-hover:block">
              <div className="py-1">
                {Object.values(SectionType).map((type) => (
                  <button
                    key={type}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleAddSection(type)}
                  >
                    {getDefaultTitleForType(type)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List of sections */}
      <ul className="space-y-1">
        {sections.map((section) => (
          <li
            key={section.id}
            className={`p-2 border-l-4 rounded cursor-pointer transition-colors ${getSectionStatusClass(
              section,
            )} ${activeSection?.id === section.id ? 'bg-opacity-70 shadow-sm' : ''}`}
            onClick={() => onSelectSection(section)}
          >
            <div className="flex justify-between items-center">
              <span className="truncate">{section.title}</span>

              {!readOnly && (
                <div className="flex space-x-1">
                  {/* Move up button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveSection(section.id, 'up')
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Move Up"
                  >
                    ↑
                  </button>

                  {/* Move down button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveSection(section.id, 'down')
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Move Down"
                  >
                    ↓
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSection(section.id)
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Section status indicator */}
            <div className="flex items-center text-xs mt-1">
              <span
                className={`px-1.5 py-0.5 rounded ${
                  section.isCompleted
                    ? 'bg-green-200 text-green-800'
                    : section.isGenerated
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isSectionGenerating(section.id)
                  ? 'Generating...'
                  : section.isCompleted
                    ? 'Completed'
                    : section.isGenerated
                      ? 'AI Generated'
                      : 'Draft'}
              </span>

              <span className="ml-2 text-gray-500">{section.type}</span>
            </div>
          </li>
        ))}

        {sections.length === 0 && (
          <li className="p-4 text-center text-gray-500">
            No sections yet. Add a section to get started.
          </li>
        )}
      </ul>
    </div>
  )
}

export default SectionList

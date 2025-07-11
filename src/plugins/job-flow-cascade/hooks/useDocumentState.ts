'use client'

import { useEffect } from 'react'
import { useDocumentContext } from '../context/DocumentProvider'
import { DocumentSection, SectionType, FlowDocument, DocumentStatus } from '../types'

/**
 * Custom hook for document state management
 *
 * This hook provides a simplified interface for working with documents and sections
 * by wrapping the DocumentContext with additional utility functions.
 */
export const useDocumentState = (documentId?: string) => {
  const documentContext = useDocumentContext()

  // Load document when documentId changes
  useEffect(() => {
    if (documentId && documentId !== 'new') {
      documentContext.fetchDocument(documentId)
    }
  }, [documentId])

  /**
   * Create a new section with defaults
   */
  const createNewSection = async (
    type: SectionType,
    title: string,
    order?: number,
  ): Promise<DocumentSection | null> => {
    // If order is not provided, add to the end
    const nextOrder = order ?? documentContext.sections.length

    return documentContext.createSection({
      title,
      type,
      order: nextOrder,
      isCompleted: false,
      isGenerated: false,
    })
  }

  /**
   * Duplicate an existing section
   */
  const duplicateSection = async (sectionId: string): Promise<DocumentSection | null> => {
    const section = documentContext.sections.find((s) => s.id === sectionId)

    if (!section) {
      console.error(`Section not found: ${sectionId}`)
      return null
    }

    // Create a copy with a new title
    return documentContext.createSection({
      title: `${section.title} (Copy)`,
      type: section.type,
      order: section.order + 1, // Insert after the original
      content: section.content,
      isCompleted: section.isCompleted,
      isGenerated: section.isGenerated,
    })
  }

  /**
   * Mark a section as complete or incomplete
   */
  const toggleSectionCompletion = async (
    sectionId: string,
    isCompleted: boolean,
  ): Promise<DocumentSection | null> => {
    return documentContext.updateSection(sectionId, { isCompleted })
  }

  /**
   * Get sections sorted by order
   */
  const getSortedSections = (): DocumentSection[] => {
    return [...documentContext.sections].sort((a, b) => a.order - b.order)
  }

  /**
   * Save document title
   */
  const saveDocumentTitle = async (title: string): Promise<FlowDocument | null> => {
    return documentContext.updateDocument({ title })
  }

  /**
   * Update document status
   */
  const updateDocumentStatus = async (status: string): Promise<FlowDocument | null> => {
    // Cast the string to DocumentStatus to ensure type safety
    return documentContext.updateDocument({ status: status as DocumentStatus })
  }

  /**
   * Move a section up or down in the order
   */
  const moveSection = async (sectionId: string, direction: 'up' | 'down'): Promise<boolean> => {
    const sortedSections = getSortedSections()
    const index = sortedSections.findIndex((s) => s.id === sectionId)

    if (index === -1) {
      console.error(`Section not found: ${sectionId}`)
      return false
    }

    // Calculate new index
    const newIndex =
      direction === 'up' ? Math.max(0, index - 1) : Math.min(sortedSections.length - 1, index + 1)

    // Don't do anything if already at the boundary
    if (newIndex === index) {
      return true
    }

    // Swap orders
    const targetSection = sortedSections[newIndex]

    // Check if targetSection exists
    if (!targetSection) {
      console.error(`Target section not found at index ${newIndex}`)
      return false
    }

    // Check if current section exists (it should, based on previous checks, but TypeScript needs reassurance)
    const currentSection = sortedSections[index]
    if (!currentSection) {
      console.error(`Current section not found at index ${index}`)
      return false
    }

    const currentOrder = currentSection.order
    const targetOrder = targetSection.order

    // Update orders
    await documentContext.updateSection(sectionId, { order: targetOrder })
    await documentContext.updateSection(targetSection.id, { order: currentOrder })

    return true
  }

  return {
    ...documentContext,
    createNewSection,
    duplicateSection,
    toggleSectionCompletion,
    getSortedSections,
    saveDocumentTitle,
    updateDocumentStatus,
    moveSection,
  }
}

export default useDocumentState

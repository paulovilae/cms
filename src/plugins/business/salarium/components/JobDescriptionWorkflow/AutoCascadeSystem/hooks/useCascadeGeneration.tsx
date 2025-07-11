'use client'

import { useState, useCallback } from 'react'
import { createBusinessHeaders } from '@/utilities/businessContext'

export interface CascadeState {
  isGenerating: boolean // Whether cascade generation is active
  currentSectionIndex: number // Index of section being generated
  completedSections: string[] // IDs of completed sections
  queuedSections: string[] // IDs of sections waiting to be generated
  generationProgress: number // Overall progress (0-100)
  error: string | null // Error message if generation fails
}

export interface CascadeOptions {
  startFromSection: number // Which section to start generation from
  regenerateCompleted: boolean // Whether to regenerate completed sections
  preserveSections: string[] // Section IDs to preserve (not regenerate)
  stylePreference: 'detailed' | 'concise' | 'technical' // Output style
  generateAll: boolean // Whether to generate all sections at once
}

interface SectionContext {
  id: string
  title: string
  content: string
}

interface DocumentSection {
  id: string
  title: string
  content: any // This would ideally be a more specific Slate type
  isCompleted?: boolean
  stepNumber?: number
}

// Helper function to calculate progress percentage
const calculateProgress = (total: number, completed: number): number => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * Main hook for handling the cascade generation process
 */
export const useCascadeGeneration = (documentId: string, options: CascadeOptions) => {
  const [state, setState] = useState<CascadeState>({
    isGenerating: false,
    currentSectionIndex: options.startFromSection,
    completedSections: [],
    queuedSections: [],
    generationProgress: 0,
    error: null,
  })

  // Function to serialize Slate content to plain text
  // This is a placeholder - the actual implementation would depend on your Slate.js setup
  const serializeSlateToText = (content: any): string => {
    if (!content || !Array.isArray(content) || content.length === 0) return ''

    // Simple serialization logic - would need to be expanded for real implementation
    return content
      .map((node) => {
        if (typeof node === 'string') return node
        if (!node.children) return ''
        return serializeSlateToText(node.children)
      })
      .join('\n')
  }

  // Function to process a section with AI
  const processSection = async (
    sectionId: string,
    prompt: string | null,
    context: SectionContext[],
  ) => {
    const response = await fetch(`/api/flow-instances/${documentId}/process-section`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...createBusinessHeaders('salarium'),
      },
      body: JSON.stringify({
        sectionId,
        prompt,
        context,
        stylePreference: options.stylePreference,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to process section: ${response.status}`)
    }

    const data = await response.json()
    return data.content
  }

  // Function to update section content in the database
  const updateSectionContent = async (sectionId: string, content: any) => {
    const response = await fetch(`/api/flow-instances/${documentId}/update-section`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...createBusinessHeaders('salarium'),
      },
      body: JSON.stringify({
        sectionId,
        content,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to update section: ${response.status}`)
    }

    return true
  }

  // Function to get all sections from the document
  const getSections = async (): Promise<DocumentSection[]> => {
    const response = await fetch(`/api/flow-instances/${documentId}`, {
      headers: createBusinessHeaders('salarium'),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to get document: ${response.status}`)
    }

    const data = await response.json()
    return data.sections || []
  }

  // Start the cascade generation process
  const startCascadeGeneration = useCallback(async () => {
    try {
      // Get all sections
      const sections = await getSections()

      // Filter sections based on options
      const sectionsToProcess = sections
        .filter((s: DocumentSection, idx: number) => idx >= options.startFromSection)
        .filter((s: DocumentSection) => !options.preserveSections.includes(s.id))

      setState((prev) => ({
        ...prev,
        isGenerating: true,
        queuedSections: sectionsToProcess.map((s) => s.id),
        completedSections: [],
        generationProgress: 0,
        error: null,
      }))

      // Start processing sections
      for (let i = 0; i < sectionsToProcess.length; i++) {
        const section = sectionsToProcess[i]

        // Skip if section is undefined or should be preserved
        if (!section || options.preserveSections.includes(section.id)) {
          continue
        }

        // Update current section in state
        const sectionIndex = sections.findIndex((s: DocumentSection) => s.id === section.id)
        setState((prev) => ({
          ...prev,
          currentSectionIndex: sectionIndex,
        }))

        // Get context from previous sections
        const context = sections
          .filter((s: DocumentSection, idx: number) => idx < sectionIndex && s.content)
          .map((s: DocumentSection) => ({
            id: s.id,
            title: s.title,
            content: serializeSlateToText(s.content),
          }))

        // Process this section
        const result = await processSection(section.id, null, context)

        // Update section content
        await updateSectionContent(section.id, result)

        // Update completed sections and progress
        setState((prev) => ({
          ...prev,
          completedSections: [...prev.completedSections, section.id],
          generationProgress: calculateProgress(
            sectionsToProcess.length,
            prev.completedSections.length + 1,
          ),
        }))
      }

      // All sections processed
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        queuedSections: [],
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Generation failed',
        isGenerating: false,
      }))
    }
  }, [documentId, options])

  // Cancel the generation process
  const cancelGeneration = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isGenerating: false,
      queuedSections: [],
    }))
  }, [])

  return {
    ...state,
    startCascadeGeneration,
    cancelGeneration,
  }
}

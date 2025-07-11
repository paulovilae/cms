'use client'

import { useState } from 'react'
import { useCascadeContext } from '../context/CascadeProvider'
import { GenerationOptions, DocumentSection } from '../types'

/**
 * Custom hook for AI-powered document generation
 *
 * This hook provides a simplified interface for generating content with AI,
 * including state management for the generation process.
 */
export const useCascadeGeneration = () => {
  const cascadeContext = useCascadeContext()
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)

  /**
   * Generate content for a single section
   */
  const generateSection = async (sectionId: string): Promise<boolean> => {
    try {
      setIsGenerating(true)
      setCurrentSection(sectionId)
      setGenerationError(null)

      const result = await cascadeContext.generateSection(sectionId)

      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during generation'
      setGenerationError(errorMessage)
      return false
    } finally {
      setIsGenerating(false)
      setCurrentSection(null)
    }
  }

  /**
   * Generate content for all sections in cascade
   */
  const generateFullDocument = async (startSectionId: string): Promise<boolean> => {
    try {
      setIsGenerating(true)
      setGenerationError(null)

      const result = await cascadeContext.generateCascade(startSectionId)

      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during cascade generation'
      setGenerationError(errorMessage)
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Generate alternative content for a section
   */
  const generateAlternative = async (sectionId: string): Promise<boolean> => {
    try {
      setIsGenerating(true)
      setCurrentSection(sectionId)
      setGenerationError(null)

      const result = await cascadeContext.generateAlternative(sectionId)

      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during alternative generation'
      setGenerationError(errorMessage)
      return false
    } finally {
      setIsGenerating(false)
      setCurrentSection(null)
    }
  }

  /**
   * Update generation options
   */
  const updateOptions = (options: Partial<GenerationOptions>): void => {
    cascadeContext.setOptions({
      ...cascadeContext.options,
      ...options,
    })
  }

  /**
   * Cancel the current generation process
   */
  const cancelGeneration = (): void => {
    cascadeContext.cancelGeneration()
    setIsGenerating(false)
    setCurrentSection(null)
  }

  /**
   * Check if a section is currently being generated
   */
  const isSectionGenerating = (sectionId: string): boolean => {
    return isGenerating && cascadeContext.currentSectionId === sectionId
  }

  /**
   * Get the generation progress for the current operation
   */
  const getProgress = (): number => {
    return cascadeContext.progress
  }

  return {
    // State
    isGenerating,
    currentSection,
    generationError,
    options: cascadeContext.options,
    progress: cascadeContext.progress,

    // Actions
    generateSection,
    generateFullDocument,
    generateAlternative,
    updateOptions,
    cancelGeneration,
    isSectionGenerating,
    getProgress,

    // History
    fetchHistory: cascadeContext.fetchHistory,
    history: cascadeContext.history,
  }
}

export default useCascadeGeneration

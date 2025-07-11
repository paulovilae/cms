'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useDocumentContext } from './DocumentProvider'
import {
  CascadeContextType,
  GenerationOptions,
  GenerationHistory,
  GenerationType,
  DocumentSection,
} from '../types'

// Create the cascade context with default values
const CascadeContext = createContext<CascadeContextType>({
  generating: false,
  currentSectionId: null,
  progress: 0,
  options: {
    style: 'professional',
    tone: 'formal',
    length: 'standard',
  },
  history: [],
  setOptions: () => {},
  generateSection: async () => false,
  generateCascade: async () => false,
  generateAlternative: async () => false,
  cancelGeneration: () => {},
  fetchHistory: async () => [],
})

interface CascadeProviderProps {
  children: ReactNode
}

/**
 * Cascade Provider Component
 *
 * This provider manages the AI generation state and workflow.
 * It provides methods for generating content for individual sections
 * or cascading through multiple sections.
 */
export const CascadeProvider: React.FC<CascadeProviderProps> = ({ children }) => {
  const [generating, setGenerating] = useState<boolean>(false)
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [options, setOptions] = useState<GenerationOptions>({
    style: 'professional',
    tone: 'formal',
    length: 'standard',
  })
  const [history, setHistory] = useState<GenerationHistory[]>([])
  const [cancellationToken, setCancellationToken] = useState<boolean>(false)

  // Get document context
  const { document, sections, updateSection } = useDocumentContext()

  // Reset generation state when document changes
  useEffect(() => {
    setGenerating(false)
    setCurrentSectionId(null)
    setProgress(0)
    setHistory([])
  }, [document?.id])

  // Generate content for a single section
  const generateSection = async (sectionId: string): Promise<boolean> => {
    if (generating) {
      console.warn('Already generating content')
      return false
    }

    setGenerating(true)
    setCurrentSectionId(sectionId)
    setProgress(0)
    setCancellationToken(false)

    try {
      // Find the section
      const section = sections.find((s) => s.id === sectionId)
      if (!section) {
        throw new Error(`Section not found: ${sectionId}`)
      }

      // Update progress
      setProgress(10)

      // Build prompt based on section type and options
      const prompt = buildPrompt(section, options)

      // Check for cancellation
      if (cancellationToken) {
        throw new Error('Generation cancelled')
      }

      // Update progress
      setProgress(30)

      // Send request to AI provider
      const generatedContent = await generateContent(prompt, options)

      // Check for cancellation
      if (cancellationToken) {
        throw new Error('Generation cancelled')
      }

      // Update progress
      setProgress(70)

      // Save generation history
      await saveGenerationHistory({
        documentId: document?.id || '',
        sectionId,
        type: GenerationType.INITIAL,
        prompt,
        response: generatedContent,
      })

      // Check for cancellation
      if (cancellationToken) {
        throw new Error('Generation cancelled')
      }

      // Update progress
      setProgress(90)

      // Update section with generated content
      await updateSection(sectionId, {
        content: generatedContent,
        isGenerated: true,
        lastGeneratedAt: new Date().toISOString(),
      })

      // Update progress
      setProgress(100)

      return true
    } catch (err) {
      console.error('Error generating content:', err)
      return false
    } finally {
      // Reset generation state
      setGenerating(false)
      setCurrentSectionId(null)
      setCancellationToken(false)
    }
  }

  // Generate content for multiple sections in cascade
  const generateCascade = async (startSectionId: string): Promise<boolean> => {
    if (generating) {
      console.warn('Already generating content')
      return false
    }

    setGenerating(true)
    setCancellationToken(false)

    try {
      // Find starting index
      const startIndex = sections.findIndex((s) => s.id === startSectionId)
      if (startIndex === -1) {
        throw new Error(`Start section not found: ${startSectionId}`)
      }

      // Generate for all sections from startIndex
      const sectionsToGenerate = sections.slice(startIndex)

      // Calculate progress steps
      const progressStep = 100 / sectionsToGenerate.length

      // Generate for each section sequentially
      for (let i = 0; i < sectionsToGenerate.length; i++) {
        const section = sectionsToGenerate[i]

        // Check for cancellation
        if (cancellationToken) {
          throw new Error('Generation cancelled')
        }

        // Make sure section exists before using it
        if (!section) {
          console.warn(`Section at index ${i} is undefined, skipping`)
          continue
        }

        // Set current section
        setCurrentSectionId(section.id)

        // Calculate base progress for this section
        const baseProgress = i * progressStep
        setProgress(baseProgress)

        // Generate content for this section
        await generateSection(section.id)

        // Update progress
        setProgress(baseProgress + progressStep)
      }

      return true
    } catch (err) {
      console.error('Error generating cascade:', err)
      return false
    } finally {
      // Reset generation state
      setGenerating(false)
      setCurrentSectionId(null)
      setCancellationToken(false)
      setProgress(0)
    }
  }

  // Generate alternative content for a section
  const generateAlternative = async (sectionId: string): Promise<boolean> => {
    if (generating) {
      console.warn('Already generating content')
      return false
    }

    setGenerating(true)
    setCurrentSectionId(sectionId)
    setProgress(0)
    setCancellationToken(false)

    try {
      // Find the section
      const section = sections.find((s) => s.id === sectionId)
      if (!section) {
        throw new Error(`Section not found: ${sectionId}`)
      }

      // Update progress
      setProgress(10)

      // Build prompt for alternative
      const prompt = buildPrompt(section, options, true)

      // Check for cancellation
      if (cancellationToken) {
        throw new Error('Generation cancelled')
      }

      // Update progress
      setProgress(30)

      // Send request to AI provider
      const generatedContent = await generateContent(prompt, options)

      // Check for cancellation
      if (cancellationToken) {
        throw new Error('Generation cancelled')
      }

      // Update progress
      setProgress(70)

      // Save generation history
      await saveGenerationHistory({
        documentId: document?.id || '',
        sectionId,
        type: GenerationType.ALTERNATIVE,
        prompt,
        response: generatedContent,
      })

      // Check for cancellation
      if (cancellationToken) {
        throw new Error('Generation cancelled')
      }

      // Update progress
      setProgress(90)

      // Update section with generated content
      await updateSection(sectionId, {
        content: generatedContent,
        isGenerated: true,
        lastGeneratedAt: new Date().toISOString(),
      })

      // Update progress
      setProgress(100)

      return true
    } catch (err) {
      console.error('Error generating alternative:', err)
      return false
    } finally {
      // Reset generation state
      setGenerating(false)
      setCurrentSectionId(null)
      setCancellationToken(false)
    }
  }

  // Cancel ongoing generation
  const cancelGeneration = () => {
    if (generating) {
      setCancellationToken(true)
    }
  }

  // Fetch generation history for a section
  const fetchHistory = async (sectionId: string): Promise<GenerationHistory[]> => {
    try {
      // Fetch history from Payload API
      const response = await fetch(
        `/api/generation-history?where[sectionId][equals]=${sectionId}&sort=createdAt`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`)
      }

      const data = await response.json()
      const sectionHistory = data.docs || []

      // Update history state
      setHistory(sectionHistory)

      return sectionHistory
    } catch (err) {
      console.error('Error fetching history:', err)
      return []
    }
  }

  // Build prompt based on section type and options
  const buildPrompt = (
    section: DocumentSection,
    options: GenerationOptions,
    isAlternative = false,
  ): string => {
    // Get document title for context
    const documentTitle = document?.title || 'Document'

    // Base prompt with section type
    let prompt = `Generate content for the "${section.title}" section of a document titled "${documentTitle}".`

    // Add style instructions
    if (options.style) {
      prompt += ` Use a ${options.style} style.`
    }

    // Add tone instructions
    if (options.tone) {
      prompt += ` The tone should be ${options.tone}.`
    }

    // Add length instructions
    if (options.length) {
      const lengthMap = {
        concise: 'Keep it brief and to the point.',
        standard: 'Use a standard length with enough detail.',
        detailed: 'Provide comprehensive and detailed information.',
      }
      prompt += ` ${lengthMap[options.length as keyof typeof lengthMap]}`
    }

    // Add audience instructions
    if (options.audience) {
      prompt += ` The target audience is ${options.audience}.`
    }

    // Add keywords
    if (options.keywords && options.keywords.length > 0) {
      prompt += ` Include these keywords: ${options.keywords.join(', ')}.`
    }

    // Add constraints
    if (options.constraints && options.constraints.length > 0) {
      prompt += ` Follow these constraints: ${options.constraints.join('. ')}.`
    }

    // For alternatives, ask for different approach
    if (isAlternative) {
      prompt += ` Create an ALTERNATIVE version that is significantly different from previous generations.`
    }

    // Add specific instructions based on section type
    switch (section.type) {
      case 'introduction':
        prompt += ' This section should provide a compelling introduction that captures interest.'
        break
      case 'summary':
        prompt += ' This section should provide a concise overview of the key points.'
        break
      case 'responsibilities':
        prompt += ' This section should outline the main duties and responsibilities.'
        break
      case 'requirements':
        prompt += ' This section should list the necessary requirements and prerequisites.'
        break
      case 'qualifications':
        prompt += ' This section should detail the qualifications and skills needed.'
        break
      case 'benefits':
        prompt += ' This section should highlight the advantages and benefits offered.'
        break
    }

    return prompt
  }

  // Generate content using AI provider
  const generateContent = async (prompt: string, options: GenerationOptions): Promise<any> => {
    // This would normally use Payload's AI provider system
    // For now, we'll simulate a response

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simple mock response based on prompt
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `Generated content for prompt: ${prompt.substring(0, 50)}...`,
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `Style: ${options.style}, Tone: ${options.tone}, Length: ${options.length}`,
            },
          ],
        },
      ],
    }
  }

  // Save generation history
  const saveGenerationHistory = async (
    historyData: Partial<GenerationHistory>,
  ): Promise<GenerationHistory | null> => {
    try {
      // Create history via Payload API
      const response = await fetch('/api/generation-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyData),
      })

      if (!response.ok) {
        throw new Error(`Failed to save history: ${response.statusText}`)
      }

      const data = await response.json()

      // Update history state
      setHistory([...history, data.doc])

      return data.doc
    } catch (err) {
      console.error('Error saving history:', err)
      return null
    }
  }

  return (
    <CascadeContext.Provider
      value={{
        generating,
        currentSectionId,
        progress,
        options,
        history,
        setOptions,
        generateSection,
        generateCascade,
        generateAlternative,
        cancelGeneration,
        fetchHistory,
      }}
    >
      {children}
    </CascadeContext.Provider>
  )
}

// Custom hook to use the cascade context
export const useCascadeContext = () => useContext(CascadeContext)

export default CascadeProvider

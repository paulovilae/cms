'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import {
  DocumentContextType,
  FlowDocument,
  DocumentSection,
  DocumentStatus,
  SectionType,
} from '../types'

// Enhanced document context with additional state management
const DocumentContext = createContext<DocumentContextType>({
  document: null,
  sections: [],
  loading: false,
  error: null,
  fetchDocument: async () => null,
  fetchSections: async () => [],
  updateDocument: async () => null,
  createSection: async () => null,
  updateSection: async () => null,
  deleteSection: async () => false,
  reorderSections: async () => [],
})

interface DocumentProviderProps {
  documentId?: string
  children: ReactNode
}

// LocalStorage keys for offline fallback
const STORAGE_KEYS = {
  DOCUMENT: 'jfc_document_',
  SECTIONS: 'jfc_sections_',
  OFFLINE_CHANGES: 'jfc_offline_changes_',
}

/**
 * Enhanced Document Provider Component
 *
 * This provider manages the state of the document and its sections with:
 * - Improved error handling and loading states
 * - LocalStorage fallback for offline use
 * - Optimistic updates for better UX
 * - Automatic synchronization when online
 */
export const DocumentProvider: React.FC<DocumentProviderProps> = ({ documentId, children }) => {
  const [document, setDocument] = useState<FlowDocument | null>(null)
  const [sections, setSections] = useState<DocumentSection[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState<boolean>(false)

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncOfflineChanges()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fetch document and sections when documentId changes
  useEffect(() => {
    if (documentId && documentId !== 'new') {
      fetchDocument(documentId)
    } else if (documentId === 'new') {
      // Initialize new document
      initializeNewDocument()
    }
  }, [documentId])

  // Initialize a new document with default sections
  const initializeNewDocument = useCallback(() => {
    const newDocument: FlowDocument = {
      id: 'new',
      title: 'New Job Description',
      status: DocumentStatus.DRAFT,
      businessUnit: 'salarium', // Default to salarium
      metadata: {
        createdAt: new Date().toISOString(),
        version: 1,
      },
    }

    setDocument(newDocument)
    setSections([])
    setError(null)
  }, [])

  // Save to localStorage for offline fallback
  const saveToLocalStorage = useCallback((doc: FlowDocument | null, secs: DocumentSection[]) => {
    if (!doc?.id) return

    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENT + doc.id, JSON.stringify(doc))
      localStorage.setItem(STORAGE_KEYS.SECTIONS + doc.id, JSON.stringify(secs))
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
  }, [])

  // Load from localStorage
  const loadFromLocalStorage = useCallback((docId: string) => {
    try {
      const docData = localStorage.getItem(STORAGE_KEYS.DOCUMENT + docId)
      const sectionsData = localStorage.getItem(STORAGE_KEYS.SECTIONS + docId)

      if (docData && sectionsData) {
        const doc = JSON.parse(docData) as FlowDocument
        const secs = JSON.parse(sectionsData) as DocumentSection[]
        return { document: doc, sections: secs }
      }
    } catch (err) {
      console.warn('Failed to load from localStorage:', err)
    }
    return null
  }, [])

  // Sync offline changes when coming back online
  const syncOfflineChanges = useCallback(async () => {
    if (!hasUnsyncedChanges || !document?.id) return

    try {
      // Attempt to sync document and sections
      if (document.id !== 'new') {
        await updateDocument(document)
      }

      // Sync sections
      for (const section of sections) {
        if (section.id.startsWith('temp_')) {
          // Create new sections that were created offline
          await createSection(section)
        } else {
          // Update existing sections
          await updateSection(section.id, section)
        }
      }

      setHasUnsyncedChanges(false)
      // Clear offline changes from localStorage
      if (document.id) {
        localStorage.removeItem(STORAGE_KEYS.OFFLINE_CHANGES + document.id)
      }
    } catch (err) {
      console.error('Failed to sync offline changes:', err)
    }
  }, [hasUnsyncedChanges, document, sections])

  // Enhanced fetch document with offline fallback
  const fetchDocument = async (id: string): Promise<FlowDocument | null> => {
    setLoading(true)
    setError(null)

    try {
      if (!isOnline) {
        // Try to load from localStorage when offline
        const cached = loadFromLocalStorage(id)
        if (cached) {
          setDocument(cached.document)
          setSections(cached.sections)
          return cached.document
        }
        throw new Error('Document not available offline')
      }

      // Fetch document from Payload API
      const response = await fetch(`/api/flow-documents/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-business': 'salarium', // Add business context
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`)
      }

      const data = await response.json()
      const doc = data.doc || data

      setDocument(doc)

      // Also fetch sections for this document
      const sectionsData = await fetchSections(id)

      // Save to localStorage for offline access
      saveToLocalStorage(doc, sectionsData)

      return doc
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error fetching document:', err)

      // Try localStorage as fallback
      const cached = loadFromLocalStorage(id)
      if (cached) {
        setDocument(cached.document)
        setSections(cached.sections)
        setError('Loaded from offline cache')
        return cached.document
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  // Enhanced fetch sections with better error handling
  const fetchSections = async (docId: string): Promise<DocumentSection[]> => {
    if (!docId || docId === 'new') return []

    try {
      if (!isOnline) {
        // Return cached sections when offline
        const cached = loadFromLocalStorage(docId)
        return cached?.sections || []
      }

      // Fetch sections from Payload API with filtering by documentId
      const response = await fetch(
        `/api/document-sections?where[documentId][equals]=${docId}&sort=order`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-business': 'salarium',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch sections: ${response.statusText}`)
      }

      const data = await response.json()
      const sectionsData = data.docs || []

      setSections(sectionsData)
      return sectionsData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching sections:', err)

      // Try to return cached sections on error
      const cached = loadFromLocalStorage(docId)
      if (cached?.sections) {
        setSections(cached.sections)
        return cached.sections
      }

      return []
    }
  }

  // Enhanced update document with optimistic updates and offline support
  const updateDocument = async (data: Partial<FlowDocument>): Promise<FlowDocument | null> => {
    if (!document || !document.id || document.id === 'new') {
      // Create new document
      return createDocument(data)
    }

    // Optimistic update
    const optimisticDoc = { ...document, ...data, updatedAt: new Date().toISOString() }
    setDocument(optimisticDoc)

    try {
      if (!isOnline) {
        // Store offline changes
        setHasUnsyncedChanges(true)
        saveToLocalStorage(optimisticDoc, sections)
        localStorage.setItem(
          STORAGE_KEYS.OFFLINE_CHANGES + document.id,
          JSON.stringify({ type: 'update_document', data }),
        )
        return optimisticDoc
      }

      setLoading(true)

      // Update document via Payload API
      const response = await fetch(`/api/flow-documents/${document.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-business': 'salarium',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        // Revert optimistic update on failure
        setDocument(document)
        throw new Error(`Failed to update document: ${response.statusText}`)
      }

      const result = await response.json()
      const updatedDoc = result.doc || result
      setDocument(updatedDoc)

      // Save to localStorage
      saveToLocalStorage(updatedDoc, sections)

      return updatedDoc
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error updating document:', err)

      // Revert optimistic update on error
      setDocument(document)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Enhanced create document with default sections
  const createDocument = async (data: Partial<FlowDocument>): Promise<FlowDocument | null> => {
    setLoading(true)
    setError(null)

    try {
      const documentData = {
        title: data.title || 'New Job Description',
        status: data.status || DocumentStatus.DRAFT,
        businessUnit: data.businessUnit || 'salarium',
        metadata: {
          ...data.metadata,
          createdAt: new Date().toISOString(),
          version: 1,
        },
      }

      if (!isOnline) {
        // Create temporary document for offline use
        const tempDoc: FlowDocument = {
          id: `temp_${Date.now()}`,
          ...documentData,
        }
        setDocument(tempDoc)
        setHasUnsyncedChanges(true)
        saveToLocalStorage(tempDoc, [])

        // Create default sections
        await createDefaultSections(tempDoc.id)

        return tempDoc
      }

      // Create document via Payload API
      const response = await fetch('/api/flow-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-business': 'salarium',
        },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create document: ${response.statusText}`)
      }

      const result = await response.json()
      const newDoc = result.doc || result
      setDocument(newDoc)

      // Create default sections for new document
      await createDefaultSections(newDoc.id)

      // Save to localStorage
      saveToLocalStorage(newDoc, sections)

      return newDoc
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error creating document:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create default sections for a new document
  const createDefaultSections = async (docId: string) => {
    // Don't create sections for temporary/new documents
    if (!docId || docId === 'new' || docId.startsWith('temp_')) {
      return
    }

    const defaultSections = [
      { type: SectionType.INTRODUCTION, title: 'Job Title & Overview', order: 0 },
      { type: SectionType.SUMMARY, title: 'Job Summary', order: 1 },
      { type: SectionType.RESPONSIBILITIES, title: 'Key Responsibilities', order: 2 },
      { type: SectionType.REQUIREMENTS, title: 'Requirements', order: 3 },
      { type: SectionType.QUALIFICATIONS, title: 'Qualifications', order: 4 },
      { type: SectionType.BENEFITS, title: 'Benefits & Compensation', order: 5 },
    ]

    for (const sectionData of defaultSections) {
      await createSection({
        ...sectionData,
        documentId: docId,
        content: null,
        isCompleted: false,
        isGenerated: false,
      })
    }
  }

  // Enhanced create section with optimistic updates
  const createSection = async (data: Partial<DocumentSection>): Promise<DocumentSection | null> => {
    const sectionData = {
      ...data,
      documentId: data.documentId || document?.id,
      order: data.order ?? sections.length,
      isCompleted: data.isCompleted ?? false,
      isGenerated: data.isGenerated ?? false,
    }

    // Validate that we have a valid document ID
    if (
      !sectionData.documentId ||
      sectionData.documentId === 'new' ||
      sectionData.documentId.startsWith('temp_')
    ) {
      console.warn('Cannot create section: Invalid document ID', sectionData.documentId)
      setError('Cannot create section: Document must be saved first')
      return null
    }

    // Create optimistic section
    const optimisticSection: DocumentSection = {
      id: isOnline ? `temp_${Date.now()}` : `temp_${Date.now()}`,
      title: sectionData.title || 'New Section',
      documentId: sectionData.documentId || '',
      type: sectionData.type,
      content: sectionData.content,
      order: sectionData.order,
      isCompleted: sectionData.isCompleted,
      isGenerated: sectionData.isGenerated,
      lastGeneratedAt: sectionData.lastGeneratedAt,
    }

    // Optimistic update
    const updatedSections = [...sections, optimisticSection]
    setSections(updatedSections)

    try {
      if (!isOnline) {
        // Store offline changes
        setHasUnsyncedChanges(true)
        saveToLocalStorage(document, updatedSections)
        return optimisticSection
      }

      setLoading(true)

      // Create section via Payload API
      // Fix: Ensure documentId is properly formatted for the relationship field
      const apiSectionData = {
        ...sectionData,
        documentId: sectionData.documentId, // This should be the document ID string
      }

      const response = await fetch('/api/document-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-business': 'salarium',
        },
        body: JSON.stringify(apiSectionData),
      })

      if (!response.ok) {
        // Revert optimistic update on failure
        setSections(sections)
        const errorText = await response.text()
        throw new Error(`Failed to create section: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      const newSection = result.doc || result

      // Replace optimistic section with real section
      const finalSections = updatedSections.map((s) =>
        s.id === optimisticSection.id ? newSection : s,
      )
      setSections(finalSections)

      // Save to localStorage
      saveToLocalStorage(document, finalSections)

      return newSection
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error creating section:', err)

      // Revert optimistic update on error
      setSections(sections)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Enhanced update section with optimistic updates
  const updateSection = async (
    id: string,
    data: Partial<DocumentSection>,
  ): Promise<DocumentSection | null> => {
    const currentSection = sections.find((s) => s.id === id)
    if (!currentSection) {
      setError(`Section not found: ${id}`)
      return null
    }

    // Optimistic update
    const optimisticSection = {
      ...currentSection,
      ...data,
      lastGeneratedAt: data.isGenerated ? new Date().toISOString() : currentSection.lastGeneratedAt,
    }
    const optimisticSections = sections.map((s) => (s.id === id ? optimisticSection : s))
    setSections(optimisticSections)

    try {
      if (!isOnline) {
        // Store offline changes
        setHasUnsyncedChanges(true)
        saveToLocalStorage(document, optimisticSections)
        return optimisticSection
      }

      setLoading(true)

      // Update section via Payload API
      const response = await fetch(`/api/document-sections/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-business': 'salarium',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        // Revert optimistic update on failure
        setSections(sections)
        throw new Error(`Failed to update section: ${response.statusText}`)
      }

      const result = await response.json()
      const updatedSection = result.doc || result

      // Update sections state with real data
      const finalSections = sections.map((s) => (s.id === id ? updatedSection : s))
      setSections(finalSections)

      // Save to localStorage
      saveToLocalStorage(document, finalSections)

      return updatedSection
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error updating section:', err)

      // Revert optimistic update on error
      setSections(sections)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Enhanced delete section with optimistic updates
  const deleteSection = async (id: string): Promise<boolean> => {
    const sectionToDelete = sections.find((s) => s.id === id)
    if (!sectionToDelete) {
      setError(`Section not found: ${id}`)
      return false
    }

    // Optimistic update
    const optimisticSections = sections.filter((s) => s.id !== id)
    setSections(optimisticSections)

    try {
      if (!isOnline) {
        // Store offline changes
        setHasUnsyncedChanges(true)
        saveToLocalStorage(document, optimisticSections)
        return true
      }

      setLoading(true)

      // Delete section via Payload API
      const response = await fetch(`/api/document-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'x-business': 'salarium',
        },
      })

      if (!response.ok) {
        // Revert optimistic update on failure
        setSections(sections)
        throw new Error(`Failed to delete section: ${response.statusText}`)
      }

      // Save to localStorage
      saveToLocalStorage(document, optimisticSections)

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error deleting section:', err)

      // Revert optimistic update on error
      setSections(sections)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Enhanced reorder sections with optimistic updates
  const reorderSections = async (orderedIds: string[]): Promise<DocumentSection[]> => {
    // Create optimistic reordered sections
    const optimisticSections = orderedIds
      .map((id, index) => {
        const section = sections.find((s) => s.id === id)
        return section ? { ...section, order: index } : null
      })
      .filter(Boolean) as DocumentSection[]

    // Optimistic update
    setSections(optimisticSections)

    try {
      if (!isOnline) {
        // Store offline changes
        setHasUnsyncedChanges(true)
        saveToLocalStorage(document, optimisticSections)
        return optimisticSections
      }

      setLoading(true)

      // Create an array of update operations for each section
      const updatePromises = orderedIds.map((id, index) => {
        return fetch(`/api/document-sections/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-business': 'salarium',
          },
          body: JSON.stringify({ order: index }),
        })
      })

      // Execute all updates in parallel
      await Promise.all(updatePromises)

      // Fetch updated sections to ensure correct order
      const updatedSections = await fetchSections(document?.id || '')

      // Save to localStorage
      saveToLocalStorage(document, updatedSections)

      return updatedSections
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error reordering sections:', err)

      // Revert optimistic update on error
      setSections(sections)
      return sections
    } finally {
      setLoading(false)
    }
  }

  return (
    <DocumentContext.Provider
      value={{
        document,
        sections,
        loading,
        error,
        fetchDocument,
        fetchSections,
        updateDocument,
        createSection,
        updateSection,
        deleteSection,
        reorderSections,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

// Custom hook to use the document context
export const useDocumentContext = () => useContext(DocumentContext)

export default DocumentProvider

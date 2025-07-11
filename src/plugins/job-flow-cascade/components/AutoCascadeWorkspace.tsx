'use client'

import React, { useEffect, useState } from 'react'
import { DocumentProvider } from '../context/DocumentProvider'
import { CascadeProvider } from '../context/CascadeProvider'
import { DocumentHeader } from './DocumentHeader'
import { DocumentContent } from './DocumentContent'
import { ActionPanel } from './ActionPanel'
import { AutoCascadeWorkspaceProps, FlowDocument } from '../types'

/**
 * Main component for the Auto Cascade document workspace
 *
 * This component provides a fullscreen document-centric interface
 * for creating and editing documents with AI-powered generation.
 */
export const AutoCascadeWorkspace: React.FC<AutoCascadeWorkspaceProps> = ({
  documentId,
  initialData,
  readOnly = false,
  embedded = false,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [document, setDocument] = useState<FlowDocument | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!embedded)

  // Effect to load document if documentId is provided
  useEffect(() => {
    const loadDocument = async () => {
      if (documentId) {
        setLoading(true)
        try {
          // Will be implemented in the DocumentProvider
          // This is just a placeholder
          setDocument({ id: documentId } as FlowDocument)
        } catch (error) {
          console.error('Error loading document:', error)
        } finally {
          setLoading(false)
        }
      } else if (initialData) {
        // Create a new document with initial data
        setDocument({
          ...initialData,
          id: 'new',
        } as FlowDocument)
        setLoading(false)
      } else {
        // Create an empty document
        setDocument({
          id: 'new',
          title: 'New Document',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as FlowDocument)
        setLoading(false)
      }
    }

    loadDocument()
  }, [documentId, initialData])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle save request
  const handleSave = () => {
    if (onSave && document) {
      onSave(document)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mb-2"></div>
          <p>Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <DocumentProvider documentId={documentId}>
      <CascadeProvider>
        <div
          className={`auto-cascade-workspace bg-white ${
            isFullscreen ? 'fixed inset-0 z-50' : 'relative'
          } flex flex-col h-full`}
        >
          {/* Header with title and main controls */}
          <DocumentHeader
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            readOnly={readOnly}
            onSave={handleSave}
            onCancel={onCancel}
          />

          {/* Main content area - fullscreen two-panel layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main document content area (75% width) */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <DocumentContent readOnly={readOnly} />
            </div>

            {/* Right panel with actions and formatting (25% width) */}
            {!embedded && (
              <div className="w-80 border-l border-gray-200 flex-shrink-0">
                <ActionPanel />
              </div>
            )}
          </div>
        </div>
      </CascadeProvider>
    </DocumentProvider>
  )
}

export default AutoCascadeWorkspace

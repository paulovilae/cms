'use client'

import React, { useState } from 'react'
import { useDocumentState } from '../hooks/useDocumentState'
import { useCascadeGeneration } from '../hooks/useCascadeGeneration'
import { useDocumentContext } from '../context/DocumentProvider'

interface DocumentHeaderProps {
  isFullscreen: boolean
  onToggleFullscreen: () => void
  readOnly?: boolean
  onSave?: () => void
  onCancel?: () => void
}

/**
 * Document header component with title editor and control buttons
 */
export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  isFullscreen,
  onToggleFullscreen,
  readOnly = false,
  onSave,
  onCancel,
}) => {
  const { document, saveDocumentTitle, updateDocumentStatus } = useDocumentState()
  const { generateFullDocument, isGenerating } = useCascadeGeneration()
  const { updateDocument } = useDocumentContext()

  const [editableTitle, setEditableTitle] = useState<string>(document?.title || 'Untitled Document')
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Handle title editing
  const startEditingTitle = () => {
    if (readOnly) return
    setIsEditingTitle(true)
  }

  const saveTitle = () => {
    if (document) {
      saveDocumentTitle(editableTitle)
    }
    setIsEditingTitle(false)
  }

  // Handle document generation
  const handleGenerateAll = async () => {
    if (!document || !document.id) return

    // Get first section ID and start cascade generation
    const firstSectionId = document.id // This is a placeholder; in a real implementation, we'd get the first section
    await generateFullDocument(firstSectionId)
  }

  // Handle document save
  const handleSave = async () => {
    if (!document) return

    setIsSaving(true)
    try {
      // If this is a new document, create it first
      if (document.id === 'new') {
        await updateDocument({
          title: editableTitle,
          status: document.status,
          businessUnit: document.businessUnit || 'salarium',
        })
      } else {
        // Update existing document
        await updateDocument({
          title: editableTitle,
        })
      }

      // Call the optional onSave callback
      if (onSave) {
        onSave()
      }
    } catch (error) {
      console.error('Error saving document:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        {/* Title editor */}
        {isEditingTitle ? (
          <div className="flex items-center">
            <input
              type="text"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
              className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none"
              autoFocus
            />
            <button onClick={saveTitle} className="ml-2 text-blue-500 hover:text-blue-700">
              Save
            </button>
          </div>
        ) : (
          <h1
            className="text-2xl font-bold cursor-pointer hover:text-blue-700"
            onClick={startEditingTitle}
          >
            {editableTitle}
          </h1>
        )}

        {/* Status indicator */}
        <div className="ml-4 px-2 py-1 text-sm rounded-full bg-gray-100">
          {document?.status || 'Draft'}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Auto-generate button */}
        <button
          onClick={handleGenerateAll}
          disabled={isGenerating || readOnly}
          className={`px-4 py-2 rounded-md text-white ${
            isGenerating || readOnly
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Auto-Generate All'}
        </button>

        {/* Fullscreen toggle */}
        <button onClick={onToggleFullscreen} className="p-2 text-gray-500 hover:text-gray-700">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md ${
            isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        {/* Cancel button (if onCancel is provided) */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </header>
  )
}

export default DocumentHeader

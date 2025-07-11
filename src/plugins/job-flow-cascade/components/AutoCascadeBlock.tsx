'use client'

import React, { useState, useEffect } from 'react'
import { AutoCascadeWorkspace } from './AutoCascadeWorkspace'
import { useDocumentState } from '../hooks/useDocumentState'
import { FlowDocument } from '../types'

interface AutoCascadeBlockProps {
  path: string
  value: {
    documentId?: string
    initialTitle?: string
    readOnly?: boolean
    embedded?: boolean
  }
  onChange: (value: any) => void
}

/**
 * Block component for embedding in content models
 *
 * This component allows the document generation workspace to be embedded
 * in any content model using Payload's block system.
 */
export const AutoCascadeBlock: React.FC<AutoCascadeBlockProps> = ({
  path,
  value = {},
  onChange,
}) => {
  const { documentId, initialTitle = 'New Document', readOnly = false, embedded = true } = value
  const [currentDocumentId, setCurrentDocumentId] = useState<string | undefined>(documentId)
  const [isCreating, setIsCreating] = useState<boolean>(!documentId)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Handle save
  const handleSave = (document: FlowDocument) => {
    if (document && document.id) {
      onChange({
        ...value,
        documentId: document.id,
      })
      setCurrentDocumentId(document.id)
      setIsEditing(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
  }

  // Create a new document
  const handleCreate = () => {
    setIsCreating(true)
    setIsEditing(true)
  }

  // Edit existing document
  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <div className="auto-cascade-block border rounded p-4 my-4 bg-gray-50">
      {isEditing ? (
        <AutoCascadeWorkspace
          documentId={currentDocumentId}
          initialData={!currentDocumentId ? { title: initialTitle } : undefined}
          readOnly={readOnly}
          embedded={embedded}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          {currentDocumentId ? (
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Document Editor</h3>
              <p className="text-gray-500 mb-4">Document ID: {currentDocumentId}</p>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Document
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
              <p className="text-gray-500 mb-4">Create a new document or select an existing one.</p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create New Document
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AutoCascadeBlock

'use client'

import React, { useState } from 'react'
import { useDocumentState } from '../hooks/useDocumentState'
import { useCascadeGeneration } from '../hooks/useCascadeGeneration'
import { DocumentStatus, SectionType } from '../types'

/**
 * Right sidebar panel with document actions and tools
 */
export const ActionPanel: React.FC = () => {
  const { document, sections, updateDocumentStatus, getSortedSections } = useDocumentState()
  const { generateFullDocument, isGenerating, options, updateOptions, progress } =
    useCascadeGeneration()

  const [showExportOptions, setShowExportOptions] = useState<boolean>(false)
  const [exportFormat, setExportFormat] = useState<string>('html')

  // Handle status change
  const handleStatusChange = async (status: string) => {
    if (!document) return
    await updateDocumentStatus(status)
  }

  // Handle full document generation
  const handleGenerateAll = async () => {
    if (!sections.length) {
      alert('Please create at least one section before generating content.')
      return
    }

    const sortedSections = getSortedSections()
    const firstSection = sortedSections[0]

    if (firstSection) {
      await generateFullDocument(firstSection.id)
    }
  }

  // Handle document export
  const handleExport = () => {
    // This would be implemented with actual export functionality
    alert(`Exporting document as ${exportFormat}...`)
  }

  // Create section templates
  const createTemplateStructure = async () => {
    // This would create a standard template structure
    // For now, it's just a placeholder
    alert('Creating standard template structure...')
  }

  return (
    <div className="h-full bg-gray-50 p-4 overflow-y-auto">
      <h3 className="font-medium text-lg mb-4">Actions & Formatting</h3>

      {/* Document Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Document Status</label>
        <select
          value={document?.status || DocumentStatus.DRAFT}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value={DocumentStatus.DRAFT}>Draft</option>
          <option value={DocumentStatus.IN_PROGRESS}>In Progress</option>
          <option value={DocumentStatus.COMPLETED}>Completed</option>
          <option value={DocumentStatus.ARCHIVED}>Archived</option>
        </select>
      </div>

      {/* Auto-generate All Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerateAll}
          disabled={isGenerating}
          className={`w-full py-2 px-4 rounded-md text-white text-center ${
            isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? `Generating... ${progress}%` : 'Auto-Generate All Sections'}
        </button>

        <p className="text-xs text-gray-500 mt-1">
          Generates content for all sections in sequence.
        </p>
      </div>

      {/* Export Options */}
      <div className="mb-6">
        <button
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 text-center"
        >
          {showExportOptions ? 'Hide Export Options' : 'Export Document'}
        </button>

        {showExportOptions && (
          <div className="mt-3 p-3 border border-gray-200 rounded-md bg-white">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
              >
                <option value="html">HTML</option>
                <option value="markdown">Markdown</option>
                <option value="pdf">PDF</option>
                <option value="docx">Word (DOCX)</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="w-full py-1.5 px-3 bg-green-600 hover:bg-green-700 rounded-md text-white text-center text-sm"
            >
              Export Now
            </button>
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2 text-gray-700">Templates</h4>

        <button
          onClick={createTemplateStructure}
          className="w-full py-2 px-4 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-800 text-center"
        >
          Create Standard Structure
        </button>

        <p className="text-xs text-gray-500 mt-1">
          Creates standard sections for a job description.
        </p>
      </div>

      {/* AI Generation Options */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2 text-gray-700">Global AI Options</h4>

        <div className="mb-2">
          <label className="block text-xs text-gray-600 mb-1">Style</label>
          <select
            value={options.style}
            onChange={(e) =>
              updateOptions({
                ...options,
                style: e.target.value as 'professional' | 'casual' | 'technical' | 'creative',
              })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
            disabled={isGenerating}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-xs text-gray-600 mb-1">Tone</label>
          <select
            value={options.tone}
            onChange={(e) =>
              updateOptions({
                ...options,
                tone: e.target.value as 'formal' | 'conversational' | 'enthusiastic' | 'neutral',
              })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
            disabled={isGenerating}
          >
            <option value="formal">Formal</option>
            <option value="conversational">Conversational</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-xs text-gray-600 mb-1">Length</label>
          <select
            value={options.length}
            onChange={(e) =>
              updateOptions({
                ...options,
                length: e.target.value as 'concise' | 'standard' | 'detailed',
              })
            }
            className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
            disabled={isGenerating}
          >
            <option value="concise">Concise</option>
            <option value="standard">Standard</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>
      </div>

      {/* Document Info */}
      {document && (
        <div className="text-xs text-gray-500">
          <p>
            Created:{' '}
            {document.createdAt ? new Date(document.createdAt).toLocaleString() : 'Unknown'}
          </p>
          <p>
            Last Updated:{' '}
            {document.updatedAt ? new Date(document.updatedAt).toLocaleString() : 'Unknown'}
          </p>
          <p>Sections: {sections.length}</p>
          <p>ID: {document.id}</p>
        </div>
      )}
    </div>
  )
}

export default ActionPanel

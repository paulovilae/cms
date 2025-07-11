'use client'

import React, { useEffect, useState } from 'react'
import { useCascadeGeneration } from '../hooks/useCascadeGeneration'
import { useDocumentState } from '../hooks/useDocumentState'
import { DocumentSection, GenerationOptions } from '../types'
import { RichTextEditor } from './RichTextEditor'

interface SectionEditorProps {
  section: DocumentSection
  isActive: boolean
  readOnly?: boolean
  onSelect: () => void
}

/**
 * Section editor component with rich text editor and AI generation controls
 */
export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  isActive,
  readOnly = false,
  onSelect,
}) => {
  const { updateSection, toggleSectionCompletion } = useDocumentState()
  const {
    generateSection,
    generateAlternative,
    isGenerating,
    currentSection,
    options,
    updateOptions,
    progress,
  } = useCascadeGeneration()

  const [title, setTitle] = useState<string>(section.title)
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false)
  const [showAIOptions, setShowAIOptions] = useState<boolean>(false)
  const [localOptions, setLocalOptions] = useState<GenerationOptions>(options)

  // Handle content changes
  const handleContentChange = async (content: any) => {
    if (readOnly) return
    await updateSection(section.id, { content })
  }

  // Update section title
  const saveTitle = async () => {
    if (readOnly) return

    await updateSection(section.id, { title })
    setIsTitleEditing(false)
  }

  // Handle completion toggle
  const handleToggleCompletion = async () => {
    if (readOnly) return

    await toggleSectionCompletion(section.id, !section.isCompleted)
  }

  // Generate content with AI
  const handleGenerate = async () => {
    if (readOnly || isGenerating) return

    // Apply local options to global options
    updateOptions(localOptions)

    // Start generation
    await generateSection(section.id)
  }

  // Generate alternative content
  const handleGenerateAlternative = async () => {
    if (readOnly || isGenerating) return

    // Apply local options to global options
    updateOptions(localOptions)

    // Start alternative generation
    await generateAlternative(section.id)
  }

  // Update local options
  const handleOptionChange = (key: keyof GenerationOptions, value: any) => {
    setLocalOptions({
      ...localOptions,
      [key]: value,
    })
  }

  // Check if this section is currently generating
  const isThisSectionGenerating = isGenerating && currentSection === section.id

  return (
    <div
      className={`section-editor border rounded-lg p-4 ${
        isActive ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      {/* Section header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {/* Title editor */}
          {isTitleEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                className="text-xl font-medium border-b-2 border-blue-500 focus:outline-none"
                autoFocus
                disabled={readOnly}
              />
              <button
                onClick={saveTitle}
                className="ml-2 text-blue-500 hover:text-blue-700"
                disabled={readOnly}
              >
                Save
              </button>
            </div>
          ) : (
            <h3
              className={`text-xl font-medium ${!readOnly && 'cursor-pointer hover:text-blue-700'}`}
              onClick={() => !readOnly && setIsTitleEditing(true)}
            >
              {title}
            </h3>
          )}

          {/* Section type badge */}
          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
            {section.type}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Completion toggle */}
          <button
            onClick={handleToggleCompletion}
            className={`px-2 py-1 text-xs rounded-full ${
              section.isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
            disabled={readOnly}
          >
            {section.isCompleted ? 'Completed' : 'Mark Complete'}
          </button>

          {/* AI generation button */}
          <button
            onClick={() => setShowAIOptions(!showAIOptions)}
            className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
            disabled={readOnly || isGenerating}
          >
            AI Options
          </button>
        </div>
      </div>

      {/* AI options panel */}
      {showAIOptions && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <h4 className="font-medium mb-2">AI Generation Options</h4>

          <div className="grid grid-cols-2 gap-3">
            {/* Style selector */}
            <div className="mb-2">
              <label className="block text-sm text-gray-600 mb-1">Style</label>
              <select
                value={localOptions.style}
                onChange={(e) => handleOptionChange('style', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                disabled={isGenerating}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            {/* Tone selector */}
            <div className="mb-2">
              <label className="block text-sm text-gray-600 mb-1">Tone</label>
              <select
                value={localOptions.tone}
                onChange={(e) => handleOptionChange('tone', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                disabled={isGenerating}
              >
                <option value="formal">Formal</option>
                <option value="conversational">Conversational</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            {/* Length selector */}
            <div className="mb-2">
              <label className="block text-sm text-gray-600 mb-1">Length</label>
              <select
                value={localOptions.length}
                onChange={(e) => handleOptionChange('length', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                disabled={isGenerating}
              >
                <option value="concise">Concise</option>
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            {/* Audience input */}
            <div className="mb-2">
              <label className="block text-sm text-gray-600 mb-1">Audience</label>
              <input
                type="text"
                value={localOptions.audience || ''}
                onChange={(e) => handleOptionChange('audience', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                placeholder="Target audience"
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={handleGenerate}
              className={`px-3 py-1 rounded text-white ${
                isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isGenerating || readOnly}
            >
              {isThisSectionGenerating ? `Generating... ${progress}%` : 'Generate Content'}
            </button>

            <button
              onClick={handleGenerateAlternative}
              className={`px-3 py-1 rounded text-white ${
                isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isGenerating || readOnly}
            >
              Generate Alternative
            </button>
          </div>
        </div>
      )}

      {/* Rich text editor */}
      <RichTextEditor
        content={section.content}
        onChange={handleContentChange}
        readOnly={readOnly}
        placeholder={`Enter content for ${section.title}...`}
        options={{
          showToolbar: true,
          showFormatPanel: false,
          autoSave: true,
          debounceTime: 1000,
        }}
        className="min-h-48"
      />
    </div>
  )
}

export default SectionEditor

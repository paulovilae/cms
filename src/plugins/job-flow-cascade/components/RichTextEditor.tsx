'use client'

import React from 'react'
import { SlateRichTextEditor } from './slate/SlateRichTextEditor'
import { RichTextEditorOptions, SlateValue } from '../types/slate'
import { convertLegacyContent } from '../utilities/slateUtils'

interface RichTextEditorProps {
  content?: any
  onChange?: (content: any) => void
  readOnly?: boolean
  placeholder?: string
  options?: RichTextEditorOptions
  onSave?: (content: any) => Promise<void>
  className?: string
}

/**
 * Rich Text Editor Component with Slate.js
 *
 * This is a comprehensive rich text editor built with Slate.js that provides
 * Word-like editing capabilities including formatting, tables, images, and more.
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  readOnly = false,
  placeholder = 'Start typing...',
  options = {},
  onSave,
  className = '',
}) => {
  // Convert legacy content to Slate format
  const slateValue: SlateValue = React.useMemo(() => {
    return convertLegacyContent(content)
  }, [content])

  // Handle changes and convert back to expected format
  const handleChange = React.useCallback(
    (value: SlateValue) => {
      if (onChange) {
        onChange(value)
      }
    },
    [onChange],
  )

  // Handle save
  const handleSave = React.useCallback(
    async (value: SlateValue) => {
      if (onSave) {
        await onSave(value)
      }
    },
    [onSave],
  )

  // Merge options with defaults
  const editorOptions: RichTextEditorOptions = {
    placeholder,
    readOnly,
    autoFocus: false,
    showToolbar: true,
    showFormatPanel: false,
    autoSave: true,
    debounceTime: 1000,
    ...options,
  }

  return (
    <div
      className={`rich-text-editor border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}
    >
      <SlateRichTextEditor
        value={slateValue}
        onChange={handleChange}
        options={editorOptions}
        onSave={handleSave}
      />
    </div>
  )
}

export default RichTextEditor

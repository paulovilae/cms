'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { Slate, Editable } from 'slate-react'
import { Editor, Node as SlateNode } from 'slate'
import { useSlateEditor } from '../../hooks/useSlateEditor'
import { RichTextEditorOptions, SlateValue } from '../../types/slate'
import { renderElement, renderLeaf } from './elements'
import { SimplifiedToolbar } from './SimplifiedToolbar'
import { FloatingToolbar } from './FloatingToolbar'
import { CollapsibleFormatPanel } from './CollapsibleFormatPanel'
import { SlateErrorBoundary, PlainTextEditor } from './ErrorBoundary'
import { isHotkey, HOTKEYS, toggleMark } from '../../utilities/slateUtils'
import { Settings, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ImprovedSlateEditorProps {
  value?: SlateValue
  onChange?: (value: SlateValue) => void
  options?: RichTextEditorOptions
  onSave?: (value: SlateValue) => Promise<void>
  className?: string
}

// Save status component
interface SaveStatusProps {
  hasUnsavedChanges: boolean
  isSaving: boolean
  lastSaved?: Date
  onSave?: () => void
}

const SaveStatus: React.FC<SaveStatusProps> = ({
  hasUnsavedChanges,
  isSaving,
  lastSaved,
  onSave,
}) => {
  if (isSaving) {
    return (
      <div className="flex items-center space-x-2 text-blue-600">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Saving...</span>
      </div>
    )
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle size={16} className="text-orange-500" />
        <span className="text-sm text-orange-600">Unsaved changes</span>
        {onSave && (
          <button
            onClick={onSave}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <CheckCircle size={16} />
      <span className="text-sm">
        {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Saved'}
      </span>
    </div>
  )
}

// Word and character count component
interface EditorStatsProps {
  value: SlateValue
}

const EditorStats: React.FC<EditorStatsProps> = ({ value }) => {
  try {
    const text = value
      .map((node) => {
        try {
          return SlateNode.string(node)
        } catch {
          return ''
        }
      })
      .join(' ')

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const charCount = text.length

    return (
      <div className="flex space-x-4 text-xs text-gray-500">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    )
  } catch (error) {
    console.warn('EditorStats error:', error)
    return (
      <div className="flex space-x-4 text-xs text-gray-500">
        <span>0 words</span>
        <span>0 characters</span>
      </div>
    )
  }
}

// Main improved editor component
export const ImprovedSlateEditor: React.FC<ImprovedSlateEditorProps> = ({
  value: externalValue,
  onChange,
  options = {},
  onSave,
  className = '',
}) => {
  const [showFormatPanel, setShowFormatPanel] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>()
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { editor, value, setValue, hasUnsavedChanges, markAsSaved } = useSlateEditor({
    initialValue: externalValue,
    onChange,
    options,
    onSave,
  })

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event.nativeEvent)) {
          event.preventDefault()
          const mark = HOTKEYS[hotkey]
          if (mark) {
            toggleMark(editor, mark)
          }
        }
      }
    },
    [editor],
  )

  // Handle save
  const handleSave = useCallback(async () => {
    if (onSave && hasUnsavedChanges && !isSaving) {
      setIsSaving(true)
      try {
        await onSave(value)
        markAsSaved()
        setLastSaved(new Date())
      } catch (error) {
        console.error('Failed to save:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }, [onSave, hasUnsavedChanges, value, markAsSaved, isSaving])

  // Handle Ctrl+S
  const handleGlobalKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        handleSave()
      }
    },
    [handleSave],
  )

  const {
    placeholder = 'Start typing...',
    readOnly = false,
    autoFocus = false,
    showToolbar = true,
  } = options

  return (
    <SlateErrorBoundary
      fallback={
        <PlainTextEditor
          value={typeof externalValue === 'string' ? externalValue : ''}
          onChange={(text) =>
            onChange?.([{ type: 'paragraph', children: [{ text }] }] as SlateValue)
          }
          placeholder={placeholder}
          className={className}
        />
      }
    >
      <div className={`improved-slate-editor ${className}`} onKeyDown={handleGlobalKeyDown}>
        <Slate editor={editor} initialValue={value} onChange={setValue}>
          <div className="flex h-full">
            {/* Main editor area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Toolbar */}
              {!readOnly && showToolbar && (
                <SimplifiedToolbar
                  showAdvanced={showAdvanced}
                  onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                />
              )}

              {/* Advanced toolbar (when expanded) */}
              {!readOnly && showAdvanced && (
                <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Advanced formatting options available in the format panel
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFormatPanel(!showFormatPanel)}
                    className={`
                      px-3 py-1 text-sm rounded transition-colors
                      ${
                        showFormatPanel
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }
                    `}
                  >
                    <Settings size={14} className="inline mr-1" />
                    Format Panel
                  </button>
                </div>
              )}

              {/* Editor content */}
              <div className="flex-1 relative overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    spellCheck
                    onKeyDown={handleKeyDown}
                    className="prose max-w-none focus:outline-none min-h-[300px] p-6"
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  />
                </div>

                {/* Floating toolbar for text selection */}
                {!readOnly && !isMobile && <FloatingToolbar />}
              </div>

              {/* Status bar */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <EditorStats value={value} />
                <SaveStatus
                  hasUnsavedChanges={hasUnsavedChanges}
                  isSaving={isSaving}
                  lastSaved={lastSaved}
                  onSave={onSave ? handleSave : undefined}
                />
              </div>
            </div>

            {/* Format panel */}
            <CollapsibleFormatPanel
              isOpen={showFormatPanel}
              onClose={() => setShowFormatPanel(false)}
              className="hidden md:block"
            />
          </div>
        </Slate>

        {/* Mobile format panel */}
        {isMobile && (
          <CollapsibleFormatPanel
            isOpen={showFormatPanel}
            onClose={() => setShowFormatPanel(false)}
          />
        )}
      </div>
    </SlateErrorBoundary>
  )
}

export default ImprovedSlateEditor

'use client'

import { useMemo, useCallback, useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor, SlateValue, RichTextEditorOptions } from '../types/slate'
import { defaultPlugins } from '../components/slate/plugins'
import { createEmptyDocument, normalizeSlateValue } from '../utilities/slateUtils'
import { serializeForDatabase, deserializeFromDatabase } from '../utilities/serialization'

interface UseSlateEditorProps {
  initialValue?: any
  onChange?: (value: SlateValue) => void
  options?: RichTextEditorOptions
  onSave?: (value: SlateValue) => Promise<void>
}

interface UseSlateEditorReturn {
  editor: CustomEditor
  value: SlateValue
  setValue: (value: SlateValue) => void
  serialize: () => any
  deserialize: (data: any) => void
  isEmpty: boolean
  hasUnsavedChanges: boolean
  markAsSaved: () => void
}

export const useSlateEditor = ({
  initialValue,
  onChange,
  options = {},
  onSave,
}: UseSlateEditorProps): UseSlateEditorReturn => {
  // Initialize editor with plugins
  const editor = useMemo(() => {
    let baseEditor = withHistory(withReact(createEditor()))

    // Apply default plugins
    for (const plugin of defaultPlugins) {
      baseEditor = plugin(baseEditor)
    }

    // Apply auto-save plugin if onSave is provided
    if (onSave && options.autoSave) {
      const { withAutoSave } = require('../components/slate/plugins')
      baseEditor = withAutoSave(baseEditor, onSave, options.debounceTime || 1000)
    }

    return baseEditor as CustomEditor
  }, [onSave, options.autoSave, options.debounceTime])

  // Initialize value
  const [value, setValue] = useState<SlateValue>(() => {
    if (initialValue) {
      if (typeof initialValue === 'string') {
        // Convert string to Slate format
        return [{ type: 'paragraph', children: [{ text: initialValue }] }] as SlateValue
      }
      return normalizeSlateValue(initialValue)
    }
    return createEmptyDocument()
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Handle value changes
  const handleChange = useCallback(
    (newValue: SlateValue) => {
      setValue(newValue)
      setHasUnsavedChanges(true)

      if (onChange) {
        onChange(newValue)
      }
    },
    [onChange],
  )

  // Serialize current value
  const serialize = useCallback(() => {
    return serializeForDatabase(value)
  }, [value])

  // Deserialize and set value
  const deserialize = useCallback((data: any) => {
    const deserializedValue = deserializeFromDatabase(data)
    setValue(deserializedValue)
    setHasUnsavedChanges(false)
  }, [])

  // Check if editor is empty
  const isEmpty = useMemo(() => {
    if (value.length !== 1) return false
    const firstNode = value[0] as any
    return (
      firstNode &&
      firstNode.type === 'paragraph' &&
      firstNode.children &&
      firstNode.children.length === 1 &&
      firstNode.children[0] &&
      firstNode.children[0].text === ''
    )
  }, [value])

  // Mark as saved
  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false)
  }, [])

  return {
    editor,
    value,
    setValue: handleChange,
    serialize,
    deserialize,
    isEmpty,
    hasUnsavedChanges,
    markAsSaved,
  }
}

export default useSlateEditor

import React from 'react'
import { Editor, Element as SlateElement, Node as SlateNode, Point, Range, Transforms } from 'slate'
import { CustomEditor, SlatePlugin } from '../../types/slate'
import { isHotkey, HOTKEYS, toggleMark, LIST_TYPES } from '../../utilities/slateUtils'

// Basic formatting plugin
export const withFormatting = (editor: CustomEditor): CustomEditor => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.isVoid = (element) => {
    return element.type === 'image' || element.type === 'divider' ? true : isVoid(element)
  }

  return editor
}

// Tables plugin
export const withTables = (editor: CustomEditor): CustomEditor => {
  const { deleteBackward, deleteForward, insertBreak } = editor

  editor.deleteBackward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table-cell',
      })

      if (cell) {
        const [, cellPath] = cell
        const start = Editor.start(editor, cellPath)

        if (Point.equals(selection.anchor, start)) {
          return
        }
      }
    }

    deleteBackward(unit)
  }

  editor.deleteForward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table-cell',
      })

      if (cell) {
        const [, cellPath] = cell
        const end = Editor.end(editor, cellPath)

        if (Point.equals(selection.anchor, end)) {
          return
        }
      }
    }

    deleteForward(unit)
  }

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table',
      })

      if (table) {
        return
      }
    }

    insertBreak()
  }

  return editor
}

// Images plugin
export const withImages = (editor: CustomEditor): CustomEditor => {
  const { insertData, isVoid } = editor

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result as string
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

// Lists plugin
export const withLists = (editor: CustomEditor): CustomEditor => {
  const { deleteBackward, insertBreak } = editor

  editor.deleteBackward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
      })

      if (match) {
        const [, path] = match
        const start = Editor.start(editor, path)

        if (Point.equals(selection.anchor, start)) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          }
          Transforms.setNodes(editor, newProperties)

          if (LIST_TYPES.includes((match[0] as any).type)) {
            Transforms.unwrapNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
              split: true,
            })
          }
          return
        }
      }
    }

    deleteBackward(unit)
  }

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection) {
      const [match] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
      })

      if (match) {
        Transforms.insertNodes(editor, {
          type: 'list-item',
          children: [{ text: '' }],
        } as any)
        return
      }
    }

    insertBreak()
  }

  return editor
}

// Auto-save plugin
export const withAutoSave = (
  editor: CustomEditor,
  onSave: (value: any) => void,
  debounceTime: number = 1000,
): CustomEditor => {
  const { onChange } = editor
  let saveTimeout: NodeJS.Timeout

  editor.onChange = () => {
    onChange()

    // Clear previous timeout
    clearTimeout(saveTimeout)

    // Set new timeout
    saveTimeout = setTimeout(() => {
      const value = editor.children
      onSave(value)
    }, debounceTime)
  }

  return editor
}

// Keyboard shortcuts plugin
export const withShortcuts = (editor: CustomEditor): CustomEditor => {
  const { insertText } = editor

  editor.insertText = (text) => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range)

      // Auto-format shortcuts
      const shortcuts: Record<string, any> = {
        '*': { type: 'list-item', wrapper: 'bulleted-list' },
        '-': { type: 'list-item', wrapper: 'bulleted-list' },
        '+': { type: 'list-item', wrapper: 'bulleted-list' },
        '1.': { type: 'list-item', wrapper: 'numbered-list' },
        '>': { type: 'block-quote' },
        '#': { type: 'heading', level: 1 },
        '##': { type: 'heading', level: 2 },
        '###': { type: 'heading', level: 3 },
        '####': { type: 'heading', level: 4 },
        '#####': { type: 'heading', level: 5 },
        '######': { type: 'heading', level: 6 },
        '```': { type: 'code-block' },
        '---': { type: 'divider' },
      }

      const shortcut = shortcuts[beforeText]
      if (shortcut) {
        Transforms.select(editor, range)
        Transforms.delete(editor)

        if (shortcut.wrapper) {
          const listItem = {
            type: shortcut.type,
            children: [{ text: '' }],
          }
          const list = {
            type: shortcut.wrapper,
            children: [listItem],
          }
          Transforms.insertNodes(editor, list as any)
        } else if (shortcut.type === 'divider') {
          const divider = {
            type: 'divider',
            children: [{ text: '' }],
          }
          Transforms.insertNodes(editor, divider as any)
          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{ text: '' }],
          } as any)
        } else {
          const newProperties: any = {
            type: shortcut.type,
            ...(shortcut.level && { level: shortcut.level }),
          }
          Transforms.setNodes(editor, newProperties)
        }
        return
      }
    }

    insertText(text)
  }

  return editor
}

// Helper functions
const insertImage = (editor: CustomEditor, url: string) => {
  const image = {
    type: 'image',
    url,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, image as any)
}

const isImageUrl = (url: string): boolean => {
  if (!url) return false
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url)
}

// Export all plugins
export const defaultPlugins = [withFormatting, withTables, withImages, withLists, withShortcuts]

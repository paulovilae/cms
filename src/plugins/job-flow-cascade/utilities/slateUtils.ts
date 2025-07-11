import {
  Editor,
  Element as SlateElement,
  Node as SlateNode,
  Point,
  Range,
  Text,
  Transforms,
} from 'slate'
import { CustomEditor, CustomElement, CustomText, SlateValue } from '../types/slate'

// Default initial value for empty editor
export const createEmptyDocument = (): SlateValue => [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

// Check if editor is empty
export const isEditorEmpty = (value: SlateValue): boolean => {
  return (
    value.length === 1 &&
    SlateElement.isElement(value[0]) &&
    value[0].type === 'paragraph' &&
    value[0].children.length === 1 &&
    Text.isText(value[0].children[0]) &&
    value[0].children[0].text === ''
  )
}

// Get plain text from editor value
export const getPlainText = (value: SlateValue): string => {
  return value.map((node) => SlateNode.string(node)).join('\n')
}

// Get word count from editor value
export const getWordCount = (value: SlateValue): number => {
  const text = getPlainText(value)
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

// Get character count from editor value
export const getCharacterCount = (value: SlateValue): number => {
  return getPlainText(value).length
}

// Text formatting utilities
export const isMarkActive = (
  editor: CustomEditor,
  format: keyof Omit<CustomText, 'text'>,
): boolean => {
  const marks = Editor.marks(editor)
  return marks ? (marks as any)[format] === true : false
}

export const toggleMark = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>): void => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// Block formatting utilities
export const isBlockActive = (
  editor: CustomEditor,
  format: string,
  blockType = 'type',
): boolean => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof CustomElement] === format,
    }),
  )

  return !!match
}

export const toggleBlock = (editor: CustomEditor, format: string): void => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  )

  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as Partial<SlateElement>
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as Partial<SlateElement>
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] } as SlateElement
    Transforms.wrapNodes(editor, block)
  }
}

// Link utilities
export const isLinkActive = (editor: CustomEditor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  })
  return !!link
}

export const unwrapLink = (editor: CustomEditor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  })
}

export const wrapLink = (editor: CustomEditor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  } as SlateElement

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

export const insertLink = (editor: CustomEditor, url: string, text?: string): void => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

// Image utilities
export const insertImage = (editor: CustomEditor, url: string, alt?: string): void => {
  const image = {
    type: 'image',
    url,
    alt: alt || '',
    children: [{ text: '' }],
  } as SlateElement

  Transforms.insertNodes(editor, image)
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  } as SlateElement)
}

// Table utilities
export const insertTable = (editor: CustomEditor, rows: number = 2, cols: number = 2): void => {
  const table = {
    type: 'table',
    children: Array.from({ length: rows }, () => ({
      type: 'table-row',
      children: Array.from({ length: cols }, () => ({
        type: 'table-cell',
        children: [{ text: '' }],
      })),
    })),
  } as SlateElement

  Transforms.insertNodes(editor, table)
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  } as SlateElement)
}

// List utilities
export const insertBulletedList = (editor: CustomEditor): void => {
  toggleBlock(editor, 'bulleted-list')
}

export const insertNumberedList = (editor: CustomEditor): void => {
  toggleBlock(editor, 'numbered-list')
}

// Heading utilities
export const insertHeading = (editor: CustomEditor, level: 1 | 2 | 3 | 4 | 5 | 6): void => {
  const heading = {
    type: 'heading',
    level,
    children: [{ text: '' }],
  }

  Transforms.setNodes(editor, heading as any)
}

// Constants
export const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

// Keyboard shortcuts
export const HOTKEYS: Record<string, keyof Omit<CustomText, 'text'>> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

// Check if hotkey matches
export const isHotkey = (hotkey: string, event: KeyboardEvent): boolean => {
  const keys = hotkey.split('+')
  const modKey = keys.includes('mod')
  const ctrlKey = keys.includes('ctrl')
  const altKey = keys.includes('alt')
  const shiftKey = keys.includes('shift')
  const key = keys[keys.length - 1]

  if (!key) return false

  const isMod = modKey && (event.ctrlKey || event.metaKey)
  const isCtrl = ctrlKey && event.ctrlKey
  const isAlt = altKey && event.altKey
  const isShift = shiftKey && event.shiftKey

  return (
    (modKey ? isMod : !event.ctrlKey && !event.metaKey) &&
    (ctrlKey ? isCtrl : !ctrlKey) &&
    (altKey ? isAlt : !altKey) &&
    (shiftKey ? isShift : !shiftKey) &&
    event.key.toLowerCase() === key.toLowerCase()
  )
}

// Normalize editor value
export const normalizeSlateValue = (value: any): SlateValue => {
  if (!value || !Array.isArray(value)) {
    return createEmptyDocument()
  }

  if (value.length === 0) {
    return createEmptyDocument()
  }

  return value
}

// Convert legacy content to Slate format
export const convertLegacyContent = (content: any): SlateValue => {
  if (!content) {
    return createEmptyDocument()
  }

  if (typeof content === 'string') {
    // Convert plain text to paragraphs
    const paragraphs = content.split('\n').filter((p) => p.trim())
    if (paragraphs.length === 0) {
      return createEmptyDocument()
    }

    return paragraphs.map((paragraph) => ({
      type: 'paragraph',
      children: [{ text: paragraph }],
    })) as SlateValue
  }

  if (Array.isArray(content)) {
    return normalizeSlateValue(content)
  }

  if (content.type === 'doc' && content.content) {
    // Convert ProseMirror-like format
    return normalizeSlateValue(content.content)
  }

  return createEmptyDocument()
}

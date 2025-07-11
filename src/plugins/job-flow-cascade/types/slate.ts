import React from 'react'
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

// Extend Slate's types
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

// Define custom element types
export type ParagraphElement = {
  type: 'paragraph'
  align?: 'left' | 'center' | 'right' | 'justify'
  children: CustomText[]
}

export type HeadingElement = {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  align?: 'left' | 'center' | 'right' | 'justify'
  children: CustomText[]
}

export type BlockQuoteElement = {
  type: 'block-quote'
  children: CustomText[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  children: ListItemElement[]
}

export type NumberedListElement = {
  type: 'numbered-list'
  children: ListItemElement[]
}

export type ListItemElement = {
  type: 'list-item'
  children: CustomText[]
}

export type LinkElement = {
  type: 'link'
  url: string
  children: CustomText[]
}

export type ImageElement = {
  type: 'image'
  url: string
  alt?: string
  width?: number
  height?: number
  align?: 'left' | 'center' | 'right'
  children: EmptyText[]
}

export type TableElement = {
  type: 'table'
  children: TableRowElement[]
}

export type TableRowElement = {
  type: 'table-row'
  children: TableCellElement[]
}

export type TableCellElement = {
  type: 'table-cell'
  children: CustomText[]
}

export type CodeBlockElement = {
  type: 'code-block'
  language?: string
  children: CustomText[]
}

export type DividerElement = {
  type: 'divider'
  children: EmptyText[]
}

// Union type for all custom elements
export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement
  | ImageElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | CodeBlockElement
  | DividerElement

// Define custom text types
export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  color?: string
  backgroundColor?: string
  fontSize?: string
  fontFamily?: string
}

export type EmptyText = {
  text: ''
}

// Slate value type
export type SlateValue = Descendant[]

// Rich text editor options
export interface RichTextEditorOptions {
  placeholder?: string
  readOnly?: boolean
  autoFocus?: boolean
  showToolbar?: boolean
  showFormatPanel?: boolean
  autoSave?: boolean
  debounceTime?: number
  maxLength?: number
  allowedFormats?: string[]
  customPlugins?: any[]
}

// Toolbar configuration
export interface ToolbarConfig {
  showBasicFormatting?: boolean
  showAdvancedFormatting?: boolean
  showAlignment?: boolean
  showLists?: boolean
  showLinks?: boolean
  showImages?: boolean
  showTables?: boolean
  showCodeBlocks?: boolean
  customButtons?: ToolbarButton[]
}

export interface ToolbarButton {
  id: string
  label: string
  icon?: string
  action: (editor: CustomEditor) => void
  isActive?: (editor: CustomEditor) => boolean
  isDisabled?: (editor: CustomEditor) => boolean
}

// Format panel configuration
export interface FormatPanelConfig {
  showTextFormatting?: boolean
  showParagraphFormatting?: boolean
  showTableFormatting?: boolean
  showImageFormatting?: boolean
  showStylePresets?: boolean
}

// Serialization formats
export type SerializationFormat = 'html' | 'markdown' | 'plain' | 'json'

// Plugin interface
export interface SlatePlugin {
  name: string
  withPlugin: (editor: CustomEditor) => CustomEditor
  renderElement?: (props: any) => React.ReactElement | undefined
  renderLeaf?: (props: any) => React.ReactElement | undefined
  onKeyDown?: (event: KeyboardEvent, editor: CustomEditor) => boolean | undefined
}

// Auto-save configuration
export interface AutoSaveConfig {
  enabled: boolean
  debounceTime: number
  onSave: (value: SlateValue) => Promise<void>
  onError?: (error: Error) => void
}

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: (editor: CustomEditor) => void
}

// Extend Slate's module declarations
declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

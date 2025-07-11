'use client'

import React, { useState } from 'react'
import { useSlate } from 'slate-react'
import { Editor } from 'slate'
import {
  X,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { toggleBlock, isBlockActive } from '../../utilities/slateUtils'

interface CollapsibleFormatPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

// Collapsible section component
interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

// Quick font size selector
const QuickFontSizes: React.FC = () => {
  const editor = useSlate()
  const sizes = ['12px', '14px', '16px', '18px', '20px', '24px']

  return (
    <div className="grid grid-cols-3 gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          onClick={() => Editor.addMark(editor, 'fontSize', size)}
        >
          {size}
        </button>
      ))}
    </div>
  )
}

// Color palette
const ColorPalette: React.FC<{ markType: 'color' | 'backgroundColor' }> = ({ markType }) => {
  const editor = useSlate()
  const colors = [
    '#000000',
    '#333333',
    '#666666',
    '#999999',
    '#CCCCCC',
    '#FFFFFF',
    '#FF0000',
    '#FF6600',
    '#FFCC00',
    '#00FF00',
    '#0066FF',
    '#6600FF',
    '#FF0066',
    '#FF3366',
    '#FF6666',
    '#66FF66',
    '#6666FF',
    '#9966FF',
  ]

  return (
    <div className="grid grid-cols-6 gap-1">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
          onClick={() => Editor.addMark(editor, markType, color)}
          title={color}
        />
      ))}
    </div>
  )
}

// Alignment controls
const AlignmentControls: React.FC = () => {
  const editor = useSlate()
  const alignments = [
    { value: 'left', icon: <AlignLeft size={16} />, title: 'Left' },
    { value: 'center', icon: <AlignCenter size={16} />, title: 'Center' },
    { value: 'right', icon: <AlignRight size={16} />, title: 'Right' },
    { value: 'justify', icon: <AlignJustify size={16} />, title: 'Justify' },
  ]

  return (
    <div className="grid grid-cols-4 gap-1">
      {alignments.map((alignment) => (
        <button
          key={alignment.value}
          type="button"
          className={`
            p-2 rounded border transition-colors
            ${
              isBlockActive(editor, alignment.value, 'align')
                ? 'bg-blue-100 border-blue-300 text-blue-600'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }
          `}
          onClick={() => toggleBlock(editor, alignment.value)}
          title={alignment.title}
        >
          {alignment.icon}
        </button>
      ))}
    </div>
  )
}

// Quick actions
const QuickActions: React.FC = () => {
  const editor = useSlate()

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="w-full text-left p-2 rounded border border-gray-300 hover:bg-gray-50 text-sm flex items-center transition-colors"
        onClick={() => {
          const marks = Editor.marks(editor)
          if (marks) {
            Object.keys(marks).forEach((mark) => {
              Editor.removeMark(editor, mark)
            })
          }
        }}
      >
        <Type size={16} className="mr-2" />
        Clear Formatting
      </button>
    </div>
  )
}

// Main collapsible format panel
export const CollapsibleFormatPanel: React.FC<CollapsibleFormatPanelProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" onClick={onClose} />

      {/* Panel */}
      <div
        className={`
          fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50
          md:relative md:w-64 md:shadow-none md:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Format</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Close format panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-16">
          <CollapsibleSection title="Text Size" defaultOpen>
            <QuickFontSizes />
          </CollapsibleSection>

          <CollapsibleSection title="Text Color">
            <ColorPalette markType="color" />
          </CollapsibleSection>

          <CollapsibleSection title="Background Color">
            <ColorPalette markType="backgroundColor" />
          </CollapsibleSection>

          <CollapsibleSection title="Alignment" defaultOpen>
            <AlignmentControls />
          </CollapsibleSection>

          <CollapsibleSection title="Quick Actions">
            <QuickActions />
          </CollapsibleSection>
        </div>
      </div>
    </>
  )
}

export default CollapsibleFormatPanel

import React from 'react'
import { useSlate } from 'slate-react'
import { Editor } from 'slate'
import {
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table,
  Image as ImageIcon,
} from 'lucide-react'
import { toggleBlock, isBlockActive } from '../../utilities/slateUtils'

interface FormatPanelProps {
  className?: string
}

// Panel section component
interface PanelSectionProps {
  title: string
  children: React.ReactNode
}

const PanelSection: React.FC<PanelSectionProps> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
    {children}
  </div>
)

// Font family selector
const FontFamilySelector: React.FC = () => {
  const editor = useSlate()

  const fontFamilies = [
    { value: 'system-ui', label: 'System UI' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Courier New', label: 'Courier New' },
  ]

  return (
    <select
      className="w-full p-2 border border-gray-300 rounded text-sm"
      onChange={(e) => {
        Editor.addMark(editor, 'fontFamily', e.target.value)
      }}
    >
      <option value="">Font Family</option>
      {fontFamilies.map((font) => (
        <option key={font.value} value={font.value}>
          {font.label}
        </option>
      ))}
    </select>
  )
}

// Font size selector
const FontSizeSelector: React.FC = () => {
  const editor = useSlate()

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']

  return (
    <select
      className="w-full p-2 border border-gray-300 rounded text-sm mt-2"
      onChange={(e) => {
        Editor.addMark(editor, 'fontSize', e.target.value)
      }}
    >
      <option value="">Font Size</option>
      {fontSizes.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  )
}

// Color picker
interface ColorPickerProps {
  label: string
  markType: 'color' | 'backgroundColor'
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, markType }) => {
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
    <div className="mt-2">
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <div className="grid grid-cols-6 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => {
              Editor.addMark(editor, markType, color)
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}

// Alignment controls
const AlignmentControls: React.FC = () => {
  const editor = useSlate()

  const alignments = [
    { value: 'left', icon: <AlignLeft size={16} />, title: 'Align Left' },
    { value: 'center', icon: <AlignCenter size={16} />, title: 'Align Center' },
    { value: 'right', icon: <AlignRight size={16} />, title: 'Align Right' },
    { value: 'justify', icon: <AlignJustify size={16} />, title: 'Justify' },
  ]

  return (
    <div className="flex space-x-1">
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

// Line height selector
const LineHeightSelector: React.FC = () => {
  const lineHeights = [
    { value: '1', label: 'Single' },
    { value: '1.15', label: '1.15' },
    { value: '1.5', label: '1.5' },
    { value: '2', label: 'Double' },
    { value: '2.5', label: '2.5' },
    { value: '3', label: 'Triple' },
  ]

  return (
    <select className="w-full p-2 border border-gray-300 rounded text-sm">
      <option value="">Line Height</option>
      {lineHeights.map((height) => (
        <option key={height.value} value={height.value}>
          {height.label}
        </option>
      ))}
    </select>
  )
}

// Style presets
const StylePresets: React.FC = () => {
  const editor = useSlate()

  const presets = [
    { name: 'Title', style: { fontSize: '32px', fontWeight: 'bold' } },
    { name: 'Subtitle', style: { fontSize: '24px', fontWeight: '600' } },
    { name: 'Heading', style: { fontSize: '20px', fontWeight: 'bold' } },
    { name: 'Body', style: { fontSize: '16px', fontWeight: 'normal' } },
    { name: 'Caption', style: { fontSize: '14px', fontStyle: 'italic' } },
    { name: 'Code', style: { fontFamily: 'monospace', fontSize: '14px' } },
  ]

  return (
    <div className="space-y-2">
      {presets.map((preset) => (
        <button
          key={preset.name}
          type="button"
          className="w-full text-left p-2 rounded border border-gray-300 hover:bg-gray-50 text-sm"
          onClick={() => {
            Object.entries(preset.style).forEach(([key, value]) => {
              Editor.addMark(editor, key as any, value)
            })
          }}
        >
          {preset.name}
        </button>
      ))}
    </div>
  )
}

// Main format panel component
export const FormatPanel: React.FC<FormatPanelProps> = ({ className = '' }) => {
  return (
    <div className={`w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Format</h2>

      <PanelSection title="Typography">
        <FontFamilySelector />
        <FontSizeSelector />
        <ColorPicker label="Text Color" markType="color" />
        <ColorPicker label="Background Color" markType="backgroundColor" />
      </PanelSection>

      <PanelSection title="Paragraph">
        <AlignmentControls />
        <div className="mt-3">
          <LineHeightSelector />
        </div>
      </PanelSection>

      <PanelSection title="Style Presets">
        <StylePresets />
      </PanelSection>

      <PanelSection title="Quick Actions">
        <div className="space-y-2">
          <button
            type="button"
            className="w-full text-left p-2 rounded border border-gray-300 hover:bg-gray-50 text-sm flex items-center"
            onClick={() => {
              const editor = useSlate()
              // Clear all formatting
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

          <button
            type="button"
            className="w-full text-left p-2 rounded border border-gray-300 hover:bg-gray-50 text-sm flex items-center"
            onClick={() => {
              // Copy current formatting (placeholder)
              console.log('Copy formatting')
            }}
          >
            <Palette size={16} className="mr-2" />
            Copy Format
          </button>
        </div>
      </PanelSection>
    </div>
  )
}

export default FormatPanel

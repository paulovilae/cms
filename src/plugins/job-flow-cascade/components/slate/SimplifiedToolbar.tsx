'use client'

import React, { useState } from 'react'
import { useSlate } from 'slate-react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Quote,
  Heading1,
  Heading2,
  Type,
  ChevronDown,
  ChevronUp,
  Settings,
} from 'lucide-react'
import {
  isMarkActive,
  toggleMark,
  isBlockActive,
  toggleBlock,
  insertLink,
  insertBulletedList,
  insertNumberedList,
  insertHeading,
} from '../../utilities/slateUtils'

interface SimplifiedToolbarProps {
  showAdvanced?: boolean
  onToggleAdvanced?: () => void
}

// Toolbar button component
interface ToolbarButtonProps {
  active?: boolean
  onMouseDown: (event: React.MouseEvent) => void
  children: React.ReactNode
  title?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  active,
  onMouseDown,
  children,
  title,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
  }

  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      title={title}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} rounded-md transition-all duration-200 touch-manipulation
        ${
          active
            ? 'bg-blue-100 text-blue-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      `}
    >
      {children}
    </button>
  )
}

// Mark button component
interface MarkButtonProps {
  format: keyof Omit<import('../../types/slate').CustomText, 'text'>
  icon: React.ReactNode
  title: string
  size?: 'sm' | 'md'
}

const MarkButton: React.FC<MarkButtonProps> = ({ format, icon, title, size = 'md' }) => {
  const editor = useSlate()

  return (
    <ToolbarButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      title={title}
      size={size}
    >
      {icon}
    </ToolbarButton>
  )
}

// Block button component
interface BlockButtonProps {
  format: string
  icon: React.ReactNode
  title: string
  size?: 'sm' | 'md'
}

const BlockButton: React.FC<BlockButtonProps> = ({ format, icon, title, size = 'md' }) => {
  const editor = useSlate()

  return (
    <ToolbarButton
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      title={title}
      size={size}
    >
      {icon}
    </ToolbarButton>
  )
}

// Link button component
const LinkButton: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const editor = useSlate()

  const handleLinkClick = (event: React.MouseEvent) => {
    event.preventDefault()
    const url = window.prompt('Enter the URL:')
    if (url) {
      insertLink(editor, url)
    }
  }

  return (
    <ToolbarButton onMouseDown={handleLinkClick} title="Insert Link" size={size}>
      <Link size={size === 'sm' ? 14 : 16} />
    </ToolbarButton>
  )
}

// Heading dropdown component
const HeadingDropdown: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const editor = useSlate()
  const [isOpen, setIsOpen] = useState(false)

  const headings = [
    { level: 1, label: 'Heading 1', icon: <Heading1 size={size === 'sm' ? 14 : 16} /> },
    { level: 2, label: 'Heading 2', icon: <Heading2 size={size === 'sm' ? 14 : 16} /> },
    { level: 3, label: 'Heading 3', icon: <Type size={size === 'sm' ? 14 : 16} /> },
  ]

  return (
    <div className="relative">
      <ToolbarButton
        onMouseDown={(event) => {
          event.preventDefault()
          setIsOpen(!isOpen)
        }}
        title="Headings"
        size={size}
      >
        <div className="flex items-center space-x-1">
          <Heading1 size={size === 'sm' ? 14 : 16} />
          <ChevronDown size={12} />
        </div>
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
          {headings.map((heading) => (
            <button
              key={heading.level}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
              onMouseDown={(event) => {
                event.preventDefault()
                insertHeading(editor, heading.level as 1 | 2 | 3)
                setIsOpen(false)
              }}
            >
              {heading.icon}
              <span>{heading.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Divider component
const ToolbarDivider: React.FC = () => <div className="w-px h-6 bg-gray-300 mx-1" />

// Main simplified toolbar component
export const SimplifiedToolbar: React.FC<SimplifiedToolbarProps> = ({
  showAdvanced = false,
  onToggleAdvanced,
}) => {
  const iconSize = 16

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
      {/* Essential formatting tools */}
      <div className="flex items-center space-x-1">
        {/* Basic text formatting */}
        <div className="flex items-center space-x-1">
          <MarkButton format="bold" icon={<Bold size={iconSize} />} title="Bold (Ctrl+B)" />
          <MarkButton format="italic" icon={<Italic size={iconSize} />} title="Italic (Ctrl+I)" />
          <MarkButton
            format="underline"
            icon={<Underline size={iconSize} />}
            title="Underline (Ctrl+U)"
          />
        </div>

        <ToolbarDivider />

        {/* Headings */}
        <HeadingDropdown />

        <ToolbarDivider />

        {/* Lists */}
        <div className="flex items-center space-x-1">
          <BlockButton format="bulleted-list" icon={<List size={iconSize} />} title="Bullet List" />
          <BlockButton
            format="numbered-list"
            icon={<ListOrdered size={iconSize} />}
            title="Numbered List"
          />
        </div>

        <ToolbarDivider />

        {/* Quote and Link */}
        <div className="flex items-center space-x-1">
          <BlockButton format="block-quote" icon={<Quote size={iconSize} />} title="Quote" />
          <LinkButton />
        </div>
      </div>

      {/* Advanced toggle */}
      {onToggleAdvanced && (
        <ToolbarButton
          onMouseDown={(event) => {
            event.preventDefault()
            onToggleAdvanced()
          }}
          title={showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
        >
          <div className="flex items-center space-x-1">
            <Settings size={14} />
            {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </ToolbarButton>
      )}
    </div>
  )
}

export default SimplifiedToolbar

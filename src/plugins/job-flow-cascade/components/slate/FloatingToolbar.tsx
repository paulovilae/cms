import React, { useRef, useEffect } from 'react'
import { useSlate, useFocused } from 'slate-react'
import { Editor, Range } from 'slate'
import { Bold, Italic, Underline, Link, Code } from 'lucide-react'
import { isMarkActive, toggleMark, insertLink } from '../../utilities/slateUtils'

// Floating toolbar button
interface FloatingButtonProps {
  active?: boolean
  onMouseDown: (event: React.MouseEvent) => void
  children: React.ReactNode
  title?: string
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  active,
  onMouseDown,
  children,
  title,
}) => (
  <button
    type="button"
    onMouseDown={onMouseDown}
    title={title}
    className={`
      p-1.5 rounded hover:bg-gray-100 transition-colors duration-200
      ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}
    `}
  >
    {children}
  </button>
)

// Floating mark button
interface FloatingMarkButtonProps {
  format: keyof Omit<import('../../types/slate').CustomText, 'text'>
  icon: React.ReactNode
  title: string
}

const FloatingMarkButton: React.FC<FloatingMarkButtonProps> = ({ format, icon, title }) => {
  const editor = useSlate()

  return (
    <FloatingButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      title={title}
    >
      {icon}
    </FloatingButton>
  )
}

// Floating link button
const FloatingLinkButton: React.FC = () => {
  const editor = useSlate()

  const handleLinkClick = (event: React.MouseEvent) => {
    event.preventDefault()
    const url = window.prompt('Enter the URL:')
    if (url) {
      insertLink(editor, url)
    }
  }

  return (
    <FloatingButton onMouseDown={handleLinkClick} title="Insert Link">
      <Link size={14} />
    </FloatingButton>
  )
}

// Main floating toolbar component
export const FloatingToolbar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()
  const inFocus = useFocused()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    if (!domSelection || domSelection.rangeCount === 0) {
      return
    }

    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()

    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 6}px`
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
  })

  return (
    <div
      ref={ref}
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center space-x-1 opacity-0 pointer-events-none transition-opacity duration-200"
      style={{
        top: '-10000px',
        left: '-10000px',
      }}
      onMouseDown={(e) => {
        // Prevent toolbar from losing focus when clicked
        e.preventDefault()
      }}
    >
      <FloatingMarkButton format="bold" icon={<Bold size={14} />} title="Bold" />
      <FloatingMarkButton format="italic" icon={<Italic size={14} />} title="Italic" />
      <FloatingMarkButton format="underline" icon={<Underline size={14} />} title="Underline" />
      <FloatingMarkButton format="code" icon={<Code size={14} />} title="Code" />

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <FloatingLinkButton />
    </div>
  )
}

export default FloatingToolbar

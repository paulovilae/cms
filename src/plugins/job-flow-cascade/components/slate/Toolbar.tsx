import React from 'react'
import { useSlate } from 'slate-react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Table,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Minus,
} from 'lucide-react'
import {
  isMarkActive,
  toggleMark,
  isBlockActive,
  toggleBlock,
  insertLink,
  insertImage,
  insertTable,
  insertBulletedList,
  insertNumberedList,
  insertHeading,
} from '../../utilities/slateUtils'

// Toolbar button component
interface ToolbarButtonProps {
  active?: boolean
  onMouseDown: (event: React.MouseEvent) => void
  children: React.ReactNode
  title?: string
  disabled?: boolean
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  active,
  onMouseDown,
  children,
  title,
  disabled = false,
}) => (
  <button
    type="button"
    onMouseDown={onMouseDown}
    title={title}
    disabled={disabled}
    className={`
      p-2 rounded hover:bg-gray-100 transition-colors duration-200
      ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {children}
  </button>
)

// Mark button component
interface MarkButtonProps {
  format: keyof Omit<import('../../types/slate').CustomText, 'text'>
  icon: React.ReactNode
  title: string
}

const MarkButton: React.FC<MarkButtonProps> = ({ format, icon, title }) => {
  const editor = useSlate()

  return (
    <ToolbarButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      title={title}
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
}

const BlockButton: React.FC<BlockButtonProps> = ({ format, icon, title }) => {
  const editor = useSlate()

  return (
    <ToolbarButton
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      title={title}
    >
      {icon}
    </ToolbarButton>
  )
}

// Link button component
const LinkButton: React.FC = () => {
  const editor = useSlate()

  const handleLinkClick = (event: React.MouseEvent) => {
    event.preventDefault()
    const url = window.prompt('Enter the URL:')
    if (url) {
      insertLink(editor, url)
    }
  }

  return (
    <ToolbarButton onMouseDown={handleLinkClick} title="Insert Link">
      <Link size={16} />
    </ToolbarButton>
  )
}

// Image button component
const ImageButton: React.FC = () => {
  const editor = useSlate()

  const handleImageClick = (event: React.MouseEvent) => {
    event.preventDefault()
    const url = window.prompt('Enter the image URL:')
    if (url) {
      insertImage(editor, url)
    }
  }

  return (
    <ToolbarButton onMouseDown={handleImageClick} title="Insert Image">
      <Image size={16} />
    </ToolbarButton>
  )
}

// Table button component
const TableButton: React.FC = () => {
  const editor = useSlate()

  const handleTableClick = (event: React.MouseEvent) => {
    event.preventDefault()
    insertTable(editor, 2, 2)
  }

  return (
    <ToolbarButton onMouseDown={handleTableClick} title="Insert Table">
      <Table size={16} />
    </ToolbarButton>
  )
}

// Heading button component
interface HeadingButtonProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  icon: React.ReactNode
  title: string
}

const HeadingButton: React.FC<HeadingButtonProps> = ({ level, icon, title }) => {
  const editor = useSlate()

  const handleHeadingClick = (event: React.MouseEvent) => {
    event.preventDefault()
    insertHeading(editor, level)
  }

  return (
    <ToolbarButton onMouseDown={handleHeadingClick} title={title}>
      {icon}
    </ToolbarButton>
  )
}

// Divider component
const ToolbarDivider: React.FC = () => <div className="w-px h-6 bg-gray-300 mx-1" />

// Main toolbar component
export const Toolbar: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
      {/* Text formatting */}
      <MarkButton format="bold" icon={<Bold size={16} />} title="Bold (Ctrl+B)" />
      <MarkButton format="italic" icon={<Italic size={16} />} title="Italic (Ctrl+I)" />
      <MarkButton format="underline" icon={<Underline size={16} />} title="Underline (Ctrl+U)" />
      <MarkButton format="strikethrough" icon={<Strikethrough size={16} />} title="Strikethrough" />
      <MarkButton format="code" icon={<Code size={16} />} title="Inline Code" />

      <ToolbarDivider />

      {/* Headings */}
      <HeadingButton level={1} icon={<Heading1 size={16} />} title="Heading 1" />
      <HeadingButton level={2} icon={<Heading2 size={16} />} title="Heading 2" />
      <HeadingButton level={3} icon={<Heading3 size={16} />} title="Heading 3" />

      <ToolbarDivider />

      {/* Alignment */}
      <BlockButton format="left" icon={<AlignLeft size={16} />} title="Align Left" />
      <BlockButton format="center" icon={<AlignCenter size={16} />} title="Align Center" />
      <BlockButton format="right" icon={<AlignRight size={16} />} title="Align Right" />
      <BlockButton format="justify" icon={<AlignJustify size={16} />} title="Justify" />

      <ToolbarDivider />

      {/* Lists */}
      <BlockButton format="bulleted-list" icon={<List size={16} />} title="Bulleted List" />
      <BlockButton format="numbered-list" icon={<ListOrdered size={16} />} title="Numbered List" />

      <ToolbarDivider />

      {/* Block types */}
      <BlockButton format="block-quote" icon={<Quote size={16} />} title="Block Quote" />
      <BlockButton format="code-block" icon={<Code size={16} />} title="Code Block" />

      <ToolbarDivider />

      {/* Insert elements */}
      <LinkButton />
      <ImageButton />
      <TableButton />

      <ToolbarDivider />

      {/* Divider */}
      <ToolbarButton
        onMouseDown={(event) => {
          event.preventDefault()
          const editor = useSlate()
          const divider = {
            type: 'divider',
            children: [{ text: '' }],
          }
          editor.insertNode(divider as any)
        }}
        title="Insert Divider"
      >
        <Minus size={16} />
      </ToolbarButton>
    </div>
  )
}

export default Toolbar

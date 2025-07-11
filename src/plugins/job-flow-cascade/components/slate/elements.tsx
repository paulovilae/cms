import React from 'react'
import { RenderElementProps, RenderLeafProps } from 'slate-react'

// Element renderer
export const Element: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
  const style: React.CSSProperties = {}

  if ('align' in element && element.align) {
    style.textAlign = element.align
  }

  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          {...attributes}
          style={style}
          className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4"
        >
          {children}
        </blockquote>
      )

    case 'bulleted-list':
      return (
        <ul {...attributes} style={style} className="list-disc list-inside my-4 space-y-1">
          {children}
        </ul>
      )

    case 'numbered-list':
      return (
        <ol {...attributes} style={style} className="list-decimal list-inside my-4 space-y-1">
          {children}
        </ol>
      )

    case 'list-item':
      return (
        <li {...attributes} style={style} className="ml-4">
          {children}
        </li>
      )

    case 'heading':
      const level = 'level' in element ? element.level : 1
      const headingClasses = {
        1: 'text-3xl font-bold my-6',
        2: 'text-2xl font-bold my-5',
        3: 'text-xl font-bold my-4',
        4: 'text-lg font-bold my-3',
        5: 'text-base font-bold my-2',
        6: 'text-sm font-bold my-2',
      }

      const headingProps = {
        ...attributes,
        style,
        className: headingClasses[level as keyof typeof headingClasses],
      }

      switch (level) {
        case 1:
          return <h1 {...headingProps}>{children}</h1>
        case 2:
          return <h2 {...headingProps}>{children}</h2>
        case 3:
          return <h3 {...headingProps}>{children}</h3>
        case 4:
          return <h4 {...headingProps}>{children}</h4>
        case 5:
          return <h5 {...headingProps}>{children}</h5>
        case 6:
          return <h6 {...headingProps}>{children}</h6>
        default:
          return <h1 {...headingProps}>{children}</h1>
      }

    case 'link':
      const url = 'url' in element ? element.url : '#'
      return (
        <a
          {...attributes}
          href={url}
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )

    case 'image':
      const imageUrl = 'url' in element ? element.url : ''
      const alt = 'alt' in element ? element.alt : ''
      const width = 'width' in element ? element.width : undefined
      const height = 'height' in element ? element.height : undefined
      const imageAlign = 'align' in element ? element.align : 'left'

      return (
        <div
          {...attributes}
          className={`my-4 ${imageAlign === 'center' ? 'text-center' : imageAlign === 'right' ? 'text-right' : 'text-left'}`}
        >
          <img
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className="max-w-full h-auto rounded shadow-sm"
            contentEditable={false}
          />
          {children}
        </div>
      )

    case 'table':
      return (
        <div {...attributes} className="my-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <tbody>{children}</tbody>
          </table>
        </div>
      )

    case 'table-row':
      return (
        <tr {...attributes} className="border-b border-gray-200">
          {children}
        </tr>
      )

    case 'table-cell':
      return (
        <td {...attributes} className="border border-gray-300 px-3 py-2 min-w-[100px]">
          {children}
        </td>
      )

    case 'code-block':
      const language = 'language' in element ? element.language : ''
      return (
        <div {...attributes} className="my-4">
          <pre className="bg-gray-100 rounded p-4 overflow-x-auto">
            <code className={language ? `language-${language}` : ''}>{children}</code>
          </pre>
        </div>
      )

    case 'divider':
      return (
        <div {...attributes} className="my-6">
          <hr className="border-t-2 border-gray-300" />
          {children}
        </div>
      )

    default:
      return (
        <p {...attributes} style={style} className="my-2 leading-relaxed">
          {children}
        </p>
      )
  }
}

// Leaf renderer
export const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  let element = children

  if (leaf.bold) {
    element = <strong>{element}</strong>
  }

  if (leaf.italic) {
    element = <em>{element}</em>
  }

  if (leaf.underline) {
    element = <u>{element}</u>
  }

  if (leaf.strikethrough) {
    element = <del>{element}</del>
  }

  if (leaf.code) {
    element = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{element}</code>
  }

  const style: React.CSSProperties = {}

  if (leaf.color) {
    style.color = leaf.color
  }

  if (leaf.backgroundColor) {
    style.backgroundColor = leaf.backgroundColor
  }

  if (leaf.fontSize) {
    style.fontSize = leaf.fontSize
  }

  if (leaf.fontFamily) {
    style.fontFamily = leaf.fontFamily
  }

  return (
    <span {...attributes} style={style}>
      {element}
    </span>
  )
}

// Default render functions
export const renderElement = (props: RenderElementProps) => <Element {...props} />
export const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />

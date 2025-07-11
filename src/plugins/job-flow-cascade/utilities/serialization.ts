import { Node as SlateNode, Text } from 'slate'
import { SlateValue } from '../types/slate'
import { createEmptyDocument } from './slateUtils'

// Serialize Slate value to HTML
export const serializeToHTML = (nodes: SlateValue): string => {
  return nodes.map((node) => serializeNodeToHTML(node)).join('')
}

// Serialize individual node to HTML
const serializeNodeToHTML = (node: SlateNode): string => {
  if (Text.isText(node)) {
    let text = escapeHtml(node.text)

    if (node.bold) text = `<strong>${text}</strong>`
    if (node.italic) text = `<em>${text}</em>`
    if (node.underline) text = `<u>${text}</u>`
    if (node.strikethrough) text = `<del>${text}</del>`
    if (node.code) text = `<code>${text}</code>`

    return text
  }

  const element = node as any
  const children =
    element.children?.map((child: SlateNode) => serializeNodeToHTML(child)).join('') || ''

  switch (element.type) {
    case 'paragraph':
      return `<p>${children}</p>`
    case 'heading':
      const level = element.level || 1
      return `<h${level}>${children}</h${level}>`
    case 'block-quote':
      return `<blockquote>${children}</blockquote>`
    case 'bulleted-list':
      return `<ul>${children}</ul>`
    case 'numbered-list':
      return `<ol>${children}</ol>`
    case 'list-item':
      return `<li>${children}</li>`
    case 'link':
      return `<a href="${escapeHtml(element.url || '#')}">${children}</a>`
    case 'image':
      return `<img src="${escapeHtml(element.url || '')}" alt="${escapeHtml(element.alt || '')}" />`
    case 'code-block':
      return `<pre><code>${children}</code></pre>`
    case 'divider':
      return '<hr />'
    default:
      return `<p>${children}</p>`
  }
}

// Serialize Slate value to Markdown
export const serializeToMarkdown = (nodes: SlateValue): string => {
  return nodes.map((node) => serializeNodeToMarkdown(node)).join('\n\n')
}

// Serialize individual node to Markdown
const serializeNodeToMarkdown = (node: SlateNode): string => {
  if (Text.isText(node)) {
    let text = node.text
    if (node.bold) text = `**${text}**`
    if (node.italic) text = `*${text}*`
    if (node.code) text = `\`${text}\``
    return text
  }

  const element = node as any
  const children =
    element.children?.map((child: SlateNode) => serializeNodeToMarkdown(child)).join('') || ''

  switch (element.type) {
    case 'paragraph':
      return children
    case 'heading':
      const level = element.level || 1
      return `${'#'.repeat(level)} ${children}`
    case 'block-quote':
      return `> ${children}`
    case 'code-block':
      return `\`\`\`\n${children}\n\`\`\``
    case 'divider':
      return '---'
    default:
      return children
  }
}

// Serialize Slate value to plain text
export const serializeToPlainText = (nodes: SlateValue): string => {
  return nodes.map((node) => SlateNode.string(node)).join('\n')
}

// Simple HTML to Slate deserializer
export const deserializeFromHTML = (html: string): SlateValue => {
  if (!html || html.trim() === '') {
    return createEmptyDocument()
  }

  // Simple conversion - split by common block elements
  const blocks = html
    .split(/<\/?(p|div|h[1-6]|blockquote|li)[^>]*>/gi)
    .filter((block) => block.trim())
    .map((block) => {
      const text = block.replace(/<[^>]*>/g, '').trim()
      return text ? { type: 'paragraph', children: [{ text }] } : null
    })
    .filter(Boolean)

  return blocks.length > 0 ? (blocks as SlateValue) : createEmptyDocument()
}

// Simple Markdown to Slate deserializer
export const deserializeFromMarkdown = (markdown: string): SlateValue => {
  if (!markdown || markdown.trim() === '') {
    return createEmptyDocument()
  }

  const lines = markdown.split('\n')
  const nodes: any[] = []

  for (const line of lines) {
    if (line.trim() === '') continue

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headerMatch && headerMatch[2]) {
      nodes.push({
        type: 'heading',
        level: headerMatch[1].length,
        children: [{ text: headerMatch[2] }],
      })
      continue
    }

    // Block quotes
    if (line.startsWith('> ')) {
      nodes.push({
        type: 'block-quote',
        children: [{ text: line.substring(2) }],
      })
      continue
    }

    // Regular paragraph
    nodes.push({
      type: 'paragraph',
      children: [{ text: line }],
    })
  }

  return nodes.length > 0 ? (nodes as SlateValue) : createEmptyDocument()
}

// Helper function to escape HTML
const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Serialize for database storage
export const serializeForDatabase = (value: SlateValue): any => {
  return JSON.parse(JSON.stringify(value))
}

// Deserialize from database
export const deserializeFromDatabase = (data: any): SlateValue => {
  if (!data || !Array.isArray(data)) {
    return createEmptyDocument()
  }

  return data as SlateValue
}

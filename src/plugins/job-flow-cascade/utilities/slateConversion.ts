import escapeHTML from 'escape-html'
import { Text } from 'slate'
import { jsx } from 'slate-hyperscript'

/**
 * Convert Slate nodes to plain text
 * @param nodes Slate nodes to convert
 * @returns Plain text string
 */
export function slateToText(nodes: any[]): string {
  return nodes
    .map((node) => {
      if (Text.isText(node)) {
        return node.text
      }

      if (node.children?.length) {
        return slateToText(node.children)
      }

      return ''
    })
    .join('')
}

/**
 * Convert plain text to Slate nodes
 * @param text Plain text to convert
 * @returns Array of Slate paragraph nodes
 */
export function textToSlate(text: string): any[] {
  // Split the text by newlines to create paragraphs
  const paragraphs = text.split('\n')

  return paragraphs.map((paragraph) => ({
    type: 'p',
    children: [{ text: paragraph }],
  }))
}

/**
 * Convert Slate nodes to HTML
 * @param nodes Slate nodes to convert
 * @returns HTML string
 */
export function slateToHtml(nodes: any[]): string {
  return nodes
    .map((node) => {
      if (Text.isText(node)) {
        let text = escapeHTML(node.text)
        if (node.bold) text = `<strong>${text}</strong>`
        if (node.italic) text = `<em>${text}</em>`
        if (node.underline) text = `<u>${text}</u>`
        if (node.strikethrough) text = `<s>${text}</s>`
        if (node.code) text = `<code>${text}</code>`
        return text
      }

      const children = node.children.map((n: any) => slateToHtml([n])).join('')

      switch (node.type) {
        case 'p':
          return `<p>${children}</p>`
        case 'h1':
          return `<h1>${children}</h1>`
        case 'h2':
          return `<h2>${children}</h2>`
        case 'h3':
          return `<h3>${children}</h3>`
        case 'h4':
          return `<h4>${children}</h4>`
        case 'h5':
          return `<h5>${children}</h5>`
        case 'h6':
          return `<h6>${children}</h6>`
        case 'blockquote':
          return `<blockquote>${children}</blockquote>`
        case 'ul':
          return `<ul>${children}</ul>`
        case 'ol':
          return `<ol>${children}</ol>`
        case 'li':
          return `<li>${children}</li>`
        case 'a':
          return `<a href="${escapeHTML(node.url)}">${children}</a>`
        default:
          return children
      }
    })
    .join('')
}

/**
 * Convert HTML to Slate nodes (basic implementation)
 * For a production app, consider using a proper HTML parser
 * @param html HTML string to convert
 * @returns Array of Slate nodes
 */
export function htmlToSlate(html: string): any[] {
  // This is a simplified implementation
  // For production, use a proper HTML parser like jsdom or parse5
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  return Array.from(doc.body.childNodes).map(deserializeNode)
}

/**
 * Helper function to deserialize DOM nodes to Slate nodes
 */
function deserializeNode(node: Node): any {
  if (node.nodeType === Node.TEXT_NODE) {
    return { text: node.textContent || '' }
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const element = node as Element
  const children = Array.from(element.childNodes).map(deserializeNode).filter(Boolean)

  switch (element.nodeName.toLowerCase()) {
    case 'p':
      return { type: 'p', children }
    case 'h1':
      return { type: 'h1', children }
    case 'h2':
      return { type: 'h2', children }
    case 'h3':
      return { type: 'h3', children }
    case 'h4':
      return { type: 'h4', children }
    case 'h5':
      return { type: 'h5', children }
    case 'h6':
      return { type: 'h6', children }
    case 'ul':
      return { type: 'ul', children }
    case 'ol':
      return { type: 'ol', children }
    case 'li':
      return { type: 'li', children }
    case 'blockquote':
      return { type: 'blockquote', children }
    case 'a':
      return {
        type: 'a',
        url: element.getAttribute('href') || '',
        children,
      }
    case 'strong':
    case 'b':
      return children.map((child) => ({ ...child, bold: true }))
    case 'em':
    case 'i':
      return children.map((child) => ({ ...child, italic: true }))
    case 'u':
      return children.map((child) => ({ ...child, underline: true }))
    case 's':
    case 'strike':
      return children.map((child) => ({ ...child, strikethrough: true }))
    case 'code':
      return children.map((child) => ({ ...child, code: true }))
    default:
      return children
  }
}

/**
 * Find nodes in a Slate document by type
 * @param nodes Slate nodes to search
 * @param type Node type to find
 * @returns Array of matching nodes
 */
export function findNodesByType(nodes: any[], type: string): any[] {
  const result: any[] = []

  nodes.forEach((node) => {
    if (node.type === type) {
      result.push(node)
    }

    if (node.children?.length) {
      result.push(...findNodesByType(node.children, type))
    }
  })

  return result
}

/**
 * Format Slate content based on style preference
 * @param content Slate content to format
 * @param style Style preference (formal, casual, etc.)
 * @returns Formatted Slate content
 */
export function formatSlateContent(content: any[], style: string): any[] {
  // This is a placeholder implementation
  // In a real implementation, you might apply different styling based on preference
  // For example, formal style might use more professional language
  return content
}

/**
 * Check if Slate content is empty
 * @param nodes Slate nodes to check
 * @returns True if content is empty
 */
export function isSlateContentEmpty(nodes: any[]): boolean {
  if (!nodes || nodes.length === 0) return true

  return nodes.every((node) => {
    if (Text.isText(node)) {
      return !node.text.trim()
    }

    if (node.children?.length) {
      return isSlateContentEmpty(node.children)
    }

    return true
  })
}

/**
 * Create a skeleton Slate document with placeholder sections
 * @param sections Array of section titles
 * @returns Slate document with placeholder sections
 */
export function createSkeletonDocument(sections: string[]): any[] {
  return sections.map((section) => ({
    type: 'h2',
    children: [{ text: section }],
    following: [
      {
        type: 'p',
        children: [{ text: 'Content will be generated here...' }],
      },
    ],
  }))
}

/**
 * Merge multiple Slate documents into one
 * @param documents Array of Slate documents to merge
 * @returns Merged Slate document
 */
export function mergeSlateDocuments(documents: any[][]): any[] {
  return documents.flat()
}

/**
 * Convert Slate content to markdown
 * @param nodes Slate nodes to convert
 * @returns Markdown string
 */
export function slateToMarkdown(nodes: any[]): string {
  return nodes
    .map((node) => {
      if (Text.isText(node)) {
        let text = node.text
        if (node.bold) text = `**${text}**`
        if (node.italic) text = `*${text}*`
        if (node.code) text = `\`${text}\``
        if (node.strikethrough) text = `~~${text}~~`
        return text
      }

      const children = node.children.map((n: any) => slateToMarkdown([n])).join('')

      switch (node.type) {
        case 'p':
          return `${children}\n\n`
        case 'h1':
          return `# ${children}\n\n`
        case 'h2':
          return `## ${children}\n\n`
        case 'h3':
          return `### ${children}\n\n`
        case 'h4':
          return `#### ${children}\n\n`
        case 'h5':
          return `##### ${children}\n\n`
        case 'h6':
          return `###### ${children}\n\n`
        case 'blockquote':
          return `> ${children}\n\n`
        case 'ul':
          return children
        case 'ol':
          return children
        case 'li':
          return `- ${children}\n`
        case 'a':
          return `[${children}](${node.url})`
        default:
          return children
      }
    })
    .join('')
}

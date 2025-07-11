'use client'

import React from 'react'
import { ImprovedSlateEditor } from './ImprovedSlateEditor'
import { SlateErrorBoundary, PlainTextEditor } from './ErrorBoundary'
import { RichTextEditorOptions, SlateValue } from '../../types/slate'

interface SlateRichTextEditorProps {
  value?: SlateValue
  onChange?: (value: SlateValue) => void
  options?: RichTextEditorOptions
  onSave?: (value: SlateValue) => Promise<void>
  className?: string
}

export const SlateRichTextEditor: React.FC<SlateRichTextEditorProps> = ({
  value,
  onChange,
  options = {},
  onSave,
  className = '',
}) => {
  return (
    <SlateErrorBoundary
      fallback={
        <PlainTextEditor
          value={typeof value === 'string' ? value : ''}
          onChange={(text) =>
            onChange?.([{ type: 'paragraph', children: [{ text }] }] as SlateValue)
          }
          placeholder={options.placeholder}
          className={className}
        />
      }
    >
      <ImprovedSlateEditor
        value={value}
        onChange={onChange}
        options={options}
        onSave={onSave}
        className={className}
      />
    </SlateErrorBoundary>
  )
}

export default SlateRichTextEditor

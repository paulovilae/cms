'use client'

import React, { useState } from 'react'
import { RichTextEditor } from '../RichTextEditor'
import { SlateValue } from '../../types/slate'

/**
 * Simple test component for the Slate Rich Text Editor
 * This component can be used to verify that the editor is working correctly
 */
export const SlateEditorTest: React.FC = () => {
  const [content, setContent] = useState<SlateValue>([
    {
      type: 'paragraph',
      children: [{ text: 'Start typing to test the rich text editor...' }],
    },
  ])

  const [saveStatus, setSaveStatus] = useState<string>('')

  const handleChange = (newContent: SlateValue) => {
    setContent(newContent)
    setSaveStatus('Modified')
  }

  const handleSave = async (contentToSave: SlateValue) => {
    setSaveStatus('Saving...')

    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Saved content:', contentToSave)
    setSaveStatus('Saved')

    // Clear status after 2 seconds
    setTimeout(() => setSaveStatus(''), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Rich Text Editor Test</h1>
        <p className="text-gray-600">
          This is a test component to verify the Slate.js rich text editor functionality.
        </p>
        {saveStatus && (
          <div className="mt-2 text-sm font-medium">
            Status: <span className="text-blue-600">{saveStatus}</span>
          </div>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <RichTextEditor
          content={content}
          onChange={handleChange}
          onSave={handleSave}
          placeholder="Type something here to test the editor..."
          options={{
            showToolbar: true,
            showFormatPanel: false,
            autoSave: true,
            debounceTime: 2000,
          }}
          className="min-h-[400px]"
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Content Preview (JSON):</h3>
        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-medium mb-2">Test Instructions:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Try typing text in the editor</li>
          <li>Test formatting with Ctrl+B (bold), Ctrl+I (italic)</li>
          <li>Try creating headings with # at the start of a line</li>
          <li>Test lists with * or - at the start of a line</li>
          <li>Check if auto-save is working (should save after 2 seconds of inactivity)</li>
        </ul>
      </div>
    </div>
  )
}

export default SlateEditorTest

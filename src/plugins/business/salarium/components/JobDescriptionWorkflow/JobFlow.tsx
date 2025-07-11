'use client'

import React, { useState, useEffect } from 'react'
import AutoCascadeSystem from './AutoCascadeSystem'

// This is a simplified example of how to integrate the Auto-Cascade System
// into the existing Salarium job flow UI

export const JobFlow = () => {
  const [documentId, setDocumentId] = useState<string>('mock-document-123')
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch document sections on component mount
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)

        const response = await fetch(`/api/flow-instances/${documentId}`, {
          headers: {
            'x-business': 'salarium', // Business context header
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch document')
        }

        setSections(data.data.sections || [])
        setError(null)
      } catch (err: any) {
        console.error('Error fetching document:', err)
        setError(err.message || 'Failed to fetch document')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  // Handle section update
  const handleSectionUpdate = async (sectionId: string, content: any) => {
    try {
      // Update the section in the UI immediately for better UX
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId ? { ...section, content, isCompleted: true } : section,
        ),
      )

      // Update the section in the database
      const response = await fetch(`/api/flow-instances/${documentId}/update-section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-business': 'salarium',
        },
        body: JSON.stringify({
          sectionId,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update section: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to update section')
      }
    } catch (err: any) {
      console.error('Error updating section:', err)
      // Revert the UI update if the API call fails
      // This would ideally be more sophisticated in production
    }
  }

  // Handle completion of auto-generation
  const handleAutoGenerateComplete = () => {
    console.log('Auto-generation complete!')
    // Additional actions could be performed here, such as:
    // - Showing a success message
    // - Moving to the next step in the workflow
    // - Triggering analytics events
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Job Description</h1>

      {/* Job Title Input */}
      <div className="mb-6">
        <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
          Job Title
        </label>
        <input
          type="text"
          id="jobTitle"
          className="w-full p-2 border rounded"
          placeholder="e.g., Senior Software Engineer"
          defaultValue="Senior Software Engineer"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter a detailed job title to improve auto-generation results
        </p>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2">Loading document...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Auto-Cascade System */}
      {!loading && !error && (
        <div className="mb-10">
          <AutoCascadeSystem
            documentId={documentId}
            sections={sections}
            onSectionUpdate={handleSectionUpdate}
            onComplete={handleAutoGenerateComplete}
          />
        </div>
      )}

      {/* Job Description Sections */}
      {!loading && !error && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Job Description Content</h2>

          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">
                  {section.stepNumber && `${section.stepNumber}. `}
                  {section.title}
                </h3>

                {section.content && section.content.length > 0 ? (
                  <div className="prose max-w-none">
                    {/* In a real implementation, this would use a proper rich text renderer */}
                    {section.content.map((block: any, index: number) => (
                      <p key={index}>
                        {block.children.map((child: any, childIndex: number) => (
                          <span key={childIndex}>{child.text}</span>
                        ))}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No content yet. Use auto-generate to create content.
                  </p>
                )}

                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      section.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></span>
                  <span className="text-sm text-gray-600">
                    {section.isCompleted ? 'Completed' : 'Not completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default JobFlow

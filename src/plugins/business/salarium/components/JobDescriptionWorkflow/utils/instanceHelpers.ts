/**
 * Helper functions for managing flow instances
 */

import { FlowInstance, Step, StepResponse } from '../types'
import { createBusinessHeaders } from './businessContext'

/**
 * Loads a flow instance if it exists, or creates a new one
 */
export async function loadOrCreateInstance(
  templateId: string,
  steps: Step[],
): Promise<FlowInstance | null> {
  try {
    // First, try to find an existing draft instance for this template
    let existingResponse = await fetch(
      `/api/flow-instances?where[template][equals]=${templateId}&where[status][equals]=draft&limit=1`,
      {
        headers: createBusinessHeaders('salarium'),
      },
    )

    if (!existingResponse.ok) {
      throw new Error(`HTTP error! status: ${existingResponse.status}`)
    }

    let existingData = await existingResponse.json()

    // If no draft found, try in-progress
    if (!existingData.docs || existingData.docs.length === 0) {
      existingResponse = await fetch(
        `/api/flow-instances?where[template][equals]=${templateId}&where[status][equals]=in-progress&limit=1`,
        {
          headers: createBusinessHeaders('salarium'),
        },
      )

      if (existingResponse.ok) {
        existingData = await existingResponse.json()
      }
    }

    if (existingData.docs && existingData.docs.length > 0) {
      // Use existing instance
      return existingData.docs[0]
    } else {
      // No existing instance found - create a new one
      return await createNewInstance(templateId, steps)
    }
  } catch (error) {
    console.error('Error loading instance:', error)
    return null
  }
}

/**
 * Creates a new flow instance
 */
export async function createNewInstance(
  templateId: string,
  steps: Step[],
): Promise<FlowInstance | null> {
  try {
    // First get the current user info
    const userResponse = await fetch('/api/users/me', {
      headers: createBusinessHeaders('salarium'),
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user information')
    }

    const userData = await userResponse.json()

    // Generate title with proper format: "Job title - date - time"
    const now = new Date()
    const dateStr = now.toLocaleDateString()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const instanceTitle = `New Job Description - ${dateStr} - ${timeStr}`

    // Create a new instance
    const createResponse = await fetch('/api/flow-instances', {
      method: 'POST',
      headers: createBusinessHeaders('salarium'),
      body: JSON.stringify({
        title: instanceTitle,
        template: templateId,
        status: 'draft',
        currentStep: 1,
        totalSteps: steps.length,
        progress: 0,
        stepResponses: [],
        createdBy: userData.id,
      }),
    })

    if (!createResponse.ok) {
      throw new Error(`Failed to create flow instance: ${createResponse.status}`)
    }

    const data = await createResponse.json()
    return data.doc || data
  } catch (error) {
    console.error('Error creating new instance:', error)
    return null
  }
}

/**
 * Updates a step response in a flow instance
 */
export async function updateStepResponse(
  instanceId: string,
  stepResponse: Partial<StepResponse>,
  allResponses: StepResponse[],
  totalSteps: number,
): Promise<FlowInstance | null> {
  try {
    // Ensure stepNumber is defined
    if (stepResponse.stepNumber === undefined) {
      throw new Error('stepNumber is required for updating a step response')
    }

    // Update the step response in the array
    const updatedStepResponses = [...allResponses]
    const stepIndex = updatedStepResponses.findIndex(
      (r) => r.stepNumber === stepResponse.stepNumber,
    )

    if (stepIndex >= 0 && stepIndex < updatedStepResponses.length) {
      // We found the step response to update
      const existingResponse = updatedStepResponses[stepIndex]

      // Verify that existingResponse is defined (it should be based on our find)
      if (existingResponse) {
        // Create an updated version with all required fields
        const updatedResponse: StepResponse = {
          stepNumber: stepResponse.stepNumber,
          stepTitle: stepResponse.stepTitle || existingResponse.stepTitle,
          userInput:
            stepResponse.userInput !== undefined
              ? stepResponse.userInput
              : existingResponse.userInput,
          aiGeneratedContent:
            stepResponse.aiGeneratedContent !== undefined
              ? stepResponse.aiGeneratedContent
              : existingResponse.aiGeneratedContent,
          isCompleted:
            stepResponse.isCompleted !== undefined
              ? stepResponse.isCompleted
              : existingResponse.isCompleted,
          lastUpdated: new Date().toISOString(),
        }

        // Replace the old response with the updated one
        updatedStepResponses[stepIndex] = updatedResponse
      }
    } else {
      // If not found, add new response with all required fields
      updatedStepResponses.push({
        stepNumber: stepResponse.stepNumber,
        stepTitle: stepResponse.stepTitle || '',
        userInput: stepResponse.userInput || '',
        aiGeneratedContent: stepResponse.aiGeneratedContent || '',
        isCompleted: stepResponse.isCompleted || false,
        lastUpdated: new Date().toISOString(),
      })
    }

    // Calculate progress
    const completedSteps = updatedStepResponses.filter((r) => r.isCompleted).length
    const progress = Math.round((completedSteps / totalSteps) * 100)

    // Update instance
    const response = await fetch(`/api/flow-instances/${instanceId}`, {
      method: 'PATCH',
      headers: createBusinessHeaders('salarium'),
      body: JSON.stringify({
        stepResponses: updatedStepResponses,
        progress,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0]?.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.doc || data
  } catch (error) {
    console.error('Update step error:', error)
    return null
  }
}

/**
 * Generates the final document based on step responses and template
 */
export async function generateFinalDocument(
  instanceId: string,
  templateOutputFormat: string,
  stepResponses: StepResponse[],
): Promise<FlowInstance | null> {
  try {
    // Generate final document using the template's outputTemplate
    let finalDoc =
      templateOutputFormat ||
      `# {{jobTitle}}

## Position Overview
{{jobMission}}

## Scope & Impact
{{jobScope}}

## Key Responsibilities
{{keyResponsibilities}}

## Qualifications
{{qualifications}}

## About {{organizationName}}
{{organizationDescription}}

---
*Generated by Salarium on {{generationDate}}*`

    // Replace placeholders with actual content
    stepResponses.forEach((response) => {
      const placeholder = getPlaceholderForStep(response.stepTitle)
      if (response.aiGeneratedContent) {
        finalDoc = finalDoc.replace(placeholder, response.aiGeneratedContent)
      }
    })

    // Add generation metadata
    finalDoc = finalDoc.replace('{{generationDate}}', new Date().toLocaleDateString())
    finalDoc = finalDoc.replace('{{organizationName}}', 'Your Organization')
    finalDoc = finalDoc.replace(
      '{{organizationDescription}}',
      'A forward-thinking organization committed to excellence.',
    )

    // Save the final document
    const response = await fetch(`/api/flow-instances/${instanceId}`, {
      method: 'PATCH',
      headers: createBusinessHeaders('salarium'),
      body: JSON.stringify({
        finalDocument: finalDoc,
        status: 'completed',
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate final document: ${response.status}`)
    }

    const data = await response.json()
    return data.doc || data
  } catch (error) {
    console.error('Document generation error:', error)
    return null
  }
}

/**
 * Gets placeholder for a step title
 */
function getPlaceholderForStep(stepTitle: string): string {
  const placeholders: Record<string, string> = {
    'Job Title': '{{jobTitle}}',
    'Job Mission': '{{jobMission}}',
    'Job Scope & Reach': '{{jobScope}}',
    'Key Responsibilities': '{{keyResponsibilities}}',
    'Required Qualifications': '{{qualifications}}',
  }
  return placeholders[stepTitle] || `{{${stepTitle.toLowerCase().replace(/\s+/g, '')}}}`
}

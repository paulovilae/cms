# Auto-Cascade System for Salarium Job Descriptions

This module provides an AI-powered auto-generation system for job descriptions in the Salarium platform. The system automatically generates content for each section of a job description in sequence, using the job title and previously generated sections as context.

## Core Features

- **Progressive Generation**: Generates content for sections in sequence, using previous sections as context
- **Configuration Options**: Allows users to customize the generation process (style, sections to preserve, etc.)
- **Visual Progress**: Shows real-time progress and status of the generation process
- **Error Handling**: Gracefully handles errors and allows retrying

## Architecture

### Components

1. **AutoCascadeSystem**: Main controller component that integrates all parts
2. **AutoGenerateButton**: Button to trigger generation with different states
3. **CascadeProgress**: Progress indicator showing generation status
4. **RegenerationOptions**: Configuration options for the generation process

### Hooks

- **useCascadeGeneration**: Main hook managing the generation state and process

### API Routes

- **GET /api/flow-instances/[documentId]**: Fetches all sections of a job description
- **POST /api/flow-instances/[documentId]/process-section**: Generates content for a specific section
- **POST /api/flow-instances/[documentId]/update-section**: Updates a section's content

## Usage

```jsx
import AutoCascadeSystem from './AutoCascadeSystem'

// In your component
const YourComponent = () => {
  const documentId = 'your-document-id'
  const sections = [/* array of section objects */]
  
  const handleSectionUpdate = (sectionId, content) => {
    // Update your local state or database
  }
  
  const handleComplete = () => {
    // Do something when generation is complete
  }
  
  return (
    <AutoCascadeSystem
      documentId={documentId}
      sections={sections}
      onSectionUpdate={handleSectionUpdate}
      onComplete={handleComplete}
    />
  )
}
```

## Integration with Existing Workflow

The `JobFlow.tsx` file demonstrates how to integrate the Auto-Cascade System into the existing Salarium job flow UI. It handles:

1. Fetching document data
2. Displaying the Auto-Cascade System
3. Handling section updates
4. Displaying job description sections with their content

## Generation Process

1. User enters a job title
2. User configures generation options (optional)
3. User clicks "Auto-Generate Content"
4. System fetches any existing sections
5. System generates content for each section in sequence
6. Each generated section is saved to the database
7. UI is updated with the new content in real-time

## Customization

The generation process can be customized with:

- **Style Preference**: Choose between detailed, concise, or technical writing styles
- **Starting Section**: Choose which section to start generating from
- **Section Preservation**: Select sections to keep unchanged
- **Regeneration**: Choose whether to regenerate already completed sections

## Technical Implementation

The system uses a cascade approach where:
- Each section is processed in sequence
- Previous sections are used as context for generating the next section
- AI prompts are customized based on user preferences
- Progress is tracked and displayed in real-time

## Extending the System

To add new features:
1. Modify the `useCascadeGeneration` hook for new generation logic
2. Update the API routes for new backend functionality
3. Add new UI components or enhance existing ones
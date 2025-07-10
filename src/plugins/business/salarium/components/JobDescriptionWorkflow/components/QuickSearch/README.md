# Job Description Search Integration

This component integrates the Universal Search system into the Job Description Workflow to help HR users find existing job descriptions as references before creating new ones.

## Components Overview

### 1. QuickSearch Component

The `QuickSearch` component is a simplified search interface embedded within the Job Description Workflow. It provides an expandable search panel that allows users to:

- Search for existing job descriptions by title, skills, or other keywords
- View recently searched terms
- View recently viewed job descriptions
- Select a job description to use as a reference
- Navigate to the full HR Search tool for advanced searching

### 2. ReferencePanel Component

The `ReferencePanel` component displays a selected reference job description within the workflow. It:

- Shows the most relevant content for the current workflow step
- Allows copying of reference content
- Provides a link to view the full job description
- Can be closed when no longer needed

## Usage

The components are integrated directly into the Job Description Workflow:

```tsx
// In JobDescriptionWorkflow.tsx
import { QuickSearch } from './components/QuickSearch'
import { ReferencePanel } from './components/QuickSearch/ReferencePanel'

// ...

// Add QuickSearch at appropriate location (usually step 1)
{currentStep === 1 && !hasProcessed && (
  <QuickSearch onSelectReference={handleReferenceSelection} />
)}

// Show reference panel when a reference is selected
{showReferencePanel && referenceJob && (
  <ReferencePanel 
    reference={referenceJob}
    onClose={() => setShowReferencePanel(false)}
    currentStep={currentStep}
  />
)}
```

## Features

- **Contextual Search**: Provides relevant search right within the job creation workflow
- **Reference Display**: Shows reference content relevant to the current creation step
- **Recent Items**: Maintains history of recent searches and viewed job descriptions
- **Persistent Storage**: Saves search history and viewed items to localStorage
- **Navigation Integration**: Links to the full HR Search tool for advanced searching

## Technical Implementation

The components use a custom `useJobDescriptionSearch` hook that implements a simplified version of the Universal Search functionality. This hook:

1. Fetches job descriptions from the API
2. Filters results based on search terms
3. Generates highlights for search matches
4. Maintains a cache for faster repeated searches

## Related Components

- **HRUniversalSearch**: The standalone search tool available at `/salarium/hr-search`
- **JobDescriptionWorkflow**: The main workflow component that integrates these search components

## Further Development

Potential enhancements to consider:

1. Advanced filtering within the quick search
2. AI-powered suggestions for similar job descriptions
3. Side-by-side comparison view for multiple references
4. Analytics to track which references are most frequently used
# Job Flow Cascade Plugin

A universal document generation plugin for Payload CMS that provides AI-powered document creation and editing capabilities across all business units.

## Features

- **Document-Centric Interface**: Fullscreen UI focused on content creation
- **Section-Based Architecture**: Hierarchical document structure with ordered sections
- **AI-Powered Generation**: Intelligent content creation with cascading capabilities
- **Rich Text Editing**: Advanced formatting and styling options
- **Block Integration**: Can be embedded in any content model
- **Multi-Tenant Compatible**: Works across all business applications

## Installation

The plugin is automatically included in the Payload CMS configuration.

## Usage

### As a Standalone Feature in Salarium

The plugin is integrated into the Salarium workflow system and accessible through the following routes:

- **Main Dashboard**: `/salarium/job-flow`
- **Create New Document**: `/salarium/job-flow/new`
- **Edit Existing Document**: `/salarium/job-flow/[documentId]`

### Frontend Integration Example

```tsx
import { AutoCascadeWorkspace } from '@/plugins/job-flow-cascade';

export default function JobFlowPage({ params }) {
  const { documentId } = params;
  
  return (
    <div className="container mx-auto p-4">
      <AutoCascadeWorkspace documentId={documentId} />
    </div>
  );
}
```

### As a Block in Content Pages

The plugin can also be used as a block within other content pages:

```tsx
// In a Payload block field
{
  name: 'layout',
  type: 'blocks',
  blocks: [
    // Other blocks
    AutoCascadeBlock,
  ],
}
```

### API Integration

The plugin leverages the existing Salarium API endpoints:

- `POST /api/flow-instances/[documentId]/process-section` - Generate content for a section
- `POST /api/flow-instances/[documentId]/update-section` - Update section content

## Collections

The plugin creates three collections:

1. **flow-documents**: Document metadata
   - title, description, status, metadata

2. **document-sections**: Section content
   - title, documentId, type, order, content, isCompleted

3. **generation-history**: AI generation history
   - documentId, sectionId, timestamp, type, prompt, response

## React Hooks

The plugin provides several custom hooks:

- `useDocumentState`: Document CRUD operations
- `useCascadeGeneration`: Generation workflow
- `useRichTextEditor`: Editor operations

## Components

- `AutoCascadeWorkspace`: Main component for document editing
- `DocumentHeader`: Title and main controls
- `SectionEditor`: Section editing component
- `ActionPanel`: Tools for export and formatting

## AI Integration

The plugin integrates with Payload's AI provider system for document generation. The AI processing flow:

1. User triggers generation (single section or cascade)
2. System builds context from document and previous sections
3. Prompt is constructed based on section type and style preference
4. Request is sent to Payload's AI provider
5. Response is processed and formatted for the editor
6. Content is saved to the section
7. UI is updated with new content and animations
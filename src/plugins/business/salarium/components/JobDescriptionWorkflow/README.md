# Job Description Workflow

A modular, step-by-step workflow for creating professional job descriptions in the Salarium business context.

## Features

- Multi-step job description creation workflow
- AI-assisted content generation for each section
- Auto-cascade generation to populate all sections from a job title
- Document preview and export capabilities
- Real-time validation and error handling

## Component Architecture

The JobDescriptionWorkflow has been built using a modular architecture for maintainability and separation of concerns:

```
JobDescriptionWorkflow/
├── components/                 # UI Components
│   ├── AutoCascadeIntegration.tsx  # Auto-generation modal
│   ├── DocumentPreview.tsx     # Preview/export component
│   ├── StepContent.tsx         # Step content editor
│   └── StepSelector.tsx        # Step navigation component
├── utils/                      # Utility functions
│   ├── businessContext.ts      # Business context utilities
│   ├── contextHelpers.ts       # Context and prompt building helpers
│   └── validationHelpers.ts    # Input validation functions
├── AutoCascadeSystem/          # Auto-cascade feature (separate system)
│   ├── components/             # UI components for auto-cascade
│   └── hooks/                  # Custom hooks for auto-cascade
├── types.ts                    # Shared TypeScript interfaces
├── index.tsx                   # Main component
└── README.md                   # Documentation
```

## Usage

```tsx
import JobDescriptionWorkflow from '@/plugins/business/salarium/components/JobDescriptionWorkflow';

// In your component
return (
  <JobDescriptionWorkflow 
    flowInstanceId="job-description-123" 
  />
);
```

## API Routes

The component interacts with several API endpoints:

- `GET /api/flow-instances/:id` - Fetch flow instance data
- `POST /api/flow-instances/:id/generate` - Generate content for a step
- `POST /api/flow-instances/:id/update-step` - Update a step response
- `POST /api/flow-instances/:id/status` - Update flow instance status
- `POST /api/flow-instances/:id/export` - Export the document
- `POST /api/flow-instances/:id/process-section` - Auto-cascade section processing
- `POST /api/flow-instances/:id/update-section` - Update section content

## Workflow Steps

1. **Job Title** - Define a clear, specific job title
2. **Job Mission** - Describe the core purpose of the role
3. **Job Scope & Reach** - Define boundaries and influence
4. **Key Responsibilities** - List primary duties and tasks
5. **Required Qualifications** - Specify required skills and experience

## Auto-Cascade Generation

The workflow includes an AI-powered auto-cascade system that can automatically generate all sections of a job description from just a job title. This feature:

- Generates content for all steps in sequence
- Ensures consistency across sections
- Allows regeneration of specific sections
- Provides progress tracking

## Component Integration

The JobDescriptionWorkflow can be easily integrated into the Salarium business flow:

1. Create a new flow instance in the database
2. Pass the flow instance ID to the component
3. The component handles all state management and API interactions

## Development Notes

- All API calls use the business context header for multi-tenant support
- The component is designed to work with Payload CMS's backend
- TypeScript interfaces ensure type safety throughout the codebase
- UI is built with TailwindCSS for consistent styling
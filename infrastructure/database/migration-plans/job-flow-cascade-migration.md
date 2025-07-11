# Job Flow Cascade Migration Plan

This document outlines the comprehensive migration plan from Salarium-specific job flow to the generic Job Flow Cascade model.

## Current Schema Structure

### FlowDocuments Collection
```typescript
{
  slug: 'flow-documents',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'status', type: 'select', options: ['draft', 'in-progress', 'completed', 'archived'] },
    { name: 'businessUnit', type: 'select', options: ['salarium', 'intellitrade', 'latinos', 'capacita'] },
    { name: 'templateId', type: 'text' },
    { name: 'metadata', type: 'json' }
  ]
}
```

### DocumentSections Collection
```typescript
{
  slug: 'document-sections',
  fields: [
    { name: 'documentId', type: 'relationship', relationTo: 'flow-documents', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['introduction', 'summary', 'responsibilities', 'requirements', 'qualifications', 'benefits', 'custom'] },
    { name: 'order', type: 'number', required: true },
    { name: 'content', type: 'richText' },
    { name: 'isCompleted', type: 'checkbox', defaultValue: false },
    { name: 'isGenerated', type: 'checkbox', defaultValue: false },
    { name: 'lastGeneratedAt', type: 'date' }
  ]
}
```

### GenerationHistory Collection
```typescript
{
  slug: 'generation-history',
  fields: [
    { name: 'documentId', type: 'relationship', relationTo: 'flow-documents', required: true },
    { name: 'sectionId', type: 'relationship', relationTo: 'document-sections', required: true },
    { name: 'type', type: 'select', options: ['initial', 'refinement', 'alternative', 'manual'] },
    { name: 'prompt', type: 'textarea', required: true },
    { name: 'response', type: 'json', required: true },
    { name: 'aiProvider', type: 'text' },
    { name: 'metadata', type: 'json' }
  ]
}
```

## Phase 1: Schema Enhancements

### FlowDocuments Collection Enhancements
```typescript
// Add these fields to the FlowDocuments collection
{
  // New relationships
  { name: 'template', type: 'relationship', relationTo: 'flow-templates' },
  { name: 'organization', type: 'relationship', relationTo: 'organizations' },
  
  // New workflow group
  { name: 'workflow', type: 'group', fields: [
    { name: 'currentStep', type: 'number', defaultValue: 0 },
    { name: 'totalSteps', type: 'number', defaultValue: 0 },
    { name: 'progress', type: 'number', defaultValue: 0 },
    { name: 'stepSequence', type: 'array', fields: [
      { name: 'stepNumber', type: 'number', required: true },
      { name: 'sectionId', type: 'text', required: true },
      { name: 'dependencies', type: 'array', fields: [{ name: 'stepNumber', type: 'number' }] },
      { name: 'isCompleted', type: 'checkbox', defaultValue: false }
    ]}
  ]},
  
  // New AI config group
  { name: 'aiConfig', type: 'group', fields: [
    { name: 'preferredProvider', type: 'relationship', relationTo: 'ai-providers' },
    { name: 'systemPromptOverrides', type: 'json' },
    { name: 'defaultPrompt', type: 'textarea' }
  ]}
}
```

### DocumentSections Collection Enhancements
```typescript
// Enhance the DocumentSections collection
{
  // Enhanced type field with more options
  { name: 'type', type: 'select', options: [
    // Existing options
    'introduction', 'summary', 'responsibilities', 'requirements', 'qualifications', 'benefits', 'custom',
    // New options
    'text_input', 'rich_text', 'multiple_choice', 'checkbox', 'radio_group', 'date_input', 'file_upload', 'ai_generated'
  ]},
  
  // New input configuration group
  { name: 'inputConfig', type: 'group', fields: [
    { name: 'placeholder', type: 'text' },
    { name: 'defaultValue', type: 'text' },
    { name: 'minLength', type: 'number' },
    { name: 'maxLength', type: 'number' },
    { name: 'isRequired', type: 'checkbox', defaultValue: false },
    { name: 'validationRules', type: 'array', fields: [
      { name: 'rule', type: 'text', required: true },
      { name: 'errorMessage', type: 'text' }
    ]},
    { name: 'options', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'text', required: true },
      { name: 'description', type: 'text' }
    ]}
  ]},
  
  // New AI configuration group
  { name: 'aiConfig', type: 'group', fields: [
    { name: 'systemPrompt', type: 'textarea' },
    { name: 'exampleResponse', type: 'textarea' },
    { name: 'inputMapping', type: 'json' },
    { name: 'temperature', type: 'number', defaultValue: 0.7 }
  ]},
  
  // New interaction history array
  { name: 'interactionHistory', type: 'array', fields: [
    { name: 'timestamp', type: 'date', required: true },
    { name: 'userInput', type: 'json' },
    { name: 'aiOutput', type: 'json' },
    { name: 'feedback', type: 'text' }
  ]}
}
```

### New Flow Templates Collection
```typescript
// Create a new FlowTemplates collection
{
  slug: 'flow-templates',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'category', type: 'text' },
    { name: 'businessUnit', type: 'select', options: ['salarium', 'intellitrade', 'latinos', 'capacita', 'all'] },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    
    // Section templates array
    { name: 'sectionTemplates', type: 'array', fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'type', type: 'select', options: [
        'introduction', 'summary', 'responsibilities', 'requirements', 'qualifications', 'benefits', 'custom',
        'text_input', 'rich_text', 'multiple_choice', 'checkbox', 'radio_group', 'date_input', 'file_upload', 'ai_generated'
      ]},
      { name: 'order', type: 'number', required: true },
      { name: 'inputConfig', type: 'group', /* Same as DocumentSections inputConfig */ },
      { name: 'aiConfig', type: 'group', /* Same as DocumentSections aiConfig */ },
      { name: 'defaultContent', type: 'json' },
      { name: 'dependencies', type: 'array', fields: [{ name: 'sectionTitle', type: 'text' }] }
    ]},
    
    { name: 'defaultAiProvider', type: 'relationship', relationTo: 'ai-providers' },
    { name: 'globalSystemPrompt', type: 'textarea' },
    { name: 'workflow', type: 'group', fields: [
      { name: 'enableCascade', type: 'checkbox', defaultValue: true },
      { name: 'requireApproval', type: 'checkbox', defaultValue: false },
      { name: 'maxConcurrentSections', type: 'number', defaultValue: 1 }
    ]}
  ]
}
```

## Phase 2: Migration Scripts

For the migration, we'll need to create the following scripts:

1. `createFlowTemplatesCollection.sql` - Create the new flow-templates collection
2. `enhanceFlowDocumentsCollection.sql` - Add new fields to flow-documents collection
3. `enhanceDocumentSectionsCollection.sql` - Add new fields to document-sections collection
4. `migrateFlowTemplatesData.js` - Convert Salarium templates to generic templates
5. `migrateFlowInstancesData.js` - Convert instances to documents + sections
6. `validateMigration.js` - Verify data integrity after migration

## Phase 3: Data Migration Process

The migration process will follow these steps:

1. Backup existing data
2. Apply schema changes
3. Migrate templates:
   - Extract templates from Salarium's flow-templates
   - Convert to new generic schema
   - Save to new flow-templates collection
4. Migrate instances:
   - For each flow-instance:
     - Create flow-document with enhanced fields
     - Convert stepResponses to document-sections
     - Link to appropriate template
     - Preserve metadata
5. Update associations:
   - Link documents to templates
   - Create workflow step sequences
   - Preserve generation history
6. Validate migration:
   - Check for data integrity
   - Verify relationships
   - Test document loading

## Phase 4: Integration Updates

After migration, the following integration points need to be updated:

1. API Helpers (`enhancedApiHelpers.ts`)
   - Support template-based document creation
   - Handle workflow step management
   - Support new field types

2. Adapter Layer (`salariumAdapter.ts`)
   - Provide backward compatibility
   - Convert between old and new data formats
   - Maintain API contract compatibility

3. Rich Text Editor Integration
   - Support new section types and configurations
   - Handle template-driven editing experience

## Success Criteria

1. All Salarium flow-templates converted to generic flow-templates
2. All flow-instances converted to flow-documents + document-sections
3. All stepResponses converted to individual document sections
4. All AI generation history preserved
5. Rich Text Editor works with migrated data
6. No data loss or corruption
7. Backward compatibility maintained
# Data Transformation Guide

This document provides detailed guidance on the data transformations required during the migration from Salarium-specific job flow to the generic Job Flow Cascade model.

## Template Transformations

### Salarium Step to Section Template Mapping

| Salarium Field | Generic Field | Transformation |
|----------------|---------------|----------------|
| `stepNumber` | `order` | Direct mapping |
| `stepTitle` | `title` | Direct mapping |
| `description` | `description` | Direct mapping |
| `questionText` | `inputConfig.placeholder` | Direct mapping |
| `systemPrompt` | `aiConfig.systemPrompt` | Direct mapping |
| `stepType` | `type` | Map using `stepTypeToSectionType` lookup |
| `isRequired` | `inputConfig.isRequired` | Direct mapping |
| `validationRules.minLength` | `inputConfig.minLength` | Direct mapping |
| `validationRules.maxLength` | `inputConfig.maxLength` | Direct mapping |
| `validationRules.customMessage` | `inputConfig.validationRules[].errorMessage` | Convert to validation rule array |
| `examples[0].expectedOutput` | `aiConfig.exampleResponse` | Take first example's expected output |

### Step Type Conversion

```
text → text_input
textarea → rich_text
select → multiple_choice
checkbox → checkbox
radio → radio_group
```

### Validation Rules Conversion

Convert the validation rules object to an array of rule objects:

```javascript
// Input:
{
  minLength: 100,
  maxLength: 500,
  customMessage: "Please enter a valid description"
}

// Output:
[
  {
    rule: "min_length",
    value: 100,
    errorMessage: "Input must be at least 100 characters"
  },
  {
    rule: "max_length",
    value: 500,
    errorMessage: "Input must be at most 500 characters"
  }
]
```

## Instance Transformations

### Flow Instance to Flow Document Mapping

| Salarium Field | Generic Field | Transformation |
|----------------|---------------|----------------|
| `id` | `id` | Direct mapping |
| `title` | `title` | Direct mapping |
| `template` | `templateId` | Direct mapping |
| `status` | `status` | Map using `statusMapping` lookup |
| `currentStep` | `workflow_currentStep` | Direct mapping |
| `totalSteps` | `workflow_totalSteps` | Direct mapping |
| `progress` | `workflow_progress` | Direct mapping |
| N/A | `businessUnit` | Set to "salarium" |
| N/A | `description` | Set to "Migrated from Salarium Job Flow" |

### Step Response to Document Section Mapping

| Salarium Field | Generic Field | Transformation |
|----------------|---------------|----------------|
| `stepNumber` | `order` | Direct mapping |
| `stepTitle` | `title` | Direct mapping |
| `userInput` | `metadata.userInput` | Store in metadata |
| `aiGeneratedContent` | `content` | Convert to rich text format |
| `isCompleted` | `isCompleted` | Direct mapping |
| `lastUpdated` | `updatedAt` | Direct mapping |
| `completedAt` | `metadata.completedAt` | Store in metadata |
| N/A | `isGenerated` | Set to true |
| N/A | `type` | Derive from template step type |

### Text to Rich Text Conversion

Convert plain text content to Slate.js rich text format:

```javascript
// Input:
"This is plain text content."

// Output:
[
  {
    type: "paragraph",
    children: [
      {
        text: "This is plain text content."
      }
    ]
  }
]
```

For content with line breaks, split into multiple paragraphs:

```javascript
// Input:
"First paragraph.\n\nSecond paragraph."

// Output:
[
  {
    type: "paragraph",
    children: [
      {
        text: "First paragraph."
      }
    ]
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Second paragraph."
      }
    ]
  }
]
```

## Workflow Step Sequence Creation

Create a workflow step sequence array from the template:

```javascript
// Input: Template with section templates
// Output:
[
  {
    stepNumber: 1,
    sectionId: "section-id-1", // Will be filled during migration
    dependencies: [], // No dependencies for first step
    isCompleted: false
  },
  {
    stepNumber: 2,
    sectionId: "section-id-2", // Will be filled during migration
    dependencies: [1], // Depends on step 1
    isCompleted: false
  },
  // Additional steps...
]
```

## Generation History Updates

Update generation history records to link to new document sections:

```sql
UPDATE "generation-history"
SET sectionId = (
  SELECT id FROM "document-sections" 
  WHERE documentId = "generation-history".documentId 
  AND order = (
    SELECT stepNumber FROM "flow-instances.stepResponses" 
    WHERE instanceId = "generation-history".documentId
  )
)
WHERE EXISTS (
  SELECT 1 FROM "document-sections" 
  WHERE documentId = "generation-history".documentId
)
```

## AI Configuration Mapping

Map AI configuration from Salarium to the generic model:

```javascript
// Default AI configuration
const defaultAiConfig = {
  temperature: 0.7,
  systemPromptOverrides: null,
  defaultPrompt: null
}

// Map existing template system prompts to section-specific prompts
function mapAiConfiguration(template) {
  return {
    ...defaultAiConfig,
    // Add any template-specific configurations
  }
}
```

## Input Configuration Mapping

Create input configuration based on step type:

```javascript
function createInputConfig(step) {
  const baseConfig = {
    placeholder: step.questionText || '',
    isRequired: step.isRequired || false,
    validationRules: convertValidationRules(step.validationRules)
  }
  
  switch (step.stepType) {
    case 'text':
      return {
        ...baseConfig,
        minLength: step.validationRules?.minLength,
        maxLength: step.validationRules?.maxLength
      }
    case 'select':
      return {
        ...baseConfig,
        options: step.options?.map(option => ({
          label: option.label,
          value: option.value
        })) || []
      }
    // Other step types...
    default:
      return baseConfig
  }
}
```

## Edge Cases and Special Handling

### Handling Missing Fields

For missing fields in the source data, apply these defaults:

- Missing `isRequired` → Set to `false`
- Missing `stepType` → Default to `rich_text`
- Missing `validationRules` → Set to empty array `[]`
- Missing `content` → Set to `null`

### Handling Incomplete Step Responses

For incomplete step responses in instances:

1. Create document section with `isCompleted: false`
2. Set content to `null` or a default empty rich text structure
3. Include any partial user input in `metadata.userInput`

### Handling Corrupt Data

If corrupt data is encountered:

1. Log the issue in the migration report
2. Skip the problematic record if non-critical
3. Abort the migration if critical data is corrupt

## Validation Criteria

After migration, verify:

1. **Count Integrity**: Equal number of templates, instances, and sections
2. **Relationship Integrity**: All relationships are properly established
3. **Content Integrity**: Rich text content is properly formatted
4. **Workflow Integrity**: Step sequences correctly reflect original flow
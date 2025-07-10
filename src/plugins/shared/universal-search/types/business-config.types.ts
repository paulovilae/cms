import {
  AIPromptConfig,
  ActionConfig,
  FilterConfig,
  PreviewConfig,
  SearchableField,
} from './config.types'

/**
 * BusinessSearchConfig - Extended configuration for business-specific search implementations
 */
export interface BusinessSearchConfig {
  /** Business-specific search fields with weights */
  searchFields: BusinessSearchField[]

  /** Business-specific filters */
  filters: BusinessFilterConfig[]

  /** Specialized actions for search results */
  actions: BusinessActionConfig[]

  /** Custom preview configuration */
  previewConfig: BusinessPreviewConfig

  /** AI prompt customizations */
  aiPromptCustomizations: BusinessAIPromptConfig
}

/**
 * BusinessSearchField - Extended search field with additional business-specific properties
 */
export interface BusinessSearchField {
  /** Field name in the collection */
  name: string

  /** Weight for relevance scoring (higher = more important) */
  weight: number

  /** Field type for specialized processing */
  type?: 'text' | 'richText' | 'array' | 'relationship' | 'date' | 'number' | 'boolean'

  /** Boost type for exact matches */
  boost?: 'exact' | 'prefix' | 'phrase' | 'fuzzy'

  /** Field-specific analyzer */
  analyzer?: 'standard' | 'keyword' | 'simple' | 'whitespace'
}

/**
 * BusinessFilterConfig - Extended filter configuration with business-specific properties
 */
export interface BusinessFilterConfig {
  /** Unique filter key */
  key: string

  /** Display label */
  label: string

  /** Filter type */
  type: 'select' | 'multiselect' | 'range' | 'dateRange' | 'boolean' | 'text' | 'relationship'

  /** For relationship fields, the collection to relate to */
  relationTo?: string

  /** Allow multiple selections */
  multiple?: boolean

  /** Field path in the document (can be nested with dot notation) */
  fieldPath?: string

  /** Filter options for select/multiselect types */
  options?: Array<{ label: string; value: string }> | 'dynamic'

  /** Minimum value for range filters */
  min?: number

  /** Maximum value for range filters */
  max?: number

  /** Step value for range filters */
  step?: number

  /** Unit label for range filters (e.g., '$', '%') */
  unit?: string

  /** Filter this depends on (for cascading filters) */
  dependsOn?: string
}

/**
 * BusinessActionConfig - Extended action configuration with business-specific properties
 */
export interface BusinessActionConfig {
  /** Unique action identifier */
  id: string

  /** Display label */
  label: string

  /** Icon identifier */
  icon?: string

  /** Whether action requires a selected item */
  requiresSelection?: boolean

  /** Handler function name (implemented in business plugin) */
  handler: string

  /** Permission function to determine if action is available */
  permission?: (context: { user: any; item?: any }) => boolean

  /** Dynamic label function that can change based on the item */
  dynamicLabel?: (item: any) => string
}

/**
 * BusinessPreviewConfig - Extended preview configuration with business-specific properties
 */
export interface BusinessPreviewConfig {
  /** Layout type for preview */
  layout: 'card' | 'list' | 'table' | 'grid'

  /** Fields to display in preview */
  fields: BusinessPreviewField[]

  /** Thumbnail configuration */
  thumbnail?: {
    /** Field containing thumbnail image */
    field: string

    /** Fallback image if field is empty */
    fallback: string

    /** Thumbnail width */
    width: number

    /** Thumbnail height */
    height: number

    /** Alt text field or static text */
    alt: string

    /** Optional formatter for the thumbnail */
    formatter?: string
  }
}

/**
 * BusinessPreviewField - Extended preview field with business-specific properties
 */
export interface BusinessPreviewField {
  /** Field key in the document */
  key: string

  /** Display label */
  label: string

  /** Formatter function or identifier */
  formatter: string

  /** Typography variant */
  typographyVariant?: string

  /** Maximum length for text content */
  maxLength?: number

  /** Maximum items to show for arrays */
  maxItems?: number

  /** Whether to highlight matches */
  highlightMatches?: boolean

  /** Status color mapping for status badges */
  statusColors?: Record<string, string>

  /** Fields for composite formatters */
  fields?: Record<string, string>
}

/**
 * BusinessAIPromptConfig - Extended AI prompt configuration with business-specific properties
 */
export interface BusinessAIPromptConfig {
  /** System prompt for AI context */
  systemPrompt: string

  /** Query enhancement prompt template */
  queryEnhancement: string

  /** Business-specific context data for AI */
  contextData: {
    /** Entity type being searched */
    entityType: string

    /** Domain-specific terminology */
    terminology: Record<string, string>

    /** Additional context fields specific to the business domain */
    [key: string]: any
  }

  /** Suggestion prompt template */
  suggestionPrompt: string
}

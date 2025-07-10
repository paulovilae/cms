export interface UniversalSearchConfig {
  collection: string
  displayName: string
  searchableFields: SearchableField[]
  filters: FilterConfig[]
  actions: ActionConfig[]
  preview: PreviewConfig
  ai: AIConfig
  performance?: PerformanceConfig
}

export interface SearchableField {
  field: string
  weight: number
  type: 'text' | 'keyword' | 'semantic' | 'tag' | 'date' | 'number' | 'boolean'
  searchable: boolean
  filterable: boolean
  highlightable: boolean
  analyzer?: 'standard' | 'keyword' | 'simple' | 'whitespace'
}

export interface FilterConfig {
  field: string
  type: 'select' | 'multiselect' | 'range' | 'dateRange' | 'boolean' | 'text'
  label: string
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  defaultValue?: any
  condition?: string
}

export interface FilterOption {
  label: string
  value: string | number | boolean
  count?: number
  icon?: string
}

export interface ActionConfig {
  id: string
  label: string
  icon?: string
  condition?: string
  type?: 'primary' | 'secondary' | 'danger'
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

export interface PreviewConfig {
  enabled: boolean
  fields: PreviewField[]
  template?: string
  maxLength?: number
  showActions?: boolean
}

export interface PreviewField {
  field: string
  label: string
  type: 'text' | 'html' | 'markdown' | 'date' | 'number' | 'tag' | 'status'
  truncate?: number
  format?: string
}

export interface AIConfig {
  semanticSearch: boolean
  intentRecognition: boolean
  suggestions: boolean
  autoTagging: boolean
  similaritySearch: boolean
  contentAnalysis: boolean
  prompts: AIPromptConfig
  provider?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface AIPromptConfig {
  semantic: string
  suggestions: string
  intent: string
  analysis: string
  tagging: string
  similarity: string
}

export interface PerformanceConfig {
  cacheEnabled: boolean
  cacheTTL: number
  maxResults: number
  debounceMs: number
  prefetchEnabled: boolean
  virtualScrolling: boolean
  indexingEnabled: boolean
}

export interface CollectionSearchConfig {
  [collectionSlug: string]: UniversalSearchConfig
}

export interface SearchEngineConfig {
  collections: CollectionSearchConfig
  global: GlobalSearchConfig
  ai: GlobalAIConfig
  performance: GlobalPerformanceConfig
}

export interface GlobalSearchConfig {
  enabled: boolean
  crossCollectionSearch: boolean
  defaultPageSize: number
  maxPageSize: number
  highlightEnabled: boolean
  facetsEnabled: boolean
  analyticsEnabled: boolean
}

export interface GlobalAIConfig {
  enabled: boolean
  defaultProvider: string
  fallbackToKeyword: boolean
  semanticThreshold: number
  intentThreshold: number
  suggestionCount: number
  maxProcessingTime: number
}

export interface GlobalPerformanceConfig {
  cacheEnabled: boolean
  defaultCacheTTL: number
  maxCacheSize: number
  indexingBatchSize: number
  searchTimeout: number
  retryAttempts: number
  retryDelay: number
}

export interface SearchConfigBuilder {
  collection(slug: string): SearchConfigBuilder
  displayName(name: string): SearchConfigBuilder
  searchableField(config: SearchableField): SearchConfigBuilder
  filter(config: FilterConfig): SearchConfigBuilder
  action(config: ActionConfig): SearchConfigBuilder
  preview(config: PreviewConfig): SearchConfigBuilder
  ai(config: AIConfig): SearchConfigBuilder
  performance(config: PerformanceConfig): SearchConfigBuilder
  build(): UniversalSearchConfig
}

// Predefined configurations for common use cases
export interface PresetConfig {
  name: string
  description: string
  config: Partial<UniversalSearchConfig>
}

export const PRESET_CONFIGS: Record<string, PresetConfig> = {
  documents: {
    name: 'Document Search',
    description: 'Optimized for text documents and content',
    config: {
      searchableFields: [
        {
          field: 'title',
          weight: 1.0,
          type: 'text',
          searchable: true,
          filterable: false,
          highlightable: true,
        },
        {
          field: 'content',
          weight: 0.8,
          type: 'semantic',
          searchable: true,
          filterable: false,
          highlightable: true,
        },
        {
          field: 'tags',
          weight: 0.6,
          type: 'tag',
          searchable: true,
          filterable: true,
          highlightable: false,
        },
      ],
      ai: {
        semanticSearch: true,
        intentRecognition: true,
        suggestions: true,
        autoTagging: true,
        similaritySearch: true,
        contentAnalysis: true,
        prompts: {
          semantic: 'Analyze documents focusing on content, topics, and themes',
          suggestions: 'Suggest documents based on content similarity and user patterns',
          intent: 'Understand document-related queries and user intentions',
          analysis: 'Extract key topics, themes, and concepts from document content',
          tagging: 'Generate relevant tags based on document content and context',
          similarity: 'Find documents with similar content, topics, or themes',
        },
      },
    },
  },
  workflows: {
    name: 'Workflow Search',
    description: 'Optimized for workflow instances and processes',
    config: {
      searchableFields: [
        {
          field: 'title',
          weight: 1.0,
          type: 'text',
          searchable: true,
          filterable: false,
          highlightable: true,
        },
        {
          field: 'status',
          weight: 0.7,
          type: 'keyword',
          searchable: false,
          filterable: true,
          highlightable: false,
        },
        {
          field: 'progress',
          weight: 0.5,
          type: 'number',
          searchable: false,
          filterable: true,
          highlightable: false,
        },
      ],
      filters: [
        {
          field: 'status',
          type: 'select',
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Completed', value: 'completed' },
          ],
        },
        { field: 'progress', type: 'range', label: 'Progress', min: 0, max: 100 },
      ],
    },
  },
}

export interface UniversalSearchResult {
  id: string
  collection: string
  title: string
  content: string
  url?: string
  score: number
  highlights: SearchHighlight[]
  metadata: SearchMetadata
  actions?: SearchAction[]
}

export interface SearchHighlight {
  field: string
  fragments: string[]
  matchedTerms: string[]
}

export interface SearchMetadata {
  createdAt?: string
  updatedAt?: string
  status?: string
  tags?: string[]
  author?: string
  category?: string
  progress?: number
  [key: string]: any
}

export interface SearchAction {
  id: string
  label: string
  icon?: string
  condition?: string
  handler?: (item: UniversalSearchResult) => void | Promise<void>
}

export interface SearchRequest {
  query: string
  collection?: string
  filters?: SearchFilters
  sort?: SearchSort
  pagination?: SearchPagination
  options?: SearchOptions
}

export interface SearchFilters {
  status?: string[]
  tags?: string[]
  dateRange?: {
    field: string
    from?: string
    to?: string
  }
  progress?: {
    min?: number
    max?: number
  }
  author?: string[]
  category?: string[]
  [key: string]: any
}

export interface SearchSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface SearchPagination {
  page: number
  limit: number
  offset?: number
}

export interface SearchOptions {
  includeHighlights?: boolean
  includeMetadata?: boolean
  fuzzySearch?: boolean
  semanticSearch?: boolean
  maxResults?: number
}

export interface SearchResponse {
  results: UniversalSearchResult[]
  totalCount: number
  facets: SearchFacets
  searchTime: number
  query: string
  suggestions?: string[]
}

export interface SearchFacets {
  collections: FacetItem[]
  statuses: FacetItem[]
  tags: FacetItem[]
  categories: FacetItem[]
  authors: FacetItem[]
}

export interface FacetItem {
  value: string
  count: number
  label?: string
}

export interface SearchCache {
  key: string
  results: SearchResponse
  timestamp: number
  ttl: number
}

export interface SearchAnalytics {
  query: string
  collection?: string
  resultCount: number
  clickedResult?: string
  timestamp: number
  userId?: string
  sessionId?: string
}

export interface SearchHistory {
  id: string
  query: string
  collection?: string
  timestamp: number
  resultCount: number
  userId?: string
}

// Added interfaces for the search filters component
export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface SearchFilter {
  id: string
  label: string
  type: 'checkbox' | 'date' | 'range' | string
  options: FilterOption[]
}

// AI Suggestion interfaces for the SearchInput component
export type AISuggestionType = 'search' | 'filter' | 'content' | 'action' | 'completion'

export interface AISuggestion {
  type: AISuggestionType
  text: string
  confidence: number
  reasoning?: string
  metadata?: {
    basedOn?: string
    [key: string]: any
  }
}

export interface AISuggestionFeedback {
  suggestionId: string
  wasHelpful: boolean
  selectedOption?: string
  userComments?: string
}

export interface AISuggestionRequest {
  query: string
  context?: string
  collection?: string
  limit?: number
  type?: AISuggestionType
}

export interface AISuggestionResponse {
  suggestions: AISuggestion[]
  responseTime: number
}

export interface SuggestionDocument {
  type: AISuggestionType | string
  text: string
  confidence: number
  reasoning: string
  metadata: {
    basedOn: string
    [key: string]: any
  }
  userFeedback?: AISuggestionFeedback
}

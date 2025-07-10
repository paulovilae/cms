export interface SemanticSearchRequest {
  query: string
  collection: string
  context?: SearchContext
  intent?: SearchIntent
  semanticWeight?: number // 0-1, balance between keyword and semantic
  maxResults?: number
}

export interface SemanticSearchResponse {
  results: SemanticResult[]
  semanticMatches: SemanticMatch[]
  suggestions: AISuggestion[]
  intent: RecognizedIntent
  confidence: number
  processingTime: number
}

export interface SemanticResult {
  id: string
  collection: string
  title: string
  content: string
  semanticScore: number
  keywordScore: number
  combinedScore: number
  relevanceReason: string
  conceptMatches: ConceptMatch[]
}

export interface SemanticMatch {
  concept: string
  similarity: number
  context: string
  relatedTerms: string[]
}

export interface ConceptMatch {
  concept: string
  field: string
  confidence: number
  explanation: string
}

export interface SearchContext {
  user?: string
  business?: string
  recentActivity?: string[]
  currentCollection?: string
  previousQueries?: string[]
  userPreferences?: UserPreferences
}

export interface UserPreferences {
  preferredCollections?: string[]
  commonFilters?: Record<string, any>
  searchHistory?: SearchHistory[]
  favoriteItems?: string[]
}

export interface SearchIntent {
  type: 'search' | 'filter' | 'action' | 'question' | 'navigation'
  confidence: number
}

export interface RecognizedIntent {
  type: 'search' | 'filter' | 'action' | 'question' | 'navigation'
  action?: 'find' | 'show' | 'create' | 'edit' | 'delete' | 'export' | 'duplicate'
  target?: string // collection or entity type
  filters?: ParsedFilter[]
  confidence: number
  naturalLanguage: string
  reasoning: string
}

export interface ParsedFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in'
  value: any
  confidence: number
}

export interface AISuggestion {
  type: 'search' | 'filter' | 'action' | 'content' | 'completion'
  text: string
  confidence: number
  reasoning: string
  metadata?: SuggestionMetadata
}

export interface SuggestionMetadata {
  basedOn?: 'history' | 'content' | 'patterns' | 'ai_analysis' | 'user_behavior'
  relatedItems?: string[]
  expectedResults?: number
  category?: string
  priority?: number
}

export interface ContentAnalysis {
  summary: string
  keyTopics: string[]
  suggestedTags: string[]
  category: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  sentiment?: 'positive' | 'neutral' | 'negative'
  entities: NamedEntity[]
  concepts: ExtractedConcept[]
}

export interface NamedEntity {
  text: string
  type: 'person' | 'organization' | 'location' | 'skill' | 'technology' | 'other'
  confidence: number
}

export interface ExtractedConcept {
  concept: string
  relevance: number
  context: string
  relatedTerms: string[]
}

export interface AIPromptConfig {
  semantic: string
  suggestions: string
  intent: string
  analysis: string
  tagging: string
}

export interface AIProcessingResult {
  success: boolean
  data?: any
  error?: string
  processingTime: number
  tokensUsed?: number
  model?: string
}

export interface SearchHistory {
  id: string
  query: string
  collection?: string
  timestamp: number
  resultCount: number
  userId?: string
  clickedResults?: string[]
  satisfaction?: number // 1-5 rating
}

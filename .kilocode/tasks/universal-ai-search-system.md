# Universal AI-Powered Search System - Architecture Design

## Vision Statement

Create a **creative, amazing, powerful, real-time, beautiful, practical, solid, modular, reusable and understandable** universal search system that leverages AI for semantic understanding and can be used across all business units and future applications.

## Core Philosophy: Universal Modularity

### Design Principles
- **Creative**: AI-powered semantic search with natural language queries
- **Amazing**: Real-time results with intelligent suggestions and auto-completion
- **Powerful**: Multi-modal search (text, semantic, visual, contextual)
- **Real-time**: Sub-200ms response times with live filtering
- **Beautiful**: Elegant, intuitive interface with smooth animations
- **Practical**: Solves real user problems with actionable results
- **Solid**: Robust error handling, caching, and performance optimization
- **Modular**: Plug-and-play components for any collection/business
- **Reusable**: Works for job descriptions, trading strategies, contracts, etc.
- **Understandable**: Clear code structure and comprehensive documentation

## Universal Architecture

### 1. Core Search Engine (Shared Plugin)

```
src/plugins/shared/universal-search/
├── index.ts                          # Main plugin export
├── collections/
│   ├── SearchIndex.ts               # Universal search index collection
│   ├── SearchQueries.ts             # Saved searches and analytics
│   └── SearchSuggestions.ts         # AI-generated suggestions
├── components/
│   ├── UniversalSearch.tsx          # Main search interface
│   ├── SearchInput.tsx              # Smart input with AI suggestions
│   ├── SearchResults.tsx            # Universal results renderer
│   ├── SearchFilters.tsx            # Dynamic filter system
│   ├── SemanticSuggestions.tsx      # AI-powered suggestions
│   ├── SearchAnalytics.tsx          # Usage analytics dashboard
│   └── SearchPreview.tsx            # Universal preview modal
├── hooks/
│   ├── useUniversalSearch.ts        # Main search orchestrator
│   ├── useSemanticSearch.ts         # AI-powered semantic search
│   ├── useSearchSuggestions.ts      # Smart suggestions
│   ├── useSearchAnalytics.ts        # Usage tracking
│   └── useSearchCache.ts            # Intelligent caching
├── services/
│   ├── SearchEngine.ts              # Core search logic
│   ├── SemanticAnalyzer.ts          # AI content analysis
│   ├── IntentRecognizer.ts          # Natural language intent
│   ├── SuggestionGenerator.ts       # AI suggestion engine
│   └── SearchIndexer.ts             # Content indexing service
├── utils/
│   ├── searchConfig.ts              # Configuration per collection
│   ├── searchRanking.ts             # Relevance scoring
│   ├── searchHighlighting.ts        # Result highlighting
│   └── searchOptimization.ts        # Performance utilities
└── types/
    ├── search.types.ts              # Core search types
    ├── semantic.types.ts            # AI/semantic types
    └── config.types.ts              # Configuration types
```

### 2. AI-Powered Features (Leveraging Existing AI Infrastructure)

#### Semantic Search Engine
```typescript
interface SemanticSearchRequest {
  query: string
  collection: string
  context?: {
    user?: string
    business?: string
    recentActivity?: string[]
  }
  intent?: 'find' | 'similar' | 'suggest' | 'analyze'
  semanticWeight?: number // 0-1, balance between keyword and semantic
}

interface SemanticSearchResponse {
  results: UniversalSearchResult[]
  semanticMatches: SemanticMatch[]
  suggestions: AISuggestion[]
  intent: RecognizedIntent
  confidence: number
}
```

#### Intent Recognition System
```typescript
interface RecognizedIntent {
  type: 'search' | 'filter' | 'action' | 'question'
  action?: 'find' | 'show' | 'create' | 'edit' | 'delete' | 'export'
  target?: string // collection or entity type
  filters?: ParsedFilter[]
  confidence: number
  naturalLanguage: string
}

// Examples:
// "Show me incomplete marketing jobs" → { type: 'filter', action: 'show', target: 'jobs', filters: [status: incomplete, category: marketing] }
// "Find jobs similar to Senior Developer" → { type: 'search', action: 'find', target: 'jobs', semanticQuery: 'Senior Developer' }
// "What are my recent trading strategies?" → { type: 'question', action: 'show', target: 'strategies', filters: [user: current, recent: true] }
```

#### Smart Suggestion Engine
```typescript
interface AISuggestion {
  type: 'search' | 'filter' | 'action' | 'content'
  text: string
  confidence: number
  reasoning: string
  metadata?: {
    basedOn?: 'history' | 'content' | 'patterns' | 'ai_analysis'
    relatedItems?: string[]
    expectedResults?: number
  }
}

// Examples:
// Based on typing "senior dev" → "senior developer remote", "senior development manager", "senior devops engineer"
// Based on recent activity → "Continue your draft job descriptions", "Jobs similar to your recent work"
// Based on content analysis → "Marketing jobs with similar requirements", "Jobs in the same salary range"
```

### 3. Universal Configuration System

#### Collection-Agnostic Configuration
```typescript
interface UniversalSearchConfig {
  collection: string
  displayName: string
  searchableFields: SearchableField[]
  filters: FilterConfig[]
  actions: ActionConfig[]
  preview: PreviewConfig
  ai: AIConfig
}

interface SearchableField {
  field: string
  weight: number
  type: 'text' | 'keyword' | 'semantic' | 'tag' | 'date' | 'number'
  searchable: boolean
  filterable: boolean
  highlightable: boolean
}

// Example configurations:
const jobDescriptionConfig: UniversalSearchConfig = {
  collection: 'flow-instances',
  displayName: 'Job Descriptions',
  searchableFields: [
    { field: 'title', weight: 1.0, type: 'text', searchable: true, filterable: false, highlightable: true },
    { field: 'finalDocument', weight: 0.8, type: 'semantic', searchable: true, filterable: false, highlightable: true },
    { field: 'metadata.tags', weight: 0.6, type: 'tag', searchable: true, filterable: true, highlightable: false },
    { field: 'status', weight: 0.3, type: 'keyword', searchable: false, filterable: true, highlightable: false }
  ],
  filters: [
    { field: 'status', type: 'select', options: ['draft', 'in-progress', 'completed'] },
    { field: 'progress', type: 'range', min: 0, max: 100 },
    { field: 'updatedAt', type: 'dateRange' }
  ],
  actions: [
    { id: 'continue', label: 'Continue', condition: 'status != completed' },
    { id: 'edit', label: 'Edit', condition: 'status == completed' },
    { id: 'duplicate', label: 'Duplicate', condition: 'always' }
  ],
  ai: {
    semanticSearch: true,
    intentRecognition: true,
    suggestions: true,
    autoTagging: true,
    similaritySearch: true
  }
}
```

### 4. Business-Specific Implementations

#### Salarium Job Descriptions
```typescript
// src/plugins/business/salarium/search/jobDescriptionSearch.ts
export const createJobDescriptionSearch = () => {
  return createUniversalSearch({
    ...jobDescriptionConfig,
    customActions: {
      continue: async (item) => router.push(`/salarium/job-flow?instanceId=${item.id}`),
      edit: async (item) => {/* create revision */},
      export: async (item) => {/* export as PDF/Word */}
    },
    aiPrompts: {
      semantic: "Analyze job descriptions focusing on role requirements, responsibilities, and qualifications",
      suggestions: "Suggest job descriptions based on user's recent work and industry trends",
      intent: "Understand job-related queries like 'find marketing manager roles' or 'show incomplete jobs'"
    }
  })
}
```

#### IntelliTrade Smart Contracts
```typescript
// src/plugins/business/intellitrade/search/contractSearch.ts
export const createContractSearch = () => {
  return createUniversalSearch({
    collection: 'smart-contracts',
    displayName: 'Smart Contracts',
    searchableFields: [
      { field: 'contractName', weight: 1.0, type: 'text' },
      { field: 'description', weight: 0.8, type: 'semantic' },
      { field: 'contractType', weight: 0.6, type: 'keyword' }
    ],
    aiPrompts: {
      semantic: "Analyze smart contracts focusing on terms, conditions, and trade requirements",
      suggestions: "Suggest contracts based on trade patterns and business relationships"
    }
  })
}
```

#### Latinos Trading Strategies
```typescript
// src/plugins/business/latinos/search/strategySearch.ts
export const createStrategySearch = () => {
  return createUniversalSearch({
    collection: 'trading-strategies',
    displayName: 'Trading Strategies',
    searchableFields: [
      { field: 'name', weight: 1.0, type: 'text' },
      { field: 'description', weight: 0.8, type: 'semantic' },
      { field: 'indicators', weight: 0.7, type: 'tag' }
    ],
    aiPrompts: {
      semantic: "Analyze trading strategies focusing on market conditions, indicators, and performance",
      suggestions: "Suggest strategies based on market trends and user's trading history"
    }
  })
}
```

## AI-Powered Features Implementation

### 1. Semantic Search with Existing AI Infrastructure

```typescript
// Leverage existing AI providers from ai-management plugin
class SemanticSearchService {
  constructor(private aiProvider: AIProvider) {}

  async semanticSearch(query: string, collection: string, context?: SearchContext): Promise<SemanticResult[]> {
    const prompt = this.buildSemanticPrompt(query, collection, context)
    
    const aiResponse = await this.aiProvider.generateContent({
      prompt,
      systemPrompt: "You are a semantic search expert. Analyze the query and return relevant search terms and concepts.",
      maxTokens: 500
    })

    return this.parseSemanticResponse(aiResponse)
  }

  private buildSemanticPrompt(query: string, collection: string, context?: SearchContext): string {
    return `
    Analyze this search query for semantic meaning:
    Query: "${query}"
    Collection: ${collection}
    Context: ${JSON.stringify(context)}
    
    Return:
    1. Expanded search terms
    2. Related concepts
    3. Synonyms and variations
    4. Intent classification
    5. Suggested filters
    `
  }
}
```

### 2. Intent Recognition System

```typescript
class IntentRecognitionService {
  async recognizeIntent(query: string): Promise<RecognizedIntent> {
    const prompt = `
    Analyze this natural language query and extract the user's intent:
    Query: "${query}"
    
    Classify the intent and extract:
    - Action type (search, filter, create, edit, etc.)
    - Target entity (jobs, contracts, strategies, etc.)
    - Filters and conditions
    - Confidence level
    
    Examples:
    "Show me incomplete marketing jobs" → action: filter, target: jobs, filters: [status: incomplete, category: marketing]
    "Find jobs similar to Senior Developer" → action: search, target: jobs, semantic: "Senior Developer"
    "Create a new trading strategy" → action: create, target: strategy
    `

    const response = await this.aiProvider.generateContent({ prompt })
    return this.parseIntentResponse(response)
  }
}
```

### 3. Smart Suggestion Engine

```typescript
class SuggestionEngine {
  async generateSuggestions(
    partialQuery: string,
    context: SearchContext,
    userHistory: SearchHistory[]
  ): Promise<AISuggestion[]> {
    const prompt = `
    Generate smart search suggestions based on:
    Partial Query: "${partialQuery}"
    User Context: ${JSON.stringify(context)}
    Recent Searches: ${JSON.stringify(userHistory.slice(0, 5))}
    
    Generate 5-8 relevant suggestions that:
    1. Complete the current query
    2. Suggest related searches
    3. Recommend based on user patterns
    4. Include semantic variations
    `

    const response = await this.aiProvider.generateContent({ prompt })
    return this.parseSuggestions(response)
  }
}
```

### 4. Auto-Tagging and Content Analysis

```typescript
class ContentAnalysisService {
  async analyzeAndTag(content: string, collection: string): Promise<ContentAnalysis> {
    const prompt = `
    Analyze this content and generate relevant tags and metadata:
    Content: "${content}"
    Collection Type: ${collection}
    
    Extract:
    1. Key topics and themes
    2. Relevant tags (5-10)
    3. Content category
    4. Difficulty/complexity level
    5. Related concepts
    6. Searchable keywords
    `

    const response = await this.aiProvider.generateContent({ prompt })
    return this.parseContentAnalysis(response)
  }
}
```

## Enhanced User Experience

### 1. Natural Language Search Interface

```typescript
// Examples of natural language queries the system can handle:
const exampleQueries = [
  // Intent: Filter
  "Show me incomplete marketing jobs",
  "Find all draft job descriptions from last week",
  "Display completed trading strategies with high performance",
  
  // Intent: Semantic Search
  "Find jobs similar to Senior Software Engineer",
  "Show contracts like the recent export agreement",
  "Trading strategies similar to momentum-based approaches",
  
  // Intent: Question/Analysis
  "What are my most successful trading strategies?",
  "Which job descriptions take the longest to complete?",
  "How many contracts are pending approval?",
  
  // Intent: Action
  "Create a new job description for marketing manager",
  "Duplicate the last trading strategy I worked on",
  "Export all completed job descriptions from this month"
]
```

### 2. Intelligent Search Interface

```typescript
interface SmartSearchProps {
  collection: string
  config: UniversalSearchConfig
  onAction: (action: string, item: any) => void
  placeholder?: string
  aiEnabled?: boolean
}

const SmartSearchInterface: React.FC<SmartSearchProps> = ({
  collection,
  config,
  onAction,
  placeholder = "Search or ask anything...",
  aiEnabled = true
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [intent, setIntent] = useState<RecognizedIntent | null>(null)
  
  // Real-time AI suggestions as user types
  const { suggestions: aiSuggestions } = useSearchSuggestions(query, collection)
  
  // Intent recognition for natural language queries
  const { intent: recognizedIntent } = useIntentRecognition(query)
  
  // Semantic search results
  const { results, loading } = useSemanticSearch(query, collection, recognizedIntent)

  return (
    <div className="smart-search-interface">
      {/* AI-powered search input */}
      <SearchInput
        value={query}
        onChange={setQuery}
        suggestions={aiSuggestions}
        intent={recognizedIntent}
        placeholder={placeholder}
      />
      
      {/* Intent indicator */}
      {recognizedIntent && (
        <IntentIndicator intent={recognizedIntent} />
      )}
      
      {/* Smart suggestions */}
      <SuggestionPanel suggestions={aiSuggestions} onSelect={setQuery} />
      
      {/* Results with semantic highlighting */}
      <SearchResults
        results={results}
        loading={loading}
        config={config}
        onAction={onAction}
        highlightSemantic={true}
      />
    </div>
  )
}
```

## What to Remove/Add Based on Feedback

### ✅ Add (High Priority)
1. **AI-Powered Semantic Search** - Leverage existing AI infrastructure
2. **Intent Recognition** - Natural language query understanding
3. **Smart Suggestions** - AI-generated search suggestions
4. **Auto-Tagging** - AI content analysis and categorization
5. **Universal Modularity** - Make 90% of components reusable
6. **Real-time AI Suggestions** - As-you-type intelligent suggestions
7. **Cross-Collection Similarity** - "Find similar items across all collections"
8. **Predictive Search** - "Based on your recent work..."

### ✅ Enhance (Medium Priority)
1. **Visual Search Interface** - Beautiful, modern design with animations
2. **Voice Search** - Natural language voice queries
3. **Search Analytics** - AI-powered insights on search patterns
4. **Collaborative Search** - Share searches and results with team
5. **Mobile-First Design** - Responsive, touch-friendly interface

### ❌ Remove/Simplify (Lower Priority)
1. **Complex Virtual Scrolling** - Start with simple pagination, add later
2. **Advanced Caching** - Use simple caching first, optimize later
3. **Multiple Database Adapters** - Focus on current SQLite setup
4. **Complex Permission System** - Use existing Payload access controls

## Implementation Phases

### Phase 1: Universal Core (Week 1-2)
- Universal search engine architecture
- Basic AI integration with existing providers
- Core components (SearchInput, SearchResults, SearchFilters)
- Configuration system for different collections

### Phase 2: AI Features (Week 2-3)
- Semantic search implementation
- Intent recognition system
- Smart suggestion engine
- Auto-tagging and content analysis

### Phase 3: Business Integration (Week 3-4)
- Salarium job description search
- IntelliTrade contract search
- Latinos strategy search
- Cross-business similarity search

### Phase 4: Advanced Features (Week 4-5)
- Voice search capabilities
- Advanced analytics and insights
- Collaborative features
- Performance optimization

## Success Metrics

### Technical Excellence
- **Response Time**: < 200ms for cached, < 500ms for AI-powered queries
- **Accuracy**: > 90% relevant results for semantic searches
- **Reusability**: 90% of components work across all business units
- **AI Integration**: Seamless use of existing AI infrastructure

### User Experience
- **Adoption Rate**: > 80% of users prefer AI search over manual browsing
- **Query Success**: > 85% of searches lead to desired actions
- **Natural Language**: > 70% of queries use natural language
- **User Satisfaction**: > 9/10 rating for search experience

This universal, AI-powered search system will be a game-changer for the platform, providing an amazing, intelligent, and reusable foundation that can evolve with the business needs while leveraging the existing AI infrastructure.
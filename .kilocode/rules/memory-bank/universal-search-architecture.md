# Universal AI-Powered Search System Architecture

This document captures the architectural patterns, design decisions, and implementation strategies used in the Universal AI-Powered Search System. These patterns can be reused for other multi-tenant, AI-enhanced features.

## Core Architecture

### Multi-Phase Development Approach

The system was developed in four distinct phases, each building on the previous:

1. **Core Infrastructure**: Base collections, endpoints, and search engine
2. **React Components and Hooks**: Frontend components and state management
3. **AI Integration**: Connecting with AI providers for semantic understanding
4. **Business-Specific Implementations**: Tailored configurations for each business unit

This phased approach allowed for:
- Clear development milestones
- Testable functionality at each stage
- Progressive enhancement from basic to advanced features
- Clear separation of concerns

### Multi-Tenant Plugin Structure

```
src/plugins/shared/universal-search/
├── README.md                     # Comprehensive documentation
├── index.ts                      # Plugin registration
├── collections/                  # Data models
│   ├── SearchIndex.ts            # Universal search index
│   ├── SearchQueries.ts          # Query history and analytics
│   └── SearchSuggestions.ts      # AI-generated suggestions
├── components/                   # React components
│   ├── SearchInput.tsx           # Smart input with suggestions
│   ├── SearchResults.tsx         # Results display with actions
│   ├── SearchFilters.tsx         # Dynamic filters
│   ├── SearchStats.tsx           # Performance metrics
│   ├── QuickPreview.tsx          # Result preview
│   └── UniversalSearch.tsx       # Main component
├── endpoints/                    # API endpoints
│   ├── search.ts                 # Main search endpoint
│   ├── suggestions.ts            # Suggestion endpoint
│   └── semantic.ts               # Semantic search endpoint
├── hooks/                        # React hooks
│   └── useUniversalSearch.ts     # Main search hook
├── services/                     # Core functionality
│   ├── SearchEngine.ts           # Search logic
│   ├── SemanticAnalyzer.ts       # AI content analysis
│   └── SuggestionGenerator.ts    # AI suggestion engine
├── types/                        # TypeScript definitions
│   ├── search.types.ts           # Core search types
│   ├── semantic.types.ts         # AI/semantic types
│   └── config.types.ts           # Configuration types
├── configs/                      # Business configurations
│   ├── registry.ts               # Configuration registry
│   ├── salarium.config.ts        # Salarium-specific config
│   ├── intellitrade.config.ts    # IntelliTrade-specific config
│   └── latinos.config.ts         # Latinos-specific config
└── tests/                        # Testing infrastructure
    ├── business-config.test.ts   # Configuration tests
    └── search-api.test.ts        # API integration tests
```

## Key Design Patterns

### 1. Business Configuration Registry

The system uses a configuration registry pattern to dynamically select business-specific search configurations:

```typescript
// Configuration registry with automatic fallback
export const searchConfigRegistry: Record<string, SearchConfig> = {
  salarium: salariumSearchConfig,
  intellitrade: intellitradeSearchConfig,
  latinos: latinosSearchConfig,
  default: defaultSearchConfig,
}

// Usage with business context detection
export const getSearchConfigForBusiness = (business?: string): SearchConfig => {
  // Get business from context, default to 'default'
  const businessKey = business || 'default'
  
  // Return matching config or fall back to default
  return searchConfigRegistry[businessKey] || searchConfigRegistry.default
}
```

This pattern allows:
- Runtime selection of configurations based on business context
- Automatic fallback to default configuration
- Easy addition of new business configurations
- Type-safe configuration through TypeScript interfaces

### 2. AI Provider Integration

The AI integration follows a provider pattern that supports multiple AI services:

```typescript
private async connectToAIProvider(prompt: string, purpose: string): Promise<AIProcessingResult> {
  // Get provider configuration from database
  const aiProviders = await this.payload.find({
    collection: 'ai-providers',
    limit: 1,
  })

  // Provider-specific request construction
  if (provider.provider === 'ollama') {
    // Ollama-specific implementation
  } else if (provider.provider === 'openai') {
    // OpenAI-specific implementation
  } else if (provider.provider === 'anthropic') {
    // Anthropic-specific implementation
  }

  // Common request handling and response parsing
  // Error handling and fallbacks
}
```

This pattern provides:
- Support for multiple AI providers (Ollama, OpenAI, Anthropic, etc.)
- Provider-specific request formatting
- Unified response handling
- Robust error handling and timeouts
- Fallback mechanisms when AI is unavailable

### 3. Payload 3.x Web API Pattern

Payload CMS 3.x uses Web API patterns for endpoints rather than Express:

```typescript
// Old Express-style endpoint (not compatible with Payload 3.x)
export const searchEndpoint = {
  path: '/search',
  method: 'post',
  handler: async (req, res) => {
    // Do something
    res.status(200).json({ success: true })
  }
}

// New Web API style endpoint (Payload 3.x compatible)
export const searchEndpoint = {
  path: '/search',
  method: 'post',
  handler: async (req) => {
    // Body must be parsed with await req.json()
    const data = await req.json()
    
    // Return Response object, not res.json()
    return Response.json({ success: true }, { status: 200 })
  }
}
```

Key differences:
- Request body must be parsed with `await req.json()`
- Responses use `Response.json()` not `res.json()`
- Status codes are passed as options to `Response.json()`
- No explicit `res` parameter in handler function

### 4. Business-Specific Configuration Pattern

Each business has its own configuration with domain-specific settings:

```typescript
export const salariumSearchConfig: SearchConfig = {
  collection: 'flow-instances',
  displayName: 'Job Descriptions',
  searchableFields: [
    { field: 'title', weight: 1.0, type: 'text' },
    { field: 'content', weight: 0.8, type: 'semantic' },
    // Business-specific fields
  ],
  filters: [
    // Business-specific filters
  ],
  actions: [
    // Business-specific actions
  ],
  preview: {
    // Business-specific preview
  },
  ai: {
    // Business-specific AI configuration
    prompts: {
      semantic: 'Analyze job descriptions focusing on skills...',
      // Domain-specific prompts
    }
  }
}
```

This pattern allows:
- Domain-specific terminology in AI prompts
- Business-relevant search fields and weights
- Tailored filters and actions
- Specialized preview configurations
- Domain-specific formatting and visualization

## Implementation Strategies

### 1. Progressive Enhancement Strategy

The system follows a progressive enhancement strategy:

1. **Base Functionality**: Core search that works without AI
2. **AI Enhancement**: Semantic understanding when AI is available
3. **Business Enhancement**: Domain-specific features on top of shared infrastructure

This ensures the system remains operational even when:
- AI providers are unavailable
- Business context is missing
- Certain components fail

### 2. Type-Safe Development

TypeScript interfaces define all system components:

```typescript
// Core search configuration interface
export interface SearchConfig {
  collection: string
  displayName: string
  searchableFields: SearchField[]
  filters?: SearchFilter[]
  actions?: SearchAction[]
  preview?: PreviewConfig
  ai?: AISearchConfig
}

// Field definition with search properties
export interface SearchField {
  field: string
  weight: number
  type: 'text' | 'keyword' | 'semantic' | 'date' | 'number'
  searchable?: boolean
  filterable?: boolean
  highlightable?: boolean
  formatter?: (value: any) => React.ReactNode
}

// Additional interfaces for other components...
```

This provides:
- Clear contracts between components
- Early error detection
- Self-documenting code
- Improved maintainability

### 3. Error Handling Strategy

The system uses a comprehensive error handling strategy:

```typescript
try {
  // Primary approach: AI-enhanced search
  const aiResults = await this.generateAIResults(query)
  if (aiResults.length > 0) {
    return aiResults
  }
} catch (aiError) {
  console.warn('AI search failed, falling back to keyword search', aiError)
  // Log for monitoring but don't show to user
}

// Fallback approach: Keyword search
try {
  return await this.generateKeywordResults(query)
} catch (fallbackError) {
  console.error('All search methods failed', fallbackError)
  throw new Error('Search unavailable at this time')
}
```

This ensures:
- Graceful degradation when AI fails
- Multiple fallback options
- Transparent error reporting
- Consistent user experience

## Testing Strategies

### 1. Multi-Layer Testing

The system uses a multi-layer testing approach:

1. **Unit Tests**: Individual components and functions
2. **Integration Tests**: Component interactions and API endpoints
3. **Business-Specific Tests**: Domain configuration validation
4. **End-to-End Tests**: Complete search workflow testing

### 2. AI Service Mocking

For testing AI-dependent features:

```typescript
// Mock AI service for testing
const mockAIService = {
  analyzeQuery: jest.fn().mockResolvedValue({
    intent: { type: 'search', confidence: 0.9 },
    suggestions: [{ type: 'search', text: 'mock suggestion' }],
  }),
}

// Test with mocked AI
test('generates suggestions with AI service', async () => {
  const generator = new SuggestionGenerator({ 
    aiService: mockAIService 
  })
  
  const suggestions = await generator.generateSuggestions('test query')
  
  expect(mockAIService.analyzeQuery).toHaveBeenCalled()
  expect(suggestions.length).toBeGreaterThan(0)
})
```

This allows:
- Testing AI-dependent code without real AI services
- Predictable test outcomes
- Testing edge cases and error conditions
- Fast test execution

## Lessons Learned

### API Design Best Practices

1. **Use Web API Patterns**: For Payload 3.x compatibility, use Web API patterns rather than Express-style endpoints
2. **Proper Request Parsing**: Always use `await req.json()` for body parsing in Payload 3.x
3. **Consistent Response Format**: Use `Response.json(data, { status: code })` for all endpoints
4. **Business Context Extraction**: Extract business context from headers or query parameters consistently

### AI Integration Best Practices

1. **Provider Abstraction**: Abstract AI provider details to support multiple services
2. **Prompt Engineering**: Design prompts with specific output formats and clear instructions
3. **Robust Parsing**: Handle various response formats with careful parsing and validation
4. **Timeouts and Limits**: Implement timeouts and token limits to prevent hanging requests
5. **Graceful Fallbacks**: Always have non-AI fallbacks for when AI services fail

### Multi-Tenant Architecture Best Practices

1. **Business Context Detection**: Extract business context early in the request pipeline
2. **Configuration Registry**: Use a registry pattern for business-specific configurations
3. **Shared Infrastructure**: Maximize code reuse with shared services and components
4. **Domain-Specific Customization**: Allow specific points of customization for each business
5. **Consistent Access Control**: Apply business-specific permissions and access controls

## Performance Optimization

### Response Time Strategies

The system achieves sub-25ms response times through:

1. **Efficient Database Queries**: Optimized WHERE clauses and selective field projection
2. **Intelligent Caching**: Caching frequently accessed configurations and results
3. **Asynchronous Processing**: Non-blocking operations for parallel execution
4. **Resource Pooling**: Connection pooling for database and AI services
5. **Minimal Data Transfer**: Sending only necessary data in responses

### AI Token Optimization

To minimize AI costs and latency:

1. **Prompt Engineering**: Craft efficient prompts that require fewer tokens
2. **Response Format Control**: Request specific JSON structures to minimize parsing
3. **Selective AI Usage**: Only use AI for queries that benefit from semantic understanding
4. **Token Limits**: Set appropriate max_tokens limits for different query types
5. **Response Caching**: Cache similar AI responses to reduce redundant requests

## Future Enhancements

Potential areas for extending the Universal Search system:

1. **Vector Search Integration**: Add embedding-based similarity search for even better semantic matching
2. **User Feedback Loop**: Incorporate user interaction data to improve search relevance
3. **Personalized Results**: Adapt search results based on user preferences and history
4. **Voice Search Integration**: Add speech-to-text capabilities for voice search
5. **Analytics Dashboard**: Build a comprehensive search analytics dashboard for insights
6. **Additional Business Units**: Add support for more business units as they are developed
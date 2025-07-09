# Plugin Ecosystem Architecture

## Plugin Categories

The platform supports three types of plugins to maximize flexibility and reusability:

### 1. Core Plugins (Always Active)
Essential functionality that every instance needs:
```typescript
const corePlugins = [
  redirectsPlugin(),
  seoPlugin(),
  formBuilderPlugin(),
  searchPlugin(),
  // Basic Payload functionality
]
```

### 2. Shared Feature Plugins (Configurable)
Cross-business functionality that can be enabled/disabled per instance:
```typescript
const sharedPlugins = {
  aiManagement: aiManagementPlugin(),
  trainingEngine: trainingEnginePlugin(), // NEW: Universal training system
  gamification: gamificationPlugin(),
  digitalPayments: digitalPaymentsPlugin(), // Stripe wrapper
  analytics: analyticsPlugin(),
  notifications: notificationsPlugin(),
  affineIntegration: affineIntegrationPlugin(), // Collaborative editing
}
```

### 3. Business-Specific Plugins
Unique functionality for each business:
```typescript
const businessPlugins = {
  intellitrade: [intellitradePlugin()],
  salarium: [salariumPlugin()],
  latinos: [latinosPlugin()],
  capacita: [capacitaPlugin()], // NEW: Customer service training
}
```

## Enhanced Plugin Loading Strategy

```typescript
// payload.config.ts - Environment-aware plugin system
const getActivePlugins = () => {
  const businessMode = process.env.BUSINESS_MODE || 'all'
  const enabledFeatures = (process.env.ENABLED_FEATURES || '').split(',')
  
  return [
    // Core plugins (always active)
    ...corePlugins,
    
    // Shared feature plugins (configurable)
    ...enabledFeatures
      .filter(feature => sharedPlugins[feature])
      .map(feature => sharedPlugins[feature]),
    
    // Business plugins
    ...businessPlugins[businessMode] || Object.values(businessPlugins).flat()
  ]
}

export default buildConfig({
  plugins: getActivePlugins(),
  // ... rest of config
})
```

## Plugin Directory Structure

```
src/plugins/
├── core/                    # Always active
│   ├── redirects/
│   ├── seo/
│   └── search/
├── shared/                  # Cross-business features
│   ├── ai-management/       # AI provider management
│   ├── training-engine/     # NEW: Universal training and evaluation system
│   ├── gamification/        # Points, badges, leaderboards
│   ├── digital-payments/    # Stripe integration wrapper
│   ├── analytics/           # Cross-business analytics
│   ├── notifications/       # Email/SMS/push notifications
│   ├── affine-integration/  # Collaborative editing and workspace
│   └── user-management/     # Enhanced user features
├── business/                # Business-specific
│   ├── intellitrade/        # Trade finance
│   ├── salarium/            # HR workflows
│   ├── latinos/             # Trading bots
│   └── capacita/            # NEW: Customer service training
└── third-party/             # External integrations
    ├── stripe-enhanced/     # Custom Stripe wrapper
    ├── blockchain/          # Web3 integrations
    └── social-auth/         # OAuth providers
```

## New Shared Plugin: Training Engine

### Training Engine Plugin (Universal System)
```typescript
// src/plugins/shared/training-engine/index.ts
export const trainingEnginePlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...incomingConfig.collections,
      {
        slug: 'avatar-personas',
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'backstory', type: 'textarea', required: true },
          { name: 'personalityTraits', type: 'json' }, // Complex psychological profile
          { name: 'behaviorPatterns', type: 'json' }, // Triggers, responses, manipulation
          { name: 'difficultyLevel', type: 'select', options: [1,2,3,4,5] },
          { name: 'unlockRequirements', type: 'json' },
        ]
      },
      {
        slug: 'training-scenarios',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'genre', type: 'select', options: ['corporate', 'fantasy', 'sci-fi', 'historical'] },
          { name: 'difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced', 'expert'] },
          { name: 'context', type: 'richText', required: true },
          { name: 'avatarPersona', type: 'relationship', relationTo: 'avatar-personas' },
          { name: 'evaluationCriteria', type: 'json' },
          { name: 'aiPrompts', type: 'json' },
        ]
      },
      {
        slug: 'interaction-sessions',
        fields: [
          { name: 'user', type: 'relationship', relationTo: 'users', required: true },
          { name: 'scenario', type: 'relationship', relationTo: 'training-scenarios', required: true },
          { name: 'sessionType', type: 'select', options: ['avatar', 'real-person', 'phone-call'] },
          { name: 'recordingUrl', type: 'text' },
          { name: 'duration', type: 'number' },
          { name: 'rawTranscript', type: 'textarea' },
          { name: 'status', type: 'select', options: ['in-progress', 'completed', 'failed'] },
        ]
      },
      {
        slug: 'evaluation-results',
        fields: [
          { name: 'session', type: 'relationship', relationTo: 'interaction-sessions', required: true },
          { name: 'overallScore', type: 'number', min: 0, max: 100 },
          { name: 'evaluationStages', type: 'array', fields: [
            { name: 'stage', type: 'select', options: ['text', 'voice', 'visual'] },
            { name: 'score', type: 'number', min: 0, max: 100 },
            { name: 'kpis', type: 'json' },
            { name: 'highlights', type: 'array', of: 'text' },
            { name: 'conclusions', type: 'textarea' },
            { name: 'recommendations', type: 'array', of: 'text' },
          ]},
          { name: 'aiProvider', type: 'relationship', relationTo: 'ai-providers' }
        ]
      },
      {
        slug: 'storylines',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'genre', type: 'select', options: ['corporate', 'fantasy', 'sci-fi', 'historical'] },
          { name: 'setting', type: 'textarea' },
          { name: 'overallContext', type: 'richText' },
          { name: 'chapters', type: 'array', fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'scenarios', type: 'relationship', relationTo: 'training-scenarios', hasMany: true },
            { name: 'unlockRequirements', type: 'json' },
            { name: 'rewards', type: 'json' }
          ]},
        ]
      },
      {
        slug: 'character-progression',
        fields: [
          { name: 'user', type: 'relationship', relationTo: 'users', required: true },
          { name: 'characterName', type: 'text' },
          { name: 'characterClass', type: 'select', options: ['diplomat', 'negotiator', 'problem-solver', 'mediator'] },
          { name: 'level', type: 'number', defaultValue: 1 },
          { name: 'experience', type: 'number', defaultValue: 0 },
          { name: 'skillPoints', type: 'json' },
          { name: 'unlockedPersonas', type: 'relationship', relationTo: 'avatar-personas', hasMany: true },
          { name: 'completedStorylines', type: 'relationship', relationTo: 'storylines', hasMany: true },
          { name: 'achievements', type: 'array', of: 'text' },
          { name: 'inventory', type: 'json' }, // RPG-style items/tools
          { name: 'reputation', type: 'json' } // Standing with different factions
        ]
      }
    ],
    endpoints: [
      ...incomingConfig.endpoints,
      {
        path: '/api/training/evaluate/session',
        method: 'post',
        handler: async (req, res) => {
          // Multi-stage evaluation endpoint
        }
      },
      {
        path: '/api/training/avatar/interact',
        method: 'post',
        handler: async (req, res) => {
          // Avatar interaction endpoint
        }
      },
      {
        path: '/api/training/progress/update',
        method: 'post',
        handler: async (req, res) => {
          // Character progression endpoint
        }
      }
    ]
  }
}
```

## New Business Plugin: Capacita

### Capacita Plugin (Customer Service Specialization)
```typescript
// src/plugins/business/capacita/index.ts
export const capacitaPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...incomingConfig.collections,
      {
        slug: 'customer-service-scenarios',
        fields: [
          // Extends training-scenarios with CS-specific fields
          { name: 'customerType', type: 'select', options: ['new', 'returning', 'premium', 'problematic'] },
          { name: 'complaintCategory', type: 'select', options: ['billing', 'technical', 'service', 'product'] },
          { name: 'escalationLevel', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
          { name: 'industryContext', type: 'select', options: ['retail', 'finance', 'healthcare', 'telecom'] },
          { name: 'expectedResolution', type: 'textarea' },
          { name: 'csSpecificKPIs', type: 'json' }, // Customer satisfaction, resolution time, etc.
        ]
      },
      {
        slug: 'customer-personas',
        fields: [
          { name: 'customerType', type: 'text', required: true },
          { name: 'demographicProfile', type: 'json' },
          { name: 'communicationStyle', type: 'json' },
          { name: 'commonComplaints', type: 'array', of: 'text' },
          { name: 'preferredResolution', type: 'text' },
          { name: 'loyaltyLevel', type: 'select', options: ['new', 'occasional', 'regular', 'loyal', 'advocate'] },
        ]
      }
    ],
    blocks: [
      ...incomingConfig.blocks,
      // Customer service specific blocks
      {
        slug: 'avatar-arena',
        fields: [
          { name: 'title', type: 'text', defaultValue: 'Avatar Arena' },
          { name: 'description', type: 'textarea' },
          { name: 'availablePersonas', type: 'relationship', relationTo: 'avatar-personas', hasMany: true },
          { name: 'storylineMode', type: 'select', options: ['corporate', 'fantasy', 'sci-fi'] },
        ]
      },
      {
        slug: 'training-dashboard',
        fields: [
          { name: 'title', type: 'text', defaultValue: 'Training Dashboard' },
          { name: 'showProgressChart', type: 'checkbox', defaultValue: true },
          { name: 'showLeaderboard', type: 'checkbox', defaultValue: true },
          { name: 'showAchievements', type: 'checkbox', defaultValue: true },
        ]
      }
    ]
  }
}
```

## Docker Configuration with Enhanced Feature Flags

```yaml
# docker-compose.yml - Enhanced with training engine
services:
  intellitrade:
    environment:
      - BUSINESS_MODE=intellitrade
      - ENABLED_FEATURES=aiManagement,gamification,digitalPayments
      - DATABASE_PATH=/app/databases/intellitrade.db
    
  salarium:
    environment:
      - BUSINESS_MODE=salarium  
      - ENABLED_FEATURES=aiManagement,gamification,affineIntegration
      - DATABASE_PATH=/app/databases/salarium.db
    
  latinos:
    environment:
      - BUSINESS_MODE=latinos
      - ENABLED_FEATURES=aiManagement,digitalPayments
      - DATABASE_PATH=/app/databases/latinos.db
      
  capacita:
    environment:
      - BUSINESS_MODE=capacita
      - ENABLED_FEATURES=aiManagement,trainingEngine,gamification
      - DATABASE_PATH=/app/databases/capacita.db
```

## Shared Plugin Examples

### AI Management Plugin
```typescript
// src/plugins/shared/ai-management/index.ts
export const aiManagementPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...incomingConfig.collections,
      {
        slug: 'aiProviders',
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'apiKey', type: 'text', required: true },
          { name: 'model', type: 'text', required: true },
          { name: 'maxTokens', type: 'number' },
          { name: 'temperature', type: 'number' },
          { name: 'supportsImages', type: 'checkbox' },
          { name: 'supportsFunctionCalling', type: 'checkbox' },
          { name: 'supportsVision', type: 'checkbox' },
        ],
        access: {
          read: ({ req }) => hasFeatureAccess(req.user, 'ai-management'),
        }
      }
    ]
  }
}
```

### Enhanced Gamification Plugin
```typescript
// src/plugins/shared/gamification/index.ts
export const gamificationPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...incomingConfig.collections,
      {
        slug: 'achievements',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'textarea' },
          { name: 'points', type: 'number', required: true },
          { name: 'badge', type: 'upload', relationTo: 'media' },
          { name: 'criteria', type: 'json' },
          { name: 'category', type: 'select', options: ['training', 'social', 'performance', 'milestone'] },
          { name: 'rarity', type: 'select', options: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
        ]
      },
      {
        slug: 'user-progress',
        fields: [
          { name: 'user', type: 'relationship', relationTo: 'users' },
          { name: 'totalPoints', type: 'number', defaultValue: 0 },
          { name: 'level', type: 'number', defaultValue: 1 },
          { name: 'achievements', type: 'relationship', relationTo: 'achievements', hasMany: true },
          { name: 'streaks', type: 'json' }, // Daily login, training completion, etc.
          { name: 'leaderboardRank', type: 'number' },
          { name: 'skillRatings', type: 'json' }, // Different skill categories
        ]
      },
      {
        slug: 'leaderboards',
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'category', type: 'select', options: ['overall', 'weekly', 'monthly', 'skill-specific'] },
          { name: 'participants', type: 'relationship', relationTo: 'users', hasMany: true },
          { name: 'rankings', type: 'json' }, // Calculated rankings
          { name: 'isActive', type: 'checkbox', defaultValue: true },
        ]
      }
    ]
  }
}
```

## Plugin Dependency Management

```typescript
// Enhanced plugin loader with dependency resolution
const pluginDependencies = {
  capacita: ['trainingEngine', 'aiManagement', 'gamification'],
  trainingEngine: ['aiManagement'],
  gamification: [], // No dependencies
  aiManagement: [], // No dependencies
}

const resolvePluginDependencies = (requestedPlugins: string[]) => {
  const resolved = []
  const visiting = new Set()
  const visited = new Set()
  
  const visit = (plugin) => {
    if (visiting.has(plugin)) throw new Error(`Circular dependency: ${plugin}`)
    if (visited.has(plugin)) return
    
    visiting.add(plugin)
    
    const deps = pluginDependencies[plugin] || []
    deps.forEach(visit)
    
    visiting.delete(plugin)
    visited.add(plugin)
    resolved.push(plugin)
  }
  
  requestedPlugins.forEach(visit)
  return resolved
}
```

## Benefits of Enhanced Architecture

### ✅ Modularity
- Training engine is reusable across any industry (healthcare, sales, education)
- Clear separation between universal training logic and business-specific implementations
- Avatar Arena system can be adapted for any training scenario

### ✅ Flexibility  
- Businesses can enable training features independently
- RPG-style gamification works across all business contexts
- Multi-modal evaluation adapts to different industry requirements

### ✅ Scalability
- Universal training engine supports unlimited business specializations
- Complex persona system scales to any character type or difficulty
- Multi-stage evaluation framework handles any assessment criteria

### ✅ Innovation
- Avatar Arena with treacherous characters creates unique training experiences
- RPG storylines make training engaging across corporate and fantasy contexts
- Real-time multi-modal evaluation provides unprecedented feedback quality

### ✅ Cross-Industry Potential
- **Healthcare**: Train medical staff with difficult patient personas
- **Sales**: Practice with challenging prospect personalities
- **Education**: Create engaging learning scenarios with historical or fictional characters
- **Legal**: Practice with hostile witnesses or difficult clients
- **Hospitality**: Handle demanding guests and complex service scenarios

This enhanced plugin ecosystem creates a powerful foundation for the Avatar Arena training system while maintaining the flexibility to expand into any industry or training context.
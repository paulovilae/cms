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
  gamification: gamificationPlugin(),
  digitalPayments: digitalPaymentsPlugin(), // Stripe wrapper
  analytics: analyticsPlugin(),
  notifications: notificationsPlugin(),
}
```

### 3. Business-Specific Plugins
Unique functionality for each business:
```typescript
const businessPlugins = {
  intellitrade: [intellitradePlugin()],
  salarium: [salariumPlugin()],
  latinos: [latinosPlugin()],
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
│   ├── gamification/        # Points, badges, leaderboards
│   ├── digital-payments/    # Stripe integration wrapper
│   ├── analytics/           # Cross-business analytics
│   ├── notifications/       # Email/SMS/push notifications
│   └── user-management/     # Enhanced user features
├── business/                # Business-specific
│   ├── intellitrade/        # Trade finance
│   ├── salarium/            # HR workflows
│   └── latinos/             # Trading bots
└── third-party/             # External integrations
    ├── stripe-enhanced/     # Custom Stripe wrapper
    ├── blockchain/          # Web3 integrations
    └── social-auth/         # OAuth providers
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
        ],
        access: {
          read: ({ req }) => hasFeatureAccess(req.user, 'ai-management'),
        }
      }
    ]
  }
}
```

### Gamification Plugin
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
        ]
      },
      {
        slug: 'userProgress',
        fields: [
          { name: 'user', type: 'relationship', relationTo: 'users' },
          { name: 'totalPoints', type: 'number', defaultValue: 0 },
          { name: 'level', type: 'number', defaultValue: 1 },
          { name: 'achievements', type: 'relationship', relationTo: 'achievements', hasMany: true },
        ]
      }
    ]
  }
}
```

## Docker Configuration with Feature Flags

```yaml
# docker-compose.yml - Enhanced with feature plugins
services:
  intellitrade:
    environment:
      - BUSINESS_MODE=intellitrade
      - ENABLED_FEATURES=aiManagement,gamification,digitalPayments
      - DATABASE_PATH=/app/databases/intellitrade.db
    
  salarium:
    environment:
      - BUSINESS_MODE=salarium  
      - ENABLED_FEATURES=aiManagement,gamification
      - DATABASE_PATH=/app/databases/salarium.db
    
  latinos:
    environment:
      - BUSINESS_MODE=latinos
      - ENABLED_FEATURES=aiManagement,digitalPayments
      - DATABASE_PATH=/app/databases/latinos.db
```

## Stripe Integration Strategy

### Option 1: Enhanced Wrapper
```typescript
// src/plugins/shared/digital-payments/index.ts
import { stripePlugin } from '@payloadcms/plugin-stripe'

export const digitalPaymentsPlugin = (): Plugin => (config) => {
  return stripePlugin({
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    webhooks: {
      // Custom webhook handlers for each business
      'payment_intent.succeeded': async (event) => {
        // Business-specific payment handling
      }
    },
    sync: [
      // Business-specific sync configurations
      {
        collection: 'subscriptions',
        stripeResourceType: 'subscriptions',
      }
    ]
  })(config)
}
```

### Option 2: Custom Payment Plugin
```typescript
// For more control over payment flows
export const customPaymentsPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...incomingConfig.collections,
      {
        slug: 'payments',
        fields: [
          { name: 'amount', type: 'number', required: true },
          { name: 'currency', type: 'text', defaultValue: 'usd' },
          { name: 'status', type: 'select', options: ['pending', 'completed', 'failed'] },
          { name: 'stripePaymentId', type: 'text' },
          { name: 'business', type: 'text' }, // Track which business
        ]
      }
    ],
    endpoints: [
      {
        path: '/api/payments/create',
        method: 'post',
        handler: async (req, res) => {
          // Custom payment creation logic
        }
      }
    ]
  }
}
```

## Plugin Dependency Management

```typescript
// Plugin with dependencies
export const gamificationPlugin = (): Plugin => {
  return {
    dependencies: ['aiManagement'], // Requires AI for smart rewards
    plugin: (incomingConfig) => {
      // Plugin implementation
    }
  }
}

// Enhanced plugin loader with dependency resolution
const resolvePluginDependencies = (requestedPlugins: string[]) => {
  // Topological sort to ensure dependencies load first
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

## Benefits of This Architecture

### ✅ Modularity
- Each feature is self-contained and reusable
- Clear separation between core, shared, and business logic
- Easy to add new features without affecting existing code

### ✅ Flexibility  
- Businesses can enable only the features they need
- Feature flags allow runtime configuration
- Easy to test features in isolation

### ✅ Scalability
- Plugin ecosystem can grow organically
- Third-party integrations are standardized
- New businesses can leverage existing shared plugins

### ✅ Maintainability
- Clear plugin boundaries reduce coupling
- Shared plugins benefit all businesses
- Dependency management prevents conflicts

### ✅ Future-Proof
- Ready for new features like advanced analytics, ML/AI, blockchain
- Plugin marketplace potential
- Easy integration with external services

This architecture creates a powerful, extensible platform that grows with your business needs while maintaining clean separation of concerns.
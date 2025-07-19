# Development Learnings & Troubleshooting Guide

## 🎯 Purpose

This file contains critical development learnings, error solutions, and best practices that agents MUST read before working on any plugin development. It serves as a living knowledge base to prevent recurring issues and accelerate development.

## 📋 Agent Requirements

**MANDATORY READING**: Every agent must read BOTH files before plugin work:
1. **README.md** - For plugin-specific documentation requirements
2. **development-learnings.md** (this file) - For technical implementation guidance

## 🚨 Critical TypeScript Error Solutions

### 1. **Duplicate Type Export Errors**
**Problem**: `Error: Duplicate identifier 'SomeType'`
```typescript
// ❌ WRONG - Causes duplicate export errors
export interface MyType { ... }
export { MyType } from './types'
```

**Solution**: Define types once, export properly
```typescript
// ✅ CORRECT - Define in types.ts
export interface MyType { ... }

// ✅ CORRECT - Import in index.ts
import type { MyType } from './types'
export type { MyType }
```

### 2. **Payload Handler Type Issues**
**Problem**: Complex Payload handler types causing compilation errors
```typescript
// ❌ WRONG - Custom endpoints with complex types
export const customEndpoint: Endpoint = {
  path: '/custom',
  method: 'post',
  handler: async (req: PayloadRequest) => { ... }
}
```

**Solution**: Use Payload's standard REST endpoints
```typescript
// ✅ CORRECT - Use standard collection endpoints
// POST /api/collection-name
// GET /api/collection-name
// PATCH /api/collection-name/:id
// DELETE /api/collection-name/:id
```

### 3. **Collection Slug Type Mismatches**
**Problem**: Collection slug doesn't match type definitions
```typescript
// ❌ WRONG - Mismatched slugs
const collection = {
  slug: 'kyc-apps',  // Slug here
  // ...
}

// Later in code:
payload.create({
  collection: 'kyc-applications',  // Different slug here
  data: { ... }
})
```

**Solution**: Use consistent slugs throughout
```typescript
// ✅ CORRECT - Consistent slug usage
export const KYC_APPLICATIONS_SLUG = 'kyc-applications' as const

const collection = {
  slug: KYC_APPLICATIONS_SLUG,
  // ...
}

payload.create({
  collection: KYC_APPLICATIONS_SLUG,
  data: { ... }
})
```

### 4. **Import Path Resolution Errors**
**Problem**: Incorrect relative import paths
```typescript
// ❌ WRONG - Incorrect paths
import { MyType } from '../types'  // When file is in same directory
import { Collection } from './collections/MyCollection'  // When no index file
```

**Solution**: Use precise import paths
```typescript
// ✅ CORRECT - Precise paths
import { MyType } from './types'
import { MyCollection } from './collections/MyCollection'

// ✅ CORRECT - Use index files for cleaner imports
// collections/index.ts
export { MyCollection } from './MyCollection'

// Then import:
import { MyCollection } from './collections'
```

## 🏗️ Plugin Architecture Best Practices

### 1. **Plugin Structure Standards**
```
plugin-name/
├── README.md              # REQUIRED: Comprehensive documentation
├── package.json           # Plugin metadata and dependencies
├── src/
│   ├── index.ts          # Main plugin export with options interface
│   ├── types.ts          # Shared type definitions (export once)
│   ├── collections/      # Collection definitions (one per file)
│   │   ├── index.ts      # Re-export all collections
│   │   └── MyCollection.ts
│   ├── globals/          # Global configurations
│   └── seed/             # Demo data and seeding logic
└── scripts/
    └── setup.js          # Post-install automation (optional)
```

### 2. **Collection Design Patterns**
```typescript
// ✅ CORRECT - Complete collection structure
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      validate: (val) => val?.length > 0 || 'Title is required',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    // Audit fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],
  timestamps: true,  // Adds createdAt and updatedAt
}
```

### 3. **Plugin Configuration Best Practices**
```typescript
// ✅ CORRECT - Comprehensive plugin options
export interface PluginOptions {
  enabled?: boolean                    // Always include enable/disable
  seedData?: boolean                   // Control demo data
  collections?: {
    [collectionName: string]: boolean  // Toggle individual collections
  }
  features?: {
    [featureName: string]: boolean     // Feature toggles
  }
  limits?: {
    maxItems?: number                  // Configurable limits
    maxFileSize?: number
  }
  customization?: {
    labels?: Record<string, string>    // Customizable labels
    colors?: Record<string, string>    // Theme customization
  }
}

// Provide sensible defaults
const defaultOptions: Required<PluginOptions> = {
  enabled: true,
  seedData: process.env.NODE_ENV === 'development',
  collections: {},
  features: {},
  limits: {
    maxItems: 1000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  customization: {
    labels: {},
    colors: {},
  },
}
```

## 🔧 Error Handling Patterns

### 1. **Graceful Plugin Degradation**
```typescript
// ✅ CORRECT - Safe plugin initialization
export const myPlugin = (options: PluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    const pluginOptions = { ...defaultOptions, ...options }

    // Graceful disable
    if (!pluginOptions.enabled) {
      console.log('🔌 Plugin disabled via configuration')
      return config
    }

    try {
      // Add collections safely
      config.collections = [
        ...(config.collections || []),
        ...getEnabledCollections(pluginOptions),
      ]

      // Safe onInit with error handling
      const originalOnInit = config.onInit
      config.onInit = async (payload) => {
        try {
          if (originalOnInit) await originalOnInit(payload)
          
          if (pluginOptions.seedData) {
            await seedPluginData(payload, pluginOptions)
            console.log('✅ Plugin: Demo data seeded successfully')
          }
        } catch (error) {
          console.warn('⚠️ Plugin: Failed to initialize:', error)
          // Don't throw - allow app to continue
        }
      }

      console.log('✅ Plugin initialized successfully')
      return config
    } catch (error) {
      console.error('❌ Plugin: Critical initialization error:', error)
      // Return original config to prevent app crash
      return incomingConfig
    }
  }
}
```

### 2. **Seed Data Error Handling**
```typescript
// ✅ CORRECT - Robust seed data handling
export const seedPluginData = async (
  payload: Payload,
  options: PluginOptions
): Promise<void> => {
  const collections = Object.keys(options.collections || {})
  
  for (const collectionSlug of collections) {
    try {
      // Check if collection exists
      const collection = payload.collections[collectionSlug]
      if (!collection) {
        console.warn(`⚠️ Collection '${collectionSlug}' not found, skipping seed data`)
        continue
      }

      // Check if data already exists
      const existing = await payload.find({
        collection: collectionSlug,
        limit: 1,
      })

      if (existing.totalDocs > 0) {
        console.log(`📊 Collection '${collectionSlug}' already has data, skipping seed`)
        continue
      }

      // Seed the data
      const seedData = getSeedDataForCollection(collectionSlug)
      for (const item of seedData) {
        await payload.create({
          collection: collectionSlug,
          data: item,
        })
      }

      console.log(`✅ Seeded ${seedData.length} items for '${collectionSlug}'`)
    } catch (error) {
      console.warn(`⚠️ Failed to seed '${collectionSlug}':`, error)
      // Continue with other collections
    }
  }
}
```

## 🧪 Testing Strategies

### 1. **Plugin Testing Checklist**
- [ ] **Type Safety**: No TypeScript compilation errors
- [ ] **Collection Creation**: All collections appear in admin
- [ ] **API Endpoints**: Standard REST endpoints work
- [ ] **Seed Data**: Demo data loads without errors
- [ ] **Error Handling**: Plugin gracefully handles failures
- [ ] **Configuration**: All options work as expected
- [ ] **Cross-Plugin**: Compatible with other plugins
- [ ] **Documentation**: README.md is comprehensive

### 2. **Common Test Scenarios**
```typescript
// Test plugin with minimal config
const minimalConfig = myPlugin({ enabled: true })

// Test plugin with full config
const fullConfig = myPlugin({
  enabled: true,
  seedData: true,
  collections: { 'my-collection': true },
  features: { 'advanced-feature': true },
})

// Test plugin disabled
const disabledConfig = myPlugin({ enabled: false })

// Test plugin with invalid config
const invalidConfig = myPlugin({
  enabled: true,
  collections: { 'non-existent': true },
})
```

## 🚀 Performance Optimization

### 1. **Lazy Loading Collections**
```typescript
// ✅ CORRECT - Only load enabled collections
const getEnabledCollections = (options: PluginOptions): CollectionConfig[] => {
  const collections: CollectionConfig[] = []
  
  if (options.collections?.['my-collection']) {
    collections.push(MyCollection)
  }
  
  if (options.collections?.['other-collection']) {
    collections.push(OtherCollection)
  }
  
  return collections
}
```

### 2. **Efficient Seed Data**
```typescript
// ✅ CORRECT - Batch operations and existence checks
const seedEfficiently = async (payload: Payload, data: any[]) => {
  // Check if any data exists first
  const existing = await payload.find({
    collection: 'my-collection',
    limit: 1,
  })
  
  if (existing.totalDocs > 0) return
  
  // Batch create operations
  const promises = data.map(item => 
    payload.create({
      collection: 'my-collection',
      data: item,
    })
  )
  
  await Promise.allSettled(promises)
}
```

## 📚 Documentation Requirements

### 1. **README.md Mandatory Sections**
Every plugin MUST include these sections in README.md:

```markdown
# Plugin Name

Brief description of what the plugin does.

## Installation

### Automatic (Recommended)
```bash
npm install @paulovila/plugin-name
```

### Manual
[Manual configuration steps]

## Configuration
[Complete options with examples]

## Usage
[API examples and workflows]

## Collections
[Data structure explanations]

## Security & Compliance
[Important considerations]

## Troubleshooting
[Common issues and solutions]

## Development
[How to contribute and extend]
```

### 2. **Code Documentation Standards**
```typescript
/**
 * Plugin for handling [specific functionality]
 * 
 * @example
 * ```typescript
 * import { myPlugin } from '@paulovila/my-plugin'
 * 
 * export default buildConfig({
 *   plugins: [
 *     myPlugin({
 *       enabled: true,
 *       seedData: true,
 *     }),
 *   ],
 * })
 * ```
 */
export const myPlugin = (options: PluginOptions = {}): Plugin => {
  // Implementation
}

/**
 * Configuration options for the plugin
 */
export interface PluginOptions {
  /** Enable or disable the plugin */
  enabled?: boolean
  /** Whether to seed demo data */
  seedData?: boolean
  // ... other options with JSDoc comments
}
```

## 🔍 Debugging Techniques

### 1. **Plugin Debug Logging**
```typescript
// ✅ CORRECT - Structured logging with emojis
const DEBUG = process.env.NODE_ENV === 'development'

const log = {
  info: (message: string, ...args: any[]) => {
    if (DEBUG) console.log(`ℹ️ [Plugin]`, message, ...args)
  },
  success: (message: string, ...args: any[]) => {
    console.log(`✅ [Plugin]`, message, ...args)
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ [Plugin]`, message, ...args)
  },
  error: (message: string, ...args: any[]) => {
    console.error(`❌ [Plugin]`, message, ...args)
  },
}
```

### 2. **Configuration Validation**
```typescript
// ✅ CORRECT - Validate configuration early
const validateOptions = (options: PluginOptions): void => {
  if (options.enabled === false) return
  
  if (options.limits?.maxItems && options.limits.maxItems < 1) {
    throw new Error('maxItems must be greater than 0')
  }
  
  if (options.collections) {
    const validCollections = ['collection1', 'collection2']
    const invalidCollections = Object.keys(options.collections)
      .filter(name => !validCollections.includes(name))
    
    if (invalidCollections.length > 0) {
      log.warn(`Unknown collections: ${invalidCollections.join(', ')}`)
    }
  }
}
```

## 🚨 CRITICAL: Plugin Boundary Enforcement Rules

### 1. **NEVER MODIFY CODE OUTSIDE PLUGIN BOUNDARIES**
**This is the most important rule learned from KYC plugin development.**

```typescript
// ❌ FORBIDDEN - Modifying main application files
// - Never modify src/endpoints/seed/index.ts
// - Never modify main payload.config.ts directly
// - Never modify shared utilities outside plugin
// - Never modify other plugins' code

// ✅ CORRECT - Plugin-contained seeding
export const myPlugin = (options: PluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    
    config.onInit = async (payload) => {
      // Run original onInit first
      if (incomingConfig.onInit) {
        await incomingConfig.onInit(payload)
      }
      
      // Plugin-specific seeding ONLY
      if (options.seedData) {
        await seedPluginData(payload, options)
      }
    }
    
    return config
  }
}
```

### 2. **Plugin Self-Containment Verification**
```typescript
// ✅ CORRECT - Verify plugin independence
const verifyPluginBoundaries = () => {
  // Plugin should work without any external file modifications
  // All functionality must be within plugin directory
  // No dependencies on main application code changes
}
```

## � Migration Strategies

### 1. **Version Compatibility**
```typescript
// ✅ CORRECT - Handle version differences
export const myPlugin = (options: PluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    // Check Payload version compatibility
    const payloadVersion = process.env.PAYLOAD_VERSION || '2.0.0'
    
    if (semver.lt(payloadVersion, '2.0.0')) {
      log.warn('Plugin requires Payload v2.0.0 or higher')
      return incomingConfig
    }
    
    // Version-specific implementations
    if (semver.gte(payloadVersion, '2.1.0')) {
      // Use newer features
    } else {
      // Fallback for older versions
    }
    
    return config
  }
}
```

## 📋 Pre-Development Checklist

Before starting any plugin development, ensure:

- [ ] **Memory Bank Read**: Read both README.md requirements and this development-learnings.md file
- [ ] **Project Structure**: Understand the target project's plugin architecture
- [ ] **TypeScript Setup**: Verify TypeScript configuration and version compatibility
- [ ] **Payload Version**: Check Payload CMS version and compatibility requirements
- [ ] **Existing Plugins**: Review similar plugins for patterns and conventions
- [ ] **Documentation Plan**: Plan README.md structure before coding
- [ ] **Testing Strategy**: Define how you'll test the plugin during development
- [ ] **Error Handling**: Plan graceful degradation and error recovery
- [ ] **Performance Considerations**: Consider impact on app startup and runtime
- [ ] **Security Review**: Identify potential security implications

## 🎯 Success Metrics

A successful plugin implementation should achieve:

- ✅ **Zero TypeScript Errors**: Clean compilation without warnings
- ✅ **Comprehensive Documentation**: Complete README.md with all required sections
- ✅ **Graceful Error Handling**: Plugin doesn't crash the application
- ✅ **Performance Optimized**: Minimal impact on app startup time
- ✅ **Well Tested**: All major functionality verified
- ✅ **Configurable**: Flexible options for different use cases
- ✅ **Maintainable**: Clean, documented code following established patterns

## 🔄 Continuous Learning

This file should be updated whenever:
- New TypeScript errors are encountered and solved
- Better patterns are discovered
- Performance optimizations are found
- Security issues are identified and resolved
- Documentation improvements are made
- Testing strategies are refined

**Remember**: Every error solved and pattern discovered should be documented here to benefit future development efforts.
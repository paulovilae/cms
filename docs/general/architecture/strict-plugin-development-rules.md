# Strict Plugin Development Rules

## 🚨 CRITICAL: Plugin Boundary Enforcement

These rules are **NON-NEGOTIABLE** and must be followed by all developers working on plugins. Violations of these rules compromise the entire plugin architecture and can break the modular system.

## Core Principle: Plugin Self-Containment

**RULE #1: NEVER MODIFY CODE OUTSIDE PLUGIN BOUNDARIES**

Plugins must be completely self-contained. They cannot and must not modify any files outside their own directory structure.

### ❌ FORBIDDEN ACTIONS

1. **Never modify main application seed files**
   ```typescript
   // ❌ WRONG - Modifying src/endpoints/seed/index.ts
   // This violates plugin boundaries
   ```

2. **Never modify main payload.config.ts directly**
   ```typescript
   // ❌ WRONG - Direct modification of main config
   // Plugins should only extend through the plugin system
   ```

3. **Never modify shared utilities outside plugin**
   ```typescript
   // ❌ WRONG - Modifying src/lib/utils.ts
   // Create plugin-specific utilities instead
   ```

4. **Never modify other plugins' code**
   ```typescript
   // ❌ WRONG - Modifying another plugin's files
   // Plugins must remain independent
   ```

### ✅ CORRECT APPROACHES

1. **Plugin-contained seeding**
   ```typescript
   // ✅ CORRECT - Seeding within plugin's onInit
   export const myPlugin = (options: PluginOptions = {}): Plugin => {
     return (incomingConfig: Config): Config => {
       const config = { ...incomingConfig }
       
       config.onInit = async (payload) => {
         // Run original onInit first
         if (incomingConfig.onInit) {
           await incomingConfig.onInit(payload)
         }
         
         // Plugin-specific seeding
         if (options.seedData) {
           await seedPluginData(payload, options)
         }
       }
       
       return config
     }
   }
   ```

2. **Plugin-specific utilities**
   ```typescript
   // ✅ CORRECT - Create utilities within plugin
   // src/plugins/my-plugin/src/utils/pluginUtils.ts
   export const pluginSpecificFunction = () => {
     // Plugin-specific logic
   }
   ```

## Plugin Structure Requirements

### Mandatory Plugin Structure
```
plugin-name/
├── README.md              # REQUIRED: Comprehensive documentation
├── package.json           # Plugin metadata and dependencies
├── tsconfig.json          # TypeScript configuration
├── plugin.json            # Plugin metadata
├── src/
│   ├── index.ts          # Main plugin export
│   ├── types.ts          # Plugin-specific types
│   ├── collections/      # Collection definitions
│   ├── globals/          # Global configurations (if needed)
│   ├── seed/             # Plugin-specific seed data
│   └── utils/            # Plugin-specific utilities
├── scripts/
│   └── setup.js          # Post-install automation (optional)
└── tests/                # Plugin-specific tests
```

### Plugin Entry Point Requirements
```typescript
// src/index.ts - REQUIRED structure
import type { Config, Plugin } from 'payload'

export interface PluginOptions {
  enabled?: boolean
  seedData?: boolean
  // ... other options
}

export const myPlugin = (options: PluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    // Plugin implementation
    const config = { ...incomingConfig }
    
    // Add collections
    config.collections = [
      ...(config.collections || []),
      // Plugin collections
    ]
    
    // Add globals if needed
    config.globals = [
      ...(config.globals || []),
      // Plugin globals
    ]
    
    // Plugin-specific initialization
    config.onInit = async (payload) => {
      if (incomingConfig.onInit) {
        await incomingConfig.onInit(payload)
      }
      
      // Plugin initialization logic
    }
    
    return config
  }
}

export default myPlugin
```

## Data Seeding Rules

### ✅ CORRECT: Plugin-Contained Seeding
```typescript
// Within plugin's src/seed/seedData.ts
export const seedPluginData = async (
  payload: Payload,
  options: PluginOptions
): Promise<void> => {
  try {
    // Check if data already exists
    const existing = await payload.find({
      collection: 'plugin-collection',
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      console.log('📊 Plugin data already exists, skipping seed')
      return
    }

    // Seed plugin-specific data
    const seedData = getPluginSeedData()
    for (const item of seedData) {
      await payload.create({
        collection: 'plugin-collection',
        data: item,
      })
    }

    console.log('✅ Plugin: Demo data seeded successfully')
  } catch (error) {
    console.warn('⚠️ Plugin: Failed to seed data:', error)
    // Don't throw - allow app to continue
  }
}
```

### ❌ FORBIDDEN: Modifying Main Seed Files
```typescript
// ❌ NEVER DO THIS - Modifying src/endpoints/seed/index.ts
// This breaks plugin boundaries and creates dependencies
```

## Configuration Rules

### Plugin Configuration Pattern
```typescript
// Default options with sensible defaults
const defaultOptions: Required<PluginOptions> = {
  enabled: true,
  seedData: process.env.NODE_ENV === 'development',
  // ... other defaults
}

// Merge with user options
const pluginOptions = { ...defaultOptions, ...options }

// Graceful disable
if (!pluginOptions.enabled) {
  console.log('🔌 Plugin disabled via configuration')
  return incomingConfig
}
```

## Error Handling Requirements

### Graceful Degradation
```typescript
export const myPlugin = (options: PluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    try {
      // Plugin implementation
      const config = { ...incomingConfig }
      
      // Safe operations with error handling
      
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

### Seed Data Error Handling
```typescript
// Always wrap seeding in try-catch
try {
  await seedPluginData(payload, options)
  console.log('✅ Plugin: Demo data seeded successfully')
} catch (error) {
  console.warn('⚠️ Plugin: Failed to seed demo data:', error)
  // Continue - don't crash the application
}
```

## Documentation Requirements

### README.md is MANDATORY
Every plugin MUST have a comprehensive README.md file with:

1. **Installation instructions** (automatic and manual)
2. **Configuration options** with examples
3. **Usage examples** with API calls
4. **Collection descriptions** and data structures
5. **Security considerations**
6. **Troubleshooting guide**
7. **Version compatibility**

### Code Documentation
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
```

## Testing Requirements

### Plugin Testing Checklist
- [ ] **Type Safety**: No TypeScript compilation errors
- [ ] **Collection Creation**: All collections appear in admin
- [ ] **API Endpoints**: Standard REST endpoints work
- [ ] **Seed Data**: Demo data loads without errors
- [ ] **Error Handling**: Plugin gracefully handles failures
- [ ] **Configuration**: All options work as expected
- [ ] **Cross-Plugin**: Compatible with other plugins
- [ ] **Documentation**: README.md is comprehensive

## Build and Distribution

### Build Process
```bash
# Within plugin directory
npm run build
```

### Package.json Requirements
```json
{
  "name": "@paulovila/plugin-name",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "plugin.json"
  ],
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "postinstall": "node scripts/setup.js"
  },
  "payload": {
    "type": "plugin",
    "category": "business",
    "autoActivate": true,
    "seedData": true
  }
}
```

## Enforcement and Consequences

### Code Review Requirements
- All plugin code must be reviewed for boundary compliance
- Any boundary violations must be rejected and fixed
- Reviewers must verify plugin self-containment

### Automated Checks
- Build process should verify no external file modifications
- Tests should validate plugin independence
- CI/CD should enforce these rules

### Consequences of Violations
1. **Immediate**: Code review rejection
2. **Repeated violations**: Plugin development privileges revoked
3. **System impact**: Potential rollback of changes

## Emergency Procedures

### If Boundary Violation Occurs
1. **Immediate**: Stop development and assess impact
2. **Rollback**: Revert any external file modifications
3. **Refactor**: Move functionality into plugin boundaries
4. **Test**: Verify plugin works in isolation
5. **Document**: Update this guide with lessons learned

## Success Metrics

A compliant plugin should achieve:
- ✅ **Zero external dependencies**: No modifications outside plugin
- ✅ **Complete self-containment**: All functionality within plugin
- ✅ **Graceful error handling**: Doesn't crash main application
- ✅ **Comprehensive documentation**: Complete README.md
- ✅ **Independent operation**: Works without external modifications

## Key Learnings from KYC Plugin

### What We Did Wrong Initially
- Modified main seed file (`src/endpoints/seed/index.ts`)
- Created dependencies outside plugin boundaries
- Mixed plugin logic with application logic

### What We Fixed
- Moved all seeding logic into plugin's `onInit`
- Created plugin-contained seed data functions
- Ensured complete plugin self-containment
- Built proper npm package with TypeScript declarations

### Critical Success Factors
1. **Plugin-contained seeding** through `onInit` hook
2. **No external file modifications** whatsoever
3. **Graceful error handling** that doesn't crash the app
4. **Comprehensive documentation** in README.md
5. **Proper TypeScript compilation** with declarations

## Conclusion

These rules exist to maintain the integrity of our plugin architecture. They ensure that:
- Plugins remain modular and reusable
- The main application stays clean and maintainable
- Teams can work independently without conflicts
- The system remains scalable and robust

**Remember: A plugin that violates boundaries is not a plugin - it's a monolithic modification that defeats the entire purpose of our architecture.**

---

*Last updated: July 2024*
*Next review: When plugin architecture changes*
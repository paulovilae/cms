# Plugin Development Guide

## 🚨 MANDATORY READING FOR AGENTS

**CRITICAL**: Before working on ANY plugin development, agents MUST read these files:
1. **README.md** - Plugin-specific documentation requirements
2. **development-learnings.md** - Technical implementation guidance and error solutions

These files contain essential knowledge to prevent common errors and ensure successful plugin development.

## What is a Plugin?

A plugin is a piece of code that adds new features to our platform. Think of it like an app on your phone - you install it and it gives you new capabilities.

## How Plugins Work

Plugins extend Payload CMS by adding:
- **Collections**: New data types (like "Users" or "Products")
- **Globals**: Site-wide settings
- **Hooks**: Custom behavior when data changes
- **UI Components**: New admin interface elements

## Quick Start: Using a Plugin

### Simple Installation (Our Enhanced Way)
```bash
# Install and automatically set up
npm install @paulovila/kyc-plugin
```

The plugin automatically:
- Updates your `payload.config.ts` file
- Adds demo data
- Configures everything for you

### Manual Installation (Traditional Way)
```typescript
// In your payload.config.ts file
import { kycPlugin } from '@paulovila/kyc-plugin';

const config = buildConfig({
  plugins: [
    kycPlugin({
      enabled: true,
      seedData: true  // Adds demo data
    }),
  ],
});
```

## Plugin Types in Our Platform

### 🔧 Core Plugins (`@paulovila/core-*`)
**Required by all apps**
- Authentication system
- Database connections
- Error handling
- Basic API features

### 🔄 Shared Plugins (`@paulovila/shared-*`)
**Optional, can be used by any business**
- Analytics tracking
- Email notifications
- File uploads
- Search functionality

### 🏢 Business Plugins (`@paulovila/{business}-*`)
**Specific to one business**
- `@paulovila/intellitrade-kyc` - KYC verification for IntelliTrade
- `@paulovila/salarium-hr` - HR tools for Salarium
- `@paulovila/latinos-trading` - Trading features for Latinos

## Building Your Own Plugin

### 1. Create Plugin Structure
```
my-plugin/
├── package.json          # Plugin info and dependencies
├── src/
│   ├── index.ts         # Main plugin file
│   ├── collections/     # Data types you're adding
│   ├── globals/         # Site settings
│   └── seed/           # Demo data
└── README.md           # How to use your plugin
```

### 2. Basic Plugin Code
```typescript
// src/index.ts
import type { Config } from 'payload';

export const myPlugin = (options: { enabled?: boolean } = {}) => 
  (incomingConfig: Config): Config => {
    
    // Don't do anything if disabled
    if (!options.enabled) return incomingConfig;
    
    // Copy the existing config
    const config = { ...incomingConfig };
    
    // Add your collections (data types)
    config.collections = [
      ...(config.collections || []),
      // Your new collections here
    ];
    
    // Add your globals (site settings)
    config.globals = [
      ...(config.globals || []),
      // Your new globals here
    ];
    
    return config;
  };
```

### 3. Package.json Setup
```json
{
  "name": "@paulovila/my-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "postinstall": "node setup.js"
  },
  "payload": {
    "type": "plugin",
    "category": "shared",
    "autoActivate": true,
    "seedData": true
  }
}
```

## Plugin Development Tips

### ✅ Do This
- **Start simple**: Add one collection first, then expand
- **Include demo data**: Makes testing easier
- **Write clear documentation**: Others need to understand your plugin
- **Test thoroughly**: Make sure it works with other plugins
- **Use TypeScript**: Helps catch errors early

### ❌ Avoid This
- **Don't break existing data**: Always spread existing arrays
- **Don't hardcode values**: Use options for configuration
- **Don't skip documentation**: Future you will thank you
- **Don't forget error handling**: Things can go wrong

## Common Plugin Patterns

### Adding a Collection
```typescript
// Add a new data type
config.collections = [
  ...(config.collections || []),
  {
    slug: 'my-collection',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      }
    ]
  }
];
```

### Adding Demo Data
```typescript
// In your plugin's onInit
config.onInit = async (payload) => {
  // Run original onInit first
  if (incomingConfig.onInit) {
    await incomingConfig.onInit(payload);
  }
  
  // Add your demo data
  await payload.create({
    collection: 'my-collection',
    data: { title: 'Demo Item' }
  });
};
```

### Plugin Options
```typescript
export interface MyPluginOptions {
  enabled?: boolean;      // Turn plugin on/off
  apiKey?: string;       // External service key
  maxItems?: number;     // Limit number of items
}

export const myPlugin = (options: MyPluginOptions = {}) => {
  // Use options.enabled, options.apiKey, etc.
};
```

## Testing Your Plugin

### 1. Create Test Environment
```bash
mkdir test-app
cd test-app
npx create-payload-app@latest
```

### 2. Install Your Plugin
```bash
npm install ../my-plugin
```

### 3. Test Features
- Check admin interface
- Create test data
- Verify API endpoints work
- Test with other plugins

## Publishing Your Plugin

### 1. Build for Production
```bash
npm run build
```

### 2. Publish to Our Registry
```bash
npm publish --registry https://npm.paulovila.org
```

### 3. Document Usage
Update README with:
- Installation instructions
- Configuration options
- Usage examples
- Troubleshooting tips

## Getting Help

- **Documentation**: Check `docs/general/architecture/enhanced-plugin-standards.md`
- **Examples**: Look at existing plugins in `cms/src/plugins/`
- **Issues**: Ask in team chat or create GitHub issue

## Quick Reference

### Install Plugin
```bash
npm install @paulovila/plugin-name
```

### Use Plugin
```typescript
import { pluginName } from '@paulovila/plugin-name';

plugins: [
  pluginName({ enabled: true })
]
```

### Plugin Categories
- `@paulovila/core-*` - Required by all apps
- `@paulovila/shared-*` - Optional, reusable
- `@paulovila/{business}-*` - Business-specific

Remember: Plugins should be simple, well-documented, and easy to use. When in doubt, start small and build up!

## Key Learnings from KYC Plugin Development

### Critical Implementation Insights

#### 1. **Use Payload's Standard Endpoints**
- **Avoid custom endpoints** unless absolutely necessary
- Payload provides robust REST API endpoints automatically:
  - `POST /api/collection-name` - Create new records
  - `GET /api/collection-name` - List records with filtering
  - `GET /api/collection-name/:id` - Get specific record
  - `PATCH /api/collection-name/:id` - Update record
  - `DELETE /api/collection-name/:id` - Delete record
- Custom endpoints add complexity and potential TypeScript issues

#### 2. **TypeScript Type Safety Challenges**
- **Payload handler types** can be complex and change between versions
- **Collection slug types** must match exactly with collection definitions
- **Avoid duplicate exports** - define interfaces once and export properly
- **Import paths** must be precise to avoid compilation errors

#### 3. **Plugin Structure Best Practices**
```
plugin-name/
├── README.md              # REQUIRED: Comprehensive documentation
├── package.json           # Plugin metadata and dependencies
├── src/
│   ├── index.ts          # Main plugin export with options interface
│   ├── types.ts          # Shared type definitions
│   ├── collections/      # Collection definitions (one per file)
│   ├── globals/          # Global configurations
│   └── seed/             # Demo data and seeding logic
└── scripts/
    └── setup.js          # Post-install automation (optional)
```

#### 4. **Collection Design Patterns**
- **Use descriptive slugs**: `kyc-applications` not `kyc`
- **Include audit fields**: `createdAt`, `updatedAt`, `createdBy`
- **Add status tracking**: Use enums for consistent status values
- **Reference relationships**: Use Payload's relationship fields
- **Validation rules**: Add proper field validation and required fields

#### 5. **Plugin Configuration Strategy**
```typescript
export interface PluginOptions {
  enabled?: boolean                    // Always include enable/disable
  seedData?: boolean                   // Control demo data
  [feature]?: boolean | object         // Feature toggles
  [customization]?: string[]           // Customizable arrays
  [threshold]?: number                 // Configurable limits
}

// Provide sensible defaults
const defaultOptions: PluginOptions = {
  enabled: true,
  seedData: process.env.NODE_ENV === 'development',
  // ... other defaults
}
```

#### 6. **Error Handling and Logging**
- **Graceful degradation**: Plugin should not break if optional features fail
- **Informative logging**: Use console.log with emoji prefixes for visibility
- **Error boundaries**: Wrap risky operations in try-catch blocks
- **Seed data failures**: Should warn but not crash the application

#### 7. **Documentation Requirements - CRITICAL**
**🚨 ALWAYS CREATE README.md - NON-NEGOTIABLE 🚨**

Every plugin MUST include a comprehensive README.md file as the first step of development. This is not optional and should be created before any code implementation.

The README.md MUST contain:
- **Installation instructions** (both automatic and manual methods)
- **Complete configuration options** with working examples
- **API usage examples** using Payload's standard REST endpoints
- **Collection descriptions** explaining each data type and its purpose
- **Security considerations** for sensitive data handling
- **Compliance notes** for regulated features (KYC, financial, etc.)
- **Troubleshooting section** with common issues and solutions
- **Version compatibility** information
- **Contributing guidelines** for team development

**Template Structure for README.md:**
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
```

#### 8. **Development Workflow Lessons**
- **Start with collections**: Define data structures first
- **Add seed data early**: Makes testing much easier
- **Test incrementally**: Don't build everything before testing
- **Use TypeScript strictly**: Helps catch issues early
- **Document as you go**: Don't leave documentation for the end

#### 9. **Common Pitfalls to Avoid**
- **Custom endpoints complexity**: Stick to Payload's standard API
- **Type export conflicts**: Don't export the same type twice
- **Hardcoded values**: Make everything configurable through options
- **Missing error handling**: Always handle potential failures gracefully
- **Poor documentation**: Undocumented plugins are unusable plugins

#### 10. **Testing Strategy**
- **Unit tests**: Test individual collection configurations
- **Integration tests**: Test plugin integration with Payload
- **API tests**: Verify standard endpoints work correctly
- **Demo data tests**: Ensure seeding works in clean environments
- **Cross-plugin tests**: Verify compatibility with other plugins

### Real-World Example: KYC Plugin Architecture

The KYC plugin demonstrates these principles:

```typescript
// Clean plugin structure with proper TypeScript
export const kycPlugin = (options: KYCPluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    const pluginOptions = { ...defaultOptions, ...options }

    // Graceful disable
    if (!pluginOptions.enabled) return config

    // Add collections using spread operator
    config.collections = [
      ...(config.collections || []),
      KYCApplications,
      VerificationDocuments,
      // ... other collections
    ]

    // Safe onInit with error handling
    config.onInit = async (payload) => {
      if (originalOnInit) await originalOnInit(payload)
      
      if (pluginOptions.seedData) {
        try {
          await seedKYCData(payload, pluginOptions)
          console.log('✅ KYC plugin: Demo data seeded successfully')
        } catch (error) {
          console.warn('⚠️ KYC plugin: Failed to seed demo data:', error)
        }
      }
    }

    return config
  }
}
```

### Key Success Factors

1. **Simplicity**: Use Payload's built-in features rather than custom solutions
2. **Documentation**: Comprehensive README with real examples
3. **Type Safety**: Proper TypeScript without conflicts
4. **Error Resilience**: Graceful handling of failures
5. **Configurability**: Flexible options for different use cases
6. **Testing**: Thorough validation of all functionality

These learnings ensure plugins are maintainable, reliable, and easy to use across different projects and team members.

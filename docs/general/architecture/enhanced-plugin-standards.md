# Enhanced Plugin Standards for Multi-Tenant Platform

## Overview

This document defines the enhanced plugin standards for our multi-tenant business platform, addressing the need for simplified installation, activation, and seeding capabilities. These standards build upon the existing Payload CMS plugin architecture while introducing automation and self-contained functionality.

## Current Limitations

The existing plugin system requires:
- Manual configuration in `payload.config.ts`
- Separate seeding scripts and processes
- Complex setup procedures for new plugins
- Type assertions and manual imports

## Enhanced Plugin Architecture

### 1. NPM/NPX Installable Plugins

Plugins should be installable as npm packages with automated setup:

```bash
# Install and automatically configure
npx @paulovila/kyc-plugin install

# Or via npm with post-install hooks
npm install @paulovila/kyc-plugin
```

### 2. Self-Contained Plugin Structure

```
@paulovila/kyc-plugin/
├── package.json              # Enhanced with payload metadata
├── postinstall.mjs          # Automated setup script
├── src/
│   ├── index.ts             # Main plugin export
│   ├── collections/         # Plugin collections
│   ├── globals/             # Plugin globals
│   ├── hooks/               # Plugin hooks
│   ├── seed/                # Integrated seeding
│   │   ├── index.ts         # Seed plugin
│   │   └── data/            # Seed data
│   └── types.ts             # Plugin types
├── README.md                # Usage documentation
└── dev/                     # Development environment
```

### 3. Enhanced Package.json Metadata

```json
{
  "name": "@paulovila/kyc-plugin",
  "version": "1.0.0",
  "description": "KYC verification plugin for IntelliTrade",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "postinstall": "node postinstall.mjs"
  },
  "payload": {
    "type": "plugin",
    "category": "business-specific",
    "business": "intellitrade",
    "collections": ["kyc-applications", "kyc-documents"],
    "globals": ["kyc-settings"],
    "autoActivate": true,
    "seedData": true,
    "dependencies": []
  },
  "keywords": ["payload-plugin", "kyc", "intellitrade"],
  "peerDependencies": {
    "payload": "^2.0.0"
  }
}
```

### 4. Automated Setup Script (postinstall.mjs)

```javascript
import fs from 'fs';
import path from 'path';

export async function setupPlugin() {
  const configPath = findPayloadConfig();
  if (!configPath) {
    console.warn('Payload config not found. Manual setup required.');
    return;
  }

  await updatePayloadConfig(configPath);
  await setupEnvironmentVariables();
  console.log('✅ KYC Plugin installed and configured successfully');
}

function findPayloadConfig() {
  const possiblePaths = [
    'src/payload.config.ts',
    'payload.config.ts',
    'src/payload.config.js',
    'payload.config.js'
  ];
  
  return possiblePaths.find(p => fs.existsSync(p));
}

async function updatePayloadConfig(configPath) {
  const content = fs.readFileSync(configPath, 'utf8');
  
  // Check if plugin already imported
  if (content.includes('@paulovila/kyc-plugin')) {
    console.log('Plugin already configured');
    return;
  }

  // Add import
  const importLine = "import { kycPlugin } from '@paulovila/kyc-plugin';\n";
  const updatedContent = importLine + content;

  // Add to plugins array
  const pluginCall = `    kycPlugin({ enabled: true }),`;
  const finalContent = updatedContent.replace(
    /plugins:\s*\[/,
    `plugins: [\n${pluginCall}`
  );

  fs.writeFileSync(configPath, finalContent);
}
```

### 5. Integrated Seed Plugin

```typescript
// src/seed/index.ts
import type { Payload } from 'payload';

export const seedPlugin = (options: { enabled: boolean }) => {
  return {
    name: 'kyc-seed-plugin',
    onInit: async (payload: Payload) => {
      if (!options.enabled) return;
      
      console.log('🌱 Seeding KYC demo data...');
      await seedKYCData(payload);
      console.log('✅ KYC demo data seeded successfully');
    }
  };
};

async function seedKYCData(payload: Payload) {
  // Create demo KYC applications
  await payload.create({
    collection: 'kyc-applications',
    data: {
      applicantName: 'John Doe',
      email: 'john.doe@example.com',
      status: 'pending',
      submittedAt: new Date(),
    }
  });

  // Create KYC settings
  await payload.updateGlobal({
    slug: 'kyc-settings',
    data: {
      autoApprovalThreshold: 85,
      requireManualReview: true,
      enableNotifications: true,
    }
  });
}
```

### 6. Main Plugin Export

```typescript
// src/index.ts
import type { Config } from 'payload';
import { kycApplications } from './collections/kyc-applications';
import { kycDocuments } from './collections/kyc-documents';
import { kycSettings } from './globals/kyc-settings';
import { seedPlugin } from './seed';

export interface KYCPluginOptions {
  enabled?: boolean;
  seedData?: boolean;
  autoApproval?: boolean;
}

export const kycPlugin = (options: KYCPluginOptions = {}) => 
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig };

    if (!options.enabled) return config;

    // Add collections
    config.collections = [
      ...(config.collections || []),
      kycApplications,
      kycDocuments,
    ];

    // Add globals
    config.globals = [
      ...(config.globals || []),
      kycSettings,
    ];

    // Add seed plugin if enabled
    if (options.seedData) {
      config.plugins = [
        ...(config.plugins || []),
        seedPlugin({ enabled: true }),
      ];
    }

    // Extend onInit for additional setup
    const originalOnInit = config.onInit;
    config.onInit = async (payload) => {
      if (originalOnInit) await originalOnInit(payload);
      
      // Plugin-specific initialization
      console.log('🔐 KYC Plugin initialized');
    };

    return config;
  };

// Re-export types and utilities
export * from './types';
export { kycApplications, kycDocuments, kycSettings };
```

## Installation Workflow

### For Plugin Developers

1. **Create Plugin Package**:
   ```bash
   npx create-payload-app@latest --template plugin kyc-plugin
   cd kyc-plugin
   ```

2. **Enhance Package Structure**:
   - Add `payload` metadata to package.json
   - Create `postinstall.mjs` script
   - Integrate seed functionality
   - Add comprehensive documentation

3. **Publish to Private Registry**:
   ```bash
   npm publish --registry https://npm.paulovila.org
   ```

### For Plugin Users

1. **Install Plugin**:
   ```bash
   npm install @paulovila/kyc-plugin
   ```

2. **Automatic Configuration**:
   - Post-install script runs automatically
   - Plugin is added to payload.config.ts
   - Environment variables are configured

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Seed Demo Data** (optional):
   ```bash
   PAYLOAD_SEED=true npm run dev
   ```

## Plugin Categories

### Core Plugins
- **Location**: `@paulovila/core-*`
- **Purpose**: Essential functionality required by all applications
- **Examples**: `@paulovila/core-auth`, `@paulovila/core-api`

### Shared Plugins
- **Location**: `@paulovila/shared-*`
- **Purpose**: Optional functionality reusable across businesses
- **Examples**: `@paulovila/shared-analytics`, `@paulovila/shared-notifications`

### Business-Specific Plugins
- **Location**: `@paulovila/{business}-*`
- **Purpose**: Unique business logic and UI
- **Examples**: `@paulovila/intellitrade-kyc`, `@paulovila/salarium-hr`

## Quality Standards

### Documentation Requirements
- Comprehensive README with usage examples
- API documentation for all exported functions
- Configuration options with JSDoc comments
- Migration guides for version updates

### Testing Requirements
- 90%+ test coverage
- Integration tests with Payload CMS
- Cross-version compatibility tests
- Performance benchmarks

### Security Standards
- Vulnerability scanning on publish
- Dependency auditing
- Access control validation
- Data privacy compliance

## Migration Path

### Phase 1: Enhanced Documentation (Current)
- Document new plugin standards
- Create templates and examples
- Establish quality guidelines

### Phase 2: Tooling Development
- Create plugin scaffolding tools
- Develop automated setup scripts
- Build testing frameworks

### Phase 3: Plugin Refactoring
- Migrate existing plugins to new standards
- Implement automated installation
- Add integrated seeding capabilities

### Phase 4: Ecosystem Expansion
- Publish plugins to private registry
- Create plugin marketplace
- Establish community guidelines

## Benefits

1. **Simplified Installation**: One-command plugin installation and setup
2. **Automated Configuration**: No manual payload.config.ts editing required
3. **Integrated Seeding**: Demo data included with plugin installation
4. **Self-Contained**: All plugin functionality in a single package
5. **Version Management**: Semantic versioning with compatibility tracking
6. **Quality Assurance**: Standardized testing and documentation requirements

## Next Steps

1. Implement the enhanced KYC plugin structure
2. Create automated setup tooling
3. Develop plugin templates and scaffolding
4. Establish private npm registry
5. Migrate existing plugins to new standards

This enhanced plugin architecture will significantly improve the developer experience while maintaining the flexibility and power of our multi-tenant platform.
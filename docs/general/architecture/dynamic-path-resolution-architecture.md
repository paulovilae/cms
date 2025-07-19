# Dynamic Path Resolution Architecture

## Overview

This document outlines the architecture for implementing dynamic path resolution in our single CMS model, enabling business applications to be configured entirely through environment variables with port-based identification.

## Current State Analysis

### Existing Structure
```
apps/
├── intellitrade/
│   ├── .env                 # Currently empty
│   ├── intellitrade.db      # SQLite database
│   └── media/               # Media files directory
└── capacita/                # Similar structure expected
```

### Existing Infrastructure
- **Port Config Plugin**: Already implemented in `plugins/core/port-config/`
- **Recreation Scripts**: `scripts/recreate-business-app.js` and `scripts/recreate-intellitrade.js`
- **Single CMS Model**: Universal CMS in `cms/cms-sqlite/`

## Proposed Architecture

### 1. Environment Variable Configuration

Each business app will be configured through a comprehensive `.env` file:

```bash
# apps/intellitrade/.env
PORT=3004
BUSINESS_MODE=intellitrade
ROOT_FOLDER=/home/paulo/Programs/paulovila.org/apps/intellitrade
DATABASE_PATH=./intellitrade.db
MEDIA_PATH=./media
UPLOADS_PATH=./uploads
ADMIN_URL=http://localhost:3004/admin
API_URL=http://localhost:3004/api
DOMAIN=intellitrade.paulovila.org
```

### 2. Dynamic Path Resolution Plugin

Create a new core plugin `@paulovila/core-dynamic-paths` that:

#### Features
- **Port-Based Identification**: Automatically detects business context from PORT
- **Dynamic Database Paths**: Resolves database location from environment
- **Dynamic Media Paths**: Configures media storage paths
- **URL Generation**: Creates proper URLs based on environment
- **Path Validation**: Ensures all paths exist and are accessible

#### Plugin Structure
```
plugins/core/dynamic-paths/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Main plugin export
    ├── types.ts              # TypeScript interfaces
    ├── resolvers/
    │   ├── database.ts       # Database path resolution
    │   ├── media.ts          # Media path resolution
    │   └── urls.ts           # URL generation
    └── validators/
        ├── paths.ts          # Path validation
        └── environment.ts    # Environment validation
```

### 3. Business Context Mapping

```typescript
// Business context configuration
const BUSINESS_CONTEXTS = {
  3003: {
    name: 'latinos',
    domain: 'latinos.paulovila.org',
    description: 'Latinos Trading Platform'
  },
  3004: {
    name: 'intellitrade',
    domain: 'intellitrade.paulovila.org',
    description: 'IntelliTrade Blockchain Platform'
  },
  3005: {
    name: 'salarium',
    domain: 'salarium.paulovila.org',
    description: 'Salarium HR Platform'
  },
  3006: {
    name: 'cms',
    domain: 'cms.paulovila.org',
    description: 'Central Management System'
  },
  3007: {
    name: 'capacita',
    domain: 'capacita.paulovila.org',
    description: 'Capacita Training Platform'
  }
}
```

### 4. Enhanced CMS Configuration

The universal CMS will be enhanced to:

#### Payload Configuration
```typescript
// cms/cms-sqlite/src/payload.config.ts
import { buildConfig } from 'payload'
import { portConfigPlugin } from '@paulovila/core-port-config'
import { dynamicPathsPlugin } from '@paulovila/core-dynamic-paths'

export default buildConfig({
  plugins: [
    // Core plugins for dynamic configuration
    portConfigPlugin({
      enabled: true,
      envVariable: 'PORT',
      verbose: true
    }),
    dynamicPathsPlugin({
      enabled: true,
      autoDetectBusiness: true,
      validatePaths: true,
      createMissingDirs: true
    }),
    // Business-specific plugins loaded dynamically
    ...loadBusinessPlugins()
  ],
  
  // Dynamic database configuration
  db: getDatabaseConfig(),
  
  // Dynamic admin configuration
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: getBusinessTitle(),
      favicon: getBusinessFavicon(),
    },
    css: getBusinessCSS(),
  },
  
  // Dynamic upload configuration
  upload: getUploadConfig(),
  
  // Dynamic server URL
  serverURL: getServerURL(),
})
```

#### Dynamic Configuration Functions
```typescript
// Dynamic database configuration
function getDatabaseConfig() {
  const dbPath = process.env.DATABASE_PATH || './database.db'
  const rootFolder = process.env.ROOT_FOLDER || process.cwd()
  
  return sqliteAdapter({
    db: {
      filename: path.resolve(rootFolder, dbPath)
    }
  })
}

// Dynamic upload configuration
function getUploadConfig() {
  const mediaPath = process.env.MEDIA_PATH || './media'
  const rootFolder = process.env.ROOT_FOLDER || process.cwd()
  
  return {
    staticDir: path.resolve(rootFolder, mediaPath),
    staticURL: '/media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf']
  }
}

// Dynamic server URL
function getServerURL() {
  const port = process.env.PORT || '3000'
  const domain = process.env.DOMAIN
  
  if (process.env.NODE_ENV === 'production' && domain) {
    return `https://${domain}`
  }
  
  return `http://localhost:${port}`
}
```

### 5. Business App Setup Workflow

#### Automated Setup Script
```bash
# Enhanced setup script
node scripts/setup-business-app.js intellitrade
```

This script will:
1. **Create Directory Structure**
   ```
   apps/intellitrade/
   ├── .env                 # Complete environment configuration
   ├── intellitrade.db      # SQLite database (created if missing)
   ├── media/               # Media files directory
   ├── uploads/             # Upload directory
   └── logs/                # Application logs
   ```

2. **Generate Environment File**
   ```bash
   # apps/intellitrade/.env
   PORT=3004
   BUSINESS_MODE=intellitrade
   ROOT_FOLDER=/home/paulo/Programs/paulovila.org/apps/intellitrade
   DATABASE_PATH=./intellitrade.db
   MEDIA_PATH=./media
   UPLOADS_PATH=./uploads
   ADMIN_URL=http://localhost:3004/admin
   API_URL=http://localhost:3004/api
   DOMAIN=intellitrade.paulovila.org
   
   # Business-specific configuration
   BUSINESS_TITLE=IntelliTrade
   BUSINESS_DESCRIPTION=Blockchain Trading Platform
   BUSINESS_LOGO=/media/logos/intellitrade.png
   
   # Plugin configuration
   ENABLE_KYC_PLUGIN=true
   ENABLE_BLOCKCHAIN_PLUGIN=true
   ENABLE_ESCROW_PLUGIN=true
   ```

3. **Initialize Database**
   - Create SQLite database if it doesn't exist
   - Run initial migrations
   - Seed with business-specific data

4. **Setup Media Directories**
   - Create media and uploads folders
   - Set proper permissions
   - Copy business-specific assets

### 6. Development Workflow

#### Starting a Business App
```bash
# From project root
cd cms/cms-sqlite
npm run dev:intellitrade
```

This command will:
1. Load environment from `apps/intellitrade/.env`
2. Configure paths dynamically
3. Start server on port 3004
4. Connect to `apps/intellitrade/intellitrade.db`
5. Serve media from `apps/intellitrade/media/`

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development next dev",
    "dev:intellitrade": "cross-env NODE_ENV=development DOTENV_CONFIG_PATH=../../apps/intellitrade/.env next dev",
    "dev:latinos": "cross-env NODE_ENV=development DOTENV_CONFIG_PATH=../../apps/latinos/.env next dev",
    "dev:salarium": "cross-env NODE_ENV=development DOTENV_CONFIG_PATH=../../apps/salarium/.env next dev",
    "dev:capacita": "cross-env NODE_ENV=development DOTENV_CONFIG_PATH=../../apps/capacita/.env next dev",
    "dev:cms": "cross-env NODE_ENV=development DOTENV_CONFIG_PATH=../../apps/cms/.env next dev"
  }
}
```

### 7. Plugin Integration

#### Business Plugin Loading
```typescript
// Dynamic plugin loading based on environment
function loadBusinessPlugins() {
  const businessMode = process.env.BUSINESS_MODE
  const plugins = []
  
  // Load business-specific plugins
  switch (businessMode) {
    case 'intellitrade':
      if (process.env.ENABLE_KYC_PLUGIN === 'true') {
        plugins.push(kycPlugin({ enabled: true, seedData: true }))
      }
      if (process.env.ENABLE_BLOCKCHAIN_PLUGIN === 'true') {
        plugins.push(blockchainPlugin({ enabled: true }))
      }
      break
      
    case 'latinos':
      if (process.env.ENABLE_TRADING_PLUGIN === 'true') {
        plugins.push(tradingPlugin({ enabled: true }))
      }
      break
      
    // ... other business modes
  }
  
  return plugins
}
```

### 8. Path Resolution Implementation

#### Dynamic Paths Plugin Core Logic
```typescript
// plugins/core/dynamic-paths/src/index.ts
export const dynamicPathsPlugin = (options: DynamicPathsOptions = {}) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    
    // Resolve business context from port
    const port = parseInt(process.env.PORT || '3000')
    const businessContext = BUSINESS_CONTEXTS[port]
    
    if (!businessContext && options.autoDetectBusiness) {
      console.warn(`⚠️ Unknown business context for port ${port}`)
    }
    
    // Set business mode if not already set
    if (!process.env.BUSINESS_MODE && businessContext) {
      process.env.BUSINESS_MODE = businessContext.name
    }
    
    // Resolve and validate paths
    const paths = resolvePaths(options)
    validatePaths(paths, options)
    
    // Create missing directories if enabled
    if (options.createMissingDirs) {
      createMissingDirectories(paths)
    }
    
    // Configure database
    config.db = configureDynamicDatabase(paths.database)
    
    // Configure uploads
    config.upload = configureDynamicUploads(paths.media, paths.uploads)
    
    // Configure server URL
    config.serverURL = generateServerURL(port, businessContext)
    
    return config
  }
```

### 9. Migration Strategy

#### From Current State
1. **Preserve Existing Data**
   - Backup current `apps/intellitrade/intellitrade.db`
   - Preserve media files in `apps/intellitrade/media/`

2. **Create Environment Configuration**
   - Generate comprehensive `.env` file
   - Configure all necessary paths and URLs

3. **Update CMS Configuration**
   - Install dynamic paths plugin
   - Update payload.config.ts to use dynamic configuration

4. **Test and Validate**
   - Verify database connectivity
   - Test media file access
   - Validate plugin loading
   - Confirm port-based identification

### 10. Benefits of This Architecture

#### For Development
- **Single CMS Codebase**: One universal CMS serves all businesses
- **Environment-Driven**: Complete configuration through environment variables
- **Port-Based Identification**: Automatic business context detection
- **Dynamic Path Resolution**: Flexible file and database locations
- **Plugin Modularity**: Business-specific features through plugins

#### For Deployment
- **Simplified Deployment**: Same CMS deployed with different environment files
- **Isolated Data**: Each business has separate database and media files
- **Scalable Architecture**: Easy to add new business units
- **Configuration Management**: Environment-based configuration control

#### For Maintenance
- **Centralized Updates**: Core functionality updated in one place
- **Business Isolation**: Changes to one business don't affect others
- **Plugin System**: Modular feature development and deployment
- **Clear Separation**: Business logic separated from core CMS functionality

### 11. Implementation Roadmap

#### Phase 1: Core Infrastructure (Week 1)
- [ ] Create dynamic paths plugin
- [ ] Enhance port config plugin
- [ ] Update universal CMS configuration
- [ ] Create environment file templates

#### Phase 2: Business App Setup (Week 2)
- [ ] Enhance setup scripts
- [ ] Create environment generation logic
- [ ] Implement path validation
- [ ] Test with IntelliTrade app

#### Phase 3: Plugin Integration (Week 3)
- [ ] Implement dynamic plugin loading
- [ ] Test business-specific plugins
- [ ] Validate KYC plugin integration
- [ ] Create plugin configuration system

#### Phase 4: Testing & Documentation (Week 4)
- [ ] Comprehensive testing across all business contexts
- [ ] Update documentation
- [ ] Create deployment guides
- [ ] Performance optimization

### 12. Next Steps

1. **Create Dynamic Paths Plugin**
   - Implement core path resolution logic
   - Add environment validation
   - Create comprehensive documentation

2. **Update Environment Configuration**
   - Generate complete `.env` file for IntelliTrade
   - Test path resolution
   - Validate database connectivity

3. **Enhance Setup Scripts**
   - Update business app creation scripts
   - Add environment file generation
   - Implement directory structure creation

4. **Test Integration**
   - Verify port-based identification
   - Test dynamic path resolution
   - Validate plugin loading

This architecture provides a robust foundation for your proposed environment variable-driven configuration while maintaining the benefits of our single CMS model.
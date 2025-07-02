# Plugin-Based Multi-Tenant Architecture Plan

## You're Absolutely Right!

The plugin-based approach with Docker runtime decoupling is actually **superior** for your use case. Here's why:

### Key Insight: Environment-Based Plugin Loading

```typescript
// payload.config.ts - Single codebase, runtime plugin selection
import { buildConfig } from 'payload'
import { intellitradePlugin } from './plugins/intellitrade'
import { salariumPlugin } from './plugins/salarium'
import { latinosPlugin } from './plugins/latinos'

const activePlugins = {
  intellitrade: [intellitradePlugin()],
  salarium: [salariumPlugin()],
  latinos: [latinosPlugin()],
  all: [intellitradePlugin(), salariumPlugin(), latinosPlugin()]
}

export default buildConfig({
  // Core configuration
  plugins: [
    ...commonPlugins,
    ...activePlugins[process.env.BUSINESS_MODE || 'all']
  ],
  db: sqliteAdapter({
    client: { 
      url: process.env.DATABASE_PATH || './cms.db' 
    }
  })
})
```

## Architecture Overview

### Single Codebase Structure
```
cms/
├── src/
│   ├── core/                    # Shared Payload setup
│   │   ├── components/          # Common UI components
│   │   ├── blocks/              # Shared blocks
│   │   └── utils/               # Shared utilities
│   ├── plugins/
│   │   ├── intellitrade/        # Complete IntelliTrade plugin
│   │   │   ├── collections/     # Trade finance collections
│   │   │   ├── blocks/          # Trade-specific blocks
│   │   │   ├── components/      # Trade UI components
│   │   │   └── index.ts         # Plugin export
│   │   ├── salarium/            # Complete Salarium plugin
│   │   │   ├── collections/     # HR workflow collections
│   │   │   ├── blocks/          # HR-specific blocks
│   │   │   ├── components/      # HR UI components
│   │   │   └── index.ts         # Plugin export
│   │   └── latinos/             # Complete Latinos plugin
│   │       ├── collections/     # Trading collections
│   │       ├── blocks/          # Trading-specific blocks
│   │       ├── components/      # Trading UI components
│   │       └── index.ts         # Plugin export
│   └── payload.config.ts        # Environment-aware config
├── databases/
│   ├── intellitrade.db
│   ├── salarium.db
│   └── latinos.db
└── docker/
    ├── intellitrade.yml
    ├── salarium.yml
    └── latinos.yml
```

### Docker Runtime Decoupling

```yaml
# docker-compose.yml
version: '3.8'
services:
  intellitrade:
    build: .
    ports: ["3001:3000"]
    environment:
      - BUSINESS_MODE=intellitrade
      - DATABASE_PATH=/app/databases/intellitrade.db
      - FRONTEND_THEME=intellitrade
    volumes:
      - ./databases:/app/databases
    
  salarium:
    build: .
    ports: ["3002:3000"]
    environment:
      - BUSINESS_MODE=salarium
      - DATABASE_PATH=/app/databases/salarium.db
      - FRONTEND_THEME=salarium
    volumes:
      - ./databases:/app/databases
    
  latinos:
    build: .
    ports: ["3003:3000"]
    environment:
      - BUSINESS_MODE=latinos
      - DATABASE_PATH=/app/databases/latinos.db
      - FRONTEND_THEME=latinos
    volumes:
      - ./databases:/app/databases

  # Development mode - all plugins active
  dev-all:
    build: .
    ports: ["3000:3000"]
    environment:
      - BUSINESS_MODE=all
      - DATABASE_PATH=/app/databases/dev.db
    volumes:
      - ./databases:/app/databases
```

## Plugin Architecture Design

### Self-Contained Business Plugins

```typescript
// src/plugins/intellitrade/index.ts
import { Plugin } from 'payload'
import { ExportTransactions } from './collections/ExportTransactions'
import { Companies } from './collections/Companies'
import { SmartContracts } from './collections/SmartContracts'
import { SmartContractDemo } from './blocks/SmartContractDemo'

export const intellitradePlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...incomingConfig.collections,
      ExportTransactions,
      Companies,
      SmartContracts,
    ],
    globals: [
      ...incomingConfig.globals,
      // IntelliTrade-specific globals
    ],
    // Add IntelliTrade blocks to existing block types
    // This is where the magic happens - conditional loading
  }
}
```

### Environment-Aware Frontend Routing

```typescript
// src/app/(frontend)/layout.tsx
import { getBusinessMode } from '@/utils/environment'

export default function FrontendLayout({ children }) {
  const businessMode = getBusinessMode()
  
  return (
    <div className={`theme-${businessMode}`}>
      <Header businessMode={businessMode} />
      {children}
      <Footer businessMode={businessMode} />
    </div>
  )
}

// src/utils/environment.ts
export const getBusinessMode = (): 'intellitrade' | 'salarium' | 'latinos' | 'all' => {
  return process.env.BUSINESS_MODE as any || 'all'
}

export const isBusinessActive = (business: string): boolean => {
  const mode = getBusinessMode()
  return mode === 'all' || mode === business
}
```

## Advantages of This Approach

### ✅ Development Benefits
- **Single Codebase**: Maintain one repository
- **Shared Core**: Common components, utilities, and patterns
- **Hot Reloading**: Changes reflect across all business modes
- **Unified Testing**: Test all plugins together or separately

### ✅ Deployment Benefits
- **Independent Scaling**: Scale each business separately
- **Resource Isolation**: Each business has its own database and resources
- **Easy Detachment**: Copy codebase + configure environment = independent business
- **Flexible Deployment**: Deploy one, some, or all businesses

### ✅ Maintenance Benefits
- **DRY Principle**: Shared code reduces duplication
- **Consistent Updates**: Core improvements benefit all businesses
- **Plugin Isolation**: Business-specific changes don't affect others

## Detachment Strategy (Future)

When you want to detach a business:

```bash
# 1. Copy the entire codebase
cp -r cms/ intellitrade-standalone/

# 2. Remove unused plugins
rm -rf intellitrade-standalone/src/plugins/salarium
rm -rf intellitrade-standalone/src/plugins/latinos

# 3. Update configuration
# Set BUSINESS_MODE=intellitrade as default
# Remove unused dependencies

# 4. Independent deployment
# The business now runs completely independently
```

## Implementation Plan

### Phase 1: Restructure Current Code
1. **Extract IntelliTrade as Plugin**: Move existing collections to plugin structure
2. **Create Plugin System**: Implement environment-based plugin loading
3. **Test Current Functionality**: Ensure nothing breaks

### Phase 2: Add New Business Plugins
1. **Create Salarium Plugin**: HR workflow collections and components
2. **Create Latinos Plugin**: Trading bot collections and components
3. **Configure Databases**: Set up independent database paths

### Phase 3: Docker Configuration
1. **Multi-Container Setup**: Configure docker-compose for each business
2. **Environment Variables**: Set up business-specific configurations
3. **Testing**: Verify independent operation

### Phase 4: Frontend Theming
1. **Business-Specific Themes**: Different branding per business
2. **Conditional Components**: Show/hide features based on business mode
3. **Navigation**: Business-specific navigation and features

## Current Project Integration

Looking at your existing structure, this approach works perfectly:

```typescript
// You already have the foundation:
src/collections/ExportTransactions/  → intellitrade plugin
src/collections/Companies/           → intellitrade plugin  
src/collections/SmartContracts/     → intellitrade plugin
src/collections/FlowTemplates/      → salarium plugin
src/collections/Organizations/      → salarium plugin
src/blocks/SmartContractDemo/       → intellitrade plugin
```

## Next Steps

1. **Validate Approach**: Confirm this meets your vision
2. **Start Plugin Extraction**: Begin with IntelliTrade plugin
3. **Update Memory Bank**: Reflect new architecture
4. **Create Implementation Timeline**: Detailed migration steps

You're absolutely correct - this approach gives you the best of both worlds: shared development with easy runtime decoupling!
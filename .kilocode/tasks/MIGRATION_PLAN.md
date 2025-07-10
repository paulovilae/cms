# Complete Migration Plan: Custom APIs → Standard Payload APIs

## Executive Summary

This document outlines the complete migration strategy to eliminate all custom API endpoints across all business units (Salarium, Latinos, IntelliTrade) and replace them with standard Payload CMS APIs. This will improve maintainability, consistency, and follow Payload CMS best practices.

## Current State Analysis

### Custom Endpoints by Business Unit

#### ✅ IntelliTrade (0 custom endpoints)
- Already using standard Payload APIs
- No migration needed

#### ⚠️ Salarium (3 custom endpoints)
- `/ai-process` - AI processing for job descriptions
- `/flow-templates` - Template management (CRUD)
- `/flow-instances` - Workflow instance management (CRUD)

#### ⚠️ Latinos (13 custom endpoints)
- `/bots` - Bot CRUD operations
- `/bots/:id/start` - Bot control
- `/bots/:id/stop` - Bot control
- `/live-data` - Real-time data
- `/system-status` - System monitoring
- `/active-trades` - Trading data
- `/recent-trades` - Trading history
- `/market-data` - Market information
- `/connection-debug` - Debug utilities
- `/retry-connection` - Connection management
- `/microservice-health` - Health checks
- `/test-connection` - Connection testing
- `/seed` - Data seeding

## Migration Strategy

### Phase 1: Remove CRUD Custom Endpoints (Week 1)

#### 1.1 Salarium CRUD Migration
**Remove Files:**
- `src/plugins/business/salarium/endpoints/flow-templates.ts`
- `src/plugins/business/salarium/endpoints/flow-instances.ts`

**Replace With:**
- Standard Payload APIs: `/api/flow-templates`, `/api/flow-instances`
- Business context via `x-business: salarium` header

#### 1.2 Latinos CRUD Migration
**Remove Files:**
- Bot CRUD endpoints in `src/plugins/business/latinos/endpoints/bots.ts`

**Replace With:**
- Standard Payload APIs: `/api/trading-bots`
- Business context via `x-business: latinos` header

### Phase 2: Convert Business Logic to Collection Hooks (Week 2)

#### 2.1 AI Processing Hook (Salarium)
**Move:** `ai-process.ts` → Collection hook on `flow-instances`
**Implementation:** Use `beforeChange` hook to trigger AI processing
**Location:** `src/plugins/shared/ai-management/hooks/aiProcessingHook.ts` ✅ Created

#### 2.2 Bot Control Hooks (Latinos)
**Convert:** `/bots/:id/start`, `/bots/:id/stop` → Collection hooks
**Implementation:** Use `beforeChange` hook to detect status changes
**Location:** `src/plugins/business/latinos/hooks/botControlHook.ts`

### Phase 3: Specialized Endpoints Strategy (Week 3)

#### 3.1 Real-time Endpoints (Latinos)
**Strategy:** Move to shared real-time plugin
**Endpoints:** `/live-data`, `/system-status`, `/active-trades`, `/recent-trades`, `/market-data`
**Justification:** These provide real-time data that doesn't fit standard CRUD patterns

#### 3.2 Debug Endpoints (Latinos)
**Strategy:** Development-only utilities
**Endpoints:** `/connection-debug`, `/retry-connection`, `/microservice-health`, `/test-connection`
**Justification:** Essential for debugging microservice integration

#### 3.3 Seed Endpoint (Latinos)
**Strategy:** Integrate with main seeding system
**Current:** `/seed` → Move to main seed infrastructure
**Location:** `src/endpoints/seed/`

### Phase 4: Frontend Migration (Week 4)

#### 4.1 Update API Calls
**Before (Custom):**
```typescript
const response = await fetch('/api/salarium/flow-templates')
const { templates } = await response.json()
```

**After (Standard Payload):**
```typescript
const response = await fetch('/api/flow-templates', {
  headers: { 'x-business': 'salarium' }
})
const { docs: templates } = await response.json()
```

#### 4.2 Update Component Logic
**Files to Update:**
- `src/plugins/business/salarium/components/JobDescriptionWorkflow.tsx`
- `src/plugins/business/latinos/components/*.tsx`

## Detailed Implementation Steps

### Step 1: Create Bot Control Hook (Latinos)

```typescript
// src/plugins/business/latinos/hooks/botControlHook.ts
import { CollectionBeforeChangeHook } from 'payload'
import { botMicroservice } from '../services/botMicroservice'

export const botControlHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only process for Latinos business context
  const businessHeader = req.headers.get?.('x-business') || (req.headers as any)['x-business']
  if (businessHeader !== 'latinos') {
    return data
  }

  // Handle bot start/stop based on status change
  if (operation === 'update' && data.status !== originalDoc?.status) {
    const microserviceId = data.microserviceId || originalDoc?.microserviceId
    
    if (microserviceId) {
      try {
        if (data.status === 'active') {
          await botMicroservice.startBot(microserviceId)
        } else if (data.status === 'stopped') {
          await botMicroservice.stopBot(microserviceId)
        }
      } catch (error) {
        console.error('Bot control error:', error)
        // Don't fail the update, just log the error
      }
    }
  }

  return data
}
```

### Step 2: Update Plugin Configurations

#### 2.1 Salarium Plugin Update
```typescript
// src/plugins/business/salarium/index.ts
import { aiProcessingHook } from '../../shared/ai-management/hooks/aiProcessingHook'

export const salariumPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      {
        ...FlowInstances,
        hooks: {
          ...FlowInstances.hooks,
          beforeChange: [
            ...(FlowInstances.hooks?.beforeChange || []),
            aiProcessingHook,
          ],
        },
      },
      // ... other collections
    ],
    // Remove custom endpoints
    // endpoints: [...] // REMOVED
  }
}
```

#### 2.2 Latinos Plugin Update
```typescript
// src/plugins/business/latinos/index.ts
import { botControlHook } from './hooks/botControlHook'

export const latinosPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      {
        ...TradingBots,
        hooks: {
          ...TradingBots.hooks,
          beforeChange: [
            ...(TradingBots.hooks?.beforeChange || []),
            botControlHook,
          ],
        },
      },
      // ... other collections
    ],
    endpoints: [
      ...(incomingConfig.endpoints || []),
      // Keep only specialized endpoints
      liveDataEndpoint,
      systemStatusEndpoint,
      activeTradesEndpoint,
      recentTradesEndpoint,
      marketDataEndpoint,
      // Debug endpoints (development only)
      ...(process.env.NODE_ENV === 'development' ? [
        connectionDebugEndpoint,
        retryConnectionEndpoint,
        microserviceHealthEndpoint,
        testConnectionEndpoint,
      ] : []),
    ],
  }
}
```

### Step 3: Frontend Component Updates

#### 3.1 Salarium JobDescriptionWorkflow Component
```typescript
// Update API calls to use standard Payload endpoints
const loadTemplate = async () => {
  try {
    const response = await fetch('/api/flow-templates?where[slug][equals]=job-description-creation', {
      headers: {
        'x-business': 'salarium',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      const template = data.docs?.[0] // Payload returns docs array
      setTemplate(template)
    }
  } catch (error) {
    console.error('Failed to load template:', error)
  }
}

const createInstance = async (instanceData: any) => {
  try {
    const response = await fetch('/api/flow-instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-business': 'salarium',
      },
      body: JSON.stringify({
        ...instanceData,
        triggerAI: true, // This will trigger the AI processing hook
      }),
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.doc // Payload returns single doc for create
    }
  } catch (error) {
    console.error('Failed to create instance:', error)
  }
}
```

#### 3.2 Latinos Bot Components
```typescript
// Update bot management to use standard Payload endpoints
const createBot = async (botData: any) => {
  try {
    const response = await fetch('/api/trading-bots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-business': 'latinos',
      },
      body: JSON.stringify(botData),
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.doc
    }
  } catch (error) {
    console.error('Failed to create bot:', error)
  }
}

const startBot = async (botId: string) => {
  try {
    // Update bot status - this will trigger the bot control hook
    const response = await fetch(`/api/trading-bots/${botId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-business': 'latinos',
      },
      body: JSON.stringify({
        status: 'active',
      }),
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.doc
    }
  } catch (error) {
    console.error('Failed to start bot:', error)
  }
}
```

## Benefits of Migration

### ✅ Consistency
- All business units use the same API patterns
- Standardized request/response formats
- Consistent error handling

### ✅ Maintainability
- Fewer custom endpoints to maintain
- Business logic centralized in collection hooks
- Easier to debug and test

### ✅ Payload CMS Best Practices
- Leverages built-in Payload features
- Better integration with admin UI
- Automatic validation and type safety

### ✅ Scalability
- Standard Payload APIs handle pagination, filtering, sorting
- Built-in caching and optimization
- Better performance for large datasets

## Migration Timeline

### Week 1: CRUD Endpoint Removal
- Remove Salarium CRUD endpoints
- Remove Latinos CRUD endpoints
- Update plugin configurations

### Week 2: Collection Hooks Implementation
- Implement AI processing hook
- Implement bot control hook
- Test hook functionality

### Week 3: Specialized Endpoints Strategy
- Move real-time endpoints to shared plugin
- Integrate seed endpoint with main system
- Keep debug endpoints for development

### Week 4: Frontend Migration
- Update all API calls in components
- Test complete workflows
- Update documentation

## Risk Mitigation

### Backward Compatibility
- Keep old endpoints temporarily with deprecation warnings
- Gradual migration with feature flags
- Comprehensive testing before removal

### Testing Strategy
- Unit tests for collection hooks
- Integration tests for API workflows
- End-to-end tests for complete user flows

### Rollback Plan
- Git branches for each migration step
- Database backups before major changes
- Quick rollback procedures documented

## Success Metrics

- ✅ Zero custom CRUD endpoints
- ✅ All business logic in collection hooks
- ✅ Frontend components using standard APIs
- ✅ No functionality regression
- ✅ Improved code maintainability score

## Conclusion

This migration will significantly improve the codebase by:
1. Eliminating 16 custom endpoints across all business units
2. Standardizing on Payload CMS best practices
3. Improving maintainability and consistency
4. Reducing technical debt

The migration is designed to be incremental and safe, with clear rollback procedures at each step.
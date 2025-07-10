# Quick Start Migration Guide

## Immediate Actions to Begin Migration

### Step 1: Start with Salarium (Simplest Case)

#### 1.1 Update JobDescriptionWorkflow Component

Replace the custom API calls in `src/plugins/business/salarium/components/JobDescriptionWorkflow.tsx`:

```typescript
// BEFORE (Custom API)
const loadTemplate = async () => {
  const response = await fetch('/api/salarium/flow-templates?slug=job-description-creation')
  const { template } = await response.json()
  setTemplate(template)
}

// AFTER (Standard Payload API)
const loadTemplate = async () => {
  const response = await fetch('/api/flow-templates?where[slug][equals]=job-description-creation', {
    headers: { 'x-business': 'salarium' }
  })
  const { docs } = await response.json()
  setTemplate(docs?.[0]) // Payload returns docs array
}
```

#### 1.2 Update Instance Management

```typescript
// BEFORE (Custom API)
const createInstance = async (data) => {
  const response = await fetch('/api/salarium/flow-instances', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const { instance } = await response.json()
  return instance
}

// AFTER (Standard Payload API)
const createInstance = async (data) => {
  const response = await fetch('/api/flow-instances', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-business': 'salarium' 
    },
    body: JSON.stringify({
      ...data,
      triggerAI: true // This will trigger the AI processing hook
    })
  })
  const { doc } = await response.json()
  return doc // Payload returns single doc for create
}
```

### Step 2: Remove Salarium Custom Endpoints

#### 2.1 Update Salarium Plugin

Edit `src/plugins/business/salarium/index.ts`:

```typescript
// BEFORE
import { aiProcessEndpoint } from './endpoints/ai-process'
import { flowTemplatesEndpoint } from './endpoints/flow-templates'
import { flowInstancesEndpoint } from './endpoints/flow-instances'

export const salariumPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [...],
    endpoints: [
      ...(incomingConfig.endpoints || []),
      aiProcessEndpoint,           // REMOVE
      flowTemplatesEndpoint,       // REMOVE
      flowInstancesEndpoint,       // REMOVE
    ],
  }
}

// AFTER
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
            aiProcessingHook, // ADD AI processing hook
          ],
        },
      },
      FlowTemplates, // Standard collection, no custom endpoints
      Organizations,
      JobFamilies,
      Departments,
    ],
    // endpoints: [...] // REMOVED - using standard Payload APIs
  }
}
```

#### 2.2 Delete Custom Endpoint Files

```bash
# Remove these files:
rm src/plugins/business/salarium/endpoints/ai-process.ts
rm src/plugins/business/salarium/endpoints/flow-templates.ts  
rm src/plugins/business/salarium/endpoints/flow-instances.ts
```

### Step 3: Test Salarium Migration

#### 3.1 Test Template Loading
```bash
# Test standard Payload API
curl -X GET "http://localhost:3003/api/flow-templates?where[slug][equals]=job-description-creation" \
  -H "x-business: salarium"
```

#### 3.2 Test Instance Creation with AI Processing
```bash
# Test standard Payload API with AI hook
curl -X POST "http://localhost:3003/api/flow-instances" \
  -H "Content-Type: application/json" \
  -H "x-business: salarium" \
  -d '{
    "title": "Test Job Description",
    "template": "TEMPLATE_ID_HERE",
    "user": "USER_ID_HERE",
    "triggerAI": true,
    "aiPrompt": "Create a job title for Software Engineer"
  }'
```

### Step 4: Start Latinos Migration

#### 4.1 Update Latinos Plugin

Edit `src/plugins/business/latinos/index.ts`:

```typescript
// Add the bot control hook
import { botControlHook, botDeletionHook } from './hooks/botControlHook'

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
            botControlHook, // ADD bot control hook
          ],
          beforeDelete: [
            ...(TradingBots.hooks?.beforeDelete || []),
            botDeletionHook, // ADD bot deletion hook
          ],
        },
      },
      TradingFormulas,
      TradingStrategies,
      TradingTrades,
      MarketData,
    ],
    endpoints: [
      ...(incomingConfig.endpoints || []),
      // Remove CRUD endpoints, keep specialized ones
      // getBotsEndpoint,        // REMOVE - use /api/trading-bots
      // createBotEndpoint,      // REMOVE - use /api/trading-bots
      // getBotEndpoint,         // REMOVE - use /api/trading-bots/:id
      // updateBotEndpoint,      // REMOVE - use /api/trading-bots/:id
      // deleteBotEndpoint,      // REMOVE - use /api/trading-bots/:id
      // startBotEndpoint,       // REMOVE - handled by hook
      // stopBotEndpoint,        // REMOVE - handled by hook
      
      // Keep specialized endpoints
      liveDataEndpoint,
      systemStatusEndpoint,
      activeTradesEndpoint,
      recentTradesEndpoint,
      marketDataEndpoint,
      testConnectionEndpoint,
      
      // Debug endpoints (development only)
      ...(process.env.NODE_ENV === 'development' ? [
        connectionDebugEndpoint,
        retryConnectionEndpoint,
        microserviceHealthEndpoint,
      ] : []),
    ],
  }
}
```

#### 4.2 Test Bot Control via Standard API

```bash
# Create a bot using standard Payload API
curl -X POST "http://localhost:3003/api/trading-bots" \
  -H "Content-Type: application/json" \
  -H "x-business: latinos" \
  -d '{
    "name": "Test Bot",
    "symbol": "AAPL",
    "exchange": "NASDAQ",
    "strategy": "momentum",
    "status": "active"
  }'

# Start a bot by updating status (triggers hook)
curl -X PATCH "http://localhost:3003/api/trading-bots/BOT_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "x-business: latinos" \
  -d '{"status": "active"}'

# Stop a bot by updating status (triggers hook)
curl -X PATCH "http://localhost:3003/api/trading-bots/BOT_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "x-business: latinos" \
  -d '{"status": "stopped"}'
```

## Verification Steps

### 1. Check Salarium Workflow
- Visit: `http://localhost:3003/salarium/job-flow?autoLogin=true`
- Create a new job description
- Verify AI processing works
- Check that templates load correctly

### 2. Check Latinos Bot Management
- Visit: `http://localhost:3003/latinos?autoLogin=true`
- Create a new trading bot
- Start/stop the bot
- Verify microservice integration works

### 3. Verify Standard APIs Work
```bash
# Test all collections use standard Payload format
curl -X GET "http://localhost:3003/api/flow-templates" -H "x-business: salarium"
curl -X GET "http://localhost:3003/api/flow-instances" -H "x-business: salarium"
curl -X GET "http://localhost:3003/api/trading-bots" -H "x-business: latinos"
curl -X GET "http://localhost:3003/api/trading-strategies" -H "x-business: latinos"
```

## Benefits You'll See Immediately

### ✅ Consistency
- All APIs follow the same Payload format
- Standardized error handling
- Consistent pagination and filtering

### ✅ Reduced Code
- Eliminate 16 custom endpoint files
- Centralize business logic in hooks
- Fewer API routes to maintain

### ✅ Better Integration
- Works seamlessly with Payload admin UI
- Automatic validation and type safety
- Built-in caching and optimization

## Next Steps

1. **Complete Salarium Migration** (1-2 days)
   - Update all frontend components
   - Remove custom endpoint files
   - Test complete workflow

2. **Complete Latinos Migration** (2-3 days)
   - Update all bot management components
   - Keep specialized real-time endpoints
   - Test microservice integration

3. **Clean Up and Documentation** (1 day)
   - Update API documentation
   - Remove unused files
   - Update component documentation

## Rollback Plan

If issues arise:

1. **Revert Plugin Changes**
   ```bash
   git checkout HEAD~1 src/plugins/business/salarium/index.ts
   git checkout HEAD~1 src/plugins/business/latinos/index.ts
   ```

2. **Restore Custom Endpoints**
   ```bash
   git checkout HEAD~1 src/plugins/business/salarium/endpoints/
   git checkout HEAD~1 src/plugins/business/latinos/endpoints/
   ```

3. **Revert Frontend Changes**
   ```bash
   git checkout HEAD~1 src/plugins/business/*/components/
   ```

This migration is designed to be safe and incremental. Start with Salarium (simpler) and then move to Latinos (more complex).
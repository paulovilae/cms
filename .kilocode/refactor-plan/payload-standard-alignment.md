# Payload Standard Alignment Refactor Plan

## Executive Summary

Convert our non-standard multi-tenant API implementation to follow standard Payload CMS patterns. This will fix all API issues while maintaining full multi-tenant functionality.

## Current Problem

We implemented business-prefixed endpoints (`/salarium/ai-process`) which don't work with Payload's standard routing system. Payload expects simple paths (`/ai-process`) and handles them through `/api/[...slug]/route.ts`.

## Solution: Standard Payload Pattern

### Phase 1: Endpoint Registration Refactor

**Files to Update:**
1. `src/plugins/business/salarium/endpoints/ai-process.ts`
2. `src/plugins/business/salarium/endpoints/flow-templates.ts`
3. `src/plugins/business/salarium/endpoints/flow-instances.ts`
4. `src/plugins/business/latinos/endpoints/bots.ts`
5. `src/plugins/business/latinos/endpoints/realtime.ts`
6. `src/plugins/business/latinos/endpoints/debug.ts`

**Changes:**
```typescript
// BEFORE (Non-standard)
export const aiProcessEndpoint = {
  path: '/salarium/ai-process',
  method: 'post',
  handler: async (req, res) => { /* ... */ }
}

// AFTER (Standard Payload)
export const aiProcessEndpoint = {
  path: '/ai-process',
  method: 'post',
  handler: async (req, res) => {
    // Add business context detection
    const business = req.headers['x-business'] || 
                    req.query.business || 
                    'salarium' // default
    
    // Existing logic with business context
    /* ... */
  }
}
```

### Phase 2: Frontend API Calls Refactor

**Files to Update:**
1. `src/plugins/business/salarium/components/JobDescriptionWorkflow.tsx` (6 API calls)
2. `src/plugins/business/latinos/components/ConnectionDebugPanel.tsx` (2 API calls)
3. `src/plugins/business/latinos/components/LiveTradingMonitor.tsx` (4 API calls)
4. `src/plugins/business/latinos/hooks/useBotData.ts` (4 API calls)
5. `src/plugins/business/latinos/hooks/useTradeData.ts` (4 API calls)

**Changes:**
```typescript
// BEFORE (Non-standard)
fetch('/api/salarium/ai-process', {
  method: 'POST',
  body: JSON.stringify(data)
})

// AFTER (Standard Payload)
fetch('/api/ai-process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-business': 'salarium'
  },
  body: JSON.stringify(data)
})
```

### Phase 3: Business Context Handling

**Create Business Context Utility:**
```typescript
// src/utilities/businessContext.ts
export const getBusinessContext = (req: any): string => {
  return req.headers['x-business'] || 
         req.query.business || 
         req.body?.business ||
         'default'
}

export const createBusinessHeaders = (business: string) => ({
  'Content-Type': 'application/json',
  'x-business': business
})
```

## Detailed Implementation Steps

### Step 1: Salarium Endpoints (Priority 1)

**1.1 Update ai-process.ts**
- Change path from `/salarium/ai-process` to `/ai-process`
- Add business context detection
- Test with Salarium job flow

**1.2 Update flow-templates.ts**
- Change path from `/salarium/flow-templates` to `/flow-templates`
- Add business filtering in handler

**1.3 Update flow-instances.ts**
- Change paths from `/salarium/flow-instances/*` to `/flow-instances/*`
- Add business context to all handlers

### Step 2: Latinos Endpoints (Priority 2)

**2.1 Update bots.ts**
- Change paths from `/latinos/bots/*` to `/bots/*`
- Add business context detection

**2.2 Update realtime.ts**
- Change paths from `/latinos/*` to `/trading/*`
- Maintain business context

**2.3 Update debug.ts**
- Change paths from `/latinos/debug/*` to `/debug/*`
- Add business context

### Step 3: Frontend Updates (Priority 3)

**3.1 Salarium Components**
- Update JobDescriptionWorkflow.tsx API calls
- Add business headers to all requests

**3.2 Latinos Components**
- Update all component API calls
- Update all hook API calls
- Add business headers

### Step 4: Testing & Validation

**4.1 API Endpoint Testing**
- Test each endpoint with curl/Postman
- Verify business context handling
- Confirm backward compatibility

**4.2 Frontend Integration Testing**
- Test Salarium job flow end-to-end
- Test Latinos trading interface
- Verify all API calls work

## Benefits of This Approach

### ✅ Standard Payload Compliance
- Follows official Payload CMS patterns
- Uses standard routing mechanisms
- Maintains plugin portability

### ✅ Multi-Tenant Functionality Preserved
- Business context handled properly
- Clean separation of concerns
- Easy to extend for new businesses

### ✅ Future-Proof Architecture
- Easy business decoupling
- Standard patterns for new developers
- Compatible with Payload updates

### ✅ Performance & Maintainability
- No middleware overhead
- Single source of truth for endpoints
- Clear business logic separation

## Risk Mitigation

### Low Risk Changes
- Endpoint path changes (internal to plugins)
- Business context utilities (new code)

### Medium Risk Changes
- Frontend API calls (systematic but extensive)
- Testing required for each change

### Rollback Plan
- Keep original endpoint registrations commented
- Test each business independently
- Gradual rollout per business

## Timeline Estimate

- **Phase 1 (Endpoints)**: 4-6 hours
- **Phase 2 (Frontend)**: 6-8 hours  
- **Phase 3 (Context)**: 2-3 hours
- **Phase 4 (Testing)**: 3-4 hours
- **Total**: 15-21 hours

## Success Criteria

1. ✅ All API endpoints return 200 instead of 404
2. ✅ Salarium job flow works end-to-end
3. ✅ Latinos trading interface works end-to-end
4. ✅ Business context properly isolated
5. ✅ No breaking changes to existing functionality
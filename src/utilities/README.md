# Business Context Utility

The Business Context Utility provides standardized multi-tenant business detection and handling across the entire platform. This utility is essential for maintaining proper business isolation in our multi-tenant architecture.

## Overview

This utility enables:

- **Consistent business detection** across all endpoints and components
- **Standardized API patterns** following Payload CMS conventions
- **Multi-tenant isolation** without breaking standard routing
- **Frontend/backend integration** with unified business context handling

## Quick Start

```typescript
import { getBusinessMode, businessFetch, getCurrentBusiness } from '@/utilities/businessContext'

// In endpoint handlers
const business = getBusinessMode(req)

// In frontend components
const response = await businessFetch('/api/ai-process', 'salarium', {
  method: 'POST',
  body: JSON.stringify(data),
})
```

## Core Functions

### `getBusinessContext(req)`

Extracts complete business context from request with validation and source tracking.

```typescript
const context = getBusinessContext(req)
// Returns: { business: 'salarium', isValid: true, source: 'header' }
```

### `getBusinessMode(req)`

Simplified version that returns only the business mode string.

```typescript
const business = getBusinessMode(req) // 'salarium'
```

### `businessFetch(url, business, options)`

Frontend helper for making business-aware API calls.

```typescript
const response = await businessFetch('/api/ai-process', 'salarium', {
  method: 'POST',
  body: JSON.stringify({ data: 'example' }),
})
```

### `createBusinessHeaders(business, additionalHeaders)`

Creates standardized headers for API requests.

```typescript
const headers = createBusinessHeaders('salarium', {
  Authorization: 'Bearer token',
})
// Returns: { 'Content-Type': 'application/json', 'x-business': 'salarium', 'Authorization': 'Bearer token' }
```

## Business Detection Priority

The utility detects business context in this order:

1. **Headers** (highest priority): `x-business: salarium`
2. **Query parameters**: `?business=salarium`
3. **Body parameters**: `{ business: 'salarium' }`
4. **Environment fallback**: `BUSINESS_MODE` or `'default'`

## Supported Business Modes

- `intellitrade` - Blockchain-Powered Trade Finance
- `salarium` - AI-Powered HR Solutions
- `latinos` - AI-Powered Trading Platform
- `capacita` - AI-Powered Training Platform
- `default` - Multi-Business Platform

## Usage Patterns

### Endpoint Handlers

```typescript
// Standard pattern
export const aiProcessEndpoint = {
  path: '/ai-process',
  method: 'post',
  handler: async (req, res) => {
    const business = getBusinessMode(req)

    if (business === 'salarium') {
      // Salarium-specific logic
    }

    return res.json({ business, result: 'processed' })
  },
}

// Using middleware helper
export const flowTemplatesEndpoint = {
  path: '/flow-templates',
  method: 'get',
  handler: withBusinessContext(async (business, req, res) => {
    // Business context automatically extracted
    return res.json({ business, templates: [] })
  }),
}
```

### Frontend Components

```typescript
import { getCurrentBusiness, businessFetch } from '@/utilities/businessContext'

export function MyComponent() {
  const business = getCurrentBusiness()

  const handleSubmit = async (data) => {
    const response = await businessFetch('/api/ai-process', business, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Success:', result)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### React Hooks

```typescript
import { useBusinessContext } from '@/utilities/businessContext'

export function BusinessAwareComponent() {
  const { business, config, isEnabled } = useBusinessContext()

  if (!isEnabled) {
    return <div>Business not available</div>
  }

  return (
    <div style={{ color: config.color }}>
      Welcome to {config.name}
    </div>
  )
}
```

## Migration from Legacy Patterns

### Before (Non-standard)

```typescript
// Endpoint
export const endpoint = {
  path: '/salarium/ai-process', // ❌ Business-prefixed path
  handler: async (req, res) => {
    /* ... */
  },
}

// Frontend
fetch('/api/salarium/ai-process', {
  /* ... */
}) // ❌ Business in URL
```

### After (Standard Payload)

```typescript
// Endpoint
export const endpoint = {
  path: '/ai-process', // ✅ Standard path
  handler: async (req, res) => {
    const business = getBusinessMode(req) // ✅ Business from context
    /* ... */
  },
}

// Frontend
businessFetch('/api/ai-process', 'salarium', {
  /* ... */
}) // ✅ Business in headers
```

## Environment Configuration

```bash
# Single business mode
BUSINESS_MODE=salarium

# All businesses (development)
BUSINESS_MODE=all

# Frontend business mode
NEXT_PUBLIC_BUSINESS_MODE=salarium
```

## Validation and Error Handling

```typescript
import { isValidBusinessMode, getBusinessContext } from '@/utilities/businessContext'

const context = getBusinessContext(req)

if (!context.isValid) {
  return res.status(400).json({
    error: 'Invalid business mode',
    received: context.business,
    valid: ['intellitrade', 'salarium', 'latinos', 'capacita'],
  })
}
```

## Best Practices

1. **Always use business context** in endpoint handlers
2. **Use businessFetch** for frontend API calls
3. **Validate business modes** when accepting user input
4. **Follow standard Payload paths** (no business prefixes)
5. **Use headers for business context** (not URL paths)

## Integration with Existing Code

This utility is designed to work with:

- **Payload CMS endpoints** registered in plugins
- **Next.js API routes** in `/api/[...slug]/route.ts`
- **React components** and hooks
- **Business plugin architecture**

## Examples

See `src/utilities/examples/businessContextUsage.ts` for comprehensive usage examples.

## TypeScript Support

Full TypeScript support with proper types:

```typescript
import type { BusinessMode, BusinessContext } from '@/utilities/businessContext'

const business: BusinessMode = 'salarium'
const context: BusinessContext = getBusinessContext(req)
```

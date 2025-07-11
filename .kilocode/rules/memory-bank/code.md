# Project Code Details

## Technology Stack

- **Frontend**: Next.js 15.3.0, React 19.1.0, TailwindCSS
- **CMS**: Payload CMS 3.43.0
- **Database**: SQLite via `@payloadcms/db-sqlite`
- **Runtime**: Node.js (^18.20.2 or >=20.9.0)
- **UI Components**: shadcn/ui, Radix UI primitives
- **Development**: TypeScript, ESLint, Prettier, pnpm

## Environment Setup

### Prerequisites
- Node.js ^18.20.2 or >=20.9.0
- pnpm (^9 or ^10)
- Docker for multi-tenant deployment

### Core Scripts
```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm generate:types  # Generate TypeScript types
node seed-script.js  # Database seeding
```

### Docker Commands
```bash
docker-compose up salarium     # Run Salarium on port 3005
docker-compose up intellitrade # Run IntelliTrade on port 3004
docker-compose up latinos      # Run Latinos on port 3003
docker-compose up dev-all      # Run all on port 3006
docker-compose ps              # Check running containers
docker logs cms-salarium-1 --tail 20 -f  # View logs
```

## Application Structure

- **Admin Panel**: `/src/app/(payload)` - Unified admin interface
- **Frontend Websites**: `/src/app/(frontend)` - Business-specific frontends
- **Plugin System**: `/src/plugins/` - Self-contained business logic modules

## Docker Deployment
- **Container Names**: `cms-salarium-1`, `cms-intellitrade-1`, `cms-latinos-1`, `cms-dev-all-1`
- **Shared Database**: `databases/multi-tenant.db` (SQLite)
- **Environment Variables**: `BUSINESS_MODE`, `DATABASE_URI`, `NODE_ENV`

## Multi-Tenant Plugin System
```typescript
// Runtime plugin selection based on BUSINESS_MODE
const activePlugins = {
  intellitrade: [intellitradePlugin()],
  salarium: [salariumPlugin()],
  latinos: [latinosPlugin()],
  capacita: [capacitaPlugin()],
  all: [/* all plugins for development */]
}
```

## Business Integration Details

### IntelliTrade
- Smart contract deployment and blockchain transaction monitoring
- Oracle verification with photos, GPS, timestamps

### Salarium
- AI-powered job description generation
- Market data integration for compensation analysis

### Latinos
- Python FastAPI service for real-time trading
- WebSocket connections for live data streaming

## API Development Patterns

### Payload 3.x Web API Pattern

Payload CMS 3.x uses Web API patterns for endpoints rather than Express:

```typescript
// Old Express-style endpoint (not compatible with Payload 3.x)
export const searchEndpoint = {
  path: '/search',
  method: 'post',
  handler: async (req, res) => {
    // Do something
    res.status(200).json({ success: true })
  }
}

// New Web API style endpoint (Payload 3.x compatible)
export const searchEndpoint = {
  path: '/search',
  method: 'post',
  handler: async (req) => {
    // Body must be parsed with await req.json()
    const data = await req.json()
    
    // Return Response object, not res.json()
    return Response.json({ success: true }, { status: 200 })
  }
}
```

Key differences:
- Request body must be parsed with `await req.json()`
- Responses use `Response.json()` not `res.json()`
- Status codes are passed as options to `Response.json()`
- No explicit `res` parameter in handler function

### Business Context Validation

API endpoints should always validate business context:

```typescript
import { getBusinessContext, isValidBusinessMode } from '@/utilities/businessContext'

export const myEndpoint = {
  path: '/my-endpoint',  // No business prefix
  method: 'post',
  handler: async (req) => {
    const businessContext = getBusinessContext(req)
    
    // Validate business context
    if (!isValidBusinessMode(businessContext.business, ['salarium'])) {
      return Response.json({
        success: false,
        error: `Endpoint not available for business: ${businessContext.business}`,
      }, { status: 400 })
    }
    
    // Endpoint logic here
  }
}
```

## Critical Workflows

### Database Seeding
- ALWAYS use `node seed-script.js` (never direct API calls)
- Server must be running with test user (`test@test.com`/`Test12345%`)

### Type Generation
- Run `pnpm generate:types` after schema changes

### Multi-Tenant Testing
- Test business isolation with proper headers
- Use auto-login URLs for development:
  - `http://localhost:3005/salarium/job-flow?autoLogin=true`
  - `http://localhost:3004/intellitrade?autoLogin=true`
  - `http://localhost:3003/latinos?autoLogin=true`

### Quick Access URLs
- **Salarium**: `http://localhost:3005/salarium/job-flow?autoLogin=true`
- **IntelliTrade**: `http://localhost:3004/intellitrade?autoLogin=true`
- **Latinos**: `http://localhost:3003/latinos?autoLogin=true`

### Default Test Credentials
- **Email**: `test@test.com`
- **Password**: `Test12345%`
- **Role**: Admin with full access

## Troubleshooting

- **Type Errors**: Regenerate types with `pnpm generate:types`
- **Database Issues**: Check SQLite file permissions
- **Connection Refused**: Verify correct port and running server
- **API Errors**: Check business context headers
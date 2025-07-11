# Development Guide

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

## Payload CMS Patterns

### Collection Development
```typescript
export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
  ],
}
```

### Field Types
- **Text/Rich Text**: text, textarea, richText
- **Data Types**: number, email, select, date
- **Relationships**: relationship, upload
- **Organization**: array, blocks, group, tabs

### Hooks and Lifecycle
```typescript
const beforeChangeHook = ({ data, req }) => {
  data.lastModified = new Date()
  if (req.user) data.lastModifiedBy = req.user.id
  return data
}

export const MyCollection = {
  hooks: { beforeChange: [beforeChangeHook] }
}
```

### Access Control
```typescript
export const MyCollection = {
  access: {
    read: () => true,  // Public read
    create: ({ req }) => !!req.user,  // Auth required
    update: ({ req }) => req.user?.role === 'admin'  // Admin only
  }
}
```

## Plugin Architecture

### Plugin Types
- **Core**: Always active (redirects, SEO, forms, search)
- **Shared**: Cross-business (AI management, gamification)
- **Business-Specific**: Business functionality

### Plugin Structure
```typescript
export const myPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [...incomingConfig.collections, ...myCollections],
    endpoints: [...incomingConfig.endpoints, ...myEndpoints]
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

### API Development
- Use Web API patterns (not Express) for Payload 3.x
- Always use `await req.json()` for body parsing
- Return `Response.json(data, { status: code })`
- Always validate business context

## Troubleshooting

- **Type Errors**: Regenerate types with `pnpm generate:types`
- **Database Issues**: Check SQLite file permissions
- **Connection Refused**: Verify correct port and running server
- **API Errors**: Check business context headers
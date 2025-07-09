# Shared Schema Architecture Plan

## Problem Analysis
- Docker-compose.yml configured for separate databases but only multi-tenant.db exists
- Payload schema validation warns about "extra" collections when business services see collections from other businesses
- Need shared schema evolution while maintaining security validations

## Solution: Unified Schema with Business-Aware Loading

### 1. Revert to Shared Database Configuration
All services use `multi-tenant.db` but load different plugin combinations based on business mode.

### 2. Schema Evolution Strategy
- **Single Source of Truth**: All collection schemas defined in shared codebase
- **Progressive Loading**: Each service loads only relevant collections
- **Schema Synchronization**: When any business adds collections, all services get the updated schema

### 3. Implementation Plan

#### Phase 1: Fix Database Configuration
```yaml
# docker-compose.yml - All services use shared database
DATABASE_PATH=file:/app/databases/multi-tenant.db
```

#### Phase 2: Smart Collection Loading
```typescript
// payload.config.ts - Load all collections but filter by business context
const getAllCollections = () => {
  const businessMode = getBusinessMode()
  
  return [
    // Core collections (always loaded)
    ...coreCollections,
    
    // Business collections (conditionally loaded based on mode)
    ...(businessMode === 'intellitrade' || businessMode === 'all' ? intellitradeCollections : []),
    ...(businessMode === 'salarium' || businessMode === 'all' ? salariumCollections : []),
    ...(businessMode === 'latinos' || businessMode === 'all' ? latinosCollections : []),
    
    // Shared collections (always loaded)
    ...sharedCollections
  ]
}
```

#### Phase 3: Business-Scoped Data Access
```typescript
// Add business context to collections that need it
const addBusinessScope = (collection) => ({
  ...collection,
  access: {
    read: ({ req }) => {
      const business = getBusinessMode()
      return business === 'all' ? {} : { business: { equals: business } }
    }
  }
})
```

### 4. Benefits
- ✅ Shared schema evolution
- ✅ Plugin sharing across services
- ✅ Maintains security validations
- ✅ Single database for consistency
- ✅ Business isolation through access control

### 5. Next Steps
1. Revert docker-compose.yml to shared database
2. Implement smart collection loading
3. Add business scoping to relevant collections
4. Test schema synchronization
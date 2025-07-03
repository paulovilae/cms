# Seeding System Architecture

## Overview

The project uses a unified seeding system that populates all collections with demo data. The seeding infrastructure is organized to handle multiple business plugins while maintaining a single entry point.

## Seeding Structure

### Main Seeding Infrastructure
- **Location**: `src/endpoints/seed/`
- **Entry Point**: `src/endpoints/seed/index.ts` - Main seed function
- **API Route**: `src/app/(frontend)/next/seed/route.ts` - HTTP endpoint
- **Script**: `seed-script.js` - Standalone seeding script
- **Helpers**: `src/endpoints/seed/seed-helpers.js` - Phased seeding functions

### Business Plugin Seeds
Each business plugin has its own seed data:
- **IntelliTrade**: Integrated directly in main seed (companies, routes, transactions, smart contracts)
- **Salarium**: `src/endpoints/seed/salarium-seed.ts` - HR workflow data
- **Latinos**: `src/plugins/business/latinos/seed/` - Trading bot system data (integrated into main seed)

## Seeding Workflow

### 1. Main Seed Function (`src/endpoints/seed/index.ts`)
```typescript
export const seed = async ({ payload, req }) => {
  // 1. Clear existing data
  // 2. Seed media and basic content
  // 3. Seed custom collections (team, features, testimonials, pricing)
  // 4. Seed business data (companies, routes, transactions, contracts)
  // 5. Seed AI providers
  // 6. Seed Salarium collections
  // 7. Seed pages and globals
}
```

### 2. Phased Seeding (via seed-helpers.js)
- **clear**: Clear all collections and globals
- **basic**: Seed users and categories
- **media**: Seed media files
- **custom**: Seed custom collections (team, features, etc.)
- **business**: Seed business data (companies, transactions, etc.)

### 3. Business Plugin Integration
- **Salarium**: Called directly from main seed via `seedSalariumCollections()`
- **Latinos**: Integrated via `seedLatinosData()` from plugin directory

## Latinos Integration Status

### Current State
- ✅ **Comprehensive seed data exists** in `src/plugins/business/latinos/seed/`
- ✅ **Individual seed functions** for each collection (bots, strategies, formulas, trades, market data)
- ✅ **Main seed function** `seedLatinosData()` in `src/plugins/business/latinos/seed/index.ts`
- ✅ **Fully integrated** into main seeding infrastructure

### Integration Completed
1. ✅ **Import Latinos seed** in main seed file
2. ✅ **Add Latinos collections** to collection lists
3. ✅ **Call Latinos seed** in business data phase
4. ✅ **Update seed helpers** to include Latinos collections in clearing
5. ✅ **Update documentation** to reflect Latinos integration

## Collection Lists

### Standard Collections
```typescript
const standardCollections = [
  'team-members', 'testimonials', 'features', 'pricing-plans',
  'export-transactions', 'companies', 'pages', 'posts', 'categories',
  'forms', 'form-submissions', 'search', 'media'
]
```

### Custom Collections
```typescript
const customCollections = [
  'routes', 'smart-contracts', 'ai-providers',
  'flow-templates', 'flow-instances', 'organizations',
  'job-families', 'departments'
]
```

### Latinos Collections (Integrated)
```typescript
const latinosCollections = [
  'trading-bots', 'trading-strategies', 'trading-formulas',
  'trading-trades', 'market-data'
]
```

## Environment-Based Seeding

The seeding should respect the `BUSINESS_MODE` environment variable:
- **intellitrade**: Seed IntelliTrade collections only
- **salarium**: Seed Salarium collections only  
- **latinos**: Seed Latinos collections only
- **all**: Seed all business collections (default for development)

## API Endpoints

### Main Seed Endpoint
- **URL**: `POST /next/seed`
- **Authentication**: Required (user must be logged in)
- **Parameters**:
  - `mode=test`: Test mode (minimal seeding)
  - `phase=<phase>`: Phased seeding (clear, basic, media, custom, business)

### Business-Specific Endpoints
- **Latinos**: `POST /api/latinos/seed` (exists but separate)
- **Should be unified**: All seeding through main endpoint

## Seed Script Usage

### Standalone Script
```bash
# Run the main seed script
node seed-script.js

# Windows batch file
seed.bat
```

### Prerequisites
1. **Development server running**: `npm run dev` or `pnpm dev`
2. **Test user exists**: Email `test@test.com`, password `test`
3. **Environment variables**: Optional `SEED_EMAIL` and `SEED_PASSWORD`

## Best Practices

### 1. Single Source of Truth
- All seeding should go through the main seed infrastructure
- Business plugins provide seed data, main system orchestrates
- Avoid duplicate seeding endpoints

### 2. Dependency Management
- Seed collections in dependency order
- Handle foreign key relationships properly
- Clear dependent collections first when cleaning

### 3. Error Handling
- Individual creation failures shouldn't stop entire process
- Provide detailed logging for debugging
- Return meaningful error messages

### 4. Environment Awareness
- Respect business mode settings
- Only seed relevant collections for current mode
- Provide flexibility for development vs production

## Troubleshooting

### Common Issues
1. **Authentication errors**: Ensure test user exists
2. **Connection refused**: Ensure dev server is running
3. **Foreign key errors**: Check seeding order
4. **Duplicate data**: Clear collections before reseeding

### Debug Mode
- Use `mode=test` parameter for minimal seeding
- Check individual phases with `phase=<phase>` parameter
- Review logs for specific error details

## Future Improvements

1. **Unified API**: Single endpoint for all business seeding
2. **Selective Seeding**: Ability to seed specific collections only
3. **Data Validation**: Validate seed data before insertion
4. **Performance**: Optimize seeding for large datasets
5. **Rollback**: Ability to rollback failed seeding operations
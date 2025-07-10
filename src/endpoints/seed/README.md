# Seed System Architecture

This directory contains the modular seed system for the multi-tenant CMS platform. The original monolithic `index.ts` file has been split into focused modules for better maintainability and organization.

## Directory Structure

```
src/endpoints/seed/
├── index.ts                    # Main orchestrator
├── core/                       # Core seeding functionality
│   ├── cleanup.ts             # Database cleanup logic
│   ├── media-seeding.ts       # Media files and user seeding
│   ├── posts-seeding.ts       # Blog posts and contact form seeding
│   └── globals-seeding.ts     # Header and footer navigation seeding
├── business/                   # Business-specific seeding
│   ├── business-data.ts       # Team members, features, testimonials, pricing
│   └── pages-seeding.ts       # Business pages (home, contact, business-specific)
├── export-transactions/       # Export transaction data (modular)
│   ├── index.ts              # Transaction orchestrator
│   ├── transactions/         # Individual transaction data files
│   │   ├── don-hugo-peanut.ts
│   │   ├── coffee-export.ts
│   │   ├── soy-export.ts
│   │   └── olive-oil-export.ts
│   ├── utils/                # Transaction utilities
│   │   ├── transaction-builder.ts
│   │   └── verification-steps.ts
│   └── README.md             # Transaction system documentation
└── README.md                 # This file
```

## Splitting Strategy

The original `index.ts` file (1,200+ lines) was split using the following strategy:

### 1. Core System Modules
- **cleanup.ts**: Database cleanup and initialization logic
- **media-seeding.ts**: Media file uploads and user creation
- **posts-seeding.ts**: Blog posts and contact form creation
- **globals-seeding.ts**: Header and footer navigation setup

### 2. Business Logic Modules
- **business-data.ts**: Cross-business data (team members, features, testimonials, pricing plans)
- **pages-seeding.ts**: Business-specific pages and content

### 3. Transaction Data Modules
- **export-transactions/**: Modular transaction data system
  - Individual transaction files for each export scenario
  - Shared utilities for transaction building and verification
  - Centralized orchestration through index file

## Benefits of Modular Structure

### Maintainability
- **Single Responsibility**: Each module has a clear, focused purpose
- **Easy Navigation**: Developers can quickly find relevant seeding logic
- **Reduced Complexity**: Smaller files are easier to understand and modify

### Reusability
- **Shared Utilities**: Common transaction building logic is reusable
- **Business Isolation**: Business-specific seeding can be run independently
- **Modular Testing**: Individual modules can be tested in isolation

### Scalability
- **Easy Extension**: New transaction types can be added as separate files
- **Business Growth**: New business units can add their own seeding modules
- **Performance**: Only relevant modules need to be loaded/executed

## Usage

### Full Database Seeding
```typescript
import { seed } from './index'

// Seeds entire database with all modules
await seed({ payload, req })
```

### Individual Module Seeding
```typescript
import { seedMediaAndUsers } from './core/media-seeding'
import { seedBusinessData } from './business/business-data'

// Seed only specific modules
const { demoAuthor, image1Doc } = await seedMediaAndUsers(payload)
await seedBusinessData(payload, image1Doc)
```

### Transaction-Specific Seeding
```typescript
import { seedExportTransactions } from './export-transactions'

// Seed only transaction data
await seedExportTransactions(payload)
```

## File Size Reduction

| Original File | Size | Split Into | New Sizes |
|---------------|------|------------|-----------|
| `index.ts` | 1,200+ lines | 8 modules | 50-300 lines each |
| `export-transactions.ts` | 800+ lines | 7 modules | 50-150 lines each |

## Development Guidelines

### Adding New Seed Data
1. **Identify the appropriate module** based on data type
2. **Follow existing patterns** for data structure and error handling
3. **Update the main orchestrator** if new dependencies are introduced
4. **Document any new utilities** in the relevant README files

### Creating New Modules
1. **Follow single responsibility principle** - one clear purpose per module
2. **Export clear, typed functions** with descriptive names
3. **Include proper error handling** and logging
4. **Add comprehensive documentation** in module comments

### Testing Modules
1. **Test individual modules** in isolation when possible
2. **Verify integration** through the main orchestrator
3. **Check data relationships** between modules
4. **Validate business logic** specific to each module

## Migration Notes

This modular structure maintains full backward compatibility with the original seeding system. The main `index.ts` file orchestrates all modules in the same order as the original implementation, ensuring identical seeding results.

### Breaking Changes
- None - all existing seeding workflows continue to work unchanged

### New Capabilities
- Individual module execution for targeted seeding
- Easier testing and debugging of specific seeding logic
- Simplified addition of new business-specific seeding data

## Future Enhancements

### Planned Improvements
1. **Parallel Seeding**: Independent modules could be seeded in parallel
2. **Conditional Seeding**: Environment-based module selection
3. **Incremental Updates**: Update only changed data instead of full re-seeding
4. **Validation Layer**: Schema validation for seeded data

### Business Expansion
As new business units are added to the platform:
1. Create new modules in `business/` directory
2. Add business-specific transaction data in `export-transactions/transactions/`
3. Update main orchestrator to include new modules
4. Document business-specific seeding requirements

This modular architecture provides a solid foundation for the growing multi-tenant platform while maintaining clean, maintainable code that follows the Clean Minimal Code Policy.
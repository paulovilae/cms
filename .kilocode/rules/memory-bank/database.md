# Database Architecture and Management

## Overview

The project uses SQLite as the database adapter via `@payloadcms/db-sqlite`. The database structure supports a multi-tenant plugin-based architecture with collections for different business domains.

## Database Location

- **Development Database**: `databases/dev.db`
- **Database Directory**: `databases/` (created automatically)
- **Legacy Reference**: `cms.db` (no longer used)

## Database Configuration

### Payload Configuration
```typescript
// src/payload.config.ts
db: sqliteAdapter({
  client: {
    url: process.env.DATABASE_URI || path.resolve(dirname, './databases/dev.db'),
  },
})
```

### Environment Variables
- `DATABASE_URI`: Optional override for database location
- `BUSINESS_MODE`: Determines which collections are active
- Default: `./databases/dev.db` relative to project root

## Collection Architecture

### Core Collections
Standard Payload CMS collections present in all business modes:
- `users` - User authentication and management
- `media` - File and image uploads
- `pages` - Website pages with flexible layouts
- `posts` - Blog posts and news articles
- `categories` - Content categorization
- `forms` - Dynamic form definitions
- `form-submissions` - Form submission data
- `search` - Search index and results

### Business-Specific Collections

#### IntelliTrade Collections
Trade finance platform collections:
- `companies` - Business entities (exporters/importers)
- `export-transactions` - Trade finance transactions
- `routes` - Shipping routes and logistics
- `smart-contracts` - Blockchain contract management

#### Salarium Collections
HR document flow system collections:
- `organizations` - Company organizational structure
- `departments` - Department management
- `job-families` - Job classification system
- `flow-templates` - Document workflow templates
- `flow-instances` - Active workflow instances

#### Latinos Collections
Trading bot platform collections:
- `trading-strategies` - Trading strategy definitions
- `trading-bots` - Bot configuration and management
- `trading-formulas` - Algorithm definitions
- `trading-trades` - Trade execution records
- `market-data` - Real-time market information

### Shared Collections
Collections used across multiple business domains:
- `team-members` - Team and staff information
- `testimonials` - Customer testimonials
- `features` - Product feature descriptions
- `pricing-plans` - Pricing and subscription plans
- `ai-providers` - AI service provider configurations

## Database Seeding

### Seeding Infrastructure
- **Main Script**: `seed-script.js` - Standalone authentication-aware seeding
- **API Endpoint**: `/next/seed` - HTTP endpoint for seeding operations
- **Seed Functions**: `src/endpoints/seed/` - Modular seeding logic

### Seeding Process
1. **Authentication**: Script logs in with test credentials
2. **Data Clearing**: Removes existing data (optional)
3. **Collection Seeding**: Populates collections with demo data
4. **Relationship Building**: Establishes foreign key relationships

### Seed Data Volumes
Current seed data includes:
- **TradingStrategies**: 6 records
- **TradingBots**: 8 records
- **TradingFormulas**: 8 records
- **TradingTrades**: 17 records
- **MarketData**: 12 records
- **Companies**: Multiple exporters and importers
- **ExportTransactions**: Sample trade finance transactions
- **Routes**: Shipping route definitions
- **SmartContracts**: Contract templates and instances

## Database Schema Patterns

### Common Field Patterns
All collections include standard Payload fields:
- `id` - Primary key (auto-generated)
- `createdAt` - Creation timestamp
- `updatedAt` - Last modification timestamp
- `_status` - Publication status (draft/published)

### Relationship Patterns
- **One-to-Many**: Companies → ExportTransactions
- **Many-to-Many**: TradingBots ↔ TradingStrategies
- **Self-Referencing**: Categories → Parent Categories
- **Polymorphic**: Media relationships across collections

### Versioning System
Payload CMS provides built-in versioning:
- Draft versions for content editing
- Published versions for public access
- Version history and rollback capabilities

## Database Operations

### Development Operations
```bash
# Run seeding (requires dev server)
node seed-script.js

# Check database tables
sqlite3 databases/dev.db ".tables"

# Query specific collection
sqlite3 databases/dev.db "SELECT COUNT(*) FROM trading_bots;"
```

### Production Considerations
- **Backup Strategy**: Regular SQLite database backups
- **Migration Handling**: Payload CMS handles schema migrations
- **Performance**: Consider PostgreSQL for high-traffic production
- **Scaling**: SQLite suitable for small to medium applications

## Multi-Tenant Database Strategy

### Current Approach
- **Single Database**: All business collections in one database
- **Plugin-Based Filtering**: Collections loaded based on `BUSINESS_MODE`
- **Shared Infrastructure**: Common collections used across businesses

### Future Separation Strategy
When businesses need independent databases:
1. **Copy Database**: Create separate database files
2. **Environment Configuration**: Set unique `DATABASE_URI` per business
3. **Data Migration**: Export/import relevant collections
4. **Plugin Isolation**: Remove unused business plugins

## Database Maintenance

### Regular Tasks
- **Seeding**: Refresh demo data for development
- **Cleanup**: Remove test data before production
- **Backup**: Regular database backups
- **Monitoring**: Track database size and performance

### Troubleshooting
- **Connection Issues**: Verify database file permissions
- **Seeding Failures**: Check authentication and server status
- **Schema Conflicts**: Run type generation after changes
- **Performance**: Monitor query performance and indexing

## Security Considerations

### Access Control
- **Authentication Required**: All database operations require valid user session
- **Role-Based Access**: Collections have granular access controls
- **Field-Level Security**: Sensitive fields restricted by user role

### Data Protection
- **Environment Variables**: Database credentials in environment files
- **File Permissions**: Restrict database file access
- **Backup Security**: Encrypt database backups
- **Audit Logging**: Track data modifications

## Integration Points

### Microservice Integration
- **Latinos Trading Bot**: Connects to external Python FastAPI service
- **Blockchain Integration**: Smart contract deployment and monitoring
- **AI Services**: Integration with AI provider APIs

### External Systems
- **File Storage**: Media files stored in filesystem or cloud storage
- **Search Engine**: Full-text search via Payload search plugin
- **Analytics**: Data export for business intelligence tools

This database architecture provides a solid foundation for the multi-tenant plugin-based CMS while maintaining flexibility for future growth and business separation.
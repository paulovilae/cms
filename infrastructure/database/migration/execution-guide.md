# Job Flow Cascade Migration Execution Guide

This guide provides step-by-step instructions for executing the Salarium Job Flow to Generic Job Flow Cascade migration.

## Prerequisites

Before running the migration, ensure you have the following:

1. Node.js (version 18.20.2 or higher)
2. Access to the SQLite database file
3. All migration script files in the `infrastructure/database/migration/` directory
4. Sufficient disk space for database backups

## Setup

1. Install required dependencies:

```bash
pnpm install sqlite3 yaml mkdirp
```

2. Ensure the application is not running during migration
3. Create a backup of the database:

```bash
cp ./databases/multi-tenant.db ./databases/backups/pre-migration-manual.db
```

## Execution Steps

### 1. Prepare Environment

```bash
# Navigate to project root
cd /path/to/project

# Set NODE_ENV to development for verbose logging
export NODE_ENV=development
```

### 2. Create Migration Directory (if needed)

```bash
mkdir -p ./logs
```

### 3. Run Migration Script

The migration will be executed in phases as defined in the migration configuration:

```bash
# Create an executable script from the migration specification
node infrastructure/scripts/migration/salarium-to-generic.js
```

### 4. Verify Migration

After the migration completes, run validation queries to ensure data integrity:

```bash
# Check template counts
sqlite3 ./databases/multi-tenant.db "SELECT COUNT(*) FROM 'flow-templates' WHERE businessUnit='salarium'"

# Check document counts
sqlite3 ./databases/multi-tenant.db "SELECT COUNT(*) FROM 'flow-documents' WHERE businessUnit='salarium'"

# Check section counts
sqlite3 ./databases/multi-tenant.db "SELECT COUNT(*) FROM 'document-sections' WHERE documentId IN (SELECT id FROM 'flow-documents' WHERE businessUnit='salarium')"
```

### 5. Test Application

1. Start the application:

```bash
NODE_OPTIONS=--no-deprecation npx next dev -H 0.0.0.0 -p 3002
```

2. Open a browser and navigate to:
   - `http://localhost:3002/salarium/job-flow?autoLogin=true`
   
3. Verify that:
   - Existing documents load correctly
   - Rich text editor displays content properly
   - Document sections can be edited
   - New documents can be created from templates

## Rollback Procedure

If the migration fails or needs to be rolled back:

1. Stop the application
2. Restore the database backup:

```bash
cp ./databases/backups/pre-migration-manual.db ./databases/multi-tenant.db
```

3. Restart the application

## Migration Phases

The migration executes in the following phases:

### Phase 1: Schema Update

This phase creates the new flow-templates collection and enhances existing collections with new fields using SQL scripts:

- `createFlowTemplatesCollection.sql` - Creates the new flow-templates table
- `enhanceFlowDocumentsCollection.sql` - Adds new fields to flow-documents table
- `enhanceDocumentSectionsCollection.sql` - Adds new fields to document-sections table

### Phase 2: Template Migration

This phase:
- Extracts all templates from Salarium
- Converts step definitions to section templates
- Creates new generic flow-templates entries

### Phase 3: Instance Migration

This phase:
- Converts flow-instances to flow-documents
- Converts stepResponses to document-sections
- Creates workflow step sequences
- Updates relationships

### Phase 4: Generation History Update

This phase updates the generation history records to link to the new document sections.

### Phase 5: Data Validation

This phase runs validation queries to ensure the migration was successful.

## Troubleshooting

### Common Issues

1. **SQL Error: table already exists**
   - Solution: Drop the existing table before recreating it or use IF NOT EXISTS clause

2. **Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed**
   - Solution: Ensure relationships exist before inserting records with foreign keys

3. **Out of disk space error**
   - Solution: Free up disk space or use a smaller backup method

### Logs

Migration logs are written to `./logs/migration-report-{timestamp}.json`. Check this file for detailed information about the migration process.

## Post-Migration Tasks

1. Update any API clients that directly interact with the old flow-instances collection
2. Update UI components that expect the old data structure
3. Test with various template types and document configurations
4. Monitor system performance with the new schema

## Support

If you encounter issues during migration, contact the database engineering team for assistance.
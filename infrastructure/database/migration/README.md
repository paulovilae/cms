# Salarium to Generic Job Flow Cascade Migration

This directory contains all necessary files for migrating from Salarium-specific job flow to the new generic Job Flow Cascade model.

## Migration Overview

The migration transforms the Salarium business-specific job flow system into a generic, reusable Job Flow Cascade system that can be used across all business units. This includes:

1. Enhancing existing database schemas
2. Creating a new FlowTemplates collection
3. Migrating templates and instances to the new format
4. Preserving all relationships and history
5. Validating the migration results

## Directory Contents

- **SQL Scripts**:
  - [`createFlowTemplatesCollection.sql`](./createFlowTemplatesCollection.sql) - Creates the new templates collection
  - [`enhanceFlowDocumentsCollection.sql`](./enhanceFlowDocumentsCollection.sql) - Adds new fields to documents
  - [`enhanceDocumentSectionsCollection.sql`](./enhanceDocumentSectionsCollection.sql) - Adds new fields to sections

- **Configuration Files**:
  - [`schema-mapping.json`](./schema-mapping.json) - Defines field mappings between schemas
  - [`migration-config.yaml`](./migration-config.yaml) - Configuration for the migration process

- **Documentation**:
  - [`job-flow-cascade-migration.md`](../migration-plans/job-flow-cascade-migration.md) - Comprehensive migration plan
  - [`migration-script-specification.md`](./migration-script-specification.md) - Implementation specification
  - [`data-transformation-guide.md`](./data-transformation-guide.md) - Field mapping and transformations
  - [`execution-guide.md`](./execution-guide.md) - Step-by-step execution instructions

## Schema Enhancements

### Flow Documents Enhancements

New fields added to the `flow-documents` collection:
- `template` relationship - Links to template used
- `organization` relationship - Links to organization
- `workflow` group - Tracks progress through workflow steps
- `aiConfig` group - Stores AI generation preferences

### Document Sections Enhancements

New fields added to the `document-sections` collection:
- Enhanced `type` field with more options
- `inputConfig` group - Configuration for user input
- `aiConfig` group - AI generation settings
- `interactionHistory` array - Tracks user-AI interactions

### New Flow Templates Collection

New collection for document templates with:
- Template metadata (title, description, etc.)
- Section templates with configurations
- Workflow and AI generation settings

## Migration Process

The migration follows these phases:

1. **Schema Update** - Execute SQL scripts to update database schema
2. **Template Migration** - Convert Salarium templates to generic templates
3. **Instance Migration** - Convert instances to documents and sections
4. **Generation History Update** - Update relationships in history records
5. **Data Validation** - Verify migration results

## Execution Instructions

For detailed execution instructions, see the [Execution Guide](./execution-guide.md).

## Data Transformation Details

For detailed information on data transformations and field mappings, see the [Data Transformation Guide](./data-transformation-guide.md).

## Implementation Specification

For the detailed implementation specification of the migration script, see the [Migration Script Specification](./migration-script-specification.md).

## Success Criteria

The migration is considered successful when:

1. All Salarium templates are converted to generic templates
2. All instances are converted to documents with sections
3. All rich text content is properly formatted
4. All relationships are maintained
5. The system works with the migrated data
6. No data loss occurs during migration

## Rollback Procedure

In case of migration failure, a rollback procedure is defined in the execution guide. The system will restore from the backup created before migration.

## Next Steps After Migration

1. Update API clients to use the new schema
2. Update UI components to work with the new format
3. Implement the adapter layer for backward compatibility
4. Extend the generic model to other business units

## Support

For questions or issues related to this migration, contact the database engineering team.
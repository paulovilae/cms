# Document Structure Migration Checklist

This checklist helps track progress as we implement the new document structure defined in the [Document Structure Migration Plan](document-structure-migration-plan.md).

## Directory Structure Creation

### Base Directories
- [x] `docs/` - Main documentation directory
- [x] `docs/README.md` - Main documentation README
- [x] `docs/general/` - General CMS documentation
- [x] `docs/latinos/` - Latinos Trading Platform documentation
- [x] `docs/salarium/` - Salarium HR Platform documentation
- [x] `docs/intellitrade/` - IntelliTrade Finance Platform documentation
- [x] `docs/capacita/` - Capacita Training Platform documentation

### General Documentation Structure
- [x] `docs/general/architecture/` - System-wide architecture documentation
- [x] `docs/general/architecture/vision/` - Vision documents
- [x] `docs/general/coordination/` - Agent coordination documentation
- [x] `docs/general/analytics/` - General analytics reports
- [ ] `docs/general/architecture/diagrams/` - Architecture diagrams
- [ ] `docs/general/development/` - Development guidelines
- [ ] `docs/general/operations/` - Operational documentation
- [ ] `docs/general/api/` - API documentation

### Business-Specific Documentation Structure
- [x] `docs/latinos/architecture/` - Latinos architecture documentation
- [x] `docs/latinos/architecture/vision/` - Latinos vision documents
- [x] `docs/latinos/analytics/` - Latinos analytics reports
- [x] `docs/salarium/architecture/vision/` - Salarium vision documents
- [x] `docs/salarium/analytics/` - Salarium analytics reports
- [x] `docs/intellitrade/architecture/vision/` - IntelliTrade vision documents
- [x] `docs/intellitrade/analytics/` - IntelliTrade analytics reports
- [x] `docs/capacita/architecture/vision/` - Capacita vision documents
- [x] `docs/capacita/analytics/` - Capacita analytics reports
- [ ] `docs/latinos/architecture/diagrams/` - Latinos architecture diagrams
- [ ] `docs/latinos/features/` - Latinos feature documentation
- [ ] `docs/latinos/user-guides/` - Latinos user guides
- [ ] `docs/latinos/api/` - Latinos API documentation

## Document Migration

### General Documents
- [x] Document structure migration plan
- [x] Profile updates documentation
- [x] Migration checklist (this document)
- [x] Agent handover rules (moved to coordination/)
- [ ] Move other general architecture documents
- [ ] Move general development documents
- [ ] Move general operations documents
- [ ] Move general API documentation

### Latinos Documents
- [x] Move Latinos Bot Trading vision document
- [ ] Move other Latinos architecture documents
- [ ] Move Latinos feature documentation
- [ ] Move Latinos user guides
- [ ] Move Latinos API documentation

### Salarium Documents
- [ ] Move Salarium architecture documents
- [ ] Move Salarium feature documentation
- [ ] Move Salarium user guides
- [ ] Move Salarium API documentation

### IntelliTrade Documents
- [ ] Move IntelliTrade architecture documents
- [ ] Move IntelliTrade feature documentation
- [ ] Move IntelliTrade user guides
- [ ] Move IntelliTrade API documentation

### Capacita Documents
- [ ] Move Capacita architecture documents
- [ ] Move Capacita feature documentation
- [ ] Move Capacita user guides
- [ ] Move Capacita API documentation

## README Files

### General README Files
- [x] `docs/README.md` - Main documentation README
- [x] `docs/general/architecture/vision/README.md` - General vision documents README
- [x] `docs/general/coordination/README.md` - Agent coordination README
- [x] `docs/general/analytics/README.md` - General analytics README
- [ ] `docs/general/development/README.md`
- [ ] `docs/general/operations/README.md`
- [ ] `docs/general/api/README.md`

### Business-Specific README Files
- [x] `docs/latinos/README.md` - Latinos documentation README
- [x] `docs/latinos/architecture/README.md` - Latinos architecture README
- [x] `docs/latinos/architecture/vision/README.md` - Latinos vision README
- [x] `docs/salarium/README.md` - Salarium documentation README
- [x] `docs/salarium/architecture/vision/README.md` - Salarium vision README
- [x] `docs/intellitrade/README.md` - IntelliTrade documentation README
- [x] `docs/intellitrade/architecture/vision/README.md` - IntelliTrade vision README
- [x] `docs/capacita/README.md` - Capacita documentation README
- [x] `docs/capacita/architecture/vision/README.md` - Capacita vision README
- [x] `docs/latinos/analytics/README.md` - Latinos analytics README
- [x] `docs/salarium/analytics/README.md` - Salarium analytics README
- [x] `docs/intellitrade/analytics/README.md` - IntelliTrade analytics README
- [x] `docs/capacita/analytics/README.md` - Capacita analytics README
- [ ] `docs/latinos/features/README.md`
- [ ] `docs/latinos/user-guides/README.md`
- [ ] `docs/latinos/api/README.md`

## Profile Updates

### Initial Profile Location Updates
- [x] Update Visionary profile (requires Code mode)
- [x] Update UX Expert profile (requires Code mode)
- [x] Update Documentor profile (requires Code mode)
- [x] Update Orchestrator profile (requires Code mode)
- [x] Update Architect profile (already updated)
- [x] Update Analyst profile (requires Code mode)
- [ ] Update other profiles as needed (requires Code mode)

### Profile Instruction Improvements
- [x] Create agent profile improvements document
- [ ] Update Code agent instructions with structured approach
- [ ] Update Debug agent instructions with improved workflow
- [ ] Update Architect agent instructions with risk assessment
- [ ] Update Orchestrator agent with dependency management
- [ ] Create common pitfalls and best practices document

## Testing

- [ ] Test Visionary can create vision documents in new locations
- [ ] Test Architect can access all documentation directories
- [ ] Test UX Expert can access appropriate directories
- [ ] Test Documentor can access all documentation directories
- [ ] Test Analyst can access appropriate directories

## Cross-Reference Updates

- [ ] Search for and update all references to old document paths
- [ ] Update links in existing documentation to point to new locations
- [ ] Update any external references to documentation

## Cleanup

- [ ] Archive old `reports/` directory
- [ ] Remove any redundant or outdated documentation
- [ ] Verify all documentation is properly linked and accessible

## Communication

- [ ] Notify team of new document structure
- [ ] Provide guidance on where to find migrated documentation
- [ ] Update team on new documentation creation process
- [ ] Update documentation guidelines in appropriate locations

## Status

Current Status: **Phase 5 In Progress - Agent Profile Enhancements**

### Completed
- ✅ Created complete directory structure for all business units
- ✅ Created comprehensive README files for navigation
- ✅ Updated Visionary profile with new document paths
- ✅ Updated UX Expert profile with new document paths
- ✅ Updated Documentor profile with new document paths
- ✅ Updated Orchestrator profile with new document paths
- ✅ Updated Analyst profile with new document paths and analytics directories
- ✅ Verified Architect profile is already updated
- ✅ Migrated Latinos Bot Trading vision document to new location
- ✅ Migrated agent handover rules to coordination directory
- ✅ Created coordination documentation structure
- ✅ Created analytics documentation structure for all business units
- ✅ Created business-specific asset directories with README files
- ✅ Updated main assets README.md with new organization
- ✅ Created asset documentation in docs/general/assets/
- ✅ Created infrastructure documentation in docs/general/infrastructure/
- ✅ Created detailed Docker setup documentation
- ✅ Created localization documentation in docs/general/localization/
- ✅ Created scripts documentation in docs/general/scripts/
- ✅ Created testing documentation in docs/general/testing/
- ✅ Created agent profile improvements documentation

### Next Steps
- Create additional directory structures as needed (features, user-guides, api)
- Migrate remaining documents from reports/ directory
- Test all agent profiles with new directory structure
- Implement Content and Assets migration plan (Phase 3)
- Document operational directories (Phase 4)

## Phase 3: Content and Assets Reorganization

### Content Directory
- [ ] Audit content in the `content/` directory
- [ ] Migrate documentation content to appropriate `docs/` locations
- [ ] Migrate marketing content to appropriate `assets/` locations
- [ ] Update references to old content paths
- [ ] Remove `content/` directory after migration
- [ ] Update affected agent profiles (Content Creator)

### Assets Reorganization
- [x] Create business-specific subdirectories in `assets/`
  - [x] `assets/general/` - Cross-platform assets
  - [x] `assets/latinos/` - Latinos-specific assets
  - [x] `assets/salarium/` - Salarium-specific assets
  - [x] `assets/intellitrade/` - IntelliTrade-specific assets
  - [x] `assets/capacita/` - Capacita-specific assets
- [x] Update assets README.md to reflect new organization
- [ ] Update Graphic Designer profile for new structure
- [ ] Migrate existing assets to business-specific locations
- [ ] Update UX Expert profile for new asset paths

### Documentation for Assets
- [x] Create `docs/general/assets/` documentation
- [ ] Document asset standards and guidelines
- [ ] Document asset migration process

## Phase 4: Operational Directory Documentation

Based on our [Additional Directories Analysis](additional-directories-analysis.md), we will:

### Create Documentation Structure for Operational Code
- [x] Create `docs/general/infrastructure/` directory
  - [x] Create README explaining infrastructure documentation
  - [x] Create documentation referencing `/infrastructure` code
  - [x] Create detailed Docker setup documentation
- [x] Create `docs/general/localization/` directory
  - [x] Create README explaining localization process
  - [x] Create documentation referencing `/locales` files
- [x] Create `docs/general/scripts/` directory
  - [x] Create README explaining scripts documentation
  - [x] Create documentation referencing `/scripts` code
- [x] Create `docs/general/testing/` directory
  - [x] Create README explaining testing documentation
  - [x] Create documentation referencing `/tests` code

### Business-Specific Operational Documentation
- [ ] Create business-specific infrastructure documentation
- [ ] `docs/latinos/infrastructure/`
- [ ] `docs/salarium/infrastructure/`
- [ ] `docs/intellitrade/infrastructure/`
- [ ] `docs/capacita/infrastructure/`
- [ ] Create business-specific localization documentation
- [ ] `docs/latinos/localization/`
- [ ] `docs/salarium/localization/`
- [ ] `docs/intellitrade/localization/`
- [ ] `docs/capacita/localization/`

### Consider Operational Directory Reorganization (Optional)
- [ ] Evaluate reorganizing `/scripts` with business-specific structure
- [ ] Evaluate reorganizing `/tests` with business-specific structure
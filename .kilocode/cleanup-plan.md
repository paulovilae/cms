# Root Directory Cleanup Plan

## Overview
This plan organizes the root directory by:
1. Moving test/development files to `.kilocode/tests/`
2. Creating a proper `docs/` folder for valuable documentation (accessible via GitHub)
3. Keeping task-specific files in `.kilocode/tasks/`
4. Deleting obsolete files that are no longer needed

## Files to Move to `.kilocode/tests/`

### Test Scripts and Development Tools
```bash
# Move these files from root to .kilocode/tests/
mv create-admin.js .kilocode/tests/
mv debug-seed.js .kilocode/tests/
mv phased-seed.js .kilocode/tests/
mv cms.db.backup .kilocode/tests/
```

**Rationale:** These are development/testing utilities:
- `create-admin.js` - Admin user creation script for testing
- `debug-seed.js` - Debug version of seeding script
- `phased-seed.js` - Phased seeding test script
- `cms.db.backup` - Database backup with test data

## Files to Move to `docs/` (New Documentation Structure)

### Valuable Documentation for GitHub Access
```bash
# Create docs directory and move valuable documentation
mkdir -p docs/setup
mkdir -p docs/architecture
mkdir -p docs/user-guide
mkdir -p docs/developer-guide

# Move valuable documentation
mv seed-README.md docs/developer-guide/seeding-system.md
mv DOCKER_SETUP.md docs/setup/docker-deployment.md
mv MULTI_TENANT_IMPLEMENTATION.md docs/architecture/multi-tenant-architecture.md
```

**Rationale:** These are valuable documentation files that should be:
- Accessible via GitHub
- Part of the project's permanent documentation
- Available to both users and developers

## Files to Delete (Obsolete)

### Task-Specific Files No Longer Needed
```bash
# Delete obsolete files
rm LATINOS_SEED_INTEGRATION.md  # Obsolete - integration is complete
rm winscp-setup-guide.md        # Task-specific, can be deleted
```

**Rationale:** 
- `LATINOS_SEED_INTEGRATION.md` - Was only needed during integration, now obsolete
- `winscp-setup-guide.md` - Specific setup task, not permanent documentation

## Proposed Documentation Structure

### Create `docs/` Directory (GitHub Accessible)
```
docs/
├── README.md                           # Documentation index
├── setup/
│   ├── installation.md                # Project setup guide
│   ├── docker-deployment.md           # Docker setup (from DOCKER_SETUP.md)
│   └── environment-configuration.md   # Environment variables guide
├── architecture/
│   ├── overview.md                     # System architecture overview
│   ├── multi-tenant-architecture.md   # Multi-tenant guide (from MULTI_TENANT_IMPLEMENTATION.md)
│   ├── plugin-system.md              # Plugin architecture
│   └── database-design.md            # Database schema and relationships
├── user-guide/
│   ├── getting-started.md             # User onboarding
│   ├── content-management.md          # CMS usage guide
│   ├── intellitrade-guide.md          # IntelliTrade user guide
│   ├── salarium-guide.md              # Salarium user guide
│   └── latinos-guide.md               # Latinos trading bot guide
└── developer-guide/
    ├── development-setup.md           # Developer environment setup
    ├── seeding-system.md              # Seeding guide (from seed-README.md)
    ├── api-reference.md               # API documentation
    ├── plugin-development.md          # How to create plugins
    ├── testing.md                     # Testing guidelines
    └── deployment.md                  # Deployment procedures
```

## Files to Keep in Root (Operational Necessities)

### Core Configuration Files
- `package.json` - Project dependencies and scripts
- `package-lock.json` - npm dependency lock file
- `pnpm-lock.yaml` - pnpm dependency lock file
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `next-env.d.ts` - Next.js type definitions
- `tailwind.config.mjs` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `components.json` - shadcn/ui components configuration
- `next-sitemap.config.cjs` - Sitemap generation configuration
- `redirects.js` - URL redirects configuration

### Docker and Deployment
- `Dockerfile` - Container definition for deployment
- `docker-compose.yml` - Multi-container orchestration
- `docker-scripts.sh` - Docker utility scripts

### Essential Operational Scripts
- `seed-script.js` - Main database seeding script (used in production)
- `seed.bat` - Windows batch file for seeding

### Project Documentation
- `README.md` - Main project documentation and setup instructions

### Data and Source Directories
- `databases/` - SQLite database files
- `public/` - Static assets (favicon, robots.txt, media)
- `src/` - Application source code

## Benefits of This Organization

### Structured Documentation
- **GitHub Accessible**: `docs/` folder is visible and searchable on GitHub
- **User vs Developer**: Clear separation between user guides and developer documentation
- **Organized by Purpose**: Setup, architecture, user guides, and developer guides
- **Permanent Documentation**: Valuable information preserved and accessible

### Cleaner Root Directory
- Removes clutter while preserving valuable documentation
- Makes it easier to identify operational vs. development files
- Improves project navigation and maintenance

### Better File Organization
- Test files grouped in `.kilocode/tests/`
- Task-specific files remain in `.kilocode/tasks/`
- Valuable documentation in accessible `docs/` folder
- Only essential operational files in root

## Implementation Steps

1. **Create documentation structure:**
   ```bash
   mkdir -p docs/setup docs/architecture docs/user-guide docs/developer-guide
   mkdir -p .kilocode/tests
   ```

2. **Move and organize documentation:**
   ```bash
   # Move valuable documentation to docs/
   mv seed-README.md docs/developer-guide/seeding-system.md
   mv DOCKER_SETUP.md docs/setup/docker-deployment.md
   mv MULTI_TENANT_IMPLEMENTATION.md docs/architecture/multi-tenant-architecture.md
   ```

3. **Move test files:**
   ```bash
   mv create-admin.js .kilocode/tests/
   mv debug-seed.js .kilocode/tests/
   mv phased-seed.js .kilocode/tests/
   mv cms.db.backup .kilocode/tests/
   ```

4. **Delete obsolete files:**
   ```bash
   rm LATINOS_SEED_INTEGRATION.md  # Integration complete, no longer needed
   rm winscp-setup-guide.md        # Task-specific, can be deleted
   ```

5. **Create documentation index:**
   - Create `docs/README.md` with navigation to all documentation
   - Update main `README.md` to reference the docs folder

6. **Update references:**
   - Update any file references in README.md
   - Update package.json scripts if needed
   - Test that all functionality still works

## Future Documentation Integration

### In-App Documentation Access
Consider implementing:
- Documentation viewer component in the CMS admin
- Context-sensitive help system
- User guide integration in the frontend
- API documentation endpoint

### Documentation Maintenance
- Keep documentation in sync with code changes
- Regular documentation reviews
- User feedback integration
- Version-specific documentation

## Post-Cleanup Root Directory Structure

After cleanup, the root should contain only:
```
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.js
├── next-env.d.ts
├── tailwind.config.mjs
├── postcss.config.js
├── eslint.config.mjs
├── components.json
├── next-sitemap.config.cjs
├── redirects.js
├── Dockerfile
├── docker-compose.yml
├── docker-scripts.sh
├── seed-script.js
├── seed.bat
├── README.md
├── .kilocode/
├── docs/                    # NEW: Structured documentation
├── databases/
├── public/
└── src/
```

This creates a much cleaner and more organized project structure with proper documentation accessibility.
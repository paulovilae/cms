# Task: Organize Scripts Directory

**Priority**: MEDIUM
**Created by**: Code
**Created on**: 2025-07-10
**Status**: COMPLETED
**Assigned to**: Code

## Objective
Organize the scripts in the root directory by moving them to appropriate subdirectories in the infrastructure/scripts folder.

## Context
The root directory was cluttered with various script files, making it difficult to distinguish between critical configuration files and utility scripts. This task aimed to clean up the root directory and establish a clear organization for scripts.

## Actions Taken
1. Created a structured scripts directory at `infrastructure/scripts/` with the following subdirectories:
   - `database/` - For database-related scripts
   - `system/` - For system configuration and maintenance scripts
   - `utilities/` - For development and workflow utility scripts
   - `legacy/` - For temporary storage of older scripts that need review

2. Moved scripts to appropriate directories:
   - Moved `seed-script.js` to `infrastructure/scripts/database/`
   - Created a symlink in the root directory to maintain backward compatibility
   - Moved system scripts (docker-scripts.sh, restore_rules.sh, filter_rules.sh) to `infrastructure/scripts/system/`
   - Moved utility scripts (fix_profiles.sh, cleanup_profiles.sh, etc.) to `infrastructure/scripts/utilities/`

3. Created documentation:
   - Added a README.md to the scripts directory explaining the organization and best practices

4. Identified files to keep in root:
   - `next.config.js` - Next.js configuration
   - `postcss.config.js` - PostCSS configuration
   - `redirects.js` - Next.js redirects configuration
   - `seed-script.js` - Symbolic link to the actual script in infrastructure/scripts/database/

## Guidelines for Future Scripts
1. **Do not add new scripts to the root directory**
2. **Always place scripts in the appropriate category folder:**
   - Database operations → `infrastructure/scripts/database/`
   - System configuration → `infrastructure/scripts/system/`
   - Development utilities → `infrastructure/scripts/utilities/`
   - Legacy/temporary scripts → `infrastructure/scripts/legacy/`

3. **Documentation requirements:**
   - All scripts should include a header comment explaining:
     - Purpose
     - Usage instructions
     - Required environment
     - Any potential side effects

4. **Naming conventions:**
   - Use kebab-case for script names (e.g., `seed-database.js`)
   - Be descriptive and clear about the script's purpose

## Critical Scripts
- **infrastructure/scripts/database/seed-script.js** (symlink in root as `seed-script.js`)
  - Purpose: Seeds the database with initial data
  - Usage: `node seed-script.js` or `node infrastructure/scripts/database/seed-script.js`
  - Requires: Development server running with test credentials

- **infrastructure/scripts/system/docker-scripts.sh**
  - Purpose: Docker container management
  - Usage: Provides functions for Docker container operations

## Updates
- 2025-07-10 - Task created
- 2025-07-10 - Created directory structure
- 2025-07-10 - Moved scripts to appropriate directories
- 2025-07-10 - Created symlink for seed-script.js
- 2025-07-10 - Added documentation
- 2025-07-10 - Task completed

## Related Tasks
- Fix agent profile structure task
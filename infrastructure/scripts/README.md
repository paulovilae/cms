# Scripts Directory

This directory contains various scripts used for development, deployment, and maintenance of the CMS platform.

## Directory Structure

- **database/** - Scripts related to database operations
  - Seeding, migrations, backups, data fixes

- **system/** - System configuration and maintenance scripts
  - Docker, environment setup, deployment tools

- **utilities/** - Utility scripts for development and workflow
  - Profile management, code generation, cleanup tools

- **legacy/** - Temporary location for older scripts that need review
  - One-time fixes and scripts that may be deprecated

## Critical Scripts

- **database/seed-script.js** - Official database seeding script
  - Usage: `node infrastructure/scripts/database/seed-script.js`
  - Requires: Development server running with test credentials

## Best Practices

1. **Documentation**: All scripts should include a header comment explaining:
   - Purpose
   - Usage instructions
   - Required environment
   - Any potential side effects

2. **Categorization**: Place scripts in the appropriate category folder
   - Avoid placing scripts in the root directory

3. **Naming**: Use clear, descriptive names with appropriate extensions
   - Use kebab-case for script names (e.g., `seed-database.js`)

4. **Testing**: Include instructions for testing the script works correctly

5. **Error Handling**: All scripts should include proper error handling and logging
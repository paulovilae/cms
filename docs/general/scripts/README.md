# Scripts Documentation

This directory contains documentation about the scripts used across the multi-tenant CMS platform.

## Purpose

This documentation helps:
- Understand the purpose and usage of various operational scripts
- Navigate the script organization and conventions
- Document script dependencies and execution requirements
- Track script-related decisions and changes

## Scripts Organization

The platform's scripts are located in the `/scripts` directory:

```
scripts/
├── general/         # (proposed organization) Platform-wide scripts
└── [business]/      # (proposed organization) Business-specific scripts
```

## Documentation Scope

This directory provides documentation **about** the scripts, while the actual script code resides in the `/scripts` directory. This separation maintains a clear distinction between operational code and its documentation.

### Topics Covered

- **Database Scripts**: Documentation for database management and migration scripts
- **Deployment Scripts**: Information about deployment automation
- **Maintenance Scripts**: Documentation for system maintenance procedures
- **Development Utilities**: Documentation for developer workflow scripts
- **Testing Scripts**: Information about automated testing scripts

## Script Usage Guidelines

### Key Guidelines
- Always document script purpose, inputs, outputs, and side effects
- Maintain backward compatibility when updating scripts
- Include error handling and logging in all scripts
- Follow consistent naming conventions
- Test scripts in isolated environments before production use

## Critical Scripts

### Database Seeding
- **Script**: `seed-script.js`
- **Purpose**: Initializes the database with test data
- **Usage**: `node seed-script.js`
- **Prerequisites**: Server must be running with test user

### Type Generation
- **Script**: `generate:types`
- **Purpose**: Generates TypeScript types from schema definitions
- **Usage**: `pnpm generate:types`
- **When to Use**: After schema changes

## Business-Specific Scripts

Each business unit may have specialized scripts:

- **Latinos**: Trading bot configuration and execution scripts
- **Salarium**: HR workflow and job description generation scripts
- **IntelliTrade**: Blockchain and smart contract deployment scripts
- **Capacita**: Training content generation and evaluation scripts

## Related Resources

- [Scripts Directory](../../../scripts/) - Actual script code
- [Infrastructure Scripts](../../../infrastructure/scripts/) - Infrastructure-specific scripts
- [Development Guide](../development/) - Development workflow documentation
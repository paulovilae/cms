# Multi-Tenant Business Platform - Technical Overview

## Core Technologies
- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express, Payload CMS
- **Database**: SQLite (initial), MongoDB (production)
- **Authentication**: JWT, OAuth
- **Styling**: CSS Modules, Tailwind CSS
- **Build Tools**: Webpack, Babel
- **Testing**: Jest, React Testing Library

## Development Setup
1. **Environment Requirements**:
   - Node.js v18+
   - npm v9+
   - SQLite3 (initial development)
   - Docker (optional for local development)

2. **Getting Started**:
   ```bash
   npm install
   npm run dev
   ```

3. **Configuration**:
   - Environment variables stored in `.env`
   - Payload CMS configuration in `src/payload.config.ts`

## Technical Constraints
- Must support multiple business units with shared functionality
- Plugins must be versioned and published to private npm
- All business logic must be encapsulated in plugins
- Strict separation between core, shared, and business-specific code

## Key Dependencies
- `payload` - Headless CMS
- `react` - UI library
- `next` - React framework
- `typescript` - Type checking
- `sqlite3` - Initial database driver
- `jsonwebtoken` - Authentication

## Tool Usage Patterns
- **Development**: Hot reloading with Next.js
- **Testing**: Unit tests with Jest, integration tests with React Testing Library
- **Linting**: ESLint with custom rules
- **Formatting**: Prettier
- **Version Control**: Git with conventional commits
- **CI/CD**: GitHub Actions
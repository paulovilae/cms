# System Architecture

## Technology Stack

- **Frontend**: Next.js 15.3.0, React 19.1.0, TailwindCSS
- **CMS**: Payload CMS 3.43.0
- **Database**: SQLite via `@payloadcms/db-sqlite`
- **Runtime**: Node.js (^18.20.2 or >=20.9.0)
- **UI Components**: shadcn/ui, Radix UI primitives
- **Development**: TypeScript, ESLint, Prettier, pnpm
- **Rich Text Editing**: Slate.js with custom error boundaries

## Multi-Tenant Architecture

### Plugin-Based System
```typescript
// Runtime plugin selection based on BUSINESS_MODE
const activePlugins = {
  intellitrade: [intellitradePlugin()],
  salarium: [salariumPlugin()],
  latinos: [latinosPlugin()],
  capacita: [capacitaPlugin()],
  all: [/* all plugins for development */]
}
```

### Application Structure
- **Admin Panel**: `/src/app/(payload)` - Unified admin interface
- **Frontend Websites**: `/src/app/(frontend)` - Business-specific frontends
- **Plugin System**: `/src/plugins/` - Self-contained business logic modules

### Docker Deployment
- **Container Names**: `cms-salarium-1`, `cms-intellitrade-1`, `cms-latinos-1`, `cms-dev-all-1`
- **Shared Database**: `databases/multi-tenant.db` (SQLite)
- **Environment Variables**: `BUSINESS_MODE`, `DATABASE_URI`, `NODE_ENV`

## Core Components

### Content Management
- **Collections**: Data models in `src/collections/`
- **Block System**: Modular content in `src/blocks/`
- **Hero Sections**: Page headers in `src/heros/`
- **Rich Text Editor**: Advanced document editing in `src/plugins/job-flow-cascade/`

### Data Architecture
- **Multi-Tenant Model**: Shared SQLite database with business filtering
- **Collection Types**:
  - **Core**: users, media, pages, posts, categories
  - **Business-Specific**: Per-business collections
  - **Shared**: team-members, testimonials, ai-providers

### Document Workflow Architecture
- **Document Model**: Core data structure with sections and metadata
- **Section Processing**: API endpoints for section creation and updates
- **Rich Text Storage**: Serialized JSON format for rich text content
- **State Management**: React Context API for document and editor state

## Business Integrations

### IntelliTrade
- Smart contract deployment and blockchain transaction monitoring
- Oracle verification with photos, GPS, timestamps

### Salarium
- AI-powered job description generation
- Market data integration for compensation analysis
- Job Flow Cascade with rich text document editing
- HR analytics and reporting dashboards

### Latinos
- Python FastAPI service for real-time trading
- WebSocket connections for live data streaming

## Performance & Security

### Database Strategy
- SQLite for development and small deployments
- Consider PostgreSQL for high-traffic production

### Security
- JWT-based authentication with role-based access
- Field-level security for sensitive data
- Error boundaries for component isolation
# Technology Stack and Development Setup

## Core Technologies

### Framework and CMS
- **Next.js 15.3.0**: Frontend framework with App Router architecture
- **Payload CMS 3.43.0**: Headless content management system
- **TypeScript**: Static typing for JavaScript
- **Node.js**: JavaScript runtime (version ^18.20.2 or >=20.9.0)

### Database
- **SQLite**: Via `@payloadcms/db-sqlite` adapter
- Versioning system for content drafts and publishing workflow

### Frontend
- **React 19.1.0**: UI library
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Component library based on Radix UI
- **Geist Font**: Typography (Sans and Mono variants)

## Plugins and Extensions

### Payload CMS Plugins
- **@payloadcms/plugin-form-builder**: For creating interactive forms
- **@payloadcms/plugin-nested-docs**: Hierarchical document relationships (used for Categories)
- **@payloadcms/plugin-redirects**: URL redirection management
- **@payloadcms/plugin-search**: Search functionality
- **@payloadcms/plugin-seo**: SEO optimization
- **@payloadcms/richtext-lexical**: Rich text editor with block support
- **@payloadcms/admin-bar**: Admin interface for content editing
- **@payloadcms/live-preview-react**: Live preview functionality

### UI Components
- **@radix-ui**: Accessible UI primitives
- **class-variance-authority**: For component variants
- **clsx** and **tailwind-merge**: Utility for conditional class names
- **lucide-react**: Icon library
- **prism-react-renderer**: Code syntax highlighting

## Development Environment

### Package Management
- **pnpm**: Fast, disk space efficient package manager (version ^9 or ^10)
- **node_modules** dependencies

### Build and Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **cross-env**: Cross-platform environment variables

### Scripts
- `pnpm dev`: Development server
- `pnpm build`: Production build
- `pnpm start`: Run production server
- `pnpm lint`: Run linting
- `pnpm generate:types`: Generate TypeScript types from Payload collections

## Deployment and Production

### Deployment Options
- **Payload Cloud**: One-click hosting solution
- **Vercel**: Next.js-optimized hosting with optional DB adapters
- **Self-hosting**: Traditional deployment to VPS or container platforms

### Production Considerations
- Environment variables for database connections and secrets
- Static site generation with dynamic routes
- On-demand revalidation for content updates
- Jobs and scheduled publishing

## Development Workflow

### Content Modeling
1. Define collections in `/src/collections`
2. Create block types in `/src/blocks`
3. Configure globals in appropriate directories

### Frontend Development
1. Create or modify pages in `/src/app/(frontend)`
2. Develop components in `/src/components`
3. Style with TailwindCSS utilities

### Testing and Previewing
- Live preview for real-time content editing
- Draft mode for reviewing before publishing
- Cross-device testing with breakpoint configurations
# Multi-Tenant Business Platform

A plugin-based content management system built on Payload CMS and Next.js, designed to serve multiple independent business products through a single codebase with runtime decoupling.

## Business Products

### 🏦 IntelliTrade - Trade Finance Platform
A fin-tech trade-finance platform that leverages blockchain technology and smart contracts to digitalize and streamline international trade finance, specifically focused on Latin American exporters and global buyers.

### 👥 Salarium - HR Document Flow Platform
A human resources management system focused on document workflows, employee management, and organizational processes.

### 📈 Latinos - Trading Stocks Bot Platform
An automated trading platform with bot functionality for stock market operations, featuring real-time trading execution and performance analytics.

## Quick Start

### Prerequisites
- Node.js (^18.20.2 or >=20.9.0)
- pnpm package manager

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd cms
   cp .env.example .env
   pnpm install
   ```

2. **Configure Environment**
   Edit `.env` file with your configuration:
   ```bash
   # Business Mode (intellitrade, salarium, latinos, or all)
   BUSINESS_MODE=all
   
   # Server Configuration
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   PORT=3000
   
   # Database
   DATABASE_URI=./databases/dev.db
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. **Seed Database (Optional)**
   ```bash
   node seed-script.js
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Authentication & Quick Access

The platform supports multiple authentication methods for development and testing:

### URL-Based Authentication

For quick access during development, you can authenticate directly via URL parameters:

#### Auto-Login (Default Test User)
```
http://localhost:3000/salarium/job-flow?autoLogin=true
```
- Uses default credentials: `test@test.com` / `Test12345%`
- Automatically logs in and cleans URL parameters

#### Custom Email/Password Login
```
http://localhost:3000/salarium/job-flow?email=test@test.com&password=Test12345%
```
- Use any valid email/password combination
- Credentials are removed from URL after successful login

#### Token-Based Authentication
```
http://localhost:3000/salarium/job-flow?token=your-jwt-token
```
- Use a valid JWT token for authentication
- Useful for API integrations and automated testing

### Business-Specific Access URLs

Each business product has dedicated access points:

- **Salarium HR Platform**: `http://localhost:3003/salarium/job-flow?autoLogin=true`
- **IntelliTrade Finance**: `http://localhost:3003/intellitrade?autoLogin=true`
- **Latinos Trading**: `http://localhost:3003/latinos?autoLogin=true`

### Default Test Credentials

For manual login:
- **Email**: `test@test.com`
- **Password**: `Test12345%`
- **Role**: Admin with full access to all business modules

## Architecture Overview

### Plugin-Based Multi-Tenant System
- **Single Codebase**: All three businesses share core Payload CMS infrastructure
- **Runtime Decoupling**: Environment variables determine which business plugins load
- **Independent Deployment**: Each business can run in separate containers on different ports

### Environment-Based Plugin Loading
```typescript
// Runtime plugin selection based on BUSINESS_MODE environment variable
const activePlugins = {
  intellitrade: [intellitradePlugin()],
  salarium: [salariumPlugin()],
  latinos: [latinosPlugin()],
  all: [intellitradePlugin(), salariumPlugin(), latinosPlugin()]
}
```

### Deployment Strategy
- **IntelliTrade**: Port 3001 with intellitrade.db
- **Salarium**: Port 3002 with salarium.db
- **Latinos**: Port 3003 with latinos.db
- **Development**: Port 3000 with all plugins active

## Core Features

### Content Management
- **Flexible Layout Builder**: Create unique page layouts using modular blocks
- **Draft Preview & Live Preview**: Preview content before publishing
- **SEO Optimization**: Built-in SEO plugin with complete control
- **Search Functionality**: Full-text search across all content
- **Media Management**: Advanced image handling with resizing and focal points

### Business-Specific Features

#### IntelliTrade
- Smart contract management and deployment
- Trade finance transaction tracking
- Oracle verification system
- Blockchain-based payment escrow
- Company and route management

#### Salarium
- HR document workflow management
- Organizational structure management
- Employee lifecycle tracking
- Document approval processes

#### Latinos
- Trading bot configuration and management
- Real-time market data integration
- Performance analytics and reporting
- Microservice integration for trade execution

## Documentation

📚 **[Complete Documentation](./docs/README.md)**

### Quick Links
- [Setup Guides](./docs/setup/) - Installation and deployment
- [Architecture](./docs/architecture/) - System design and technical decisions
- [User Guides](./docs/user-guide/) - End-user documentation
- [Developer Guides](./docs/developer-guide/) - Development and API documentation

## Development Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
node seed-script.js   # Seed database with demo data
pnpm generate:types   # Generate TypeScript types

# Code Quality
pnpm lint             # Run ESLint
```

## Technology Stack

### Core Technologies
- **Next.js 15.3.0** - Frontend framework with App Router
- **Payload CMS 3.43.0** - Headless content management system
- **TypeScript** - Static typing for JavaScript
- **SQLite** - Database (via @payloadcms/db-sqlite)

### Frontend
- **React 19.1.0** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Component library based on Radix UI

### Plugins & Extensions
- Form Builder, SEO, Search, Redirects
- Rich text editor with Lexical
- Live preview and admin bar
- Nested docs for hierarchical content

## Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build

# Individual business deployment
docker-compose up intellitrade  # Port 3001
docker-compose up salarium     # Port 3002
docker-compose up latinos      # Port 3003
```

### Production Deployment
1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start production server**
   ```bash
   pnpm start
   ```

3. **Deploy Options**
   - Payload Cloud (recommended)
   - Vercel with PostgreSQL
   - Self-hosting on VPS

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # Public website
│   │   └── (payload)/          # Admin interface
│   ├── collections/            # Payload collections
│   ├── blocks/                 # Layout building blocks
│   ├── components/             # React components
│   ├── plugins/                # Business plugins
│   │   ├── business/           # Business-specific plugins
│   │   │   ├── intellitrade/   # Trade finance
│   │   │   ├── salarium/       # HR workflows
│   │   │   └── latinos/        # Trading bots
│   │   └── shared/             # Shared functionality
│   └── utilities/              # Helper functions
├── docs/                       # Project documentation
├── databases/                  # SQLite database files
└── public/                     # Static assets
```

## Contributing

1. **Development Setup**: Follow the [Quick Start](#quick-start) guide
2. **Documentation**: Update relevant docs when making changes
3. **Testing**: Test all business modes before submitting changes
4. **Code Style**: Follow the established patterns and use TypeScript

## Support

- **Documentation**: [./docs/README.md](./docs/README.md)
- **Issues**: Create GitHub issues for bugs or feature requests
- **Development**: See [Developer Guide](./docs/developer-guide/) for detailed development information

## License

This project is built on the Payload CMS Website Template and follows the same licensing terms.

---

*This multi-tenant platform demonstrates the power of Payload CMS for building scalable, plugin-based applications that can serve multiple business domains from a single codebase.*

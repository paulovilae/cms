# Multi-Tenant Environment Architecture Solution

## Problem Analysis

### Current Issues
1. **Port Conflicts**: Local development tries to use port 3006, but Docker container `dev-all` already occupies it
2. **Environment Variable Conflicts**: `.env` file sets `NEXT_PUBLIC_SERVER_URL=http://localhost:3006` but Docker containers override this
3. **Development Complexity**: Single `.env` file trying to serve both local development and Docker containers
4. **Business Mode Detection**: System defaulting to wrong business mode due to environment variable precedence

### Architecture Overview
```
Docker Containers (Production-like):
├── latinos:     3003:3000 (BUSINESS_MODE=latinos)
├── intellitrade: 3004:3000 (BUSINESS_MODE=intellitrade)  
├── salarium:    3005:3000 (BUSINESS_MODE=salarium)
└── dev-all:     3006:3000 (BUSINESS_MODE=all)

Local Development:
└── pnpm dev:    3000 (or next available port)
```

## Solution Design

### 1. Environment Variable Hierarchy
```
1. Docker Environment Variables (highest priority)
2. .env.local (local development overrides)
3. .env (shared defaults)
4. .env.example (documentation)
```

### 2. File Structure
```
.env.example          # Documentation and all possible variables
.env                  # Shared defaults (secrets, common config)
.env.local           # Local development overrides (gitignored)
.env.docker          # Docker-specific defaults (optional)
docker-compose.yml   # Container-specific environment variables
```

### 3. Configuration Strategy

#### Local Development (.env.local)
- `BUSINESS_MODE=all` (multi-tenant testing)
- `NEXT_PUBLIC_SERVER_URL=http://localhost:3000` (or auto-detect)
- Development-specific settings

#### Docker Containers (docker-compose.yml)
- Each container has explicit environment variables
- `NEXT_PUBLIC_SERVER_URL` matches external port
- Business-specific `BUSINESS_MODE`

#### Shared Configuration (.env)
- Secrets and API keys
- Database configuration
- Common settings across all environments

## Implementation Steps

### Phase 1: Environment File Restructuring
1. Create `.env.local` for local development
2. Update `.env` to contain only shared configuration
3. Add `.env.local` to `.gitignore`
4. Update `.env.example` with comprehensive documentation

### Phase 2: Docker Configuration Updates
1. Verify Docker container environment variables
2. Ensure proper port mapping and URL configuration
3. Test each container independently

### Phase 3: Development Workflow
1. Local development: `pnpm dev` (uses .env.local)
2. Docker development: `docker-compose up <service>` (uses container env vars)
3. Production: Environment variables from deployment platform

### Phase 4: Testing and Validation
1. Test local development with `BUSINESS_MODE=all`
2. Test each Docker container with specific business mode
3. Verify background image loads correctly in multi-tenant mode
4. Validate port conflicts are resolved

## Expected Outcomes

### Local Development
- Runs on available port (3000, 3001, 3002, etc.)
- Shows multi-tenant homepage with background image
- No port conflicts with Docker containers

### Docker Containers
- Each business runs on dedicated port
- Proper business mode detection
- Isolated environments for testing

### Production
- Environment variables from deployment platform
- Proper URL configuration for each business
- Scalable multi-tenant architecture

## Configuration Files

### .env.local (Local Development)
```bash
# Local Development Configuration
BUSINESS_MODE=all
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

### .env (Shared Configuration)
```bash
# Shared secrets and configuration
PAYLOAD_SECRET=your-payload-secret-here
CRON_SECRET=your-cron-secret-here
PREVIEW_SECRET=your-preview-secret-here
SEED_EMAIL=test@test.com
SEED_PASSWORD=Test12345%
```

### Docker Environment Variables (Already Configured)
Each container in `docker-compose.yml` has:
- `BUSINESS_MODE=<specific-business>`
- `NEXT_PUBLIC_SERVER_URL=http://localhost:<external-port>`
- `DATABASE_PATH=file:/app/databases/multi-tenant.db`

## Next Steps

1. **Switch to Code Mode** to implement the solution
2. **Create .env.local** for local development
3. **Update .env** to remove conflicting variables
4. **Test local development** with proper multi-tenant mode
5. **Verify Docker containers** still work correctly
6. **Document the new development workflow**

This architecture provides clear separation between local development and Docker environments while maintaining the multi-tenant functionality.
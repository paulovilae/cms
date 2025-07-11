# Docker Setup for Multi-Tenant CMS

This document details the atypical Docker configuration used for the multi-tenant CMS platform.

## Overview

The platform uses a unique Docker setup that enables multiple business units to run from the same codebase with runtime decoupling. Each business unit runs in its own container with a separate port, but they share a common SQLite database file.

## Docker Configuration

### Container Structure

```
docker-compose up [business-name]
```

The platform uses dedicated containers for each business unit:

- **Container Names**:
  - `cms-salarium-1` - Salarium HR Platform
  - `cms-intellitrade-1` - IntelliTrade Finance Platform
  - `cms-latinos-1` - Latinos Trading Platform
  - `cms-dev-all-1` - Development (all plugins)

### Port Configuration

Each business unit has a dedicated port:

- **Salarium**: Port 3005 (`http://localhost:3005`)
- **IntelliTrade**: Port 3004 (`http://localhost:3004`)
- **Latinos**: Port 3003 (`http://localhost:3003`)
- **Development**: Port 3006 (`http://localhost:3006`)

### Shared Database

All business units share a single SQLite database file:

```
databases/multi-tenant.db
```

This shared database architecture with business-specific filtering enables true multi-tenancy while maintaining data isolation.

## Runtime Business Selection

What makes this Docker setup atypical is the runtime business selection mechanism:

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

The `BUSINESS_MODE` environment variable determines which business-specific plugins are activated at runtime. This enables a single codebase to serve multiple distinct business platforms.

## Key Environment Variables

- **BUSINESS_MODE**: Determines which business unit is active (`salarium`, `intellitrade`, `latinos`, `capacita`, or `all`)
- **DATABASE_URI**: Points to the shared SQLite database
- **NODE_ENV**: Runtime environment (`development`, `production`)

## Docker Commands

### Starting Specific Business Units

```bash
# Start Salarium HR Platform
docker-compose up salarium

# Start IntelliTrade Finance Platform
docker-compose up intellitrade

# Start Latinos Trading Platform
docker-compose up latinos

# Start all business units (development mode)
docker-compose up dev-all
```

### Viewing Logs

```bash
# View logs for a specific container
docker logs cms-salarium-1 --tail 20 -f
```

### Checking Container Status

```bash
# See all running containers
docker-compose ps
```

## Quick Access URLs

For development purposes, auto-login URLs are available:

- **Salarium**: `http://localhost:3005/salarium/job-flow?autoLogin=true`
- **IntelliTrade**: `http://localhost:3004/intellitrade?autoLogin=true`
- **Latinos**: `http://localhost:3003/latinos?autoLogin=true`

These URLs automatically log in with the default test user.

## Default Test Credentials

- **Email**: `test@test.com`
- **Password**: `Test12345%`
- **Role**: Admin with full access

## Business Context in API Endpoints

API endpoints validate the business context to ensure proper data isolation:

```typescript
export const myEndpoint = {
  path: '/my-endpoint',
  method: 'post',
  handler: async (req) => {
    const businessContext = getBusinessContext(req)
    
    // Validate business context
    if (!isValidBusinessMode(businessContext.business, ['salarium'])) {
      return Response.json({
        success: false,
        error: `Endpoint not available for business: ${businessContext.business}`,
      }, { status: 400 })
    }
    
    // Endpoint logic here
  }
}
```

## Critical Considerations for Developers

1. **Business Isolation**: Always check business context in API endpoints
2. **Port Management**: Be aware of which port corresponds to which business
3. **Plugin Activation**: Ensure plugins are properly registered for each business mode
4. **Shared Database**: Maintain proper data isolation despite the shared database file
5. **Environment Variables**: Set `BUSINESS_MODE` correctly when testing specific business units

## Troubleshooting

- **Container Fails to Start**: Check port conflicts with `netstat -tulpn | grep <port>`
- **Database Connection Issues**: Verify SQLite file permissions
- **Business-Specific Features Missing**: Confirm correct `BUSINESS_MODE` is set
- **API Errors**: Check business context headers in requests

This Docker configuration enables efficient development and deployment of the multi-tenant CMS platform while maintaining proper separation between business units.
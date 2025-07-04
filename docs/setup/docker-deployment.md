# Docker Multi-Tenant Setup

This document explains how to run the multi-tenant CMS platform using Docker, with each business product running in its own container.

## Architecture Overview

The platform supports four deployment modes:
- **IntelliTrade**: Trade finance platform (Port 3001)
- **Salarium**: HR document flow system (Port 3002)
- **Latinos**: Trading stocks bot platform (Port 3003)
- **Development**: All plugins active (Port 3000)

Each business runs with:
- Its own SQLite database
- Environment-specific plugin loading
- Independent theming and branding
- Isolated data and configurations

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 3000-3003 available

## Quick Start

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment variables
PAYLOAD_SECRET=your-super-secret-key-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 2. Build and Run All Services

```bash
# Build and start all business containers
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 3. Access the Applications

- **IntelliTrade**: http://localhost:3001
- **Salarium**: http://localhost:3002  
- **Latinos**: http://localhost:3003
- **Development**: http://localhost:3000 (with profile)

### 4. Access Admin Interfaces

Each business has its own admin interface:
- **IntelliTrade Admin**: http://localhost:3001/admin
- **Salarium Admin**: http://localhost:3002/admin
- **Latinos Admin**: http://localhost:3003/admin

## Individual Business Deployment

### Run Only IntelliTrade

```bash
docker-compose up intellitrade --build
```

### Run Only Salarium

```bash
docker-compose up salarium --build
```

### Run Only Latinos

```bash
docker-compose up latinos --build
```

### Run Development Mode

```bash
# Development mode with all plugins
docker-compose --profile dev up dev-all --build
```

## Database Management

### Database Locations

Each business uses its own SQLite database:
- IntelliTrade: `./databases/intellitrade.db`
- Salarium: `./databases/salarium.db`
- Latinos: `./databases/latinos.db`
- Development: `./databases/dev.db`

### Database Seeding

To seed a specific business database:

```bash
# Seed IntelliTrade database
docker-compose exec intellitrade node seed-script.js

# Seed Salarium database  
docker-compose exec salarium node seed-script.js

# Seed Latinos database
docker-compose exec latinos node seed-script.js
```

### Database Backup

```bash
# Backup all databases
docker-compose exec intellitrade cp /app/databases/intellitrade.db /app/databases/intellitrade.db.backup
docker-compose exec salarium cp /app/databases/salarium.db /app/databases/salarium.db.backup
docker-compose exec latinos cp /app/databases/latinos.db /app/databases/latinos.db.backup
```

### Database Reset

```bash
# Stop containers
docker-compose down

# Remove database files
rm -rf databases/*.db

# Restart and seed
docker-compose up --build
```

## Environment Variables

### Core Variables

```bash
# Required
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3001

# Business Mode (intellitrade|salarium|latinos|all)
BUSINESS_MODE=intellitrade

# Feature Flags (comma-separated)
ENABLED_FEATURES=aiManagement,gamification

# Database Path
DATABASE_PATH=/app/databases/intellitrade.db

# Frontend Theme
FRONTEND_THEME=intellitrade
```

### Business-Specific Variables

#### IntelliTrade
```bash
BUSINESS_MODE=intellitrade
ENABLED_FEATURES=aiManagement
FRONTEND_THEME=intellitrade
DATABASE_PATH=/app/databases/intellitrade.db
```

#### Salarium
```bash
BUSINESS_MODE=salarium
ENABLED_FEATURES=aiManagement,gamification
FRONTEND_THEME=salarium
DATABASE_PATH=/app/databases/salarium.db
```

#### Latinos
```bash
BUSINESS_MODE=latinos
ENABLED_FEATURES=aiManagement,digitalPayments
FRONTEND_THEME=latinos
DATABASE_PATH=/app/databases/latinos.db
```

## Development Workflow

### Local Development with Docker

```bash
# Start development container with volume mounting
docker-compose --profile dev up dev-all

# The container will reflect local file changes
# Access at http://localhost:3000
```

### Building for Production

```bash
# Build production images
docker-compose build

# Run in production mode
docker-compose up -d
```

### Logs and Debugging

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f intellitrade

# Access container shell
docker-compose exec intellitrade sh
```

## Scaling and Production

### Resource Requirements

**Minimum per container:**
- CPU: 0.5 cores
- RAM: 512MB
- Storage: 1GB

**Recommended per container:**
- CPU: 1 core
- RAM: 1GB
- Storage: 5GB

### Production Deployment

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to container orchestration platform
# (Kubernetes, Docker Swarm, etc.)
```

### Health Checks

Each container includes health checks:

```bash
# Check container health
docker-compose ps

# Manual health check
curl http://localhost:3001/api/health
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3001

# Change ports in docker-compose.yml if needed
```

#### Database Permissions
```bash
# Fix database permissions
sudo chown -R 1001:1001 databases/
```

#### Memory Issues
```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory
```

#### Build Failures
```bash
# Clean build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Container Debugging

```bash
# Access container shell
docker-compose exec intellitrade sh

# Check environment variables
docker-compose exec intellitrade env

# Check file system
docker-compose exec intellitrade ls -la /app

# Check processes
docker-compose exec intellitrade ps aux
```

### Network Issues

```bash
# Check container network
docker network ls
docker network inspect cms_cms-network

# Test connectivity between containers
docker-compose exec intellitrade ping salarium
```

## Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique `PAYLOAD_SECRET` values
- Rotate secrets regularly

### Database Security
- Database files are isolated per business
- No cross-business data access
- Regular backups recommended

### Network Security
- Containers communicate on isolated network
- Only necessary ports are exposed
- Consider using reverse proxy for production

## Monitoring and Maintenance

### Log Management
```bash
# Rotate logs
docker-compose logs --tail=1000 > logs/$(date +%Y%m%d).log

# Clear old logs
docker system prune --volumes
```

### Updates
```bash
# Update images
docker-compose pull
docker-compose up -d

# Update with rebuild
docker-compose up --build -d
```

### Backup Strategy
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p backups/$DATE
cp databases/*.db backups/$DATE/
tar -czf backups/backup_$DATE.tar.gz backups/$DATE/
```

This Docker setup provides a robust, scalable foundation for running multiple business products from a single codebase while maintaining complete isolation and independence.
# Project Debugging Guide

## Common Issues and Solutions

### Docker Container Issues

**Symptoms:**
- Container fails to start
- "Connection refused" errors when accessing services
- Database connection errors

**Debugging Steps:**
1. Check container status: `docker-compose ps`
2. View logs: `docker logs <container-name> --tail 50`
3. Verify port mappings in docker-compose.yml
4. Check if the container has the correct environment variables

**Common Solutions:**
- Restart container: `docker-compose restart <service-name>`
- Rebuild container: `docker-compose up --build <service-name>`
- Check port conflicts with `netstat -tulpn | grep <port>`

### Database Connection Issues

**Symptoms:**
- "Database file is not found" errors
- "Permission denied" errors
- Slow query performance

**Debugging Steps:**
1. Verify database path in environment variables
2. Check file permissions on `databases/multi-tenant.db`
3. Check if the database is locked by another process
4. Examine database logs for errors

**Common Solutions:**
- Fix permissions: `chmod 664 databases/multi-tenant.db`
- Re-run database seeding: `node seed-script.js`
- Verify SQLite is properly installed

### Business Context Issues

**Symptoms:**
- API returns "Endpoint not available for business" errors
- Features appear missing in specific business contexts
- Cross-business data leakage

**Debugging Steps:**
1. Check request headers for proper business context
2. Verify environment variable `BUSINESS_MODE` is set correctly
3. Inspect plugin registration in Payload config
4. Check access control rules for collections

**Common Solutions:**
- Set correct headers: `x-business: salarium`
- Use business-specific URLs with auto-login
- Check plugin configuration in activePlugins object

### Payload CMS Issues

**Symptoms:**
- TypeScript errors related to collections or fields
- Admin UI rendering issues
- GraphQL schema errors

**Debugging Steps:**
1. Check collection configuration for errors
2. Verify hooks are returning the correct data
3. Look for circular dependencies in imports
4. Check for missing field validations

**Common Solutions:**
- Regenerate types: `pnpm generate:types`
- Restart the development server
- Check for recent changes to collection schemas

### Frontend Rendering Issues

**Symptoms:**
- Components fail to render
- React hydration errors
- Missing or incorrect data in components

**Debugging Steps:**
1. Check browser console for errors
2. Verify data is being fetched correctly with network tab
3. Check component props with React DevTools
4. Ensure correct business context is being passed

**Common Solutions:**
- Clear browser cache and reload
- Verify API responses are correct format
- Check for null or undefined values in data

## Diagnostic Tools

### Docker Commands
```bash
# Check container status
docker-compose ps

# View container logs
docker logs cms-salarium-1 --tail 50

# Restart container
docker-compose restart salarium

# View resource usage
docker stats
```

### Database Diagnostics
```bash
# Check database file exists
ls -la databases/multi-tenant.db

# Check SQLite version
sqlite3 --version

# Open database shell
sqlite3 databases/multi-tenant.db

# Common SQLite commands
.tables
.schema users
SELECT COUNT(*) FROM users;
```

### Network Diagnostics
```bash
# Check if ports are in use
netstat -tulpn | grep 3005

# Test connection to service
curl -v http://localhost:3005/api/users

# Check DNS resolution
nslookup example.com
```

## Logging Strategy

### Log Levels
- **ERROR**: Critical issues that require immediate attention
- **WARN**: Potential issues that might need attention
- **INFO**: Important application events
- **DEBUG**: Detailed information for development

### Adding Logs
```typescript
// Add logs for debugging
console.error('Critical error:', error);
console.warn('Potential issue:', { data, context });
console.info('Operation completed:', operation);
console.debug('Detailed state:', { state, props });
```

### Log Analysis
1. Search for ERROR logs first
2. Look for patterns in WARN logs
3. Trace request flow through INFO logs
4. Use DEBUG logs for detailed state inspection

## Performance Debugging

### Database Performance
- Check for missing indexes
- Look for N+1 query patterns
- Monitor query execution time

### React Performance
- Use React Profiler to identify slow components
- Check for unnecessary re-renders
- Verify memoization is working correctly

### Network Performance
- Monitor API response times
- Check payload sizes
- Verify caching headers are set correctly

## Troubleshooting Checklist

Before escalating issues:

1. **Verify Environment**
   - Correct Node.js version
   - Required dependencies installed
   - Environment variables set correctly

2. **Check Recent Changes**
   - Recent code changes related to the issue
   - Schema or database changes
   - Environment or configuration changes

3. **Isolate the Problem**
   - Reproduce in different environment
   - Reduce test case to minimal example
   - Verify if issue is business-specific

4. **Document Findings**
   - Error messages and stack traces
   - Steps to reproduce
   - Environment details
   - Attempted solutions
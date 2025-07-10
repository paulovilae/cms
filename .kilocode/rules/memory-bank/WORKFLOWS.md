# Common Workflows and Task Management

## Development Workflows

### Adding a New Business Unit

**Files to modify**:
- `src/plugins/business/[business-name]/` - Main plugin directory
- `docker-compose.yml` - Container configuration
- `src/payload.config.ts` - Plugin registration

**Steps**:
1. Create plugin directory following existing patterns
2. Define collections with proper access controls
3. Implement standard API endpoints
4. Create React components
5. Add Docker container configuration
6. Register plugin in Payload config
7. Create seed data and add frontend routes

**Critical**: Follow business context utility patterns for isolation

### API Endpoint Development

```typescript
import { getBusinessContext, isValidBusinessMode } from '@/utilities/businessContext'

export const myEndpoint = {
  path: '/my-endpoint',  // No business prefix
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

### Component Development
1. Create in business plugin directory
2. Use `createBusinessHeaders()` for API calls
3. Implement proper error handling
4. Follow design system patterns

## Task Management

### Task Statuses
- ⏳ **PENDING** - Not started
- 🔄 **IN_PROGRESS** - Currently active
- ✅ **COMPLETED** - Finished and verified
- ❌ **BLOCKED** - Cannot proceed due to dependencies

### Task Priority
- **HIGH**: Core functionality, critical bugs, security
- **MEDIUM**: Enhancements, performance, documentation
- **LOW**: Nice-to-have features, cleanup, experiments

### Task Documentation
```markdown
### Task Name [Status]
**Priority**: HIGH/MEDIUM/LOW
**Objective**: Brief description

**Dependencies**: Prerequisites 
**Next Steps**: 
1. First immediate action
2. Subsequent steps

**Updates**:
- [Date] - Progress update
```

## Troubleshooting Guides

### Docker Issues
1. Check container status: `docker-compose ps`
2. View logs: `docker logs <container-name>`
3. Restart container: `docker-compose restart <service>`
4. Verify port mappings and environment variables

### Database Issues
1. Check file permissions on `databases/multi-tenant.db`
2. Verify database path in environment variables
3. Re-run seeding if data is corrupted: `node seed-script.js`

### API Issues
1. Verify standard Payload endpoint patterns
2. Check business context headers: `x-business: salarium`
3. Verify authentication with proper token
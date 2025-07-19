# Multi-Tenant Business Platform

A plugin-based CMS with versioned implementations for each business unit, where all knowledge and functionality is shared through a centralized plugin system.

## Core Architecture Principles

1. **Plugin-Centric Design**:
   - All business logic is encapsulated in plugins
   - Plugins are versioned and published to private npm
   - Shared functionality is implemented once and reused

2. **Plugin Development Workflow**:
   - **Initial Development**: Plugins are created and tested within business-specific apps (e.g., intellitrade)
   - **Promotion to Production**: When ready, plugins are moved to `cms/src/plugins/` (the central repository)
   - Plugins are organized into three folders: `core/`, `shared/`, and `[business]/`
   - Site-level promotions go from individual apps (e.g., intellitrade) to their production versions (e.g., intellitrade-prod)

3. **Structured Plugin Organization**:
   - **Core Plugins**: `cms/src/plugins/core/` - Essential plugins required by all applications
   - **Shared Plugins**: `cms/src/plugins/shared/` - Optional plugins that can be reused across businesses
   - **Business-Specific Plugins**: `cms/src/plugins/[business]/` - Unique business logic and UI

4. **Knowledge Sharing**:
   - All domain knowledge is captured in plugins
   - Documentation is plugin-centric
   - Cross-business learning through shared plugins

## Plugin Lifecycle Management

### Plugin Development Process
1. **Create**:
   - Can be initially developed in business-specific implementations
   - Contains complete business logic and UI
   - Includes comprehensive documentation

2. **Test**:
   - Unit and integration tests
   - Cross-version compatibility checks
   - Business-specific validation

3. **Promote to cms**:
    - Move stable plugins to central repository
   - Published to private npm registry
   - Versioned using semantic versioning
   - Metadata includes compatibility matrix

4. **Deploy**:
   - Installed in target implementations
   - Configuration through environment variables
   - Runtime activation based on business mode

### Plugin Types
1. **Core Plugins** (required):
   - Located in `cms/src/core/`
   - Authentication
   - Data layer
   - Error handling
   - API core

2. **Shared Plugins**:
   - Located in `cms/src/shared/`
   - AI services
   - Real-time collaboration
   - Analytics engine
   - Internationalization

3. **Business-Specific Plugins**:
   - Located in `cms/src/plugins/[business]/`
   - IntelliTrade: Blockchain integration
   - Salarium: HR workflows
   - Latinos: Trading algorithms
   - Capacita: Training scenarios

## Versioning Workflow

1. **Development Phase**:
   - New features added to plugins in development directories
   - Plugins remain in development namespace

2. **Stabilization**:
   - Create backup snapshot
   - Promote plugins to @latest
   - Update documentation

3. **Production Deployment**:
   - Install stable plugins in production
   - Verify cross-plugin compatibility
   - Monitor performance

4. **Recovery Process**:
   - If issues arise:
     - Create fresh implementation from current requirements
     - Migrate only validated data and configurations
     - Rebuild plugins from source control
     - Verify against latest documentation
  
  ## Centralized Scripts Management
  
  1. **Recovery Script**:
     - Automates the fresh implementation process
     - Validates data integrity before migration
     - Rebuilds plugins from source control
     - Verifies system against documentation
  
  2. **New Business Creation Script**:
     - Scaffolds new business implementations
     - Configures required plugins and dependencies
     - Sets up initial data structures
     - Generates documentation templates
  
  3. **Central Repository README**:
      - Documents the plugin architecture
      - Explains the development workflow
      - Provides usage examples
      - Includes troubleshooting guide

  4. **Plugin Promotion Script**:
      - Automates moving plugins from development to production
      - Validates plugin dependencies and compatibility
      - Updates version numbers and changelogs
      - Runs integration tests before promotion
      - Updates documentation automatically
      - Handles rollback if issues are detected

## Business Units Implementation

| Business Unit | Domain | Dev Port | Key Plugins |
|---------------|--------|----------|-------------|
| Latinos | latinos.paulovila.org | 3003 | trading-core, market-data, bot-engine |
| IntelliTrade | intellitrade.paulovila.org | 3004 | blockchain, smart-contracts, kyb-verification |
| Salarium | salarium.paulovila.org | 3005 | hr-workflows, compensation-analysis, job-designer |
| Capacita | capacita.paulovila.org | 3007 | avatar-engine, training-scenarios, skill-evaluator |
| CMS Admin | cms.paulovila.org | 3006 | admin-core, user-management, plugin-manager |

## Development Standards

1. **Plugin Documentation**:
   - Usage examples
   - Configuration options
   - API reference
   - Version compatibility

2. **Testing Requirements**:
   - 90%+ test coverage
   - Cross-version validation
   - Performance benchmarks

3. **Security Practices**:
   - Vulnerability scanning
   - Dependency auditing
   - Access controls

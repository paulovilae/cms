# Multi-Tenant Business Platform - Architecture

## Core Architecture Principles

1. **Plugin-Centric Design**:
   - All business logic is encapsulated in plugins
   - Plugins are versioned and published to private npm
   - Shared functionality is implemented once and reused

2. **Three-Tier Plugin Structure**:
   - **Core Plugins**: Essential plugins required by all applications
   - **Shared Plugins**: Optional plugins that can be reused across businesses
   - **Business-Specific Plugins**: Unique business logic and UI

## Plugin Organization

```
cms/src/plugins/
├── core/          # Essential plugins required by all applications
├── shared/        # Optional plugins reusable across businesses
└── [business]/    # Business-specific plugins (e.g., intellitrade/)
```

## Plugin Lifecycle

1. **Development**:
   - Created and tested within business-specific apps
   - Includes complete business logic and UI
   - Contains comprehensive documentation

2. **Promotion**:
   - Moved to central repository when stable
   - Published to private npm registry
   - Versioned using semantic versioning

3. **Deployment**:
   - Installed in target implementations
   - Configured through environment variables
   - Activated based on business mode

## Business Units Implementation

| Business Unit | Domain | Dev Port | Key Plugins |
|---------------|--------|----------|-------------|
| Latinos | latinos.paulovila.org | 3003 | trading-core, market-data, bot-engine |
| IntelliTrade | intellitrade.paulovila.org | 3004 | blockchain, smart-contracts, kyb-verification |
| Salarium | salarium.paulovila.org | 3005 | hr-workflows, compensation-analysis, job-designer |
| Capacita | capacita.paulovila.org | 3007 | avatar-engine, training-scenarios, skill-evaluator |
| CMS Admin | cms.paulovila.org | 3006 | admin-core, user-management, plugin-manager |

## Technical Standards

1. **Documentation**:
   - Usage examples
   - Configuration options
   - API reference
   - Version compatibility

2. **Testing**:
   - 90%+ test coverage
   - Cross-version validation
   - Performance benchmarks

3. **Security**:
   - Vulnerability scanning
   - Dependency auditing
   - Access controls
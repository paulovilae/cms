# Infrastructure Documentation

This directory contains documentation about the infrastructure components of the multi-tenant CMS platform.

## Purpose

This documentation helps:
- Understand the overall infrastructure architecture
- Navigate the deployment and configuration process
- Reference CI/CD pipelines and monitoring solutions
- Track infrastructure-related decisions and changes

## Infrastructure Organization

The platform's infrastructure code is located in the `/infrastructure` directory:

```
infrastructure/
├── ci/                  # Continuous Integration configuration
├── database/            # Database scripts and migrations
│   ├── migration/
│   └── migration-plans/
├── deployment/          # Deployment configuration
├── monitoring/          # Monitoring solutions
└── scripts/             # Infrastructure automation scripts
    ├── database/
    ├── migration/
    ├── system/
    └── utilities/
```

## Documentation Scope

This directory provides documentation **about** the infrastructure, while the actual infrastructure code and configuration reside in the `/infrastructure` directory. This separation maintains a clear distinction between operational code and its documentation.

### Topics Covered

- **CI/CD Pipelines**: Documentation of continuous integration and deployment workflows
- **Database Management**: Information about database structure, migrations, and management
- **Deployment Processes**: Guides for deploying the platform in various environments
- **Monitoring Solutions**: Documentation of monitoring tools and alerts
- **Infrastructure Scripts**: Explanations of automation scripts and their usage

## Docker Deployment

The platform uses Docker for multi-tenant deployment:

- **Container Names**: `cms-salarium-1`, `cms-intellitrade-1`, `cms-latinos-1`, `cms-dev-all-1`
- **Port Configuration**:
  - Salarium: Port 3005 (`http://localhost:3005`)
  - IntelliTrade: Port 3004 (`http://localhost:3004`)
  - Latinos: Port 3003 (`http://localhost:3003`)
  - Development: Port 3006 (`http://localhost:3006`)

## Related Resources

- [Infrastructure Directory](../../../infrastructure/) - Actual infrastructure code
- [Database Directory](../../../infrastructure/database/) - Database migrations and scripts
- [Deployment Documentation](./deployment/) - Detailed deployment guides
- [CI/CD Documentation](./ci/) - Pipeline configuration documentation
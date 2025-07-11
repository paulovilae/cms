# Agent Permission Model

This document defines the security permissions for each agent role, following the principle of least privilege. The permissions are structured by file types and directories each agent can access.

## Core Principles

1. **Role-Based Access Control**: Each agent has permissions aligned with their specific responsibilities
2. **Least Privilege**: Agents can only modify files necessary for their role
3. **Defense in Depth**: Both file type and directory restrictions are applied
4. **Clear Boundaries**: Explicit permissions make security auditing straightforward

## Permission Structure

Permissions are defined in the agent profile YAML files using the following pattern:

```yaml
groups:
  - read  # All agents have read access to all files
  - - edit  # Restricted edit access
    - fileRegex: \.(md|txt)$  # File type restriction
      description: Documentation files only
    - directory: ./reports/specific-type/  # Directory restriction
      description: Specific reports directory
  - browser  # Browser access if needed
  - command  # Command execution if needed
  - mcp      # MCP access if needed
```

## Full Access Roles

### Code Agent
**Purpose**: Implement and modify all code
**Permissions**:
```yaml
groups:
  - read
  - edit  # Unrestricted edit access to all files
  - browser
  - command
  - mcp
```

### Debug Agent
**Purpose**: Fix issues throughout the codebase
**Permissions**:
```yaml
groups:
  - read
  - edit  # Unrestricted edit access to all files
  - browser
  - command
  - mcp
```

## Restricted Access Roles

### Architect Agent
**Purpose**: System design and planning
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.md$
      description: Markdown files only
    - directory: ./reports/architecture/
      description: Architecture documentation
  - browser
  - mcp
```

### Ask Agent
**Purpose**: Answer questions without modifying code
**Permissions**:
```yaml
groups:
  - read
  - browser
  - mcp
```
*Note: No edit permissions required as this role only provides information*

### Orchestrator Agent
**Purpose**: Coordinate tasks across multiple specialized agents
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.md$
      description: Markdown files only
    - directory: ./reports/coordination/
      description: Coordination planning documents
  - browser
  - mcp
```

### UX Expert Agent
**Purpose**: Review and improve user experience
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(md|css)$
      description: Markdown reports and CSS files
    - directory: ./reports/ux/
      description: UX reports directory
  - browser
  - mcp
```

### Documentor Agent
**Purpose**: Create and maintain documentation
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.md$
      description: Markdown files only
    - directory: ./reports/documentation/
      description: Documentation directory
  - browser
  - command
  - mcp
```

### Analyst Agent
**Purpose**: Analyze data and generate insights
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(md|csv|json)$
      description: Reports and data files
    - directory: ./reports/analytics/
      description: Analytics reports directory
  - browser
  - command
  - mcp
```

### Content Creator Agent
**Purpose**: Create content for various platforms
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(md|txt|html|json)$
      description: Content files only
    - directory: ./content/
      description: Content directory
  - browser
  - mcp
```

### Database Engineer Agent
**Purpose**: Design and optimize database systems
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(sql|prisma|json|yaml|yml|md)$
      description: Database scripts and configurations
    - directory: ./infrastructure/database/
      description: Database infrastructure directory
  - browser
  - command
  - mcp
```

### Graphic Designer Agent
**Purpose**: Create visual designs and assets
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(css|scss|svg|png|jpg|jpeg|gif|webp)$
      description: Visual assets and styling files
    - directory: ./assets/
      description: Assets directory
  - browser
  - mcp
```

### Security Expert Agent
**Purpose**: Identify and mitigate security vulnerabilities
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(md|json|yaml|yml)$
      description: Documentation and configuration files
    - directory: ./reports/security/
      description: Security reports directory
  - browser
  - command
  - mcp
```

### Performance Engineer Agent
**Purpose**: Optimize code and systems for performance
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(md|json)$
      description: Performance reports and configuration
    - directory: ./reports/performance/
      description: Performance reports directory
  - browser
  - command
  - mcp
```

## Planned Additional Roles

### Test Engineer Agent
**Purpose**: Ensure software quality through testing
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(spec|test)\.(js|ts|py)$
      description: Test files
    - fileRegex: \.md$
      description: Test documentation
    - directory: ./tests/
      description: Tests directory
  - browser
  - command
  - mcp
```

### Localization Expert Agent
**Purpose**: Manage internationalization and localization
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(json|yaml|po|properties)$
      description: Localization resource files
    - directory: ./locales/
      description: Localization directory
  - browser
  - mcp
```

### DevOps Engineer Agent
**Purpose**: Manage CI/CD pipelines and infrastructure
**Permissions**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(yml|yaml|json|tf|toml)$
      description: Infrastructure configuration files
    - directory: ./infrastructure/
      description: Infrastructure directory
  - browser
  - command
  - mcp
```

## Directory Structure Recommendations

To support this permission model, the following directory structure is recommended:

```
project-root/
├── assets/                 # Visual assets (Graphic Designer)
│   ├── images/
│   ├── icons/
│   └── styles/
│
├── content/                # Content files (Content Creator)
│   ├── web/
│   ├── marketing/
│   └── documentation/
│
├── infrastructure/         # Infrastructure files (DevOps, Database Engineer)
│   ├── ci/
│   ├── deployment/
│   ├── monitoring/
│   └── database/
│
├── locales/                # Localization files (Localization Expert)
│   ├── en/
│   ├── es/
│   └── ...
│
├── reports/                # Agent-generated reports
│   ├── analytics/          # Analyst reports
│   ├── architecture/       # Architect documents
│   ├── coordination/       # Orchestrator planning
│   ├── documentation/      # Documentor outputs
│   ├── performance/        # Performance test results
│   ├── security/           # Security assessments
│   └── ux/                 # UX audit reports
│
├── tests/                  # Test files (Test Engineer)
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── performance/
│
└── src/                    # Application source code (Code and Debug)
    ├── api/
    ├── components/
    ├── utils/
    └── ...
```

## Implementation Plan

1. **Update all agent profiles** with appropriate permission restrictions
2. **Create required directories** as outlined in the structure
3. **Add README.md files** to each directory explaining its purpose
4. **Configure CI/CD** to enforce these permissions during deployment
5. **Document this model** in the project's security guidelines

## Security Considerations

1. Ensure file paths are validated to prevent path traversal attacks
2. Regularly audit agent activities to verify permissions are working as intended
3. Consider implementing runtime permission validation in addition to profile restrictions
4. Review and update this model as new roles or requirements emerge
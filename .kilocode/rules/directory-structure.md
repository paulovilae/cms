# Recommended Directory Structure

This document outlines the recommended directory structure to support the agent permission model and organize project resources effectively.

## Core Directories

```
project-root/
├── .kilocode/               # Reusable configuration and rules
│   ├── profiles/            # Agent profiles
│   └── rules/               # Core rules that apply across projects
│
├── context_portal/          # Project-specific ConPort data
│   ├── decisions/           # Architecture decisions
│   └── tasks/               # Project tasks (moved from .kilocode)
│
├── reports/                 # Agent-generated reports
│   ├── analytics/           # Analyst reports
│   ├── architecture/        # Architecture documents
│   ├── coordination/        # Orchestrator planning
│   ├── documentation/       # Documentor outputs
│   ├── performance/         # Performance test results
│   ├── security/            # Security assessments
│   └── ux/                  # UX audit reports
│
├── assets/                  # Visual and design assets
│   ├── images/              # Image files
│   ├── icons/               # Icon assets
│   └── styles/              # CSS and style files
│
├── content/                 # Content-focused files
│   ├── web/                 # Web content
│   ├── marketing/           # Marketing materials
│   └── documentation/       # End-user documentation
│
├── infrastructure/          # Infrastructure code
│   ├── ci/                  # CI/CD configuration
│   ├── deployment/          # Deployment scripts
│   ├── monitoring/          # Monitoring setup
│   └── database/            # Database scripts and migrations
│
├── locales/                 # Localization files
│   ├── en/                  # English resources
│   ├── es/                  # Spanish resources
│   └── ...                  # Other languages
│
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   ├── e2e/                 # End-to-end tests
│   └── performance/         # Performance tests
│
└── src/                     # Application source code
    ├── api/                 # API endpoints
    ├── components/          # UI components
    ├── utils/               # Utility functions
    └── ...                  # Other source code
```

## Purpose and Responsibilities

### `.kilocode/`
- **Purpose**: Contains project-independent, reusable configuration
- **Contents**: Agent profiles, rule definitions, and common settings
- **Rationale**: Separating these from project-specific elements allows for easier migration between projects

### `context_portal/`
- **Purpose**: Project-specific knowledge and context
- **Contents**: Tasks, decisions, architectural plans
- **Rationale**: Centralizes project context in ConPort for better tracking and querying

### `reports/`
- **Purpose**: Output from various agent analyses
- **Contents**: Organized by agent type for clear separation
- **Rationale**: Structured storage of agent outputs for easy reference

### `assets/`
- **Purpose**: Visual and design assets
- **Contents**: Images, icons, and style files
- **Rationale**: Consolidated location for all design-related files

### `content/`
- **Purpose**: Text-based content for various platforms
- **Contents**: Web content, marketing materials, documentation
- **Rationale**: Separates content from code for easier management

### `infrastructure/`
- **Purpose**: DevOps and infrastructure configuration
- **Contents**: CI/CD, deployment, monitoring, database scripts
- **Rationale**: Centralizes infrastructure code for DevOps workflows

### `locales/`
- **Purpose**: Internationalization and localization resources
- **Contents**: Translation files organized by language
- **Rationale**: Structured approach to managing multi-language support

### `tests/`
- **Purpose**: All testing-related files
- **Contents**: Organized by test type for clear categorization
- **Rationale**: Moved outside .kilocode to make tests more visible and standardized

### `src/`
- **Purpose**: Application source code
- **Contents**: Actual implementation files
- **Rationale**: Standard location for application code

## Implementation Steps

1. **Create Base Directory Structure**
   - Set up the primary directories first
   - Add README.md files to each directory explaining its purpose

2. **Migrate Existing Files**
   - Move existing files to appropriate directories
   - Update references to maintain functionality

3. **Update CI/CD Pipeline**
   - Ensure CI/CD processes are aware of the new structure
   - Update build and deployment scripts as needed

4. **Document for Team**
   - Create documentation explaining the directory structure
   - Provide guidelines for where new files should be placed

## Next Steps

Once the directory structure is in place, agent profiles should be updated to reflect the new permission model outlined in the agent-permissions.md document. This requires switching to Code mode to modify the YAML files.
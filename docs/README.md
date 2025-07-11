# CMS Documentation Repository

This is the central documentation repository for our multi-tenant CMS platform and all its business units. The documentation is organized to provide clear separation between general CMS documentation and business-specific documentation.

## Directory Structure

```
docs/
├── general/                      # General CMS-wide documentation
│   ├── architecture/             # System-wide architecture
│   │   ├── vision/               # Vision documents
│   │   └── diagrams/             # Architecture diagrams
│   ├── development/              # Development guidelines
│   ├── operations/               # Operational docs
│   └── api/                      # API documentation
│
├── latinos/                      # Latinos Trading Platform docs
│   ├── architecture/             # Latinos architecture
│   │   ├── vision/               # Vision documents
│   │   └── diagrams/             # Architecture diagrams
│   ├── features/                 # Feature documentation
│   ├── user-guides/              # User guides
│   └── api/                      # API documentation
│
├── salarium/                     # Salarium HR Platform docs
│   ├── architecture/             # Salarium architecture
│   │   ├── vision/               # Vision documents
│   │   └── diagrams/             # Architecture diagrams
│   ├── features/                 # Feature documentation
│   ├── user-guides/              # User guides
│   └── api/                      # API documentation
│
├── intellitrade/                 # IntelliTrade Finance Platform docs
│   ├── architecture/             # IntelliTrade architecture
│   │   ├── vision/               # Vision documents
│   │   └── diagrams/             # Architecture diagrams
│   ├── features/                 # Feature documentation
│   ├── user-guides/              # User guides
│   └── api/                      # API documentation
│
└── capacita/                     # Capacita Training Platform docs
    ├── architecture/             # Capacita architecture
    │   ├── vision/               # Vision documents
    │   └── diagrams/             # Architecture diagrams
    ├── features/                 # Feature documentation
    ├── user-guides/              # User guides
    └── api/                      # API documentation
```

## Documentation Guidelines

### When to Create General vs. Business-Specific Documentation

- **General Documentation**: Use for platform-wide features, architectural patterns, and guidelines that apply across all business units
- **Business-Specific Documentation**: Use for features, implementations, and use cases that are unique to a specific business unit

### Naming Conventions

- **Filenames**: Use kebab-case with descriptive names
  - Pattern: `[topic]-[subtopic]-[date].md`
  - Example: `vision-trading-bots-2025-01-07.md`

- **Headers**: Use Title Case for main headers, Sentence case for subheadings

### Cross-Referencing

- Use relative links when referencing other documents
- For business-specific documents referencing general docs: `../../general/path/to/doc.md`
- For general docs referencing business-specific docs: `../{business}/path/to/doc.md`

## Key Documents

### General Architecture
- [Document Structure Migration Plan](general/architecture/document-structure-migration-plan.md)
- [Profile Updates for Document Structure](general/architecture/profile-updates-for-document-structure.md)

### Latinos Trading Platform
- [Latinos Bot Trading Vision](latinos/architecture/vision/vision-latinos-bot-trading-2025-01-07.md)

## Our Philosophy

> **"Clarity comes step by step."**

We believe in iterative improvement and organization, recognizing that the best structures often emerge through the process of building and refining.
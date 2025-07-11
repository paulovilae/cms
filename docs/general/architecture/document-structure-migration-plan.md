# Document Structure Migration Plan

## 1. Current Situation

Currently, our documentation is organized in a way that doesn't clearly separate business-specific content from general CMS content:

- Vision documents are saved to `reports/architecture/vision-[project-name]-[date].md`
- Other documentation is spread across `reports/` subdirectories
- No clear separation between business units (Latinos, Salarium, IntelliTrade, etc.)

## 2. Proposed Document Structure

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

This structure offers several benefits:
- Clear separation between business units
- Consistent structure across all documentation
- Logical organization of different document types
- Easy navigation for team members focused on specific business units

## 3. Profile Updates Required

The following profiles will need updating:

1. **Visionary Profile**: Currently saves to `reports/architecture/vision-[project-name]-[date].md`
2. **Architect Profile**: Likely references docs in `reports/architecture/`
3. **UX Expert Profile**: May reference `reports/ux/`
4. **Documentation Profile**: Likely references `reports/documentation/`
5. **Analyst Profile**: May reference `reports/analytics/`
6. Any other profiles that reference report paths

### Visionary Profile Updates

The current instruction in the Visionary profile:
```yaml
# Current
- Save all vision packages to `reports/architecture/vision-[project-name]-[date].md`

# Update to
- For general CMS visions: Save to `docs/general/architecture/vision/vision-[feature]-[date].md`
- For business-specific visions: Save to `docs/[business-name]/architecture/vision/vision-[feature]-[date].md`
```

### Profile File Permissions Updates

All profiles that reference specific directories for edit permissions will need to be updated:

```yaml
# Example for Visionary profile
groups:
  - read
  - - edit
    - fileRegex: \.(md|json)$
      description: Vision documents and concept files
    - directory: docs/
      description: Documentation directory
```

## 4. Migration Steps

### Step 1: Create New Directory Structure

```bash
# Create base docs directory if it doesn't exist
mkdir -p docs

# Create general docs structure
mkdir -p docs/general/architecture/vision
mkdir -p docs/general/architecture/diagrams
mkdir -p docs/general/development
mkdir -p docs/general/operations
mkdir -p docs/general/api

# Create Latinos docs structure
mkdir -p docs/latinos/architecture/vision
mkdir -p docs/latinos/architecture/diagrams
mkdir -p docs/latinos/features
mkdir -p docs/latinos/user-guides
mkdir -p docs/latinos/api

# Create Salarium docs structure
mkdir -p docs/salarium/architecture/vision
mkdir -p docs/salarium/architecture/diagrams
mkdir -p docs/salarium/features
mkdir -p docs/salarium/user-guides
mkdir -p docs/salarium/api

# Create IntelliTrade docs structure
mkdir -p docs/intellitrade/architecture/vision
mkdir -p docs/intellitrade/architecture/diagrams
mkdir -p docs/intellitrade/features
mkdir -p docs/intellitrade/user-guides
mkdir -p docs/intellitrade/api

# Create Capacita docs structure
mkdir -p docs/capacita/architecture/vision
mkdir -p docs/capacita/architecture/diagrams
mkdir -p docs/capacita/features
mkdir -p docs/capacita/user-guides
mkdir -p docs/capacita/api
```

### Step 2: Move Existing Files

```bash
# Move Latinos vision documents
mv reports/architecture/vision-latinos-*.md docs/latinos/architecture/vision/

# Move Latinos bot trading vision specifically
mv reports/architecture/vision-latinos-bot-trading-2025-01-07.md docs/latinos/architecture/vision/

# Move other business-specific documents
# (Example commands - adjust based on actual file naming patterns)
mv reports/architecture/vision-salarium-*.md docs/salarium/architecture/vision/
mv reports/architecture/vision-intellitrade-*.md docs/intellitrade/architecture/vision/
mv reports/architecture/vision-capacita-*.md docs/capacita/architecture/vision/

# Move general CMS documents
# (Example commands - adjust based on actual file naming patterns)
mv reports/architecture/vision-cms-*.md docs/general/architecture/vision/

# Move any UX reports
mv reports/ux/* docs/general/ux/

# Add additional move commands for other document types
```

### Step 3: Create README Files

Create a README.md in each directory explaining its purpose:

```bash
# Example for main docs directory
echo "# Project Documentation\n\nThis directory contains all documentation for the CMS and its business units." > docs/README.md

# Example for business unit directory
echo "# Latinos Trading Platform Documentation\n\nThis directory contains all documentation specific to the Latinos Trading Platform." > docs/latinos/README.md
```

### Step 4: Update Profile YAML Files

```bash
# Visionary profile update
# Edit .kilocode/profiles/visionary.yaml to update file paths
```

### Step 5: Update References in Existing Documents

Search for and update any cross-references between documents:

```bash
# Example search command to find references to old paths
grep -r "reports/architecture" --include="*.md" .
```

## 5. Implementation Timeline

### Phase 1: Setup (Day 1)
- Create the new directory structure
- Create README files for each directory

### Phase 2: Migration (Days 2-3)
- Move existing files to their new locations
- Update cross-references within documents

### Phase 3: Profile Updates (Day 4)
- Update all agent profiles to reference new paths
- Test that all agents can access appropriate directories

### Phase 4: Documentation (Day 5)
- Update documentation guidelines
- Communicate changes to the team
- Create examples for each document type

## 6. New Motto

As suggested, we'll add this to our mottos:

> **"Clarity comes step by step."**

This reflects our iterative approach to organization and improvement, acknowledging that the best structures often emerge through the process of building and refining.

## 7. Next Steps

1. Approve the proposed structure
2. Create initial directory structure
3. Begin migrating existing documents
4. Update agent profiles
5. Communicate changes to team
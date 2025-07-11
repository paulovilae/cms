# Profile Updates for New Document Structure

This document outlines the necessary updates to agent profiles to support the new document structure defined in [Document Structure Migration Plan](document-structure-migration-plan.md).

## Required Changes to Visionary Profile

The Visionary profile (`.kilocode/profiles/visionary.yaml`) needs to be updated to reflect the new document structure. These changes will need to be implemented in Code mode since Architect mode cannot edit YAML files.

### Current Configuration

```yaml
# Current Documentation & Handoff section
### 4. Documentation & Handoff
- Save all vision packages to `reports/architecture/vision-[project-name]-[date].md`
- Structure visions so Architects can extract implementable elements
- Provide clear principles that can guide all future decisions
- Create inspiration that survives the transition to technical planning
```

### Updated Configuration

```yaml
# Updated Documentation & Handoff section
### 4. Documentation & Handoff
- For general CMS visions: Save to `docs/general/architecture/vision/vision-[feature]-[date].md`
- For business-specific visions: Save to `docs/[business-name]/architecture/vision/vision-[feature]-[date].md`
- Structure visions so Architects can extract implementable elements
- Provide clear principles that can guide all future decisions
- Create inspiration that survives the transition to technical planning
```

### File Access Permissions

The edit permissions also need to be updated:

```yaml
# Current permissions
groups:
  - read
  - - edit
    - fileRegex: \.(md|json)$
      description: Vision documents and concept files

# Updated permissions
groups:
  - read
  - - edit
    - fileRegex: \.(md|json)$
      description: Vision documents and concept files
    - directory: docs/
      description: Documentation directory
```

## Required Changes to Architect Profile

The Architect profile also needs to be updated to reference the new documentation paths:

```yaml
# Current permissions
groups:
  - read
  - - edit
    - fileRegex: \.md$
      description: Markdown files only
    - directory: ./reports/architecture/
      description: Architecture documentation

# Updated permissions
groups:
  - read
  - - edit
    - fileRegex: \.md$
      description: Markdown files only
    - directory: ./docs/
      description: Documentation directory
```

## Required Changes to Other Profiles

All other agent profiles that reference specific documentation directories will need similar updates:

### UX Expert Profile

```yaml
# Current permissions
groups:
  - read
  - - edit
    - fileRegex: \.(md|css)$
      description: Markdown reports and CSS files
    - directory: ./reports/ux/
      description: UX reports directory

# Updated permissions
groups:
  - read
  - - edit
    - fileRegex: \.(md|css)$
      description: Markdown reports and CSS files
    - directory: ./docs/general/ux/
      description: General UX documentation
    - directory: ./docs/*/ux/
      description: Business-specific UX documentation
```

### Documentor Profile

```yaml
# Current permissions
groups:
  - read
  - - edit
    - fileRegex: \.md$
      description: Markdown files only
    - directory: ./reports/documentation/
      description: Documentation directory

# Updated permissions
groups:
  - read
  - - edit
    - fileRegex: \.md$
      description: Markdown files only
    - directory: ./docs/
      description: Documentation directory
```

### Analyst Profile

```yaml
# Current permissions
groups:
  - read
  - - edit
    - fileRegex: \.(md|csv|json)$
      description: Reports and data files
    - directory: ./reports/analytics/
      description: Analytics reports directory

# Updated permissions
groups:
  - read
  - - edit
    - fileRegex: \.(md|csv|json)$
      description: Reports and data files
    - directory: ./docs/general/analytics/
      description: General analytics documentation
    - directory: ./docs/*/analytics/
      description: Business-specific analytics documentation
```

## Implementation Steps

1. Switch to Code mode, which has permissions to edit YAML files
2. Update the Visionary profile with the new document structure references
3. Update all other agent profiles to reference the new documentation paths
4. Test each agent's ability to access the appropriate documentation directories
5. Update any documentation guidelines to reflect the new structure

## Motto Addition

As suggested, we'll add this to our mottos:

> **"Clarity comes step by step."**

This reflects our iterative approach to organization and improvement, acknowledging that the best structures often emerge through the process of building and refining.
# Additional Directories Analysis

This document provides a critical analysis of additional directories in the project that need to be addressed in our restructuring plan.

## Current Directory Assessment

Looking beyond our initial focus, we've identified several other important directories:

### 1. `/infrastructure`
```
infrastructure/
├── ci/
├── database/
│   ├── migration/
│   └── migration-plans/
├── deployment/
├── monitoring/
└── scripts/
    ├── database/
    ├── migration/
    ├── system/
    └── utilities/
```

### 2. `/locales`
```
locales/
├── en/
└── es/
```

### 3. `/public`
```
public/
└── media/
```

### 4. `/reports` (being migrated)
```
reports/
├── analytics/
├── architecture/
├── coordination/
├── documentation/
├── performance/
├── security/
└── ux/
```

### 5. `/scripts`
```
scripts/
```

## Critical Analysis

### Conceptual Separation: Code vs. Documentation

The most critical issue is maintaining proper **separation of concerns** between:
- **Operational code/resources** - Files that the system uses to function
- **Documentation** - Files that describe the system for humans

**Mixing these is an anti-pattern** that leads to:
- Confusion about which files serve which purpose
- Difficulty maintaining clean separation of concerns
- Challenges with access control and permissions
- Potential security issues from mixing code and documentation

### Recommendation: DO NOT Mix Code and Documentation

I strongly recommend **against** moving operational directories (`infrastructure`, `locales`, `scripts`) into the `docs/` directory for several reasons:

1. **Different Usage Patterns**:
   - Code directories are used by the system
   - Documentation directories are used by humans

2. **Different Security Requirements**:
   - Code directories need stricter access controls
   - Documentation can have broader read access

3. **Different Deployment Patterns**:
   - Code changes require testing and careful deployment
   - Documentation changes can be more fluid

4. **Different Lifecycle Management**:
   - Code has dependencies, versioning requirements
   - Documentation has different versioning needs

## Proposed Approach

Instead of merging these directories, I recommend a **complementary documentation** approach:

### 1. Keep Operational Directories Separate
Maintain `/infrastructure`, `/locales`, `/scripts`, `/public`, `/tests` as operational directories.

### 2. Create Documentation Counterparts
Create documentation about these components in the `docs/` structure:

```
docs/
├── general/
│   ├── infrastructure/         # Documentation ABOUT infrastructure
│   ├── localization/           # Documentation ABOUT localization
│   ├── scripts/                # Documentation ABOUT scripts
│   └── testing/                # Documentation ABOUT testing
└── [business]/
    ├── infrastructure/         # Business-specific infrastructure docs
    ├── localization/           # Business-specific localization docs
    └── testing/                # Business-specific testing docs
```

### 3. Clear Cross-References
Ensure documentation clearly references the corresponding code:

```markdown
# Infrastructure Documentation

This document describes the CI/CD pipeline defined in
[infrastructure/ci/](../../../infrastructure/ci/).

## Pipeline Stages

The pipeline defined in [pipeline.yml](../../../infrastructure/ci/pipeline.yml)
includes the following stages...
```

## Specific Recommendations

### 1. Infrastructure
- **Keep Separate**: `/infrastructure` contains actual configuration and code
- **Document In**: `docs/general/infrastructure/` and `docs/[business]/infrastructure/`

### 2. Locales
- **Keep Separate**: `/locales` contains actual translation files used by the application
- **Document In**: `docs/general/localization/` for process, standards, and practices
- **Business-Specific**: `docs/[business]/localization/` for business-specific terminology

### 3. Reports (Being Migrated)
- **Continue Migration**: We're already moving `/reports` into our new doc structure
- **Complete Transition**: Finish moving all content and then remove the directory

### 4. Scripts
- **Keep Separate**: `/scripts` contains operational code used for system functions
- **Document In**: `docs/general/scripts/` for script documentation
- **Consider Organization**: Within scripts, consider general/ and business/ separation

### 5. Public
- **Keep Separate**: `/public` contains web-accessible assets used by the application
- **Document In**: `docs/general/assets/` alongside our assets migration plan

## Testing Directory Approach

For `/tests`, I recommend:

- **Keep Separate**: Tests are operational code, not documentation
- **Consider Reorganization**: 
  ```
  tests/
  ├── general/           # Cross-platform tests
  └── [business]/        # Business-specific tests
  ```
- **Document In**: `docs/general/testing/` for test practices and standards

## Code vs. Documentation Boundaries

The most critical principle is maintaining clear boundaries between:

1. **Code Repositories**: Operational code that makes the system work
   - `/src`
   - `/infrastructure`
   - `/scripts`
   - `/locales`
   - `/public`
   - `/tests`

2. **Documentation Repositories**: Information about the system
   - `/docs`
   - (migrated from `/reports`)

3. **Asset Repositories**: Visual and content elements
   - `/assets` (reorganized by business)
   - (migrated from `/content`)

## Recommended Directory Structure Summary

```
/                               # Project root
├── assets/                     # Visual assets (reorganized by business)
│   ├── general/
│   └── [business]/
│
├── docs/                       # Documentation (reorganized by business)
│   ├── general/
│   │   ├── architecture/
│   │   ├── coordination/
│   │   ├── analytics/
│   │   ├── infrastructure/     # Docs ABOUT infrastructure
│   │   ├── localization/       # Docs ABOUT localization
│   │   ├── scripts/            # Docs ABOUT scripts
│   │   └── testing/            # Docs ABOUT testing
│   │
│   └── [business]/
│       ├── architecture/
│       ├── analytics/
│       ├── infrastructure/
│       ├── localization/
│       └── testing/
│
├── infrastructure/             # ACTUAL infrastructure code (keep as is)
├── locales/                    # ACTUAL localization files (keep as is)
├── public/                     # ACTUAL public assets (keep as is)
├── scripts/                    # ACTUAL scripts (keep as is)
│   ├── general/                # (optional reorganization)
│   └── [business]/             # (optional reorganization)
│
├── src/                        # Application source (keep as is)
└── tests/                      # ACTUAL tests (keep as is)
    ├── general/                # (optional reorganization)
    └── [business]/             # (optional reorganization)
```

## Critical Evaluation

### Pros of This Approach
- **Clear Separation of Concerns**: Code vs. documentation vs. assets
- **Consistent Business-Specific Organization**: Each business has its documentation
- **Improved Discoverability**: Documentation clearly organized by type and business
- **Better Security Boundaries**: Can apply different permissions to code vs. docs
- **Operational Stability**: Doesn't disrupt actual functional code

### Cons of This Approach
- **More Directories**: Creates more top-level directories
- **Cross-References**: Requires careful linking between docs and code
- **Migration Effort**: More work to create documentation for operational code

## Conclusion

While it might seem appealing to consolidate everything into a single directory structure, the critical distinction between **operational code** and **documentation about code** must be maintained.

I strongly recommend keeping operational directories (`infrastructure`, `locales`, `scripts`, `public`, `tests`) separate from documentation directories (`docs`), while ensuring comprehensive documentation about these operational components exists within the `docs` structure.

This approach balances the need for organization with the practical realities of how different types of files are used in the system.
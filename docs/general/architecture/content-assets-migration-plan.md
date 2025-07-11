# Content and Assets Migration Plan

This document outlines the plan for restructuring the `content/` and `assets/` directories to align with our new documentation organization strategy.

## Current Assessment

### Assets Directory
```
assets/
├── README.md
├── icons/
├── images/
└── styles/
```

- Currently organized by asset type (icons, images, styles)
- No business-specific organization
- Used by Graphic Designer agent and others

### Content Directory
```
content/
├── README.md
├── documentation/
├── marketing/
└── web/
```

- Currently organized by content type (web, marketing, documentation)
- Overlaps with our new `docs/` structure
- Potential duplication and confusion with documentation

## Recommended Changes

### 1. Remove Content Directory ✅

The `content/` directory should be removed because:
- Its `documentation/` subdirectory duplicates functionality in our new `docs/` structure
- The separation between "content" and "documentation" creates artificial boundaries
- Managing content in two separate directory structures is inefficient

**Migration Path:**
- Move valuable content from `content/documentation/` to appropriate locations in `docs/`
- Move marketing content to `assets/marketing/` (transitional) and eventually to business-specific locations
- Move web content to appropriate business directories in the new structure

### 2. Restructure Assets Directory ✅

The `assets/` directory should be reorganized to mirror our `docs/` structure:

```
assets/
├── README.md
├── general/                       # Cross-platform assets
│   ├── icons/                     # Shared icons
│   ├── images/                    # Shared images
│   └── styles/                    # Global styles
│
├── latinos/                       # Latinos-specific assets
│   ├── icons/
│   ├── images/
│   └── styles/
│
├── salarium/                      # Salarium-specific assets
│   ├── icons/
│   ├── images/
│   └── styles/
│
├── intellitrade/                  # IntelliTrade-specific assets
│   ├── icons/
│   ├── images/
│   └── styles/
│
└── capacita/                      # Capacita-specific assets
    ├── icons/
    ├── images/
    └── styles/
```

**Benefits:**
- Clear separation of business-specific visual assets
- Consistent structure with documentation
- Simplified asset management for each business unit
- Prevents cross-contamination of design elements

## Implementation Steps

### Phase 1: Assets Reorganization

1. **Create new structure**:
   - Create business-specific subdirectories in `assets/`
   - Set up type directories (icons, images, styles) within each
   - Update README.md to reflect new organization

2. **Update Graphic Designer profile**:
   - Modify profile to support business-specific asset paths
   - Ensure proper directory permissions for new structure

3. **Migrate existing assets**:
   - Catalog all existing assets
   - Determine business ownership for each asset
   - Move to appropriate business-specific locations

### Phase 2: Content Removal

1. **Content audit**:
   - Identify all content in the `content/` directory
   - Determine new locations in either `docs/` or `assets/`
   
2. **Migration execution**:
   - Move documentation to appropriate `docs/` locations
   - Move marketing materials to appropriate `assets/` locations
   - Update any references to old content paths

3. **Cleanup**:
   - Remove empty directories
   - Delete `content/` directory after migration
   - Update any agent profiles that referenced `content/`

## Profile Updates Required

- **Graphic Designer**: Update to reference business-specific asset directories
- **Content Creator**: Redirect to use `docs/` structure instead of `content/`
- **UX Expert**: Update to reference business-specific style assets
- **Documentation**: Ensure access to both `docs/` and necessary `assets/`

## Approval Request

Before proceeding with this plan, we need approval on:

1. Removal of the `content/` directory and migration of its contents
2. Reorganization of `assets/` to mirror the business-unit structure
3. Updating affected agent profiles to support the new organization

## Next Steps

Upon approval, this work can be scheduled as Phase 3 of our document structure migration, following the completion of the current documentation structure implementation.
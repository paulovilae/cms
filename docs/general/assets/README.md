# Assets Documentation

This directory contains documentation about the visual assets used across the multi-tenant CMS platform.

## Purpose

This documentation helps:
- Establish consistent asset usage guidelines
- Document the asset organization structure
- Provide standards for asset creation and management
- Track asset-related decisions and changes

## Asset Organization

The platform's assets are organized in a business-specific structure:

```
assets/
├── general/        # Platform-wide shared assets
│   ├── icons/      # Shared icon sets
│   ├── images/     # Shared images
│   └── styles/     # Global styles
│
├── latinos/        # Latinos Trading Platform assets
├── salarium/       # Salarium HR Platform assets
├── intellitrade/   # IntelliTrade Finance Platform assets
└── capacita/       # Capacita Training Platform assets
```

## Asset Guidelines

### General Guidelines
- Use SVG format for icons and illustrations when possible
- Optimize all images for web performance
- Follow naming conventions consistently
- Document usage context for specialized assets
- Maintain proper attribution and licensing information

### Business-Specific Themes
Each business unit has its own visual identity that should be respected:

- **Latinos**: Trading-focused with financial visualizations, data-rich interfaces
- **Salarium**: HR-focused with professional, organized appearance
- **IntelliTrade**: Finance-focused with secure, trustworthy appearance
- **Capacita**: Education-focused with engaging, motivational elements

## Asset Migration

The asset directories are being reorganized according to the [Content and Assets Migration Plan](../architecture/content-assets-migration-plan.md), which includes:

1. Reorganizing assets into business-specific directories
2. Moving documentation content from the old `content/` directory to appropriate locations in `docs/`
3. Updating references to assets throughout the codebase

## Related Resources

- [Asset Directories](../../../assets/) - Actual asset files
- [Graphic Designer Profile](../../../.kilocode/profiles/graphic-designer-export.yaml) - Agent responsible for assets
- [UX Guidelines](../ux/) - User experience standards that inform asset usage
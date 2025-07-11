# Assets Directory

This directory contains visual and design assets for the multi-tenant CMS platform.

## Purpose

- Centralized location for all visual elements and design resources
- Organized structure to manage business-specific assets
- Consistent source for design elements across the project

## Directory Structure

This directory is organized by business unit to maintain clear separation of assets:

```
assets/
├── general/        # Platform-wide shared assets
│   ├── icons/      # Shared icon sets
│   ├── images/     # Shared images
│   └── styles/     # Global styles
│
├── latinos/        # Latinos Trading Platform assets
│   ├── icons/      # Trading-specific icons
│   ├── images/     # Latinos-specific images
│   └── styles/     # Latinos-specific styles
│
├── salarium/       # Salarium HR Platform assets
│   ├── icons/      # HR-specific icons
│   ├── images/     # Salarium-specific images
│   └── styles/     # Salarium-specific styles
│
├── intellitrade/   # IntelliTrade Finance Platform assets
│   ├── icons/      # Finance-specific icons
│   ├── images/     # IntelliTrade-specific images
│   └── styles/     # IntelliTrade-specific styles
│
└── capacita/       # Capacita Training Platform assets
    ├── icons/      # Training-specific icons
    ├── images/     # Capacita-specific images
    └── styles/     # Capacita-specific styles
```

## Business Unit Assets

- [General Assets](./general/) - Platform-wide shared assets
- [Latinos Assets](./latinos/) - Trading platform assets
- [Salarium Assets](./salarium/) - HR platform assets
- [IntelliTrade Assets](./intellitrade/) - Finance platform assets
- [Capacita Assets](./capacita/) - Training platform assets

## Usage Guidelines

- Place assets in the appropriate business-specific directory
- Use general/ only for truly cross-platform assets
- Maintain proper image optimization for web usage
- Follow naming conventions for clarity and organization
- Ensure all assets comply with licensing requirements
- Document the source and usage context for each asset
- Coordinate with the Graphic Designer agent for asset creation and management

## Related Documentation

- [Assets Documentation](../docs/general/assets/) - Guidelines and standards
- [Content Migration Plan](../docs/general/architecture/content-assets-migration-plan.md) - Migration details
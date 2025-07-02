# Payload CMS Development Guide

## Overview

This guide covers essential Payload CMS concepts, patterns, and best practices for the IntelliTrade project. Payload CMS is a headless content management system built on Next.js that provides a flexible, code-first approach to content management.

## Core Architecture

### Project Structure
```
src/
├── collections/          # Content collections (data models)
├── blocks/              # Reusable content blocks
├── plugins/             # Custom and third-party plugins
├── globals/             # Global configurations (Header, Footer)
├── components/          # React components
├── app/                 # Next.js App Router structure
│   ├── (frontend)/      # Public website
│   └── (payload)/       # Admin interface
└── payload.config.ts    # Main Payload configuration
```

### Configuration Patterns

The main configuration file (`src/payload.config.ts`) defines:
- **Database adapter**: SQLite for development
- **Collections**: Content types (Pages, Posts, Media, etc.)
- **Globals**: Site-wide settings (Header, Footer)
- **Plugins**: Extended functionality
- **Admin UI**: Customizations and branding
- **Internationalization**: Multi-language support (English/Spanish)

## Collections Development

### Basic Collection Structure
```typescript
import { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // ... more fields
  ],
}
```

### Field Types Reference
- **Text**: Simple text input
- **Textarea**: Multi-line text
- **RichText**: WYSIWYG editor with Lexical
- **Number**: Numeric input
- **Email**: Email validation
- **Select**: Dropdown options
- **Relationship**: Links to other collections
- **Upload**: File/media uploads
- **Array**: Repeatable field groups
- **Blocks**: Flexible content blocks
- **Group**: Field grouping
- **Tabs**: Organize fields in tabs

### Advanced Field Configuration
```typescript
{
  name: 'status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
  admin: {
    position: 'sidebar',
  },
}
```

## Blocks System

Blocks provide flexible, reusable content components. They're defined in `src/blocks/` and used in collections with rich content needs.

### Block Structure
```
src/blocks/MyBlock/
├── Component.tsx        # React component
├── config.ts           # Block configuration
└── index.ts            # Export file
```

### Block Configuration Pattern
```typescript
import { Block } from 'payload'

export const MyBlock: Block = {
  slug: 'myBlock',
  labels: {
    singular: 'My Block',
    plural: 'My Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // ... more fields
  ],
}
```

## Plugin Development

### Plugin Architecture
Plugins are functions that receive a Payload config and return a modified config:

```typescript
import { Config, Plugin } from 'payload'

export const myPlugin: Plugin = (incomingConfig: Config): Config => {
  return {
    ...incomingConfig,
    // Your modifications here
  }
}
```

### Official Plugins in Use
1. **Redirects Plugin**: URL redirection management
2. **Nested Docs Plugin**: Hierarchical document relationships
3. **SEO Plugin**: Meta tags and SEO optimization
4. **Form Builder Plugin**: Dynamic form creation
5. **Search Plugin**: Full-text search functionality

### Custom Plugin Example
```typescript
export const addLastModified: Plugin = (incomingConfig: Config): Config => {
  const authEnabledCollections = incomingConfig.collections.filter(
    (collection) => Boolean(collection.auth),
  )

  return {
    ...incomingConfig,
    collections: incomingConfig.collections.map((collection) => ({
      ...collection,
      fields: [
        ...collection.fields,
        {
          name: 'lastModifiedBy',
          type: 'relationship',
          relationTo: authEnabledCollections.map(({ slug }) => slug),
          hooks: {
            beforeChange: [
              ({ req }) => ({
                value: req?.user?.id,
                relationTo: req?.user?.collection,
              }),
            ],
          },
          admin: {
            position: 'sidebar',
            readOnly: true,
          },
        },
      ],
    })),
  }
}
```

## Styling with Tailwind CSS

### Design Token System
The project uses a comprehensive design token framework in `tailwind.config.mjs`:

```javascript
// Component tokens
component: {
  bg: 'var(--component-bg)',
  'bg-elevated': 'var(--component-bg-elevated)',
  border: 'var(--component-border)',
  text: 'var(--component-text)',
  'text-muted': 'var(--component-text-muted)',
  'text-strong': 'var(--component-text-strong)',
}

// Button tokens
button: {
  'primary-bg': 'var(--button-primary-bg)',
  'primary-text': 'var(--button-primary-text)',
  'primary-hover': 'var(--button-primary-hover)',
  // ... more button variants
}

// Status indicators
status: {
  'success-bg': 'var(--status-success-bg)',
  'success-text': 'var(--status-success-text)',
  'success-border': 'var(--status-success-border)',
  // ... warning, error variants
}
```

### Component Styling Patterns
```typescript
// Using design tokens with conditional classes
export const MyComponent: React.FC<Props> = ({ variant, className }) => {
  return (
    <div className={cn(
      // Base styles
      'p-6 rounded-lg border',
      // Variant styles
      {
        'bg-component-bg border-component-border': variant === 'default',
        'bg-status-success-bg border-status-success-border': variant === 'success',
      },
      // Custom className
      className
    )}>
      {/* Component content */}
    </div>
  )
}
```

### CSS Variables for Theming
```css
:root {
  --component-bg: hsl(0 0% 100%);
  --component-text: hsl(222.2 84% 4.9%);
  --button-primary-bg: hsl(222.2 47.4% 11.2%);
  --status-success-bg: hsl(143 85% 96%);
}

[data-theme="dark"] {
  --component-bg: hsl(222.2 84% 4.9%);
  --component-text: hsl(210 40% 98%);
  /* ... dark theme overrides */
}
```

## Hooks and Lifecycle

### Common Hook Types
- **beforeValidate**: Before field validation
- **beforeChange**: Before saving to database
- **afterChange**: After saving to database
- **beforeRead**: Before reading from database
- **afterRead**: After reading from database

### Hook Implementation
```typescript
const beforeChangeHook = ({ data, req }) => {
  // Add timestamp
  data.lastModified = new Date()
  
  // Add user info
  if (req.user) {
    data.lastModifiedBy = req.user.id
  }
  
  return data
}

// In collection config
export const MyCollection: CollectionConfig = {
  // ...
  hooks: {
    beforeChange: [beforeChangeHook],
  },
}
```

## Access Control

### Collection-Level Access
```typescript
export const MyCollection: CollectionConfig = {
  // ...
  access: {
    read: () => true, // Public read access
    create: ({ req }) => !!req.user, // Authenticated users can create
    update: ({ req }) => !!req.user, // Authenticated users can update
    delete: ({ req }) => req.user?.role === 'admin', // Only admins can delete
  },
}
```

### Field-Level Access
```typescript
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
  },
}
```

## Live Preview Configuration

```typescript
// In payload.config.ts
admin: {
  livePreview: {
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
  },
}
```

## Internationalization

### Configuration
```typescript
i18n: {
  fallbackLanguage: 'en',
  supportedLanguages: { en, es },
  translations: {
    en: {
      general: { dashboard: 'Dashboard' },
      custom: { welcome: 'Welcome to IntelliTrade CMS' },
    },
    es: {
      general: { dashboard: 'Panel de Control' },
      custom: { welcome: 'Bienvenido al CMS de IntelliTrade' },
    },
  },
}
```

## Common Development Patterns

### Conditional Fields
```typescript
{
  name: 'linkType',
  type: 'radio',
  options: [
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
  ],
},
{
  name: 'internalLink',
  type: 'relationship',
  relationTo: 'pages',
  admin: {
    condition: (data) => data.linkType === 'internal',
  },
}
```

### Rich Text with Custom Blocks
```typescript
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      BlocksFeature({
        blocks: [CallToActionBlock, MediaBlock],
      }),
    ],
  }),
}
```

### File Uploads
```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
```

## Best Practices

### Collection Design
- Use descriptive field names
- Group related fields with tabs or groups
- Add helpful admin descriptions
- Consider field validation requirements

### Performance
- Use relationships judiciously
- Implement proper indexing for large datasets
- Consider pagination for large collections

### Security
- Implement proper access controls
- Validate user inputs
- Use environment variables for sensitive data

### Content Strategy
- Design flexible block systems
- Plan for content reusability
- Consider SEO requirements early

## Troubleshooting

### Common Issues
1. **Type Generation**: Run `pnpm generate:types` after schema changes
2. **Database Issues**: Check SQLite file permissions and path
3. **Plugin Conflicts**: Verify plugin compatibility and load order

### Debug Mode
Enable debug logging in development:
```typescript
// In payload.config.ts
debug: process.env.NODE_ENV === 'development',
```

## Database Seeding

### Critical: Use the Standalone Seed Script

**IMPORTANT**: Always use the standalone seed script at the project root (`seed-script.js`) for database seeding. Direct seeding through Payload API calls will fail due to authentication requirements.

### Seed Script Setup

The project includes a pre-configured seed script that handles authentication:

```bash
# Run the seed script (requires dev server to be running)
node seed-script.js

# Or use the Windows batch file
seed.bat
```

### How the Seed Script Works

1. **Authentication**: Logs in with test credentials (`test@test.com` / `test`)
2. **Cookie Management**: Extracts and passes authentication cookies
3. **API Request**: Makes authenticated request to `/next/seed` endpoint
4. **Data Creation**: Seeds all collections with demo data

### Prerequisites for Seeding

1. **Development server must be running**: `npm run dev` or `pnpm dev`
2. **Test user must exist**: Email `test@test.com` with password `test`
3. **Environment variables**: Optionally set `SEED_EMAIL` and `SEED_PASSWORD`

### Seed Script Configuration

```javascript
// Default credentials (can be overridden with env vars)
const credentials = {
  email: process.env.SEED_EMAIL || 'test@test.com',
  password: process.env.SEED_PASSWORD || 'test'
}

// Server URL configuration
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
```

### Troubleshooting Seeding Issues

1. **Connection Refused**: Ensure dev server is running on correct port
2. **Authentication Errors**: Verify test user exists with correct credentials
3. **Permission Errors**: Use the standalone script, not direct API calls
4. **Data Conflicts**: Consider clearing database before re-seeding

### Why Direct Seeding Fails

Direct calls to Payload's seeding functions fail because:
- Authentication context is not properly established
- Session cookies are not available
- User permissions are not validated
- Request context is missing

**Always use `node seed-script.js` for reliable seeding.**

## Development Workflow

1. **Schema Changes**: Update collection/block configurations
2. **Type Generation**: Run `pnpm generate:types`
3. **Component Updates**: Update React components to match schema
4. **Database Seeding**: Use `node seed-script.js` for demo data
5. **Testing**: Test in admin interface and frontend
6. **Documentation**: Update relevant documentation

This guide serves as a reference for common Payload CMS development patterns and should be consulted when implementing new features or troubleshooting issues.
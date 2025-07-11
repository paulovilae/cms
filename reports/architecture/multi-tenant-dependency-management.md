# Multi-Tenant Dependency Management

## Problem Statement

Our multi-tenant CMS architecture is currently experiencing a critical architectural flaw: **one business's dependencies can break other businesses**. Specifically:

1. IntelliTrade container is failing to build because it cannot resolve `slate` dependencies required by the `job-flow-cascade` plugin used in Salarium.
2. Next.js analyzes all source files at build time regardless of whether they're actually imported by the current business context.
3. The current Docker-based deployment isolates the runtime, but not the build process.

This creates a cascading failure problem where unrelated businesses can affect each other, violating tenant isolation principles.

## Architectural Requirements

- **Dependency Isolation**: Each business should only need dependencies it actually uses
- **Build Separation**: Error in one business's code should not break other businesses
- **No File Moving**: Solution should not involve physically moving files
- **Graceful Degradation**: Components should fall back gracefully when dependencies are missing
- **Maintainability**: Solution should improve architectural clarity, not add technical debt

## Proposed Solutions

### 1. Plugin Interface System with Dependency Inversion

Create a proper abstraction layer for shared functionality:

```typescript
// In src/plugins/interfaces/rich-text-editor.ts
export interface RichTextEditorPlugin {
  initialize(): void;
  createEditor(): any;
}

// In src/plugins/implementations/job-flow-cascade/index.ts
export class SlateRichTextEditor implements RichTextEditorPlugin {
  // Implementation with slate dependencies
}

// In src/plugins/implementations/fallback/index.ts
export class FallbackRichTextEditor implements RichTextEditorPlugin {
  // Simple implementation with no external dependencies
}

// In src/plugins/factory.ts
export function getRichTextEditor(businessMode) {
  if (businessMode === 'salarium') {
    try {
      const { SlateRichTextEditor } = require('./implementations/job-flow-cascade');
      return new SlateRichTextEditor();
    } catch (e) {
      console.warn('Falling back to basic editor due to dependency error');
      const { FallbackRichTextEditor } = require('./implementations/fallback');
      return new FallbackRichTextEditor();
    }
  }
  
  // Default for other business modes
  const { FallbackRichTextEditor } = require('./implementations/fallback');
  return new FallbackRichTextEditor();
}
```

### 2. Dynamic Component Registry

Implement a registry system that conditionally loads components only when needed:

```typescript
// In src/plugins/registry.ts
type ComponentFactory = () => Promise<any>;
const componentRegistry: Record<string, ComponentFactory> = {};

export function registerComponent(name: string, factory: ComponentFactory) {
  componentRegistry[name] = factory;
}

export async function getComponent(name: string, fallback?: any) {
  if (componentRegistry[name]) {
    try {
      return await componentRegistry[name]();
    } catch (error) {
      console.warn(`Failed to load component ${name}:`, error);
      return fallback;
    }
  }
  return fallback;
}

// In src/plugins/job-flow-cascade/index.ts
import { registerComponent } from '../registry';

registerComponent('AutoCascadeWorkspace', () => 
  import('./components').then(mod => mod.AutoCascadeWorkspace)
);

// In any component that needs it
import { getComponent } from '@/plugins/registry';

const Component = await getComponent('AutoCascadeWorkspace', FallbackComponent);
```

### 3. Business-Specific Build Process

Create separate build configurations for each business:

```javascript
// next.config.js
const excludedPlugins = (process.env.EXCLUDED_PLUGINS || '').split(',');
const pluginPaths = excludedPlugins.map(plugin => new RegExp(`src/plugins/${plugin}`));

module.exports = {
  webpack: (config) => {
    if (pluginPaths.length > 0) {
      config.module.rules.push({
        test: (modulePath) => pluginPaths.some(pattern => pattern.test(modulePath)),
        use: 'null-loader'
      });
    }
    return config;
  }
}
```

With appropriate package.json scripts:

```json
"scripts": {
  "build:intellitrade": "BUSINESS_MODE=intellitrade EXCLUDED_PLUGINS=job-flow-cascade next build",
  "build:salarium": "BUSINESS_MODE=salarium next build",
  "build:latinos": "BUSINESS_MODE=latinos EXCLUDED_PLUGINS=job-flow-cascade next build"
}
```

### 4. Parallel Docker Builds with Separate Package Sets

Customize Docker builds for each business:

```dockerfile
# Dockerfile.intellitrade
FROM node:18-alpine AS base
# Skip installing slate dependencies
RUN pnpm install --ignore-scripts --filter=!@plugins/job-flow-cascade

# Dockerfile.salarium  
FROM node:18-alpine AS base
# Install all dependencies including slate
RUN pnpm install
```

## Recommended Approach

A hybrid solution combining approaches #1 and #2 would provide the most robust and maintainable architecture:

1. Implement a **plugin interface system** to properly abstract business-specific functionality
2. Create a **dynamic component registry** for conditional loading
3. Use **try/catch with fallbacks** to handle missing dependencies gracefully

This approach:
- Maintains all files in their original locations
- Properly isolates business-specific functionality
- Handles dependency failures gracefully
- Creates cleaner architecture for future expansion

## Implementation Roadmap

1. Create plugin interface system (1-2 days)
2. Implement dynamic component registry (1 day)
3. Refactor job-flow-cascade to use new system (2-3 days)
4. Update frontend pages to use registry (1 day)
5. Add fallback components for non-Salarium businesses (1-2 days)
6. Testing and validation (1-2 days)

## Long-Term Architectural Improvements

For more robust tenant isolation, consider:
- Separate build pipelines for each business
- Microservice architecture with dedicated service per business
- API gateway for routing business-specific requests
- Shared core with business-specific extensions
# Implementation Plan: Component Registry for Multi-Tenant Dependency Management

## Overview

This document outlines the implementation steps to solve our multi-tenant dependency issue through the component registry approach. This solution will allow us to maintain proper isolation between business services while preventing cascade failures from interdependencies.

## Implementation Steps

### 1. Create Component Registry System

Create a new file at `src/plugins/registry.ts`:

```typescript
/**
 * Component Registry System
 * 
 * A central registry for dynamically loading components with graceful fallbacks.
 * This helps isolate business-specific dependencies and prevent cascade failures
 * when one business's dependencies are missing in another business's container.
 */

type ComponentFactory<T = any> = () => Promise<T>;
type FallbackHandler<T = any> = (error: Error, componentName: string) => T;

interface RegistryOptions {
  businessMode?: string;
  debug?: boolean;
}

class ComponentRegistry {
  private registry: Record<string, ComponentFactory> = {};
  private fallbacks: Record<string, any> = {};
  private globalFallback?: FallbackHandler;
  private options: RegistryOptions;

  constructor(options: RegistryOptions = {}) {
    this.options = {
      businessMode: process.env.BUSINESS_MODE || 'all',
      debug: process.env.NODE_ENV !== 'production',
      ...options,
    };
  }

  /**
   * Register a component factory function
   */
  register<T>(name: string, factory: ComponentFactory<T>, businessModes?: string[]) {
    // Only register if compatible with current business mode
    if (!businessModes || 
        businessModes.includes(this.options.businessMode!) || 
        businessModes.includes('all')) {
      this.registry[name] = factory;
      
      if (this.options.debug) {
        console.log(`[Registry] Registered component "${name}" for business modes: ${businessModes?.join(', ') || 'all'}`);
      }
    } else if (this.options.debug) {
      console.log(`[Registry] Skipped registering "${name}" (not applicable for ${this.options.businessMode})`);
    }
    
    return this;
  }

  /**
   * Register a fallback for a specific component
   */
  registerFallback<T>(name: string, fallback: T) {
    this.fallbacks[name] = fallback;
    return this;
  }

  /**
   * Set a global fallback handler
   */
  setGlobalFallback(handler: FallbackHandler) {
    this.globalFallback = handler;
    return this;
  }

  /**
   * Get a component by name with fallback support
   */
  async getComponent<T>(name: string, localFallback?: T): Promise<T> {
    // If component is registered
    if (this.registry[name]) {
      try {
        return await this.registry[name]();
      } catch (error) {
        if (this.options.debug) {
          console.warn(`[Registry] Failed to load component "${name}":`, error);
        }
        
        // Use fallbacks in order of precedence
        if (localFallback !== undefined) {
          return localFallback;
        } else if (this.fallbacks[name] !== undefined) {
          return this.fallbacks[name];
        } else if (this.globalFallback) {
          return this.globalFallback(error as Error, name);
        }
        
        throw error; // No fallback available
      }
    }
    
    // Component not registered
    if (this.options.debug) {
      console.warn(`[Registry] Component "${name}" not found in registry`);
    }
    
    // Use fallbacks in order of precedence
    if (localFallback !== undefined) {
      return localFallback;
    } else if (this.fallbacks[name] !== undefined) {
      return this.fallbacks[name];
    } else if (this.globalFallback) {
      return this.globalFallback(new Error(`Component "${name}" not found`), name);
    }
    
    throw new Error(`Component "${name}" not found in registry and no fallback provided`);
  }

  /**
   * Check if a component is registered
   */
  isRegistered(name: string): boolean {
    return !!this.registry[name];
  }

  /**
   * Get business mode
   */
  getBusinessMode(): string {
    return this.options.businessMode!;
  }
}

// Export singleton instance
export const registry = new ComponentRegistry();

// Export convenience functions
export const registerComponent = <T>(name: string, factory: ComponentFactory<T>, businessModes?: string[]) => 
  registry.register(name, factory, businessModes);

export const registerFallback = <T>(name: string, fallback: T) => 
  registry.registerFallback(name, fallback);

export const getComponent = <T>(name: string, fallback?: T) => 
  registry.getComponent<T>(name, fallback);
```

### 2. Update Job Flow Cascade Plugin

Modify `src/plugins/job-flow-cascade/index.ts` to use the registry:

```typescript
import { registerComponent } from '../registry';

// Register components only for Salarium and "all" business modes
const businessModes = ['salarium', 'all'];

// Register with dynamic import to avoid immediate loading
registerComponent('AutoCascadeWorkspace', 
  () => import('./components').then(mod => mod.AutoCascadeWorkspace), 
  businessModes
);

// Other components can be registered similarly
registerComponent('AutoCascadeBlock',
  () => import('./blocks/AutoCascadeBlock').then(mod => ({ default: mod.AutoCascadeBlock })),
  businessModes
);
```

### 3. Create Fallback Components

Create minimal fallback implementations:

```typescript
// src/plugins/fallbacks/AutoCascadeWorkspace.tsx
import React from 'react';

export const FallbackAutoCascadeWorkspace = () => (
  <div className="p-4 border border-red-300 bg-red-50 rounded">
    <h2 className="text-xl font-bold text-red-700">Feature Not Available</h2>
    <p className="mt-2">
      The Job Flow feature is only available in Salarium business mode.
    </p>
  </div>
);

// Register the fallback
import { registerFallback } from '../registry';
registerFallback('AutoCascadeWorkspace', FallbackAutoCascadeWorkspace);
```

### 4. Update Frontend Pages

Modify Salarium pages to use the registry:

```tsx
// src/app/(frontend)/salarium/job-flow/page.tsx
import React, { Suspense } from 'react';
import AutoAuthWrapper from '@/components/auth/AutoAuthWrapper';
import { getComponent } from '@/plugins/registry';
import { FallbackAutoCascadeWorkspace } from '@/plugins/fallbacks/AutoCascadeWorkspace';

// Loading component
const LoadingWorkspace = () => (
  <div className="flex justify-center items-center h-64">
    <p className="text-gray-500">Loading Job Flow Manager...</p>
  </div>
);

export default async function SalariumJobFlowPage() {
  // Dynamically load the component with fallback
  const AutoCascadeWorkspace = await getComponent('AutoCascadeWorkspace', FallbackAutoCascadeWorkspace);
  
  return (
    <AutoAuthWrapper>
      <Suspense fallback={<LoadingWorkspace />}>
        <AutoCascadeWorkspace />
      </Suspense>
    </AutoAuthWrapper>
  );
}
```

### 5. Update Next.js Configuration

Update `next.config.js` to ensure Turbopack/webpack properly handles dynamic imports:

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  
  // Webpack configuration for dependency management
  webpack: (config, { isServer }) => {
    // ... existing webpack config
    
    // Optimize dynamic imports for specific business modes
    const businessMode = process.env.BUSINESS_MODE || 'all';
    
    if (businessMode === 'intellitrade' || businessMode === 'latinos') {
      // Use null-loader for slate in non-Salarium businesses
      config.module.rules.push({
        test: /[/\\]node_modules[/\\](slate|slate-react|slate-history)[/\\]/,
        use: 'null-loader',
      });
    }
    
    return config;
  },
  
  // Turbopack configuration
  turbopack: {
    // ... existing turbopack config
    
    // Optimize loading for specific business modes
    resolveAlias: {
      ...(process.env.BUSINESS_MODE !== 'salarium' && {
        'slate': false,
        'slate-react': false,
        'slate-history': false,
      }),
    },
  },
};
```

## Testing Strategy

1. **Unit Tests**: Create tests for registry functionality
2. **Integration Tests**: Verify component loading for different business modes
3. **Docker Tests**: Verify each container builds without dependency errors
4. **Manual Testing**: Test all business UIs to ensure they work as expected

## Rollout Plan

1. Implement registry system (Code mode)
2. Update Job Flow Cascade plugin (Code mode)
3. Create fallback components (Code mode)
4. Update frontend pages (Code mode)
5. Update Next.js configuration (Code mode)
6. Test in development environment
7. Deploy to staging environment
8. Deploy to production environment

## Next Steps

After switching to Code mode, we can implement this solution to properly isolate business dependencies and prevent cascade failures.
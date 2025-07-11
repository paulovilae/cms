# Immediate Fix for IntelliTrade Container

## Quick Solution

While we implement the comprehensive component registry solution outlined in our architectural plan, here's an immediate fix to get the IntelliTrade container working:

## Option 1: Update Next.js Configuration

This simple change to `next.config.js` will exclude slate-related dependencies when building for IntelliTrade:

```javascript
// next.config.js
const nextConfig = {
  // ... existing config
  
  webpack: (config, { isServer }) => {
    // Handle pnpm symlinks properly
    config.resolve.symlinks = false
    
    // Add fallbacks for slate modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
    }
    
    // Business-specific exclusions
    const businessMode = process.env.BUSINESS_MODE || 'all'
    
    if (businessMode === 'intellitrade') {
      // Prevent resolution of slate modules in IntelliTrade
      config.resolve.alias = {
        ...config.resolve.alias,
        'slate': false,
        'slate-react': false,
        'slate-history': false,
      }
      
      console.log('🚫 IntelliTrade mode: Excluding slate dependencies')
    }
    
    return config
  },
}
```

## Option 2: Create Empty Shim Modules

If Option 1 doesn't work, create shim modules to satisfy the imports:

1. Create a directory for shims:
```
mkdir -p src/shims/slate
mkdir -p src/shims/slate-react
mkdir -p src/shims/slate-history
```

2. Create minimal shim files:

`src/shims/slate/index.js`:
```javascript
// Empty shim for slate
export const Editor = {}
export const Element = {}
export const Node = {}
export const Range = {}
export const Text = {}
export const Transforms = {}
export const createEditor = () => ({})
```

`src/shims/slate-react/index.js`:
```javascript
// Empty shim for slate-react
export const Slate = () => null
export const Editable = () => null
export const useSlate = () => ({})
export const withReact = (editor) => editor
```

`src/shims/slate-history/index.js`:
```javascript
// Empty shim for slate-history
export const withHistory = (editor) => editor
```

3. Update Next.js config to use shims:

```javascript
// next.config.js
const path = require('path')

const nextConfig = {
  // ... existing config
  
  webpack: (config, { isServer }) => {
    // ... existing webpack config
    
    // Business-specific exclusions
    const businessMode = process.env.BUSINESS_MODE || 'all'
    
    if (businessMode === 'intellitrade') {
      // Use shims for slate modules in IntelliTrade
      config.resolve.alias = {
        ...config.resolve.alias,
        'slate': path.resolve(__dirname, 'src/shims/slate'),
        'slate-react': path.resolve(__dirname, 'src/shims/slate-react'),
        'slate-history': path.resolve(__dirname, 'src/shims/slate-history'),
      }
      
      console.log('🔄 IntelliTrade mode: Using slate shims')
    }
    
    return config
  },
}
```

## Option 3: Skip Plugin Loading for IntelliTrade

Modify the plugin loading in `src/payload.config.ts`:

```typescript
/**
 * Get active shared feature plugins based on environment
 */
const getSharedFeaturePlugins = () => {
  const enabledFeatures = getEnabledFeatures()
  const businessMode = getBusinessMode()

  // Track which plugins should be included to avoid duplicates
  const pluginsToInclude = new Set<string>()

  // Always include AI Management if Salarium is active
  if (businessMode === 'salarium' || businessMode === 'all') {
    pluginsToInclude.add('aiManagement')
  }

  // Add enabled features
  enabledFeatures.forEach((feature) => {
    pluginsToInclude.add(feature)
  })

  // Create plugin instances only once per unique plugin
  const plugins = []
  if (pluginsToInclude.has('aiManagement')) {
    try {
      const { aiManagementPlugin } = require('./plugins/shared/ai-management')
      plugins.push(aiManagementPlugin())
    } catch (error) {
      console.warn('Failed to load ai-management plugin:', error.message)
    }
  }

  // Always include Job Flow Cascade plugin when Salarium is active,
  // but SKIP for IntelliTrade to avoid dependency issues
  if ((businessMode === 'salarium' || businessMode === 'all') && 
      businessMode !== 'intellitrade') {
    try {
      const jobFlowCascadePlugin = require('./plugins/job-flow-cascade').default
      plugins.push(jobFlowCascadePlugin())
    } catch (error) {
      console.warn('Failed to load job-flow-cascade plugin:', error.message)
    }
  }

  return plugins
}
```

## Recommended Solution

**Option 1** is the simplest and least invasive solution. It works by telling webpack to use an empty module for slate dependencies when building for IntelliTrade.

## Implementation Steps

1. Modify `next.config.js` with the changes from Option 1
2. Restart the IntelliTrade container
3. Verify the build completes without errors
4. Test the IntelliTrade frontend to ensure it works correctly

## Next Steps

After implementing this quick fix, proceed with the comprehensive component registry solution outlined in the implementation plan to provide a more robust, long-term solution.
# Enhanced Design Token System Implementation Plan

## Overview
This document outlines the implementation of an enhanced design token system to eliminate hardcoded CSS values and create a centralized, maintainable styling approach for the IntelliTrade CMS.

## Current Issues
- SmartContractDemo component uses hardcoded hex values (`#111827`, `#374151`, `#1E4EFF`)
- Inconsistent styling approaches across components
- No semantic naming for component-specific colors
- Difficult to maintain and update design consistency

## Implementation Strategy

### Phase 1: Enhance Design Tokens in globals.css

Add component-level semantic tokens to `src/app/(frontend)/globals.css`:

```css
:root {
  /* Existing tokens remain unchanged... */
  
  /* Component-level semantic tokens */
  --component-bg: var(--card);
  --component-bg-elevated: hsl(var(--card) / 0.8);
  --component-border: var(--border);
  --component-text: var(--foreground);
  --component-text-muted: var(--muted-foreground);
  --component-text-strong: var(--foreground);
  --component-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --component-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Button semantic tokens */
  --button-primary-bg: var(--primary);
  --button-primary-text: var(--primary-foreground);
  --button-primary-hover: hsl(var(--primary) / 0.9);
  --button-secondary-bg: var(--secondary);
  --button-secondary-text: var(--secondary-foreground);
  --button-secondary-hover: hsl(var(--secondary) / 0.8);
  --button-disabled-bg: var(--muted);
  --button-disabled-text: var(--muted-foreground);
  
  /* Status semantic tokens */
  --status-success-bg: hsl(var(--success) / 0.1);
  --status-success-text: var(--success);
  --status-success-border: var(--success);
  --status-warning-bg: hsl(var(--warning) / 0.1);
  --status-warning-text: var(--warning);
  --status-warning-border: var(--warning);
  --status-error-bg: hsl(var(--error) / 0.1);
  --status-error-text: var(--error);
  --status-error-border: var(--error);
  
  /* Interactive element tokens */
  --interactive-bg: var(--secondary);
  --interactive-bg-hover: hsl(var(--secondary) / 0.8);
  --interactive-text: var(--secondary-foreground);
  --interactive-border: var(--border);
  
  /* Code block tokens */
  --code-bg: hsl(220, 13%, 18%);
  --code-text: hsl(220, 14%, 71%);
  
  /* Spacing tokens */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border radius tokens */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}

[data-theme='dark'] {
  /* Override tokens for dark theme if needed */
  --component-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --component-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### Phase 2: Update Tailwind Configuration

Extend `tailwind.config.mjs` to include the new design tokens:

```javascript
// Add to the colors section:
colors: {
  // Existing colors...
  
  // Component tokens
  'component': {
    'bg': 'var(--component-bg)',
    'bg-elevated': 'var(--component-bg-elevated)',
    'border': 'var(--component-border)',
    'text': 'var(--component-text)',
    'text-muted': 'var(--component-text-muted)',
    'text-strong': 'var(--component-text-strong)',
  },
  
  // Button tokens
  'button': {
    'primary-bg': 'var(--button-primary-bg)',
    'primary-text': 'var(--button-primary-text)',
    'primary-hover': 'var(--button-primary-hover)',
    'secondary-bg': 'var(--button-secondary-bg)',
    'secondary-text': 'var(--button-secondary-text)',
    'secondary-hover': 'var(--button-secondary-hover)',
    'disabled-bg': 'var(--button-disabled-bg)',
    'disabled-text': 'var(--button-disabled-text)',
  },
  
  // Status tokens
  'status': {
    'success-bg': 'var(--status-success-bg)',
    'success-text': 'var(--status-success-text)',
    'success-border': 'var(--status-success-border)',
    'warning-bg': 'var(--status-warning-bg)',
    'warning-text': 'var(--status-warning-text)',
    'warning-border': 'var(--status-warning-border)',
    'error-bg': 'var(--status-error-bg)',
    'error-text': 'var(--status-error-text)',
    'error-border': 'var(--status-error-border)',
  },
  
  // Interactive tokens
  'interactive': {
    'bg': 'var(--interactive-bg)',
    'bg-hover': 'var(--interactive-bg-hover)',
    'text': 'var(--interactive-text)',
    'border': 'var(--interactive-border)',
  },
  
  // Code tokens
  'code': {
    'bg': 'var(--code-bg)',
    'text': 'var(--code-text)',
  }
},

// Add to spacing section:
spacing: {
  // Existing spacing...
  'xs': 'var(--spacing-xs)',
  'sm': 'var(--spacing-sm)',
  'md': 'var(--spacing-md)',
  'lg': 'var(--spacing-lg)',
  'xl': 'var(--spacing-xl)',
},

// Add to borderRadius section:
borderRadius: {
  // Existing radius...
  'sm': 'var(--radius-sm)',
  'md': 'var(--radius-md)',
  'lg': 'var(--radius-lg)',
  'full': 'var(--radius-full)',
},

// Add to boxShadow section:
boxShadow: {
  // Existing shadows...
  'component': 'var(--component-shadow)',
  'component-sm': 'var(--component-shadow-sm)',
}
```

### Phase 3: Refactor SmartContractDemo Styles

Replace all hardcoded values in `src/blocks/SmartContractDemo/styles.css`:

#### Before (hardcoded):
```css
.smart-contract-demo__heading {
  color: #111827;
}

.smart-contract-demo__step-button {
  background-color: #f0f2f5;
  border: 1px solid #e0e4e8;
  color: #374151;
}

.smart-contract-demo__button {
  background-color: #1E4EFF;
  color: white;
}
```

#### After (design tokens):
```css
.smart-contract-demo__heading {
  color: var(--component-text-strong);
}

.smart-contract-demo__step-button {
  background-color: var(--interactive-bg);
  border: 1px solid var(--interactive-border);
  color: var(--interactive-text);
}

.smart-contract-demo__button {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
}
```

### Phase 4: Create Utility Classes

Add utility classes to Tailwind config for common patterns:

```javascript
// Add to plugins array:
function({ addUtilities }) {
  addUtilities({
    '.btn-primary': {
      'background-color': 'var(--button-primary-bg)',
      'color': 'var(--button-primary-text)',
      'border': 'none',
      'border-radius': 'var(--radius-sm)',
      'padding': 'var(--spacing-sm) var(--spacing-md)',
      'font-weight': '500',
      'cursor': 'pointer',
      'transition': 'all 0.2s',
      '&:hover': {
        'background-color': 'var(--button-primary-hover)',
      },
      '&:disabled': {
        'background-color': 'var(--button-disabled-bg)',
        'color': 'var(--button-disabled-text)',
        'cursor': 'not-allowed',
      }
    },
    '.btn-secondary': {
      'background-color': 'var(--button-secondary-bg)',
      'color': 'var(--button-secondary-text)',
      'border': '1px solid var(--interactive-border)',
      'border-radius': 'var(--radius-sm)',
      'padding': 'var(--spacing-sm) var(--spacing-md)',
      'font-weight': '500',
      'cursor': 'pointer',
      'transition': 'all 0.2s',
      '&:hover': {
        'background-color': 'var(--button-secondary-hover)',
      },
      '&:disabled': {
        'background-color': 'var(--button-disabled-bg)',
        'color': 'var(--button-disabled-text)',
        'cursor': 'not-allowed',
      }
    },
    '.status-badge': {
      'padding': 'var(--spacing-xs) var(--spacing-sm)',
      'border-radius': 'var(--radius-full)',
      'font-size': '0.875rem',
      'font-weight': '500',
    },
    '.status-success': {
      'background-color': 'var(--status-success-bg)',
      'color': 'var(--status-success-text)',
      'border': '1px solid var(--status-success-border)',
    },
    '.status-warning': {
      'background-color': 'var(--status-warning-bg)',
      'color': 'var(--status-warning-text)',
      'border': '1px solid var(--status-warning-border)',
    },
    '.status-error': {
      'background-color': 'var(--status-error-bg)',
      'color': 'var(--status-error-text)',
      'border': '1px solid var(--status-error-border)',
    },
    '.component-card': {
      'background-color': 'var(--component-bg)',
      'border': '1px solid var(--component-border)',
      'border-radius': 'var(--radius-md)',
      'box-shadow': 'var(--component-shadow)',
      'padding': 'var(--spacing-lg)',
    }
  })
}
```

## Implementation Steps

1. **Update globals.css** with enhanced design tokens
2. **Update tailwind.config.mjs** with new color and utility definitions
3. **Refactor SmartContractDemo/styles.css** to use design tokens
4. **Test the changes** to ensure proper theming and contrast
5. **Document the new system** for other developers
6. **Create migration guide** for future components

## Benefits

1. **Centralized Design System**: Single source of truth for all design decisions
2. **Theme Consistency**: Automatic support for light/dark themes
3. **Maintainability**: Easy to update colors and spacing across the entire application
4. **Developer Experience**: Clear semantic naming and utility classes
5. **Accessibility**: Consistent contrast ratios and color usage
6. **Scalability**: Easy to extend for new components and design needs

## Mapping of Current Hardcoded Values

| Current Hardcoded Value | New Design Token | Purpose |
|------------------------|------------------|---------|
| `#111827` | `var(--component-text-strong)` | Strong text color |
| `#374151` | `var(--component-text-muted)` | Muted text color |
| `#1f2937` | `var(--component-text)` | Regular text color |
| `#1E4EFF` | `var(--button-primary-bg)` | Primary button background |
| `#0a38e0` | `var(--button-primary-hover)` | Primary button hover |
| `#f0f2f5` | `var(--interactive-bg)` | Interactive element background |
| `#e0e4e8` | `var(--interactive-border)` | Interactive element border |
| `#28a745` | `var(--status-success-text)` | Success status color |
| `#ffc107` | `var(--status-warning-text)` | Warning status color |
| `#ffffff` | `var(--component-bg)` | Component background |
| `8px` | `var(--radius-md)` | Medium border radius |
| `4px` | `var(--radius-sm)` | Small border radius |
| `1.5rem` | `var(--spacing-lg)` | Large spacing |
| `1rem` | `var(--spacing-md)` | Medium spacing |

## Next Steps

After implementing this proof of concept with SmartContractDemo:

1. **Evaluate the results** and gather feedback
2. **Refine the token system** based on usage patterns
3. **Create documentation** for the design system
4. **Gradually migrate other components** if they have hardcoded values
5. **Establish linting rules** to prevent future hardcoded values
6. **Create component templates** that use the design system

This approach maintains the existing well-structured Tailwind + CSS custom properties system while eliminating hardcoded values and improving maintainability.
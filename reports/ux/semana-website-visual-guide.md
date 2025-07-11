# Semana.com Visual Redesign Guide

This document provides visual guidelines and recommendations to accompany the detailed action plan for Semana.com redesign.

## Color System Recommendations

### Current vs. Proposed Color Palette

**Current Primary Colors:**
- Brand Red: #E3000B
- Text Black: #000000
- Background White: #FFFFFF
- Accent Green: #8CC63F

**Proposed Extended Color System:**

*Primary Brand Colors:*
- Primary Red: #E3000B
- Dark Red: #B10008
- Light Red: #FF4D55

*Section Color Coding:*
- Politics: #4A6FE3 (Blue)
- Economy: #2D9D78 (Green)
- Nation: #9C27B0 (Purple)
- World: #FF9800 (Orange)
- Opinion: #795548 (Brown)
- Sports: #03A9F4 (Light Blue)

*Neutrals:*
- Dark Gray: #212121
- Medium Gray: #757575
- Light Gray: #E0E0E0
- Off-White: #F5F5F5

*UI Accents:*
- Success: #4CAF50
- Warning: #FFC107
- Error: #F44336
- Info: #2196F3

*Accessibility Enhancements:*
- All color combinations must meet WCAG 2.1 AA standard (4.5:1 for normal text)
- Text on colored backgrounds should use optimized contrast values

## Typography System

### Current vs. Proposed Typography

**Current Typography:**
- Headlines: Serif font (inconsistent sizing)
- Body: Sans-serif font (dense spacing)
- Mixed line heights and inconsistent hierarchy

**Proposed Typography System:**

*Font Families:*
- Headlines: Georgia or Merrifield (serif)
- Body Text: Source Sans Pro or Open Sans (sans-serif)
- UI Elements: Source Sans Pro or Open Sans (sans-serif)

*Type Scale (8pt system):*
- H1: 40px/48px (2.5rem), weight: 700
- H2: 32px/40px (2rem), weight: 700
- H3: 24px/32px (1.5rem), weight: 700
- H4: 20px/28px (1.25rem), weight: 700
- H5: 18px/24px (1.125rem), weight: 700
- H6: 16px/24px (1rem), weight: 700
- Body Large: 18px/28px (1.125rem), weight: 400
- Body: 16px/24px (1rem), weight: 400
- Body Small: 14px/20px (0.875rem), weight: 400
- Caption: 12px/16px (0.75rem), weight: 400

*Line Heights:*
- Headlines: 1.2-1.3x font size
- Body text: 1.5-1.6x font size
- UI elements: 1.4x font size

*Spacing:*
- Paragraph margins: 16px (1rem)
- Section spacing: 32px (2rem)
- Text block max-width: 680px (for optimal reading)

## Layout Improvements

### Grid System

**Current Issues:**
- Inconsistent column structure
- Minimal whitespace
- Overcrowded content areas

**Proposed Grid System:**
- 12-column responsive grid
- 16px (1rem) baseline grid
- Consistent gutters: 16px mobile, 24px desktop
- Maximum content width: 1200px
- Standardized breakpoints:
  - Mobile: 0-639px
  - Tablet: 640px-1023px
  - Desktop: 1024px+

### Component Layout Standardization

**Article Cards:**

*Standard Card:*
- Consistent padding: 16px
- Image aspect ratio: 16:9
- Headline size: H4 (20px)
- Metadata positioning: Below headline
- Category indicator: Top left, color-coded

*Featured Card:*
- Larger image: 16:9 aspect ratio
- Headline size: H3 (24px)
- Enhanced metadata
- Excerpt: 2-3 lines maximum

*Compact Card:*
- Smaller image: 1:1 aspect ratio
- Headline size: Body Large (18px)
- Minimal metadata
- No excerpt

**Navigation Components:**

*Primary Navigation:*
- Enhanced visibility with proper spacing
- Dropdown menus with proper padding (16px)
- Mobile-optimized touch targets (minimum 44x44px)
- Clear active/hover states

*Section Navigation:*
- Color-coded to match content categories
- Consistent height and padding
- Improved typography hierarchy

## Content Presentation Guidelines

### Article Page Improvements

**Current Issues:**
- Dense text blocks
- Inconsistent image handling
- Poor advertisement integration
- Limited content hierarchy

**Proposed Article Layout:**
- Clear headline hierarchy
- Enhanced metadata presentation
- Improved paragraph spacing (16px)
- Pull quotes and subheads for content breaks
- Maximum text width: 680px
- Larger font size: 18px/28px
- Better image integration with captions
- Related content recommendations at logical breakpoints
- Non-disruptive advertisement placement

### Homepage Reorganization

**Current Issues:**
- Overwhelming content density
- Competing visual elements
- Unclear content prioritization

**Proposed Homepage Structure:**
- Focused hero area with clear visual hierarchy
- Organized content modules with consistent spacing
- Section divisions with visual separators
- Progressive content loading for performance
- Enhanced whitespace between elements (minimum 24px)
- Improved advertisement integration

## User Experience Enhancements

### Notification System

**Current Issues:**
- Disruptive popups
- Multiple competing notifications
- Poor timing and frequency

**Proposed Notification System:**
- Consolidated notification center
- User preference controls
- Limited frequency (max 1 per session)
- Non-blocking UI for critical messages
- Clear dismissal options

### Performance Optimizations

**Current Issues:**
- Slow page loading
- Heavy third-party scripts
- Poor resource prioritization

**Proposed Performance Improvements:**
- Implement lazy loading for images
- Optimize critical rendering path
- Reduce third-party dependencies
- Implement resource hints (preconnect, prefetch)
- Progressive loading for long-form content

## Mobile Experience

**Current Issues:**
- Desktop-focused design scaled down
- Crowded touch targets
- Poor content prioritization

**Proposed Mobile Enhancements:**
- Mobile-first responsive approach
- Enlarged touch targets (minimum 44x44px)
- Simplified navigation with hamburger menu
- Content prioritization for small screens
- Optimized typography for mobile reading
- Reduced cognitive load through progressive disclosure

## Implementation Examples

### Example 1: Article Card Redesign

**Before:**
- Inconsistent padding
- Poor image-to-text ratio
- Unclear hierarchy
- Limited whitespace

**After:**
- Consistent 16px padding
- Standardized image format (16:9)
- Clear headline hierarchy
- Category indicator with color coding
- Enhanced metadata presentation
- Proper spacing between elements

### Example 2: Navigation Enhancement

**Before:**
- Low-contrast navigation items
- Minimal visual hierarchy
- Poor mobile adaptation

**After:**
- Enhanced contrast for better visibility
- Clear visual hierarchy with sizing and weight
- Color-coded section indicators
- Improved mobile adaptation with proper touch targets
- Clear active/hover states

### Example 3: Article Page Layout

**Before:**
- Dense text presentation
- Poor image integration
- Disruptive ad placement

**After:**
- Improved typography with proper line height (1.5)
- Enhanced paragraph spacing (16px)
- Better image integration with captions
- Non-disruptive advertisement placement
- Sidebar content properly separated
- Clear related content presentation

## Accessibility Enhancements

- Improved color contrast for all text elements
- Enhanced keyboard navigation paths
- Focus indicators for interactive elements
- Proper semantic HTML structure
- ARIA attributes for complex components
- Alternative text for all images
- Properly labeled form elements

## Design System Documentation

The complete design system will be documented in Figma, including:
- Color tokens and usage guidelines
- Typography styles and application rules
- Component library with variants and states
- Layout patterns and grid specifications
- Responsive behavior documentation
- Accessibility guidelines
- Implementation notes for developers

This visual guide provides a foundation for the design improvements outlined in the action plan, offering specific recommendations for addressing the identified issues while maintaining Semana's brand identity.
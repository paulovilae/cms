# System Architecture

## Overview
The IntelliTrade CMS is built on the Payload CMS framework with a Next.js frontend. It follows a headless CMS architecture where the content management system is decoupled from the frontend presentation layer.

## Application Structure
The application is organized into two main sections:
- **Admin Panel**: `/src/app/(payload)` - The Payload CMS admin interface
- **Frontend Website**: `/src/app/(frontend)` - The public-facing website using Next.js App Router

## Core Components

### Content Management System
- **Payload Config**: `src/payload.config.ts` - The central configuration for Payload CMS
- **Collections**: Defined in `src/collections` directory
  - Pages - `src/collections/Pages/index.ts`
  - Posts - `src/collections/Posts/index.ts`
  - Media - `src/collections/Media.ts`
  - Users - `src/collections/Users/index.ts`
  - Categories - `src/collections/Categories.ts`
- **Globals**: Configuration settings accessible across the entire application
  - Header - `src/Header/config.ts`
  - Footer - `src/Footer/config.ts`

### Content Modeling

#### Block-Based Layout System
The CMS uses a modular block-based system for creating flexible page layouts:
- **Block Types**: Located in `src/blocks` directory
  - Content blocks - Text-based content
  - Media blocks - Images and videos
  - Call-to-Action blocks - Buttons and links
  - Archive blocks - Lists of content (e.g., blog posts)
  - Form blocks - Interactive forms
  - Banner blocks - Promotional content
  - Code blocks - Code snippets and examples

#### Hero Sections
Multiple hero section styles defined in `src/heros` directory:
- High Impact - `src/heros/HighImpact/index.tsx`
- Medium Impact - `src/heros/MediumImpact/index.tsx`
- Low Impact - `src/heros/LowImpact/index.tsx`
- Post Hero - `src/heros/PostHero/index.tsx`

### Frontend Components
- **Layout Components**: Defined in `src/app/(frontend)/layout.tsx`
- **Page Components**: Dynamic routing through `src/app/(frontend)/[slug]/page.tsx`
- **Post Components**: Blog post pages in `src/app/(frontend)/posts/[slug]/page.tsx`
- **UI Components**: Reusable interface elements in `src/components/ui`

## Data Flow and Relationships

### Content Creation and Publishing
1. Content is created in the admin panel
2. Drafts are stored in the versions system
3. Content can be previewed before publishing
4. Published content is accessible through the frontend

### User Authentication
- Access control defined in `src/access` directory
- Public users can only access published content
- Authenticated users can access drafts and admin functions

### Page Rendering Process
1. Routes match the request path
2. Page data is fetched from Payload CMS
3. Layout blocks are rendered with `src/blocks/RenderBlocks.tsx`
4. Hero sections are rendered with `src/heros/RenderHero.tsx`

## Critical Implementation Paths

### Content Management
- Collection definitions in `src/collections` define the content structure
- Block configurations in `src/blocks` define the layout building blocks
- Global configurations for shared content like header and footer

### Page Generation
- Dynamic routing in Next.js App Router
- Server-side rendering for SEO optimization
- On-demand revalidation for content updates

### Search Functionality
- Implemented through `@payloadcms/plugin-search`
- Search integration in `src/search` directory
- Frontend search component in `src/app/(frontend)/search/page.tsx`

### Draft Preview and Live Preview
- Draft versions stored in the database
- Preview routes for viewing drafts
- Live preview for real-time content editing
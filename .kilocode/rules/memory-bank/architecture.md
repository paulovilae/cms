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
  - Companies - `src/collections/Companies/index.ts`
  - ExportTransactions - `src/collections/ExportTransactions/index.ts`
  - Routes - `src/collections/Routes/index.ts`
  - SmartContracts - `src/collections/SmartContracts/index.ts`
  - TeamMembers - `src/collections/TeamMembers/index.ts`
  - Testimonials - `src/collections/Testimonials/index.ts`
  - Features - `src/collections/Features/index.ts`
  - PricingPlans - `src/collections/PricingPlans/index.ts`
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
  - SmartContractDemo blocks - Interactive blockchain demonstrations
  - ParallaxHero blocks - Animated hero sections
  - FeatureGrid blocks - Grid layout for features
  - StatCounter blocks - Animated statistics display
  - FloatingCTA blocks - Floating call-to-action elements
  - AnimatedTimeline blocks - Animated process timelines

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

### Trade Finance Data Model
The system implements a comprehensive data model for trade finance operations:

#### Companies Collection
- Stores business entities (exporters and importers)
- Contains detailed company information including:
  - Business type (exporter/importer/both)
  - Contact information and addresses
  - Business details (registration numbers, certifications)
  - Industry sector, employee count, annual revenue
  - Location data including GPS coordinates

#### ExportTransactions Collection
- Core transaction records for trade finance operations
- Links exporters and importers (relationships to Companies collection)
- Stores product details, amounts, and currencies
- Contains shipping information including:
  - Route information
  - Container and seal numbers
  - Incoterms and shipping details
- Document references for trade documentation
- Verification steps with blockchain integration:
  - Oracle verification evidence (photos, GPS coordinates)
  - Verification timestamps and status
  - Payment release information based on verification
  - Smart contract code references
  - Blockchain transaction hashes

#### Routes Collection
- Shipping route information between ports
- Origin, destination, and transit ports
- Transport modes and carriers
- Estimated transit times and distances
- Risk assessment and cost information

#### SmartContracts Collection
- Contract templates and deployed instances
- Solidity source code and ABI interfaces
- Deployment information (network, address, transaction hash)
- Contract parameters and events
- Relationship to export transactions for deployed contracts
- Audit information and contract status tracking

### Blockchain Verification System
The data model supports blockchain-based verification through:

1. **Oracle Integration**: ExportTransactions contain verification steps with oracle data
   - Evidence collection (photos, GPS coordinates, documents)
   - Verification methods (automated/manual oracle, document verification)
   - Oracle interaction code and smart contract code

2. **Smart Contract Management**: 
   - Templates for reusable contract patterns
   - Deployed instances linked to specific transactions
   - Event tracking for contract state changes
   - Parameter management for contract configuration

3. **Verification Data Flow**:
   - Transaction created with smart contract deployment
   - Verification evidence submitted via oracles
   - Smart contract executes based on verification
   - Payment release triggered by verified milestones
   - All steps recorded with blockchain transaction hashes

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

### Data Seeding
- Standalone seed script for generating demo data
- Individual seed modules for each collection
- Command-line interface for triggering seed operations
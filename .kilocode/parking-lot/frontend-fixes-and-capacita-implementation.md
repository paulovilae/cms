# Frontend Fixes and Capacita Implementation Plan

## Critical Issues to Address

### 1. Broken Salarium Frontend Links
- Links in Salarium are not working properly
- Components are messy and inconsistent
- Need to audit and fix all Salarium routes

### 2. Shared Content Across Businesses (MAJOR ISSUE)
- All businesses currently share the same team members
- All businesses share the same pricing plans
- All businesses share the same features and testimonials
- This creates confusion and incorrect information display

### 3. Missing Universal Frontend Template
- No consistent structure across businesses
- Each business needs: Home, About, Features, Pricing, Team, Contact
- Public pages (no auth) vs Authenticated functionality

## Implementation Plan

### Phase 1: Fix Current Frontend Issues (Priority: CRITICAL)

#### Week 1: Audit and Fix Existing Issues

##### Day 1-2: Salarium Frontend Audit
```bash
# Audit all Salarium routes and components
- Check /salarium route functionality
- Test /salarium/job-flow authentication
- Verify all component imports and exports
- Test navigation and links
- Document broken components
```

##### Day 3-4: Add Business Scope to Collections
```typescript
// Update existing collections to include business field
// 1. TeamMembers collection
// 2. PricingPlans collection  
// 3. Features collection
// 4. Testimonials collection

// Migration strategy:
// - Add business field to existing collections
// - Update seed data to assign businesses to existing records
// - Update frontend queries to filter by business
```

##### Day 5-7: Fix Broken Components and Links
```typescript
// Fix Salarium specific issues:
// - Repair broken navigation links
// - Fix component imports/exports
// - Ensure proper authentication flow
// - Test all Salarium workflows
```

### Phase 2: Universal Frontend Template (Week 2)

#### Universal Business Route Structure
```
/[business]/
├── page.tsx                    # Home page
├── about/page.tsx             # About the business  
├── features/page.tsx          # Product features
├── pricing/page.tsx           # Pricing plans
├── team/page.tsx              # Team members
├── contact/page.tsx           # Contact information
├── testimonials/page.tsx      # Customer testimonials
└── (auth)/                    # Authenticated routes
    ├── dashboard/page.tsx     # Main dashboard
    ├── [workflows]/           # Business-specific workflows
    └── profile/page.tsx       # User profile
```

#### Implementation Steps

##### Day 1-3: Create Universal Template Components
```typescript
// src/components/business/universal/
├── BusinessHeader.tsx         # Universal header with business branding
├── BusinessFooter.tsx         # Universal footer
├── BusinessNavigation.tsx     # Business-specific navigation
├── TeamMemberCard.tsx         # Universal team member display
├── PricingCard.tsx           # Universal pricing display
├── FeatureCard.tsx           # Universal feature display
└── TestimonialCard.tsx       # Universal testimonial display
```

##### Day 4-5: Implement Universal Routes
```typescript
// Create universal route templates:
// - /[business]/layout.tsx
// - /[business]/page.tsx (home)
// - /[business]/team/page.tsx
// - /[business]/pricing/page.tsx
// - /[business]/features/page.tsx
// - /[business]/about/page.tsx
// - /[business]/contact/page.tsx
// - /[business]/testimonials/page.tsx
```

##### Day 6-7: Business-Specific Content Queries
```typescript
// src/utilities/businessContent.ts
export async function getBusinessContent(business: string, contentType: string) {
  // Universal function to get business-scoped content
}

// Update all existing business routes to use business-scoped queries
```

### Phase 3: Capacita Plugin Implementation (Week 3)

#### Day 1-2: Capacita Plugin Structure
```typescript
// src/plugins/business/capacita/
├── index.ts                   # Main plugin export
├── collections/               # Capacita-specific collections
│   ├── CapacitaContent.ts    # Training content
│   └── TrainingModules.ts    # Training modules
├── blocks/                   # Capacita-specific blocks
│   ├── AvatarArenaBlock.ts   # Avatar Arena interface
│   ├── TrainingDashboardBlock.ts # Training dashboard
│   └── EvaluationResultsBlock.ts # Evaluation results
├── components/               # React components
│   ├── AvatarArenaInterface.tsx
│   ├── TrainingDashboard.tsx
│   └── EvaluationResults.tsx
└── endpoints/                # API endpoints
    ├── training.ts           # Training session management
    └── evaluation.ts         # Evaluation processing
```

#### Day 3-4: Capacita Public Pages
```typescript
// Implement Capacita public frontend:
// - /capacita (home page)
// - /capacita/about
// - /capacita/features  
// - /capacita/pricing
// - /capacita/team
// - /capacita/contact
// - /capacita/testimonials

// Create Capacita-specific content:
// - Team members for Capacita
// - Pricing plans for Capacita
// - Features for Capacita
// - Testimonials for Capacita
```

#### Day 5-7: Capacita Authenticated Interface
```typescript
// Implement authenticated Capacita routes:
// - /capacita/(auth)/dashboard
// - /capacita/(auth)/avatar-arena
// - /capacita/(auth)/training-dashboard  
// - /capacita/(auth)/evaluation-results
// - /capacita/(auth)/scenarios
// - /capacita/(auth)/progress

// Follow Salarium authentication pattern
```

### Phase 4: Content Population and Testing (Week 4)

#### Day 1-3: Business-Specific Content Creation
```typescript
// Create unique content for each business:

// IntelliTrade Team:
// - CEO: Maria Rodriguez (Trade Finance Expert)
// - CTO: Carlos Silva (Blockchain Developer)
// - COO: Ana Martinez (Operations Manager)

// Salarium Team:
// - CEO: Roberto Santos (HR Technology Expert)
// - CTO: Patricia Lima (Software Architect)
// - Head of Product: Diego Fernandez (UX Designer)

// Latinos Team:
// - CEO: Fernando Garcia (Trading Expert)
// - CTO: Isabella Torres (Quantitative Analyst)
// - Head of AI: Miguel Herrera (Machine Learning Engineer)

// Capacita Team:
// - CEO: Sofia Morales (Training & Development Expert)
// - CTO: Alejandro Ruiz (AI/ML Specialist)
// - Head of Content: Lucia Vargas (Educational Designer)
```

#### Day 4-5: Pricing Plans per Business
```typescript
// IntelliTrade Pricing:
// - Starter: $99/month (Basic trade finance)
// - Professional: $299/month (Advanced features)
// - Enterprise: Custom (Full blockchain integration)

// Salarium Pricing:
// - Basic: $49/month (Small teams)
// - Professional: $149/month (Medium companies)
// - Enterprise: Custom (Large organizations)

// Latinos Pricing:
// - Trader: $199/month (Individual traders)
// - Professional: $499/month (Trading firms)
// - Institutional: Custom (Large institutions)

// Capacita Pricing:
// - Individual: $79/month (Personal training)
// - Team: $299/month (Small teams)
// - Enterprise: Custom (Large organizations)
```

#### Day 6-7: Testing and Quality Assurance
```typescript
// Test all business routes:
// - Verify public pages load correctly
// - Test business-specific content displays
// - Verify authentication flows work
// - Test all authenticated workflows
// - Verify no content leakage between businesses
```

## Detailed Implementation Specifications

### Business-Scoped Collections Update

#### Enhanced TeamMembers Collection
```typescript
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'business'],
    group: 'Content',
  },
  fields: [
    {
      name: 'business',
      type: 'select',
      options: [
        { label: 'IntelliTrade', value: 'intellitrade' },
        { label: 'Salarium', value: 'salarium' },
        { label: 'Latinos', value: 'latinos' },
        { label: 'Capacita', value: 'capacita' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Which business this team member belongs to',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Brief biography and background',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Professional headshot',
      },
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: {
        description: 'LinkedIn profile URL',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Professional email address',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate order if not provided
        if (!data.order) {
          data.order = Date.now();
        }
        return data;
      },
    ],
  },
}
```

#### Enhanced PricingPlans Collection
```typescript
export const PricingPlans: CollectionConfig = {
  slug: 'pricing-plans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'business'],
    group: 'Content',
  },
  fields: [
    {
      name: 'business',
      type: 'select',
      options: [
        { label: 'IntelliTrade', value: 'intellitrade' },
        { label: 'Salarium', value: 'salarium' },
        { label: 'Latinos', value: 'latinos' },
        { label: 'Capacita', value: 'capacita' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the plan',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'USD ($)', value: 'usd' },
        { label: 'EUR (€)', value: 'eur' },
      ],
      defaultValue: 'usd',
    },
    {
      name: 'billingPeriod',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
        { label: 'One-time', value: 'onetime' },
      ],
      defaultValue: 'monthly',
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'included',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
      admin: {
        description: 'List of features included in this plan',
      },
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as the most popular plan',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Get Started',
      admin: {
        description: 'Call-to-action button text',
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      admin: {
        description: 'URL for the call-to-action button',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
}
```

### Capacita Authentication Pattern

#### Following Salarium Model
```typescript
// src/app/(frontend)/capacita/(auth)/layout.tsx
import { AuthWrapper } from '@/components/auth/AuthWrapper'

export default function CapacitaAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <CapacitaAuthHeader />
        <main className="container mx-auto py-8">
          {children}
        </main>
        <CapacitaAuthFooter />
      </div>
    </AuthWrapper>
  )
}

// src/app/(frontend)/capacita/(auth)/avatar-arena/page.tsx
export const dynamic = 'force-dynamic'

export default function AvatarArenaPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-4">
          Avatar Arena
        </h1>
        <p className="text-lg text-green-700 mb-8">
          Practice with AI-powered characters to improve your customer service skills
        </p>
      </div>
      
      <AvatarArenaInterface />
    </div>
  )
}
```

### Business Content Query Utilities

```typescript
// src/utilities/businessContent.ts
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getBusinessTeamMembers(business: string) {
  const payload = await getPayload({ config })
  
  const { docs } = await payload.find({
    collection: 'team-members',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })
  
  return docs
}

export async function getBusinessPricingPlans(business: string) {
  const payload = await getPayload({ config })
  
  const { docs } = await payload.find({
    collection: 'pricing-plans',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })
  
  return docs
}

export async function getBusinessFeatures(business: string) {
  const payload = await getPayload({ config })
  
  const { docs } = await payload.find({
    collection: 'features',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })
  
  return docs
}

export async function getBusinessTestimonials(business: string) {
  const payload = await getPayload({ config })
  
  const { docs } = await payload.find({
    collection: 'testimonials',
    where: {
      business: {
        equals: business,
      },
    },
    sort: 'order',
  })
  
  return docs
}
```

## Success Criteria

### Phase 1 Success Metrics
- [ ] All Salarium links work correctly
- [ ] No shared content between businesses
- [ ] Each business displays only its own team/pricing/features
- [ ] All existing functionality preserved

### Phase 2 Success Metrics  
- [ ] Universal template works for all businesses
- [ ] Consistent navigation and branding
- [ ] All public pages load correctly
- [ ] SEO metadata is business-specific

### Phase 3 Success Metrics
- [ ] Capacita plugin loads correctly
- [ ] Capacita public pages display properly
- [ ] Capacita authenticated routes work
- [ ] Avatar Arena interface is functional

### Phase 4 Success Metrics
- [ ] All businesses have unique content
- [ ] No content leakage between businesses
- [ ] All routes tested and working
- [ ] Performance is acceptable

This implementation plan addresses all the critical frontend issues while properly implementing the Capacita business unit with authentication-enabled training interfaces.
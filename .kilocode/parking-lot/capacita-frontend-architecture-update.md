# Capacita Frontend Architecture Update

## Critical Issues Identified and Solutions

### 1. Authentication-Enabled Frontend for Training/Evaluation

The Capacita training and evaluation interface must follow the same pattern as Salarium's authenticated frontend.

#### Current Salarium Pattern
- **Public Route**: `/salarium` - Marketing page (no auth required)
- **Authenticated Route**: `/salarium/job-flow` - Functional workflow (auth required)

#### Proposed Capacita Pattern
- **Public Route**: `/capacita` - Marketing page (no auth required)  
- **Authenticated Route**: `/capacita/avatar-arena` - Training interface (auth required)
- **Authenticated Route**: `/capacita/training-dashboard` - Progress tracking (auth required)
- **Authenticated Route**: `/capacita/evaluation-results` - Results analysis (auth required)

### 2. Business-Specific Content Collections

Currently all businesses share the same team, pricing, and content. This needs to be separated per business.

#### Problem: Shared Collections
```typescript
// Current - WRONG: All businesses share same data
TeamMembers: { /* shared across all businesses */ }
PricingPlans: { /* shared across all businesses */ }
Testimonials: { /* shared across all businesses */ }
```

#### Solution: Business-Scoped Collections
```typescript
// NEW: Business-specific collections
IntelliTradeTeamMembers: { business: 'intellitrade', ... }
SalariumTeamMembers: { business: 'salarium', ... }
LatinosTeamMembers: { business: 'latinos', ... }
CapacitaTeamMembers: { business: 'capacita', ... }

// Or single collection with business filter
TeamMembers: { 
  business: 'intellitrade' | 'salarium' | 'latinos' | 'capacita',
  name: string,
  role: string,
  // ... other fields
}
```

### 3. Universal Frontend Template

All businesses need a consistent public frontend structure with business-specific content.

## Updated Frontend Architecture

### Universal Frontend Template Structure

Each business should have the following public pages:

```
/[business]/
├── page.tsx                    # Home page
├── about/page.tsx             # About the business
├── features/page.tsx          # Product features
├── pricing/page.tsx           # Pricing plans
├── team/page.tsx              # Team members
├── contact/page.tsx           # Contact information
├── testimonials/page.tsx      # Customer testimonials
└── [authenticated-features]/   # Auth-required functionality
    ├── dashboard/page.tsx     # Main dashboard
    ├── [specific-workflows]/  # Business-specific workflows
    └── profile/page.tsx       # User profile
```

### Business-Specific Authenticated Features

#### IntelliTrade (`/intellitrade/`)
- **Public**: Home, About, Features, Pricing, Team, Contact, Testimonials
- **Authenticated**: 
  - `/intellitrade/dashboard` - Trade finance dashboard
  - `/intellitrade/transactions` - Transaction management
  - `/intellitrade/contracts` - Smart contract interface
  - `/intellitrade/verification` - Oracle verification

#### Salarium (`/salarium/`)
- **Public**: Home, About, Features, Pricing, Team, Contact, Testimonials
- **Authenticated**:
  - `/salarium/dashboard` - HR dashboard
  - `/salarium/job-flow` - Job creation workflow ✅ (already exists)
  - `/salarium/flow-instances` - Workflow management
  - `/salarium/organizations` - Organization management

#### Latinos (`/latinos/`)
- **Public**: Home, About, Features, Pricing, Team, Contact, Testimonials
- **Authenticated**:
  - `/latinos/dashboard` - Trading dashboard
  - `/latinos/bots` - Bot management
  - `/latinos/strategies` - Strategy configuration
  - `/latinos/analytics` - Performance analytics

#### Capacita (`/capacita/`)
- **Public**: Home, About, Features, Pricing, Team, Contact, Testimonials
- **Authenticated**:
  - `/capacita/dashboard` - Training dashboard
  - `/capacita/avatar-arena` - Main training interface
  - `/capacita/progress` - Progress tracking
  - `/capacita/scenarios` - Scenario library
  - `/capacita/evaluation-results` - Performance analysis

## Updated Data Model Architecture

### Business-Scoped Collections

#### Option 1: Single Collections with Business Filter
```typescript
// Enhanced collections with business scope
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
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
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'linkedin',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
  ],
  admin: {
    defaultColumns: ['name', 'role', 'business'],
    useAsTitle: 'name',
  },
}

export const PricingPlans: CollectionConfig = {
  slug: 'pricing-plans',
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
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'EUR', value: 'eur' },
      ],
      defaultValue: 'usd',
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

export const Features: CollectionConfig = {
  slug: 'features',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Lucide icon name',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Core Feature', value: 'core' },
        { label: 'Advanced Feature', value: 'advanced' },
        { label: 'Integration', value: 'integration' },
      ],
    },
  ],
}
```

### Business-Specific Content Queries

#### Frontend Query Helpers
```typescript
// src/utilities/businessContent.ts
export async function getBusinessTeamMembers(business: string) {
  const { docs } = await payload.find({
    collection: 'team-members',
    where: {
      business: {
        equals: business,
      },
    },
  });
  return docs;
}

export async function getBusinessPricingPlans(business: string) {
  const { docs } = await payload.find({
    collection: 'pricing-plans',
    where: {
      business: {
        equals: business,
      },
    },
  });
  return docs;
}

export async function getBusinessFeatures(business: string) {
  const { docs } = await payload.find({
    collection: 'features',
    where: {
      business: {
        equals: business,
      },
    },
  });
  return docs;
}
```

## Capacita-Specific Collections and Blocks

### Capacita Plugin Collections
```typescript
// src/plugins/business/capacita/collections/CapacitaContent.ts
export const CapacitaContent: CollectionConfig = {
  slug: 'capacita-content',
  admin: {
    group: 'Capacita',
  },
  fields: [
    {
      name: 'contentType',
      type: 'select',
      options: [
        { label: 'Training Module', value: 'training-module' },
        { label: 'Scenario Library', value: 'scenario-library' },
        { label: 'Achievement Badge', value: 'achievement-badge' },
        { label: 'Help Documentation', value: 'help-docs' },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
    },
    {
      name: 'estimatedDuration',
      type: 'number',
      admin: {
        description: 'Duration in minutes',
      },
    },
    {
      name: 'prerequisites',
      type: 'relationship',
      relationTo: 'capacita-content',
      hasMany: true,
    },
  ],
}
```

### Capacita-Specific Blocks
```typescript
// src/plugins/business/capacita/blocks/AvatarArenaBlock.ts
export const AvatarArenaBlock: Block = {
  slug: 'avatar-arena',
  labels: {
    singular: 'Avatar Arena',
    plural: 'Avatar Arenas',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Enter the Avatar Arena',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Practice your customer service skills with AI-powered characters',
    },
    {
      name: 'availablePersonas',
      type: 'relationship',
      relationTo: 'avatar-personas',
      hasMany: true,
      admin: {
        description: 'Select which personas are available in this arena',
      },
    },
    {
      name: 'storylineMode',
      type: 'select',
      options: [
        { label: 'Corporate Training', value: 'corporate' },
        { label: 'Fantasy Adventure', value: 'fantasy' },
        { label: 'Sci-Fi Scenario', value: 'sci-fi' },
        { label: 'Historical Context', value: 'historical' },
      ],
      defaultValue: 'corporate',
    },
    {
      name: 'requiresAuthentication',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'minimumLevel',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Minimum user level required to access this arena',
      },
    },
  ],
}

// src/plugins/business/capacita/blocks/TrainingDashboardBlock.ts
export const TrainingDashboardBlock: Block = {
  slug: 'training-dashboard',
  labels: {
    singular: 'Training Dashboard',
    plural: 'Training Dashboards',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Your Training Progress',
    },
    {
      name: 'showProgressChart',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showLeaderboard',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showAchievements',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showRecentSessions',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'maxRecentSessions',
      type: 'number',
      defaultValue: 5,
      admin: {
        condition: (data) => data.showRecentSessions,
      },
    },
  ],
}

// src/plugins/business/capacita/blocks/EvaluationResultsBlock.ts
export const EvaluationResultsBlock: Block = {
  slug: 'evaluation-results',
  labels: {
    singular: 'Evaluation Results',
    plural: 'Evaluation Results',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Your Performance Analysis',
    },
    {
      name: 'showOverallScore',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showStageBreakdown',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showRecommendations',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showHistoricalComparison',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allowExport',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
```

## Updated Frontend Route Structure

### Universal Template Implementation
```typescript
// src/app/(frontend)/[business]/layout.tsx
export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { business: string };
}) {
  const { business } = params;
  
  // Validate business
  const validBusinesses = ['intellitrade', 'salarium', 'latinos', 'capacita'];
  if (!validBusinesses.includes(business)) {
    notFound();
  }

  // Get business-specific navigation
  const navigation = await getBusinessNavigation(business);
  
  return (
    <div className="min-h-screen">
      <BusinessHeader business={business} navigation={navigation} />
      <main>{children}</main>
      <BusinessFooter business={business} />
    </div>
  );
}

// src/app/(frontend)/[business]/page.tsx - Universal Home Page
export default async function BusinessHomePage({
  params,
}: {
  params: { business: string };
}) {
  const { business } = params;
  
  // Try to get CMS page first
  const page = await getBusinessPage(business, 'home');
  
  if (page) {
    return <RenderBlocks blocks={page.layout} />;
  }
  
  // Fallback to business-specific component
  return <BusinessHomepage business={business} />;
}

// src/app/(frontend)/[business]/team/page.tsx - Universal Team Page
export default async function BusinessTeamPage({
  params,
}: {
  params: { business: string };
}) {
  const { business } = params;
  const teamMembers = await getBusinessTeamMembers(business);
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

// src/app/(frontend)/[business]/pricing/page.tsx - Universal Pricing Page
export default async function BusinessPricingPage({
  params,
}: {
  params: { business: string };
}) {
  const { business } = params;
  const pricingPlans = await getBusinessPricingPlans(business);
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} business={business} />
        ))}
      </div>
    </div>
  );
}
```

### Capacita-Specific Authenticated Routes
```typescript
// src/app/(frontend)/capacita/(auth)/layout.tsx
export default function CapacitaAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <CapacitaNavigation />
        <main className="container mx-auto py-8">
          {children}
        </main>
      </div>
    </AuthWrapper>
  );
}

// src/app/(frontend)/capacita/(auth)/avatar-arena/page.tsx
export default function AvatarArenaPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-4">
          Avatar Arena
        </h1>
        <p className="text-lg text-green-700">
          Practice with AI-powered characters to improve your customer service skills
        </p>
      </div>
      
      <AvatarArenaInterface />
    </div>
  );
}

// src/app/(frontend)/capacita/(auth)/training-dashboard/page.tsx
export default function TrainingDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-green-900">
        Training Dashboard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProgressChart />
          <RecentSessions />
        </div>
        <div>
          <AchievementsList />
          <LeaderboardWidget />
        </div>
      </div>
    </div>
  );
}

// src/app/(frontend)/capacita/(auth)/evaluation-results/page.tsx
export default function EvaluationResultsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-green-900">
        Evaluation Results
      </h1>
      
      <EvaluationResultsInterface />
    </div>
  );
}
```

## Implementation Priority

### Phase 1: Fix Current Issues (Week 1)
1. **Add business field to existing collections** (TeamMembers, PricingPlans, Features, Testimonials)
2. **Update existing business routes** to use business-scoped content
3. **Fix broken Salarium links** and components
4. **Create universal frontend template** structure

### Phase 2: Capacita Implementation (Week 2-3)
1. **Create Capacita plugin** with collections and blocks
2. **Implement Capacita public pages** (home, about, features, pricing, team, contact)
3. **Create Capacita authenticated routes** (avatar-arena, dashboard, evaluation-results)
4. **Implement authentication wrapper** for Capacita training interface

### Phase 3: Content Population (Week 4)
1. **Populate business-specific content** for all businesses
2. **Create Capacita-specific team, pricing, and features**
3. **Test all business routes** and authenticated workflows
4. **Update seed data** to include business-scoped content

This updated architecture ensures each business has its own complete frontend presence while maintaining the shared infrastructure benefits.
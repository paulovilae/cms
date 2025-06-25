// Sample pricing plans for IntelliTrade
export const pricingPlans = [
  {
    name: 'Starter',
    description:
      'Perfect for small exporters and importers looking to digitalize their first international trade transactions.',
    priceMonthly: 499,
    priceYearly: 4990,
    features: [
      {
        feature: 'Smart Escrow Transactions (Up to 5 per month)',
        included: true,
      },
      {
        feature: 'Transaction Limit ($100,000 per transaction)',
        included: true,
      },
      {
        feature: 'Advance Payment (80% upon verification)',
        included: true,
      },
      {
        feature: 'Oracle Verification System (Basic: Photo + GPS)',
        included: true,
      },
      {
        feature: 'Digital Documentation (Standard templates)',
        included: true,
      },
      {
        feature: 'Support (Email only)',
        included: true,
      },
      {
        feature: 'API Access',
        included: false,
      },
      {
        feature: 'Multi-User Access',
        included: false,
      },
    ],
    featured: false,
    order: 1,
    planType: 'starter' as const,
  },
  {
    name: 'Professional',
    description:
      'Designed for established exporters and importers with regular international trade activities.',
    priceMonthly: 999,
    priceYearly: 9990,
    features: [
      {
        feature: 'Smart Escrow Transactions (Up to 15 per month)',
        included: true,
      },
      {
        feature: 'Transaction Limit ($500,000 per transaction)',
        included: true,
      },
      {
        feature: 'Advance Payment (85% upon verification)',
        included: true,
      },
      {
        feature: 'Oracle Verification System (Advanced: Photo + GPS + IoT)',
        included: true,
      },
      {
        feature: 'Digital Documentation (Custom templates + OCR)',
        included: true,
      },
      {
        feature: 'API Access (Basic integration)',
        included: true,
      },
      {
        feature: 'Support (Priority email + chat)',
        included: true,
      },
      {
        feature: 'Multi-User Access',
        included: false,
      },
    ],
    featured: true,
    order: 2,
    planType: 'professional' as const,
  },
  {
    name: 'Enterprise',
    description:
      'Comprehensive solution for large-scale trading companies with high-volume international transactions.',
    priceMonthly: 2499,
    priceYearly: 24990,
    features: [
      {
        feature: 'Smart Escrow Transactions (Unlimited)',
        included: true,
      },
      {
        feature: 'Transaction Limit (Unlimited)',
        included: true,
      },
      {
        feature: 'Advance Payment (90% upon verification)',
        included: true,
      },
      {
        feature: 'Oracle Verification System (Premium: All features + Custom)',
        included: true,
      },
      {
        feature: 'Digital Documentation (Fully customizable system)',
        included: true,
      },
      {
        feature: 'API Access (Complete integration suite)',
        included: true,
      },
      {
        feature: 'Multi-User Access (Role-based permissions)',
        included: true,
      },
      {
        feature: 'Support (24/7 dedicated account manager)',
        included: true,
      },
    ],
    featured: false,
    order: 3,
    planType: 'enterprise' as const,
  },
]

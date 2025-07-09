import React from 'react'
import { Metadata } from 'next'
import { getBusinessPricingPlans } from '@/utilities/businessContent'
import { getBrandingForBusiness } from '@/utilities/branding'
import { type BusinessMode } from '@/utilities/environment'

interface PricingPageProps {
  params: Promise<{
    business: string
  }>
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { business } = await params

  // Type guard for business mode
  const isValidBusinessMode = (b: string): b is BusinessMode => {
    return ['intellitrade', 'salarium', 'latinos', 'capacita'].includes(b)
  }

  const businessMode: BusinessMode = isValidBusinessMode(business) ? business : 'intellitrade'
  const branding = getBrandingForBusiness(businessMode)

  return {
    title: `Pricing | ${branding.displayName}`,
    description: `Explore ${branding.displayName} pricing plans and find the perfect fit for your organization. Transparent pricing with no hidden fees.`,
  }
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { business } = await params

  // Type guard for business mode
  const isValidBusinessMode = (b: string): b is BusinessMode => {
    return ['intellitrade', 'salarium', 'latinos', 'capacita'].includes(b)
  }

  const businessMode: BusinessMode = isValidBusinessMode(business) ? business : 'intellitrade'
  const branding = getBrandingForBusiness(businessMode)
  const pricingPlans = await getBusinessPricingPlans(business)

  // Business-specific pricing descriptions
  const getBusinessDescription = (business: string) => {
    switch (business) {
      case 'intellitrade':
        return 'Choose the perfect plan for your trade finance needs. Transparent pricing with no hidden fees.'
      case 'salarium':
        return 'Flexible pricing plans for HR teams of all sizes. Streamline your job description workflows today.'
      case 'latinos':
        return 'Trading plans designed to grow with your portfolio. From individual traders to institutional investors.'
      case 'capacita':
        return 'Training plans that scale with your organization. From small teams to enterprise-wide implementations.'
      default:
        return `Choose the perfect plan for your ${branding.displayName} needs. Transparent pricing with no hidden fees.`
    }
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-component-text mb-4">
            {branding.displayName} Pricing
          </h1>
          <p className="text-xl text-component-text-muted max-w-3xl mx-auto">
            {getBusinessDescription(business)}
          </p>
        </div>

        {/* Pricing Plans Grid */}
        {pricingPlans && pricingPlans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-component-bg border border-component-border rounded-lg shadow-md p-8 relative ${
                  plan.featured ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-component-text mb-2">{plan.name}</h3>
                  <p className="text-component-text-muted mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-component-text">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-component-text-muted">/month</span>
                  </div>
                  {plan.priceYearly && (
                    <p className="text-sm text-component-text-muted">
                      or ${plan.priceYearly}/year (save ${plan.priceMonthly * 12 - plan.priceYearly}
                      )
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span
                        className={`mr-3 ${feature.included ? 'text-green-500' : 'text-component-text-muted'}`}
                      >
                        {feature.included ? '✓' : '✗'}
                      </span>
                      <span
                        className={
                          feature.included ? 'text-component-text' : 'text-component-text-muted'
                        }
                      >
                        {feature.feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                    plan.featured
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-component-bg-elevated text-component-text hover:bg-component-border'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-component-text-muted text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-component-text mb-2">
              Pricing Plans Coming Soon
            </h3>
            <p className="text-component-text-muted">
              We&apos;re finalizing our pricing structure for {branding.displayName}. Check back
              soon!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-component-text mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-component-text mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-component-text-muted">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-component-text mb-2">
                Is there a free trial?
              </h3>
              <p className="text-component-text-muted">
                We offer a 14-day free trial for all plans. No credit card required to get started.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-component-text mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-component-text-muted">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-component-text mb-2">
                Do you offer enterprise discounts?
              </h3>
              <p className="text-component-text-muted">
                Yes, we offer custom pricing for large organizations. Contact our sales team for
                details.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-component-bg-elevated border border-component-border rounded-lg p-12">
          <h2 className="text-3xl font-bold text-component-text mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-component-text-muted mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers using {branding.displayName}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${business}?autoLogin=true`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href={`/${business}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border border-component-border text-base font-medium rounded-md text-component-text bg-component-bg hover:bg-component-bg-elevated transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate static params for all businesses
export function generateStaticParams() {
  return [
    { business: 'intellitrade' },
    { business: 'salarium' },
    { business: 'latinos' },
    { business: 'capacita' },
  ]
}

import React from 'react'
import { Metadata } from 'next'
import { getBusinessFeatures } from '@/utilities/businessContent'
import {
  getBusinessBySlug,
  isValidBusinessSlug,
  getValidBusinessSlugs,
} from '@/utilities/businessConfig'
import { notFound } from 'next/navigation'

interface FeaturesPageProps {
  params: Promise<{
    business: string
  }>
}

export async function generateMetadata({ params }: FeaturesPageProps): Promise<Metadata> {
  const { business } = await params
  const businessConfig = await getBusinessBySlug(business)

  if (!businessConfig) {
    return {
      title: 'Features Not Found',
      description: 'The requested business features page could not be found.',
    }
  }

  return {
    title: `Features | ${businessConfig.displayName}`,
    description: `Explore the comprehensive features and capabilities of ${businessConfig.displayName}. ${businessConfig.description}`,
  }
}

export default async function FeaturesPage({ params }: FeaturesPageProps) {
  const { business } = await params

  // Validate business slug
  const isValid = await isValidBusinessSlug(business)
  if (!isValid) {
    notFound()
  }

  const businessConfig = await getBusinessBySlug(business)
  if (!businessConfig) {
    notFound()
  }

  const features = await getBusinessFeatures(business)

  // Business-specific feature descriptions
  const getBusinessDescription = (business: string) => {
    switch (business) {
      case 'intellitrade':
        return 'Discover the powerful blockchain-powered features that make IntelliTrade the perfect solution for international trade finance.'
      case 'salarium':
        return 'Explore the AI-powered HR features that streamline job description workflows and transform your hiring process.'
      case 'latinos':
        return 'Advanced trading features with AI-powered bots for automated stock market operations and real-time analytics.'
      case 'capacita':
        return 'Revolutionary training features with Avatar Arena, RPG gamification, and multi-stage evaluation systems.'
      default:
        return `Discover the powerful features that make ${businessConfig.displayName} the perfect solution for your needs.`
    }
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-component-text mb-4">
            {businessConfig.displayName} Features
          </h1>
          <p className="text-xl text-component-text-muted max-w-3xl mx-auto">
            {getBusinessDescription(business)}
          </p>
        </div>

        {/* Features Grid */}
        {features && features.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {feature.icon && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-component-text-muted mb-4">{feature.description}</p>
                {feature.category && (
                  <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    {feature.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-component-text-muted text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-component-text mb-2">Features Coming Soon</h3>
            <p className="text-component-text-muted">
              We&apos;re building amazing features for {businessConfig.displayName}. Check back
              soon!
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gray-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-component-text mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-component-text-muted mb-8 max-w-2xl mx-auto">
            Experience the power of {businessConfig.displayName} features firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={businessConfig.demoUrl || `/${business}?autoLogin=true`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Try Demo
            </a>
            <a
              href={`/${business}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
export async function generateStaticParams() {
  const validSlugs = await getValidBusinessSlugs()
  return validSlugs.map((slug) => ({ business: slug }))
}

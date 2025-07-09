import React from 'react'
import { Metadata } from 'next'
import {
  getBusinessBySlug,
  isValidBusinessSlug,
  getValidBusinessSlugs,
} from '@/utilities/businessConfig'
import { notFound } from 'next/navigation'

interface BusinessPageProps {
  params: Promise<{
    business: string
  }>
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { business } = await params
  const businessConfig = await getBusinessBySlug(business)

  if (!businessConfig) {
    return {
      title: 'Business Not Found',
      description: 'The requested business page could not be found.',
    }
  }

  return {
    title: `${businessConfig.displayName} | Multi-Tenant CMS`,
    description: businessConfig.description,
  }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
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

  // Business-specific content
  const getBusinessContent = (business: string) => {
    switch (business) {
      case 'intellitrade':
        return {
          badge: 'Blockchain-Powered Trade Finance',
          title: 'Revolutionary Trade Finance',
          description:
            'Transform international trade with blockchain technology, smart contracts, and automated verification systems.',
          features: [
            {
              title: 'Smart Escrow',
              description: 'Automated payment release based on verified delivery milestones',
            },
            {
              title: 'Global Trade',
              description: 'Seamless cross-border transactions with reduced friction',
            },
            { title: 'Fast Processing', description: 'Complete transactions in under 48 hours' },
            {
              title: 'Cost Efficient',
              description: '30% reduction in traditional trade finance costs',
            },
          ],
          ctaText: 'Try Demo',
          ctaUrl: '/intellitrade?autoLogin=true',
        }
      case 'salarium':
        return {
          badge: 'AI-Powered HR Solutions',
          title: 'Powerful HR Features',
          description:
            'Streamline your HR workflows with AI-assisted job descriptions, compensation analysis, and document automation.',
          features: [
            {
              title: 'Smart Workflows',
              description: 'AI-powered document flow automation and approval processes',
            },
            {
              title: 'Document Generation',
              description: 'Intelligent job description and contract creation',
            },
            {
              title: 'Team Management',
              description: 'Comprehensive organizational structure and role management',
            },
            { title: 'Time Efficiency', description: '70% reduction in HR administrative tasks' },
          ],
          ctaText: 'Try Live Demo',
          ctaUrl: '/salarium/job-flow?autoLogin=true',
        }
      case 'latinos':
        return {
          badge: 'AI-Powered Trading Platform',
          title: 'Advanced Trading Features',
          description:
            'Automated trading bots with AI-powered strategies, real-time analytics, and comprehensive market data integration.',
          features: [
            {
              title: 'Trading Bots',
              description: 'AI-powered automated trading with customizable strategies',
            },
            {
              title: 'Real-time Analytics',
              description: 'Live market data and performance monitoring',
            },
            { title: 'Strategy Builder', description: 'Create and test custom trading algorithms' },
            { title: 'Fast Execution', description: 'Millisecond-precision trade execution' },
          ],
          ctaText: 'Try Demo',
          ctaUrl: '/latinos?autoLogin=true',
        }
      case 'capacita':
        return {
          badge: 'AI-Powered Training Platform',
          title: 'Revolutionary Training Experience',
          description:
            'Avatar Arena with complex character personas, RPG gamification, and multi-stage evaluation for immersive learning.',
          features: [
            {
              title: 'Avatar Arena',
              description: 'Train with AI characters featuring complex personalities and behaviors',
            },
            {
              title: 'RPG Gamification',
              description: 'Engaging storylines with character progression and achievements',
            },
            {
              title: 'Real-time Evaluation',
              description: 'Multi-stage analysis of text, voice, and visual performance',
            },
            {
              title: 'Multi-Industry',
              description: 'Adaptable training scenarios for any industry or context',
            },
          ],
          ctaText: 'Enter Avatar Arena',
          ctaUrl: '/capacita?autoLogin=true',
        }
      default:
        return {
          badge: 'Business Platform',
          title: businessConfig.displayName,
          description: businessConfig.description,
          features: [],
          ctaText: 'Learn More',
          ctaUrl: `/${business}/features`,
        }
    }
  }

  const content = getBusinessContent(business)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-component-bg-elevated to-component-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Business Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium mb-6">
              {content.badge}
            </div>

            {/* Main Title */}
            <h1 className="text-5xl font-bold text-component-text mb-6">{content.title}</h1>

            {/* Description */}
            <p className="text-xl text-component-text-muted mb-8 max-w-3xl mx-auto">
              {content.description}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={content.ctaUrl}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                {content.ctaText}
              </a>
              <a
                href={`/${business}/features`}
                className="inline-flex items-center justify-center px-8 py-4 border border-component-border text-lg font-medium rounded-md text-component-text bg-component-bg hover:bg-component-bg-elevated transition-colors"
              >
                View Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {content.features.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-component-text text-center mb-12">
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {content.features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-component-bg-elevated border border-component-border rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-lg font-semibold text-component-text mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-component-text-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation Section */}
      <section className="py-20 bg-component-bg-elevated">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-component-text mb-8">
              Explore {businessConfig.displayName}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href={`/${business}/features`}
                className="block p-6 bg-component-bg border border-component-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-component-text mb-2">Features</h3>
                <p className="text-component-text-muted">Discover all capabilities and tools</p>
              </a>
              <a
                href={`/${business}/pricing`}
                className="block p-6 bg-component-bg border border-component-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-component-text mb-2">Pricing</h3>
                <p className="text-component-text-muted">View plans and pricing options</p>
              </a>
              <a
                href={`/${business}/team`}
                className="block p-6 bg-component-bg border border-component-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-component-text mb-2">Team</h3>
                <p className="text-component-text-muted">Meet our expert team members</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Generate static params for all businesses
export async function generateStaticParams() {
  const validSlugs = await getValidBusinessSlugs()
  return validSlugs.map((slug) => ({ business: slug }))
}

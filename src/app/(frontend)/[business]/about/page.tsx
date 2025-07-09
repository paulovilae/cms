import React from 'react'
import { Metadata } from 'next'
import {
  getBusinessBySlug,
  isValidBusinessSlug,
  getValidBusinessSlugs,
} from '@/utilities/businessConfig'
import { notFound } from 'next/navigation'

interface AboutPageProps {
  params: Promise<{
    business: string
  }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { business } = await params
  const businessConfig = await getBusinessBySlug(business)

  if (!businessConfig) {
    return {
      title: 'About Not Found',
      description: 'The requested business about page could not be found.',
    }
  }

  return {
    title: `About | ${businessConfig.displayName}`,
    description: `Learn about ${businessConfig.displayName}, our mission, and our commitment to excellence. ${businessConfig.description}`,
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
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

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-component-text mb-4">
            About {businessConfig.displayName}
          </h1>
          <p className="text-xl text-component-text-muted max-w-3xl mx-auto">
            {businessConfig.tagline}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-component-text mb-6">Our Mission</h2>
              <p className="text-lg text-component-text mb-6">{businessConfig.description}</p>
              <p className="text-component-text-muted">
                We are committed to delivering innovative solutions that transform how businesses
                operate in the digital age.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-component-text mb-6">Our Vision</h2>
              <p className="text-lg text-component-text mb-6">
                To be the leading platform in our industry, empowering organizations worldwide with
                cutting-edge technology and exceptional service.
              </p>
              <p className="text-component-text-muted">
                We envision a future where technology seamlessly integrates with business processes
                to create unprecedented value.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-component-text text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-component-text mb-3">Innovation</h3>
                <p className="text-component-text-muted">
                  We constantly push boundaries and embrace new technologies to deliver cutting-edge
                  solutions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-component-text mb-3">Collaboration</h3>
                <p className="text-component-text-muted">
                  We believe in the power of teamwork and building strong partnerships with our
                  clients.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold text-component-text mb-3">Excellence</h3>
                <p className="text-component-text-muted">
                  We strive for excellence in everything we do, from product development to customer
                  service.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-component-text text-center mb-8">
              Get in Touch
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold text-component-text mb-2">Email</h3>
                <p className="text-component-text">{businessConfig.contact.email}</p>
              </div>
              {businessConfig.contact.phone && (
                <div>
                  <h3 className="text-lg font-semibold text-component-text mb-2">Phone</h3>
                  <p className="text-component-text">{businessConfig.contact.phone}</p>
                </div>
              )}
              {businessConfig.contact.address && (
                <div>
                  <h3 className="text-lg font-semibold text-component-text mb-2">Location</h3>
                  <p className="text-component-text">{businessConfig.contact.address}</p>
                </div>
              )}
            </div>
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

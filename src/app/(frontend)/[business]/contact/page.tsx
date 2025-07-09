import React from 'react'
import { Metadata } from 'next'
import {
  getBusinessBySlug,
  isValidBusinessSlug,
  getValidBusinessSlugs,
} from '@/utilities/businessConfig'
import { notFound } from 'next/navigation'

interface ContactPageProps {
  params: Promise<{
    business: string
  }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { business } = await params
  const businessConfig = await getBusinessBySlug(business)

  if (!businessConfig) {
    return {
      title: 'Contact Not Found',
      description: 'The requested business contact page could not be found.',
    }
  }

  return {
    title: `Contact | ${businessConfig.displayName}`,
    description: `Contact the ${businessConfig.displayName} team for support, sales inquiries, or partnership opportunities.`,
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
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
            Contact {businessConfig.displayName}
          </h1>
          <p className="text-xl text-component-text-muted max-w-3xl mx-auto">
            Get in touch with our team. We&apos;re here to help you succeed with{' '}
            {businessConfig.displayName}.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-component-text mb-8">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-component-text mb-1">Email</h3>
                    <p className="text-component-text">{businessConfig.contact.email}</p>
                    <p className="text-sm text-component-text-muted">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                {businessConfig.contact.phone && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-component-text mb-1">Phone</h3>
                      <p className="text-component-text">{businessConfig.contact.phone}</p>
                      <p className="text-sm text-component-text-muted">
                        Monday - Friday, 9AM - 6PM EST
                      </p>
                    </div>
                  </div>
                )}

                {businessConfig.contact.address && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-component-text mb-1">Office</h3>
                      <p className="text-component-text">{businessConfig.contact.address}</p>
                      <p className="text-sm text-component-text-muted">Visit by appointment only</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(businessConfig.social.twitter ||
                businessConfig.social.linkedin ||
                businessConfig.social.github) && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-component-text mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {businessConfig.social.twitter && (
                      <a
                        href={`https://twitter.com/${businessConfig.social.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <span className="text-sm font-bold">T</span>
                      </a>
                    )}
                    {businessConfig.social.linkedin && (
                      <a
                        href={`https://linkedin.com/${businessConfig.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                      >
                        <span className="text-sm font-bold">in</span>
                      </a>
                    )}
                    {businessConfig.social.github && (
                      <a
                        href={`https://github.com/${businessConfig.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors"
                      >
                        <span className="text-sm font-bold">GH</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-component-text mb-8">Send us a Message</h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-component-text mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-component-text mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-component-text mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-component-text mb-2"
                  >
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-component-text mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="demo">Request Demo</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-component-text mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gray-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-component-text mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-component-text-muted mb-8 max-w-2xl mx-auto">
            Experience the power of {businessConfig.displayName} with a personalized demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {businessConfig.features.hasDemo && (
              <a
                href={businessConfig.demoUrl || `/${business}?autoLogin=true`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Try Demo
              </a>
            )}
            <a
              href={`/${business}/pricing`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View Pricing
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

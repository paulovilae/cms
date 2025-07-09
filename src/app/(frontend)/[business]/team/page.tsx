import React from 'react'
import { Metadata } from 'next'
import { TeamMemberCard } from '@/components/business/universal/TeamMemberCard'
import { getBusinessTeamMembers } from '@/utilities/businessContent'
import { getBrandingForBusiness } from '@/utilities/branding'
import { type BusinessMode } from '@/utilities/environment'

interface TeamPageProps {
  params: Promise<{
    business: string
  }>
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { business } = await params

  // Type guard for business mode
  const isValidBusinessMode = (b: string): b is BusinessMode => {
    return ['intellitrade', 'salarium', 'latinos', 'all'].includes(b)
  }

  const businessMode: BusinessMode = isValidBusinessMode(business) ? business : 'all'
  const branding = getBrandingForBusiness(businessMode)

  return {
    title: `Team | ${branding.displayName}`,
    description: `Meet the talented team behind ${branding.displayName}. Our experts are dedicated to ${branding.description.toLowerCase()}`,
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { business } = await params

  // Type guard for business mode
  const isValidBusinessMode = (b: string): b is BusinessMode => {
    return ['intellitrade', 'salarium', 'latinos', 'all'].includes(b)
  }

  const businessMode: BusinessMode = isValidBusinessMode(business) ? business : 'all'
  const branding = getBrandingForBusiness(businessMode)
  const teamMembers = await getBusinessTeamMembers(business)

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-component-text mb-4">Meet Our Team</h1>
          <p className="text-xl text-component-text-muted max-w-3xl mx-auto">
            The talented professionals behind {branding.displayName} who are dedicated to{' '}
            {branding.description.toLowerCase()}
          </p>
        </div>

        {/* Team Members Grid */}
        {teamMembers && teamMembers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-component-text-muted text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-component-text mb-2">
              Team Information Coming Soon
            </h3>
            <p className="text-component-text-muted">
              We&apos;re building an amazing team. Check back soon to meet our professionals.
            </p>
          </div>
        )}

        {/* Join Our Team CTA */}
        <div className="mt-20 text-center bg-gray-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-component-text mb-4">Join Our Team</h2>
          <p className="text-lg text-component-text-muted mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals to join our mission at{' '}
            {branding.displayName}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${business}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              View Open Positions
            </a>
            <a
              href={`/${business}/contact`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Contact HR
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

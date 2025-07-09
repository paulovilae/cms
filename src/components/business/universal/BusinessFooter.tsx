import React from 'react'
import Link from 'next/link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getBrandingForBusiness, type BusinessBranding } from '@/utilities/branding'
import { type BusinessMode } from '@/utilities/environment'

interface BusinessFooterProps {
  business: string
}

export function BusinessFooter({ business }: BusinessFooterProps) {
  // Type guard to ensure business is a valid BusinessMode
  const isValidBusinessMode = (b: string): b is BusinessMode => {
    return ['intellitrade', 'salarium', 'latinos', 'all'].includes(b)
  }

  // Use 'all' as fallback for invalid business modes
  const businessMode: BusinessMode = isValidBusinessMode(business) ? business : 'all'
  const branding: BusinessBranding = getBrandingForBusiness(businessMode)

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-4 capitalize">{branding.displayName}</div>
            <p className="text-gray-300 mb-4 max-w-md">{branding.description}</p>
            <div className="flex space-x-4">
              {branding.social.twitter && (
                <a
                  href={`https://twitter.com/${branding.social.twitter.replace('@', '')}`}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              )}
              {branding.social.linkedin && (
                <a
                  href={`https://linkedin.com/${branding.social.linkedin}`}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {branding.social.github && (
                <a
                  href={`https://github.com/${branding.social.github}`}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${business}/features`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href={`/${business}/pricing`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href={`/${business}/testimonials`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${business}/about`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href={`/${business}/team`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href={`/${business}/contact`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {currentYear} {branding.displayName}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <ThemeSelector />
            <Link
              href={`/${business}/privacy`}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${business}/terms`}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

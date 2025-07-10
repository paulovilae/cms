'use client'

import HRUniversalSearch from '@/plugins/business/salarium/components/HRUniversalSearch'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HR Job Description Search | Salarium',
  description: 'Search across existing job descriptions to find relevant references',
}

/**
 * Standalone HR Search page
 * This provides a dedicated interface for searching job descriptions
 */
export default function HRSearchPage() {
  return <HRUniversalSearch />
}

import HRSearchClient from './Client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HR Job Description Search | Salarium',
  description: 'Search across existing job descriptions to find relevant references',
}

/**
 * Standalone HR Search page (server component)
 * This is a server component that exports metadata and renders the client component
 */
export default function HRSearchPage() {
  return <HRSearchClient />
}

'use client'

import { HRUniversalSearch } from '@/plugins/business/salarium/components/HRUniversalSearch'
import { useEffect } from 'react'

/**
 * Client component for HR Search
 * This provides a dedicated interface for searching job descriptions
 */
export default function HRSearchClient() {
  // Add debugging for mounting - helpful to track execution flow
  useEffect(() => {
    console.log('HRSearchClient mounted')

    // Validate that the required API endpoint is accessible
    fetch('/api/flow-instances?limit=1', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-business': 'salarium',
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('API endpoint accessible')
        } else {
          console.error('API endpoint not accessible:', response.status)
        }
      })
      .catch((err) => {
        console.error('Error checking API endpoint:', err)
      })
  }, [])

  return <HRUniversalSearch />
}

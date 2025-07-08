import React from 'react'
import { PageManagement } from '@/components/admin/PageManagement'
import { getCurrentBranding } from '@/utilities/branding'
import { generateMeta } from '@/utilities/generateMeta'

export default function PageManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageManagement />
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const branding = getCurrentBranding()

  return generateMeta({
    doc: {
      meta: {
        title: `Page Management - ${branding.displayName}`,
        description: `Manage page visibility and features for ${branding.displayName}`,
      },
    },
  })
}

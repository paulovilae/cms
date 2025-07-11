import React, { Suspense } from 'react'
import dynamicImport from 'next/dynamic'
import AutoAuthWrapper from '@/components/auth/AutoAuthWrapper'

export const dynamic = 'force-dynamic'

// Dynamic import with error handling for slate dependencies
const AutoCascadeWorkspace = dynamicImport(
  () => import('@/plugins/job-flow-cascade').then((mod) => ({ default: mod.AutoCascadeWorkspace })),
  {
    loading: () => (
      <div className="flex justify-center items-center h-64">Loading Job Flow Manager...</div>
    ),
    ssr: false,
  },
)

export default function SalariumJobFlowPage() {
  return (
    <AutoAuthWrapper>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Job Flow Manager</h1>
        <Suspense
          fallback={<div className="flex justify-center items-center h-64">Loading...</div>}
        >
          <AutoCascadeWorkspace />
        </Suspense>
      </div>
    </AutoAuthWrapper>
  )
}

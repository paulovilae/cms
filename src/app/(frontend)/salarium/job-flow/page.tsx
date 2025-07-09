import React from 'react'
import AutoAuthWrapper from '@/components/auth/AutoAuthWrapper'
import SalariumJobFlowDemo from '@/plugins/business/salarium/components/SalariumJobFlowDemo'

export const dynamic = 'force-dynamic'

export default function SalariumJobFlowPage() {
  return (
    <AutoAuthWrapper>
      <SalariumJobFlowDemo />
    </AutoAuthWrapper>
  )
}

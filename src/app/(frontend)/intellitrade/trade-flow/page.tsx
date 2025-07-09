import React from 'react'
import AutoAuthWrapper from '@/components/auth/AutoAuthWrapper'
import IntelliTradeFlowDemo from '@/plugins/business/intellitrade/components/IntelliTradeFlowDemo'

export const dynamic = 'force-dynamic'

export default function IntelliTradeFlowPage() {
  return (
    <AutoAuthWrapper>
      <IntelliTradeFlowDemo />
    </AutoAuthWrapper>
  )
}

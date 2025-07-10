export interface KYCWorkflowProps {
  onBack: () => void
}

export interface CompanyBasicInfo {
  companyName: string
  businessType: 'exporter' | 'importer' | 'both' | ''
  registrationNumber: string
  taxId: string
  incorporationCountry: string
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contactPerson: {
    name: string
    title: string
    email: string
    phone: string
  }
}

export interface FinancialInfo {
  annualRevenue: string
  employeeCount: string
  yearsInBusiness: string
  auditedFinancials: File | null
  bankReferences: Array<{
    bankName: string
    accountNumber: string
    contactPerson: string
    phone: string
  }>
}

export interface ComplianceValidation {
  ofacCheck: {
    status: 'pending' | 'clear' | 'flagged'
    details: string
    lastChecked: Date | null
  }
  sunbizValidation: {
    status: 'pending' | 'verified' | 'failed'
    registrationDetails: any
    lastChecked: Date | null
  }
  chamberOfCommerce: {
    status: 'pending' | 'verified' | 'failed'
    membershipDetails: any
    lastChecked: Date | null
  }
}

export interface VerificationResults {
  overallStatus: 'pending' | 'approved' | 'rejected' | 'requires-review'
  kycScore: number
  riskLevel: 'low' | 'medium' | 'high'
  verificationPackage: {
    packageId: string
    downloadUrl: string
    expiryDate: Date
    watermarkId: string
  } | null
  reuseableCredentials: {
    tickVerdeId: string
    validUntil: Date
    applicableRegions: string[]
  } | null
  recommendations: string[]
  nextSteps: string[]
}

export interface WorkflowStep {
  id: number
  name: string
  status: 'completed' | 'current' | 'upcoming'
}

import type {
  WorkflowStep,
  ComplianceValidation,
  VerificationResults,
} from '../types/workflow.types'

export const createWorkflowSteps = (currentStep: number): WorkflowStep[] => [
  {
    id: 1,
    name: 'Company Info',
    status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming',
  },
  {
    id: 2,
    name: 'Financial Data',
    status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming',
  },
  {
    id: 3,
    name: 'Compliance',
    status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming',
  },
  {
    id: 4,
    name: 'Documents',
    status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming',
  },
  { id: 5, name: 'Verification', status: currentStep === 5 ? 'current' : 'upcoming' },
]

export const generateVerificationResults = (
  complianceValidation: ComplianceValidation,
  setVerificationResults: (results: VerificationResults) => void,
): void => {
  const allValidationsPass =
    complianceValidation.ofacCheck.status === 'clear' &&
    complianceValidation.sunbizValidation.status === 'verified' &&
    complianceValidation.chamberOfCommerce.status === 'verified'

  if (allValidationsPass) {
    setVerificationResults({
      overallStatus: 'approved',
      kycScore: 92,
      riskLevel: 'low',
      verificationPackage: {
        packageId: 'PKG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        downloadUrl: '/api/kyc/packages/download',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        watermarkId: 'WM-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      },
      reuseableCredentials: {
        tickVerdeId: 'TV-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        applicableRegions: ['USA', 'Colombia', 'Latin America'],
      },
      recommendations: [
        'KYC validation completed successfully',
        'Company approved for trade finance transactions',
        'Credentials can be reused for future transactions',
      ],
      nextSteps: [
        'Proceed to Samples Evidence workflow',
        'Set up Smart Escrow account',
        'Configure AI Oracle parameters',
      ],
    })
  }
}

export const isComplianceValidationComplete = (
  complianceValidation: ComplianceValidation,
): boolean => {
  return (
    complianceValidation.ofacCheck.status !== 'pending' &&
    complianceValidation.sunbizValidation.status !== 'pending' &&
    complianceValidation.chamberOfCommerce.status !== 'pending'
  )
}

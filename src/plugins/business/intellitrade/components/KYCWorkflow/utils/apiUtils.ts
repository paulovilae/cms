import type { ComplianceValidation } from '../types/workflow.types'

export interface ValidationAPIs {
  checkOFAC: (
    companyName: string,
    taxId: string,
  ) => Promise<{
    status: 'clear' | 'flagged'
    confidence: number
    details: string
  }>
  validateSunbiz: (
    registrationNumber: string,
    state: string,
  ) => Promise<{
    status: 'verified' | 'failed'
    companyDetails: {
      name: string
      status: string
      filingDate: string
    }
  }>
  checkChamberOfCommerce: (
    companyName: string,
    country: string,
  ) => Promise<{
    status: 'verified' | 'failed'
    membershipLevel: string
    memberSince: string
  }>
}

export const createMockValidationAPIs = (
  setIsLoading: (loading: boolean) => void,
): ValidationAPIs => ({
  async checkOFAC(companyName: string, taxId: string) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    return {
      status: 'clear' as const,
      confidence: 0.95,
      details: 'No matches found in OFAC sanctions lists',
    }
  },

  async validateSunbiz(registrationNumber: string, state: string) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    return {
      status: 'verified' as const,
      companyDetails: {
        name: 'Don Hugo Exports LLC',
        status: 'Active',
        filingDate: '2020-03-15',
      },
    }
  },

  async checkChamberOfCommerce(companyName: string, country: string) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1800))
    setIsLoading(false)
    return {
      status: 'verified' as const,
      membershipLevel: 'Premium',
      memberSince: '2020-04-01',
    }
  },
})

export const handleComplianceValidation = async (
  companyName: string,
  taxId: string,
  registrationNumber: string,
  state: string,
  incorporationCountry: string,
  validationAPIs: ValidationAPIs,
  setComplianceValidation: (validation: ComplianceValidation) => void,
): Promise<void> => {
  // Run all validations
  const ofacResult = await validationAPIs.checkOFAC(companyName, taxId)
  const sunbizResult = await validationAPIs.validateSunbiz(registrationNumber, state)
  const chamberResult = await validationAPIs.checkChamberOfCommerce(
    companyName,
    incorporationCountry,
  )

  setComplianceValidation({
    ofacCheck: {
      status: ofacResult.status,
      details: ofacResult.details,
      lastChecked: new Date(),
    },
    sunbizValidation: {
      status: sunbizResult.status,
      registrationDetails: sunbizResult.companyDetails,
      lastChecked: new Date(),
    },
    chamberOfCommerce: {
      status: chamberResult.status,
      membershipDetails: {
        level: chamberResult.membershipLevel,
        since: chamberResult.memberSince,
      },
      lastChecked: new Date(),
    },
  })
}

// Main component
export { KYCWorkflowMain } from './KYCWorkflowMain'

// Types
export type {
  KYCWorkflowProps,
  CompanyBasicInfo,
  FinancialInfo,
  ComplianceValidation,
  VerificationResults,
  WorkflowStep,
} from './types/workflow.types'

// Individual step components
export { ProgressIndicator } from './components/ProgressIndicator'
export { CompanyInfoStep } from './components/CompanyInfoStep'
export { FinancialInfoStep } from './components/FinancialInfoStep'
export { ComplianceStep } from './components/ComplianceStep'
export { DocumentUploadStep } from './components/DocumentUploadStep'
export { VerificationResultsStep } from './components/VerificationResultsStep'

// Utilities
export {
  createWorkflowSteps,
  generateVerificationResults,
  isComplianceValidationComplete,
} from './utils/workflowUtils'

export { createMockValidationAPIs, handleComplianceValidation } from './utils/apiUtils'

export type { ValidationAPIs } from './utils/apiUtils'

// Default export for backward compatibility
export { KYCWorkflowMain as default } from './KYCWorkflowMain'

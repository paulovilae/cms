// Main exports for the Job Description Workflow components
export { default as WorkflowMain } from './components/WorkflowMain'

// Type exports
export type {
  FlowTemplate,
  FlowInstance,
  FlowStep,
  StepResponse,
  ContextItem,
  ContextIndicatorProps,
  ContextPreviewModalProps,
} from './types/workflow.types'

// Utility exports
export {
  calculateRelevance,
  buildPreviousStepsContext,
  getBusinessContext,
} from './utils/contextUtils'

export {
  fetchWithAuth,
  createFlowInstance,
  updateFlowInstance,
  processAIStep,
  fetchFlowTemplates,
  fetchFlowInstance,
  deleteFlowInstance,
  saveStepResponse,
  generateFinalDocument,
  retryWithExponentialBackoff,
  validateStepInput,
  formatErrorMessage,
  isNetworkError,
  shouldRetry,
  type AIProcessingRequest,
  type APIResponse,
} from './utils/apiUtils'

export {
  getPlaceholderForStep,
  generateFinalDocument as generateDocument,
  downloadAsPDF,
  downloadAsTXT,
  downloadAsWord,
  printDocument,
  copyToClipboard,
  shareOnSocial,
} from './utils/documentUtils'

import React from 'react'
import { KYCWorkflowMain } from './KYCWorkflow/KYCWorkflowMain'
import type { KYCWorkflowProps } from './KYCWorkflow/types/workflow.types'

/**
 * KYC Workflow Component
 *
 * This component has been refactored into a modular architecture for better maintainability.
 * The implementation is now split across multiple focused modules:
 *
 * - types/workflow.types.ts - TypeScript interfaces and types
 * - utils/apiUtils.ts - API integration and validation logic
 * - utils/workflowUtils.ts - Workflow state management utilities
 * - components/ - Individual step components for each workflow stage
 * - KYCWorkflowMain.tsx - Main orchestrator component
 *
 * This modular structure provides:
 * - Better separation of concerns
 * - Easier testing and maintenance
 * - Reusable components and utilities
 * - Improved code organization
 */
export default function KYCWorkflow({ onBack }: KYCWorkflowProps) {
  return <KYCWorkflowMain onBack={onBack} />
}

// Re-export types for backward compatibility
export type { KYCWorkflowProps } from './KYCWorkflow/types/workflow.types'

import React from 'react'
import { Config, Plugin } from 'payload'
import { FlowDocuments } from './collections/FlowDocuments'
import { DocumentSections } from './collections/DocumentSections'
import { GenerationHistory } from './collections/GenerationHistory'
import { FlowTemplates } from './collections/FlowTemplates'
import { AutoCascadeBlock } from './blocks/AutoCascadeBlock'

/**
 * Job Flow Cascade Plugin
 *
 * A universal document generation plugin that provides AI-powered
 * document creation and editing capabilities across all business units.
 *
 * Features:
 * - Hierarchical document structure with sections
 * - AI-powered content generation with cascading capabilities
 * - Rich text editing with formatting and export options
 * - Fullscreen document-centric interface
 * - Block-based integration for embedding in any content model
 */
export const jobFlowCascadePlugin = (): Plugin => {
  return (incomingConfig: Config) => {
    return {
      ...incomingConfig,
      collections: [
        ...(incomingConfig.collections || []),
        FlowDocuments,
        DocumentSections,
        GenerationHistory,
        // FlowTemplates, // Temporarily disabled until database migration is complete
      ],
      admin: {
        ...(incomingConfig.admin || {}),
        components: {
          ...(incomingConfig.admin?.components || {}),
          // Custom admin components will be registered here
        },
      },
      onInit: async (payload: any) => {
        // Call the original onInit if it exists
        if (incomingConfig.onInit) {
          await incomingConfig.onInit(payload)
        }

        // Log initialization of the Job Flow Cascade plugin
        payload.logger.info('✓ Job Flow Cascade Plugin initialized')
      },
    }
  }
}

/**
 * Export the components for direct use in frontend applications
 * Using dynamic imports to avoid slate module resolution issues during plugin load
 */
export const AutoCascadeWorkspace = React.lazy(() =>
  import('./components').then((module) => ({ default: module.AutoCascadeWorkspace })),
)

/**
 * Export the block for use in Payload block fields
 */
export { AutoCascadeBlock } from './blocks/AutoCascadeBlock'

/**
 * Export the hooks for use in custom components
 * These don't directly import slate, so they're safe to export normally
 */
export { useDocumentState } from './hooks/useDocumentState'
export { useCascadeGeneration } from './hooks/useCascadeGeneration'

/**
 * Export useRichTextEditor with dynamic import since it depends on slate
 */
export const useRichTextEditor = () => {
  throw new Error(
    'useRichTextEditor must be imported dynamically. Use: const { useRichTextEditor } = await import("@/plugins/job-flow-cascade/hooks/useRichTextEditor")',
  )
}

/**
 * Export plugin as default
 */
export default jobFlowCascadePlugin

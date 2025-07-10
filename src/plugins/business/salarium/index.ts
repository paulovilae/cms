import { Plugin } from 'payload'

// Import Salarium collections
import { FlowTemplates } from './collections/FlowTemplates'
import { FlowInstances } from './collections/FlowInstances'
import { Organizations } from './collections/Organizations'
import { JobFamilies } from './collections/JobFamilies'
import { Departments } from './collections/Departments'

// Import AI processing hook from shared plugin
import { aiProcessingHook } from '../../shared/ai-management/hooks/aiProcessingHook'

/**
 * Salarium Plugin
 *
 * Human resources management system focused on document workflows,
 * employee management, and organizational processes.
 *
 * MIGRATED: Now uses standard Payload APIs with AI processing hook
 */
export const salariumPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      FlowTemplates,
      {
        ...FlowInstances,
        hooks: {
          ...FlowInstances.hooks,
          beforeChange: [
            ...(FlowInstances.hooks?.beforeChange || []),
            aiProcessingHook, // AI processing hook restored
          ],
        },
      },
      Organizations,
      JobFamilies,
      Departments,
    ],
    // endpoints: [...] // REMOVED - using standard Payload APIs
  }
}

export default salariumPlugin

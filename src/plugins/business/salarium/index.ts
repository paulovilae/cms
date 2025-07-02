import { Plugin } from 'payload'

// Import Salarium collections
import { FlowTemplates } from './collections/FlowTemplates'
import { FlowInstances } from './collections/FlowInstances'
import { Organizations } from './collections/Organizations'
import { JobFamilies } from './collections/JobFamilies'
import { Departments } from './collections/Departments'

/**
 * Salarium Plugin
 *
 * Human resources management system focused on document workflows,
 * employee management, and organizational processes.
 */
export const salariumPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      FlowTemplates,
      FlowInstances,
      Organizations,
      JobFamilies,
      Departments,
    ],
  }
}

export default salariumPlugin

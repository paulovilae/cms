import { Plugin } from 'payload'

// Import IntelliTrade collections
import { Companies } from './collections/Companies'
import { ExportTransactions } from './collections/ExportTransactions'
import { Routes } from './collections/Routes'
import { SmartContracts } from './collections/SmartContracts'

/**
 * IntelliTrade Plugin
 *
 * Trade finance platform with blockchain technology and smart contracts
 * for Latin American exporters and global buyers.
 */
export const intellitradePlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      Companies,
      ExportTransactions,
      Routes,
      SmartContracts,
    ],
    // Note: Blocks are handled differently in Payload v3
    // They are typically added to rich text fields or page builders
  }
}

export default intellitradePlugin

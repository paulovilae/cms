import type { Config } from 'payload'
import { EscrowAgreements } from './collections/EscrowAgreements'
import { Milestones } from './collections/Milestones'
import { MilestoneEvidence } from './collections/MilestoneEvidence'
import { PaymentReleases } from './collections/PaymentReleases'

export interface EscrowPluginOptions {
  enabled?: boolean
  storageAdapter?: 'local' | 's3' | 'ipfs'
  blockchainEnabled?: boolean
}

export const escrowPlugin =
  (options: EscrowPluginOptions = {}) =>
  (incomingConfig: Config): Config => {
    if (options.enabled === false) {
      return incomingConfig
    }

    let config = { ...incomingConfig }

    config.collections = [
      ...(config.collections || []),
      EscrowAgreements,
      Milestones,
      MilestoneEvidence,
      PaymentReleases,
    ]

    config.onInit = async (payload) => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      payload.logger.info('Escrow plugin initialized')
    }

    return config
  }

export default escrowPlugin

import type { Config } from 'payload'
import { KYCApplications } from './collections/KYCApplications'
import { VerificationDocuments } from './collections/VerificationDocuments'
import { KYCTemplates } from './collections/KYCTemplates'

export interface KYCPluginOptions {
  enabled?: boolean
  kycProvider?: 'manual' | 'sumsub' | 'truora' | 'complyadvantage'
  storageAdapter?: 'local' | 's3' | 'ipfs'
  autoApprove?: boolean
  complianceLevel?: 'basic' | 'enhanced' | 'full'
}

export const kycPlugin =
  (options: KYCPluginOptions = {}) =>
  (incomingConfig: Config): Config => {
    if (options.enabled === false) {
      return incomingConfig
    }

    // create copy of incoming config
    let config = { ...incomingConfig }

    // Add collections
    config.collections = [
      ...(config.collections || []),
      KYCApplications,
      VerificationDocuments,
      KYCTemplates,
    ]

    // Add onInit for plugin setup
    config.onInit = async (payload) => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)

      payload.logger.info('KYC plugin initialized')
    }

    return config
  }

export default kycPlugin

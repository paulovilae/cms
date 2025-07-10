import { Config, Plugin } from 'payload'
import { searchEndpoint, suggestionsEndpoint } from './endpoints/search'
import { registerBusinessSearchConfig } from './business-config'
import { salariumSearchConfig } from './business-config/salarium'
import { intellitradeSearchConfig } from './business-config/intellitrade'
import { latinosSearchConfig } from './business-config/latinos'

/**
 * Universal AI-Powered Search Plugin
 *
 * This plugin provides AI-powered search capabilities with business-specific
 * configurations for different business units: Salarium, IntelliTrade, and Latinos.
 *
 * Phase 4 implementation adds comprehensive business-specific search configurations
 * that tailor the search experience for each business domain:
 *
 * - Salarium: HR-optimized search with job description and organizational focus
 * - IntelliTrade: Trade finance search with contract and verification capabilities
 * - Latinos: Trading bot search with performance metrics and strategy focus
 *
 * Each configuration includes:
 * - Domain-specific search fields with appropriate weighting
 * - Business-relevant filters
 * - Context-aware actions
 * - Specialized preview configurations
 * - Domain-specific AI prompt customizations
 */
export const universalSearchPlugin = (): Plugin => {
  return (incomingConfig: Config): Config => {
    // Register business-specific search configurations from Phase 4
    // These configurations provide domain-specific search capabilities
    // tailored to each business unit's unique needs
    registerBusinessSearchConfig('salarium', salariumSearchConfig)
    registerBusinessSearchConfig('intellitrade', intellitradeSearchConfig)
    registerBusinessSearchConfig('latinos', latinosSearchConfig)

    // Add the search endpoints to the Payload configuration
    return {
      ...incomingConfig,
      endpoints: [...(incomingConfig.endpoints || []), searchEndpoint, suggestionsEndpoint],
      onInit: async (payload: any) => {
        // Call the original onInit if it exists
        if (incomingConfig.onInit) {
          await incomingConfig.onInit(payload)
        }

        // Log initialization of the search plugin with Phase 4 info
        payload.logger.info(
          '✓ Universal Search Plugin initialized with business-specific configurations (Phase 4)',
        )

        // Log each business configuration that was registered
        payload.logger.info(
          `  - Salarium: HR-optimized search (${salariumSearchConfig.searchFields.length} fields, ${salariumSearchConfig.filters.length} filters)`,
        )
        payload.logger.info(
          `  - IntelliTrade: Trade finance search (${intellitradeSearchConfig.searchFields.length} fields, ${intellitradeSearchConfig.filters.length} filters)`,
        )
        payload.logger.info(
          `  - Latinos: Trading bot search (${latinosSearchConfig.searchFields.length} fields, ${latinosSearchConfig.filters.length} filters)`,
        )
      },
    }
  }
}

/**
 * Export the search service for direct use in components
 */
export { searchService } from './services/search-service'

/**
 * Export the business configuration utilities
 */
export { getBusinessSearchConfig, registerBusinessSearchConfig } from './business-config'

/**
 * Export plugin as default
 */
export default universalSearchPlugin

/**
 * Feature flags for Job Flow Cascade plugin
 *
 * This allows us to gradually enable enhanced features as the database
 * schema is migrated to support them.
 */

export interface JobFlowFeatures {
  enhancedFields: boolean
  templateSystem: boolean
  workflowManagement: boolean
  aiConfiguration: boolean
  interactionHistory: boolean
  organizationSupport: boolean
}

/**
 * Current feature configuration
 *
 * Set enhancedFields to false to disable fields that require database migration
 */
export const CURRENT_FEATURES: JobFlowFeatures = {
  enhancedFields: false, // Disable until database migration
  templateSystem: false, // Disable until templates are implemented
  workflowManagement: false, // Disable until workflow tables exist
  aiConfiguration: false, // Disable until AI config tables exist
  interactionHistory: false, // Disable until history tables exist
  organizationSupport: false, // Disable until organization tables exist
}

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof JobFlowFeatures): boolean => {
  return CURRENT_FEATURES[feature]
}

/**
 * Get all enabled features
 */
export const getEnabledFeatures = (): Partial<JobFlowFeatures> => {
  return Object.entries(CURRENT_FEATURES)
    .filter(([_, enabled]) => enabled)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

import type { Config } from 'payload';
import type { ConfigurationManager, BusinessContext, BusinessConfiguration, PluginLoadResult, OrchestratorLogger } from './types';
/**
 * Configuration manager implementation for business-specific config merging
 * Following memory bank best practices for simple, robust plugin development
 */
export declare class ConfigurationManagerImpl implements ConfigurationManager {
    private logger;
    private businessConfigs;
    constructor(logger: OrchestratorLogger, customConfigs?: Partial<Record<BusinessContext, Partial<BusinessConfiguration>>>);
    /**
     * Merge business-specific configuration with base Payload config
     * Uses simple, safe merging following memory bank guidance
     */
    mergeBusinessConfig(baseConfig: Config, businessContext: BusinessContext, plugins: PluginLoadResult[]): Promise<Config>;
    /**
     * Get business configuration for a specific context
     */
    getBusinessConfig(context: BusinessContext): BusinessConfiguration | null;
    /**
     * Validate configuration using simple checks
     */
    validateConfig(config: Config): Promise<boolean>;
    /**
     * Apply plugin configurations to base config
     * Simple merging without complex type manipulation
     */
    applyPluginConfigs(config: Config, plugins: PluginLoadResult[]): Config;
    /**
     * Update business configuration
     */
    updateBusinessConfig(context: BusinessContext, updates: Partial<BusinessConfiguration>): void;
    /**
     * Get all business configurations
     */
    getAllBusinessConfigs(): Record<BusinessContext, BusinessConfiguration>;
    /**
     * Apply custom configurations safely
     */
    private applyCustomConfigurations;
    /**
     * Add business context global safely
     */
    private addBusinessContextGlobal;
    /**
     * Apply admin customizations safely
     */
    private applyAdminCustomizations;
    /**
     * Get server URL for business
     */
    private getServerURL;
    /**
     * Get CORS settings for business - simplified approach
     */
    private getCORSSettings;
}
//# sourceMappingURL=ConfigurationManager.d.ts.map
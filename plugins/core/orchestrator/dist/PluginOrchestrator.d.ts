import type { Config } from 'payload';
import type { BusinessContext, PluginMetadata, OrchestratorOptions, PluginLoadResult } from './types';
/**
 * PluginOrchestrator manages plugin loading, dependency resolution, and lifecycle
 * for the multi-tenant business platform
 */
export declare class PluginOrchestrator {
    private loadedPlugins;
    private pluginDependencies;
    private options;
    constructor(options?: OrchestratorOptions);
    /**
     * Load plugins based on business context and configuration
     */
    loadPluginsForBusiness(businessContext: BusinessContext, config: Config): Promise<PluginLoadResult>;
    /**
     * Get list of plugins to load for a specific business context
     */
    private getPluginsForBusiness;
    /**
     * Get core plugins that are always required
     */
    private getCorePlugins;
    /**
     * Get business-specific plugins
     */
    private getBusinessPlugins;
    /**
     * Get shared plugins based on business context
     */
    private getSharedPlugins;
    /**
     * Sort plugins by dependencies and priority
     */
    private sortPluginsByDependencies;
    /**
     * Load a single plugin
     */
    private loadPlugin;
    /**
     * Get information about loaded plugins
     */
    getLoadedPlugins(): PluginMetadata[];
    /**
     * Check if a specific plugin is loaded
     */
    isPluginLoaded(pluginName: string): boolean;
    /**
     * Get plugin dependencies
     */
    getPluginDependencies(pluginName: string): string[];
    /**
     * Unload a plugin (for testing or hot reloading)
     */
    unloadPlugin(pluginName: string): boolean;
    /**
     * Clear all loaded plugins
     */
    clearPlugins(): void;
    /**
     * Validate plugin configuration
     */
    validatePluginConfig(plugin: PluginMetadata): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Get plugin loading statistics
     */
    getStats(): {
        totalLoaded: number;
        corePlugins: number;
        sharedPlugins: number;
        businessPlugins: number;
    };
    /**
     * Log messages with optional emoji prefixes
     */
    private log;
}
//# sourceMappingURL=PluginOrchestrator.d.ts.map
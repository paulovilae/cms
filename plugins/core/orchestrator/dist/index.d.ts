/**
 * Core Orchestrator Plugin for Multi-Tenant Business Platform
 *
 * This plugin provides intelligent business detection, plugin orchestration,
 * and configuration management for multi-tenant applications.
 *
 * @example
 * ```typescript
 * import { orchestratorPlugin } from '@paulovila/core-orchestrator'
 *
 * export default buildConfig({
 *   plugins: [
 *     orchestratorPlugin({
 *       enabled: true,
 *       autoDetection: true,
 *       logging: { level: 'info' }
 *     }),
 *   ],
 * })
 * ```
 */
import type { Plugin } from 'payload';
import { BusinessDetectorImpl } from './BusinessDetector';
import { PluginOrchestrator } from './PluginOrchestrator';
import { ConfigurationManagerImpl } from './ConfigurationManager';
import type { LogLevel } from './types';
/**
 * Enhanced configuration options for the Orchestrator Plugin
 * Extends the base options with additional plugin-specific settings
 */
export interface OrchestratorPluginOptions {
    /** Enable or disable the plugin */
    enabled?: boolean;
    /** Enable automatic business detection */
    autoDetection?: boolean;
    /** Plugin discovery and loading options */
    plugins?: {
        /** Enable automatic plugin discovery */
        autoDiscovery?: boolean;
        /** Directories to search for plugins */
        searchPaths?: string[];
        /** Plugin loading strategy */
        loadingStrategy?: 'eager' | 'lazy' | 'on-demand';
        /** Maximum plugins to load */
        maxPlugins?: number;
        /** Plugin loading timeout in milliseconds */
        timeout?: number;
    };
    /** Configuration management options */
    configuration?: {
        /** Enable configuration merging */
        merging?: boolean;
        /** Configuration merge strategy */
        mergeStrategy?: 'deep' | 'shallow' | 'replace';
        /** Enable configuration validation */
        validation?: boolean;
        /** Configuration cache settings */
        cache?: {
            enabled?: boolean;
            ttl?: number;
        };
    };
    /** Logging configuration */
    logging?: {
        /** Log level */
        level?: LogLevel;
        /** Enable structured logging */
        structured?: boolean;
        /** Log output format */
        format?: 'json' | 'text';
        /** Enable performance logging */
        performance?: boolean;
    };
    /** Business detection options */
    detection?: {
        /** Enable domain-based detection */
        domain?: boolean;
        /** Enable port-based detection */
        port?: boolean;
        /** Enable environment variable detection */
        environment?: boolean;
        /** Custom detection rules */
        customRules?: Array<{
            name: string;
            condition: (context: any) => boolean;
            business: string;
        }>;
    };
    /** Development and debugging options */
    development?: {
        /** Enable development mode features */
        enabled?: boolean;
        /** Enable hot reloading */
        hotReload?: boolean;
        /** Enable debug logging */
        debug?: boolean;
        /** Enable plugin validation */
        validation?: boolean;
    };
    /** Security options */
    security?: {
        /** Enable plugin signature verification */
        verifySignatures?: boolean;
        /** Allowed plugin sources */
        allowedSources?: string[];
        /** Enable sandbox mode */
        sandbox?: boolean;
    };
    /** Performance options */
    performance?: {
        /** Enable performance monitoring */
        monitoring?: boolean;
        /** Performance budget in milliseconds */
        budget?: number;
        /** Enable lazy loading */
        lazyLoading?: boolean;
    };
}
/**
 * Core Orchestrator Plugin
 *
 * Provides intelligent business detection, plugin orchestration, and configuration
 * management for multi-tenant business platforms.
 */
export declare const orchestratorPlugin: (options?: OrchestratorPluginOptions) => Plugin;
export type { OrchestratorOptions, BusinessContext, PluginMetadata, LogLevel } from './types';
export { BusinessDetectorImpl, PluginOrchestrator, ConfigurationManagerImpl };
export default orchestratorPlugin;
//# sourceMappingURL=index.d.ts.map
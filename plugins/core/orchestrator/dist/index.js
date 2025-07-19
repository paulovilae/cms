"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationManagerImpl = exports.PluginOrchestrator = exports.BusinessDetectorImpl = exports.orchestratorPlugin = void 0;
const BusinessDetector_1 = require("./BusinessDetector");
Object.defineProperty(exports, "BusinessDetectorImpl", { enumerable: true, get: function () { return BusinessDetector_1.BusinessDetectorImpl; } });
const PluginOrchestrator_1 = require("./PluginOrchestrator");
Object.defineProperty(exports, "PluginOrchestrator", { enumerable: true, get: function () { return PluginOrchestrator_1.PluginOrchestrator; } });
const ConfigurationManager_1 = require("./ConfigurationManager");
Object.defineProperty(exports, "ConfigurationManagerImpl", { enumerable: true, get: function () { return ConfigurationManager_1.ConfigurationManagerImpl; } });
/**
 * Default configuration options
 */
const defaultOptions = {
    enabled: true,
    autoDetection: true,
    plugins: {
        autoDiscovery: true,
        searchPaths: ['./plugins', './node_modules/@paulovila'],
        loadingStrategy: 'eager',
        maxPlugins: 100,
        timeout: 30000,
    },
    configuration: {
        merging: true,
        mergeStrategy: 'deep',
        validation: true,
        cache: {
            enabled: true,
            ttl: 300000, // 5 minutes
        },
    },
    logging: {
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        structured: true,
        format: 'json',
        performance: process.env.NODE_ENV === 'development',
    },
    detection: {
        domain: true,
        port: true,
        environment: true,
        customRules: [],
    },
    development: {
        enabled: process.env.NODE_ENV === 'development',
        hotReload: process.env.NODE_ENV === 'development',
        debug: process.env.NODE_ENV === 'development',
        validation: true,
    },
    security: {
        verifySignatures: process.env.NODE_ENV === 'production',
        allowedSources: ['@paulovila'],
        sandbox: false,
    },
    performance: {
        monitoring: true,
        budget: 5000, // 5 seconds
        lazyLoading: false,
    },
};
/**
 * Logger utility for structured logging
 */
class Logger {
    constructor(options) {
        this.options = options;
    }
    log(level, message, data) {
        if (this.shouldLog(level)) {
            const logEntry = this.options.structured
                ? {
                    timestamp: new Date().toISOString(),
                    level,
                    plugin: 'orchestrator',
                    message,
                    ...(data && { data })
                }
                : `[${level.toUpperCase()}] [Orchestrator] ${message}`;
            const output = this.options.format === 'json' && this.options.structured
                ? JSON.stringify(logEntry)
                : typeof logEntry === 'string' ? logEntry : `${logEntry.message}`;
            console.log(output);
        }
    }
    shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.options.level || 'info');
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }
    error(message, data) {
        this.log('error', message, data);
    }
    warn(message, data) {
        this.log('warn', message, data);
    }
    info(message, data) {
        this.log('info', message, data);
    }
    success(message, data) {
        this.log('info', message, data);
    }
    debug(message, data) {
        this.log('debug', message, data);
    }
}
/**
 * Core Orchestrator Plugin
 *
 * Provides intelligent business detection, plugin orchestration, and configuration
 * management for multi-tenant business platforms.
 */
const orchestratorPlugin = (options = {}) => {
    return (incomingConfig) => {
        const config = { ...incomingConfig };
        const pluginOptions = { ...defaultOptions, ...options };
        // Initialize logger
        const logger = new Logger(pluginOptions.logging);
        // Graceful disable
        if (!pluginOptions.enabled) {
            logger.info('Plugin disabled via configuration');
            return config;
        }
        try {
            logger.info('Initializing Orchestrator Plugin', {
                version: '1.0.0',
                options: pluginOptions
            });
            // Initialize core components
            const businessDetector = new BusinessDetector_1.BusinessDetectorImpl(logger);
            const pluginOrchestrator = new PluginOrchestrator_1.PluginOrchestrator({
                registry: {
                    autoDiscovery: pluginOptions.plugins.autoDiscovery,
                    searchPaths: pluginOptions.plugins.searchPaths
                },
                pluginLoading: {
                    timeout: pluginOptions.plugins.timeout
                }
            });
            const configurationManager = new ConfigurationManager_1.ConfigurationManagerImpl(logger);
            // Store original onInit for chaining
            const originalOnInit = config.onInit;
            // Enhanced onInit with orchestration
            config.onInit = async (payload) => {
                const startTime = Date.now();
                try {
                    // Run original onInit first
                    if (originalOnInit) {
                        logger.debug('Running original onInit');
                        await originalOnInit(payload);
                    }
                    // Detect business context
                    logger.debug('Detecting business context');
                    const businessContext = await businessDetector.detect();
                    logger.info('Business context detected', { businessContext });
                    // Load and orchestrate plugins
                    let pluginResult = { loaded: [] };
                    if (pluginOptions.plugins.autoDiscovery) {
                        logger.debug('Starting plugin discovery and loading');
                        pluginResult = await pluginOrchestrator.loadPluginsForBusiness(businessContext.context, config);
                        logger.info('Plugins loaded successfully', {
                            count: pluginResult.loaded.length,
                            plugins: pluginResult.loaded
                        });
                    }
                    // Apply configuration management
                    if (pluginOptions.configuration.merging) {
                        logger.debug('Applying configuration management');
                        const mergedConfig = await configurationManager.mergeBusinessConfig(config, businessContext.context, [pluginResult]);
                        Object.assign(config, mergedConfig);
                        logger.info('Configuration merged successfully');
                    }
                    // Performance logging
                    if (pluginOptions.logging.performance) {
                        const duration = Date.now() - startTime;
                        const budget = pluginOptions.performance.budget || 5000;
                        logger.info('Orchestrator initialization completed', {
                            duration: `${duration}ms`,
                            withinBudget: duration <= budget
                        });
                        if (duration > budget) {
                            logger.warn('Initialization exceeded performance budget', {
                                duration: `${duration}ms`,
                                budget: `${budget}ms`
                            });
                        }
                    }
                    logger.info('✅ Orchestrator Plugin initialized successfully');
                }
                catch (error) {
                    logger.error('Failed to initialize Orchestrator Plugin', {
                        error: error instanceof Error ? error.message : String(error),
                        stack: error instanceof Error ? error.stack : undefined
                    });
                    // Don't throw - allow app to continue with degraded functionality
                    logger.warn('Continuing with degraded functionality');
                }
            };
            // Add plugin metadata to config
            config.admin = {
                ...config.admin,
                meta: {
                    ...config.admin?.meta,
                    // Store orchestrator metadata in a way that doesn't conflict with Payload types
                    ...(config.admin?.meta || {}),
                    'orchestrator-plugin': {
                        version: '1.0.0',
                        enabled: true,
                        businessDetection: pluginOptions.autoDetection,
                        pluginCount: 0, // Will be updated during initialization
                    }
                } // Use type assertion to avoid strict typing issues
            };
            logger.info('Orchestrator Plugin configuration applied successfully');
            return config;
        }
        catch (error) {
            logger.error('Critical error during plugin configuration', {
                error: error instanceof Error ? error.message : String(error)
            });
            // Return original config to prevent app crash
            logger.warn('Returning original configuration due to critical error');
            return incomingConfig;
        }
    };
};
exports.orchestratorPlugin = orchestratorPlugin;
// Default export for convenience
exports.default = exports.orchestratorPlugin;
//# sourceMappingURL=index.js.map
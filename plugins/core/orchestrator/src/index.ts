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

import type { Config, Plugin } from 'payload'
import { BusinessDetectorImpl } from './BusinessDetector'
import { PluginOrchestrator } from './PluginOrchestrator'
import { ConfigurationManagerImpl } from './ConfigurationManager'
import type {
  OrchestratorOptions as BaseOrchestratorOptions,
  BusinessContext,
  PluginMetadata,
  OrchestratorLogger,
  LogLevel
} from './types'

/**
 * Enhanced configuration options for the Orchestrator Plugin
 * Extends the base options with additional plugin-specific settings
 */
export interface OrchestratorPluginOptions {
  /** Enable or disable the plugin */
  enabled?: boolean
  
  /** Enable automatic business detection */
  autoDetection?: boolean
  
  /** Plugin discovery and loading options */
  plugins?: {
    /** Enable automatic plugin discovery */
    autoDiscovery?: boolean
    
    /** Directories to search for plugins */
    searchPaths?: string[]
    
    /** Plugin loading strategy */
    loadingStrategy?: 'eager' | 'lazy' | 'on-demand'
    
    /** Maximum plugins to load */
    maxPlugins?: number
    
    /** Plugin loading timeout in milliseconds */
    timeout?: number
  }
  
  /** Configuration management options */
  configuration?: {
    /** Enable configuration merging */
    merging?: boolean
    
    /** Configuration merge strategy */
    mergeStrategy?: 'deep' | 'shallow' | 'replace'
    
    /** Enable configuration validation */
    validation?: boolean
    
    /** Configuration cache settings */
    cache?: {
      enabled?: boolean
      ttl?: number // Time to live in milliseconds
    }
  }
  
  /** Logging configuration */
  logging?: {
    /** Log level */
    level?: LogLevel
    
    /** Enable structured logging */
    structured?: boolean
    
    /** Log output format */
    format?: 'json' | 'text'
    
    /** Enable performance logging */
    performance?: boolean
  }
  
  /** Business detection options */
  detection?: {
    /** Enable domain-based detection */
    domain?: boolean
    
    /** Enable port-based detection */
    port?: boolean
    
    /** Enable environment variable detection */
    environment?: boolean
    
    /** Custom detection rules */
    customRules?: Array<{
      name: string
      condition: (context: any) => boolean
      business: string
    }>
  }
  
  /** Development and debugging options */
  development?: {
    /** Enable development mode features */
    enabled?: boolean
    
    /** Enable hot reloading */
    hotReload?: boolean
    
    /** Enable debug logging */
    debug?: boolean
    
    /** Enable plugin validation */
    validation?: boolean
  }
  
  /** Security options */
  security?: {
    /** Enable plugin signature verification */
    verifySignatures?: boolean
    
    /** Allowed plugin sources */
    allowedSources?: string[]
    
    /** Enable sandbox mode */
    sandbox?: boolean
  }
  
  /** Performance options */
  performance?: {
    /** Enable performance monitoring */
    monitoring?: boolean
    
    /** Performance budget in milliseconds */
    budget?: number
    
    /** Enable lazy loading */
    lazyLoading?: boolean
  }
}

/**
 * Default configuration options
 */
const defaultOptions: Required<OrchestratorPluginOptions> = {
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
}

/**
 * Logger utility for structured logging
 */
class Logger {
  private options: Required<OrchestratorPluginOptions>['logging']
  
  constructor(options: Required<OrchestratorPluginOptions>['logging']) {
    this.options = options
  }
  
  private log(level: LogLevel, message: string, data?: any): void {
    if (this.shouldLog(level)) {
      const logEntry = this.options.structured 
        ? { 
            timestamp: new Date().toISOString(),
            level,
            plugin: 'orchestrator',
            message,
            ...(data && { data })
          }
        : `[${level.toUpperCase()}] [Orchestrator] ${message}`
      
      const output = this.options.format === 'json' && this.options.structured
        ? JSON.stringify(logEntry)
        : typeof logEntry === 'string' ? logEntry : `${logEntry.message}`
      
      console.log(output)
    }
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug']
    const currentLevelIndex = levels.indexOf(this.options.level || 'info')
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex <= currentLevelIndex
  }
  
  error(message: string, data?: any): void {
    this.log('error', message, data)
  }
  
  warn(message: string, data?: any): void {
    this.log('warn', message, data)
  }
  
  info(message: string, data?: any): void {
    this.log('info', message, data)
  }
  
  success(message: string, data?: any): void {
    this.log('info', message, data)
  }
  
  debug(message: string, data?: any): void {
    this.log('debug', message, data)
  }
}

/**
 * Core Orchestrator Plugin
 * 
 * Provides intelligent business detection, plugin orchestration, and configuration
 * management for multi-tenant business platforms.
 */
export const orchestratorPlugin = (options: OrchestratorPluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    const pluginOptions = { ...defaultOptions, ...options }
    
    // Initialize logger
    const logger = new Logger(pluginOptions.logging)
    
    // Graceful disable
    if (!pluginOptions.enabled) {
      logger.info('Plugin disabled via configuration')
      return config
    }
    
    try {
      logger.info('Initializing Orchestrator Plugin', { 
        version: '1.0.0',
        options: pluginOptions 
      })
      
      // Initialize core components
      const businessDetector = new BusinessDetectorImpl(logger)
      const pluginOrchestrator = new PluginOrchestrator({
        registry: {
          autoDiscovery: pluginOptions.plugins.autoDiscovery,
          searchPaths: pluginOptions.plugins.searchPaths
        },
        pluginLoading: {
          timeout: pluginOptions.plugins.timeout
        }
      })
      const configurationManager = new ConfigurationManagerImpl(logger)
      
      // Store original onInit for chaining
      const originalOnInit = config.onInit
      
      // Enhanced onInit with orchestration
      config.onInit = async (payload) => {
        const startTime = Date.now()
        
        try {
          // Run original onInit first
          if (originalOnInit) {
            logger.debug('Running original onInit')
            await originalOnInit(payload)
          }
          
          // Detect business context
          logger.debug('Detecting business context')
          const businessContext = await businessDetector.detect()
          logger.info('Business context detected', { businessContext })
          
          // Load and orchestrate plugins
          let pluginResult: any = { loaded: [] }
          if (pluginOptions.plugins.autoDiscovery) {
            logger.debug('Starting plugin discovery and loading')
            pluginResult = await pluginOrchestrator.loadPluginsForBusiness(businessContext.context, config)
            logger.info('Plugins loaded successfully', {
              count: pluginResult.loaded.length,
              plugins: pluginResult.loaded
            })
          }
          
          // Apply configuration management
          if (pluginOptions.configuration.merging) {
            logger.debug('Applying configuration management')
            const mergedConfig = await configurationManager.mergeBusinessConfig(
              config,
              businessContext.context,
              [pluginResult]
            )
            Object.assign(config, mergedConfig)
            logger.info('Configuration merged successfully')
          }
          
          // Performance logging
          if (pluginOptions.logging.performance) {
            const duration = Date.now() - startTime
            const budget = pluginOptions.performance.budget || 5000
            logger.info('Orchestrator initialization completed', {
              duration: `${duration}ms`,
              withinBudget: duration <= budget
            })
            
            if (duration > budget) {
              logger.warn('Initialization exceeded performance budget', {
                duration: `${duration}ms`,
                budget: `${budget}ms`
              })
            }
          }
          
          logger.info('✅ Orchestrator Plugin initialized successfully')
          
        } catch (error) {
          logger.error('Failed to initialize Orchestrator Plugin', { 
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          })
          
          // Don't throw - allow app to continue with degraded functionality
          logger.warn('Continuing with degraded functionality')
        }
      }
      
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
        } as any // Use type assertion to avoid strict typing issues
      }
      
      logger.info('Orchestrator Plugin configuration applied successfully')
      return config
      
    } catch (error) {
      logger.error('Critical error during plugin configuration', { 
        error: error instanceof Error ? error.message : String(error)
      })
      
      // Return original config to prevent app crash
      logger.warn('Returning original configuration due to critical error')
      return incomingConfig
    }
  }
}

// Export types for external use
export type {
  OrchestratorOptions,
  BusinessContext,
  PluginMetadata,
  LogLevel
} from './types'

// Export core components for advanced usage
export {
  BusinessDetectorImpl,
  PluginOrchestrator,
  ConfigurationManagerImpl
}

// Default export for convenience
export default orchestratorPlugin
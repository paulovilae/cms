import type { Config, Plugin } from 'payload'

/**
 * Logging levels for the orchestrator
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'success'

/**
 * Supported business contexts in the platform
 */
export type BusinessContext = 'intellitrade' | 'salarium' | 'latinos' | 'capacita' | 'cms' | 'unknown'

/**
 * Plugin categories for organization
 */
export type PluginCategory = 'core' | 'shared' | 'business'

/**
 * Plugin loading priority levels
 */
export type PluginPriority = number

/**
 * Business detection methods
 */
export type DetectionMethod = 'domain' | 'port' | 'environment' | 'header'

/**
 * Business context detection result
 */
export interface BusinessDetectionResult {
  /** Detected business context */
  context: BusinessContext
  /** Method used for detection */
  method: DetectionMethod
  /** Confidence level (0-1) */
  confidence: number
  /** Additional metadata from detection */
  metadata?: Record<string, any>
}

/**
 * Plugin dependency specification
 */
export interface PluginDependency {
  /** Plugin name or identifier */
  name: string
  /** Minimum version required */
  version?: string
  /** Whether this dependency is optional */
  optional?: boolean
  /** Category of the plugin */
  category?: PluginCategory
}

/**
 * Plugin metadata for orchestration
 */
export interface PluginMetadata {
  /** Unique plugin identifier */
  id: string
  /** Human-readable name */
  name: string
  /** Plugin version */
  version: string
  /** Plugin category */
  category: PluginCategory
  /** Loading priority */
  priority: PluginPriority
  /** Business contexts this plugin supports */
  supportedContexts: BusinessContext[]
  /** Plugin dependencies */
  dependencies: PluginDependency[]
  /** Whether plugin is enabled */
  enabled: boolean
  /** Plugin configuration */
  config?: Record<string, any>
}

/**
 * Business-specific configuration
 */
export interface BusinessConfiguration {
  /** Business context identifier */
  context: BusinessContext
  /** Business display name */
  name: string
  /** Domain patterns for detection */
  domains: string[]
  /** Port numbers for detection */
  ports: number[]
  /** Environment variables for detection */
  envVars: Record<string, string>
  /** Required core plugins */
  requiredPlugins: string[]
  /** Optional plugins */
  optionalPlugins: string[]
  /** Business-specific settings */
  settings: Record<string, any>
}

/**
 * Plugin loading result
 */
export interface PluginLoadResult {
  /** Plugin metadata */
  plugin: PluginMetadata
  /** Whether loading was successful */
  success: boolean
  /** Whether plugin was skipped */
  skipped?: boolean
  /** Error message if loading failed */
  error?: string
  /** Loading time in milliseconds */
  loadTime: number
  /** Successfully loaded plugins */
  loaded: string[]
  /** Failed plugin loads */
  failed: Array<{ name: string; error: string }>
}

/**
 * Orchestrator plugin configuration options
 */
export interface OrchestratorOptions {
  /** Enable or disable the orchestrator */
  enabled?: boolean
  
  /** Enable verbose logging */
  verbose?: boolean
  
  /** Enable logging output */
  enableLogging?: boolean
  
  /** Strict dependency checking */
  strictDependencies?: boolean
  
  /** Business context detection configuration */
  detection?: {
    /** Enable domain-based detection */
    enableDomain?: boolean
    /** Enable port-based detection */
    enablePort?: boolean
    /** Enable environment-based detection */
    enableEnvironment?: boolean
    /** Enable header-based detection */
    enableHeader?: boolean
    /** Fallback business context */
    fallback?: BusinessContext
  }
  
  /** Plugin loading configuration */
  pluginLoading?: {
    /** Enable lazy loading */
    lazy?: boolean
    /** Maximum concurrent plugin loads */
    maxConcurrent?: number
    /** Plugin load timeout in milliseconds */
    timeout?: number
    /** Enable plugin caching */
    cache?: boolean
  }
  
  /** Maximum retry attempts for failed operations */
  maxRetries?: number
  
  /** Business configurations */
  businesses?: Partial<Record<BusinessContext, Partial<BusinessConfiguration>>>
  
  /** Plugin registry configuration */
  registry?: {
    /** Plugin search paths */
    searchPaths?: string[]
    /** Enable automatic plugin discovery */
    autoDiscovery?: boolean
    /** Plugin manifest file name */
    manifestFile?: string
  }
  
  /** Performance monitoring */
  monitoring?: {
    /** Enable performance tracking */
    enabled?: boolean
    /** Metrics collection interval */
    interval?: number
    /** Enable memory usage tracking */
    trackMemory?: boolean
  }
}

/**
 * Business detector interface
 */
export interface BusinessDetector {
  /** Detect business context from request/environment */
  detect(context?: {
    domain?: string
    port?: number
    headers?: Record<string, string>
    environment?: Record<string, string>
  }): Promise<BusinessDetectionResult>
  
  /** Get all supported business contexts */
  getSupportedContexts(): BusinessContext[]
  
  /** Validate business context */
  isValidContext(context: string): context is BusinessContext
}

/**
 * Plugin orchestrator interface
 */
export interface PluginOrchestrator {
  /** Load plugins for a specific business context */
  loadPluginsForContext(context: BusinessContext): Promise<PluginLoadResult[]>
  
  /** Get plugin metadata */
  getPluginMetadata(pluginId: string): PluginMetadata | null
  
  /** Check plugin dependencies */
  checkDependencies(pluginId: string): Promise<boolean>
  
  /** Get loading order for plugins */
  getLoadingOrder(plugins: PluginMetadata[]): PluginMetadata[]
  
  /** Register a plugin */
  registerPlugin(plugin: PluginMetadata): void
  
  /** Unregister a plugin */
  unregisterPlugin(pluginId: string): void
}

/**
 * Configuration manager interface
 */
export interface ConfigurationManager {
  /** Merge business-specific configuration */
  mergeBusinessConfig(
    baseConfig: Config,
    businessContext: BusinessContext,
    plugins: PluginLoadResult[]
  ): Promise<Config>
  
  /** Get business configuration */
  getBusinessConfig(context: BusinessContext): BusinessConfiguration | null
  
  /** Validate configuration */
  validateConfig(config: Config): Promise<boolean>
  
  /** Apply plugin configurations */
  applyPluginConfigs(config: Config, plugins: PluginLoadResult[]): Config
}

/**
 * Orchestrator logger interface
 */
export interface OrchestratorLogger {
  /** Log info message */
  info(message: string, metadata?: Record<string, any>): void
  
  /** Log success message */
  success(message: string, metadata?: Record<string, any>): void
  
  /** Log warning message */
  warn(message: string, metadata?: Record<string, any>): void
  
  /** Log error message */
  error(message: string, error?: Error, metadata?: Record<string, any>): void
  
  /** Log debug message */
  debug(message: string, metadata?: Record<string, any>): void
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** Plugin loading times */
  pluginLoadTimes: Record<string, number>
  
  /** Business detection time */
  detectionTime: number
  
  /** Configuration merge time */
  configMergeTime: number
  
  /** Total orchestration time */
  totalTime: number
  
  /** Memory usage */
  memoryUsage?: {
    before: number
    after: number
    peak: number
  }
}

/**
 * Orchestrator context for internal state management
 */
export interface OrchestratorContext {
  /** Current business context */
  businessContext: BusinessContext
  
  /** Loaded plugins */
  loadedPlugins: Map<string, PluginLoadResult>
  
  /** Plugin registry */
  pluginRegistry: Map<string, PluginMetadata>
  
  /** Business configurations */
  businessConfigs: Map<BusinessContext, BusinessConfiguration>
  
  /** Performance metrics */
  metrics: PerformanceMetrics
  
  /** Logger instance */
  logger: OrchestratorLogger
  
  /** Plugin options */
  options: Required<OrchestratorOptions>
}
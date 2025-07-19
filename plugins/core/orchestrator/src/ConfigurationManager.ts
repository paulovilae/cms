import type { Config } from 'payload'
import type {
  ConfigurationManager,
  BusinessContext,
  BusinessConfiguration,
  PluginLoadResult,
  OrchestratorLogger
} from './types'

/**
 * Default business configurations
 */
const DEFAULT_BUSINESS_CONFIGURATIONS: Record<BusinessContext, BusinessConfiguration> = {
  intellitrade: {
    context: 'intellitrade',
    name: 'IntelliTrade',
    domains: ['intellitrade.paulovila.org', 'intellitrade.localhost'],
    ports: [3004],
    envVars: { BUSINESS_MODE: 'intellitrade', BUSINESS_CONTEXT: 'intellitrade' },
    requiredPlugins: ['@paulovila/core-auth', '@paulovila/core-database', '@paulovila/core-api'],
    optionalPlugins: ['@paulovila/shared-analytics', '@paulovila/shared-notifications'],
    settings: {
      features: {
        kyc: true,
        blockchain: true,
        trading: false,
        analytics: true
      },
      branding: {
        primaryColor: '#1a365d',
        secondaryColor: '#2d3748',
        logo: '/assets/intellitrade-logo.png'
      },
      security: {
        requireTwoFactor: true,
        sessionTimeout: 3600000, // 1 hour
        maxLoginAttempts: 5
      }
    }
  },
  salarium: {
    context: 'salarium',
    name: 'Salarium',
    domains: ['salarium.paulovila.org', 'salarium.localhost'],
    ports: [3005],
    envVars: { BUSINESS_MODE: 'salarium', BUSINESS_CONTEXT: 'salarium' },
    requiredPlugins: ['@paulovila/core-auth', '@paulovila/core-database', '@paulovila/core-api'],
    optionalPlugins: ['@paulovila/shared-analytics', '@paulovila/shared-notifications'],
    settings: {
      features: {
        hr: true,
        payroll: true,
        recruitment: true,
        analytics: true
      },
      branding: {
        primaryColor: '#2b6cb0',
        secondaryColor: '#3182ce',
        logo: '/assets/salarium-logo.png'
      },
      security: {
        requireTwoFactor: false,
        sessionTimeout: 7200000, // 2 hours
        maxLoginAttempts: 3
      }
    }
  },
  latinos: {
    context: 'latinos',
    name: 'Latinos',
    domains: ['latinos.paulovila.org', 'latinos.localhost'],
    ports: [3003],
    envVars: { BUSINESS_MODE: 'latinos', BUSINESS_CONTEXT: 'latinos' },
    requiredPlugins: ['@paulovila/core-auth', '@paulovila/core-database', '@paulovila/core-api'],
    optionalPlugins: ['@paulovila/shared-analytics'],
    settings: {
      features: {
        trading: true,
        marketData: true,
        botEngine: true,
        analytics: true
      },
      branding: {
        primaryColor: '#c53030',
        secondaryColor: '#e53e3e',
        logo: '/assets/latinos-logo.png'
      },
      security: {
        requireTwoFactor: true,
        sessionTimeout: 1800000, // 30 minutes
        maxLoginAttempts: 5
      }
    }
  },
  capacita: {
    context: 'capacita',
    name: 'Capacita',
    domains: ['capacita.paulovila.org', 'capacita.localhost'],
    ports: [3007],
    envVars: { BUSINESS_MODE: 'capacita', BUSINESS_CONTEXT: 'capacita' },
    requiredPlugins: ['@paulovila/core-auth', '@paulovila/core-database', '@paulovila/core-api'],
    optionalPlugins: ['@paulovila/shared-analytics', '@paulovila/shared-notifications'],
    settings: {
      features: {
        training: true,
        avatarEngine: true,
        skillEvaluator: true,
        analytics: true
      },
      branding: {
        primaryColor: '#38a169',
        secondaryColor: '#48bb78',
        logo: '/assets/capacita-logo.png'
      },
      security: {
        requireTwoFactor: false,
        sessionTimeout: 3600000, // 1 hour
        maxLoginAttempts: 3
      }
    }
  },
  cms: {
    context: 'cms',
    name: 'CMS Admin',
    domains: ['cms.paulovila.org', 'cms.localhost'],
    ports: [3006],
    envVars: { BUSINESS_MODE: 'cms', BUSINESS_CONTEXT: 'cms' },
    requiredPlugins: ['@paulovila/core-auth', '@paulovila/core-database', '@paulovila/core-api'],
    optionalPlugins: ['@paulovila/shared-analytics'],
    settings: {
      features: {
        userManagement: true,
        pluginManager: true,
        systemMonitoring: true,
        analytics: true
      },
      branding: {
        primaryColor: '#805ad5',
        secondaryColor: '#9f7aea',
        logo: '/assets/cms-logo.png'
      },
      security: {
        requireTwoFactor: true,
        sessionTimeout: 7200000, // 2 hours
        maxLoginAttempts: 3
      }
    }
  },
  unknown: {
    context: 'unknown',
    name: 'Unknown Business',
    domains: [],
    ports: [],
    envVars: {},
    requiredPlugins: ['@paulovila/core-auth', '@paulovila/core-database'],
    optionalPlugins: [],
    settings: {
      features: {},
      branding: {
        primaryColor: '#718096',
        secondaryColor: '#a0aec0',
        logo: '/assets/default-logo.png'
      },
      security: {
        requireTwoFactor: false,
        sessionTimeout: 3600000, // 1 hour
        maxLoginAttempts: 3
      }
    }
  }
}

/**
 * Configuration manager implementation for business-specific config merging
 * Following memory bank best practices for simple, robust plugin development
 */
export class ConfigurationManagerImpl implements ConfigurationManager {
  private logger: OrchestratorLogger
  private businessConfigs: Map<BusinessContext, BusinessConfiguration>

  constructor(logger: OrchestratorLogger, customConfigs?: Partial<Record<BusinessContext, Partial<BusinessConfiguration>>>) {
    this.logger = logger
    this.businessConfigs = new Map()

    // Initialize with default configurations
    for (const [context, config] of Object.entries(DEFAULT_BUSINESS_CONFIGURATIONS)) {
      this.businessConfigs.set(context as BusinessContext, { ...config })
    }

    // Apply custom configurations if provided
    if (customConfigs) {
      this.applyCustomConfigurations(customConfigs)
    }
  }

  /**
   * Merge business-specific configuration with base Payload config
   * Uses simple, safe merging following memory bank guidance
   */
  async mergeBusinessConfig(
    baseConfig: Config,
    businessContext: BusinessContext,
    plugins: PluginLoadResult[]
  ): Promise<Config> {
    const startTime = Date.now()

    try {
      this.logger.info(`🔧 Merging configuration for business: ${businessContext}`)

      // Get business configuration
      const businessConfig = this.getBusinessConfig(businessContext)
      if (!businessConfig) {
        this.logger.warn(`No configuration found for business: ${businessContext}, using defaults`)
        return baseConfig
      }

      // Create merged configuration using safe spreading
      const mergedConfig: Config = {
        ...baseConfig,
        // Apply business-specific server settings
        serverURL: this.getServerURL(businessConfig),
        // Apply plugin configurations
        ...this.applyPluginConfigs(baseConfig, plugins)
      }

      // Safely add business context global
      this.addBusinessContextGlobal(mergedConfig, businessConfig)

      // Apply business-specific admin customizations
      this.applyAdminCustomizations(mergedConfig, businessConfig)

      const mergeTime = Date.now() - startTime
      this.logger.success(`Configuration merged successfully for ${businessContext}`, {
        mergeTime: `${mergeTime}ms`,
        pluginsApplied: plugins.length
      })

      return mergedConfig

    } catch (error) {
      this.logger.error('Failed to merge business configuration', error as Error, {
        businessContext,
        pluginCount: plugins.length
      })
      // Return original config to prevent app crash (memory bank guidance)
      return baseConfig
    }
  }

  /**
   * Get business configuration for a specific context
   */
  getBusinessConfig(context: BusinessContext): BusinessConfiguration | null {
    return this.businessConfigs.get(context) || null
  }

  /**
   * Validate configuration using simple checks
   */
  async validateConfig(config: Config): Promise<boolean> {
    try {
      this.logger.info('🔍 Validating configuration...')

      const errors: string[] = []

      // Basic validation checks
      if (!config.collections || config.collections.length === 0) {
        errors.push('Configuration must include at least one collection')
      }

      if (!config.serverURL) {
        errors.push('Configuration must include serverURL')
      }

      // Validate collections have required fields
      if (config.collections) {
        for (const collection of config.collections) {
          if (!collection.slug) {
            errors.push(`Collection missing slug`)
          }
          if (!collection.fields || collection.fields.length === 0) {
            errors.push(`Collection '${collection.slug}' must have at least one field`)
          }
        }
      }

      if (errors.length > 0) {
        this.logger.error('Configuration validation failed', new Error('Validation errors'), { errors })
        return false
      }

      this.logger.success('Configuration validation passed')
      return true

    } catch (error) {
      this.logger.error('Configuration validation error', error as Error)
      return false
    }
  }

  /**
   * Apply plugin configurations to base config
   * Simple merging without complex type manipulation
   */
  applyPluginConfigs(config: Config, plugins: PluginLoadResult[]): Config {
    let mergedConfig = { ...config }

    // Apply configurations from successfully loaded plugins
    for (const pluginResult of plugins) {
      if (pluginResult.success && pluginResult.plugin.config) {
        try {
          // Safe merging of plugin configurations
          mergedConfig = { ...mergedConfig, ...pluginResult.plugin.config }
        } catch (error) {
          this.logger.warn(`Failed to apply config from plugin: ${pluginResult.plugin.name}`, error as Error)
        }
      }
    }

    return mergedConfig
  }

  /**
   * Update business configuration
   */
  updateBusinessConfig(
    context: BusinessContext,
    updates: Partial<BusinessConfiguration>
  ): void {
    const currentConfig = this.businessConfigs.get(context)
    if (currentConfig) {
      const updatedConfig = { ...currentConfig, ...updates }
      this.businessConfigs.set(context, updatedConfig)
      this.logger.info(`Updated business configuration for ${context}`)
    } else {
      this.logger.warn(`Cannot update configuration for unknown business: ${context}`)
    }
  }

  /**
   * Get all business configurations
   */
  getAllBusinessConfigs(): Record<BusinessContext, BusinessConfiguration> {
    const configs: Record<string, BusinessConfiguration> = {}
    for (const [context, config] of this.businessConfigs.entries()) {
      configs[context] = config
    }
    return configs as Record<BusinessContext, BusinessConfiguration>
  }

  /**
   * Apply custom configurations safely
   */
  private applyCustomConfigurations(
    customConfigs: Partial<Record<BusinessContext, Partial<BusinessConfiguration>>>
  ): void {
    for (const [context, customConfig] of Object.entries(customConfigs)) {
      if (customConfig) {
        const businessContext = context as BusinessContext
        const currentConfig = this.businessConfigs.get(businessContext)
        if (currentConfig) {
          const mergedConfig = { ...currentConfig, ...customConfig }
          this.businessConfigs.set(businessContext, mergedConfig)
          this.logger.info(`Applied custom configuration for ${businessContext}`)
        }
      }
    }
  }

  /**
   * Add business context global safely
   */
  private addBusinessContextGlobal(config: Config, businessConfig: BusinessConfiguration): void {
    try {
      if (!config.globals) {
        config.globals = []
      }

      config.globals.push({
        slug: 'business-config',
        fields: [
          {
            name: 'context',
            type: 'text',
            defaultValue: businessConfig.context,
            admin: { readOnly: true }
          },
          {
            name: 'name',
            type: 'text',
            defaultValue: businessConfig.name,
            admin: { readOnly: true }
          },
          {
            name: 'features',
            type: 'json',
            defaultValue: businessConfig.settings.features,
            admin: { readOnly: true }
          }
        ]
      })
    } catch (error) {
      this.logger.warn('Failed to add business context global', error as Error)
    }
  }

  /**
   * Apply admin customizations safely
   */
  private applyAdminCustomizations(config: Config, businessConfig: BusinessConfiguration): void {
    try {
      if (!config.admin) {
        config.admin = {}
      }

      // Apply safe admin customizations
      if (!config.admin.meta) {
        config.admin.meta = {}
      }

      config.admin.meta.titleSuffix = ` - ${businessConfig.name}`

      // Set environment variables for business context
      for (const [key, value] of Object.entries(businessConfig.envVars)) {
        process.env[key] = value
      }

    } catch (error) {
      this.logger.warn('Failed to apply admin customizations', error as Error)
    }
  }

  /**
   * Get server URL for business
   */
  private getServerURL(businessConfig: BusinessConfiguration): string {
    try {
      if (businessConfig.domains.length > 0) {
        const domain = businessConfig.domains[0]
        const protocol = domain.includes('localhost') ? 'http' : 'https'
        const port = businessConfig.ports[0] ? `:${businessConfig.ports[0]}` : ''
        return `${protocol}://${domain}${port}`
      }
      return 'http://localhost:3000'
    } catch (error) {
      this.logger.warn('Failed to generate server URL, using default', error as Error)
      return 'http://localhost:3000'
    }
  }

  /**
   * Get CORS settings for business - simplified approach
   */
  private getCORSSettings(businessConfig: BusinessConfiguration): string[] {
    try {
      const allowedOrigins = [
        ...businessConfig.domains.map(domain => `https://${domain}`),
        ...businessConfig.domains.map(domain => `http://${domain}`),
        // Add localhost variants for development
        ...businessConfig.ports.map(port => `http://localhost:${port}`),
        ...businessConfig.ports.map(port => `https://localhost:${port}`)
      ]

      return allowedOrigins
    } catch (error) {
      this.logger.warn('Failed to generate CORS settings, using defaults', error as Error)
      return ['http://localhost:3000', 'https://localhost:3000']
    }
  }
}
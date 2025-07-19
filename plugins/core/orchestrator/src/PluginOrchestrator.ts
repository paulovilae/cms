import type { Config, Plugin } from 'payload'
import type { 
  BusinessContext, 
  PluginDependency, 
  PluginMetadata, 
  OrchestratorOptions,
  PluginLoadResult 
} from './types'

/**
 * PluginOrchestrator manages plugin loading, dependency resolution, and lifecycle
 * for the multi-tenant business platform
 */
export class PluginOrchestrator {
  private loadedPlugins: Map<string, PluginMetadata> = new Map()
  private pluginDependencies: Map<string, PluginDependency[]> = new Map()
  private options: OrchestratorOptions

  constructor(options: OrchestratorOptions = {}) {
    this.options = {
      enableLogging: true,
      strictDependencies: true,
      maxRetries: 3,
      ...options
    }
  }

  /**
   * Load plugins based on business context and configuration
   */
  async loadPluginsForBusiness(
    businessContext: BusinessContext,
    config: Config
  ): Promise<PluginLoadResult> {
    const loaded: string[] = []
    const failed: Array<{ name: string; error: string }> = []
    const startTime = Date.now()

    try {
      this.log('🔌 Starting plugin orchestration for business:', businessContext)

      // Get plugins to load based on business context
      const pluginsToLoad = this.getPluginsForBusiness(businessContext)
      
      // Sort plugins by priority and dependencies
      const sortedPlugins = await this.sortPluginsByDependencies(pluginsToLoad)
      
      // Create result object
      const result: PluginLoadResult = {
        plugin: {
          id: 'orchestrator',
          name: 'Plugin Orchestrator',
          version: '1.0.0',
          category: 'core',
          priority: 0,
          supportedContexts: [businessContext],
          dependencies: [],
          enabled: true
        },
        success: true,
        loadTime: 0,
        loaded,
        failed
      }
      
      // Load plugins in dependency order
      for (const pluginInfo of sortedPlugins) {
        try {
          const loadResult = await this.loadPlugin(pluginInfo, config)
          if (loadResult.success) {
            result.loaded.push(pluginInfo.name)
            this.log('✅ Plugin loaded successfully:', pluginInfo.name)
          } else {
            result.failed.push({
              name: pluginInfo.name,
              error: loadResult.error || 'Unknown error'
            })
            this.log('❌ Plugin failed to load:', pluginInfo.name, loadResult.error)
          }
        } catch (error) {
          result.failed.push({
            name: pluginInfo.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          this.log('❌ Plugin loading exception:', pluginInfo.name, error)
        }
      }

      result.loadTime = Date.now() - startTime
      this.log('🎯 Plugin orchestration completed. Loaded:', result.loaded.length, 'Failed:', result.failed.length)
      return result

    } catch (error) {
      this.log('💥 Critical error in plugin orchestration:', error)
      throw error
    }
  }

  /**
   * Get list of plugins to load for a specific business context
   */
  private getPluginsForBusiness(businessContext: BusinessContext): PluginMetadata[] {
    const plugins: PluginMetadata[] = []

    // Always load core plugins
    plugins.push(...this.getCorePlugins())

    // Load business-specific plugins
    plugins.push(...this.getBusinessPlugins(businessContext))

    // Load shared plugins based on configuration
    plugins.push(...this.getSharedPlugins(businessContext))

    return plugins
  }

  /**
   * Get core plugins that are always required
   */
  private getCorePlugins(): PluginMetadata[] {
    return [
      {
        id: 'core-auth',
        name: '@paulovila/core-auth',
        version: '1.0.0',
        category: 'core',
        priority: 1,
        supportedContexts: ['intellitrade', 'salarium', 'latinos', 'capacita', 'cms'],
        dependencies: [],
        enabled: true
      },
      {
        id: 'core-database',
        name: '@paulovila/core-database',
        version: '1.0.0',
        category: 'core',
        priority: 2,
        supportedContexts: ['intellitrade', 'salarium', 'latinos', 'capacita', 'cms'],
        dependencies: [],
        enabled: true
      },
      {
        id: 'core-api',
        name: '@paulovila/core-api',
        version: '1.0.0',
        category: 'core',
        priority: 3,
        supportedContexts: ['intellitrade', 'salarium', 'latinos', 'capacita', 'cms'],
        dependencies: [
          { name: '@paulovila/core-auth' },
          { name: '@paulovila/core-database' }
        ],
        enabled: true
      }
    ]
  }

  /**
   * Get business-specific plugins
   */
  private getBusinessPlugins(business: string): PluginMetadata[] {
    const businessPluginMap: Record<string, PluginMetadata[]> = {
      intellitrade: [
        {
          id: 'intellitrade-kyc',
          name: '@paulovila/intellitrade-kyc',
          version: '1.0.0',
          category: 'business',
          priority: 10,
          supportedContexts: ['intellitrade'],
          dependencies: [{ name: '@paulovila/core-api' }],
          enabled: true
        },
        {
          id: 'intellitrade-blockchain',
          name: '@paulovila/intellitrade-blockchain',
          version: '1.0.0',
          category: 'business',
          priority: 11,
          supportedContexts: ['intellitrade'],
          dependencies: [{ name: '@paulovila/intellitrade-kyc' }],
          enabled: true
        }
      ],
      salarium: [
        {
          id: 'salarium-hr',
          name: '@paulovila/salarium-hr',
          version: '1.0.0',
          category: 'business',
          priority: 10,
          supportedContexts: ['salarium'],
          dependencies: [{ name: '@paulovila/core-api' }],
          enabled: true
        },
        {
          id: 'salarium-payroll',
          name: '@paulovila/salarium-payroll',
          version: '1.0.0',
          category: 'business',
          priority: 11,
          supportedContexts: ['salarium'],
          dependencies: [{ name: '@paulovila/salarium-hr' }],
          enabled: true
        }
      ],
      latinos: [
        {
          id: 'latinos-trading',
          name: '@paulovila/latinos-trading',
          version: '1.0.0',
          category: 'business',
          priority: 10,
          supportedContexts: ['latinos'],
          dependencies: [{ name: '@paulovila/core-api' }],
          enabled: true
        }
      ],
      capacita: [
        {
          id: 'capacita-training',
          name: '@paulovila/capacita-training',
          version: '1.0.0',
          category: 'business',
          priority: 10,
          supportedContexts: ['capacita'],
          dependencies: [{ name: '@paulovila/core-api' }],
          enabled: true
        }
      ]
    }

    return businessPluginMap[business] || []
  }

  /**
   * Get shared plugins based on business context
   */
  private getSharedPlugins(businessContext: BusinessContext): PluginMetadata[] {
    const sharedPlugins: PluginMetadata[] = [
      {
        id: 'shared-analytics',
        name: '@paulovila/shared-analytics',
        version: '1.0.0',
        category: 'shared',
        priority: 20,
        supportedContexts: ['intellitrade', 'salarium', 'latinos', 'capacita', 'cms'],
        dependencies: [{ name: '@paulovila/core-api' }],
        enabled: true
      },
      {
        id: 'shared-notifications',
        name: '@paulovila/shared-notifications',
        version: '1.0.0',
        category: 'shared',
        priority: 21,
        supportedContexts: ['intellitrade', 'salarium', 'latinos', 'capacita', 'cms'],
        dependencies: [{ name: '@paulovila/core-api' }],
        enabled: true
      }
    ]

    // Filter based on business requirements
    // Some businesses might not want certain shared plugins
    const businessExclusions: Record<string, string[]> = {
      // Example: intellitrade might not want certain shared plugins
      // intellitrade: ['@paulovila/shared-social']
    }

    const exclusions = businessExclusions[businessContext] || []
    return sharedPlugins.filter(plugin => !exclusions.includes(plugin.name))
  }

  /**
   * Sort plugins by dependencies and priority
   */
  private async sortPluginsByDependencies(plugins: PluginMetadata[]): Promise<PluginMetadata[]> {
    const sorted: PluginMetadata[] = []
    const visited = new Set<string>()
    const visiting = new Set<string>()

    const visit = (plugin: PluginMetadata) => {
      if (visiting.has(plugin.name)) {
        throw new Error(`Circular dependency detected involving plugin: ${plugin.name}`)
      }
      
      if (visited.has(plugin.name)) {
        return
      }

      visiting.add(plugin.name)

      // Visit dependencies first
      for (const dep of plugin.dependencies) {
        const depName = dep.name
        const dependency = plugins.find(p => p.name === depName)
        if (dependency) {
          visit(dependency)
        } else if (this.options.strictDependencies) {
          throw new Error(`Missing dependency: ${depName} for plugin: ${plugin.name}`)
        }
      }

      visiting.delete(plugin.name)
      visited.add(plugin.name)
      sorted.push(plugin)
    }

    // Sort by priority first, then resolve dependencies
    const prioritySorted = [...plugins].sort((a, b) => (a.priority || 0) - (b.priority || 0))
    
    for (const plugin of prioritySorted) {
      visit(plugin)
    }

    return sorted
  }

  /**
   * Load a single plugin
   */
  private async loadPlugin(
    pluginInfo: PluginMetadata,
    config: Config
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if plugin is already loaded
      if (this.loadedPlugins.has(pluginInfo.name)) {
        this.log('⚠️ Plugin already loaded, skipping:', pluginInfo.name)
        return { success: true }
      }

      // Verify dependencies are loaded
      for (const dep of pluginInfo.dependencies) {
        const depName = dep.name
        if (!this.loadedPlugins.has(depName)) {
          return {
            success: false,
            error: `Dependency not loaded: ${depName}`
          }
        }
      }

      // Simulate plugin loading (in real implementation, this would dynamically import)
      // For now, we'll just register the plugin as loaded
      this.loadedPlugins.set(pluginInfo.name, pluginInfo)
      
      return { success: true }

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get information about loaded plugins
   */
  getLoadedPlugins(): PluginMetadata[] {
    return Array.from(this.loadedPlugins.values())
  }

  /**
   * Check if a specific plugin is loaded
   */
  isPluginLoaded(pluginName: string): boolean {
    return this.loadedPlugins.has(pluginName)
  }

  /**
   * Get plugin dependencies
   */
  getPluginDependencies(pluginName: string): string[] {
    const plugin = this.loadedPlugins.get(pluginName)
    return plugin?.dependencies.map(dep => dep.name) || []
  }

  /**
   * Unload a plugin (for testing or hot reloading)
   */
  unloadPlugin(pluginName: string): boolean {
    if (this.loadedPlugins.has(pluginName)) {
      this.loadedPlugins.delete(pluginName)
      this.log('🔌 Plugin unloaded:', pluginName)
      return true
    }
    return false
  }

  /**
   * Clear all loaded plugins
   */
  clearPlugins(): void {
    this.loadedPlugins.clear()
    this.pluginDependencies.clear()
    this.log('🧹 All plugins cleared')
  }

  /**
   * Validate plugin configuration
   */
  validatePluginConfig(plugin: PluginMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!plugin.name) {
      errors.push('Plugin name is required')
    }

    if (!plugin.category) {
      errors.push('Plugin category is required')
    }

    if (plugin.category && !['core', 'shared', 'business'].includes(plugin.category)) {
      errors.push('Plugin category must be one of: core, shared, business')
    }

    if (plugin.priority !== undefined && plugin.priority < 0) {
      errors.push('Plugin priority must be non-negative')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Get plugin loading statistics
   */
  getStats(): {
    totalLoaded: number
    corePlugins: number
    sharedPlugins: number
    businessPlugins: number
  } {
    const plugins = Array.from(this.loadedPlugins.values())
    
    return {
      totalLoaded: plugins.length,
      corePlugins: plugins.filter(p => p.category === 'core').length,
      sharedPlugins: plugins.filter(p => p.category === 'shared').length,
      businessPlugins: plugins.filter(p => p.category === 'business').length
    }
  }

  /**
   * Log messages with optional emoji prefixes
   */
  private log(message: string, ...args: any[]): void {
    if (this.options.enableLogging) {
      console.log(`[PluginOrchestrator] ${message}`, ...args)
    }
  }
}
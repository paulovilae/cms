# Mother Plugin Technical Specification

## 🎯 Executive Summary

The Mother Plugin is a revolutionary orchestrator that transforms our multi-tenant platform into a self-managing ecosystem. It serves as the single source of truth for all business applications, providing dynamic discovery, automatic configuration, and centralized management.

## 🏗️ Core Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Mother Plugin Ecosystem                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Business       │  │  App Management │  │  Health      │ │
│  │  Detector       │  │  Plugin         │  │  Monitor     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Plugin         │  │  Configuration  │  │  Deployment  │ │
│  │  Orchestrator   │  │  Manager        │  │  Manager     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Central Database                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │    Sites    │ │ Deployments │ │ Health Data │ │ Config │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Business Detector**: Dynamic discovery of business applications
2. **App Management Plugin**: Central registry and control system
3. **Plugin Orchestrator**: Dynamic plugin loading and management
4. **Configuration Manager**: Centralized configuration and environment management
5. **Health Monitor**: Real-time monitoring and alerting
6. **Deployment Manager**: Coordinated deployments and rollbacks

## 📦 Package Structure

```
@paulovila/mother-plugin/
├── package.json
├── README.md
├── src/
│   ├── index.ts                    # Main plugin export
│   ├── types.ts                    # TypeScript definitions
│   ├── core/
│   │   ├── BusinessDetector.ts     # Dynamic business discovery
│   │   ├── PluginOrchestrator.ts   # Plugin management
│   │   ├── ConfigurationManager.ts # Config management
│   │   └── HealthMonitor.ts        # Health monitoring
│   ├── plugins/
│   │   ├── AppManagementPlugin.ts  # App management sub-plugin
│   │   ├── DeploymentPlugin.ts     # Deployment management
│   │   └── SecurityPlugin.ts       # Security management
│   ├── collections/
│   │   ├── Sites.ts               # Sites collection
│   │   ├── Deployments.ts         # Deployments collection
│   │   ├── HealthChecks.ts        # Health data collection
│   │   └── Configurations.ts      # Configuration collection
│   ├── endpoints/
│   │   ├── management.ts          # Management API endpoints
│   │   ├── health.ts              # Health check endpoints
│   │   └── deployment.ts          # Deployment endpoints
│   ├── utils/
│   │   ├── portManager.ts         # Port conflict resolution
│   │   ├── fileSystemSync.ts      # File system synchronization
│   │   └── validators.ts          # Input validation
│   └── ui/
│       ├── Dashboard.tsx          # Management dashboard
│       ├── SiteCard.tsx           # Site management card
│       └── HealthPanel.tsx        # Health monitoring panel
├── scripts/
│   ├── setup.js                   # Post-install setup
│   ├── migrate.js                 # Migration utilities
│   └── cleanup.js                 # Cleanup utilities
└── tests/
    ├── unit/                      # Unit tests
    ├── integration/               # Integration tests
    └── e2e/                       # End-to-end tests
```

## 🔧 Core Implementation

### Main Plugin Entry Point

```typescript
// src/index.ts
import type { Config, Plugin } from 'payload'
import { BusinessDetector } from './core/BusinessDetector'
import { PluginOrchestrator } from './core/PluginOrchestrator'
import { ConfigurationManager } from './core/ConfigurationManager'
import { HealthMonitor } from './core/HealthMonitor'
import { appManagementPlugin } from './plugins/AppManagementPlugin'
import { deploymentPlugin } from './plugins/DeploymentPlugin'
import { securityPlugin } from './plugins/SecurityPlugin'

export interface MotherPluginOptions {
  enabled?: boolean
  autoDiscovery?: boolean
  healthMonitoring?: boolean
  deploymentManagement?: boolean
  securityManagement?: boolean
  appsDirectory?: string
  databasePath?: string
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
  features?: {
    autoPortAssignment?: boolean
    conflictResolution?: boolean
    healthChecks?: boolean
    deploymentQueue?: boolean
    securityScanning?: boolean
  }
}

const defaultOptions: Required<MotherPluginOptions> = {
  enabled: true,
  autoDiscovery: true,
  healthMonitoring: true,
  deploymentManagement: true,
  securityManagement: true,
  appsDirectory: './apps',
  databasePath: './cms-data',
  logLevel: 'info',
  features: {
    autoPortAssignment: true,
    conflictResolution: true,
    healthChecks: true,
    deploymentQueue: true,
    securityScanning: true
  }
}

export const motherPlugin = (options: MotherPluginOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    const pluginOptions = { ...defaultOptions, ...options }

    // Graceful disable
    if (!pluginOptions.enabled) {
      console.log('🔌 Mother Plugin: Disabled via configuration')
      return config
    }

    console.log('🚀 Mother Plugin: Initializing ecosystem...')

    try {
      // Initialize core components
      const businessDetector = new BusinessDetector(pluginOptions)
      const pluginOrchestrator = new PluginOrchestrator(pluginOptions)
      const configManager = new ConfigurationManager(pluginOptions)
      const healthMonitor = new HealthMonitor(pluginOptions)

      // Add sub-plugins
      const subPlugins = [
        appManagementPlugin(pluginOptions),
        deploymentPlugin(pluginOptions),
        securityPlugin(pluginOptions)
      ]

      // Apply sub-plugins
      let enhancedConfig = config
      for (const subPlugin of subPlugins) {
        enhancedConfig = subPlugin(enhancedConfig)
      }

      // Enhanced onInit with ecosystem setup
      const originalOnInit = enhancedConfig.onInit
      enhancedConfig.onInit = async (payload) => {
        try {
          // Run original onInit first
          if (originalOnInit) {
            await originalOnInit(payload)
          }

          console.log('🔍 Mother Plugin: Discovering business applications...')
          
          // Discover and register business applications
          if (pluginOptions.autoDiscovery) {
            const sites = await businessDetector.scanAppsDirectory()
            await businessDetector.registerSites(payload, sites)
            console.log(`✅ Mother Plugin: Discovered and registered ${sites.size} sites`)
          }

          // Initialize plugin orchestrator
          await pluginOrchestrator.initialize(payload)
          console.log('✅ Mother Plugin: Plugin orchestrator initialized')

          // Start health monitoring
          if (pluginOptions.healthMonitoring) {
            await healthMonitor.start(payload)
            console.log('✅ Mother Plugin: Health monitoring started')
          }

          // Initialize configuration manager
          await configManager.initialize(payload)
          console.log('✅ Mother Plugin: Configuration manager initialized')

          console.log('🎉 Mother Plugin: Ecosystem fully operational!')

        } catch (error) {
          console.error('❌ Mother Plugin: Initialization failed:', error)
          // Don't throw - allow app to continue with reduced functionality
        }
      }

      // Enhanced onDestroy for cleanup
      const originalOnDestroy = enhancedConfig.onDestroy
      enhancedConfig.onDestroy = async () => {
        try {
          if (originalOnDestroy) {
            await originalOnDestroy()
          }

          // Cleanup health monitoring
          await healthMonitor.stop()
          
          // Cleanup plugin orchestrator
          await pluginOrchestrator.cleanup()
          
          console.log('✅ Mother Plugin: Cleanup completed')
        } catch (error) {
          console.error('❌ Mother Plugin: Cleanup failed:', error)
        }
      }

      return enhancedConfig

    } catch (error) {
      console.error('❌ Mother Plugin: Critical initialization error:', error)
      return incomingConfig
    }
  }
}

// Re-export types and utilities
export type { MotherPluginOptions }
export { BusinessDetector, PluginOrchestrator, ConfigurationManager, HealthMonitor }
```

### Business Detector Implementation

```typescript
// src/core/BusinessDetector.ts
import * as fs from 'fs-extra'
import * as path from 'path'
import type { Payload } from 'payload'
import type { MotherPluginOptions } from '../types'

export interface BusinessEntry {
  name: string
  title: string
  domain: string
  port: number
  rootPath: string
  envPath: string
  features: string[]
  plugins: Record<string, any>
  status: 'active' | 'inactive' | 'error'
}

export class BusinessDetector {
  private options: MotherPluginOptions
  private cache: Map<string, BusinessEntry> = new Map()

  constructor(options: MotherPluginOptions) {
    this.options = options
  }

  async scanAppsDirectory(): Promise<Map<string, BusinessEntry>> {
    const appsDir = path.resolve(this.options.appsDirectory || './apps')
    
    if (!await fs.pathExists(appsDir)) {
      console.warn(`⚠️ Apps directory not found: ${appsDir}`)
      return new Map()
    }

    const entries = await fs.readdir(appsDir, { withFileTypes: true })
    const businesses = new Map<string, BusinessEntry>()

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const businessEntry = await this.analyzeBusinessDirectory(
            path.join(appsDir, entry.name),
            entry.name
          )
          
          if (businessEntry) {
            businesses.set(entry.name, businessEntry)
            this.cache.set(entry.name, businessEntry)
          }
        } catch (error) {
          console.warn(`⚠️ Failed to analyze ${entry.name}:`, error.message)
        }
      }
    }

    return businesses
  }

  private async analyzeBusinessDirectory(
    dirPath: string,
    name: string
  ): Promise<BusinessEntry | null> {
    const envPath = path.join(dirPath, '.env')
    const packagePath = path.join(dirPath, 'package.json')

    // Check if it's a valid business directory
    if (!await fs.pathExists(envPath) && !await fs.pathExists(packagePath)) {
      return null
    }

    // Parse environment variables
    const envVars = await this.parseEnvFile(envPath)
    
    // Parse package.json if exists
    let packageInfo = {}
    if (await fs.pathExists(packagePath)) {
      packageInfo = await fs.readJson(packagePath)
    }

    // Extract business information
    const port = this.extractPort(envVars, name)
    const domain = this.extractDomain(envVars, name, port)
    const features = this.extractFeatures(envVars)
    const plugins = this.extractPlugins(envVars, packageInfo)

    return {
      name,
      title: envVars.SITE_TITLE || this.generateTitle(name),
      domain,
      port,
      rootPath: dirPath,
      envPath,
      features,
      plugins,
      status: 'inactive'
    }
  }

  private async parseEnvFile(envPath: string): Promise<Record<string, string>> {
    if (!await fs.pathExists(envPath)) {
      return {}
    }

    const content = await fs.readFile(envPath, 'utf-8')
    const vars: Record<string, string> = {}

    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          vars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        }
      }
    }

    return vars
  }

  private extractPort(envVars: Record<string, string>, name: string): number {
    // Try various port variable names
    const portVars = ['PORT', 'SERVER_PORT', 'APP_PORT', 'HTTP_PORT']
    
    for (const varName of portVars) {
      if (envVars[varName]) {
        const port = parseInt(envVars[varName], 10)
        if (port && port > 0) {
          return port
        }
      }
    }

    // Generate port based on business name
    return this.generatePortFromName(name)
  }

  private generatePortFromName(name: string): number {
    // Simple hash-based port generation
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff
    }
    
    // Map to port range 3000-9999
    return 3000 + Math.abs(hash) % 7000
  }

  private extractDomain(
    envVars: Record<string, string>,
    name: string,
    port: number
  ): string {
    // Try various domain variable names
    const domainVars = ['DOMAIN', 'HOST', 'HOSTNAME', 'BASE_URL']
    
    for (const varName of domainVars) {
      if (envVars[varName]) {
        return envVars[varName]
      }
    }

    // Generate domain based on business name
    return `${name}.paulovila.org`
  }

  private extractFeatures(envVars: Record<string, string>): string[] {
    const features: string[] = []
    
    // Look for ENABLE_* variables
    for (const [key, value] of Object.entries(envVars)) {
      if (key.startsWith('ENABLE_') && value.toLowerCase() === 'true') {
        const feature = key.replace('ENABLE_', '').toLowerCase()
        features.push(feature)
      }
    }

    // Look for FEATURE_* variables
    for (const [key, value] of Object.entries(envVars)) {
      if (key.startsWith('FEATURE_') && value.toLowerCase() === 'true') {
        const feature = key.replace('FEATURE_', '').toLowerCase()
        features.push(feature)
      }
    }

    return [...new Set(features)] // Remove duplicates
  }

  private extractPlugins(
    envVars: Record<string, string>,
    packageInfo: any
  ): Record<string, any> {
    const plugins: Record<string, any> = {}

    // Extract from package.json dependencies
    if (packageInfo.dependencies) {
      for (const [name, version] of Object.entries(packageInfo.dependencies)) {
        if (name.startsWith('@paulovila/')) {
          plugins[name] = { version, enabled: true }
        }
      }
    }

    // Extract from environment variables
    for (const [key, value] of Object.entries(envVars)) {
      if (key.startsWith('PLUGIN_') && key.endsWith('_ENABLED')) {
        const pluginName = key
          .replace('PLUGIN_', '')
          .replace('_ENABLED', '')
          .toLowerCase()
        
        plugins[pluginName] = {
          enabled: value.toLowerCase() === 'true'
        }
      }
    }

    return plugins
  }

  private generateTitle(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  async registerSites(payload: Payload, sites: Map<string, BusinessEntry>): Promise<void> {
    for (const [name, entry] of sites) {
      try {
        // Check if site already exists
        const existing = await payload.find({
          collection: 'sites',
          where: { name: { equals: name } }
        })

        if (existing.totalDocs === 0) {
          // Create new site
          await payload.create({
            collection: 'sites',
            data: {
              name: entry.name,
              title: entry.title,
              domain: entry.domain,
              port: entry.port,
              rootPath: entry.rootPath,
              envPath: entry.envPath,
              features: entry.features,
              plugins: entry.plugins,
              status: entry.status,
              autoManaged: true,
              version: '1.0.0',
              environment: 'development'
            }
          })
          
          console.log(`✅ Registered new site: ${name}`)
        } else {
          // Update existing site
          await payload.update({
            collection: 'sites',
            where: { name: { equals: name } },
            data: {
              title: entry.title,
              domain: entry.domain,
              port: entry.port,
              rootPath: entry.rootPath,
              envPath: entry.envPath,
              features: entry.features,
              plugins: entry.plugins,
              'healthCheck.lastSeen': new Date()
            }
          })
          
          console.log(`🔄 Updated existing site: ${name}`)
        }
      } catch (error) {
        console.error(`❌ Failed to register site ${name}:`, error)
      }
    }
  }

  async watchForChanges(payload: Payload): Promise<void> {
    const appsDir = path.resolve(this.options.appsDirectory || './apps')
    
    if (!await fs.pathExists(appsDir)) {
      return
    }

    // Watch for changes in apps directory
    const chokidar = await import('chokidar')
    const watcher = chokidar.watch(appsDir, {
      ignored: /node_modules/,
      persistent: true,
      ignoreInitial: true
    })

    watcher.on('change', async (filePath) => {
      if (filePath.endsWith('.env') || filePath.endsWith('package.json')) {
        console.log(`🔄 Detected change in ${filePath}, rescanning...`)
        
        // Rescan and update
        const sites = await this.scanAppsDirectory()
        await this.registerSites(payload, sites)
      }
    })

    watcher.on('addDir', async (dirPath) => {
      console.log(`📁 New directory detected: ${dirPath}, rescanning...`)
      
      // Rescan and update
      const sites = await this.scanAppsDirectory()
      await this.registerSites(payload, sites)
    })

    console.log('👀 Watching for changes in apps directory...')
  }

  getCache(): Map<string, BusinessEntry> {
    return this.cache
  }

  async validateSite(name: string): Promise<boolean> {
    const entry = this.cache.get(name)
    if (!entry) return false

    // Check if directory still exists
    if (!await fs.pathExists(entry.rootPath)) {
      return false
    }

    // Check if .env file is valid
    if (!await fs.pathExists(entry.envPath)) {
      return false
    }

    return true
  }
}
```

### Plugin Orchestrator Implementation

```typescript
// src/core/PluginOrchestrator.ts
import type { Payload } from 'payload'
import type { MotherPluginOptions } from '../types'

export class PluginOrchestrator {
  private options: MotherPluginOptions
  private loadedPlugins: Map<string, any> = new Map()
  private pluginDependencies: Map<string, string[]> = new Map()

  constructor(options: MotherPluginOptions) {
    this.options = options
  }

  async initialize(payload: Payload): Promise<void> {
    console.log('🔧 Plugin Orchestrator: Initializing...')
    
    // Load plugin registry from database
    await this.loadPluginRegistry(payload)
    
    // Resolve plugin dependencies
    await this.resolveDependencies()
    
    // Load and activate plugins
    await this.loadPlugins(payload)
    
    console.log('✅ Plugin Orchestrator: Initialization complete')
  }

  private async loadPluginRegistry(payload: Payload): Promise<void> {
    try {
      const sites = await payload.find({
        collection: 'sites',
        limit: 1000
      })

      for (const site of sites.docs) {
        if (site.plugins && typeof site.plugins === 'object') {
          for (const [pluginName, config] of Object.entries(site.plugins)) {
            if (config && typeof config === 'object' && config.enabled) {
              this.registerPlugin(pluginName, config, site.name)
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to load plugin registry:', error)
    }
  }

  private registerPlugin(name: string, config: any, siteName: string): void {
    if (!this.loadedPlugins.has(name)) {
      this.loadedPlugins.set(name, {
        name,
        config,
        sites: [siteName],
        status: 'registered'
      })
    } else {
      const plugin = this.loadedPlugins.get(name)
      if (!plugin.sites.includes(siteName)) {
        plugin.sites.push(siteName)
      }
    }
  }

  private async resolveDependencies(): Promise<void> {
    // Implement dependency resolution logic
    // This would analyze plugin dependencies and create a loading order
    console.log('🔗 Resolving plugin dependencies...')
  }

  private async loadPlugins(payload: Payload): Promise<void> {
    for (const [name, plugin] of this.loadedPlugins) {
      try {
        await this.loadPlugin(name, plugin, payload)
      } catch (error) {
        console.error(`❌ Failed to load plugin ${name}:`, error)
        plugin.status = 'error'
        plugin.error = error.message
      }
    }
  }

  private async loadPlugin(name: string, plugin: any, payload: Payload): Promise<void> {
    console.log(`🔌 Loading plugin: ${name}`)
    
    try {
      // Dynamic import of the plugin
      const pluginModule = await import(name)
      
      if (pluginModule && typeof pluginModule.default === 'function') {
        // Initialize the plugin
        const pluginInstance = pluginModule.default(plugin.config)
        
        // Apply plugin to payload configuration
        // Note: This is a simplified example - actual implementation would be more complex
        plugin.instance = pluginInstance
        plugin.status = 'loaded'
        
        console.log(`✅ Plugin loaded successfully: ${name}`)
      } else {
        throw new Error(`Invalid plugin format: ${name}`)
      }
    } catch (error) {
      console.error(`❌ Failed to load plugin ${name}:`, error)
      plugin.status = 'error'
      plugin.error = error.message
    }
  }

  async reloadPlugin(name: string, payload: Payload): Promise<void> {
    console.log(`🔄 Reloading plugin: ${name}`)
    
    const plugin = this.loadedPlugins.get(name)
    if (!plugin) {
      throw new Error(`Plugin not found: ${name}`)
    }

    // Unload current instance
    if (plugin.instance) {
      await this.unloadPlugin(name)
    }

    // Reload the plugin
    await this.loadPlugin(name, plugin, payload)
  }

  private async unloadPlugin(name: string): Promise<void> {
    const plugin = this.loadedPlugins.get(name)
    if (plugin && plugin.instance) {
      // Cleanup plugin instance
      if (typeof plugin.instance.cleanup === 'function') {
        await plugin.instance.cleanup()
      }
      
      plugin.instance = null
      plugin.status = 'unloaded'
      
      console.log(`🗑️ Plugin unloaded: ${name}`)
    }
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Plugin Orchestrator: Cleaning up...')
    
    for (const [name] of this.loadedPlugins) {
      await this.unloadPlugin(name)
    }
    
    this.loadedPlugins.clear()
    this.pluginDependencies.clear()
    
    console.log('✅ Plugin Orchestrator: Cleanup complete')
  }

  getLoadedPlugins(): Map<string, any> {
    return this.loadedPlugins
  }

  getPluginStatus(name: string): string | null {
    const plugin = this.loadedPlugins.get(name)
    return plugin ? plugin.status : null
  }
}
```

## 🚀 Implementation Phases

### Phase 1: Core Foundation (Week 1-2)
- [ ] Implement BusinessDetector with directory scanning
- [ ] Create basic App Management Plugin with Sites collection
- [ ] Implement port conflict detection and resolution
- [ ] Create basic health monitoring system

### Phase 2: Plugin Orchestration (Week 3-4)
- [ ] Implement PluginOrchestrator with dynamic loading
- [ ] Create configuration management system
- [ ] Implement deployment management
- [ ] Add security management features

### Phase 3: Advanced Features (Week 5-6)
- [ ] Implement real-time health monitoring
- [ ] Create deployment queue and rollback system
- [ ] Add advanced security scanning
- [ ] Implement plugin dependency resolution

### Phase 4: UI and Documentation (Week 7-8)
- [ ] Create management dashboard UI
- [ ] Implement site management interface
- [ ] Create comprehensive documentation
- [ ] Add migration tools and scripts

## 🎯 Success Metrics

### Technical Metrics
- **Discovery Accuracy**: 100% of valid business applications discovered
- **Port Conflict Resolution**: Zero port conflicts in multi-site deployments
- **Health Monitoring**: 99.9% uptime monitoring accuracy
- **Plugin Loading**: Sub-second plugin initialization times

### Operational Metrics
- **Deployment Success Rate**: 99%+ successful deployments
- **Configuration Sync**: Real-time configuration synchronization
- **Error Recovery**: Automatic recovery from 90%+ of common errors
- **Resource Usage**: <5% overhead on system resources

### User Experience Metrics
- **Setup Time**: <5 minutes for new business application setup
- **Management Efficiency**: 80% reduction in manual configuration tasks
- **Documentation Coverage**: 100% of features documented with examples
- **Developer Satisfaction**: >90% positive feedback on ease of use

## 🔒 Security Considerations

### Access Control
- Role-based access to management functions
- API key authentication for programmatic access
- IP-based restrictions for sensitive operations
- Audit logging for all management actions

### Data Protection
- Encrypted storage of sensitive configuration data
- Secure transmission of health and deployment data
- Regular security scans of plugin dependencies
- Automated vulnerability detection and alerting

### Operational Security
- Sandboxed plugin execution environment
- Resource limits for plugin operations
- Automatic rollback on security violations
- Regular backup of critical configuration data

This technical specification provides the complete blueprint for implementing the Mother Plugin ecosystem, transforming our multi-tenant platform into a truly self-managing, intelligent system that eliminates manual configuration and provides unprecedented visibility and control over all business applications.
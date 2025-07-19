# Mother Plugin Implementation Guide

## 🎯 Implementation Strategy

This guide provides step-by-step instructions for implementing the revolutionary Mother Plugin architecture that transforms our CMS into a universal, environment-driven orchestrator.

## Phase 1: Core Mother Plugin Development

### 1.1 Project Structure Setup

```bash
# Create the mother plugin directory
mkdir -p plugins/core/mother-plugin/src/{core,orchestrator,services,plugins,utils}

# Initialize the plugin
cd plugins/core/mother-plugin
npm init -y
```

### 1.2 Essential Dependencies

```json
{
  "dependencies": {
    "payload": "^2.0.0",
    "express": "^4.18.0",
    "fs-extra": "^11.1.1",
    "path": "^0.12.7",
    "dotenv": "^16.0.0",
    "chokidar": "^3.5.3",
    "semver": "^7.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/fs-extra": "^11.0.1",
    "typescript": "^5.0.0"
  }
}
```

### 1.3 Core Type Definitions

```typescript
// src/types.ts
export interface BusinessContext {
  name: string
  domain: string
  port: number
  detectionMethod: 'port' | 'environment' | 'path' | 'fallback'
}

export interface ResolvedPaths {
  rootFolder: string
  database: string
  media: string
  uploads: string
  logs: string
  config: string
}

export interface BusinessConfig {
  name: string
  title: string
  description: string
  features: Record<string, boolean>
  plugins: Record<string, any>
  ui: {
    theme: string
    primaryColor: string
    logo: string
  }
}

export interface PluginConfig {
  name: string
  package: string
  export: string
  options?: any
  required?: boolean
  version?: string
}

export interface OrchestrationContext {
  businessContext: BusinessContext
  paths: ResolvedPaths
  businessConfig: BusinessConfig
  options: MotherPluginOptions
}

export interface MotherPluginOptions {
  enabled?: boolean
  autoDetectBusiness?: boolean
  dynamicPluginLoading?: boolean
  serveStaticFiles?: boolean
  manageDatabases?: boolean
  handleUploads?: boolean
  configureAPI?: boolean
  setupAdmin?: boolean
  verbose?: boolean
  hotReload?: boolean
  securityMode?: 'strict' | 'moderate' | 'permissive'
}
```

### 1.4 Dynamic Business Detection System

```typescript
// src/orchestrator/business-detector.ts
import path from 'path'
import fs from 'fs-extra'
import type { BusinessContext } from '../types'

export interface SiteRegistryEntry {
  id: string
  name: string
  domain: string
  port: number
  status: 'active' | 'inactive' | 'maintenance'
  rootPath: string
  envPath: string
  lastSeen: Date
  version: string
  features: string[]
}

export class BusinessDetector {
  private static siteRegistry: Map<string, SiteRegistryEntry> = new Map()
  private static registryLoaded = false

  static async detect(): Promise<BusinessContext> {
    console.log('🔍 Detecting business context...')
    
    // Ensure site registry is loaded
    await this.loadSiteRegistry()
    
    // Method 1: Port-based detection (check registry first)
    const portContext = await this.detectFromPort()
    if (portContext) {
      console.log(`✅ Detected from port: ${portContext.name}`)
      return portContext
    }

    // Method 2: Environment variable detection
    const envContext = await this.detectFromEnvironment()
    if (envContext) {
      console.log(`✅ Detected from environment: ${envContext.name}`)
      return envContext
    }

    // Method 3: Path-based detection
    const pathContext = await this.detectFromPath()
    if (pathContext) {
      console.log(`✅ Detected from path: ${pathContext.name}`)
      return pathContext
    }

    // Method 4: Configuration file detection
    const configContext = await this.detectFromConfig()
    if (configContext) {
      console.log(`✅ Detected from config: ${configContext.name}`)
      return configContext
    }

    // Fallback
    console.log('⚠️ Using fallback business context')
    return this.getFallbackContext()
  }

  /**
   * Dynamically loads site registry from:
   * 1. CMS central database (if available)
   * 2. Apps directory scanning
   * 3. Cached registry file
   */
  private static async loadSiteRegistry(): Promise<void> {
    if (this.registryLoaded) return

    console.log('📋 Loading site registry...')

    try {
      // Method 1: Load from CMS central database
      const centralRegistry = await this.loadFromCentralDatabase()
      if (centralRegistry.size > 0) {
        this.siteRegistry = centralRegistry
        console.log(`✅ Loaded ${centralRegistry.size} sites from central database`)
        this.registryLoaded = true
        return
      }

      // Method 2: Scan apps directory
      const scannedRegistry = await this.scanAppsDirectory()
      if (scannedRegistry.size > 0) {
        this.siteRegistry = scannedRegistry
        console.log(`✅ Scanned ${scannedRegistry.size} sites from apps directory`)
        
        // Save to cache for future use
        await this.saveCachedRegistry()
        this.registryLoaded = true
        return
      }

      // Method 3: Load from cached registry
      const cachedRegistry = await this.loadCachedRegistry()
      if (cachedRegistry.size > 0) {
        this.siteRegistry = cachedRegistry
        console.log(`✅ Loaded ${cachedRegistry.size} sites from cache`)
        this.registryLoaded = true
        return
      }

      console.warn('⚠️ No site registry found, using empty registry')
      this.registryLoaded = true

    } catch (error) {
      console.error('❌ Failed to load site registry:', error)
      this.registryLoaded = true
    }
  }

  /**
   * Load site registry from CMS central database
   */
  private static async loadFromCentralDatabase(): Promise<Map<string, SiteRegistryEntry>> {
    const registry = new Map<string, SiteRegistryEntry>()

    try {
      // Check if we're running in CMS mode and can access the database
      if (process.env.BUSINESS_MODE === 'cms' || process.env.PORT === '3006') {
        // This would connect to the CMS database and load the sites collection
        // For now, we'll implement this as a placeholder
        console.log('🏢 Attempting to load from CMS central database...')
        
        // TODO: Implement actual database connection
        // const sites = await payload.find({ collection: 'sites' })
        // sites.docs.forEach(site => registry.set(site.name, site))
      }
    } catch (error) {
      console.warn('⚠️ Could not load from central database:', error)
    }

    return registry
  }

  /**
   * Scan the apps directory to discover sites dynamically
   */
  private static async scanAppsDirectory(): Promise<Map<string, SiteRegistryEntry>> {
    const registry = new Map<string, SiteRegistryEntry>()
    
    try {
      const appsDir = path.resolve(process.cwd(), '../../apps')
      
      if (!fs.existsSync(appsDir)) {
        console.warn(`⚠️ Apps directory not found: ${appsDir}`)
        return registry
      }

      const appFolders = await fs.readdir(appsDir)
      
      for (const folderName of appFolders) {
        const appPath = path.join(appsDir, folderName)
        const envPath = path.join(appPath, '.env')
        
        // Skip if not a directory or no .env file
        if (!fs.statSync(appPath).isDirectory() || !fs.existsSync(envPath)) {
          continue
        }

        try {
          const envContent = await fs.readFile(envPath, 'utf-8')
          const envVars = this.parseEnvFile(envContent)
          
          const port = parseInt(envVars.PORT || '3000')
          
          // Check for port conflicts
          const existingEntry = Array.from(registry.values()).find(entry => entry.port === port)
          if (existingEntry) {
            console.warn(`⚠️ Port conflict detected: ${folderName} and ${existingEntry.name} both use port ${port}`)
            // Auto-resolve by incrementing port
            const newPort = this.findAvailablePort(port, registry)
            console.log(`🔧 Auto-resolving: assigning port ${newPort} to ${folderName}`)
            
            // Update the .env file with the new port
            await this.updateEnvPort(envPath, newPort)
            envVars.PORT = newPort.toString()
          }

          const entry: SiteRegistryEntry = {
            id: folderName,
            name: folderName,
            domain: envVars.DOMAIN || `${folderName}.paulovila.org`,
            port: parseInt(envVars.PORT || '3000'),
            status: 'active',
            rootPath: appPath,
            envPath,
            lastSeen: new Date(),
            version: envVars.VERSION || '1.0.0',
            features: this.extractFeatures(envVars)
          }

          registry.set(folderName, entry)
          console.log(`📱 Discovered site: ${folderName} on port ${entry.port}`)

        } catch (error) {
          console.warn(`⚠️ Failed to process app ${folderName}:`, error)
        }
      }

    } catch (error) {
      console.error('❌ Failed to scan apps directory:', error)
    }

    return registry
  }

  private static parseEnvFile(content: string): Record<string, string> {
    const vars: Record<string, string> = {}
    
    content.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          vars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        }
      }
    })
    
    return vars
  }

  private static extractFeatures(envVars: Record<string, string>): string[] {
    const features: string[] = []
    
    Object.keys(envVars).forEach(key => {
      if (key.startsWith('ENABLE_') && envVars[key] === 'true') {
        features.push(key.substring(7).toLowerCase())
      }
    })
    
    return features
  }

  private static findAvailablePort(startPort: number, registry: Map<string, SiteRegistryEntry>): number {
    const usedPorts = new Set(Array.from(registry.values()).map(entry => entry.port))
    
    let port = startPort + 1
    while (usedPorts.has(port)) {
      port++
    }
    
    return port
  }

  private static async updateEnvPort(envPath: string, newPort: number): Promise<void> {
    try {
      const content = await fs.readFile(envPath, 'utf-8')
      const updatedContent = content.replace(/^PORT=.*$/m, `PORT=${newPort}`)
      await fs.writeFile(envPath, updatedContent)
      console.log(`✅ Updated ${envPath} with new port: ${newPort}`)
    } catch (error) {
      console.error(`❌ Failed to update port in ${envPath}:`, error)
    }
  }

  private static async saveCachedRegistry(): Promise<void> {
    try {
      const cacheFile = path.resolve(process.cwd(), '.site-registry-cache.json')
      const registryData = Array.from(this.siteRegistry.entries())
      await fs.writeJson(cacheFile, registryData, { spaces: 2 })
      console.log(`💾 Saved site registry cache: ${cacheFile}`)
    } catch (error) {
      console.warn('⚠️ Failed to save registry cache:', error)
    }
  }

  private static async loadCachedRegistry(): Promise<Map<string, SiteRegistryEntry>> {
    const registry = new Map<string, SiteRegistryEntry>()
    
    try {
      const cacheFile = path.resolve(process.cwd(), '.site-registry-cache.json')
      if (fs.existsSync(cacheFile)) {
        const registryData = await fs.readJson(cacheFile)
        registryData.forEach(([key, value]: [string, SiteRegistryEntry]) => {
          registry.set(key, value)
        })
        console.log(`📋 Loaded cached registry with ${registry.size} entries`)
      }
    } catch (error) {
      console.warn('⚠️ Failed to load cached registry:', error)
    }
    
    return registry
  }

  private static async detectFromPort(): Promise<BusinessContext | null> {
    const port = parseInt(process.env.PORT || '3000')
    
    // Check registry first
    const registryEntry = Array.from(this.siteRegistry.values())
      .find(entry => entry.port === port)
    
    if (registryEntry) {
      return {
        name: registryEntry.name,
        domain: registryEntry.domain,
        port: registryEntry.port,
        detectionMethod: 'port'
      }
    }
    
    return null
  }

  private static async detectFromEnvironment(): Promise<BusinessContext | null> {
    const businessMode = process.env.BUSINESS_MODE
    if (!businessMode) return null

    const registryEntry = this.siteRegistry.get(businessMode)
    if (registryEntry) {
      return {
        name: registryEntry.name,
        domain: registryEntry.domain,
        port: parseInt(process.env.PORT || registryEntry.port.toString()),
        detectionMethod: 'environment'
      }
    }
    
    return null
  }

  private static async detectFromPath(): Promise<BusinessContext | null> {
    const rootFolder = process.env.ROOT_FOLDER || process.cwd()
    const businessName = this.extractBusinessFromPath(rootFolder)
    
    if (businessName) {
      const registryEntry = this.siteRegistry.get(businessName)
      if (registryEntry) {
        return {
          name: registryEntry.name,
          domain: registryEntry.domain,
          port: parseInt(process.env.PORT || registryEntry.port.toString()),
          detectionMethod: 'path'
        }
      }
    }
    
    return null
  }

  private static async detectFromConfig(): Promise<BusinessContext | null> {
    try {
      const configPath = process.env.BUSINESS_CONFIG_PATH || './business-config.json'
      if (fs.existsSync(configPath)) {
        const config = fs.readJsonSync(configPath)
        const registryEntry = this.siteRegistry.get(config.name)
        if (registryEntry) {
          return {
            name: registryEntry.name,
            domain: config.domain || registryEntry.domain,
            port: parseInt(process.env.PORT || registryEntry.port.toString()),
            detectionMethod: 'config'
          }
        }
      }
    } catch (error) {
      console.warn('Failed to read business config:', error)
    }
    
    return null
  }

  private static extractBusinessFromPath(path: string): string | null {
    const match = path.match(/\/apps\/([^\/]+)/)
    return match ? match[1] : null
  }

  private static getFallbackContext(): BusinessContext {
    return {
      name: 'cms',
      domain: 'cms.paulovila.org',
      port: parseInt(process.env.PORT || '3006'),
      detectionMethod: 'fallback'
    }
  }

  /**
   * Get all registered sites
   */
  static async getAllSites(): Promise<SiteRegistryEntry[]> {
    await this.loadSiteRegistry()
    return Array.from(this.siteRegistry.values())
  }

  /**
   * Register a new site in the registry
   */
  static async registerSite(entry: SiteRegistryEntry): Promise<void> {
    await this.loadSiteRegistry()
    this.siteRegistry.set(entry.name, entry)
    await this.saveCachedRegistry()
    
    // TODO: Also save to central database if available
    console.log(`✅ Registered site: ${entry.name}`)
  }

  /**
   * Update site status
   */
  static async updateSiteStatus(siteName: string, status: SiteRegistryEntry['status']): Promise<void> {
    await this.loadSiteRegistry()
    const entry = this.siteRegistry.get(siteName)
    if (entry) {
      entry.status = status
      entry.lastSeen = new Date()
      await this.saveCachedRegistry()
      console.log(`✅ Updated ${siteName} status to: ${status}`)
    }
  }
}
```

### 1.5 Path Resolution System

```typescript
// src/orchestrator/path-resolver.ts
import path from 'path'
import fs from 'fs-extra'
import type { BusinessContext, ResolvedPaths } from '../types'

export class PathResolver {
  static resolve(businessContext: BusinessContext): ResolvedPaths {
    console.log(`📁 Resolving paths for business: ${businessContext.name}`)
    
    const rootFolder = this.resolveRootFolder(businessContext)
    
    const paths: ResolvedPaths = {
      rootFolder,
      database: this.resolveDatabasePath(rootFolder),
      media: this.resolveMediaPath(rootFolder),
      uploads: this.resolveUploadsPath(rootFolder),
      logs: this.resolveLogsPath(rootFolder),
      config: this.resolveConfigPath(rootFolder)
    }
    
    // Validate all paths
    this.validatePaths(paths)
    
    // Create missing directories
    this.ensureDirectories(paths)
    
    console.log(`✅ Paths resolved:`, paths)
    return paths
  }

  private static resolveRootFolder(businessContext: BusinessContext): string {
    // Priority 1: Environment variable
    if (process.env.ROOT_FOLDER) {
      return path.resolve(process.env.ROOT_FOLDER)
    }
    
    // Priority 2: Standard apps directory
    const appsPath = path.resolve(process.cwd(), '../../apps', businessContext.name)
    if (fs.existsSync(appsPath)) {
      return appsPath
    }
    
    // Priority 3: Current working directory
    return process.cwd()
  }

  private static resolveDatabasePath(rootFolder: string): string {
    const dbPath = process.env.DATABASE_PATH || `${path.basename(rootFolder)}.db`
    return path.isAbsolute(dbPath) ? dbPath : path.resolve(rootFolder, dbPath)
  }

  private static resolveMediaPath(rootFolder: string): string {
    const mediaPath = process.env.MEDIA_PATH || 'media'
    return path.isAbsolute(mediaPath) ? mediaPath : path.resolve(rootFolder, mediaPath)
  }

  private static resolveUploadsPath(rootFolder: string): string {
    const uploadsPath = process.env.UPLOADS_PATH || 'uploads'
    return path.isAbsolute(uploadsPath) ? uploadsPath : path.resolve(rootFolder, uploadsPath)
  }

  private static resolveLogsPath(rootFolder: string): string {
    const logsPath = process.env.LOGS_PATH || 'logs'
    return path.isAbsolute(logsPath) ? logsPath : path.resolve(rootFolder, logsPath)
  }

  private static resolveConfigPath(rootFolder: string): string {
    const configPath = process.env.CONFIG_PATH || 'business-config.json'
    return path.isAbsolute(configPath) ? configPath : path.resolve(rootFolder, configPath)
  }

  private static validatePaths(paths: ResolvedPaths): void {
    // Validate root folder exists or can be created
    if (!fs.existsSync(path.dirname(paths.rootFolder))) {
      throw new Error(`Root folder parent directory does not exist: ${path.dirname(paths.rootFolder)}`)
    }

    // Validate database path is writable
    const dbDir = path.dirname(paths.database)
    if (!fs.existsSync(dbDir)) {
      try {
        fs.ensureDirSync(dbDir)
      } catch (error) {
        throw new Error(`Cannot create database directory: ${dbDir}`)
      }
    }
  }

  private static ensureDirectories(paths: ResolvedPaths): void {
    const directories = [
      paths.rootFolder,
      paths.media,
      paths.uploads,
      paths.logs,
      path.dirname(paths.config)
    ]

    for (const dir of directories) {
      try {
        fs.ensureDirSync(dir)
        console.log(`📁 Ensured directory: ${dir}`)
      } catch (error) {
        console.warn(`⚠️ Failed to create directory ${dir}:`, error)
      }
    }
  }
}
```

### 1.6 Configuration Manager

```typescript
// src/orchestrator/config-manager.ts
import fs from 'fs-extra'
import path from 'path'
import type { BusinessContext, ResolvedPaths, BusinessConfig } from '../types'

export class ConfigManager {
  static load(businessContext: BusinessContext, paths: ResolvedPaths): BusinessConfig {
    console.log(`⚙️ Loading configuration for: ${businessContext.name}`)
    
    // Try to load from business-config.json
    const configFromFile = this.loadFromFile(paths.config)
    
    // Merge with environment variables
    const configFromEnv = this.loadFromEnvironment(businessContext)
    
    // Create final configuration
    const finalConfig = this.mergeConfigurations(
      this.getDefaultConfig(businessContext),
      configFromFile,
      configFromEnv
    )
    
    // Validate configuration
    this.validateConfig(finalConfig)
    
    console.log(`✅ Configuration loaded for: ${finalConfig.name}`)
    return finalConfig
  }

  private static loadFromFile(configPath: string): Partial<BusinessConfig> {
    try {
      if (fs.existsSync(configPath)) {
        const config = fs.readJsonSync(configPath)
        console.log(`📄 Loaded config from file: ${configPath}`)
        return config
      }
    } catch (error) {
      console.warn(`⚠️ Failed to load config from file ${configPath}:`, error)
    }
    
    return {}
  }

  private static loadFromEnvironment(businessContext: BusinessContext): Partial<BusinessConfig> {
    const envConfig: Partial<BusinessConfig> = {
      features: {},
      plugins: {}
    }

    // Load features from environment
    const featurePrefix = 'ENABLE_'
    Object.keys(process.env).forEach(key => {
      if (key.startsWith(featurePrefix)) {
        const featureName = key.substring(featurePrefix.length).toLowerCase()
        envConfig.features![featureName] = process.env[key] === 'true'
      }
    })

    // Load plugin configurations
    const pluginPrefix = `${businessContext.name.toUpperCase()}_PLUGIN_`
    Object.keys(process.env).forEach(key => {
      if (key.startsWith(pluginPrefix)) {
        const pluginKey = key.substring(pluginPrefix.length).toLowerCase()
        const [pluginName, ...configPath] = pluginKey.split('_')
        
        if (!envConfig.plugins![pluginName]) {
          envConfig.plugins![pluginName] = {}
        }
        
        const configValue = process.env[key]
        if (configPath.length === 0) {
          envConfig.plugins![pluginName] = configValue
        } else {
          this.setNestedValue(envConfig.plugins![pluginName], configPath, configValue)
        }
      }
    })

    console.log(`🌍 Loaded config from environment`)
    return envConfig
  }

  private static getDefaultConfig(businessContext: BusinessContext): BusinessConfig {
    const defaults: Record<string, Partial<BusinessConfig>> = {
      intellitrade: {
        name: 'intellitrade',
        title: 'IntelliTrade',
        description: 'Blockchain Trading Platform',
        features: {
          kyc: true,
          blockchain: true,
          escrow: true,
          trading: true
        },
        ui: {
          theme: 'dark',
          primaryColor: '#007bff',
          logo: '/media/logos/intellitrade.png'
        }
      },
      latinos: {
        name: 'latinos',
        title: 'Latinos',
        description: 'Latino Trading Community',
        features: {
          trading: true,
          social: true,
          education: true
        },
        ui: {
          theme: 'light',
          primaryColor: '#28a745',
          logo: '/media/logos/latinos.png'
        }
      },
      salarium: {
        name: 'salarium',
        title: 'Salarium',
        description: 'HR Management Platform',
        features: {
          hr: true,
          payroll: true,
          recruitment: true
        },
        ui: {
          theme: 'corporate',
          primaryColor: '#6f42c1',
          logo: '/media/logos/salarium.png'
        }
      },
      capacita: {
        name: 'capacita',
        title: 'Capacita',
        description: 'Training and Development Platform',
        features: {
          training: true,
          assessment: true,
          certification: true
        },
        ui: {
          theme: 'educational',
          primaryColor: '#fd7e14',
          logo: '/media/logos/capacita.png'
        }
      }
    }

    const defaultConfig = defaults[businessContext.name] || {
      name: businessContext.name,
      title: businessContext.name.charAt(0).toUpperCase() + businessContext.name.slice(1),
      description: `${businessContext.name} Platform`,
      features: {},
      ui: {
        theme: 'default',
        primaryColor: '#007bff',
        logo: '/media/logos/default.png'
      }
    }

    return {
      ...defaultConfig,
      plugins: {}
    } as BusinessConfig
  }

  private static mergeConfigurations(
    ...configs: Partial<BusinessConfig>[]
  ): BusinessConfig {
    const merged = configs.reduce((acc, config) => {
      return {
        ...acc,
        ...config,
        features: { ...acc.features, ...config.features },
        plugins: { ...acc.plugins, ...config.plugins },
        ui: { ...acc.ui, ...config.ui }
      }
    }, {} as BusinessConfig)

    return merged
  }

  private static validateConfig(config: BusinessConfig): void {
    if (!config.name) {
      throw new Error('Business configuration must have a name')
    }
    
    if (!config.title) {
      throw new Error('Business configuration must have a title')
    }
    
    if (!config.features) {
      config.features = {}
    }
    
    if (!config.plugins) {
      config.plugins = {}
    }
    
    if (!config.ui) {
      config.ui = {
        theme: 'default',
        primaryColor: '#007bff',
        logo: '/media/logos/default.png'
      }
    }
  }

  private static setNestedValue(obj: any, path: string[], value: any): void {
    const key = path[0]
    if (path.length === 1) {
      obj[key] = value
    } else {
      if (!obj[key]) {
        obj[key] = {}
      }
      this.setNestedValue(obj[key], path.slice(1), value)
    }
  }
}
```

## Phase 2: Plugin Loading System

### 2.1 Plugin Registry

```typescript
// src/plugins/registry.ts
import type { PluginConfig, BusinessContext, BusinessConfig } from '../types'

export class PluginRegistry {
  private static readonly CORE_PLUGINS: PluginConfig[] = [
    {
      name: 'auth',
      package: '@paulovila/core-auth',
      export: 'authPlugin',
      required: true
    },
    {
      name: 'api',
      package: '@paulovila/core-api',
      export: 'apiPlugin',
      required: true
    }
  ]

  private static readonly BUSINESS_PLUGINS: Record<string, PluginConfig[]> = {
    intellitrade: [
      {
        name: 'kyc',
        package: '@paulovila/shared-kyc',
        export: 'kycPlugin'
      },
      {
        name: 'blockchain',
        package: '@paulovila/intellitrade-blockchain',
        export: 'blockchainPlugin'
      },
      {
        name: 'escrow',
        package: '@paulovila/intellitrade-escrow',
        export: 'escrowPlugin'
      }
    ],
    latinos: [
      {
        name: 'trading',
        package: '@paulovila/latinos-trading',
        export: 'tradingPlugin'
      },
      {
        name: 'social',
        package: '@paulovila/shared-social',
        export: 'socialPlugin'
      }
    ],
    salarium: [
      {
        name: 'hr',
        package: '@paulovila/salarium-hr',
        export: 'hrPlugin'
      },
      {
        name: 'payroll',
        package: '@paulovila/salarium-payroll',
        export: 'payrollPlugin'
      }
    ],
    capacita: [
      {
        name: 'training',
        package: '@paulovila/capacita-training',
        export: 'trainingPlugin'
      },
      {
        name: 'assessment',
        package: '@paulovila/capacita-assessment',
        export: 'assessmentPlugin'
      }
    ]
  }

  static getPluginsToLoad(
    businessContext: BusinessContext,
    businessConfig: BusinessConfig
  ): PluginConfig[] {
    const plugins: PluginConfig[] = []

    // Always load core plugins
    plugins.push(...this.CORE_PLUGINS)

    // Load business-specific plugins based on features
    const businessPlugins = this.BUSINESS_PLUGINS[businessContext.name] || []
    
    for (const plugin of businessPlugins) {
      const featureEnabled = businessConfig.features[plugin.name]
      const pluginConfig = businessConfig.plugins[plugin.name]
      
      if (featureEnabled) {
        plugins.push({
          ...plugin,
          options: pluginConfig || {}
        })
      }
    }

    return plugins
  }

  static validatePlugin(pluginConfig: PluginConfig): boolean {
    // Basic validation
    if (!pluginConfig.name || !pluginConfig.package || !pluginConfig.export) {
      return false
    }

    // Check if package exists (in a real implementation, you might check npm registry)
    try {
      require.resolve(pluginConfig.package)
      return true
    } catch (error) {
      console.warn(`Plugin package not found: ${pluginConfig.package}`)
      return false
    }
  }
}
```

### 2.2 Plugin Loader

```typescript
// src/plugins/installer.ts
import type { Plugin } from 'payload'
import type { PluginConfig } from '../types'

export class PluginInstaller {
  private loadedPlugins: Map<string, Plugin> = new Map()
  private failedPlugins: Set<string> = new Set()

  async loadPlugin(pluginConfig: PluginConfig): Promise<Plugin | null> {
    const { name, package: packageName, export: exportName, options = {} } = pluginConfig

    // Check if already loaded
    if (this.loadedPlugins.has(name)) {
      console.log(`🔄 Plugin already loaded: ${name}`)
      return this.loadedPlugins.get(name)!
    }

    // Check if previously failed
    if (this.failedPlugins.has(name)) {
      console.log(`❌ Plugin previously failed: ${name}`)
      return null
    }

    try {
      console.log(`📦 Loading plugin: ${name} from ${packageName}`)
      
      // Dynamic import of plugin
      const pluginModule = await this.importPlugin(packageName)
      const pluginFactory = pluginModule[exportName] || pluginModule.default

      if (typeof pluginFactory !== 'function') {
        throw new Error(`Plugin export '${exportName}' is not a function`)
      }

      // Create plugin instance
      const plugin = pluginFactory(options)
      
      if (typeof plugin !== 'function') {
        throw new Error(`Plugin factory did not return a function`)
      }

      // Cache the loaded plugin
      this.loadedPlugins.set(name, plugin)
      
      console.log(`✅ Successfully loaded plugin: ${name}`)
      return plugin

    } catch (error) {
      console.error(`❌ Failed to load plugin ${name}:`, error)
      this.failedPlugins.add(name)
      
      // If it's a required plugin, throw the error
      if (pluginConfig.required) {
        throw new Error(`Required plugin '${name}' failed to load: ${error.message}`)
      }
      
      return null
    }
  }

  async loadPlugins(pluginConfigs: PluginConfig[]): Promise<Plugin[]> {
    const plugins: Plugin[] = []
    
    for (const config of pluginConfigs) {
      const plugin = await this.loadPlugin(config)
      if (plugin) {
        plugins.push(plugin)
      }
    }
    
    return plugins
  }

  private async importPlugin(packageName: string): Promise<any> {
    try {
      // Try dynamic import first (ES modules)
      return await import(packageName)
    } catch (error) {
      // Fallback to require (CommonJS)
      return require(packageName)
    }
  }

  getLoadedPlugins(): string[] {
    return Array.from(this.loadedPlugins.keys())
  }

  getFailedPlugins(): string[] {
    return Array.from(this.failedPlugins)
  }

  clearCache(): void {
    this.loadedPlugins.clear()
    this.failedPlugins.clear()
  }
}
```

## Phase 3: Service Integration

### 3.1 Database Manager

```typescript
// src/core/database.ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import type { DatabaseAdapter } from 'payload'
import type { OrchestrationContext } from '../types'

export class DatabaseManager {
  static configure(context: OrchestrationContext): DatabaseAdapter {
    const { paths, businessContext } = context
    const dbType = process.env.DATABASE_TYPE || 'sqlite'
    
    console.log(`🗄️ Configuring ${dbType} database for ${businessContext.name}`)
    
    switch (dbType.toLowerCase()) {
      case 'sqlite':
        return this.configureSQLite(paths.database)
        
      case 'mongodb':
      case 'mongo':
        return this.configureMongoDB(businessContext.name)
        
      case 'postgresql':
      case 'postgres':
        return this.configurePostgreSQL(businessContext.name)
        
      default:
        console.warn(`⚠️ Unknown database type: ${dbType}, falling back to SQLite`)
        return this.configureSQLite(paths.database)
    }
  }

  private static configureSQLite(dbPath: string): DatabaseAdapter {
    console.log(`📁 SQLite database: ${dbPath}`)
    
    return sqliteAdapter({
      db: {
        filename: dbPath
      },
      migrationDir: './migrations'
    })
  }

  private static configureMongoDB(businessName: string): DatabaseAdapter {
    const url = process.env.DATABASE_URL || 
                process.env.MONGODB_URL || 
                `mongodb://localhost:27017/${businessName}`
    
    console.log(`🍃 MongoDB database: ${url}`)
    
    return mongooseAdapter({
      url,
      connectOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    })
  }

  private static configurePostgreSQL(businessName: string): DatabaseAdapter {
    const connectionString = process.env.DATABASE_URL || 
                            process.env.POSTGRES_URL || 
                            `postgresql://localhost:5432/${businessName}`
    
    console.log(`🐘 PostgreSQL database: ${connectionString}`)
    
    return postgresAdapter({
      pool: {
        connectionString
      },
      migrationDir: './migrations'
    })
  }
}
```

### 3.2 File Server

```typescript
// src/services/file-server.ts
import express from 'express'
import path from 'path'
import fs from 'fs-extra'
import type { Config } from 'payload'
import type { OrchestrationContext } from '../types'

export class FileServer {
  static configure(config: Config, context: OrchestrationContext): Config {
    const { paths, businessContext } = context
    
    console.log(`📁 Configuring file server for ${businessContext.name}`)
    
    // Configure upload handling
    config.upload = {
      staticDir: paths.media,
      staticURL: '/media',
      adminThumbnail: 'thumbnail',
      mimeTypes: ['image/*', 'application/pdf', 'video/*', 'audio/*'],
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
      }
    }

    // Add custom middleware for file serving
    const originalOnInit = config.onInit
    config.onInit = async (payload) => {
      if (originalOnInit) {
        await originalOnInit(payload)
      }
      
      // Setup custom file serving routes
      this.setupFileRoutes(payload.express, context)
    }
    
    return config
  }

  private static setupFileRoutes(app: express.Application, context: OrchestrationContext): void {
    const { paths, businessContext } = context
    
    // Serve media files
    app.use('/media', express.static(paths.media, {
      maxAge: '1d',
      etag: true,
      lastModified: true
    }))
    
    // Serve uploads
    app.use('/uploads', express.static(paths.uploads, {
      maxAge: '1h',
      etag: true
    }))
    
    // Custom upload endpoint
    app.post('/api/upload', this.createUploadHandler(context))
    
    // File management endpoints
    app.get('/api/files', this.createFileListHandler(context))
    app.delete('/api/files/:filename', this.createFileDeleteHandler(context))
    
    console.log(`✅ File server routes configured for ${businessContext.name}`)
  }

  private static createUploadHandler(context: OrchestrationContext) {
    return async (req: express.Request, res: express.Response) => {
      try {
        // Custom upload logic here
        // This would integrate with multer or similar
        res.json({ success: true, message: 'File uploaded successfully' })
      } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'Upload failed' })
      }
    }
  }

  private static createFileListHandler(context: OrchestrationContext) {
    return async (req: express.Request, res: express.Response) => {
      try {
        const files = await fs.readdir(context.paths.media)
        const fileList = await Promise.all(
          files.map(async (filename) => {
            const filePath = path.join(context.paths.media, filename)
            const stats = await fs.stat(filePath)
            return {
              filename,
              size: stats.size,
              modified: stats.mtime,
              url: `/media/${filename}`
            }
          })
        )
        
        res.json({ files: fileList })
      } catch (error) {
        console.error('File list error:', error)
        res.status(500).json({ error: 'Failed to list files' })
      }
    }
  }

  private static createFileDeleteHandler(context: OrchestrationContext) {
    return async (req: express.Request, res: express.Response) => {
      try {
        const filename = req.params.filename
        const filePath = path.join(context.paths.media, filename)
        
        // Security check - ensure file is within media directory
        if (!filePath.startsWith(context.paths.media)) {
          return res.status(403).json({ error: 'Access denied' })
        
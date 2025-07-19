import type { Config } from 'payload'
import fs from 'fs'
import path from 'path'

/**
 * Configuration options for the port config plugin
 */
export interface PortConfigOptions {
  /** Enable or disable the plugin */
  enabled?: boolean
  
  /** Path to business configuration JSON file */
  configPath?: string
  
  /** Default port if environment variable is not set */
  defaultPort?: number
  
  /** Environment variable name to read port from */
  envVariable?: string
  
  /** Enable development mode logging */
  verbose?: boolean
}

/**
 * Default configuration options
 */
const defaultOptions: Required<PortConfigOptions> = {
  enabled: true,
  configPath: '../../../config/business-config.json',
  defaultPort: 3000,
  envVariable: 'PORT',
  verbose: process.env.NODE_ENV === 'development'
}

/**
 * Business configuration interface
 */
interface BusinessConfig {
  port: number
  domain: string
  dbName: string
  businessName: string
  plugins: string[]
  description?: string
}

/**
 * Validates port number
 */
const validatePort = (port: number): boolean => {
  return port >= 1024 && port <= 65535
}

/**
 * Gets port from environment variable with fallback
 */
const getPort = (envVariable: string, defaultPort: number): number => {
  const envPort = process.env[envVariable]
  if (envPort) {
    const port = parseInt(envPort, 10)
    if (!isNaN(port) && validatePort(port)) {
      return port
    }
  }
  return defaultPort
}

/**
 * Load business configurations from centralized JSON file
 */
const loadBusinessConfigs = (configPath: string): Record<string, BusinessConfig> => {
  try {
    const fullPath = path.resolve(__dirname, configPath)
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Configuration file not found: ${fullPath}`)
    }
    
    const configData = fs.readFileSync(fullPath, 'utf8')
    const config = JSON.parse(configData)
    
    if (!config.businesses) {
      throw new Error('Invalid configuration: missing "businesses" property')
    }
    
    return config.businesses
  } catch (error) {
    console.warn('⚠️ Port Config Plugin: Failed to load business-config.json:', error.message)
    console.warn('🔄 Using hardcoded fallback configuration')
    
    // Fallback configuration
    return {
      intellitrade: { 
        port: 3004, 
        businessName: 'intellitrade', 
        domain: 'intellitrade.paulovila.org',
        dbName: 'intellitrade.db',
        plugins: ['@paulovila/intellitrade-kyc', '@paulovila/shared-analytics']
      },
      salarium: { 
        port: 3005, 
        businessName: 'salarium', 
        throw new Error('Environment variable name cannot be empty')
      }

      if (!validatePort(pluginOptions.defaultPort)) {
        throw new Error('Default port must be between 1024 and 65535')
      }

      // Get the configured port
      const port = getPort(pluginOptions.envVariable, pluginOptions.defaultPort)
      
      // Set the port in process.env if not already set
      if (!process.env[pluginOptions.envVariable]) {
        process.env[pluginOptions.envVariable] = port.toString()
      }

      // Log configuration
      log.info(`Using port ${port} from environment variable ${pluginOptions.envVariable}`, pluginOptions.verbose)
      
      if (process.env.BUSINESS_MODE) {
        log.info(`Business mode: ${process.env.BUSINESS_MODE}`, pluginOptions.verbose)
      }

      // Add onInit for plugin setup
      config.onInit = async (payload) => {
        try {
          if (incomingConfig.onInit) await incomingConfig.onInit(payload)
          
          payload.logger.info(`Port configuration initialized successfully on port ${port}`)
        } catch (error) {
          payload.logger.error(`Failed to initialize port configuration: ${error}`)
          // Don't throw - allow app to continue
        }
      }

      log.success('Plugin loaded successfully')
      return config
    } catch (error) {
      log.error(`Critical initialization error: ${error}`)
      // Return original config to prevent app crash
      return incomingConfig
    }
  }

// Export the plugin as default for convenience
export default portConfigPlugin
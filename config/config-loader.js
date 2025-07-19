const fs = require('fs');
const path = require('path');

/**
 * Configuration Loader for Multi-Tenant Business Platform
 * Manages environment variables and configurations for different business units
 */
class ConfigLoader {
  constructor() {
    this.baseConfig = {
      // Default configuration that applies to all businesses
      nodeEnv: process.env.NODE_ENV || 'development',
      payloadSecret: process.env.PAYLOAD_SECRET || this.generateSecret(),
      cronSecret: process.env.CRON_SECRET || 'YOUR_CRON_SECRET_HERE',
      previewSecret: process.env.PREVIEW_SECRET || 'YOUR_SECRET_HERE',
    };

    // Load business configurations from JSON file
    this.businessConfigs = this.loadBusinessConfigs();
  }

  /**
   * Load business configurations from JSON file
   */
  loadBusinessConfigs() {
    try {
      const configPath = path.join(__dirname, 'business-config.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      console.log('✅ Loaded business configurations from JSON file');
      
      // Store the full config for access to global settings
      this.fullConfig = config;
      
      return config.businesses;
    } catch (error) {
      console.warn('⚠️ Failed to load business-config.json, using fallback configurations');
      
      // Fallback to hardcoded configurations
      const fallbackConfig = {
        global: {
          paths: {
            databases: "databases/",
            media: "media/",
            plugins: "plugins/"
          },
          environment: {
            NODE_ENV: "development",
            PAYLOAD_SECRET: "your-secret-here",
            CRON_SECRET: "your-cron-secret",
            PREVIEW_SECRET: "your-preview-secret"
          }
        },
        businesses: {
          intellitrade: {
            port: 3004,
            domain: 'intellitrade.paulovila.org',
            dbName: 'intellitrade.db',
            businessName: 'intellitrade',
            plugins: ['@paulovila/intellitrade-kyc', '@paulovila/shared-analytics']
          },
          salarium: {
            port: 3005,
            domain: 'salarium.paulovila.org',
            dbName: 'salarium.db',
            businessName: 'salarium',
            plugins: ['@paulovila/salarium-hr', '@paulovila/shared-analytics']
          },
          latinos: {
            port: 3003,
            domain: 'latinos.paulovila.org',
            dbName: 'latinos.db',
            businessName: 'latinos',
            plugins: ['@paulovila/latinos-trading', '@paulovila/shared-analytics']
          },
          capacita: {
            port: 3007,
            domain: 'capacita.paulovila.org',
            dbName: 'capacita.db',
            businessName: 'capacita',
            plugins: ['@paulovila/capacita-training', '@paulovila/shared-analytics']
          },
          cms: {
            port: 3006,
            domain: 'cms.paulovila.org',
            dbName: 'cms.db',
            businessName: 'cms',
            plugins: ['@paulovila/core-admin', '@paulovila/shared-analytics']
          }
        }
      };
      
      this.fullConfig = fallbackConfig;
      return fallbackConfig.businesses;
    }
  }

  /**
   * Generate a random secret for JWT tokens
   */
  generateSecret() {
    return require('crypto').randomBytes(16).toString('hex');
  }

  /**
   * Get configuration for a specific business
   */
  getBusinessConfig(businessName) {
    const businessConfig = this.businessConfigs[businessName];
    if (!businessConfig) {
      throw new Error(`Unknown business: ${businessName}`);
    }

    // Get global paths and environment from full config
    const globalPaths = this.fullConfig?.global?.paths || {
      databases: "databases/",
      media: "media/",
      plugins: "plugins/"
    };
    
    const globalEnv = this.fullConfig?.global?.environment || {};

    // Merge base config with global environment and business-specific config
    const mergedConfig = {
      ...this.baseConfig,
      ...globalEnv,
      ...businessConfig,
      serverUrl: `https://${businessConfig.domain}`,
      // Use centralized database path
      databaseUri: `file:./${globalPaths.databases}${businessConfig.dbName}`,
      // Add path information for plugins to use
      paths: {
        databases: globalPaths.databases,
        media: globalPaths.media,
        plugins: globalPaths.plugins
      }
    };

    return mergedConfig;
  }

  /**
   * Generate .env file for a specific business
   */
  generateBusinessEnv(businessName, envPath) {
    const config = this.getBusinessConfig(businessName);
    
    const envContent = `# Database connection string
DATABASE_URI=${config.databaseUri}
# Or use a PG connection string
#DATABASE_URI=postgresql://127.0.0.1:5432/your-database-name

# Used to encrypt JWT tokens
PAYLOAD_SECRET=${config.payloadSecret}

# Used to configure CORS, format links and more. No trailing slash
NEXT_PUBLIC_SERVER_URL=${config.serverUrl}

# Secret used to authenticate cron jobs
CRON_SECRET=${config.cronSecret}

# Used to validate preview requests
PREVIEW_SECRET=${config.previewSecret}

# Business Context Configuration
BUSINESS_NAME=${config.businessName}
BUSINESS_DOMAIN=${config.domain}
PORT=${config.port}

# Plugin Configuration
NODE_ENV=${config.nodeEnv}

# Business-specific plugins
BUSINESS_PLUGINS=${config.plugins.join(',')}

# Centralized Path Configuration
DATABASES_PATH=${config.paths.databases}
MEDIA_PATH=${config.paths.media}
PLUGINS_PATH=${config.paths.plugins}

# Additional environment variables from global config
${Object.entries(config)
  .filter(([key, value]) =>
    !['businessName', 'domain', 'port', 'plugins', 'paths', 'serverUrl', 'databaseUri', 'payloadSecret', 'cronSecret', 'previewSecret', 'nodeEnv'].includes(key) &&
    typeof value === 'string'
  )
  .map(([key, value]) => `${key.toUpperCase()}=${value}`)
  .join('\n')}

# Added by Payload
`;

    // Ensure directory exists
    const envDir = path.dirname(envPath);
    if (!fs.existsSync(envDir)) {
      fs.mkdirSync(envDir, { recursive: true });
    }

    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Generated .env file: ${envPath}`);
  }

  /**
   * Generate Docker Compose configuration
   */
  generateDockerCompose(dockerComposePath) {
    const services = {};
    
    Object.keys(this.businessConfigs).forEach(businessName => {
      const config = this.getBusinessConfig(businessName);
      
      services[businessName] = {
        build: '.',
        ports: [`${config.port}:${config.port}`],
        environment: [
          `BUSINESS_NAME=${config.businessName}`,
          `PORT=${config.port}`,
          `NODE_ENV=${config.nodeEnv}`
        ],
        volumes: [
          `./apps/${businessName}:/app/data`
        ]
      };
    });

    const dockerCompose = {
      version: '3.8',
      services
    };

    const yamlContent = this.objectToYaml(dockerCompose);
    fs.writeFileSync(dockerComposePath, yamlContent);
    console.log(`✅ Generated Docker Compose: ${dockerComposePath}`);
  }

  /**
   * Simple YAML converter for Docker Compose
   */
  objectToYaml(obj, indent = 0) {
    let yaml = '';
    const spaces = '  '.repeat(indent);
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        yaml += this.objectToYaml(value, indent + 1);
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          yaml += `${spaces}  - ${item}\n`;
        });
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }

  /**
   * Detect business context from environment or runtime
   */
  detectBusinessContext() {
    // Try environment variable first
    if (process.env.BUSINESS_NAME) {
      return process.env.BUSINESS_NAME;
    }

    // Try to detect from port
    const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT;
    if (port) {
      for (const [businessName, config] of Object.entries(this.businessConfigs)) {
        if (config.port.toString() === port.toString()) {
          return businessName;
        }
      }
    }

    // Try to detect from domain
    const domain = process.env.BUSINESS_DOMAIN || process.env.NEXT_PUBLIC_SERVER_URL;
    if (domain) {
      for (const [businessName, config] of Object.entries(this.businessConfigs)) {
        if (domain.includes(config.domain)) {
          return businessName;
        }
      }
    }

    // Default fallback
    return 'cms';
  }

  /**
   * Load environment variables for detected business context
   */
  loadBusinessEnvironment() {
    const businessName = this.detectBusinessContext();
    const config = this.getBusinessConfig(businessName);
    
    // Set core environment variables
    process.env.BUSINESS_NAME = config.businessName;
    process.env.BUSINESS_DOMAIN = config.domain;
    process.env.PORT = config.port.toString();
    process.env.NEXT_PUBLIC_SERVER_URL = config.serverUrl;
    process.env.DATABASE_URI = config.databaseUri;
    
    // Set path environment variables
    process.env.DATABASES_PATH = config.paths.databases;
    process.env.MEDIA_PATH = config.paths.media;
    process.env.PLUGINS_PATH = config.paths.plugins;
    
    // Set plugin configuration
    if (config.plugins && config.plugins.length > 0) {
      process.env.BUSINESS_PLUGINS = config.plugins.join(',');
    }
    
    // Set secrets if not already set
    if (!process.env.PAYLOAD_SECRET) {
      process.env.PAYLOAD_SECRET = config.payloadSecret;
    }
    if (!process.env.CRON_SECRET) {
      process.env.CRON_SECRET = config.cronSecret;
    }
    if (!process.env.PREVIEW_SECRET) {
      process.env.PREVIEW_SECRET = config.previewSecret;
    }
    
    // Set additional environment variables from global config
    Object.entries(config).forEach(([key, value]) => {
      if (typeof value === 'string' &&
          !['businessName', 'domain', 'serverUrl', 'databaseUri'].includes(key) &&
          !process.env[key.toUpperCase()]) {
        process.env[key.toUpperCase()] = value;
      }
    });
    
    console.log(`🔧 Loaded environment for business: ${businessName}`);
    console.log(`📁 Database path: ${config.paths.databases}`);
    console.log(`📁 Media path: ${config.paths.media}`);
    console.log(`🔌 Plugins path: ${config.paths.plugins}`);
    
    return { businessName, config };
  }
}

module.exports = ConfigLoader;
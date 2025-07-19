# Core Orchestrator Plugin

The Core Orchestrator Plugin is an intelligent business detection and plugin management system for multi-tenant business platforms. It automatically detects business context, orchestrates plugin loading, and manages configuration merging across different business units.

## 🚀 Features

- **🔍 Intelligent Business Detection**: Automatically detects business context based on domain, port, and environment variables
- **🔌 Plugin Orchestration**: Manages plugin discovery, loading, and dependency resolution
- **⚙️ Configuration Management**: Merges business-specific configurations with intelligent strategies
- **📊 Structured Logging**: Comprehensive logging with JSON/text output formats
- **🛡️ Error Resilience**: Graceful degradation and error handling
- **⚡ Performance Monitoring**: Built-in performance budgets and monitoring
- **🔒 Security Features**: Plugin signature verification and sandbox mode
- **🔧 Development Tools**: Hot reloading, debug logging, and validation

## 📦 Installation

### Automatic (Recommended)
```bash
npm install @paulovila/core-orchestrator
```

The plugin automatically integrates with your Payload CMS configuration.

### Manual Installation
```typescript
// In your payload.config.ts file
import { orchestratorPlugin } from '@paulovila/core-orchestrator'

export default buildConfig({
  plugins: [
    orchestratorPlugin({
      enabled: true,
      autoDetection: true,
      logging: { level: 'info' }
    }),
  ],
})
```

## ⚙️ Configuration

### Basic Configuration
```typescript
orchestratorPlugin({
  enabled: true,
  autoDetection: true,
  logging: {
    level: 'info',
    structured: true,
    format: 'json'
  }
})
```

### Advanced Configuration
```typescript
orchestratorPlugin({
  enabled: true,
  autoDetection: true,
  
  // Plugin management
  plugins: {
    autoDiscovery: true,
    searchPaths: ['./plugins', './node_modules/@paulovila'],
    loadingStrategy: 'eager', // 'eager' | 'lazy' | 'on-demand'
    maxPlugins: 100,
    timeout: 30000
  },
  
  // Configuration management
  configuration: {
    merging: true,
    mergeStrategy: 'deep', // 'deep' | 'shallow' | 'replace'
    validation: true,
    cache: {
      enabled: true,
      ttl: 300000 // 5 minutes
    }
  },
  
  // Business detection
  detection: {
    domain: true,
    port: true,
    environment: true,
    customRules: [
      {
        name: 'custom-business',
        condition: (context) => context.subdomain === 'custom',
        business: 'custom'
      }
    ]
  },
  
  // Security settings
  security: {
    verifySignatures: true,
    allowedSources: ['@paulovila'],
    sandbox: false
  },
  
  // Performance settings
  performance: {
    monitoring: true,
    budget: 5000, // 5 seconds
    lazyLoading: false
  },
  
  // Development settings
  development: {
    enabled: process.env.NODE_ENV === 'development',
    hotReload: true,
    debug: true,
    validation: true
  }
})
```

## 🏢 Business Detection

The orchestrator automatically detects business context using multiple strategies:

### Domain-Based Detection
```typescript
// Automatically detects business from domain
// intellitrade.paulovila.org → 'intellitrade'
// salarium.paulovila.org → 'salarium'
// latinos.paulovila.org → 'latinos'
```

### Port-Based Detection
```typescript
// Detects business from development ports
// :3004 → 'intellitrade'
// :3005 → 'salarium'
// :3003 → 'latinos'
```

### Environment Variable Detection
```typescript
// Uses BUSINESS_CONTEXT environment variable
process.env.BUSINESS_CONTEXT = 'intellitrade'
```

### Custom Detection Rules
```typescript
detection: {
  customRules: [
    {
      name: 'api-detection',
      condition: (context) => context.path.startsWith('/api/v2'),
      business: 'intellitrade'
    },
    {
      name: 'subdomain-detection',
      condition: (context) => context.subdomain === 'trading',
      business: 'latinos'
    }
  ]
}
```

## 🔌 Plugin Management

### Automatic Plugin Discovery
The orchestrator automatically discovers and loads plugins based on business context:

```typescript
// Searches in configured paths
plugins: {
  searchPaths: [
    './plugins',
    './node_modules/@paulovila',
    './custom-plugins'
  ]
}
```

### Loading Strategies
- **Eager**: Load all plugins at startup (default)
- **Lazy**: Load plugins when first accessed
- **On-demand**: Load plugins only when explicitly requested

### Plugin Dependencies
The orchestrator resolves plugin dependencies automatically:
```typescript
// Plugin A depends on Plugin B
// Orchestrator ensures Plugin B loads before Plugin A
```

## 📊 Logging

### Structured Logging
```typescript
logging: {
  level: 'info', // 'error' | 'warn' | 'info' | 'debug'
  structured: true,
  format: 'json', // 'json' | 'text'
  performance: true
}
```

### Log Output Examples
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "plugin": "orchestrator",
  "message": "Business context detected",
  "data": {
    "businessContext": {
      "context": "intellitrade",
      "domain": "intellitrade.paulovila.org",
      "port": 3004
    }
  }
}
```

## ⚡ Performance Monitoring

### Performance Budget
```typescript
performance: {
  monitoring: true,
  budget: 5000, // 5 seconds maximum initialization time
  lazyLoading: false
}
```

### Performance Metrics
- Initialization duration
- Plugin loading times
- Configuration merge duration
- Memory usage tracking

## 🛡️ Security Features

### Plugin Signature Verification
```typescript
security: {
  verifySignatures: true, // Verify plugin signatures
  allowedSources: ['@paulovila'], // Only allow trusted sources
  sandbox: false // Enable sandbox mode for untrusted plugins
}
```

### Allowed Plugin Sources
- Restrict plugin loading to trusted npm scopes
- Verify plugin integrity before loading
- Sandbox mode for additional isolation

## 🔧 Development Features

### Hot Reloading
```typescript
development: {
  hotReload: true, // Reload plugins on file changes
  debug: true, // Enable debug logging
  validation: true // Validate plugin configurations
}
```

### Debug Logging
Enable detailed debug information during development:
```typescript
logging: {
  level: 'debug',
  performance: true
}
```

## 📚 API Reference

### Core Components

#### BusinessDetector
```typescript
import { BusinessDetectorImpl } from '@paulovila/core-orchestrator'

const detector = new BusinessDetectorImpl(logger)
const context = await detector.detect()
```

#### PluginOrchestrator
```typescript
import { PluginOrchestrator } from '@paulovila/core-orchestrator'

const orchestrator = new PluginOrchestrator(options)
const result = await orchestrator.loadPluginsForBusiness('intellitrade', config)
```

#### ConfigurationManager
```typescript
import { ConfigurationManagerImpl } from '@paulovila/core-orchestrator'

const manager = new ConfigurationManagerImpl(logger)
const merged = await manager.mergeBusinessConfig(config, 'intellitrade', plugins)
```

### Types
```typescript
import type {
  OrchestratorOptions,
  BusinessContext,
  PluginMetadata,
  LogLevel
} from '@paulovila/core-orchestrator'
```

## 🏗️ Architecture

### Plugin Lifecycle
1. **Detection**: Business context detection
2. **Discovery**: Plugin discovery in search paths
3. **Resolution**: Dependency resolution
4. **Loading**: Plugin loading and initialization
5. **Configuration**: Business-specific configuration merging
6. **Monitoring**: Performance and error monitoring

### Business Context Flow
```
Request → Domain/Port/Env Detection → Business Context → Plugin Loading → Config Merging → Response
```

## 🔍 Troubleshooting

### Common Issues

#### Plugin Not Loading
```bash
# Check plugin search paths
DEBUG=orchestrator:* npm run dev

# Verify plugin exists
ls -la ./plugins/
ls -la ./node_modules/@paulovila/
```

#### Business Detection Failing
```typescript
// Enable debug logging
logging: {
  level: 'debug'
}

// Check detection rules
detection: {
  domain: true,
  port: true,
  environment: true
}
```

#### Performance Issues
```typescript
// Enable performance monitoring
performance: {
  monitoring: true,
  budget: 3000 // Reduce budget to identify slow operations
}

// Use lazy loading
plugins: {
  loadingStrategy: 'lazy'
}
```

#### Configuration Conflicts
```typescript
// Use shallow merge strategy
configuration: {
  mergeStrategy: 'shallow'
}

// Enable validation
configuration: {
  validation: true
}
```

### Debug Commands
```bash
# Enable debug logging
DEBUG=orchestrator:* npm run dev

# Check TypeScript compilation
npx tsc --noEmit

# Validate plugin structure
npm run lint
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Plugin Validation
```bash
npm run validate:plugins
```

## 🤝 Contributing

### Development Setup
```bash
git clone <repository>
cd plugins/core/orchestrator
npm install
npm run dev
```

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Jest for testing
- Conventional commits

### Plugin Development Guidelines
1. Follow the plugin architecture patterns
2. Include comprehensive error handling
3. Add structured logging
4. Write unit tests
5. Document configuration options

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Packages

- `@paulovila/core-auth` - Authentication plugin
- `@paulovila/shared-analytics` - Analytics plugin
- `@paulovila/intellitrade-kyc` - KYC verification plugin
- `@paulovila/salarium-hr` - HR management plugin

## 📞 Support

- Documentation: [Plugin Architecture Guide](../../docs/general/architecture/)
- Issues: GitHub Issues
- Team Chat: Internal Slack Channel

---

**Note**: This is a core plugin required by all business applications. It should be loaded first in the plugin chain to ensure proper business detection and plugin orchestration.
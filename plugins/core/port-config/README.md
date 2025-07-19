# @paulovila/core-port-config

Core plugin for configuring Next.js port from environment variables in multi-tenant business applications.

## Overview

This core plugin automatically configures the Next.js development server port based on environment variables, enabling different business units to run on their designated ports without manual configuration.

## Installation

### Automatic (Recommended)
```bash
npm install @paulovila/core-port-config
```

The plugin automatically:
- Configures Next.js server port from environment variables
- Sets up proper port handling for development and production
- Integrates seamlessly with existing Next.js configuration

### Manual Installation
```bash
npm install @paulovila/core-port-config
```

Then add to your `payload.config.ts`:
```typescript
import { portConfigPlugin } from '@paulovila/core-port-config'

export default buildConfig({
  plugins: [
    portConfigPlugin({
      enabled: true,
      defaultPort: 3000,
      envVariable: 'PORT'
    }),
  ],
})
```

## Configuration

### Plugin Options

```typescript
interface PortConfigOptions {
  /** Enable or disable the plugin */
  enabled?: boolean
  
  /** Default port if environment variable is not set */
  defaultPort?: number
  
  /** Environment variable name to read port from */
  envVariable?: string
  
  /** Enable development mode logging */
  verbose?: boolean
}
```

### Default Configuration
```typescript
const defaultOptions = {
  enabled: true,
  defaultPort: 3000,
  envVariable: 'PORT',
  verbose: process.env.NODE_ENV === 'development'
}
```

### Environment Variables

The plugin reads the port configuration from environment variables:

```bash
# .env file
PORT=3004                    # Main port configuration
BUSINESS_MODE=intellitrade   # Business context (optional)
NODE_ENV=development         # Environment mode
```

### Business Unit Port Mapping

| Business Unit | Environment Variable | Default Port |
|---------------|---------------------|--------------|
| IntelliTrade  | `PORT=3004`         | 3004         |
| Latinos       | `PORT=3003`         | 3003         |
| Salarium      | `PORT=3005`         | 3005         |
| Capacita      | `PORT=3007`         | 3007         |
| CMS Admin     | `PORT=3006`         | 3006         |

## Usage

### Basic Usage

```typescript
// payload.config.ts
import { buildConfig } from 'payload'
import { portConfigPlugin } from '@paulovila/core-port-config'

export default buildConfig({
  plugins: [
    portConfigPlugin(), // Uses default configuration
  ],
  // ... other config
})
```

### Advanced Configuration

```typescript
// payload.config.ts
import { portConfigPlugin } from '@paulovila/core-port-config'

export default buildConfig({
  plugins: [
    portConfigPlugin({
      enabled: true,
      defaultPort: 3004,
      envVariable: 'INTELLITRADE_PORT',
      verbose: true
    }),
  ],
})
```

### Integration with Next.js

The plugin automatically configures Next.js to use the specified port:

```javascript
// next.config.js (automatically configured)
const nextConfig = {
  // Plugin automatically adds port configuration
  experimental: {
    serverComponentsExternalPackages: ['@paulovila/core-port-config']
  }
}

module.exports = nextConfig
```

### Package.json Scripts

Update your package.json scripts to use the configured port:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## API Reference

### portConfigPlugin(options?)

Main plugin function that configures port handling.

**Parameters:**
- `options` (PortConfigOptions, optional): Plugin configuration options

**Returns:**
- Plugin function compatible with Payload CMS

### PortConfigOptions Interface

```typescript
interface PortConfigOptions {
  enabled?: boolean      // Enable/disable plugin (default: true)
  defaultPort?: number   // Fallback port (default: 3000)
  envVariable?: string   // Environment variable name (default: 'PORT')
  verbose?: boolean      // Enable logging (default: dev mode)
}
```

## Environment Integration

### Development Environment

```bash
# .env.local
PORT=3004
BUSINESS_MODE=intellitrade
NODE_ENV=development
```

### Production Environment

```bash
# .env.production
PORT=3004
BUSINESS_MODE=intellitrade
NODE_ENV=production
```

### Docker Integration

```dockerfile
# Dockerfile
ENV PORT=3004
ENV BUSINESS_MODE=intellitrade
EXPOSE 3004
```

## Security & Compliance

### Port Security
- Plugin validates port numbers (1024-65535 range)
- Prevents port conflicts through environment validation
- Logs port configuration for audit trails

### Environment Security
- Sensitive port information is read from environment variables
- No hardcoded port values in source code
- Supports secure environment variable management

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::3004
```

**Solution:**
1. Check if another process is using the port: `lsof -i :3004`
2. Kill the process or use a different port
3. Update the PORT environment variable

#### Environment Variable Not Found
```bash
Warning: PORT environment variable not set, using default port 3000
```

**Solution:**
1. Create `.env` file with `PORT=3004`
2. Restart the development server
3. Verify environment variable loading

#### Plugin Not Loading
```bash
Error: Cannot find module '@paulovila/core-port-config'
```

**Solution:**
1. Reinstall the plugin: `npm install @paulovila/core-port-config`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check package.json dependencies

### Debug Mode

Enable verbose logging for troubleshooting:

```typescript
portConfigPlugin({
  verbose: true
})
```

This will output:
```
✅ Port Config Plugin: Loaded successfully
ℹ️ Port Config Plugin: Using port 3004 from environment variable PORT
ℹ️ Port Config Plugin: Business mode: intellitrade
```

### Validation Errors

The plugin validates configuration and provides helpful error messages:

```typescript
// Invalid port range
portConfigPlugin({ defaultPort: 80 })
// Error: Port must be between 1024 and 65535

// Invalid environment variable
portConfigPlugin({ envVariable: '' })
// Error: Environment variable name cannot be empty
```

## Development

### Building the Plugin

```bash
cd plugins/core/port-config
npm install
npm run build
```

### Testing

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Plugin Architecture

```
src/
├── index.ts              # Main plugin export
├── types.ts              # TypeScript interfaces
├── utils/
│   ├── port-validator.ts # Port validation logic
│   └── env-loader.ts     # Environment variable handling
└── __tests__/
    └── index.test.ts     # Plugin tests
```

## Version Compatibility

| Plugin Version | Payload CMS | Next.js | Node.js |
|----------------|-------------|---------|---------|
| 1.x.x          | ^2.0.0      | ^13.0.0 | ^18.0.0 |

## Changelog

### v1.0.0
- Initial release
- Basic port configuration from environment variables
- Next.js integration
- Validation and error handling
- Comprehensive documentation

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/paulovila/plugins/issues)
- Team Chat: #plugin-development
- Documentation: [Plugin Development Guide](../../../docs/general/architecture/enhanced-plugin-standards.md)

---

**Note**: This is a core plugin required by all business applications. It provides essential port configuration functionality that enables proper multi-tenant deployment.
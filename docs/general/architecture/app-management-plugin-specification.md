# App Management Plugin Specification

## 🎯 Overview

The App Management Plugin is a core sub-plugin of the Mother Plugin that provides centralized management of all business applications in the multi-tenant platform. It serves as the "control center" for the entire ecosystem.

## 🏗️ Architecture

### Core Responsibilities

1. **Site Registry Management**: Central database of all business applications
2. **Port Conflict Resolution**: Automatic detection and resolution of port conflicts
3. **Health Monitoring**: Real-time status monitoring of all applications
4. **Configuration Management**: Centralized configuration for all sites
5. **Deployment Orchestration**: Coordinated deployment and updates
6. **Security Management**: Access control and security policies

### Integration with Mother Plugin

```typescript
// The App Management Plugin integrates seamlessly with the Mother Plugin
export const appManagementPlugin = (options: AppManagementOptions = {}): Plugin => {
  return (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    
    // Add the Sites collection for central management
    config.collections = [
      ...(config.collections || []),
      SitesCollection,
      DeploymentsCollection,
      HealthChecksCollection,
      ConfigurationsCollection
    ]
    
    // Add management globals
    config.globals = [
      ...(config.globals || []),
      PlatformSettings,
      SecurityPolicies
    ]
    
    // Setup management endpoints
    config.endpoints = [
      ...(config.endpoints || []),
      ...managementEndpoints
    ]
    
    return config
  }
}
```

## 📊 Data Models

### Sites Collection

```typescript
// collections/Sites.ts
import type { CollectionConfig } from 'payload'

export const SitesCollection: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'port', 'status', 'lastSeen'],
    group: 'Platform Management'
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      validate: (val) => {
        if (!val) return 'Site name is required'
        if (!/^[a-z0-9-]+$/.test(val)) return 'Site name must be lowercase alphanumeric with hyphens'
        return true
      }
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for the site'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the site purpose'
      }
    },
    {
      name: 'domain',
      type: 'text',
      required: true,
      validate: (val) => {
        if (!val) return 'Domain is required'
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
        if (!domainRegex.test(val)) return 'Invalid domain format'
        return true
      }
    },
    {
      name: 'port',
      type: 'number',
      required: true,
      min: 3000,
      max: 9999,
      unique: true,
      validate: async (val, { payload }) => {
        if (!val) return 'Port is required'
        
        // Check for port conflicts
        const existing = await payload.find({
          collection: 'sites',
          where: {
            port: { equals: val }
          }
        })
        
        if (existing.totalDocs > 0) {
          return 'Port is already in use by another site'
        }
        
        return true
      }
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'inactive',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Error', value: 'error' },
        { label: 'Deploying', value: 'deploying' }
      ],
      admin: {
        description: 'Current operational status'
      }
    },
    {
      name: 'environment',
      type: 'select',
      required: true,
      defaultValue: 'development',
      options: [
        { label: 'Development', value: 'development' },
        { label: 'Staging', value: 'staging' },
        { label: 'Production', value: 'production' }
      ]
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: '1.0.0',
      admin: {
        description: 'Current version of the site'
      }
    },
    {
      name: 'rootPath',
      type: 'text',
      required: true,
      admin: {
        description: 'Absolute path to the site directory'
      }
    },
    {
      name: 'envPath',
      type: 'text',
      admin: {
        description: 'Path to the .env file'
      }
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true
        }
      ],
      admin: {
        description: 'Enabled features for this site'
      }
    },
    {
      name: 'plugins',
      type: 'json',
      admin: {
        description: 'Plugin configuration for this site'
      }
    },
    {
      name: 'healthCheck',
      type: 'group',
      fields: [
        {
          name: 'lastSeen',
          type: 'date',
          admin: {
            readOnly: true,
            description: 'Last time the site was seen online'
          }
        },
        {
          name: 'responseTime',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Last response time in milliseconds'
          }
        },
        {
          name: 'uptime',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Uptime percentage over last 24 hours'
          }
        },
        {
          name: 'errors',
          type: 'array',
          fields: [
            {
              name: 'timestamp',
              type: 'date'
            },
            {
              name: 'error',
              type: 'text'
            },
            {
              name: 'resolved',
              type: 'checkbox',
              defaultValue: false
            }
          ],
          admin: {
            description: 'Recent errors and their resolution status'
          }
        }
      ]
    },
    {
      name: 'deployment',
      type: 'group',
      fields: [
        {
          name: 'lastDeployment',
          type: 'date',
          admin: {
            readOnly: true
          }
        },
        {
          name: 'deploymentStatus',
          type: 'select',
          options: [
            { label: 'Success', value: 'success' },
            { label: 'Failed', value: 'failed' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Pending', value: 'pending' }
          ],
          admin: {
            readOnly: true
          }
        },
        {
          name: 'deploymentLog',
          type: 'textarea',
          admin: {
            readOnly: true,
            description: 'Last deployment log'
          }
        }
      ]
    },
    {
      name: 'security',
      type: 'group',
      fields: [
        {
          name: 'sslEnabled',
          type: 'checkbox',
          defaultValue: true
        },
        {
          name: 'accessLevel',
          type: 'select',
          defaultValue: 'public',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Private', value: 'private' },
            { label: 'Restricted', value: 'restricted' }
          ]
        },
        {
          name: 'allowedIPs',
          type: 'array',
          fields: [
            {
              name: 'ip',
              type: 'text',
              validate: (val) => {
                const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
                return ipRegex.test(val) || 'Invalid IP address format'
              }
            }
          ],
          admin: {
            condition: (data) => data.security?.accessLevel === 'restricted'
          }
        }
      ]
    },
    {
      name: 'autoManaged',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this site is automatically managed by the Mother Plugin'
      }
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        description: 'Administrative notes about this site'
      }
    }
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-assign port if not provided
        if (operation === 'create' && !data.port) {
          data.port = await findNextAvailablePort(req.payload)
        }
        
        // Update lastSeen on any change
        if (!data.healthCheck) data.healthCheck = {}
        data.healthCheck.lastSeen = new Date()
        
        return data
      }
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Sync changes to file system
        if (operation === 'create' || operation === 'update') {
          await syncSiteToFileSystem(doc, req.payload)
        }
        
        // Update site registry cache
        await updateSiteRegistryCache(doc)
        
        // Trigger health check
        if (doc.status === 'active') {
          await scheduleHealthCheck(doc.name)
        }
      }
    ],
    beforeDelete: [
      async ({ doc, req }) => {
        // Prevent deletion of active sites
        if (doc.status === 'active') {
          throw new Error('Cannot delete an active site. Set status to inactive first.')
        }
        
        // Cleanup file system
        await cleanupSiteFiles(doc)
      }
    ]
  }
}

// Helper functions
async function findNextAvailablePort(payload: any): Promise<number> {
  const sites = await payload.find({
    collection: 'sites',
    sort: 'port'
  })
  
  let port = 3000
  const usedPorts = new Set(sites.docs.map((site: any) => site.port))
  
  while (usedPorts.has(port)) {
    port++
  }
  
  return port
}

async function syncSiteToFileSystem(doc: any, payload: any): Promise<void> {
  // Create or update the site's .env file
  const envContent = generateEnvContent(doc)
  await fs.writeFile(doc.envPath, envContent)
  
  // Create directory structure if needed
  await fs.ensureDir(doc.rootPath)
  
  console.log(`✅ Synced site ${doc.name} to file system`)
}

function generateEnvContent(site: any): string {
  return `# Auto-generated by App Management Plugin
# Site: ${site.name}
# Last updated: ${new Date().toISOString()}

BUSINESS_MODE=${site.name}
PORT=${site.port}
DOMAIN=${site.domain}
VERSION=${site.version}
ENVIRONMENT=${site.environment}

# Features
${site.features?.map((f: string) => `ENABLE_${f.toUpperCase()}=true`).join('\n') || ''}

# Security
SSL_ENABLED=${site.security?.sslEnabled || true}
ACCESS_LEVEL=${site.security?.accessLevel || 'public'}

# Auto-managed by Mother Plugin
AUTO_MANAGED=${site.autoManaged}
`
}
```

### Deployments Collection

```typescript
// collections/Deployments.ts
export const DeploymentsCollection: CollectionConfig = {
  slug: 'deployments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['site', 'version', 'status', 'startedAt', 'completedAt'],
    group: 'Platform Management'
  },
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true
    },
    {
      name: 'version',
      type: 'text',
      required: true
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' }
      ]
    },
    {
      name: 'startedAt',
      type: 'date'
    },
    {
      name: 'completedAt',
      type: 'date'
    },
    {
      name: 'log',
      type: 'textarea',
      admin: {
        rows: 10
      }
    },
    {
      name: 'changes',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Plugin Added', value: 'plugin_added' },
            { label: 'Plugin Updated', value: 'plugin_updated' },
            { label: 'Plugin Removed', value: 'plugin_removed' },
            { label: 'Configuration Changed', value: 'config_changed' },
            { label: 'Feature Enabled', value: 'feature_enabled' },
            { label: 'Feature Disabled', value: 'feature_disabled' }
          ]
        },
        {
          name: 'description',
          type: 'text'
        }
      ]
    }
  ]
}
```

## 🔧 Management Endpoints

### Site Management API

```typescript
// endpoints/site-management.ts
export const managementEndpoints = [
  {
    path: '/api/sites/scan',
    method: 'post',
    handler: async (req, res) => {
      try {
        const detector = new BusinessDetector()
        const sites = await detector.scanAppsDirectory()
        
        // Sync discovered sites to database
        for (const [name, entry] of sites) {
          await req.payload.create({
            collection: 'sites',
            data: {
              name: entry.name,
              domain: entry.domain,
              port: entry.port,
              rootPath: entry.rootPath,
              envPath: entry.envPath,
              features: entry.features,
              status: 'inactive',
              autoManaged: true
            }
          })
        }
        
        res.json({
          success: true,
          message: `Discovered and registered ${sites.size} sites`,
          sites: Array.from(sites.values())
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    }
  },
  
  {
    path: '/api/sites/:name/health',
    method: 'get',
    handler: async (req, res) => {
      try {
        const siteName = req.params.name
        const health = await performHealthCheck(siteName)
        
        // Update site health in database
        await req.payload.update({
          collection: 'sites',
          where: { name: { equals: siteName } },
          data: {
            'healthCheck.lastSeen': new Date(),
            'healthCheck.responseTime': health.responseTime,
            'healthCheck.uptime': health.uptime
          }
        })
        
        res.json(health)
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    }
  },
  
  {
    path: '/api/sites/:name/deploy',
    method: 'post',
    handler: async (req, res) => {
      try {
        const siteName = req.params.name
        const { version, changes } = req.body
        
        // Create deployment record
        const deployment = await req.payload.create({
          collection: 'deployments',
          data: {
            site: siteName,
            version,
            status: 'pending',
            changes,
            startedAt: new Date()
          }
        })
        
        // Start deployment process
        deploymentQueue.add('deploy-site', {
          deploymentId: deployment.id,
          siteName,
          version
        })
        
        res.json({
          success: true,
          deploymentId: deployment.id,
          message: 'Deployment started'
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    }
  },
  
  {
    path: '/api/sites/:name/start',
    method: 'post',
    handler: async (req, res) => {
      try {
        const siteName = req.params.name
        await startSite(siteName)
        
        await req.payload.update({
          collection: 'sites',
          where: { name: { equals: siteName } },
          data: { status: 'active' }
        })
        
        res.json({
          success: true,
          message: `Site ${siteName} started successfully`
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    }
  },
  
  {
    path: '/api/sites/:name/stop',
    method: 'post',
    handler: async (req, res) => {
      try {
        const siteName = req.params.name
        await stopSite(siteName)
        
        await req.payload.update({
          collection: 'sites',
          where: { name: { equals: siteName } },
          data: { status: 'inactive' }
        })
        
        res.json({
          success: true,
          message: `Site ${siteName} stopped successfully`
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    }
  }
]
```

## 🎛️ Platform Management Dashboard

### Admin UI Components

```typescript
// components/PlatformDashboard.tsx
export const PlatformDashboard = () => {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadSites()
  }, [])
  
  const loadSites = async () => {
    try {
      const response = await fetch('/api/sites')
      const data = await response.json()
      setSites(data.docs)
    } catch (error) {
      console.error('Failed to load sites:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const scanForSites = async () => {
    try {
      const response = await fetch('/api/sites/scan', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        await loadSites()
        toast.success(`Discovered ${data.sites.length} sites`)
      }
    } catch (error) {
      toast.error('Failed to scan for sites')
    }
  }
  
  return (
    <div className="platform-dashboard">
      <div className="dashboard-header">
        <h1>Platform Management</h1>
        <button onClick={scanForSites} className="scan-button">
          🔍 Scan for Sites
        </button>
      </div>
      
      <div className="sites-grid">
        {sites.map(site => (
          <SiteCard key={site.id} site={site} onUpdate={loadSites} />
        ))}
      </div>
      
      <div className="platform-stats">
        <StatCard title="Total Sites" value={sites.length} />
        <StatCard title="Active Sites" value={sites.filter(s => s.status === 'active').length} />
        <StatCard title="Health Issues" value={sites.filter(s => s.healthCheck?.errors?.length > 0).length} />
      </div>
    </div>
  )
}

const SiteCard = ({ site, onUpdate }) => {
  const [health, setHealth] = useState(null)
  
  const checkHealth = async () => {
    try {
      const response = await fetch(`/api/sites/${site.name}/health`)
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      console.error('Health check failed:', error)
    }
  }
  
  const toggleSite = async () => {
    const action = site.status === 'active' ? 'stop' : 'start'
    try {
      const response = await fetch(`/api/sites/${site.name}/${action}`, { method: 'POST' })
      if (response.ok) {
        onUpdate()
        toast.success(`Site ${action}ed successfully`)
      }
    } catch (error) {
      toast.error(`Failed to ${action} site`)
    }
  }
  
  return (
    <div className={`site-card status-${site.status}`}>
      <div className="site-header">
        <h3>{site.title}</h3>
        <span className={`status-badge ${site.status}`}>
          {site.status}
        </span>
      </div>
      
      <div className="site-info">
        <p><strong>Domain:</strong> {site.domain}</p>
        <p><strong>Port:</strong> {site.port}</p>
        <p><strong>Version:</strong> {site.version}</p>
        <p><strong>Features:</strong> {site.features?.join(', ') || 'None'}</p>
      </div>
      
      {health && (
        <div className="health-info">
          <p><strong>Response Time:</strong> {health.responseTime}ms</p>
          <p><strong>Uptime:</strong> {health.uptime}%</p>
        </div>
      )}
      
      <div className="site-actions">
        <button onClick={checkHealth} className="health-button">
          🏥 Health Check
        </button>
        <button onClick={toggleSite} className="toggle-button">
          {site.status === 'active' ? '⏹️ Stop' : '▶️ Start'}
        </button>
      </div>
    </div>
  )
}
```

## 🚀 Implementation Benefits

### 1. **Centralized Control**
- Single point of management for all business applications
- Unified monitoring and health checking
- Coordinated deployments and updates

### 2. **Automatic Discovery**
- Dynamic scanning of apps directory
- Automatic registration of new sites
- Self-updating site registry

### 3. **Conflict Resolution**
- Automatic port conflict detection
- Smart port assignment
- Environment validation

### 4. **Health Monitoring**
- Real-time status tracking
- Performance metrics
- Error logging and resolution

### 5. **Security Management**
- Centralized access control
- IP restrictions
- SSL management

### 6. **Deployment Orchestration**
- Coordinated rollouts
- Rollback capabilities
- Change tracking

## 🔄 Integration Workflow

### 1. **Initial Setup**
```bash
# Install the Mother Plugin with App Management
npm install @paulovila/mother-plugin

# The plugin automatically:
# - Scans apps directory
# - Registers discovered sites
# - Resolves port conflicts
# - Creates central database
```

### 2. **Site Registration**
```typescript
// Sites are automatically registered when discovered
// Manual registration is also possible via API
await fetch('/api/sites', {
  method: 'POST',
  body: JSON.stringify({
    name: 'new-business',
    domain: 'new-business.paulovila.org',
    port: 3008,
    features: ['trading', 'analytics']
  })
})
```

### 3. **Health Monitoring**
```typescript
// Automatic health checks every 5 minutes
// Manual health checks via API
const health = await fetch('/api/sites/intellitrade/health')
```

### 4. **Deployment Management**
```typescript
// Deploy new version
await fetch('/api/sites/intellitrade/deploy', {
  method: 'POST',
  body: JSON.stringify({
    version: '2.1.0',
    changes: [
      { type: 'plugin_added', description: 'Added KYC plugin' }
    ]
  })
})
```

This App Management Plugin transforms the Mother Plugin into a complete platform orchestrator, providing the centralized control and automatic management you envisioned. The system becomes truly self-managing and eliminates the need for hardcoded configurations.
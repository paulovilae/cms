const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Database path - the actual database being used by the application
const dbPath = path.join(__dirname, '../../databases/dev.db')

console.log('🚀 Migrating dev.db to Enhanced AI Providers Schema')
console.log('📁 Database:', dbPath)

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message)
    process.exit(1)
  }
  console.log('✅ Connected to SQLite database')
})

// Function to run SQL commands
const runSQL = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(this)
      }
    })
  })
}

// Function to get data
const getSQL = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

async function migrateDevDatabase() {
  try {
    console.log('🔍 Checking current ai_providers table structure...')

    // Get existing data first
    const existingData = await getSQL('SELECT * FROM ai_providers')
    console.log(`📊 Found ${existingData.length} existing AI providers`)

    // Backup existing table
    console.log('📦 Creating backup of existing data...')
    await runSQL('DROP TABLE IF EXISTS ai_providers_backup')
    await runSQL('ALTER TABLE ai_providers RENAME TO ai_providers_backup')

    // Create enhanced table
    console.log('🏗️  Creating enhanced ai_providers table...')
    await runSQL(`
      CREATE TABLE ai_providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        
        -- Basic Information (matching our plugin field names exactly)
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        baseUrl TEXT,
        apiKey TEXT,
        description TEXT,
        status TEXT DEFAULT 'active',
        
        -- Capabilities
        supportsImages BOOLEAN DEFAULT FALSE,
        supportsComputerUse BOOLEAN DEFAULT FALSE,
        supportsPromptCaching BOOLEAN DEFAULT FALSE,
        supportsFunctionCalling BOOLEAN DEFAULT FALSE,
        supportsStreaming BOOLEAN DEFAULT TRUE,
        supportsVision BOOLEAN DEFAULT FALSE,
        
        -- Pricing (in cents per 1M tokens)
        inputPriceCents INTEGER,
        outputPriceCents INTEGER,
        cacheReadsPriceCents INTEGER,
        cacheWritesPriceCents INTEGER,
        
        -- Model Configuration
        availableModels TEXT,
        model TEXT,
        maxOutputTokens INTEGER DEFAULT 4096,
        contextWindow INTEGER DEFAULT 4096,
        
        -- Advanced Parameters
        temperature REAL DEFAULT 0.7,
        topP REAL DEFAULT 1.0,
        topK INTEGER,
        frequencyPenalty REAL DEFAULT 0.0,
        presencePenalty REAL DEFAULT 0.0,
        
        -- Connection Testing
        connectionStatus TEXT DEFAULT 'disconnected',
        lastTestDate DATETIME,
        lastTestError TEXT,
        responseTimeMs INTEGER,
        testEndpoint TEXT,
        autoTestOnSave BOOLEAN DEFAULT TRUE,
        
        -- Metadata
        website TEXT,
        documentation TEXT,
        supportContact TEXT,
        version TEXT,
        tags TEXT,
        
        -- Timestamps
        updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
      )
    `)

    // Create indexes
    await runSQL('CREATE INDEX ai_providers_updated_at_idx ON ai_providers (updated_at)')
    await runSQL('CREATE INDEX ai_providers_created_at_idx ON ai_providers (created_at)')

    console.log('📝 Migrating existing data to enhanced schema...')

    // Migrate existing data
    for (const row of existingData) {
      // Map old fields to new enhanced fields
      const enhancedData = {
        id: row.id,
        name: row.name,
        provider: row.provider,
        baseUrl: row.base_url,
        apiKey: row.api_key,
        description: row.description,
        status: row.status,

        // Set capabilities based on provider
        supportsImages: getCapabilityByProvider(row.provider, 'images'),
        supportsComputerUse: getCapabilityByProvider(row.provider, 'computerUse'),
        supportsPromptCaching: getCapabilityByProvider(row.provider, 'caching'),
        supportsFunctionCalling: getCapabilityByProvider(row.provider, 'functions'),
        supportsStreaming: true,
        supportsVision: getCapabilityByProvider(row.provider, 'vision'),

        // Set pricing based on provider
        inputPriceCents: getPricingByProvider(row.provider, 'input'),
        outputPriceCents: getPricingByProvider(row.provider, 'output'),
        cacheReadsPriceCents: getPricingByProvider(row.provider, 'cacheReads'),
        cacheWritesPriceCents: getPricingByProvider(row.provider, 'cacheWrites'),

        // Model configuration
        availableModels: null,
        model: row.model || getDefaultModel(row.provider),
        maxOutputTokens: row.max_tokens || 4096,
        contextWindow: getContextWindow(row.provider),

        // Advanced parameters
        temperature: row.temperature || 0.7,
        topP: 1.0,
        topK: null,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,

        // Connection testing
        connectionStatus: 'disconnected',
        lastTestDate: null,
        lastTestError: null,
        responseTimeMs: null,
        testEndpoint: null,
        autoTestOnSave: true,

        // Metadata
        website: getWebsiteByProvider(row.provider),
        documentation: getDocumentationByProvider(row.provider),
        supportContact: null,
        version: null,
        tags: getTagsByProvider(row.provider),

        // Timestamps
        updated_at: row.updated_at,
        created_at: row.created_at,
      }

      // Insert migrated data
      const columns = Object.keys(enhancedData).join(', ')
      const placeholders = Object.keys(enhancedData)
        .map(() => '?')
        .join(', ')
      const values = Object.values(enhancedData)

      await runSQL(`INSERT INTO ai_providers (${columns}) VALUES (${placeholders})`, values)
    }

    console.log(`✅ Successfully migrated ${existingData.length} AI providers`)

    // Add some enhanced default providers if none exist
    if (existingData.length === 0) {
      console.log('📝 Adding enhanced default providers...')
      await addDefaultProviders()
    }

    console.log('🗑️  Cleaning up backup table...')
    await runSQL('DROP TABLE ai_providers_backup')

    console.log('✅ Enhanced AI Providers schema migration completed successfully!')
    console.log('📊 New capabilities added:')
    console.log('   • Comprehensive capability tracking')
    console.log('   • Detailed pricing information')
    console.log('   • Advanced parameter configuration')
    console.log('   • Connection testing and monitoring')
    console.log('   • Rich metadata and documentation links')
  } catch (error) {
    console.error('❌ Error during migration:', error.message)
    process.exit(1)
  } finally {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message)
      } else {
        console.log('📝 Database connection closed')
      }
    })
  }
}

async function addDefaultProviders() {
  const enhancedProviders = [
    {
      name: 'OpenAI GPT-4',
      provider: 'openai',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      description: 'OpenAI GPT-4 model with advanced capabilities',
      supportsImages: true,
      supportsFunctionCalling: true,
      supportsVision: true,
      supportsStreaming: true,
      inputPriceCents: 300,
      outputPriceCents: 1500,
      maxOutputTokens: 4096,
      contextWindow: 8192,
      website: 'https://openai.com',
      documentation: 'https://platform.openai.com/docs',
      tags: '["commercial", "advanced", "multimodal"]',
    },
    {
      name: 'Anthropic Claude 3.5 Sonnet',
      provider: 'anthropic',
      baseUrl: 'https://api.anthropic.com',
      model: 'claude-3-5-sonnet-20241022',
      description: 'Anthropic Claude with computer use and advanced reasoning',
      supportsImages: true,
      supportsComputerUse: true,
      supportsFunctionCalling: true,
      supportsVision: true,
      supportsPromptCaching: true,
      supportsStreaming: true,
      inputPriceCents: 300,
      outputPriceCents: 1500,
      cacheReadsPriceCents: 30,
      cacheWritesPriceCents: 375,
      maxOutputTokens: 8192,
      contextWindow: 200000,
      website: 'https://anthropic.com',
      documentation: 'https://docs.anthropic.com',
      tags: '["commercial", "advanced", "computer-use", "caching"]',
    },
    {
      name: 'Local Ollama',
      provider: 'ollama',
      baseUrl: 'http://localhost:11434',
      model: 'llama2',
      description: 'Local Ollama instance for privacy-focused AI',
      supportsStreaming: true,
      inputPriceCents: 0,
      outputPriceCents: 0,
      maxOutputTokens: 2048,
      contextWindow: 4096,
      status: 'inactive',
      website: 'https://ollama.ai',
      documentation: 'https://github.com/ollama/ollama',
      tags: '["local", "privacy", "free"]',
    },
  ]

  for (const provider of enhancedProviders) {
    const columns = Object.keys(provider).join(', ')
    const placeholders = Object.keys(provider)
      .map(() => '?')
      .join(', ')
    const values = Object.values(provider)

    await runSQL(`INSERT INTO ai_providers (${columns}) VALUES (${placeholders})`, values)
  }

  console.log('✅ Enhanced default providers added successfully!')
}

// Helper functions
function getCapabilityByProvider(provider, capability) {
  const capabilities = {
    openai: {
      images: true,
      computerUse: false,
      caching: false,
      functions: true,
      vision: true,
    },
    anthropic: {
      images: true,
      computerUse: true,
      caching: true,
      functions: true,
      vision: true,
    },
    google: {
      images: true,
      computerUse: false,
      caching: false,
      functions: true,
      vision: true,
    },
    azure: {
      images: true,
      computerUse: false,
      caching: false,
      functions: true,
      vision: true,
    },
    ollama: {
      images: false,
      computerUse: false,
      caching: false,
      functions: false,
      vision: false,
    },
    lmstudio: {
      images: false,
      computerUse: false,
      caching: false,
      functions: false,
      vision: false,
    },
  }

  return capabilities[provider]?.[capability] || false
}

function getPricingByProvider(provider, priceType) {
  const pricing = {
    openai: { input: 300, output: 1500, cacheReads: null, cacheWrites: null },
    anthropic: { input: 300, output: 1500, cacheReads: 30, cacheWrites: 375 },
    google: { input: 125, output: 375, cacheReads: null, cacheWrites: null },
    azure: { input: 300, output: 1500, cacheReads: null, cacheWrites: null },
    ollama: { input: 0, output: 0, cacheReads: null, cacheWrites: null },
    lmstudio: { input: 0, output: 0, cacheReads: null, cacheWrites: null },
  }

  return pricing[provider]?.[priceType] || null
}

function getDefaultModel(provider) {
  const models = {
    openai: 'gpt-4',
    anthropic: 'claude-3-5-sonnet-20241022',
    google: 'gemini-pro',
    azure: 'gpt-4',
    ollama: 'llama2',
    lmstudio: 'llama2',
  }

  return models[provider] || 'gpt-4'
}

function getContextWindow(provider) {
  const windows = {
    openai: 8192,
    anthropic: 200000,
    google: 32768,
    azure: 8192,
    ollama: 4096,
    lmstudio: 4096,
  }

  return windows[provider] || 4096
}

function getWebsiteByProvider(provider) {
  const websites = {
    openai: 'https://openai.com',
    anthropic: 'https://anthropic.com',
    google: 'https://ai.google.dev',
    azure: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
    ollama: 'https://ollama.ai',
    lmstudio: 'https://lmstudio.ai',
  }

  return websites[provider] || ''
}

function getDocumentationByProvider(provider) {
  const docs = {
    openai: 'https://platform.openai.com/docs',
    anthropic: 'https://docs.anthropic.com',
    google: 'https://ai.google.dev/docs',
    azure: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
    ollama: 'https://github.com/ollama/ollama',
    lmstudio: 'https://lmstudio.ai/docs',
  }

  return docs[provider] || ''
}

function getTagsByProvider(provider) {
  const tags = {
    openai: '["commercial", "advanced", "multimodal"]',
    anthropic: '["commercial", "advanced", "computer-use", "caching"]',
    google: '["commercial", "multimodal", "fast"]',
    azure: '["commercial", "enterprise", "microsoft"]',
    ollama: '["local", "privacy", "free"]',
    lmstudio: '["local", "privacy", "gui"]',
  }

  return tags[provider] || '[]'
}

// Run the migration
migrateDevDatabase()

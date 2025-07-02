const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Database path
const dbPath = path.join(__dirname, '../../cms.db')

console.log('🔄 AI Providers Schema Migration - Existing to Enhanced')
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

async function migrateAIProvidersSchema() {
  try {
    console.log('🔍 Checking current ai_providers table structure...')

    // Get current table structure
    const tableInfo = await getSQL('PRAGMA table_info(ai_providers)')
    if (tableInfo.length === 0) {
      console.log('⚠️  ai_providers table does not exist. Creating enhanced table...')
      await createEnhancedTable()
      return
    }

    console.log('📋 Current table structure detected')
    console.log('   Fields:', tableInfo.map((col) => col.name).join(', '))

    // Check if this is the old schema or new schema
    const hasOldSchema = tableInfo.some((col) => col.name === 'provider_type')
    const hasNewSchema = tableInfo.some((col) => col.name === 'supportsImages')

    if (hasNewSchema) {
      console.log('✅ Enhanced schema already exists. No migration needed.')
      return
    }

    if (hasOldSchema) {
      console.log('🔄 Migrating from old schema to enhanced schema...')
      await migrateFromOldSchema()
    } else {
      console.log('🔄 Unknown schema detected. Creating enhanced table...')
      await createEnhancedTable()
    }

    console.log('✅ AI Providers schema migration completed successfully!')
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

async function migrateFromOldSchema() {
  console.log('📦 Backing up existing data...')

  // Get existing data
  const existingData = await getSQL('SELECT * FROM ai_providers')
  console.log(`📊 Found ${existingData.length} existing AI providers`)

  // Create new enhanced table
  console.log('🏗️  Creating enhanced ai_providers table...')

  // Drop existing table and create new one
  await runSQL('DROP TABLE IF EXISTS ai_providers_backup')
  await runSQL('ALTER TABLE ai_providers RENAME TO ai_providers_backup')

  // Create enhanced table
  await runSQL(`
    CREATE TABLE ai_providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      
      -- Basic Information
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
      slug TEXT,
      slugLock BOOLEAN DEFAULT TRUE,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create indexes
  await runSQL('CREATE INDEX ai_providers_slug_idx ON ai_providers (slug)')
  await runSQL('CREATE INDEX ai_providers_updated_at_idx ON ai_providers (updated_at)')
  await runSQL('CREATE INDEX ai_providers_created_at_idx ON ai_providers (created_at)')

  console.log('📝 Migrating existing data to enhanced schema...')

  // Migrate existing data with field mapping
  for (const row of existingData) {
    // Map old fields to new fields
    const mappedData = {
      id: row.id,
      name: row.name || 'Unnamed Provider',
      provider: mapProviderType(row.provider_type),
      baseUrl: row.base_url || '',
      apiKey: '', // API keys not stored in old schema
      description: row.description || '',
      status: row.status || 'active',

      // Set capabilities based on provider type
      supportsImages: getCapabilityByProvider(row.provider_type, 'images'),
      supportsComputerUse: getCapabilityByProvider(row.provider_type, 'computerUse'),
      supportsPromptCaching: getCapabilityByProvider(row.provider_type, 'caching'),
      supportsFunctionCalling: getCapabilityByProvider(row.provider_type, 'functions'),
      supportsStreaming: true,
      supportsVision: getCapabilityByProvider(row.provider_type, 'vision'),

      // Set pricing based on provider type
      inputPriceCents: getPricingByProvider(row.provider_type, 'input'),
      outputPriceCents: getPricingByProvider(row.provider_type, 'output'),
      cacheReadsPriceCents: getPricingByProvider(row.provider_type, 'cacheReads'),
      cacheWritesPriceCents: getPricingByProvider(row.provider_type, 'cacheWrites'),

      // Model configuration
      availableModels: null,
      model: getDefaultModel(row.provider_type),
      maxOutputTokens: 4096,
      contextWindow: getContextWindow(row.provider_type),

      // Advanced parameters
      temperature: 0.7,
      topP: 1.0,
      topK: null,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,

      // Connection testing
      connectionStatus: row.connection_test_last_test_status || 'disconnected',
      lastTestDate: row.connection_test_last_test_date || null,
      lastTestError: row.connection_test_last_test_error || null,
      responseTimeMs: null,
      testEndpoint: row.connection_test_test_endpoint || null,
      autoTestOnSave: true,

      // Metadata
      website: row.metadata_website || '',
      documentation: row.documentation || '',
      supportContact: row.metadata_support_contact || '',
      version: row.metadata_version || '',
      tags: null,

      // Timestamps
      slug: row.slug,
      slugLock: row.slug_lock !== 0,
      updated_at: row.updated_at,
      created_at: row.created_at,
    }

    // Insert migrated data
    const columns = Object.keys(mappedData).join(', ')
    const placeholders = Object.keys(mappedData)
      .map(() => '?')
      .join(', ')
    const values = Object.values(mappedData)

    await runSQL(`INSERT INTO ai_providers (${columns}) VALUES (${placeholders})`, values)
  }

  console.log(`✅ Successfully migrated ${existingData.length} AI providers`)
  console.log('🗑️  Cleaning up backup table...')
  await runSQL('DROP TABLE ai_providers_backup')
}

async function createEnhancedTable() {
  console.log('🏗️  Creating enhanced ai_providers table from scratch...')

  await runSQL('DROP TABLE IF EXISTS ai_providers')

  await runSQL(`
    CREATE TABLE ai_providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      
      -- Basic Information
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
      slug TEXT,
      slugLock BOOLEAN DEFAULT TRUE,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create indexes
  await runSQL('CREATE INDEX ai_providers_slug_idx ON ai_providers (slug)')
  await runSQL('CREATE INDEX ai_providers_updated_at_idx ON ai_providers (updated_at)')
  await runSQL('CREATE INDEX ai_providers_created_at_idx ON ai_providers (created_at)')

  console.log('✅ Enhanced ai_providers table created successfully!')

  // Add some default enhanced providers
  console.log('📝 Adding enhanced default providers...')

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

    await runSQL(
      `INSERT INTO ai_providers (${columns}, created_at, updated_at) VALUES (${placeholders}, datetime('now'), datetime('now'))`,
      values,
    )
  }

  console.log('✅ Enhanced default providers added successfully!')
}

// Helper functions for mapping old schema to new schema
function mapProviderType(oldType) {
  const mapping = {
    openai: 'openai',
    anthropic: 'anthropic',
    google: 'google',
    'azure-openai': 'azure',
    ollama: 'ollama',
    'lm-studio': 'lmstudio',
  }
  return mapping[oldType] || 'openai'
}

function getCapabilityByProvider(providerType, capability) {
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
    'azure-openai': {
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
    'lm-studio': {
      images: false,
      computerUse: false,
      caching: false,
      functions: false,
      vision: false,
    },
  }

  return capabilities[providerType]?.[capability] || false
}

function getPricingByProvider(providerType, priceType) {
  const pricing = {
    openai: { input: 300, output: 1500, cacheReads: null, cacheWrites: null },
    anthropic: { input: 300, output: 1500, cacheReads: 30, cacheWrites: 375 },
    google: { input: 125, output: 375, cacheReads: null, cacheWrites: null },
    'azure-openai': { input: 300, output: 1500, cacheReads: null, cacheWrites: null },
    ollama: { input: 0, output: 0, cacheReads: null, cacheWrites: null },
    'lm-studio': { input: 0, output: 0, cacheReads: null, cacheWrites: null },
  }

  return pricing[providerType]?.[priceType] || null
}

function getDefaultModel(providerType) {
  const models = {
    openai: 'gpt-4',
    anthropic: 'claude-3-5-sonnet-20241022',
    google: 'gemini-pro',
    'azure-openai': 'gpt-4',
    ollama: 'llama2',
    'lm-studio': 'llama2',
  }

  return models[providerType] || 'gpt-4'
}

function getContextWindow(providerType) {
  const windows = {
    openai: 8192,
    anthropic: 200000,
    google: 32768,
    'azure-openai': 8192,
    ollama: 4096,
    'lm-studio': 4096,
  }

  return windows[providerType] || 4096
}

// Run the migration
migrateAIProvidersSchema()

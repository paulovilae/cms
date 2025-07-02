const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Database path - adjust based on your setup
const dbPath = path.join(__dirname, '../../cms.db')

console.log('🚀 Enhanced AI Providers Schema Migration - Phase 1')
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

// Function to check if column exists
const columnExists = async (tableName, columnName) => {
  try {
    const tableInfo = await getSQL(`PRAGMA table_info(${tableName})`)
    return tableInfo.some((col) => col.name === columnName)
  } catch (error) {
    return false
  }
}

async function enhanceAIProvidersSchema() {
  try {
    console.log('🔍 Checking ai_providers table structure...')

    // Check if table exists
    const tableExists = await getSQL(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='ai_providers'",
    )
    if (tableExists.length === 0) {
      console.log('⚠️  ai_providers table does not exist. Creating with enhanced schema...')
      await createEnhancedTable()
      return
    }

    console.log('📋 Table exists. Adding new columns for enhanced features...')

    // Capabilities columns
    const capabilityColumns = [
      {
        name: 'supportsImages',
        type: 'BOOLEAN DEFAULT FALSE',
        description: 'Image processing capability',
      },
      {
        name: 'supportsComputerUse',
        type: 'BOOLEAN DEFAULT FALSE',
        description: 'Computer use capability',
      },
      {
        name: 'supportsPromptCaching',
        type: 'BOOLEAN DEFAULT FALSE',
        description: 'Prompt caching capability',
      },
      {
        name: 'supportsFunctionCalling',
        type: 'BOOLEAN DEFAULT FALSE',
        description: 'Function calling capability',
      },
      {
        name: 'supportsStreaming',
        type: 'BOOLEAN DEFAULT TRUE',
        description: 'Streaming capability',
      },
      { name: 'supportsVision', type: 'BOOLEAN DEFAULT FALSE', description: 'Vision capability' },
    ]

    // Pricing columns (stored as cents to avoid floating point issues)
    const pricingColumns = [
      {
        name: 'inputPriceCents',
        type: 'INTEGER',
        description: 'Input price in cents per 1M tokens',
      },
      {
        name: 'outputPriceCents',
        type: 'INTEGER',
        description: 'Output price in cents per 1M tokens',
      },
      {
        name: 'cacheReadsPriceCents',
        type: 'INTEGER',
        description: 'Cache reads price in cents per 1M tokens',
      },
      {
        name: 'cacheWritesPriceCents',
        type: 'INTEGER',
        description: 'Cache writes price in cents per 1M tokens',
      },
    ]

    // Model configuration columns
    const modelColumns = [
      { name: 'availableModels', type: 'TEXT', description: 'JSON array of available models' },
      {
        name: 'maxOutputTokens',
        type: 'INTEGER DEFAULT 4096',
        description: 'Maximum output tokens',
      },
      { name: 'contextWindow', type: 'INTEGER DEFAULT 4096', description: 'Context window size' },
    ]

    // Advanced parameters columns
    const parameterColumns = [
      { name: 'topP', type: 'REAL DEFAULT 1.0', description: 'Top P parameter' },
      { name: 'topK', type: 'INTEGER', description: 'Top K parameter' },
      {
        name: 'frequencyPenalty',
        type: 'REAL DEFAULT 0.0',
        description: 'Frequency penalty parameter',
      },
      {
        name: 'presencePenalty',
        type: 'REAL DEFAULT 0.0',
        description: 'Presence penalty parameter',
      },
    ]

    // Connection testing columns
    const connectionColumns = [
      {
        name: 'connectionStatus',
        type: 'TEXT DEFAULT "disconnected"',
        description: 'Connection status',
      },
      { name: 'lastTestDate', type: 'DATETIME', description: 'Last connection test date' },
      { name: 'lastTestError', type: 'TEXT', description: 'Last connection test error' },
      { name: 'responseTimeMs', type: 'INTEGER', description: 'Response time in milliseconds' },
      { name: 'testEndpoint', type: 'TEXT', description: 'Test endpoint URL' },
      {
        name: 'autoTestOnSave',
        type: 'BOOLEAN DEFAULT TRUE',
        description: 'Auto test on save flag',
      },
    ]

    // Metadata columns
    const metadataColumns = [
      { name: 'website', type: 'TEXT', description: 'Official website URL' },
      { name: 'documentation', type: 'TEXT', description: 'API documentation URL' },
      { name: 'supportContact', type: 'TEXT', description: 'Support contact information' },
      { name: 'version', type: 'TEXT', description: 'API or model version' },
      { name: 'tags', type: 'TEXT', description: 'JSON array of tags' },
    ]

    // Combine all columns
    const allColumns = [
      ...capabilityColumns,
      ...pricingColumns,
      ...modelColumns,
      ...parameterColumns,
      ...connectionColumns,
      ...metadataColumns,
    ]

    // Add columns that don't exist
    for (const column of allColumns) {
      const exists = await columnExists('ai_providers', column.name)
      if (!exists) {
        console.log(`➕ Adding column: ${column.name} (${column.description})`)
        await runSQL(`ALTER TABLE ai_providers ADD COLUMN ${column.name} ${column.type}`)
      } else {
        console.log(`✅ Column ${column.name} already exists`)
      }
    }

    console.log('🔄 Updating existing records with default values...')

    // Update existing records with sensible defaults based on provider type
    await runSQL(`
      UPDATE ai_providers 
      SET 
        supportsStreaming = TRUE,
        maxOutputTokens = COALESCE(maxTokens, 4096),
        contextWindow = COALESCE(maxTokens, 4096),
        topP = 1.0,
        frequencyPenalty = 0.0,
        presencePenalty = 0.0,
        connectionStatus = 'disconnected',
        autoTestOnSave = TRUE
      WHERE supportsStreaming IS NULL
    `)

    // Set provider-specific capabilities
    await runSQL(`
      UPDATE ai_providers 
      SET 
        supportsImages = TRUE,
        supportsFunctionCalling = TRUE,
        supportsVision = TRUE,
        inputPriceCents = 300,
        outputPriceCents = 1500,
        website = 'https://openai.com',
        documentation = 'https://platform.openai.com/docs'
      WHERE provider = 'openai' AND supportsImages IS NULL
    `)

    await runSQL(`
      UPDATE ai_providers 
      SET 
        supportsImages = TRUE,
        supportsComputerUse = TRUE,
        supportsFunctionCalling = TRUE,
        supportsVision = TRUE,
        supportsPromptCaching = TRUE,
        inputPriceCents = 300,
        outputPriceCents = 1500,
        cacheReadsPriceCents = 30,
        cacheWritesPriceCents = 375,
        website = 'https://anthropic.com',
        documentation = 'https://docs.anthropic.com'
      WHERE provider = 'anthropic' AND supportsImages IS NULL
    `)

    await runSQL(`
      UPDATE ai_providers 
      SET 
        supportsImages = TRUE,
        supportsFunctionCalling = TRUE,
        supportsVision = TRUE,
        inputPriceCents = 125,
        outputPriceCents = 375,
        website = 'https://ai.google.dev',
        documentation = 'https://ai.google.dev/docs'
      WHERE provider = 'google' AND supportsImages IS NULL
    `)

    await runSQL(`
      UPDATE ai_providers 
      SET 
        supportsImages = FALSE,
        supportsFunctionCalling = FALSE,
        supportsVision = FALSE,
        inputPriceCents = 0,
        outputPriceCents = 0,
        website = 'https://ollama.ai',
        documentation = 'https://github.com/ollama/ollama'
      WHERE provider IN ('ollama', 'lmstudio') AND supportsImages IS NULL
    `)

    console.log('✅ Enhanced AI Providers schema migration completed successfully!')
    console.log('📊 New capabilities added:')
    console.log('   • Comprehensive capability tracking')
    console.log('   • Detailed pricing information')
    console.log('   • Advanced parameter configuration')
    console.log('   • Connection testing and monitoring')
    console.log('   • Rich metadata and documentation links')
  } catch (error) {
    console.error('❌ Error enhancing schema:', error.message)
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

async function createEnhancedTable() {
  console.log('🏗️  Creating ai_providers table with enhanced schema...')

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
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

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

// Run the migration
enhanceAIProvidersSchema()

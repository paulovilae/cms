const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Database path
const dbPath = path.join(__dirname, 'databases', 'dev.db')

console.log('🔧 Fixing AI Providers schema conflict (corrected version)...')
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

async function fixAIProvidersSchema() {
  try {
    console.log('🔍 Checking ai_providers table...')

    // Check if table exists and get its structure
    const tableInfo = await getSQL('PRAGMA table_info(ai_providers)')
    if (tableInfo.length > 0) {
      console.log(
        '📋 Current table structure:',
        tableInfo.map((col) => col.name),
      )

      console.log('🗑️  Dropping existing ai_providers table...')
      await runSQL('DROP TABLE IF EXISTS ai_providers')
    }

    // Create the table with the EXACT schema that Payload expects
    console.log('🏗️  Creating new ai_providers table with correct Payload schema...')
    await runSQL(`
      CREATE TABLE ai_providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        baseUrl TEXT,
        apiKey TEXT,
        model TEXT,
        maxTokens INTEGER,
        temperature REAL,
        status TEXT DEFAULT 'active',
        description TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ AI Providers table recreated successfully!')

    // Add default AI providers with the correct field names
    console.log('📝 Adding default AI providers...')

    const defaultProviders = [
      {
        name: 'OpenAI GPT-4',
        provider: 'openai',
        baseUrl: 'https://api.openai.com/v1',
        apiKey: '',
        model: 'gpt-4',
        maxTokens: 4096,
        temperature: 0.7,
        status: 'active',
        description: 'OpenAI GPT-4 model for advanced AI capabilities',
      },
      {
        name: 'Anthropic Claude',
        provider: 'anthropic',
        baseUrl: 'https://api.anthropic.com',
        apiKey: '',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4096,
        temperature: 0.7,
        status: 'active',
        description: 'Anthropic Claude model for conversational AI',
      },
      {
        name: 'Local Ollama',
        provider: 'ollama',
        baseUrl: 'http://localhost:11434',
        apiKey: null,
        model: 'llama2',
        maxTokens: 2048,
        temperature: 0.7,
        status: 'inactive',
        description: 'Local Ollama instance for privacy-focused AI',
      },
    ]

    for (const provider of defaultProviders) {
      await runSQL(
        `
        INSERT INTO ai_providers (name, provider, baseUrl, apiKey, model, maxTokens, temperature, status, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
        [
          provider.name,
          provider.provider,
          provider.baseUrl,
          provider.apiKey,
          provider.model,
          provider.maxTokens,
          provider.temperature,
          provider.status,
          provider.description,
        ],
      )
    }

    console.log('✅ Default providers added successfully!')
    console.log('🎉 Schema fix completed!')
  } catch (error) {
    console.error('❌ Error fixing schema:', error.message)
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

// Run the fix
fixAIProvidersSchema()

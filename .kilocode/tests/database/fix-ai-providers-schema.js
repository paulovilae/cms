#!/usr/bin/env node

/**
 * Fix AI Providers Schema Conflict
 *
 * This script resolves the schema conflict in the ai_providers table
 * where multiple columns are trying to rename to "provider".
 */

import sqlite3 from 'sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'databases', 'dev.db')

console.log('🔧 Fixing AI Providers schema conflict...')
console.log(`📁 Database: ${dbPath}`)

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message)
    process.exit(1)
  }
  console.log('✅ Connected to SQLite database')
})

// Function to run SQL commands
function runSQL(sql, params = []) {
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

// Function to get table info
function getTableInfo(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

async function fixSchema() {
  try {
    // Check if ai_providers table exists
    console.log('🔍 Checking ai_providers table...')

    const tableInfo = await getTableInfo('ai_providers')
    console.log(
      '📋 Current table structure:',
      tableInfo.map((col) => col.name),
    )

    // Drop the problematic table and recreate it with the correct schema
    console.log('🗑️  Dropping existing ai_providers table...')
    await runSQL('DROP TABLE IF EXISTS ai_providers')

    console.log('🏗️  Creating new ai_providers table with correct schema...')
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
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ AI Providers table recreated successfully!')

    // Insert some default providers
    console.log('📝 Adding default AI providers...')

    const defaultProviders = [
      {
        name: 'OpenAI GPT-4',
        provider: 'openai',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        maxTokens: 4096,
        temperature: 0.7,
        status: 'active',
        description: 'OpenAI GPT-4 model for high-quality text generation',
      },
      {
        name: 'Anthropic Claude',
        provider: 'anthropic',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4096,
        temperature: 0.7,
        status: 'active',
        description: 'Anthropic Claude for safe and helpful AI assistance',
      },
    ]

    for (const provider of defaultProviders) {
      await runSQL(
        `
        INSERT INTO ai_providers (name, provider, baseUrl, model, maxTokens, temperature, status, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          provider.name,
          provider.provider,
          provider.baseUrl,
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
fixSchema()

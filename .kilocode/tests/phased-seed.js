/**
 * IntelliTrade CMS - Phased Seed Script
 *
 * This script seeds the database in phases to help identify specific issues.
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

// Server URL from environment or default
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
const email = process.env.SEED_EMAIL || 'test@test.com'
const password = process.env.SEED_PASSWORD || 'Test12345%'

// Global variables
let authCookies = null

/**
 * Login to get authentication cookies
 */
async function login() {
  console.log('🔑 Logging in with credentials...')

  try {
    const loginResponse = await fetch(`${serverURL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text()
      throw new Error(`Login failed with status ${loginResponse.status}: ${errorText}`)
    }

    // Extract cookies from the login response
    authCookies = loginResponse.headers.get('set-cookie')
    console.log('✅ Authentication successful')
    return true
  } catch (error) {
    console.error('❌ Authentication failed:', error.message)
    return false
  }
}

/**
 * Run a specific seeding phase
 */
async function runPhase(phase) {
  if (!authCookies) {
    console.error('❌ Not authenticated. Run login() first.')
    return false
  }

  console.log(`📦 Running seeding phase: ${phase}...`)

  try {
    const response = await fetch(`${serverURL}/next/seed?phase=${phase}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookies,
      },
    })

    let result
    try {
      // Try to parse as JSON first
      result = await response.json()
    } catch (e) {
      // If not JSON, get as text
      result = await response.text()
    }

    if (!response.ok) {
      console.error(`❌ Phase ${phase} failed with status ${response.status}:`)
      console.error(typeof result === 'string' ? result : JSON.stringify(result, null, 2))
      return false
    }

    console.log(`✅ Phase ${phase} completed successfully`)
    console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2))
    return true
  } catch (error) {
    console.error(`❌ Error in phase ${phase}:`, error.message)
    return false
  }
}

/**
 * Main function to run all phases in sequence
 */
async function runPhasedSeed() {
  console.log('┌──────────────────────────────────────────────────┐')
  console.log('│       IntelliTrade CMS - Phased Database Seed    │')
  console.log('└──────────────────────────────────────────────────┘')
  console.log('')

  // Login first
  if (!(await login())) {
    console.error('❌ Cannot proceed without authentication')
    process.exit(1)
  }

  // Updated phases to match the consolidated API phases
  const phases = [
    'clear', // Clear collections and globals
    'basic', // Create demo author and categories
    'media', // Seed basic media
    'custom', // Seed team members, features, testimonials, pricing plans
    'business', // Seed business data (companies, routes, transactions, contracts, AI providers, Salarium)
  ]

  console.log('\n--- Starting Phased Seeding ---\n')

  let results = {}
  let allSuccess = true

  for (const phase of phases) {
    const success = await runPhase(phase)
    results[phase] = success ? 'SUCCESS' : 'FAILED'

    if (!success) {
      allSuccess = false
      console.error(`\n❌ Stopping at failed phase: ${phase}`)
      break
    }
  }

  console.log('\n--- Phased Seeding Results ---')
  for (const phase in results) {
    const status = results[phase] === 'SUCCESS' ? '✅' : '❌'
    console.log(`${status} ${phase.padEnd(15)}: ${results[phase]}`)
  }

  if (allSuccess) {
    console.log('\n✅ All seeding phases completed successfully!')
  } else {
    console.error('\n❌ Seeding process stopped due to errors')
    process.exit(1)
  }
}

// Run the phased seeding process
runPhasedSeed()

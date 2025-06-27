/**
 * IntelliTrade CMS - Database Seed Script
 *
 * This script makes a request to the Next.js API route for seeding the database.
 * It assumes the Payload server is running in development mode.
 *
 * Usage: node seed-script.js
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

// Server URL from environment or default
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'

/**
 * Runs the database seeding process
 */
async function seedDatabase() {
  console.log('┌──────────────────────────────────────────────────┐')
  console.log('│           IntelliTrade CMS - Database Seed       │')
  console.log('└──────────────────────────────────────────────────┘')
  console.log('')

  try {
    console.log(`🚀 Connecting to Payload CMS at ${serverURL}...`)
    console.log('Make sure the development server is running (npm run dev)')
    console.log('')

    // First, login with the test credentials to get the auth cookie
    console.log('🔑 Logging in with test credentials...')
    const loginResponse = await fetch(`${serverURL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test',
      }),
    })

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text()
      throw new Error(`Login failed with status ${loginResponse.status}: ${errorText}`)
    }

    console.log('✅ Authentication successful')

    // Extract cookies from the login response
    const cookies = loginResponse.headers.get('set-cookie')

    // Request to the seed API endpoint
    console.log('📋 Starting database seeding process...')
    const response = await fetch(`${serverURL}/next/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies, // Pass the authentication cookies
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Seed API returned ${response.status}: ${errorText}`)
    }

    const result = await response.json()

    console.log('')
    console.log('✅ Database seeding completed successfully!')
    console.log('')
    console.log(result.message || 'All collections seeded.')
    console.log('')

    // Success
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during seeding process:')
    console.error(error)

    console.log('')
    console.error('Make sure:')
    console.error('1. The development server is running (npm run dev)')
    console.error('2. The server URL is correct (env NEXT_PUBLIC_SERVER_URL)')
    console.error('3. You have a user with email "test@test.com" and password "test"')
    console.log('')

    process.exit(1)
  }
}

// Execute the seed function
seedDatabase()

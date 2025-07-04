/**
 * IntelliTrade CMS - Create Admin User
 *
 * This script creates an admin user in the database that can be used for seeding.
 * Run this script before running the seed script if you're having authentication issues.
 *
 * Usage: node create-admin.js
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

// Server URL from environment or default
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
const email = process.env.SEED_EMAIL || 'admin@intellitrade.com'
const password = process.env.SEED_PASSWORD || 'adminPassword123'

/**
 * Create admin user for seeding
 */
async function createAdminUser() {
  console.log('┌──────────────────────────────────────────────────┐')
  console.log('│       IntelliTrade CMS - Create Admin User       │')
  console.log('└──────────────────────────────────────────────────┘')
  console.log('')

  try {
    console.log(`🚀 Connecting to Payload CMS at ${serverURL}...`)
    console.log('Make sure the development server is running (npm run dev)')
    console.log('')

    // Create the first user
    console.log(`🔑 Creating admin user with email: ${email}`)
    const response = await fetch(`${serverURL}/api/users/first-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        passwordConfirm: password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      if (response.status === 400 && result.errors?.[0]?.message?.includes('already exists')) {
        console.log('✅ Admin user already exists')
        console.log(`You can use email: ${email} and your password for seeding`)
        return process.exit(0)
      }

      throw new Error(`Creation failed with status ${response.status}: ${JSON.stringify(result)}`)
    }

    console.log('')
    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${email}`)
    console.log('Password: [As specified in .env]')
    console.log('')
    console.log('You can now run the seed script: node seed-script.js')
    console.log('')

    // Success
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during admin user creation:')
    console.error(error)

    console.log('')
    console.error('If the user already exists, you can:')
    console.error("1. Use the existing user's credentials in .env")
    console.error('2. Update SEED_EMAIL and SEED_PASSWORD in .env to match existing credentials')
    console.log('')

    process.exit(1)
  }
}

// Execute the function
createAdminUser()

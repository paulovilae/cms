/**
 * IntelliTrade CMS - Debug Seed Script
 *
 * This script tests image fetching functionality to debug seeding issues.
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

// Test fetching a single image
async function testImageFetch() {
  console.log('Testing image fetch from GitHub...')

  try {
    // Test fetching one of the images used in the seed script
    const url =
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp'

    const res = await fetch(url, {
      method: 'GET',
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch image, status: ${res.status}`)
    }

    const data = await res.arrayBuffer()
    console.log(`✅ Successfully fetched image (${data.byteLength} bytes)`)
    return true
  } catch (error) {
    console.error('❌ Error fetching image:')
    console.error(error)
    return false
  }
}

// Debug the seed API endpoint
async function debugSeedAPI() {
  console.log('\nTesting seed API endpoint...')

  try {
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'

    // First, login to get the auth cookie
    console.log('🔑 Logging in with test credentials...')
    const loginResponse = await fetch(`${serverURL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.SEED_EMAIL || 'test@test.com',
        password: process.env.SEED_PASSWORD || 'Test12345%',
      }),
    })

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text()
      throw new Error(`Login failed with status ${loginResponse.status}: ${errorText}`)
    }

    console.log('✅ Authentication successful')

    // Extract cookies from the login response
    const cookies = loginResponse.headers.get('set-cookie')

    // Add a query parameter to limit what gets seeded for testing
    console.log('📋 Testing minimal seed operation...')
    const response = await fetch(`${serverURL}/next/seed?mode=test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
    })

    const responseText = await response.text()
    console.log(`Response status: ${response.status}`)
    console.log(`Response body: ${responseText}`)

    if (!response.ok) {
      throw new Error(`Seed API returned ${response.status}: ${responseText}`)
    }

    console.log('✅ Seed API test successful!')
    return true
  } catch (error) {
    console.error('❌ Error during seed API test:')
    console.error(error)
    return false
  }
}

// Run the tests
async function runTests() {
  console.log('┌──────────────────────────────────────────────────┐')
  console.log('│           IntelliTrade CMS - Debug Seed          │')
  console.log('└──────────────────────────────────────────────────┘')

  const imageFetchSuccess = await testImageFetch()
  const seedAPISuccess = await debugSeedAPI()

  console.log('\n--- Test Results ---')
  console.log(`Image Fetch: ${imageFetchSuccess ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Seed API: ${seedAPISuccess ? '✅ PASS' : '❌ FAIL'}`)

  if (!imageFetchSuccess) {
    console.log(
      '\nSuggestion: Check network connectivity or proxy settings for external image access',
    )
  }

  if (!seedAPISuccess) {
    console.log('\nSuggestion: Check server logs for detailed error information')
    console.log(
      'You may need to modify src/app/(frontend)/next/seed/route.ts to add more detailed error logging',
    )
  }
}

// Execute the tests
runTests()

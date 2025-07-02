// Simple script to test companies and transactions
import fetch from 'node-fetch'
import { Buffer } from 'buffer'
import { SERVER_URL } from './src/utilities/serverConfig.js'

// API endpoint base URL
const API_BASE_URL = `${SERVER_URL}/api`

// For debugging
console.log('Server URL:', SERVER_URL)
console.log('API Base URL:', API_BASE_URL)

// Get authentication token first
async function getAuthToken() {
  console.log('Getting authentication token...')

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test',
      }),
    })

    console.log('Login response status:', loginResponse.status)

    if (loginResponse.status === 200) {
      const loginData = await loginResponse.json()
      console.log('Login successful')
      return loginData.token
    } else {
      const errorText = await loginResponse.text()
      console.error('Login failed:', errorText)
      return null
    }
  } catch (error) {
    console.error('Error during login:', error)
    return null
  }
}

async function createCompanies(token) {
  console.log('Creating companies...')

  // Create Don Hugo Farms
  const donHugo = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      name: 'Don Hugo Farms',
      type: 'exporter',
      description:
        'Premium peanut producer from Argentina specializing in high-quality peanut cultivation using sustainable farming practices.',
      country: 'Argentina',
      slug: 'don-hugo-farms',
    }),
  }).then(async (res) => {
    console.log('Don Hugo Farms response status:', res.status)
    const data = await res.text()
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Invalid JSON response:', data)
      return {}
    }
  })

  // Create Global Nut Distributors
  const globalNut = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      name: 'Global Nut Distributors Ltd.',
      type: 'importer',
      description:
        'International distributor of premium nuts and dried fruits with distribution centers across North America and Europe.',
      country: 'United States',
      slug: 'global-nut-distributors',
    }),
  }).then(async (res) => {
    console.log('Global Nut Distributors response status:', res.status)
    const data = await res.text()
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Invalid JSON response:', data)
      return {}
    }
  })

  // Create Colombian Coffee Cooperative
  const colombianCoffee = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      name: 'Colombian Coffee Cooperative',
      type: 'exporter',
      description:
        'Farmer-owned cooperative producing premium Arabica coffee beans using traditional growing methods.',
      country: 'Colombia',
      slug: 'colombian-coffee-cooperative',
    }),
  }).then(async (res) => {
    console.log('Colombian Coffee response status:', res.status)
    const data = await res.text()
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Invalid JSON response:', data)
      return {}
    }
  })

  // Create Tokyo Bean Trading
  const tokyoBean = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      name: 'Tokyo Bean Trading Co.',
      type: 'importer',
      description:
        'Specialty coffee importer supplying high-end cafés and roasters throughout Japan with rare and premium coffee varieties.',
      country: 'Japan',
      slug: 'tokyo-bean-trading',
    }),
  }).then(async (res) => {
    console.log('Tokyo Bean response status:', res.status)
    const data = await res.text()
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Invalid JSON response:', data)
      return {}
    }
  })

  console.log('Companies created:', {
    donHugo: donHugo.id,
    globalNut: globalNut.id,
    colombianCoffee: colombianCoffee.id,
    tokyoBean: tokyoBean.id,
  })

  return {
    donHugo: donHugo.id,
    globalNut: globalNut.id,
    colombianCoffee: colombianCoffee.id,
    tokyoBean: tokyoBean.id,
  }
}

async function createTransactions(companies, token) {
  console.log('Creating transactions...')

  // Create Don Hugo Peanut Export
  const donHugoTransaction = await fetch(`${API_BASE_URL}/export-transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      title: 'Don Hugo Peanut Export - Batch #1',
      contractAddress: '0x7a3E8F126a5D91C58EA6F53EaB37C6439E63F1F9',
      exporter: companies.donHugo,
      importer: companies.globalNut,
      product: 'Premium Grade A Peanuts',
      amount: 75000,
      currency: 'usdc',
      status: 'in-progress',
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description: 'Verification of peanut production at Don Hugo Farms facility',
          status: 'verified',
          verifiedBy: 'Oracle Node #452',
          timestamp: '2025-04-12T10:23:45Z',
          paymentReleased: 15,
          evidenceType: 'photo',
        },
        {
          stepName: 'Port of Origin Departure',
          description: 'Verification of goods arrival and loading at Puerto de Buenos Aires',
          status: 'verified',
          verifiedBy: 'Oracle Node #387',
          timestamp: '2025-04-18T14:05:12Z',
          paymentReleased: 20,
          evidenceType: 'document',
        },
        {
          stepName: 'Final Delivery Verification',
          description: 'Verification of delivery to Global Nut Distributors warehouse',
          status: 'pending',
          evidenceType: 'multiple',
        },
      ],
      slug: 'don-hugo-peanut-export-batch-1',
    }),
  }).then(async (res) => {
    console.log('Don Hugo Transaction response status:', res.status)
    const data = await res.text()
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Invalid JSON response:', data)
      return {}
    }
  })

  // Create Colombian Coffee Export
  const coffeeTransaction = await fetch(`${API_BASE_URL}/export-transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      title: 'Global Coffee Export - Colombia to Japan',
      contractAddress: '0x8b3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E0F',
      exporter: companies.colombianCoffee,
      importer: companies.tokyoBean,
      product: 'Premium Arabica Coffee Beans',
      amount: 120000,
      currency: 'usdc',
      status: 'completed',
      verificationSteps: [
        {
          stepName: 'Production Verification',
          description: 'Verification of coffee bean production at Colombian farms',
          status: 'verified',
          verifiedBy: 'Oracle Node #217',
          timestamp: '2025-03-12T08:15:30Z',
          paymentReleased: 15,
          evidenceType: 'photo',
        },
        {
          stepName: 'Final Delivery Verification',
          description: 'Verification of delivery to Tokyo Bean Trading warehouse',
          status: 'verified',
          verifiedBy: 'Oracle Node #127',
          timestamp: '2025-04-17T10:45:27Z',
          paymentReleased: 45,
          evidenceType: 'multiple',
        },
      ],
      slug: 'global-coffee-export-colombia-to-japan',
    }),
  }).then(async (res) => {
    console.log('Coffee Transaction response status:', res.status)
    const data = await res.text()
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Invalid JSON response:', data)
      return {}
    }
  })

  console.log('Transactions created:', {
    donHugoTransaction: donHugoTransaction?.id || 'Failed to create',
    coffeeTransaction: coffeeTransaction?.id || 'Failed to create',
  })
}

async function main() {
  try {
    // First get auth token
    const token = await getAuthToken()

    if (!token) {
      console.error('Failed to get authentication token. Cannot proceed.')
      return
    }

    // Create companies with token
    const companies = await createCompanies(token)
    console.log('Companies response:', companies)

    // Only proceed if we have company IDs
    if (companies.donHugo && companies.globalNut) {
      await createTransactions(companies, token)
      console.log('Test data created successfully!')
    } else {
      console.error('Could not create companies. Check server connection and authentication.')
    }
  } catch (error) {
    console.error('Error creating test data:', error)
  }
}

main()

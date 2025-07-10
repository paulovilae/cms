/**
 * Business Context Utility Usage Examples
 *
 * This file demonstrates how to use the business context utility
 * in various scenarios across the application.
 */

import {
  getBusinessContext,
  getBusinessMode,
  createBusinessHeaders,
  businessFetch,
  getCurrentBusiness,
  withBusinessContext,
  type BusinessMode,
} from '../businessContext'

// Example 1: Using in Payload endpoint handlers
export const exampleEndpoint = {
  path: '/ai-process',
  method: 'post',
  handler: async (req: any, res: any) => {
    // Extract business context from request
    const context = getBusinessContext(req)
    console.log(`Processing request for business: ${context.business}`)

    // Use business context to filter data or apply business logic
    if (context.business === 'salarium') {
      // Salarium-specific logic
      return res.json({ message: 'Processing HR workflow' })
    } else if (context.business === 'latinos') {
      // Latinos-specific logic
      return res.json({ message: 'Processing trading bot request' })
    }

    return res.json({ message: 'Processing default request' })
  },
}

// Example 2: Using the middleware helper
export const simplifiedEndpoint = {
  path: '/flow-templates',
  method: 'get',
  handler: withBusinessContext(async (business: BusinessMode, req: any, res: any) => {
    // Business context is automatically extracted and passed as first parameter
    console.log(`Getting flow templates for: ${business}`)

    // Your business logic here
    return res.json({ business, templates: [] })
  }),
}

// Example 3: Frontend API calls with business context
export async function makeBusinessAwareAPICall() {
  const currentBusiness = getCurrentBusiness()

  // Method 1: Using businessFetch helper
  const response1 = await businessFetch('/api/ai-process', currentBusiness, {
    method: 'POST',
    body: JSON.stringify({ data: 'example' }),
  })

  // Method 2: Using createBusinessHeaders
  const response2 = await fetch('/api/flow-templates', {
    method: 'GET',
    headers: createBusinessHeaders(currentBusiness),
  })

  // Method 3: Manual header creation
  const response3 = await fetch('/api/bots', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-business': currentBusiness,
    },
  })

  return { response1, response2, response3 }
}

// Example 4: React component usage
export function ExampleComponent() {
  const currentBusiness = getCurrentBusiness()

  const handleSubmit = async (data: any) => {
    try {
      const response = await businessFetch('/api/ai-process', currentBusiness, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Success:', result)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return null // React component JSX would go here
}

// Example 5: Business-specific configuration
export function getBusinessSpecificConfig() {
  const business = getCurrentBusiness()

  const configs = {
    intellitrade: {
      apiTimeout: 30000,
      maxRetries: 3,
      features: ['blockchain', 'smart-contracts'],
    },
    salarium: {
      apiTimeout: 15000,
      maxRetries: 2,
      features: ['ai-processing', 'workflows'],
    },
    latinos: {
      apiTimeout: 5000,
      maxRetries: 5,
      features: ['real-time', 'trading-bots'],
    },
    capacita: {
      apiTimeout: 20000,
      maxRetries: 3,
      features: ['avatar-arena', 'training'],
    },
    default: {
      apiTimeout: 10000,
      maxRetries: 2,
      features: [],
    },
  }

  return configs[business] || configs.default
}

// Example 6: Conditional business logic
export function processBusinessSpecificData(data: any) {
  const business = getCurrentBusiness()

  switch (business) {
    case 'intellitrade':
      return processTradeFinanceData(data)
    case 'salarium':
      return processHRData(data)
    case 'latinos':
      return processTradingData(data)
    case 'capacita':
      return processTrainingData(data)
    default:
      return processGenericData(data)
  }
}

// Helper functions for business-specific processing
function processTradeFinanceData(data: any) {
  return { ...data, type: 'trade-finance', processed: true }
}

function processHRData(data: any) {
  return { ...data, type: 'hr-workflow', processed: true }
}

function processTradingData(data: any) {
  return { ...data, type: 'trading-bot', processed: true }
}

function processTrainingData(data: any) {
  return { ...data, type: 'training-session', processed: true }
}

function processGenericData(data: any) {
  return { ...data, type: 'generic', processed: true }
}

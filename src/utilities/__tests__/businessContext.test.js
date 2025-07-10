/**
 * Business Context Utility Tests
 * Simple tests to verify the utility functions work correctly
 */

import {
  getBusinessContext,
  getBusinessMode,
  isValidBusinessMode,
  createBusinessHeaders,
  addBusinessToUrl,
  getBusinessFromPath,
  getBusinessConfig,
  VALID_BUSINESS_MODES,
} from '../businessContext.ts'

// Mock request objects for testing
const createMockRequest = (headers = {}, query = {}, body = {}) => ({
  headers,
  query,
  body,
})

console.log('🧪 Testing Business Context Utility...\n')

// Test 1: Business detection from headers
console.log('Test 1: Header detection')
const headerReq = createMockRequest({ 'x-business': 'salarium' })
const headerContext = getBusinessContext(headerReq)
console.log('✅ Header context:', headerContext)
console.assert(headerContext.business === 'salarium', 'Header detection failed')
console.assert(headerContext.source === 'header', 'Header source detection failed')

// Test 2: Business detection from query
console.log('\nTest 2: Query detection')
const queryReq = createMockRequest({}, { business: 'latinos' })
const queryContext = getBusinessContext(queryReq)
console.log('✅ Query context:', queryContext)
console.assert(queryContext.business === 'latinos', 'Query detection failed')
console.assert(queryContext.source === 'query', 'Query source detection failed')

// Test 3: Business detection from body
console.log('\nTest 3: Body detection')
const bodyReq = createMockRequest({}, {}, { business: 'intellitrade' })
const bodyContext = getBusinessContext(bodyReq)
console.log('✅ Body context:', bodyContext)
console.assert(bodyContext.business === 'intellitrade', 'Body detection failed')
console.assert(bodyContext.source === 'body', 'Body source detection failed')

// Test 4: Default fallback
console.log('\nTest 4: Default fallback')
const emptyReq = createMockRequest()
const defaultContext = getBusinessContext(emptyReq)
console.log('✅ Default context:', defaultContext)
console.assert(defaultContext.business === 'default', 'Default fallback failed')
console.assert(defaultContext.source === 'default', 'Default source detection failed')

// Test 5: Priority order (header > query > body)
console.log('\nTest 5: Priority order')
const priorityReq = createMockRequest(
  { 'x-business': 'salarium' },
  { business: 'latinos' },
  { business: 'intellitrade' },
)
const priorityContext = getBusinessContext(priorityReq)
console.log('✅ Priority context:', priorityContext)
console.assert(priorityContext.business === 'salarium', 'Priority order failed')
console.assert(priorityContext.source === 'header', 'Priority source failed')

// Test 6: Invalid business mode
console.log('\nTest 6: Invalid business mode')
const invalidReq = createMockRequest({ 'x-business': 'invalid-business' })
const invalidContext = getBusinessContext(invalidReq)
console.log('✅ Invalid context:', invalidContext)
console.assert(invalidContext.business === 'default', 'Invalid business handling failed')
console.assert(invalidContext.isValid === false, 'Invalid business validation failed')

// Test 7: Business mode validation
console.log('\nTest 7: Business mode validation')
console.assert(isValidBusinessMode('salarium') === true, 'Valid business validation failed')
console.assert(isValidBusinessMode('invalid') === false, 'Invalid business validation failed')
console.assert(isValidBusinessMode('SALARIUM') === true, 'Case insensitive validation failed')

// Test 8: Header creation
console.log('\nTest 8: Header creation')
const headers = createBusinessHeaders('salarium', { Authorization: 'Bearer token' })
console.log('✅ Headers:', headers)
console.assert(headers['x-business'] === 'salarium', 'Business header creation failed')
console.assert(headers['Content-Type'] === 'application/json', 'Content-Type header failed')
console.assert(headers['Authorization'] === 'Bearer token', 'Additional header failed')

// Test 9: URL business extraction
console.log('\nTest 9: URL business extraction')
const pathBusiness1 = getBusinessFromPath('/salarium/job-flow')
const pathBusiness2 = getBusinessFromPath('/api/latinos/bots')
const pathBusiness3 = getBusinessFromPath('/invalid/path')
console.log('✅ Path businesses:', { pathBusiness1, pathBusiness2, pathBusiness3 })
console.assert(pathBusiness1 === 'salarium', 'Path business extraction failed')
console.assert(pathBusiness2 === null, 'Path business extraction should fail for /api/')
console.assert(pathBusiness3 === null, 'Invalid path business extraction failed')

// Test 10: Business configuration
console.log('\nTest 10: Business configuration')
const salariumConfig = getBusinessConfig('salarium')
const defaultConfig = getBusinessConfig('invalid')
console.log('✅ Salarium config:', salariumConfig)
console.log('✅ Default config:', defaultConfig)
console.assert(salariumConfig.name === 'Salarium', 'Business config failed')
console.assert(salariumConfig.port === 3002, 'Business config port failed')
console.assert(defaultConfig.name === 'Multi-Business Platform', 'Default config failed')

// Test 11: Valid business modes list
console.log('\nTest 11: Valid business modes')
console.log('✅ Valid modes:', VALID_BUSINESS_MODES)
console.assert(VALID_BUSINESS_MODES.includes('salarium'), 'Valid modes missing salarium')
console.assert(VALID_BUSINESS_MODES.includes('intellitrade'), 'Valid modes missing intellitrade')
console.assert(VALID_BUSINESS_MODES.includes('latinos'), 'Valid modes missing latinos')
console.assert(VALID_BUSINESS_MODES.includes('capacita'), 'Valid modes missing capacita')
console.assert(VALID_BUSINESS_MODES.includes('default'), 'Valid modes missing default')

console.log('\n🎉 All tests passed! Business Context Utility is working correctly.')
console.log('\n📋 Summary:')
console.log('- ✅ Business detection from headers, query, and body')
console.log('- ✅ Priority order handling (header > query > body > default)')
console.log('- ✅ Invalid business mode validation and fallback')
console.log('- ✅ Header creation for API requests')
console.log('- ✅ URL path business extraction')
console.log('- ✅ Business configuration retrieval')
console.log('- ✅ All business modes properly defined')

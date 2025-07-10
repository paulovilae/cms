import { salariumSearchConfig } from '../business-config/salarium'
import { intellitradeSearchConfig } from '../business-config/intellitrade'
import { latinosSearchConfig } from '../business-config/latinos'
import { getBusinessSearchConfig, registerBusinessSearchConfig } from '../business-config'
import { searchService } from '../services/search-service'

/**
 * Universal AI-Powered Search System - Phase 4 Tests
 *
 * These tests verify the functionality of the business-specific search configurations
 * and their integration with the search service.
 */

// Mock console.log to prevent output clutter during tests
const originalConsoleLog = console.log
beforeAll(() => {
  console.log = jest.fn()
})

afterAll(() => {
  console.log = originalConsoleLog
})

// Mock request objects for different businesses
const salariumRequest = { headers: { 'x-business': 'salarium' } }
const intellitradeRequest = { headers: { 'x-business': 'intellitrade' } }
const latinosRequest = { headers: { 'x-business': 'latinos' } }
const defaultRequest = { headers: {} }

describe('Business Search Configuration Tests', () => {
  test('Salarium configuration has correct structure', () => {
    expect(salariumSearchConfig).toBeDefined()
    expect(salariumSearchConfig.searchFields).toBeInstanceOf(Array)
    expect(salariumSearchConfig.filters).toBeInstanceOf(Array)
    expect(salariumSearchConfig.actions).toBeInstanceOf(Array)
    expect(salariumSearchConfig.previewConfig).toBeDefined()
    expect(salariumSearchConfig.aiPromptCustomizations).toBeDefined()

    // Check HR-specific fields
    const fieldNames = salariumSearchConfig.searchFields.map((field) => field.name)
    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('requiredSkills')
    expect(fieldNames).toContain('experienceLevel')
    expect(fieldNames).toContain('compensationRange')

    // Check HR-specific filters
    const filterKeys = salariumSearchConfig.filters.map((filter) => filter.key)
    expect(filterKeys).toContain('organization')
    expect(filterKeys).toContain('department')
    expect(filterKeys).toContain('experienceLevel')
    expect(filterKeys).toContain('requiredSkills')
  })

  test('IntelliTrade configuration has correct structure', () => {
    expect(intellitradeSearchConfig).toBeDefined()
    expect(intellitradeSearchConfig.searchFields).toBeInstanceOf(Array)
    expect(intellitradeSearchConfig.filters).toBeInstanceOf(Array)
    expect(intellitradeSearchConfig.actions).toBeInstanceOf(Array)
    expect(intellitradeSearchConfig.previewConfig).toBeDefined()
    expect(intellitradeSearchConfig.aiPromptCustomizations).toBeDefined()

    // Check trade finance specific fields
    const fieldNames = intellitradeSearchConfig.searchFields.map((field) => field.name)
    expect(fieldNames).toContain('exporter.name')
    expect(fieldNames).toContain('importer.name')
    expect(fieldNames).toContain('contractValue')
    expect(fieldNames).toContain('verificationStatus')

    // Check trade finance specific filters
    const filterKeys = intellitradeSearchConfig.filters.map((filter) => filter.key)
    expect(filterKeys).toContain('exporter')
    expect(filterKeys).toContain('importer')
    expect(filterKeys).toContain('shippingTerms')
    expect(filterKeys).toContain('verificationStatus')
  })

  test('Latinos configuration has correct structure', () => {
    expect(latinosSearchConfig).toBeDefined()
    expect(latinosSearchConfig.searchFields).toBeInstanceOf(Array)
    expect(latinosSearchConfig.filters).toBeInstanceOf(Array)
    expect(latinosSearchConfig.actions).toBeInstanceOf(Array)
    expect(latinosSearchConfig.previewConfig).toBeDefined()
    expect(latinosSearchConfig.aiPromptCustomizations).toBeDefined()

    // Check trading bot specific fields
    const fieldNames = latinosSearchConfig.searchFields.map((field) => field.name)
    expect(fieldNames).toContain('name')
    expect(fieldNames).toContain('strategy.name')
    expect(fieldNames).toContain('performance.roi')
    expect(fieldNames).toContain('performance.winRate')

    // Check trading bot specific filters
    const filterKeys = latinosSearchConfig.filters.map((filter) => filter.key)
    expect(filterKeys).toContain('strategy')
    expect(filterKeys).toContain('tradingPairs')
    expect(filterKeys).toContain('riskLevel')
    expect(filterKeys).toContain('marketSegment')
  })

  test('Configuration registry works correctly', () => {
    // Test getting existing configurations
    expect(getBusinessSearchConfig('salarium')).toBe(salariumSearchConfig)
    expect(getBusinessSearchConfig('intellitrade')).toBe(intellitradeSearchConfig)
    expect(getBusinessSearchConfig('latinos')).toBe(latinosSearchConfig)

    // Test fallback to default for unknown business
    const defaultConfig = getBusinessSearchConfig('unknown')
    expect(defaultConfig).toBeDefined()
    expect(defaultConfig).not.toBe(salariumSearchConfig)
    expect(defaultConfig).not.toBe(intellitradeSearchConfig)
    expect(defaultConfig).not.toBe(latinosSearchConfig)

    // Test registering a new configuration
    const testConfig = {
      searchFields: [{ name: 'test', weight: 1 }],
      filters: [],
      actions: [],
      previewConfig: { layout: 'card', fields: [] },
      aiPromptCustomizations: {
        systemPrompt: 'Test prompt',
        queryEnhancement: 'Test enhancement',
        contextData: { entityType: 'test', terminology: {} },
        suggestionPrompt: 'Test suggestions',
      },
    }

    registerBusinessSearchConfig('test', testConfig)
    expect(getBusinessSearchConfig('test')).toBe(testConfig)
  })
})

describe('Search Service Integration Tests', () => {
  test('Search service loads correct configuration based on business context', async () => {
    // Mock the enhanceQuery method to verify configuration usage
    const originalEnhanceQuery = (searchService as any).enhanceQuery
    const enhanceQueryMock = jest.fn().mockImplementation(() => 'enhanced query')
    ;(searchService as any).enhanceQuery = enhanceQueryMock

    // Execute searches for different businesses
    await searchService.search('test query', {}, {}, salariumRequest)
    expect(enhanceQueryMock).toHaveBeenCalledWith('test query', salariumSearchConfig)

    await searchService.search('test query', {}, {}, intellitradeRequest)
    expect(enhanceQueryMock).toHaveBeenCalledWith('test query', intellitradeSearchConfig)

    await searchService.search('test query', {}, {}, latinosRequest)
    expect(enhanceQueryMock).toHaveBeenCalledWith('test query', latinosSearchConfig)

    // Test default fallback
    await searchService.search('test query', {}, {}, defaultRequest)
    expect(enhanceQueryMock).toHaveBeenCalledTimes(4)

    // Restore original method
    ;(searchService as any).enhanceQuery = originalEnhanceQuery
  })

  test('Search service applies business-specific AI prompts', async () => {
    // Mock executeSearch to avoid actual search execution
    const originalExecuteSearch = (searchService as any).executeSearch
    const executeSearchMock = jest.fn().mockImplementation(() => ({
      results: [],
      total: 0,
      page: 1,
      pageSize: 10,
    }))
    ;(searchService as any).executeSearch = executeSearchMock

    // Execute search and check if AI prompts are applied
    await searchService.search('senior developer', {}, {}, salariumRequest)

    // Since we're not actually calling an AI service, just verify the console logs
    // that would show which prompts are being used
    expect(console.log).toHaveBeenCalledWith(
      'Using prompt template:',
      salariumSearchConfig.aiPromptCustomizations.queryEnhancement,
    )
    expect(console.log).toHaveBeenCalledWith(
      'With system context:',
      salariumSearchConfig.aiPromptCustomizations.systemPrompt,
    )

    // Restore original method
    ;(searchService as any).executeSearch = originalExecuteSearch
  })

  test('Search service applies business-specific fields and filters', async () => {
    // Create spy on executeSearch to verify params
    const executeSearchSpy = jest.spyOn(searchService as any, 'executeSearch')

    // Define test filters
    const filters = {
      experienceLevel: 'senior',
      department: '123',
    }

    // Execute search with filters
    await searchService.search('developer', filters, {}, salariumRequest)

    // Verify that executeSearch was called with the right params
    expect(executeSearchSpy).toHaveBeenCalledWith(
      expect.any(String), // query is possibly enhanced
      salariumSearchConfig,
      filters,
      {},
    )

    // Reset spy
    executeSearchSpy.mockRestore()
  })

  test('Search suggestions use business-specific prompt templates', async () => {
    // Execute suggestions request
    await searchService.getSuggestions('trading', latinosRequest)

    // Check if the right prompt template is used
    expect(console.log).toHaveBeenCalledWith(
      'Using suggestion prompt:',
      latinosSearchConfig.aiPromptCustomizations.suggestionPrompt,
    )
  })

  test('Search service handles errors and provides fallbacks', async () => {
    // Create a broken config that would cause errors
    const brokenConfig = {
      ...salariumSearchConfig,
      // @ts-ignore - intentionally break the config
      aiPromptCustomizations: null,
    }

    // Register the broken config
    registerBusinessSearchConfig('broken', brokenConfig)

    // Create request with broken config
    const brokenRequest = { headers: { 'x-business': 'broken' } }

    // Search should not throw error even with broken config
    const result = await searchService.search('test', {}, {}, brokenRequest)

    // Verify that we got results despite the broken config
    expect(result).toBeDefined()
    expect(result.results).toBeInstanceOf(Array)
  })
})

describe('End-to-End Integration Tests', () => {
  test('Complete search flow with business-specific configuration', async () => {
    // Define test query and filters
    const query = 'blockchain verification'
    const filters = {
      verificationStatus: 'pending',
    }

    // Execute search with IntelliTrade configuration
    const results = await searchService.search(query, filters, {}, intellitradeRequest)

    // Verify results structure includes business-specific formatting
    expect(results).toHaveProperty('_config')
    expect(results._config).toHaveProperty(
      'previewLayout',
      intellitradeSearchConfig.previewConfig.layout,
    )
    expect(results._config).toHaveProperty('availableFilters', intellitradeSearchConfig.filters)

    // Verify results include formatted previews and actions
    expect(results.results[0]).toHaveProperty('_formatted')
    expect(results.results[0]._formatted).toHaveProperty('preview')
    expect(results.results[0]._formatted).toHaveProperty('actions')
  })
})

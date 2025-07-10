/**
 * Simple validation script for Business Context Utility
 * This script validates that the utility was created correctly
 */

import { readFileSync } from 'fs'
import { join } from 'path'

console.log('🧪 Validating Business Context Utility...\n')

try {
  // Read the utility file
  const utilityPath = join(process.cwd(), 'src/utilities/businessContext.ts')
  const utilityContent = readFileSync(utilityPath, 'utf8')

  // Check for required exports
  const requiredExports = [
    'getBusinessContext',
    'getBusinessMode',
    'isValidBusinessMode',
    'createBusinessHeaders',
    'createBusinessFetchOptions',
    'businessFetch',
    'addBusinessToUrl',
    'getBusinessFromPath',
    'getCurrentBusiness',
    'getBusinessConfig',
    'isBusinessEnabled',
    'getEnabledBusinesses',
    'withBusinessContext',
    'useBusinessContext',
    'VALID_BUSINESS_MODES',
    'BusinessMode',
    'BusinessContext',
  ]

  console.log('✅ Checking required exports...')
  let allExportsFound = true

  for (const exportName of requiredExports) {
    if (
      utilityContent.includes(`export function ${exportName}`) ||
      utilityContent.includes(`export async function ${exportName}`) ||
      utilityContent.includes(`export const ${exportName}`) ||
      utilityContent.includes(`export type ${exportName}`) ||
      utilityContent.includes(`export interface ${exportName}`)
    ) {
      console.log(`  ✅ ${exportName}`)
    } else {
      console.log(`  ❌ ${exportName} - NOT FOUND`)
      allExportsFound = false
    }
  }

  // Check for required business modes
  console.log('\n✅ Checking business modes...')
  const requiredBusinessModes = ['intellitrade', 'salarium', 'latinos', 'capacita', 'default']
  let allModesFound = true

  for (const mode of requiredBusinessModes) {
    if (utilityContent.includes(`'${mode}'`)) {
      console.log(`  ✅ ${mode}`)
    } else {
      console.log(`  ❌ ${mode} - NOT FOUND`)
      allModesFound = false
    }
  }

  // Check for TypeScript types
  console.log('\n✅ Checking TypeScript types...')
  const typeChecks = [
    { name: 'BusinessMode type', pattern: 'type BusinessMode' },
    { name: 'BusinessContext interface', pattern: 'interface BusinessContext' },
    { name: 'PayloadRequest import', pattern: 'PayloadRequest' },
  ]

  let allTypesFound = true
  for (const check of typeChecks) {
    if (utilityContent.includes(check.pattern)) {
      console.log(`  ✅ ${check.name}`)
    } else {
      console.log(`  ❌ ${check.name} - NOT FOUND`)
      allTypesFound = false
    }
  }

  // Check for key functionality
  console.log('\n✅ Checking key functionality...')
  const functionalityChecks = [
    { name: 'Header detection', pattern: 'x-business' },
    { name: 'Query parameter detection', pattern: 'req.query.business' },
    { name: 'Body parameter detection', pattern: 'req.body.business' },
    { name: 'Priority order handling', pattern: 'headers > query > body' },
    { name: 'Business validation', pattern: 'isValid' },
    { name: 'Environment fallback', pattern: 'process.env.BUSINESS_MODE' },
  ]

  let allFunctionalityFound = true
  for (const check of functionalityChecks) {
    if (utilityContent.includes(check.pattern)) {
      console.log(`  ✅ ${check.name}`)
    } else {
      console.log(`  ❌ ${check.name} - NOT FOUND`)
      allFunctionalityFound = false
    }
  }

  // Final validation
  console.log('\n📋 Validation Summary:')
  console.log(`  Exports: ${allExportsFound ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`  Business Modes: ${allModesFound ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`  TypeScript Types: ${allTypesFound ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`  Key Functionality: ${allFunctionalityFound ? '✅ PASS' : '❌ FAIL'}`)

  const overallPass = allExportsFound && allModesFound && allTypesFound && allFunctionalityFound

  if (overallPass) {
    console.log('\n🎉 Business Context Utility validation PASSED!')
    console.log('\n✅ Ready for Phase 1 implementation:')
    console.log('  - Business context detection from headers, query, and body')
    console.log('  - Priority order handling (header > query > body > default)')
    console.log('  - Business mode validation and fallback')
    console.log('  - Frontend helper functions for API calls')
    console.log('  - TypeScript support with proper types')
    console.log('  - Environment-aware business configuration')

    process.exit(0)
  } else {
    console.log('\n❌ Business Context Utility validation FAILED!')
    console.log('Please fix the issues above before proceeding.')
    process.exit(1)
  }
} catch (error) {
  console.error('❌ Error validating utility:', error.message)
  process.exit(1)
}

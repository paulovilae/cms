#!/usr/bin/env node

/**
 * Business-Specific Build Setup Script
 *
 * This script prepares the build environment for specific business modes
 * by temporarily moving or excluding problematic plugin files that have
 * dependencies not available in certain business containers.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const businessMode = process.env.BUSINESS_MODE || 'all'

console.log(`🔧 Setting up build environment for business mode: ${businessMode}`)

// Define problematic plugins and their dependencies
const problematicPlugins = {
  'job-flow-cascade': {
    path: 'src/plugins/job-flow-cascade',
    dependencies: ['slate', 'slate-react', 'slate-history'],
    excludeForBusinesses: ['intellitrade', 'latinos'],
  },
}

// Function to temporarily move a directory
function moveDirectory(source, destination) {
  if (fs.existsSync(source)) {
    // Create backup directory if it doesn't exist
    const backupDir = path.dirname(destination)
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Move the directory
    fs.renameSync(source, destination)
    console.log(`📦 Moved ${source} to ${destination}`)
    return true
  }
  return false
}

// Function to restore a directory
function restoreDirectory(source, destination) {
  if (fs.existsSync(source)) {
    fs.renameSync(source, destination)
    console.log(`🔄 Restored ${destination} from ${source}`)
    return true
  }
  return false
}

// Main setup function
function setupBusinessBuild() {
  const backupDir = path.join(rootDir, '.build-backups')

  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  // Process each problematic plugin
  for (const [pluginName, config] of Object.entries(problematicPlugins)) {
    const pluginPath = path.join(rootDir, config.path)
    const backupPath = path.join(backupDir, pluginName)

    if (config.excludeForBusinesses.includes(businessMode)) {
      // Move plugin to backup location
      if (moveDirectory(pluginPath, backupPath)) {
        console.log(`🚫 Excluded ${pluginName} plugin for ${businessMode} business mode`)
      }
    } else {
      // Restore plugin if it was previously moved
      if (restoreDirectory(backupPath, pluginPath)) {
        console.log(`✅ Restored ${pluginName} plugin for ${businessMode} business mode`)
      }
    }
  }
}

// Cleanup function for restoring all plugins
function cleanupBusinessBuild() {
  const backupDir = path.join(rootDir, '.build-backups')

  if (!fs.existsSync(backupDir)) {
    console.log('🧹 No backups to restore')
    return
  }

  // Restore all backed up plugins
  for (const [pluginName, config] of Object.entries(problematicPlugins)) {
    const pluginPath = path.join(rootDir, config.path)
    const backupPath = path.join(backupDir, pluginName)

    if (restoreDirectory(backupPath, pluginPath)) {
      console.log(`🔄 Restored ${pluginName} plugin`)
    }
  }

  // Remove backup directory if empty
  try {
    fs.rmdirSync(backupDir)
    console.log('🧹 Cleaned up backup directory')
  } catch (error) {
    // Directory not empty or doesn't exist, ignore
  }
}

// Handle command line arguments
const command = process.argv[2]

switch (command) {
  case 'setup':
    setupBusinessBuild()
    break
  case 'cleanup':
    cleanupBusinessBuild()
    break
  default:
    console.log('Usage: node setup-business-build.js [setup|cleanup]')
    console.log('  setup   - Prepare build environment for current BUSINESS_MODE')
    console.log('  cleanup - Restore all plugins to their original locations')
    process.exit(1)
}

console.log('✅ Business build setup complete')

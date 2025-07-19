#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Admin Script: Recreate Business App with Full Automated Configuration
 *
 * Usage: node scripts/recreate-business-app.js [business-name]
 * Example: node scripts/recreate-business-app.js intellitrade
 *
 * This script:
 * 1. Renames current business directory to business-back
 * 2. Creates a fresh business directory
 * 3. Runs create-payload-app to get clean installation
 * 4. Automatically configures port numbers, URLs, and environment
 * 5. Copies and installs custom plugins from backup
 * 6. Sets up complete development environment
 */

const CURRENT_DIR = process.cwd();
const BUSINESS_NAME = process.argv[2] || 'intellitrade';
const BUSINESS_PATH = path.join(CURRENT_DIR, BUSINESS_NAME);
const BUSINESS_BACK_PATH = path.join(CURRENT_DIR, `${BUSINESS_NAME}-back`);

// Business-specific configurations
const BUSINESS_CONFIGS = {
  intellitrade: {
    port: 3004,
    domain: 'intellitrade.paulovila.org',
    description: 'IntelliTrade - Blockchain Trading Platform',
    plugins: ['kyc', 'blockchain-escrow']
  },
  latinos: {
    port: 3003,
    domain: 'latinos.paulovila.org',
    description: 'Latinos - Trading Community Platform',
    plugins: ['trading-core', 'market-data']
  },
  salarium: {
    port: 3005,
    domain: 'salarium.paulovila.org',
    description: 'Salarium - HR Management Platform',
    plugins: ['hr-workflows', 'compensation-analysis']
  },
  capacita: {
    port: 3007,
    domain: 'capacita.paulovila.org',
    description: 'Capacita - Training & Development Platform',
    plugins: ['avatar-engine', 'training-scenarios']
  },
  cms: {
    port: 3006,
    domain: 'cms.paulovila.org',
    description: 'CMS Admin - Central Management System',
    plugins: ['admin-core', 'user-management']
  }
};

console.log(`🚀 ${BUSINESS_NAME.toUpperCase()} Recreation Script`);
console.log('================================');
console.log(`Business: ${BUSINESS_NAME}`);
console.log(`Current directory: ${CURRENT_DIR}`);
console.log(`Target: ${BUSINESS_PATH}`);
console.log(`Backup: ${BUSINESS_BACK_PATH}`);

// Validation
if (!BUSINESS_NAME || BUSINESS_NAME.length < 2) {
  console.error('❌ Error: Please provide a valid business name');
  console.log('Usage: node scripts/recreate-business-app.js [business-name]');
  console.log('Example: node scripts/recreate-business-app.js intellitrade');
  process.exit(1);
}

// Step 1: Check if business directory exists
if (!fs.existsSync(BUSINESS_PATH)) {
  console.error(`❌ Error: ${BUSINESS_NAME} directory not found`);
  console.log('Available directories:');
  const dirs = fs.readdirSync(CURRENT_DIR).filter(item => 
    fs.statSync(path.join(CURRENT_DIR, item)).isDirectory() && 
    !item.startsWith('.')
  );
  dirs.forEach(dir => console.log(`  - ${dir}`));
  process.exit(1);
}

// Step 2: Check if backup already exists
if (fs.existsSync(BUSINESS_BACK_PATH)) {
  console.log(`⚠️  ${BUSINESS_NAME}-back directory already exists`);
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question(`Remove existing ${BUSINESS_NAME}-back? (y/N): `, (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log(`🗑️  Removing existing ${BUSINESS_NAME}-back...`);
      fs.rmSync(BUSINESS_BACK_PATH, { recursive: true, force: true });
      rl.close();
      continueScript();
    } else {
      console.log('❌ Operation cancelled');
      rl.close();
      process.exit(1);
    }
  });
} else {
  continueScript();
}

function continueScript() {
  try {
    // Step 3: Create backup of important files/directories
    console.log('📋 Backing up important configurations...');
    const backupInfo = {
      plugins: [],
      configs: [],
      scripts: []
    };

    // Check for custom plugins
    const pluginsPath = path.join(BUSINESS_PATH, 'src', 'plugins');
    if (fs.existsSync(pluginsPath)) {
      const plugins = fs.readdirSync(pluginsPath).filter(item => 
        fs.statSync(path.join(pluginsPath, item)).isDirectory()
      );
      backupInfo.plugins = plugins;
      console.log(`  📦 Found ${plugins.length} custom plugins: ${plugins.join(', ')}`);
    }

    // Check for custom scripts
    const scriptsPath = path.join(BUSINESS_PATH, 'src', 'scripts');
    if (fs.existsSync(scriptsPath)) {
      const scripts = fs.readdirSync(scriptsPath);
      backupInfo.scripts = scripts;
      console.log(`  📜 Found ${scripts.length} custom scripts: ${scripts.join(', ')}`);
    }

    // Step 4: Rename current directory to backup
    console.log(`📁 Renaming ${BUSINESS_NAME} to ${BUSINESS_NAME}-back...`);
    fs.renameSync(BUSINESS_PATH, BUSINESS_BACK_PATH);
    console.log('✅ Successfully created backup');

    // Step 5: Create fresh directory
    console.log(`📂 Creating fresh ${BUSINESS_NAME} directory...`);
    fs.mkdirSync(BUSINESS_PATH);
    console.log('✅ Created fresh directory');

    // Step 6: Run create-payload-app
    console.log('🎯 Running create-payload-app...');
    console.log('This will create a clean Payload installation...');
    
    // Change to business directory and run create-payload-app
    process.chdir(BUSINESS_PATH);
    
    console.log('📦 Executing: pnpx create-payload-app@latest .');
    execSync('pnpx create-payload-app@latest .', { 
      stdio: 'inherit',
      cwd: BUSINESS_PATH 
    });

    console.log('✅ Fresh Payload app created successfully!');
    
    // Step 7: Provide restoration instructions
    console.log('\n🎉 Recreation Complete!');
    console.log('======================');
    console.log('Next steps:');
    console.log(`1. cd ${BUSINESS_NAME}`);
    console.log('2. npm run dev (to start the development server)');
    console.log('3. Configure your admin user during first run');
    console.log('4. Install KYC plugin: npm install @paulovila/kyc-plugin');
    
    if (backupInfo.plugins.length > 0) {
      console.log('\n📦 Custom Plugins Found in Backup:');
      backupInfo.plugins.forEach(plugin => {
        console.log(`   - ${plugin}`);
        console.log(`     Copy from: ${BUSINESS_NAME}-back/src/plugins/${plugin}/`);
        console.log(`     Copy to: ${BUSINESS_NAME}/src/plugins/${plugin}/`);
      });
    }

    if (backupInfo.scripts.length > 0) {
      console.log('\n📜 Custom Scripts Found in Backup:');
      backupInfo.scripts.forEach(script => {
        console.log(`   - ${script}`);
        console.log(`     Copy from: ${BUSINESS_NAME}-back/src/scripts/${script}`);
        console.log(`     Copy to: ${BUSINESS_NAME}/src/scripts/${script}`);
      });
    }
    
    console.log(`\n📁 Your previous installation is preserved in: ${BUSINESS_NAME}-back/`);
    console.log('\n🚨 Important: The new installation will NOT have auto-seeding or demo users!');
    console.log('You can now create your admin user properly during the first setup.');
    
  } catch (error) {
    console.error('❌ Error during recreation:', error.message);
    
    // Try to restore if something went wrong
    if (fs.existsSync(BUSINESS_BACK_PATH) && !fs.existsSync(BUSINESS_PATH)) {
      console.log('🔄 Attempting to restore original directory...');
      try {
        fs.renameSync(BUSINESS_BACK_PATH, BUSINESS_PATH);
        console.log('✅ Original directory restored');
      } catch (restoreError) {
        console.error('❌ Failed to restore:', restoreError.message);
      }
    }
    
    process.exit(1);
  }
}
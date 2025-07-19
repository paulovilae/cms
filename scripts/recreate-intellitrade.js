#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Admin Script: Recreate IntelliTrade with Clean Payload Installation
 * 
 * This script:
 * 1. Renames current intellitrade directory to intellitrade-back
 * 2. Creates a fresh intellitrade directory
 * 3. Runs create-payload-app to get clean installation
 * 4. Preserves any custom plugins from the backup
 */

const CURRENT_DIR = process.cwd();
const INTELLITRADE_PATH = path.join(CURRENT_DIR, 'intellitrade');
const INTELLITRADE_BACK_PATH = path.join(CURRENT_DIR, 'intellitrade-back');

console.log('🚀 IntelliTrade Recreation Script');
console.log('================================');

// Step 1: Check if intellitrade directory exists
if (!fs.existsSync(INTELLITRADE_PATH)) {
  console.error('❌ Error: intellitrade directory not found');
  console.log('Current directory:', CURRENT_DIR);
  console.log('Looking for:', INTELLITRADE_PATH);
  process.exit(1);
}

// Step 2: Check if intellitrade-back already exists
if (fs.existsSync(INTELLITRADE_BACK_PATH)) {
  console.log('⚠️  intellitrade-back directory already exists');
  console.log('Do you want to remove it and continue? (y/N)');
  
  // Simple prompt for confirmation
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Remove existing intellitrade-back? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('🗑️  Removing existing intellitrade-back...');
      fs.rmSync(INTELLITRADE_BACK_PATH, { recursive: true, force: true });
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
    // Step 3: Rename current intellitrade to intellitrade-back
    console.log('📁 Renaming intellitrade to intellitrade-back...');
    fs.renameSync(INTELLITRADE_PATH, INTELLITRADE_BACK_PATH);
    console.log('✅ Successfully renamed to intellitrade-back');

    // Step 4: Create fresh intellitrade directory
    console.log('📂 Creating fresh intellitrade directory...');
    fs.mkdirSync(INTELLITRADE_PATH);
    console.log('✅ Created fresh intellitrade directory');

    // Step 5: Run create-payload-app
    console.log('🎯 Running create-payload-app...');
    console.log('This will create a clean Payload installation...');
    
    // Change to intellitrade directory and run create-payload-app
    process.chdir(INTELLITRADE_PATH);
    
    console.log('📦 Executing: pnpx create-payload-app@latest .');
    execSync('pnpx create-payload-app@latest .', { 
      stdio: 'inherit',
      cwd: INTELLITRADE_PATH 
    });

    console.log('✅ Fresh Payload app created successfully!');
    
    // Step 6: Provide next steps
    console.log('\n🎉 Recreation Complete!');
    console.log('======================');
    console.log('Next steps:');
    console.log('1. cd intellitrade');
    console.log('2. Configure your admin user during first run');
    console.log('3. Install KYC plugin: npm install @paulovila/kyc-plugin');
    console.log('4. Copy any custom configurations from intellitrade-back if needed');
    console.log('\nYour previous installation is preserved in: intellitrade-back/');
    
  } catch (error) {
    console.error('❌ Error during recreation:', error.message);
    
    // Try to restore if something went wrong
    if (fs.existsSync(INTELLITRADE_BACK_PATH) && !fs.existsSync(INTELLITRADE_PATH)) {
      console.log('🔄 Attempting to restore original directory...');
      try {
        fs.renameSync(INTELLITRADE_BACK_PATH, INTELLITRADE_PATH);
        console.log('✅ Original directory restored');
      } catch (restoreError) {
        console.error('❌ Failed to restore:', restoreError.message);
      }
    }
    
    process.exit(1);
  }
}
#!/usr/bin/env node

const ConfigLoader = require('../config/config-loader');
const path = require('path');
const fs = require('fs');

/**
 * Setup Business Environment Script
 * Generates .env files for business applications from centralized configuration
 */

function setupBusinessEnv(businessName) {
  console.log(`🔧 Setting up environment for ${businessName}...`);
  
  const configLoader = new ConfigLoader();
  const businessDir = path.join(__dirname, '..', 'apps', businessName);
  const envPath = path.join(businessDir, '.env');
  
  // Check if business directory exists
  if (!fs.existsSync(businessDir)) {
    console.error(`❌ Business directory '${businessName}' does not exist`);
    process.exit(1);
  }
  
  // Generate .env file
  configLoader.generateBusinessEnv(businessName, envPath);
  
  // Display configuration summary
  const config = configLoader.getBusinessConfig(businessName);
  console.log(`\n📋 Configuration Summary for ${businessName}:`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Domain: ${config.domain}`);
  console.log(`   Database: ${config.dbName}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   .env file: ${envPath}`);
  
  return config;
}

function setupAllBusinessEnvs() {
  console.log('🚀 Setting up environments for all business applications...\n');
  
  const businesses = ['intellitrade', 'salarium', 'latinos', 'capacita', 'cms'];
  const configs = {};
  
  businesses.forEach(business => {
    try {
      configs[business] = setupBusinessEnv(business);
      console.log(`✅ ${business} environment configured\n`);
    } catch (error) {
      console.error(`❌ Failed to setup ${business}:`, error.message);
    }
  });
  
  return configs;
}

function generateDockerCompose() {
  console.log('🐳 Generating Docker Compose configuration...');
  
  const configLoader = new ConfigLoader();
  const dockerComposePath = path.join(__dirname, '..', 'docker-compose.yml');
  
  configLoader.generateDockerCompose(dockerComposePath);
  
  console.log('✅ Docker Compose configuration generated');
}

function showUsage() {
  console.log(`
Usage: node setup-business-env.js [command] [business-name]

Commands:
  setup <business>    Setup environment for specific business
  setup-all          Setup environments for all businesses
  docker             Generate Docker Compose configuration
  help               Show this help message

Business names:
  intellitrade       IntelliTrade application
  salarium          Salarium application
  latinos           Latinos application
  capacita          Capacita application
  cms               CMS Admin application

Examples:
  node setup-business-env.js setup intellitrade
  node setup-business-env.js setup-all
  node setup-business-env.js docker
`);
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];
const businessName = args[1];

switch (command) {
  case 'setup':
    if (!businessName) {
      console.error('❌ Please specify a business name');
      showUsage();
      process.exit(1);
    }
    setupBusinessEnv(businessName);
    break;
    
  case 'setup-all':
    setupAllBusinessEnvs();
    generateDockerCompose();
    break;
    
  case 'docker':
    generateDockerCompose();
    break;
    
  case 'help':
  case '--help':
  case '-h':
    showUsage();
    break;
    
  default:
    if (!command) {
      console.log('🔧 Business Environment Setup Tool\n');
      showUsage();
    } else {
      console.error(`❌ Unknown command: ${command}`);
      showUsage();
      process.exit(1);
    }
}
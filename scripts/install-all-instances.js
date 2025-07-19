#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const businesses = [
  {
    "name": "latinos",
    "port": 3003,
    "domain": "latinos.paulovila.org"
  },
  {
    "name": "intellitrade",
    "port": 3004,
    "domain": "intellitrade.paulovila.org"
  },
  {
    "name": "salarium",
    "port": 3005,
    "domain": "salarium.paulovila.org"
  },
  {
    "name": "capacita",
    "port": 3007,
    "domain": "capacita.paulovila.org"
  },
  {
    "name": "cms-admin",
    "port": 3006,
    "domain": "cms.paulovila.org"
  }
];

console.log('📦 Installing dependencies for all instances...');

businesses.forEach(business => {
  console.log(`Installing dependencies for ${business.name}...`);
  const instanceDir = path.join(__dirname, '..', 'instances', business.name);
  
  try {
    execSync('npm install', { 
      cwd: instanceDir, 
      stdio: 'inherit' 
    });
    console.log(`   ✅ ${business.name} dependencies installed`);
  } catch (error) {
    console.error(`   ❌ Failed to install ${business.name} dependencies`);
  }
});

console.log('✅ All dependencies installed!');

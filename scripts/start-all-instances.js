#!/usr/bin/env node

const { spawn } = require('child_process');
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

console.log('🚀 Starting all business instances...');

const processes = [];

businesses.forEach(business => {
  console.log(`Starting ${business.name} on port ${business.port}...`);
  
  const instanceDir = path.join(__dirname, '..', 'instances', business.name);
  const process = spawn('npm', ['run', 'dev'], {
    cwd: instanceDir,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' }
  });
  
  processes.push({ name: business.name, process });
});

console.log('✅ All instances started!');
console.log('📊 Access points:');
businesses.forEach(b => {
  console.log(`   ${b.name}: http://localhost:${b.port}`);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping all instances...');
  processes.forEach(p => p.process.kill());
  process.exit(0);
});

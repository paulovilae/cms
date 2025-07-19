#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🛑 Stopping all business instances...');

try {
  execSync('pkill -f "next dev"', { stdio: 'inherit' });
  console.log('✅ All instances stopped!');
} catch (error) {
  console.log('ℹ️  No running instances found');
}

#!/usr/bin/env node

/**
 * Create Independent Business Instances
 * Creates separate physical directories for each business to run simultaneously
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const businesses = [
  { name: 'latinos', port: 3003, domain: 'latinos.paulovila.org' },
  { name: 'intellitrade', port: 3004, domain: 'intellitrade.paulovila.org' },
  { name: 'salarium', port: 3005, domain: 'salarium.paulovila.org' },
  { name: 'capacita', port: 3007, domain: 'capacita.paulovila.org' },
  { name: 'cms-admin', port: 3006, domain: 'cms.paulovila.org' }
];

async function createIndependentInstances() {
  console.log('🏗️  Creating independent business instances...\n');

  // Create instances directory
  const instancesDir = path.join(process.cwd(), 'instances');
  if (!fs.existsSync(instancesDir)) {
    fs.mkdirSync(instancesDir, { recursive: true });
  }

  for (const business of businesses) {
    console.log(`📦 Creating ${business.name} instance...`);
    
    // Create business instance directory
    const businessDir = path.join(instancesDir, business.name);
    if (fs.existsSync(businessDir)) {
      console.log(`   ⚠️  ${business.name} instance already exists, skipping...`);
      continue;
    }

    fs.mkdirSync(businessDir, { recursive: true });

    // Copy CMS template
    try {
      execSync(`cp -r cms/cms-sqlite/* ${businessDir}/`, { stdio: 'inherit' });
      console.log(`   ✅ Copied CMS template to instances/${business.name}/`);
    } catch (error) {
      console.error(`   ❌ Failed to copy template: ${error.message}`);
      continue;
    }

    // Update package.json for this business
    const packageJsonPath = path.join(businessDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.name = `${business.name}-cms`;
    packageJson.scripts.dev = `cross-env NODE_OPTIONS=--no-deprecation BUSINESS_MODE=${business.name} PORT=${business.port} next dev -p ${business.port}`;
    packageJson.scripts.start = `cross-env NODE_OPTIONS=--no-deprecation BUSINESS_MODE=${business.name} PORT=${business.port} next start -p ${business.port}`;
    packageJson.scripts.build = `cross-env NODE_OPTIONS=--no-deprecation BUSINESS_MODE=${business.name} next build`;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`   ✅ Updated package.json for ${business.name}`);

    // Create business-specific .env
    const envPath = path.join(businessDir, '.env');
    const envContent = `# ${business.name.toUpperCase()} Environment Configuration
NODE_ENV=development
BUSINESS_MODE=${business.name}
PORT=${business.port}
DOMAIN=${business.domain}

# Database (relative to instance directory)
DATABASE_URI=sqlite://./databases/${business.name}.db

# Payload
PAYLOAD_SECRET=your-secret-here-${business.name}
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:${business.port}

# Business-specific settings
BUSINESS_NAME=${business.name}
BUSINESS_PORT=${business.port}
BUSINESS_DOMAIN=${business.domain}

# Shared plugins path (relative to instance)
PLUGINS_PATH=../../plugins
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log(`   ✅ Created .env for ${business.name}`);

    // Create databases directory
    const dbDir = path.join(businessDir, 'databases');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Create media directory
    const mediaDir = path.join(businessDir, 'media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    // Update payload.config.ts to use shared plugins
    updatePayloadConfig(businessDir, business);

    console.log(`   ✅ ${business.name} instance created!\n`);
  }

  // Create management scripts
  createManagementScripts();
  
  console.log('🎉 Independent instances setup complete!');
  console.log('\n📋 To run multiple businesses simultaneously:');
  console.log('1. cd instances/intellitrade && npm install && npm run dev');
  console.log('2. cd instances/salarium && npm install && npm run dev');
  console.log('3. cd instances/latinos && npm install && npm run dev');
  console.log('\n🔧 Or use management scripts:');
  console.log('- npm run start-all-instances');
  console.log('- npm run stop-all-instances');
}

function updatePayloadConfig(businessDir, business) {
  const configPath = path.join(businessDir, 'src/payload.config.ts');
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Update plugins import to use shared plugins
  configContent = configContent.replace(
    /import.*plugins.*from.*['"].*plugins.*['"];?/g,
    `import { orchestratorPlugin } from '../../plugins/core/orchestrator';`
  );
  
  // Ensure orchestrator plugin is configured for this business
  if (!configContent.includes('orchestratorPlugin')) {
    configContent = configContent.replace(
      /plugins:\s*\[/,
      `plugins: [
    orchestratorPlugin({
      enabled: true,
      businessMode: '${business.name}',
      debug: process.env.NODE_ENV === 'development',
    }),`
    );
  }
  
  fs.writeFileSync(configPath, configContent);
  console.log(`   ✅ Updated payload.config.ts for ${business.name}`);
}

function createManagementScripts() {
  // Add scripts to main package.json
  const mainPackageJsonPath = path.join(process.cwd(), 'package.json');
  const mainPackageJson = JSON.parse(fs.readFileSync(mainPackageJsonPath, 'utf8'));
  
  mainPackageJson.scripts = {
    ...mainPackageJson.scripts,
    'start-all-instances': 'node scripts/start-all-instances.js',
    'stop-all-instances': 'node scripts/stop-all-instances.js',
    'install-all-instances': 'node scripts/install-all-instances.js'
  };
  
  fs.writeFileSync(mainPackageJsonPath, JSON.stringify(mainPackageJson, null, 2));

  // Create start all instances script
  const startScript = `#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const businesses = ${JSON.stringify(businesses, null, 2)};

console.log('🚀 Starting all business instances...');

const processes = [];

businesses.forEach(business => {
  console.log(\`Starting \${business.name} on port \${business.port}...\`);
  
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
  console.log(\`   \${b.name}: http://localhost:\${b.port}\`);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping all instances...');
  processes.forEach(p => p.process.kill());
  process.exit(0);
});
`;

  fs.writeFileSync('scripts/start-all-instances.js', startScript);
  execSync('chmod +x scripts/start-all-instances.js');

  // Create stop all instances script
  const stopScript = `#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🛑 Stopping all business instances...');

try {
  execSync('pkill -f "next dev"', { stdio: 'inherit' });
  console.log('✅ All instances stopped!');
} catch (error) {
  console.log('ℹ️  No running instances found');
}
`;

  fs.writeFileSync('scripts/stop-all-instances.js', stopScript);
  execSync('chmod +x scripts/stop-all-instances.js');

  // Create install all instances script
  const installScript = `#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const businesses = ${JSON.stringify(businesses, null, 2)};

console.log('📦 Installing dependencies for all instances...');

businesses.forEach(business => {
  console.log(\`Installing dependencies for \${business.name}...\`);
  const instanceDir = path.join(__dirname, '..', 'instances', business.name);
  
  try {
    execSync('npm install', { 
      cwd: instanceDir, 
      stdio: 'inherit' 
    });
    console.log(\`   ✅ \${business.name} dependencies installed\`);
  } catch (error) {
    console.error(\`   ❌ Failed to install \${business.name} dependencies\`);
  }
});

console.log('✅ All dependencies installed!');
`;

  fs.writeFileSync('scripts/install-all-instances.js', installScript);
  execSync('chmod +x scripts/install-all-instances.js');

  console.log('   ✅ Management scripts created');
}

// Run the setup
createIndependentInstances().catch(console.error);
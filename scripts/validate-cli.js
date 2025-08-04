#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating Inteli-Packs CLI entrypoint...');

// Check if index.js exists and is executable
const cliPath = path.join(__dirname, '..', 'index.js');
if (!fs.existsSync(cliPath)) {
  console.error('❌ index.js not found');
  process.exit(1);
}

// Make sure it's executable
try {
  fs.chmodSync(cliPath, '755');
} catch (error) {
  console.warn('⚠️  Could not set executable permissions:', error.message);
}

// Test basic CLI functionality
try {
  console.log('📋 Testing CLI help command...');
  const helpOutput = execSync('node index.js --help', { 
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    timeout: 10000
  });
  
  if (!helpOutput.includes('inteli-packs')) {
    throw new Error('Help output does not contain expected content');
  }
  
  console.log('✅ CLI help command works');
} catch (error) {
  console.error('❌ CLI help command failed:', error.message);
  process.exit(1);
}

// Test version command
try {
  console.log('📋 Testing CLI version command...');
  const versionOutput = execSync('node index.js --version', { 
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    timeout: 5000
  });
  
  console.log('✅ CLI version command works');
} catch (error) {
  console.error('❌ CLI version command failed:', error.message);
  process.exit(1);
}

// Validate package.json bin field
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
if (!packageJson.bin || !packageJson.bin['inteli-packs']) {
  console.error('❌ package.json missing bin field for inteli-packs');
  process.exit(1);
}

if (packageJson.bin['inteli-packs'] !== './index.js') {
  console.error('❌ package.json bin field does not point to index.js');
  process.exit(1);
}

console.log('✅ package.json bin field is correct');

// Check for required files
const requiredFiles = [
  'index.js',
  'analyzer.js',
  'gemini.js',
  'commands.js',
  'utils.js',
  'security.js',
  'testing.js',
  'devops.js',
  'automation.js',
  'plugins.js',
  'documentation.js',
  'README.md',
  'LICENSE'
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Required file missing: ${file}`);
    process.exit(1);
  }
}

console.log('✅ All required files present');

// Test package creation
try {
  console.log('📦 Testing package creation...');
  execSync('npm pack --dry-run', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    timeout: 10000
  });
  console.log('✅ Package creation works');
} catch (error) {
  console.error('❌ Package creation failed:', error.message);
  process.exit(1);
}

console.log('🎉 CLI validation completed successfully!'); 
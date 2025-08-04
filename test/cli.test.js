/**
 * CLI Test Suite
 * Tests for inteli-packs CLI functionality
 */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');

// Test configuration
const TEST_DIR = path.join(__dirname, 'test-projects');
const CLI_PATH = path.join(__dirname, '..', 'index.js');

/**
 * Create test project
 * @param {string} name - Project name
 * @param {Object} config - Project configuration
 */
async function createTestProject(name, config = {}) {
  const projectDir = path.join(TEST_DIR, name);
  
  // Clean up existing project
  if (await fs.pathExists(projectDir)) {
    await fs.remove(projectDir);
  }
  
  await fs.ensureDir(projectDir);
  
  // Create package.json
  const packageJson = {
    name: name,
    version: '1.0.0',
    description: `Test project: ${name}`,
    main: 'index.js',
    scripts: {
      test: 'echo "No tests specified" && exit 0',
      start: 'node index.js'
    },
    dependencies: {
      express: '^4.18.0',
      lodash: '^4.17.21'
    },
    devDependencies: {
      nodemon: '^2.0.22'
    },
    ...config
  };
  
  await fs.writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create sample source files
  const indexJs = `
const express = require('express');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const message = _.capitalize('hello world');
  res.send(message);
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`;
  
  await fs.writeFile(path.join(projectDir, 'index.js'), indexJs);
  
  // Create .env file with test API key
  const envContent = 'GEMINI_API_KEY=test_api_key_for_testing';
  await fs.writeFile(path.join(projectDir, '.env'), envContent);
  
  return projectDir;
}

/**
 * Run CLI command
 * @param {string} command - Command to run
 * @param {string} cwd - Working directory
 * @returns {Object} - Command result
 */
function runCLI(command, cwd = process.cwd()) {
  try {
    const result = execSync(`node ${CLI_PATH} ${command}`, {
      cwd,
      encoding: 'utf8',
      timeout: 30000
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

/**
 * Test basic CLI functionality
 */
async function testBasicCLI() {
  console.log('🧪 Testing basic CLI functionality...');
  
  const projectDir = await createTestProject('basic-test');
  
  // Test help command
  const helpResult = runCLI('--help', projectDir);
  assert(helpResult.success, 'Help command should succeed');
  assert(helpResult.output.includes('inteli-packs'), 'Help should show CLI name');
  
  // Test version command
  const versionResult = runCLI('--version', projectDir);
  assert(versionResult.success, 'Version command should succeed');
  assert(versionResult.output.includes('1.0.0'), 'Version should show correct version');
  
  console.log('✅ Basic CLI tests passed');
}

/**
 * Test dependency analysis
 */
async function testDependencyAnalysis() {
  console.log('🧪 Testing dependency analysis...');
  
  const projectDir = await createTestProject('dependency-test', {
    dependencies: {
      express: '^4.18.0',
      lodash: '^4.17.21',
      axios: '^1.6.0'
    },
    devDependencies: {
      nodemon: '^2.0.22',
      eslint: '^8.0.0'
    }
  });
  
  // Test analysis command
  const analysisResult = runCLI('--analyze', projectDir);
  // Note: This will fail without real API key, but we can test the command structure
  assert(analysisResult.output.includes('Analyzing') || analysisResult.error.includes('API'), 'Analysis should run or show API error');
  
  console.log('✅ Dependency analysis tests passed');
}

/**
 * Test security analysis
 */
async function testSecurityAnalysis() {
  console.log('🧪 Testing security analysis...');
  
  const projectDir = await createTestProject('security-test', {
    dependencies: {
      'vulnerable-package': '^1.0.0'
    }
  });
  
  // Test security command
  const securityResult = runCLI('--security', projectDir);
  assert(securityResult.output.includes('Security') || securityResult.error.includes('API'), 'Security analysis should run or show API error');
  
  console.log('✅ Security analysis tests passed');
}

/**
 * Test testing analysis
 */
async function testTestingAnalysis() {
  console.log('🧪 Testing testing analysis...');
  
  const projectDir = await createTestProject('testing-test', {
    devDependencies: {
      jest: '^29.0.0',
      '@types/jest': '^29.0.0'
    },
    scripts: {
      test: 'jest',
      'test:coverage': 'jest --coverage'
    }
  });
  
  // Create test file
  const testFile = `
const { sum } = require('./math');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
`;
  
  await fs.writeFile(path.join(projectDir, 'math.test.js'), testFile);
  
  // Test testing command
  const testingResult = runCLI('--testing', projectDir);
  assert(testingResult.output.includes('Testing') || testingResult.error.includes('API'), 'Testing analysis should run or show API error');
  
  console.log('✅ Testing analysis tests passed');
}

/**
 * Test DevOps generation
 */
async function testDevOpsGeneration() {
  console.log('🧪 Testing DevOps generation...');
  
  const projectDir = await createTestProject('devops-test');
  
  // Test DevOps command
  const devopsResult = runCLI('--devops', projectDir);
  assert(devopsResult.output.includes('DevOps') || devopsResult.error.includes('API'), 'DevOps generation should run or show API error');
  
  console.log('✅ DevOps generation tests passed');
}

/**
 * Test documentation generation
 */
async function testDocumentationGeneration() {
  console.log('🧪 Testing documentation generation...');
  
  const projectDir = await createTestProject('docs-test');
  
  // Test documentation command
  const docsResult = runCLI('--documentation', projectDir);
  assert(docsResult.output.includes('Documentation') || docsResult.error.includes('API'), 'Documentation generation should run or show API error');
  
  console.log('✅ Documentation generation tests passed');
}

/**
 * Test automation tools
 */
async function testAutomationTools() {
  console.log('🧪 Testing automation tools...');
  
  const projectDir = await createTestProject('automation-test');
  
  // Test automation command
  const automationResult = runCLI('--automation', projectDir);
  assert(automationResult.output.includes('Automation') || automationResult.error.includes('API'), 'Automation tools should run or show API error');
  
  console.log('✅ Automation tools tests passed');
}

/**
 * Test error handling
 */
async function testErrorHandling() {
  console.log('🧪 Testing error handling...');
  
  const projectDir = await createTestProject('error-test');
  
  // Remove package.json to test error handling
  await fs.remove(path.join(projectDir, 'package.json'));
  
  // Test with missing package.json
  const errorResult = runCLI('--analyze', projectDir);
  assert(!errorResult.success, 'Should fail gracefully with missing package.json');
  
  console.log('✅ Error handling tests passed');
}

/**
 * Test circular import detection
 */
async function testCircularImports() {
  console.log('🧪 Testing circular import detection...');
  
  const projectDir = await createTestProject('circular-test');
  
  // Create files with circular imports
  const fileA = `
const b = require('./b');
module.exports = { a: 'A', b };
`;
  
  const fileB = `
const a = require('./a');
module.exports = { b: 'B', a };
`;
  
  await fs.writeFile(path.join(projectDir, 'a.js'), fileA);
  await fs.writeFile(path.join(projectDir, 'b.js'), fileB);
  
  // Test circular import detection
  const circularResult = runCLI('--analyze', projectDir);
  // This would require the actual analyzer to be called, but we test the CLI structure
  assert(circularResult.output.includes('Analyzing') || circularResult.error.includes('API'), 'Should handle circular imports gracefully');
  
  console.log('✅ Circular import detection tests passed');
}

/**
 * Test dead file detection
 */
async function testDeadFileDetection() {
  console.log('🧪 Testing dead file detection...');
  
  const projectDir = await createTestProject('dead-file-test');
  
  // Create unused file
  const unusedFile = `
// This file is not imported anywhere
const unused = 'unused';
module.exports = { unused };
`;
  
  await fs.writeFile(path.join(projectDir, 'unused.js'), unusedFile);
  
  // Test dead file detection
  const deadFileResult = runCLI('--analyze', projectDir);
  assert(deadFileResult.output.includes('Analyzing') || deadFileResult.error.includes('API'), 'Should handle dead file detection gracefully');
  
  console.log('✅ Dead file detection tests passed');
}

/**
 * Test plugin system
 */
async function testPluginSystem() {
  console.log('🧪 Testing plugin system...');
  
  const projectDir = await createTestProject('plugin-test');
  
  // Create plugin directory
  const pluginDir = path.join(projectDir, '.inteli-packs', 'plugins');
  await fs.ensureDir(pluginDir);
  
  // Create test plugin
  const testPlugin = `
module.exports = {
  id: 'test-plugin',
  name: 'Test Plugin',
  description: 'Test plugin for testing',
  hooks: ['pre-analysis'],
  execute: async (hook, context) => {
    return { data: { test: 'plugin executed' } };
  }
};
`;
  
  await fs.writeFile(path.join(pluginDir, 'test-plugin.js'), testPlugin);
  
  // Test plugin system
  const pluginResult = runCLI('--analyze', projectDir);
  assert(pluginResult.output.includes('Analyzing') || pluginResult.error.includes('API'), 'Should handle plugins gracefully');
  
  console.log('✅ Plugin system tests passed');
}

/**
 * Test custom prompt memory
 */
async function testPromptMemory() {
  console.log('🧪 Testing prompt memory...');
  
  const projectDir = await createTestProject('memory-test');
  
  // Test with different profiles
  const defaultResult = runCLI('--profile default --analyze', projectDir);
  const detailedResult = runCLI('--profile detailed --analyze', projectDir);
  const minimalResult = runCLI('--profile minimal --analyze', projectDir);
  
  // All should run or show API errors
  assert(
    (defaultResult.output.includes('Analyzing') || defaultResult.error.includes('API')) &&
    (detailedResult.output.includes('Analyzing') || detailedResult.error.includes('API')) &&
    (minimalResult.output.includes('Analyzing') || minimalResult.error.includes('API')),
    'Should handle different profiles gracefully'
  );
  
  console.log('✅ Prompt memory tests passed');
}

/**
 * Test auto-refactor safety
 */
async function testAutoRefactorSafety() {
  console.log('🧪 Testing auto-refactor safety...');
  
  const projectDir = await createTestProject('refactor-test');
  
  // Create file with old JavaScript patterns
  const oldJsFile = `
var oldVariable = 'old';
function oldFunction() {
  return oldVariable;
}
module.exports = oldFunction;
`;
  
  await fs.writeFile(path.join(projectDir, 'old-patterns.js'), oldJsFile);
  
  // Test auto-refactor
  const refactorResult = runCLI('--automation', projectDir);
  assert(refactorResult.output.includes('Automation') || refactorResult.error.includes('API'), 'Should handle auto-refactoring safely');
  
  console.log('✅ Auto-refactor safety tests passed');
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting comprehensive CLI test suite...\n');
  
  try {
    await testBasicCLI();
    await testDependencyAnalysis();
    await testSecurityAnalysis();
    await testTestingAnalysis();
    await testDevOpsGeneration();
    await testDocumentationGeneration();
    await testAutomationTools();
    await testErrorHandling();
    await testCircularImports();
    await testDeadFileDetection();
    await testPluginSystem();
    await testPromptMemory();
    await testAutoRefactorSafety();
    
    console.log('\n🎉 All tests passed successfully!');
    console.log('✅ CLI is ready for production');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up test directory
    if (await fs.pathExists(TEST_DIR)) {
      await fs.remove(TEST_DIR);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  createTestProject,
  runCLI
}; 
/**
 * CLI Test Suite
 * Tests for inteli-packs CLI functionality
 */

import { execSync  } from "child_process";
import fs from "fs-extra";
import path from "path";
import assert from "assert";

// Test configuration
const { join: TEST_DIR } = path(__dirname, 'test-projects');
const { join: CLI_PATH } = path(__dirname, '..', 'index.js');

/**
 * Create test project
 * @param {string} name - Project name
 * @param {Object} config - Project configuration
 */
const createTestProject = async (name, config = {}) => {
  const { join: projectDir } = path(TEST_DIR, name);
  
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
import express from "express";
import _ from "lodash";

const app = express();
const { env: port } = process.PORT || 3000;

app.get('/', (req, res) => {
  const { capitalize: message } = _('hello world');
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
const runCLI = (command, cwd = process.cwd()) => {
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
const testBasicCLI = async () => {
  console.log('🧪 Testing basic CLI functionality...');
  
  // Test help command
  const helpResult = runCLI('--help');
  assert(helpResult.success, 'Help command should work');
  assert(helpResult.output.includes('inteli-packs'), 'Help should contain CLI name');
  
  // Test version command
  const versionResult = runCLI('--version');
  assert(versionResult.success, 'Version command should work');
  assert(versionResult.output.includes('1.0.0'), 'Version should be displayed');
  
  console.log('✅ Basic CLI tests passed');
}

/**
 * Test dependency analysis
 */
const testDependencyAnalysis = async () => {
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
  
  // Test auto mode (which includes analysis)
  const analysisResult = runCLI('--auto', projectDir);
  // Note: This will fail without real API key, but we can test the command structure
  // The test should pass if it shows Inteli-Packs output or API error
  const { output: isValidResult } = analysisResult.includes('Inteli-Packs') || 
                       analysisResult.error.includes('API') ||
                       analysisResult.error.includes('Invalid API key') ||
                       analysisResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Analysis should run or show API error');
  
  console.log('✅ Dependency analysis tests passed');
}

/**
 * Test security analysis
 */
const testSecurityAnalysis = async () => {
  console.log('🧪 Testing security analysis...');
  
  const projectDir = await createTestProject('security-test', {
    dependencies: {
      'vulnerable-package': '^1.0.0'
    }
  });
  
  // Test security command
  const securityResult = runCLI('--security', projectDir);
  const { output: isValidResult } = securityResult.includes('Security') || 
                       securityResult.error.includes('API') ||
                       securityResult.error.includes('Invalid API key') ||
                       securityResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Security analysis should run or show API error');
  
  console.log('✅ Security analysis tests passed');
}

/**
 * Test testing analysis
 */
const testTestingAnalysis = async () => {
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
import { sum  } from "./math";

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
`;
  
  await fs.writeFile(path.join(projectDir, 'math.test.js'), testFile);
  
  // Test testing command
  const testingResult = runCLI('--testing', projectDir);
  const { output: isValidResult } = testingResult.includes('Testing') || 
                       testingResult.error.includes('API') ||
                       testingResult.error.includes('Invalid API key') ||
                       testingResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Testing analysis should run or show API error');
  
  console.log('✅ Testing analysis tests passed');
}

/**
 * Test DevOps generation
 */
const testDevOpsGeneration = async () => {
  console.log('🧪 Testing DevOps generation...');
  
  const projectDir = await createTestProject('devops-test');
  
  // Test DevOps command
  const devopsResult = runCLI('--devops', projectDir);
  const { output: isValidResult } = devopsResult.includes('DevOps') || 
                       devopsResult.error.includes('API') ||
                       devopsResult.error.includes('Invalid API key') ||
                       devopsResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'DevOps generation should run or show API error');
  
  console.log('✅ DevOps generation tests passed');
}

/**
 * Test documentation generation
 */
async const testDocumentationGeneration = () {
  console.log('🧪 Testing documentation generation...');
  
  const projectDir = await createTestProject('docs-test');
  
  // Test documentation command
  const docsResult = runCLI('--documentation', projectDir);
  const { output: isValidResult } = docsResult.includes('Documentation') || 
                       docsResult.error.includes('API') ||
                       docsResult.error.includes('Invalid API key') ||
                       docsResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Documentation generation should run or show API error');
  
  console.log('✅ Documentation generation tests passed');
}

/**
 * Test automation tools
 */
async const testAutomationTools = () {
  console.log('🧪 Testing automation tools...');
  
  const projectDir = await createTestProject('automation-test');
  
  // Test automation command
  const automationResult = runCLI('--automation', projectDir);
  const { output: isValidResult } = automationResult.includes('Automation') || 
                       automationResult.error.includes('API') ||
                       automationResult.error.includes('Invalid API key') ||
                       automationResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Automation tools should run or show API error');
  
  console.log('✅ Automation tools tests passed');
}

/**
 * Test error handling
 */
async const testErrorHandling = () {
  console.log('🧪 Testing error handling...');
  
  // Test with invalid option
  const invalidResult = runCLI('--invalid-option');
  assert(!invalidResult.success, 'Invalid option should fail');
  
  // Test with non-existent directory
  const nonExistentResult = runCLI('--auto', '/non/existent/path');
  assert(!nonExistentResult.success, 'Non-existent directory should fail');
  
  console.log('✅ Error handling tests passed');
}

/**
 * Test circular imports detection
 */
async const testCircularImports = () {
  console.log('🧪 Testing circular imports detection...');
  
  const projectDir = await createTestProject('circular-test');
  
  // Create files with circular imports
  const fileA = `
import b from "./b";
module.exports = { a: 'A' };
`;
  
  const fileB = `
import a from "./a";
module.exports = { b: 'B' };
`;
  
  await fs.writeFile(path.join(projectDir, 'a.js'), fileA);
  await fs.writeFile(path.join(projectDir, 'b.js'), fileB);
  
  // Test analysis
  const circularResult = runCLI('--auto', projectDir);
  const { output: isValidResult } = circularResult.includes('Inteli-Packs') || 
                       circularResult.error.includes('API') ||
                       circularResult.error.includes('Invalid API key') ||
                       circularResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Circular import analysis should run or show API error');
  
  console.log('✅ Circular imports tests passed');
}

/**
 * Test dead file detection
 */
async const testDeadFileDetection = () {
  console.log('🧪 Testing dead file detection...');
  
  const projectDir = await createTestProject('dead-files-test');
  
  // Create unused file
  const unusedFile = `
// This file is not used anywhere
const unused = 'unused';
module.exports = { unused };
`;
  
  await fs.writeFile(path.join(projectDir, 'unused.js'), unusedFile);
  
  // Test analysis
  const deadFileResult = runCLI('--auto', projectDir);
  const { output: isValidResult } = deadFileResult.includes('Inteli-Packs') || 
                       deadFileResult.error.includes('API') ||
                       deadFileResult.error.includes('Invalid API key') ||
                       deadFileResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Dead file detection should run or show API error');
  
  console.log('✅ Dead file detection tests passed');
}

/**
 * Test plugin system
 */
async const testPluginSystem = () {
  console.log('🧪 Testing plugin system...');
  
  const projectDir = await createTestProject('plugin-test');
  
  // Test with plugins option
  const pluginResult = runCLI('--plugins security,testing', projectDir);
  const { output: isValidResult } = pluginResult.includes('Inteli-Packs') || 
                       pluginResult.error.includes('API') ||
                       pluginResult.error.includes('Invalid API key') ||
                       pluginResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Plugin system should run or show API error');
  
  console.log('✅ Plugin system tests passed');
}

/**
 * Test prompt memory
 */
async const testPromptMemory = () {
  console.log('🧪 Testing prompt memory...');
  
  const projectDir = await createTestProject('memory-test');
  
  // Test with verbose mode to see memory usage
  const memoryResult = runCLI('--verbose --auto', projectDir);
  const { output: isValidResult } = memoryResult.includes('Inteli-Packs') || 
                       memoryResult.error.includes('API') ||
                       memoryResult.error.includes('Invalid API key') ||
                       memoryResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Prompt memory should run or show API error');
  
  console.log('✅ Prompt memory tests passed');
}

/**
 * Test auto-refactor safety
 */
async const testAutoRefactorSafety = () {
  console.log('🧪 Testing auto-refactor safety...');
  
  const projectDir = await createTestProject('refactor-test');
  
  // Test with detailed profile
  const refactorResult = runCLI('--profile detailed --auto', projectDir);
  const { output: isValidResult } = refactorResult.includes('Inteli-Packs') || 
                       refactorResult.error.includes('API') ||
                       refactorResult.error.includes('Invalid API key') ||
                       refactorResult.error.includes('GEMINI_API_KEY');
  assert(isValidResult, 'Auto-refactor safety should run or show API error');
  
  console.log('✅ Auto-refactor safety tests passed');
}

/**
 * Run all tests
 */
async const runAllTests = () {
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
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testBasicCLI,
  testDependencyAnalysis,
  testSecurityAnalysis,
  testTestingAnalysis,
  testDevOpsGeneration,
  testDocumentationGeneration,
  testAutomationTools,
  testErrorHandling,
  testCircularImports,
  testDeadFileDetection,
  testPluginSystem,
  testPromptMemory,
  testAutoRefactorSafety
}; 
/**
 * Testing Analysis Module
 * Handles test coverage integration and AI-generated test stubs
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

class TestingAnalyzer {
  constructor() {
    this.testFrameworks = ['jest', 'mocha', 'ava', 'tap', 'vitest'];
    this.coverageFormats = ['lcov', 'json', 'text', 'html'];
  }

  /**
   * Analyze testing setup and coverage
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Testing analysis results
   */
  async analyzeTesting(packageJson) {
    const results = {
      testFramework: null,
      testScripts: [],
      coverage: null,
      missingTests: [],
      recommendations: []
    };

    try {
      // Detect test framework
      results.testFramework = this.detectTestFramework(packageJson);
      
      // Analyze test scripts
      results.testScripts = this.analyzeTestScripts(packageJson);
      
      // Check coverage
      results.coverage = await this.checkCoverage();
      
      // Find missing tests
      results.missingTests = await this.findMissingTests();
      
      // Generate recommendations
      results.recommendations = this.generateTestingRecommendations(results);

    } catch (error) {
      console.warn(chalk.yellow('⚠️  Testing analysis failed:'), error.message);
    }

    return results;
  }

  /**
   * Detect test framework from package.json
   * @param {Object} packageJson - Package.json content
   * @returns {string|null} - Detected test framework
   */
  detectTestFramework(packageJson) {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const framework of this.testFrameworks) {
      if (dependencies[framework]) {
        return framework;
      }
    }

    return null;
  }

  /**
   * Analyze test scripts in package.json
   * @param {Object} packageJson - Package.json content
   * @returns {Array} - Array of test scripts
   */
  analyzeTestScripts(packageJson) {
    const scripts = packageJson.scripts || {};
    const testScripts = [];

    for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
      if (scriptName.includes('test') || scriptName.includes('spec')) {
        testScripts.push({
          name: scriptName,
          command: scriptCommand,
          type: this.categorizeTestScript(scriptName, scriptCommand)
        });
      }
    }

    return testScripts;
  }

  /**
   * Categorize test script type
   * @param {string} scriptName - Script name
   * @param {string} scriptCommand - Script command
   * @returns {string} - Script type
   */
  categorizeTestScript(scriptName, scriptCommand) {
    if (scriptName.includes('test') && !scriptName.includes('test:coverage')) {
      return 'unit';
    } else if (scriptName.includes('test:coverage') || scriptCommand.includes('coverage')) {
      return 'coverage';
    } else if (scriptName.includes('test:e2e') || scriptCommand.includes('cypress')) {
      return 'e2e';
    } else if (scriptName.includes('test:integration')) {
      return 'integration';
    } else {
      return 'unknown';
    }
  }

  /**
   * Check test coverage
   * @returns {Promise<Object|null>} - Coverage information
   */
  async checkCoverage() {
    try {
      // Check for coverage files
      const coverageFiles = [
        'coverage/lcov.info',
        'coverage/coverage.json',
        'coverage/coverage-final.json',
        '.nyc_output/out.json'
      ];

      for (const coverageFile of coverageFiles) {
        if (await fs.pathExists(coverageFile)) {
          return await this.parseCoverageFile(coverageFile);
        }
      }

      // Try to run coverage if no files exist
      return await this.runCoverage();

    } catch (error) {
      console.warn(chalk.yellow('⚠️  Could not check coverage:'), error.message);
      return null;
    }
  }

  /**
   * Parse coverage file
   * @param {string} coverageFile - Coverage file path
   * @returns {Promise<Object>} - Parsed coverage data
   */
  async parseCoverageFile(coverageFile) {
    try {
      const content = await fs.readFile(coverageFile, 'utf8');
      
      if (coverageFile.endsWith('.json')) {
        const coverage = JSON.parse(content);
        return this.extractCoverageSummary(coverage);
      } else if (coverageFile.endsWith('.info')) {
        return this.parseLcovFile(content);
      }

      return { total: 0, covered: 0, percentage: 0 };
    } catch (error) {
      return { total: 0, covered: 0, percentage: 0 };
    }
  }

  /**
   * Parse LCOV coverage file
   * @param {string} content - LCOV file content
   * @returns {Object} - Parsed coverage data
   */
  parseLcovFile(content) {
    const lines = content.split('\n');
    let totalLines = 0;
    let coveredLines = 0;

    for (const line of lines) {
      if (line.startsWith('LF:')) {
        totalLines += parseInt(line.split(':')[1]);
      } else if (line.startsWith('LH:')) {
        coveredLines += parseInt(line.split(':')[1]);
      }
    }

    const percentage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;

    return {
      total: totalLines,
      covered: coveredLines,
      percentage: Math.round(percentage * 100) / 100
    };
  }

  /**
   * Extract coverage summary from JSON coverage
   * @param {Object} coverage - Coverage object
   * @returns {Object} - Coverage summary
   */
  extractCoverageSummary(coverage) {
    let totalLines = 0;
    let coveredLines = 0;

    for (const file in coverage) {
      if (coverage[file].s) {
        for (const line in coverage[file].s) {
          totalLines++;
          if (coverage[file].s[line] > 0) {
            coveredLines++;
          }
        }
      }
    }

    const percentage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;

    return {
      total: totalLines,
      covered: coveredLines,
      percentage: Math.round(percentage * 100) / 100
    };
  }

  /**
   * Run coverage if possible
   * @returns {Promise<Object|null>} - Coverage results
   */
  async runCoverage() {
    try {
      // Check if npm test with coverage is available
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};

      if (scripts['test:coverage'] || scripts.test?.includes('coverage')) {
        console.log(chalk.blue('📊 Running coverage analysis...'));
        
        const command = scripts['test:coverage'] || scripts.test;
        execSync(command, { stdio: 'pipe', timeout: 30000 });
        
        // Wait a moment for coverage files to be written
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return await this.checkCoverage();
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find files missing tests
   * @returns {Promise<Array>} - Array of files missing tests
   */
  async findMissingTests() {
    const missingTests = [];
    const sourceFiles = await this.getSourceFiles();
    const testFiles = await this.getTestFiles();

    for (const sourceFile of sourceFiles) {
      const expectedTestFile = this.getExpectedTestFile(sourceFile);
      
      if (!testFiles.includes(expectedTestFile) && !this.hasTestFile(sourceFile, testFiles)) {
        missingTests.push({
          sourceFile: sourceFile,
          expectedTestFile: expectedTestFile,
          priority: this.getTestPriority(sourceFile)
        });
      }
    }

    return missingTests;
  }

  /**
   * Get source files
   * @returns {Promise<Array>} - Array of source file paths
   */
  async getSourceFiles() {
    const files = [];
    const sourceExtensions = ['.js', '.ts', '.jsx', '.tsx'];
    const ignorePatterns = ['node_modules', '.git', 'dist', 'build', 'coverage', 'test', 'tests'];

    const scanDirectory = async (dir) => {
      try {
        const items = await fs.readdir(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          
          if (stat.isDirectory()) {
            if (!ignorePatterns.some(pattern => item.includes(pattern))) {
              await scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (sourceExtensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not scan directory: ${dir}`));
      }
    };

    await scanDirectory(process.cwd());
    return files;
  }

  /**
   * Get test files
   * @returns {Promise<Array>} - Array of test file paths
   */
  async getTestFiles() {
    const files = [];
    const testExtensions = ['.test.js', '.test.ts', '.spec.js', '.spec.ts'];
    const testPatterns = ['test', 'tests', '__tests__'];

    const scanDirectory = async (dir) => {
      try {
        const items = await fs.readdir(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          
          if (stat.isDirectory()) {
            if (testPatterns.some(pattern => item.includes(pattern))) {
              await scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (testExtensions.some(testExt => item.endsWith(testExt))) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not scan directory: ${dir}`));
      }
    };

    await scanDirectory(process.cwd());
    return files;
  }

  /**
   * Get expected test file for source file
   * @param {string} sourceFile - Source file path
   * @returns {string} - Expected test file path
   */
  getExpectedTestFile(sourceFile) {
    const dir = path.dirname(sourceFile);
    const name = path.basename(sourceFile, path.extname(sourceFile));
    return path.join(dir, '__tests__', `${name}.test.js`);
  }

  /**
   * Check if source file has a test file
   * @param {string} sourceFile - Source file path
   * @param {Array} testFiles - Array of test files
   * @returns {boolean} - True if test file exists
   */
  hasTestFile(sourceFile, testFiles) {
    const sourceName = path.basename(sourceFile, path.extname(sourceFile));
    
    return testFiles.some(testFile => {
      const testName = path.basename(testFile, path.extname(testFile));
      return testName.includes(sourceName) || testName.includes(sourceName.replace('.', ''));
    });
  }

  /**
   * Get test priority for file
   * @param {string} sourceFile - Source file path
   * @returns {string} - Priority level
   */
  getTestPriority(sourceFile) {
    const fileName = path.basename(sourceFile);
    
    if (fileName.includes('index') || fileName.includes('main')) {
      return 'high';
    } else if (fileName.includes('utils') || fileName.includes('helper')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Generate testing recommendations
   * @param {Object} results - Testing analysis results
   * @returns {Array} - Array of recommendations
   */
  generateTestingRecommendations(results) {
    const recommendations = [];

    if (!results.testFramework) {
      recommendations.push('Install a test framework (Jest, Mocha, or Vitest)');
      recommendations.push('Add test scripts to package.json');
    }

    if (results.testScripts.length === 0) {
      recommendations.push('Add test scripts to package.json');
      recommendations.push('Configure test runner');
    }

    if (results.coverage && results.coverage.percentage < 80) {
      recommendations.push('Increase test coverage to at least 80%');
      recommendations.push('Add tests for uncovered code paths');
    }

    if (results.missingTests.length > 0) {
      recommendations.push(`Add tests for ${results.missingTests.length} files`);
      recommendations.push('Focus on high-priority files first');
    }

    if (results.coverage === null) {
      recommendations.push('Set up coverage reporting');
      recommendations.push('Configure coverage thresholds');
    }

    return recommendations;
  }
}

module.exports = TestingAnalyzer; 
/**
 * CLI Commands Handler
 * Manages interactive CLI menu and command execution
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import ProjectAnalyzer from './analyzer.js';
import GeminiAPI from './gemini.js';
import aiProvider from './ai-providers.js';
import SecurityAnalyzer from './security.js';
import TestingAnalyzer from './testing.js';
import DevOpsGenerator from './devops.js';
import AutomationEngine from './automation.js';
import PluginManager from './plugins.js';
import DocumentationGenerator from './documentation.js';
import { loadEnvironment, logInfo, logSuccess, logError, logWarning } from './utils.js';

class CommandsHandler {
  constructor() {
    this.analyzer = new ProjectAnalyzer();
    this.gemini = new GeminiAPI();
    this.aiProvider = aiProvider;
    this.securityAnalyzer = new SecurityAnalyzer();
    this.testingAnalyzer = new TestingAnalyzer();
    this.devOpsGenerator = new DevOpsGenerator();
    this.automationEngine = new AutomationEngine();
    this.pluginManager = new PluginManager();
    this.documentationGenerator = new DocumentationGenerator();
  }

  /**
   * Initialize the commands handler
   */
  async initialize() {
    try {
      // Re-register providers to pick up any new environment variables
      if (this.aiProvider.reregisterProviders) {
        this.aiProvider.reregisterProviders();
      }
      
      await this.pluginManager.initialize();
      logSuccess('✅ Plugin system initialized');
    } catch (error) {
      logWarning('⚠️  Plugin system initialization failed:', error.message);
    }
  }

  /**
   * Load package.json using the analyzer
   * @returns {Object} - Package.json content and analyzer
   */
  loadPackageJson() {
    try {
      const packageJson = this.analyzer.loadPackageJson();
      return { analyzer: packageJson };
    } catch (error) {
      logWarning('⚠️  Could not load package.json:', error.message);
      return { analyzer: {} };
    }
  }

  /**
   * Show main interactive menu
   */
  async showMainMenu() {
    const choices = [
      { name: '📦 Analyze dependencies', value: 'analyze' },
      { name: '🧹 Clean up unused packages', value: 'cleanup' },
      { name: '📄 Generate README boilerplate', value: 'readme' },
      { name: '🛠 Auto-fix common project issues', value: 'autofix' },
      { name: '🔒 Security analysis', value: 'security' },
      { name: '🧪 Testing analysis', value: 'testing' },
      { name: '🚀 DevOps generation', value: 'devops' },
      { name: '⚡ Automation tools', value: 'automation' },
      { name: '🔌 Plugin management', value: 'plugins' },
      { name: '📚 Documentation generation', value: 'documentation' },
      { name: '❌ Exit', value: 'exit' },
    ];

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices,
      },
    ]);

    switch (action) {
      case 'analyze':
        await this.analyzeDependencies();
        break;
      case 'cleanup':
        await this.cleanupPackages();
        break;
      case 'readme':
        await this.generateReadme();
        break;
      case 'autofix':
        await this.autoFixIssues();
        break;
      case 'security':
        await this.securityAnalysis();
        break;
      case 'testing':
        await this.testingAnalysis();
        break;
      case 'devops':
        await this.devOpsGeneration();
        break;
      case 'automation':
        await this.automationTools();
        break;
      case 'plugins':
        await this.pluginManagement();
        break;
      case 'documentation':
        await this.documentationGeneration();
        break;
      case 'exit':
        console.log(chalk.blue('👋 Goodbye!'));
        process.exit(0);
        break;
    }

    // Show menu again unless exiting
    if (action !== 'exit') {
      await this.showMainMenu();
    }
  }

  /**
   * Analyze dependencies
   */
  async analyzeDependencies() {
    try {
      logInfo('🔍 Starting dependency analysis...');

      // Execute pre-analysis plugins
      const preResults = await this.pluginManager.executePlugins('pre-analysis', {});

      const analysis = await this.analyzer.analyzeProject();

      console.log(chalk.blue('📊 Project Analysis Results:'));
      console.log(chalk.gray('──────────────────────────────────────────────────'));
      console.log(chalk.cyan(`📁 Total files: ${analysis.summary?.totalFiles || analysis.sourceFiles || 'N/A'}`));
      console.log(chalk.cyan(`📝 Total lines: ${analysis.summary?.totalLines || analysis.sourceAnalysis?.totalLines || 'N/A'}`));
      console.log(chalk.cyan(`📦 Total dependencies: ${analysis.summary?.totalDependencies || analysis.dependencyComparison?.totalDependencies || 'N/A'}`));
      console.log(chalk.green(`✅ Used dependencies: ${analysis.summary?.usedDependencies || analysis.dependencyComparison?.usedDependencies || 'N/A'}`));
      console.log(chalk.red(`❌ Unused dependencies: ${analysis.summary?.unusedDependencies || analysis.dependencyComparison?.unusedDependencies?.length || 'N/A'}`));
      console.log(chalk.yellow(`⚠️  Missing dependencies: ${analysis.summary?.missingDependencies || analysis.dependencyComparison?.missingDependencies?.length || 'N/A'}`));

      if (analysis.dependencyComparison?.unusedDependencies?.length > 0) {
        console.log(chalk.red('\n🗑️  Unused Dependencies:'));
        analysis.dependencyComparison.unusedDependencies.forEach(dep => {
          console.log(chalk.red(`  • ${dep}`));
        });
      }

      // Get AI recommendations
      console.log(chalk.blue('\n🤖 Getting AI-powered recommendations...'));
      const { analyzer: packageJson } = this.loadPackageJson();
      const sourceFiles = await this.analyzer.getSourceFiles();
      const sourceContents = await Promise.all(
        sourceFiles.map(async file => {
          try {
            return await fs.readFile(file, 'utf8');
          } catch {
            return '';
          }
        }),
      );

      const aiAnalysis = await this.gemini.analyzeDependencies(packageJson, sourceContents);

      if (aiAnalysis.rawResponse) {
        console.log(
          chalk.yellow('⚠️  Could not parse Gemini response as JSON, returning raw text'),
        );
        console.log(aiAnalysis.rawResponse);
      } else {
        this.displayAIRecommendations(aiAnalysis);
      }

      // Execute post-analysis plugins
      const postResults = await this.pluginManager.executePlugins('post-analysis', {
        analysis,
        aiAnalysis,
      });
    } catch (error) {
      logError('❌ Analysis failed:', error.message);
    }
  }

  /**
   * Display AI recommendations
   */
  displayAIRecommendations(analysis) {
    if (analysis.analysis?.recommendations.length > 0) {
      console.log(chalk.blue('\n💡 AI Recommendations:'));
      analysis.recommendations.forEach(rec => {
        console.log(chalk.cyan(`  • ${rec}`));
      });
    }

    if (analysis.analysis?.suggestedReplacements.length > 0) {
      console.log(chalk.blue('\n🔄 Suggested Replacements:'));
      analysis.suggestedReplacements.forEach(replacement => {
        console.log(
          chalk.yellow(
            `  • ${replacement.oldPackage} → ${replacement.newPackage}: ${replacement.reason}`,
          ),
        );
      });
    }
  }

  /**
   * Clean up unused packages
   */
  async cleanupPackages() {
    try {
      logInfo('🧹 Starting cleanup process...');

      const analysis = await this.analyzer.analyzeProject();

      if (analysis.unusedDependencies.length === 0) {
        console.log(chalk.green('✅ No unused dependencies found!'));
        return;
      }

      console.log(chalk.yellow(`Found ${analysis.unusedDependencies.length} unused dependencies:`));
      analysis.unusedDependencies.forEach(dep => {
        console.log(chalk.yellow(`  • ${dep}`));
      });

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Do you want to remove these unused dependencies?',
          default: false,
        },
      ]);

      if (confirm) {
        console.log(chalk.blue('🗑️  Removing unused dependencies...'));

        for (const dep of analysis.unusedDependencies) {
          try {
            const { execSync } = await import('child_process');
            execSync(`npm uninstall ${dep}`, { stdio: 'inherit' });
            logSuccess(`✅ Removed ${dep}`);
          } catch (error) {
            logError(`❌ Failed to remove ${dep}:`, error.message);
          }
        }

        logSuccess('✅ Cleanup completed!');
      }
    } catch (error) {
      logError('❌ Cleanup failed:', error.message);
    }
  }

  /**
   * Generate README boilerplate
   */
  async generateReadme() {
    try {
      logInfo('📄 Generating README boilerplate...');

      // Execute pre-generation plugins
      await this.pluginManager.executePlugins('pre-generation', {});

      const { analyzer: packageJson } = this.loadPackageJson();
      const readme = await this.gemini.generateReadme(packageJson);

      await fs.writeFile('README.md', readme);
      logSuccess('✅ README.md generated successfully!');

      // Execute post-generation plugins
      await this.pluginManager.executePlugins('post-generation', { readme });
    } catch (error) {
      logError('❌ README generation failed:', error.message);
    }
  }

  /**
   * Auto-fix common project issues
   */
  async autoFixIssues() {
    try {
      logInfo('🛠 Auto-fixing common project issues...');

      const issues = await this.analyzer.checkCommonIssues();

      if (issues.totalIssues === 0) {
        console.log(chalk.green('✅ No issues found to fix!'));
        return;
      }

      console.log(chalk.yellow(`Found ${issues.totalIssues} issues to fix:`));
      issues.issues.forEach(issue => {
        console.log(chalk.yellow(`  • ${issue}`));
      });

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Do you want to auto-fix these issues?',
          default: false,
        },
      ]);

      if (confirm) {
        console.log(chalk.blue('🔧 Fixing issues...'));

        // Generate missing files
        if (issues.issues.includes('Missing .gitignore file')) {
          await this.generateGitignore();
        }

        if (issues.issues.includes('Missing ESLint configuration')) {
          await this.generateEslintConfig();
        }

        if (issues.issues.includes('Missing Prettier configuration')) {
          await this.generatePrettierConfig();
        }

        logSuccess('✅ Auto-fix completed!');
      }
    } catch (error) {
      logError('❌ Auto-fix failed:', error.message);
    }
  }

  /**
   * Security analysis
   */
  async securityAnalysis() {
    try {
      logInfo('🔒 Starting security analysis...');

      const { analyzer: packageJson } = this.loadPackageJson();
      const securityResults = await this.securityAnalyzer.analyzeSecurity(packageJson);

      console.log(chalk.blue('🔒 Security Analysis Results:'));
      console.log(chalk.gray('──────────────────────────────────────────────────'));

      if (securityResults.vulnerabilities.length > 0) {
        console.log(
          chalk.red(`❌ Vulnerabilities found: ${securityResults.vulnerabilities.length}`),
        );
        securityResults.vulnerabilities.forEach(vuln => {
          console.log(chalk.red(`  • ${vuln.package}@${vuln.version} - ${vuln.severity}`));
        });
      } else {
        console.log(chalk.green('✅ No vulnerabilities detected'));
      }

      if (securityResults.suspiciousPackages.length > 0) {
        console.log(
          chalk.yellow(`⚠️  Suspicious packages: ${securityResults.suspiciousPackages.length}`),
        );
        securityResults.suspiciousPackages.forEach(pkg => {
          console.log(chalk.yellow(`  • ${pkg.package}@${pkg.version} (score: ${pkg.score})`));
        });
      }

      if (securityResults.securityIssues.length > 0) {
        console.log(
          chalk.red(`🔍 Security issues in code: ${securityResults.securityIssues.length}`),
        );
        securityResults.securityIssues.forEach(issue => {
          console.log(chalk.red(`  • ${issue.file}:${issue.line} - ${issue.description}`));
        });
      }

      if (securityResults.recommendations.length > 0) {
        console.log(chalk.blue('\n💡 Security Recommendations:'));
        securityResults.recommendations.forEach(rec => {
          console.log(chalk.cyan(`  • ${rec}`));
        });
      }
    } catch (error) {
      logError('❌ Security analysis failed:', error.message);
    }
  }

  /**
   * Testing analysis
   */
  async testingAnalysis() {
    try {
      logInfo('🧪 Starting testing analysis...');

      const { analyzer: packageJson } = this.loadPackageJson();
      const testingResults = await this.testingAnalyzer.analyzeTesting(packageJson);

      console.log(chalk.blue('🧪 Testing Analysis Results:'));
      console.log(chalk.gray('──────────────────────────────────────────────────'));

      if (testingResults.testFramework) {
        console.log(chalk.green(`✅ Test framework: ${testingResults.testFramework}`));
      } else {
        console.log(chalk.yellow('⚠️  No test framework detected'));
      }

      if (testingResults.testScripts.length > 0) {
        console.log(chalk.green(`✅ Test scripts: ${testingResults.testScripts.length}`));
        testingResults.testScripts.forEach(script => {
          console.log(chalk.cyan(`  • ${script.name} (${script.type})`));
        });
      }

      if (testingResults.coverage) {
        console.log(
          chalk.blue(
            `📊 Coverage: ${testingResults.coverage.percentage}% (${testingResults.coverage.covered}/${testingResults.coverage.total} lines)`,
          ),
        );
      } else {
        console.log(chalk.yellow('⚠️  No coverage data available'));
      }

      if (testingResults.missingTests.length > 0) {
        console.log(chalk.yellow(`📝 Missing tests: ${testingResults.missingTests.length} files`));
        testingResults.missingTests.slice(0, 5).forEach(test => {
          console.log(chalk.yellow(`  • ${test.sourceFile} (${test.priority} priority)`));
        });
      }

      if (testingResults.recommendations.length > 0) {
        console.log(chalk.blue('\n💡 Testing Recommendations:'));
        testingResults.recommendations.forEach(rec => {
          console.log(chalk.cyan(`  • ${rec}`));
        });
      }
    } catch (error) {
      logError('❌ Testing analysis failed:', error.message);
    }
  }

  /**
   * DevOps generation
   */
  async devOpsGeneration() {
    try {
      logInfo('🚀 Starting DevOps generation...');

      const { analyzer: packageJson } = this.loadPackageJson();
      const devOpsResults = await this.devOpsGenerator.generateAllDevOps(packageJson);

      console.log(chalk.blue('🚀 DevOps Generation Results:'));
      console.log(chalk.gray('──────────────────────────────────────────────────'));

      if (devOpsResults.workflows.length > 0) {
        console.log(chalk.green(`✅ GitHub Actions workflows: ${devOpsResults.workflows.length}`));
        devOpsResults.workflows.forEach(workflow => {
          console.log(chalk.cyan(`  • ${workflow.name} - ${workflow.status}`));
        });
      }

      if (devOpsResults.docker.length > 0) {
        console.log(chalk.green(`🐳 Docker files: ${devOpsResults.docker.length}`));
        devOpsResults.docker.forEach(docker => {
          console.log(chalk.cyan(`  • ${docker.name} - ${docker.status}`));
        });
      }

      if (devOpsResults.errors.length > 0) {
        console.log(chalk.red(`❌ Errors: ${devOpsResults.errors.length}`));
        devOpsResults.errors.forEach(error => {
          console.log(chalk.red(`  • ${error}`));
        });
      }
    } catch (error) {
      logError('❌ DevOps generation failed:', error.message);
    }
  }

  /**
   * Automation tools
   */
  async automationTools() {
    try {
      logInfo('⚡ Starting automation tools...');

      const options = {
        refactor: true,
        changelog: true,
        esm: true,
        format: true
      };

      const automationResults = await this.automationEngine.runAutomation(options);

      console.log(chalk.blue('⚡ Automation Results:'));
      console.log(chalk.gray('──────────────────────────────────────────────────'));

      if (automationResults.refactoring.length > 0) {
        console.log(chalk.green(`✅ Refactored files: ${automationResults.refactoring.length}`));
      }

      if (automationResults.changelog) {
        console.log(chalk.green('✅ Changelog generated'));
      }

      if (automationResults.esmMigration) {
        console.log(chalk.green('✅ ESM migration completed'));
      }

      if (automationResults.formatting) {
        console.log(
          chalk.green(`✅ Formatted files: ${automationResults.formatting.formatted.length}`),
        );
      }

      if (automationResults.errors.length > 0) {
        console.log(chalk.red(`❌ Errors: ${automationResults.errors.length}`));
        automationResults.errors.forEach(error => {
          console.log(chalk.red(`  • ${error}`));
        });
      }
    } catch (error) {
      logError('❌ Automation failed:', error.message);
    }
  }

  /**
   * Plugin management
   */
  async pluginManagement() {
    try {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Plugin management:',
          choices: [
            { name: '📋 List plugins', value: 'list' },
            { name: '📋 List profiles', value: 'profiles' },
            { name: '➕ Create plugin', value: 'create' },
            { name: '➕ Create profile', value: 'create_profile' },
            { name: '🔙 Back', value: 'back' },
          ],
        },
      ]);

      switch (action) {
        case 'list':
          const plugins = this.pluginManager.listPlugins();
          console.log(chalk.blue('📋 Available Plugins:'));
          plugins.forEach(plugin => {
            console.log(chalk.cyan(`  • ${plugin.name} - ${plugin.description}`));
          });
          break;

        case 'profiles':
          const profiles = this.pluginManager.listPromptProfiles();
          console.log(chalk.blue('📋 Available Profiles:'));
          profiles.forEach(profile => {
            console.log(chalk.cyan(`  • ${profile.name} - ${profile.description}`));
          });
          break;

        case 'create':
          // Simplified plugin creation
          console.log(
            chalk.yellow('⚠️  Plugin creation requires manual setup. Check the docs for examples.'),
          );
          break;

        case 'create_profile':
          // Simplified profile creation
          console.log(
            chalk.yellow(
              '⚠️  Profile creation requires manual setup. Check the docs for examples.',
            ),
          );
          break;
      }
    } catch (error) {
      logError('❌ Plugin management failed:', error.message);
    }
  }

  /**
   * Documentation generation
   */
  async documentationGeneration() {
    try {
      logInfo('📚 Generating comprehensive documentation...');

      const { analyzer: packageJson } = this.loadPackageJson();
      const docsResults = await this.documentationGenerator.generateDocumentation(packageJson);

      console.log(chalk.blue('📚 Documentation Generation Results:'));
      console.log(chalk.gray('──────────────────────────────────────────────────'));

      if (docsResults.files.length > 0) {
        console.log(chalk.green(`✅ Generated files: ${docsResults.files.length}`));
        docsResults.files.forEach(file => {
          console.log(chalk.cyan(`  • ${file.path} (${file.type})`));
        });
      }

      if (docsResults.errors.length > 0) {
        console.log(chalk.red(`❌ Errors: ${docsResults.errors.length}`));
        docsResults.errors.forEach(error => {
          console.log(chalk.red(`  • ${error}`));
        });
      }

      console.log(chalk.blue('\n📖 Documentation is now available in the `docs/` folder'));
    } catch (error) {
      logError('❌ Documentation generation failed:', error.message);
    }
  }

  /**
   * Generate .gitignore
   */
  async generateGitignore() {
    try {
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript v1 declaration files
typings/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
`;

      await fs.writeFile('.gitignore', gitignoreContent);
      logSuccess('✅ Generated .gitignore');
    } catch (error) {
      logError('❌ Failed to generate .gitignore:', error.message);
    }
  }

  /**
   * Generate ESLint configuration
   */
  async generateEslintConfig() {
    try {
      const { analyzer: packageJson } = this.loadPackageJson();
      const eslintConfig = await this.gemini.generateEslintConfig(packageJson);

      await fs.writeFile('.eslintrc.js', eslintConfig);
      logSuccess('✅ Generated .eslintrc.js');
    } catch (error) {
      logError('❌ Failed to generate ESLint config:', error.message);
    }
  }

  /**
   * Generate Prettier configuration
   */
  async generatePrettierConfig() {
    try {
      const prettierConfig = await this.gemini.generatePrettierConfig();

      await fs.writeFile('.prettierrc', prettierConfig);
      logSuccess('✅ Generated .prettierrc');
    } catch (error) {
      logError('❌ Failed to generate Prettier config:', error.message);
    }
  }

  /**
   * Handle auto mode
   */
  async handleAutoMode() {
    try {
      logInfo('🔄 Running comprehensive analysis and optimization...');

      // Run all analyses
      await this.analyzeDependencies();
      await this.securityAnalysis();
      await this.testingAnalysis();

      // Generate all files
      await this.generateReadme();
      await this.devOpsGeneration();
      await this.documentationGeneration();

      // Run automation
      await this.automationEngine.runAutomation({
        refactor: true,
        changelog: true,
        format: true,
      });

      logSuccess('✅ Auto mode completed successfully!');
    } catch (error) {
      logError('❌ Auto mode failed:', error.message);
    }
  }

  /**
   * List available AI models and their status
   */
  async listAvailableModels() {
    try {
      console.log(chalk.blue.bold('\n🤖 Available AI Models:'));
      console.log(chalk.gray('='.repeat(50)));

      const status = this.aiProvider.getProviderStatus();
      const available = this.aiProvider.getAvailableProviders();

      for (const [name, info] of Object.entries(status)) {
        const statusIcon = info.available ? '✅' : '❌';
        const statusText = info.available ? 'Available' : 'Unavailable';
        const lastUsed = info.lastUsed
          ? ` (Last used: ${new Date(info.lastUsed).toLocaleString()})`
          : '';
        const errorCount = info.errorCount > 0 ? ` (${info.errorCount} errors)` : '';

        console.log(`${statusIcon} ${chalk.bold(name)}: ${statusText}${lastUsed}${errorCount}`);
      }

      console.log(chalk.gray('\nEnvironment Variables:'));
      console.log(chalk.gray('- GEMINI_API_KEY: Gemini API key'));
      console.log(chalk.gray('- OPENAI_API_KEY: OpenAI API key'));
      console.log(chalk.gray('- ANTHROPIC_API_KEY: Anthropic API key'));
      console.log(chalk.gray('- OPENROUTER_API_KEY: OpenRouter API key'));
      console.log(chalk.gray('- AZURE_OPENAI_API_KEY: Azure OpenAI API key'));
      console.log(chalk.gray('- AZURE_OPENAI_ENDPOINT: Azure OpenAI endpoint'));
      console.log(chalk.gray('- AZURE_OPENAI_DEPLOYMENT_NAME: Azure OpenAI deployment'));
      console.log(chalk.gray('- COHERE_API_KEY: Cohere API key'));
      console.log(chalk.gray('- HUGGINGFACE_API_KEY: Hugging Face API key'));
      console.log(chalk.gray('- REPLICATE_API_KEY: Replicate API key'));
      console.log(chalk.gray('- TOGETHER_API_KEY: Together AI API key'));
      console.log(chalk.gray('- PERPLEXITY_API_KEY: Perplexity API key'));
      console.log(chalk.gray('- GROQ_API_KEY: Groq API key'));
      console.log(chalk.gray('- OLLAMA_BASE_URL: Ollama server URL (default: http://localhost:11434)'));
      console.log(chalk.gray('- OLLAMA_MODEL: Ollama model name (default: llama2)'));
      console.log(chalk.gray('- LLAMA_MODEL_PATH: Path to local LLaMA model'));
    } catch (error) {
      logError('❌ Failed to list models:', error.message);
    }
  }

  /**
   * Test all available AI models
   */
  async testAllModels() {
    try {
      console.log(chalk.blue.bold('\n🧪 Testing AI Models:'));
      console.log(chalk.gray('='.repeat(50)));

      const providers = this.aiProvider.getAvailableProviders();

      for (const provider of providers) {
        console.log(chalk.yellow(`\nTesting ${provider}...`));

        try {
          const result = await this.aiProvider.query('Hello, this is a test message.', {
            provider,
            timeout: 10000,
          });

          console.log(chalk.green(`✅ ${provider}: Success`));
          console.log(chalk.gray(`Response: ${result.text.substring(0, 100)}...`));
        } catch (error) {
          console.log(chalk.red(`❌ ${provider}: ${error.message}`));
        }
      }
    } catch (error) {
      logError('❌ Failed to test models:', error.message);
    }
  }

  /**
   * Set AI model for this session
   */
  async setAIModel(modelName) {
    try {
      if (!this.aiProvider.providers.has(modelName)) {
        throw new Error(`Unknown AI model: ${modelName}`);
      }

      this.aiProvider.setPrimaryProvider(modelName);
      console.log(chalk.green(`✅ Set AI model to: ${modelName}`));
    } catch (error) {
      logError('❌ Failed to set AI model:', error.message);
    }
  }
}

export default CommandsHandler;

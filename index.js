#!/usr/bin/env node

/**
 * Inteli-Packs CLI Entry Point
 * Smart developer assistant for Node.js project optimization
 */

import { program } from "commander";
import chalk from "chalk";
import CommandsHandler from "./commands.js";
import { loadEnvironment } from "./utils.js";

// Load environment variables
loadEnvironment();

// CLI version and description
program
  .name('inteli-packs')
  .description('Smart developer assistant for Node.js project optimization using AI')
  .version('1.0.0')
  .option('-a, --auto', 'Run in non-interactive mode with full optimization')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--model <model>', 'AI model to use (gemini, gpt4, claude, ollama, llama)', 'gemini')
  .option('--profile <profile>', 'Use specific prompt profile (default, detailed, minimal)')
  .option('--plugins <plugins>', 'Enable specific plugins (comma-separated)')
  .option('--security', 'Run security analysis only')
  .option('--testing', 'Run testing analysis only')
  .option('--devops', 'Generate DevOps files only')
  .option('--documentation', 'Generate documentation only')
  .option('--automation', 'Run automation tools only')
  .option('--list-models', 'List available AI models and their status')
  .option('--test-models', 'Test all available AI models')
  .parse();

const options = program.opts();

/**
 * Main application entry point
 */
async function main() {
  try {
    console.log(chalk.blue.bold('🚀 Inteli-Packs - Smart Node.js Project Assistant'));
    console.log(chalk.gray('Powered by AI\n'));

    const commandsHandler = new CommandsHandler();
    
    // Initialize plugin system
    await commandsHandler.initialize();
    
    // Handle AI model options
    if (options.listModels) {
      await commandsHandler.listAvailableModels();
      return;
    }
    
    if (options.testModels) {
      await commandsHandler.testAllModels();
      return;
    }
    
    // Set AI model for this session
    if (options.model) {
      await commandsHandler.setAIModel(options.model);
    }
    
    if (options.auto) {
      console.log(chalk.yellow('🔄 Running in auto mode...'));
      await commandsHandler.handleAutoMode();
    } else if (options.security) {
      console.log(chalk.blue('🔒 Running security analysis...'));
      await commandsHandler.securityAnalysis();
    } else if (options.testing) {
      console.log(chalk.blue('🧪 Running testing analysis...'));
      await commandsHandler.testingAnalysis();
    } else if (options.devops) {
      console.log(chalk.blue('🚀 Generating DevOps files...'));
      await commandsHandler.devOpsGeneration();
    } else if (options.documentation) {
      console.log(chalk.blue('📚 Generating documentation...'));
      await commandsHandler.documentationGeneration();
    } else if (options.automation) {
      console.log(chalk.blue('⚡ Running automation tools...'));
      await commandsHandler.automationTools();
    } else {
      await commandsHandler.showMainMenu();
    }
  } catch (error) {
    console.error(chalk.red('❌ Application error:'), error.message);
    if (options.verbose) {
      console.error(chalk.red('Stack trace:'), error.stack);
    }
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Uncaught Exception:'), error.message);
  if (options.verbose) {
    console.error(chalk.red('Stack trace:'), error.stack);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise);
  console.error(chalk.red('Reason:'), reason);
  process.exit(1);
});

// Run the application
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main }; 
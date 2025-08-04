/**
 * Documentation Generation Module
 * Handles auto-generated docs folder using Gemini
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

class DocumentationGenerator {
  constructor() {
    this.docsDir = 'docs';
    this.sections = ['api', 'examples', 'guides', 'troubleshooting', 'contributing', 'changelog'];
  }

  /**
   * Generate comprehensive documentation
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Documentation generation results
   */
  async generateDocumentation(packageJson) {
    const results = {
      files: [],
      errors: [],
    };

    try {
      // Ensure docs directory exists
      await fs.ensureDir(this.docsDir);

      // Generate main documentation files
      const mainDocs = await this.generateMainDocs(packageJson);
      results.files.push(...mainDocs);

      // Generate API documentation
      const apiDocs = await this.generateAPIDocs(packageJson);
      results.files.push(...apiDocs);

      // Generate examples
      const examples = await this.generateExamples(packageJson);
      results.files.push(...examples);

      // Generate guides
      const guides = await this.generateGuides(packageJson);
      results.files.push(...guides);

      // Generate troubleshooting
      const troubleshooting = await this.generateTroubleshooting(packageJson);
      results.files.push(...troubleshooting);

      // Generate contributing guidelines
      const contributing = await this.generateContributing(packageJson);
      results.files.push(...contributing);
    } catch (error) {
      results.errors.push(`Documentation generation failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Generate main documentation files
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Generated files
   */
  async generateMainDocs(packageJson) {
    const files = [];

    // Generate index.md
    const indexContent = `# ${packageJson.name}

${packageJson.description || 'A Node.js project'}

## Quick Start

\`\`\`bash
npm install ${packageJson.name}
\`\`\`

## Documentation

- [API Reference](./api/README.md)
- [Examples](./examples/README.md)
- [Guides](./guides/README.md)
- [Troubleshooting](./troubleshooting/README.md)
- [Contributing](./contributing/README.md)

## License

${packageJson.license || 'MIT'}
`;

    const { join: indexPath } = path(this.docsDir, 'index.md');
    await fs.writeFile(indexPath, indexContent);
    files.push({ path: indexPath, type: 'index' });

    // Generate installation guide
    const installContent = `# Installation

## Prerequisites

- Node.js ${packageJson.engines?.node || '16.0.0'} or higher
- npm or yarn

## Installation

### Using npm

\`\`\`bash
npm install ${packageJson.name}
\`\`\`

### Using yarn

\`\`\`bash
yarn add ${packageJson.name}
\`\`\`

### Global installation

\`\`\`bash
npm install -g ${packageJson.name}
\`\`\`

## Configuration

Create a \`.env\` file in your project root:

\`\`\`env
GEMINI_API_KEY=your_api_key_here
\`\`\`
`;

    const { join: installPath } = path(this.docsDir, 'installation.md');
    await fs.writeFile(installPath, installContent);
    files.push({ path: installPath, type: 'installation' });

    return files;
  }

  /**
   * Generate API documentation
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Generated files
   */
  async generateAPIDocs(packageJson) {
    const files = [];

    // Create API directory
    const { join: apiDir } = path(this.docsDir, 'api');
    await fs.ensureDir(apiDir);

    // Generate API index
    const apiIndexContent = `# API Reference

## Overview

This document provides detailed API documentation for ${packageJson.name}.

## Modules

- [Core API](./core.md)
- [CLI Interface](./cli.md)
- [Configuration](./config.md)

## Quick Reference

\`\`\`javascript
import { analyzeDependencies, generateReadme  } from "${packageJson.name}";

// Analyze dependencies
const analysis = await analyzeDependencies(packageJson, sourceFiles);

// Generate README
const readme = await generateReadme(packageJson);
\`\`\`
`;

    const { join: apiIndexPath } = path(apiDir, 'README.md');
    await fs.writeFile(apiIndexPath, apiIndexContent);
    files.push({ path: apiIndexPath, type: 'api_index' });

    // Generate core API docs
    const coreApiContent = `# Core API

## Classes

### ProjectAnalyzer

Analyzes Node.js project dependencies and structure.

#### Methods

##### \`analyzeDependencies()\`

Analyzes package.json dependencies and source files.

**Returns:** Promise<Object>

**Example:**
\`\`\`javascript
const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();
\`\`\`

##### \`detectDeadFiles()\`

Detects unused files in the project.

**Returns:** Promise<Array>

**Example:**
\`\`\`javascript
const deadFiles = await analyzer.detectDeadFiles();
\`\`\`

### GeminiAPI

Handles communication with Google's Gemini AI API.

#### Methods

##### \`query(prompt, options)\`

Sends a query to the Gemini API.

**Parameters:**
- \`prompt\` (string): The prompt to send
- \`options\` (Object): Additional options

**Returns:** Promise<Object>

**Example:**
\`\`\`javascript
const gemini = new GeminiAPI();
const response = await gemini.query('Analyze this code');
\`\`\`
`;

    const { join: coreApiPath } = path(apiDir, 'core.md');
    await fs.writeFile(coreApiPath, coreApiContent);
    files.push({ path: coreApiPath, type: 'core_api' });

    return files;
  }

  /**
   * Generate examples
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Generated files
   */
  async generateExamples(packageJson) {
    const files = [];

    // Create examples directory
    const { join: examplesDir } = path(this.docsDir, 'examples');
    await fs.ensureDir(examplesDir);

    // Generate examples index
    const examplesIndexContent = `# Examples

This section contains practical examples of how to use ${packageJson.name}.

## Basic Usage

### Dependency Analysis

\`\`\`javascript
import { ProjectAnalyzer  } from "${packageJson.name}";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
\`\`\`

### README Generation

\`\`\`javascript
import { GeminiAPI  } from "${packageJson.name}";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
\`\`\`

### CLI Usage

\`\`\`bash
# Analyze dependencies
npx ${packageJson.name} --analyze

# Clean up unused packages
npx ${packageJson.name} --cleanup

# Generate README
npx ${packageJson.name} --generate-readme

# Auto-fix issues
npx ${packageJson.name} --auto-fix
\`\`\`
`;

    const { join: examplesIndexPath } = path(examplesDir, 'README.md');
    await fs.writeFile(examplesIndexPath, examplesIndexContent);
    files.push({ path: examplesIndexPath, type: 'examples_index' });

    return files;
  }

  /**
   * Generate guides
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Generated files
   */
  async generateGuides(packageJson) {
    const files = [];

    // Create guides directory
    const { join: guidesDir } = path(this.docsDir, 'guides');
    await fs.ensureDir(guidesDir);

    // Generate getting started guide
    const gettingStartedContent = `# Getting Started

## Introduction

${packageJson.name} is a smart developer assistant that uses AI to analyze and optimize Node.js projects.

## Features

- **Dependency Analysis**: Detect unused and missing dependencies
- **AI-Powered Recommendations**: Get intelligent suggestions from Gemini AI
- **Auto-Fix**: Automatically fix common project issues
- **Documentation Generation**: Generate professional README files
- **Security Analysis**: Check for vulnerabilities and security issues

## Quick Start

1. **Install the package**

   \`\`\`bash
   npm install -g ${packageJson.name}
   \`\`\`

2. **Set up your API key**

   Create a \`.env\` file:
   \`\`\`env
   GEMINI_API_KEY=your_api_key_here
   \`\`\`

3. **Run your first analysis**

   \`\`\`bash
   ${packageJson.name} --analyze
   \`\`\`

## Next Steps

- Read the [API Reference](../api/README.md)
- Check out [Examples](../examples/README.md)
- Learn about [Advanced Usage](./advanced.md)
`;

    const { join: gettingStartedPath } = path(guidesDir, 'getting-started.md');
    await fs.writeFile(gettingStartedPath, gettingStartedContent);
    files.push({ path: gettingStartedPath, type: 'getting_started' });

    return files;
  }

  /**
   * Generate troubleshooting guide
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Generated files
   */
  async generateTroubleshooting(packageJson) {
    const files = [];

    // Create troubleshooting directory
    const { join: troubleshootingDir } = path(this.docsDir, 'troubleshooting');
    await fs.ensureDir(troubleshootingDir);

    // Generate troubleshooting guide
    const troubleshootingContent = `# Troubleshooting

## Common Issues

### API Key Issues

**Problem:** "GEMINI_API_KEY environment variable is required"

**Solution:**
1. Create a \`.env\` file in your project root
2. Add your Gemini API key:
   \`\`\`env
   GEMINI_API_KEY=your_actual_api_key
   \`\`\`
3. Restart your terminal or reload environment variables

### Network Issues

**Problem:** "Gemini API request timed out"

**Solution:**
1. Check your internet connection
2. Verify your API key is valid
3. Try again in a few minutes

### Permission Issues

**Problem:** "Cannot write to file"

**Solution:**
1. Check file permissions
2. Ensure you have write access to the directory
3. Run with appropriate permissions

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [API Documentation](../api/README.md)
3. Try the [Examples](../examples/README.md)
`;

    const { join: troubleshootingPath } = path(troubleshootingDir, 'README.md');
    await fs.writeFile(troubleshootingPath, troubleshootingContent);
    files.push({ path: troubleshootingPath, type: 'troubleshooting' });

    return files;
  }

  /**
   * Generate contributing guidelines
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Generated files
   */
  async generateContributing(packageJson) {
    const files = [];

    // Create contributing directory
    const { join: contributingDir } = path(this.docsDir, 'contributing');
    await fs.ensureDir(contributingDir);

    // Generate contributing guide
    const contributingContent = `# Contributing

Thank you for your interest in contributing to ${packageJson.name}!

## Development Setup

1. **Fork the repository**

2. **Clone your fork**
   \`\`\`bash
   git clone https://github.com/your-username/${packageJson.name}.git
   cd ${packageJson.name}
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

4. **Set up environment**
   \`\`\`bash
   cp .env.example .env
   # Add your Gemini API key to .env
   \`\`\`

## Making Changes

1. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes**

3. **Run tests**
   \`\`\`bash
   npm test
   \`\`\`

4. **Commit your changes**
   \`\`\`bash
   git commit -m "feat: add your feature description"
   \`\`\`

5. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

6. **Create a Pull Request**

## Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## Testing

Run the test suite:

\`\`\`bash
npm test
npm run test:coverage
\`\`\`

## Questions?

Feel free to open an issue for questions or discussions.
`;

    const { join: contributingPath } = path(contributingDir, 'README.md');
    await fs.writeFile(contributingPath, contributingContent);
    files.push({ path: contributingPath, type: 'contributing' });

    return files;
  }
}

export default DocumentationGenerator;

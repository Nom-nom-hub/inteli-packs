#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('📚 Setting up Inteli-Packs Documentation Site'));
console.log(chalk.gray('Creating Docusaurus documentation...\n'));

const docsPath = path.join(__dirname, '..', 'docs');

// Create docs directory if it doesn't exist
if (!fs.existsSync(docsPath)) {
  fs.mkdirSync(docsPath, { recursive: true });
}

// Change to docs directory
process.chdir(docsPath);

console.log(chalk.green('📁 Setting up docs directory'));

// Create necessary directories
const dirs = [
  'src/css',
  'src/components',
  'static/img',
  'docs/features',
  'docs/usage',
  'docs/advanced',
  'docs/development',
  'blog'
];

dirs.forEach(dir => {
  const dirPath = path.join(docsPath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Create custom CSS
const customCSS = `/**
 * Any CSS included here will be global. The classic template
 * bundles Infima by default. Infima is a CSS framework designed to
 * work well for content-heavy websites.
 */

/* You can override the default Infima variables here. */
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

/* For readability concerns, you should choose a lighter palette in dark mode. */
[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: #21af90;
  --ifm-color-primary-darker: #1fa588;
  --ifm-color-primary-darkest: #1a8870;
  --ifm-color-primary-light: #29d5b0;
  --ifm-color-primary-lighter: #32d8b4;
  --ifm-color-primary-lightest: #4fddbf;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}
`;

fs.writeFileSync(path.join(docsPath, 'src/css/custom.css'), customCSS);
console.log(chalk.green('✅ Created custom CSS'));

// Create installation guide
const installationGuide = `---
sidebar_position: 2
---

# Installation

## Prerequisites

Before installing Inteli-Packs, make sure you have:

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Git** (for version control)

## Installation Methods

### Method 1: Global Installation (Recommended)

Install Inteli-Packs globally to use it from anywhere:

\`\`\`bash
npm install -g inteli-packs
\`\`\`

After installation, you can use the \`inteli-packs\` command directly:

\`\`\`bash
inteli-packs --help
\`\`\`

### Method 2: npx (No Installation Required)

Use Inteli-Packs without installing it globally:

\`\`\`bash
npx inteli-packs
\`\`\`

This is useful for one-time usage or CI/CD environments.

### Method 3: Local Installation

Install Inteli-Packs as a dev dependency in your project:

\`\`\`bash
npm install --save-dev inteli-packs
\`\`\`

Then use it via npx:

\`\`\`bash
npx inteli-packs
\`\`\`

## Homebrew Installation (macOS)

If you're on macOS and have Homebrew installed:

\`\`\`bash
brew install yourusername/inteli-packs/inteli-packs
\`\`\`

## Setup

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 2. Configure Your Project

Create a \`.env\` file in your project root:

\`\`\`bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
\`\`\`

### 3. Verify Installation

Test that Inteli-Packs is working correctly:

\`\`\`bash
inteli-packs --version
inteli-packs --help
\`\`\`

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`GEMINI_API_KEY\` | Your Google Gemini API key | Yes |
| \`NODE_ENV\` | Environment (development/production) | No |

### Project Configuration

Inteli-Packs can be configured through:

1. **Environment variables** (recommended for API keys)
2. **Command line arguments** (for one-time options)
3. **Configuration files** (for project-specific settings)

## Troubleshooting

### Common Issues

#### "Command not found"
If you get a "command not found" error after global installation:

1. Check your PATH: \`echo $PATH\`
2. Find npm's global bin: \`npm config get prefix\`
3. Add to PATH if needed: \`export PATH="$(npm config get prefix)/bin:$PATH"\`

#### API Key Issues
If you get authentication errors:

1. Verify your API key is correct
2. Check that the key has the necessary permissions
3. Ensure the \`.env\` file is in the correct location

#### Permission Issues
If you get permission errors on Unix-like systems:

\`\`\`bash
sudo npm install -g inteli-packs
\`\`\`

## Next Steps

Now that Inteli-Packs is installed, check out the [Quick Start Guide](./quick-start.md) to run your first analysis.
`;

fs.writeFileSync(path.join(docsPath, 'docs/installation.md'), installationGuide);
console.log(chalk.green('✅ Created installation guide'));

// Create quick start guide
const quickStartGuide = `---
sidebar_position: 3
---

# Quick Start

Get up and running with Inteli-Packs in minutes.

## Prerequisites

- Inteli-Packs installed (see [Installation](./installation.md))
- Gemini API key configured
- Node.js project to analyze

## Your First Analysis

### 1. Navigate to Your Project

\`\`\`bash
cd your-nodejs-project
\`\`\`

### 2. Run Interactive Analysis

\`\`\`bash
inteli-packs
\`\`\`

This starts the interactive mode where you can choose what to analyze.

### 3. Choose Analysis Type

You'll see a menu like this:

\`\`\`
🚀 Inteli-Packs - Smart Node.js Project Assistant

Choose an option:

📦 Analyze dependencies
🧹 Clean up unused packages  
📄 Generate README boilerplate
🛠 Auto-fix common project issues
🔒 Security analysis
🧪 Testing analysis
🚀 DevOps generation
⚡ Automation tools
🔌 Plugin management
📚 Documentation generation
❌ Exit
\`\`\`

### 4. Start with Dependency Analysis

Choose "📦 Analyze dependencies" for your first run.

## Command Line Usage

### Basic Commands

\`\`\`bash
# Interactive mode
inteli-packs

# Auto mode (non-interactive)
inteli-packs --auto

# Specific analysis
inteli-packs --security
inteli-packs --testing
inteli-packs --devops
\`\`\`

### Advanced Options

\`\`\`bash
# Verbose output
inteli-packs --verbose

# Custom profile
inteli-packs --profile detailed

# Specific plugins
inteli-packs --plugins security,performance

# Help
inteli-packs --help
\`\`\`

## Example Workflow

Here's a typical workflow for analyzing a Node.js project:

### 1. Initial Analysis

\`\`\`bash
# Run comprehensive analysis
inteli-packs --auto
\`\`\`

### 2. Review Results

Inteli-Packs will show you:

- 📊 **Dependency Analysis**: Used/unused packages
- 🔒 **Security Issues**: Vulnerabilities and suspicious packages
- 🧪 **Testing Status**: Coverage and missing tests
- 📚 **Documentation**: Missing or outdated docs

### 3. Apply Fixes

\`\`\`bash
# Auto-fix common issues
inteli-packs --auto-fix

# Generate missing documentation
inteli-packs --documentation

# Set up DevOps workflows
inteli-packs --devops
\`\`\`

### 4. Continuous Monitoring

\`\`\`bash
# Add to your CI/CD pipeline
npm run analyze
\`\`\`

## Sample Output

Here's what you might see after running an analysis:

\`\`\`
📊 Project Analysis Results:
──────────────────────────────────────────────────
📁 Total files: 15
📝 Total lines: 1,247
📦 Total dependencies: 12
✅ Used dependencies: 8
❌ Unused dependencies: 4
⚠️  Missing dependencies: 0

🗑️  Unused Dependencies:
  • axios
  • moment
  • lodash
  • nodemon

💡 AI Recommendations:
  • Consider using dayjs instead of moment for smaller bundle size
  • Replace lodash with native JavaScript methods where possible
  • Remove axios if not using HTTP requests
\`\`\`

## Next Steps

- Learn about [CLI Commands](./usage/cli-commands.md)
- Explore [Interactive Mode](./usage/interactive-mode.md)
- Check out [Advanced Features](./advanced/plugins.md)
`;

fs.writeFileSync(path.join(docsPath, 'docs/quick-start.md'), quickStartGuide);
console.log(chalk.green('✅ Created quick start guide'));

// Install Docusaurus dependencies
console.log(chalk.blue('\n📦 Installing Docusaurus dependencies...'));
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log(chalk.green('✅ Dependencies installed'));
} catch (error) {
  console.error(chalk.red('❌ Failed to install dependencies'));
  console.error(error.message);
}

console.log(chalk.blue('\n🎉 Documentation site setup completed!'));
console.log(chalk.green(`📁 Documentation location: ${docsPath}`));
console.log(chalk.blue('\nNext steps:'));
console.log(chalk.gray('1. cd docs'));
console.log(chalk.gray('2. npm start'));
console.log(chalk.gray('3. Open http://localhost:3000'));
console.log(chalk.gray('4. Customize the documentation content')); 
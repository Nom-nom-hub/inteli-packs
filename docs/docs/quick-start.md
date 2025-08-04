---
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

```bash
cd your-nodejs-project
```

### 2. Run Interactive Analysis

```bash
inteli-packs
```

This starts the interactive mode where you can choose what to analyze.

### 3. Choose Analysis Type

You'll see a menu like this:

```
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
```

### 4. Start with Dependency Analysis

Choose "📦 Analyze dependencies" for your first run.

## Command Line Usage

### Basic Commands

```bash
# Interactive mode
inteli-packs

# Auto mode (non-interactive)
inteli-packs --auto

# Specific analysis
inteli-packs --security
inteli-packs --testing
inteli-packs --devops
```

### Advanced Options

```bash
# Verbose output
inteli-packs --verbose

# Custom profile
inteli-packs --profile detailed

# Specific plugins
inteli-packs --plugins security,performance

# Help
inteli-packs --help
```

## Example Workflow

Here's a typical workflow for analyzing a Node.js project:

### 1. Initial Analysis

```bash
# Run comprehensive analysis
inteli-packs --auto
```

### 2. Review Results

Inteli-Packs will show you:

- 📊 **Dependency Analysis**: Used/unused packages
- 🔒 **Security Issues**: Vulnerabilities and suspicious packages
- 🧪 **Testing Status**: Coverage and missing tests
- 📚 **Documentation**: Missing or outdated docs

### 3. Apply Fixes

```bash
# Auto-fix common issues
inteli-packs --auto-fix

# Generate missing documentation
inteli-packs --documentation

# Set up DevOps workflows
inteli-packs --devops
```

### 4. Continuous Monitoring

```bash
# Add to your CI/CD pipeline
npm run analyze
```

## Sample Output

Here's what you might see after running an analysis:

```
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
```

## Next Steps

- Learn about [CLI Commands](./usage/cli-commands.md)
- Explore [Interactive Mode](./usage/interactive-mode.md)
- Check out [Advanced Features](./advanced/plugins.md)

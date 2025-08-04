# 🚀 Inteli-Packs

**Smart developer assistant for Node.js project optimization using AI**

[![npm version](https://badge.fury.io/js/inteli-packs.svg)](https://badge.fury.io/js/inteli-packs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![CI](https://github.com/yourusername/inteli-packs/workflows/CI/badge.svg)](https://github.com/yourusername/inteli-packs/actions)

Inteli-Packs is a comprehensive AI-powered developer assistant that analyzes, optimizes, and manages Node.js project dependencies and configuration files using multiple AI providers with automatic fallback.

## ✨ Features

### 🤖 **AI-Powered Analysis**
- **Multi-Provider Support**: Gemini 1.5 Flash, GPT-4, Claude, Ollama, LLaMA
- **Automatic Fallback**: Seamless switching between AI providers
- **Smart Dependency Analysis**: Detect unused, missing, and outdated packages
- **Code Pattern Recognition**: Analyze imports and usage across all source files
- **AI Recommendations**: Get intelligent suggestions for package replacements
- **Prompt Memory**: AI remembers conversation context for better analysis

### 🔒 **Security & Testing**
- **Vulnerability Scanning**: Check packages for known security issues
- **Suspicious Package Detection**: Identify potentially malicious packages
- **Code Security Analysis**: Scan source files for security patterns
- **Test Coverage Integration**: Analyze test frameworks and coverage
- **Missing Test Detection**: Identify files without corresponding tests

### 🚀 **DevOps & Automation**
- **GitHub Actions Generation**: CI/CD, CD, and Security workflows
- **Dockerfile Generation**: Production-ready container configurations
- **Auto-refactoring**: Modernize JavaScript code patterns
- **ESM Migration**: Convert CommonJS to ES modules
- **Changelog Generation**: Create changelogs from git history

### 🔌 **Extensibility**
- **Plugin System**: Extensible architecture with hooks
- **Custom Prompt Profiles**: User-defined analysis modes
- **Built-in Plugins**: Security, performance, documentation plugins
- **Hook System**: Pre/post analysis and generation hooks

### 📚 **Documentation**
- **Auto-generated Docs**: Comprehensive documentation folders
- **API Documentation**: Complete API reference
- **Installation Guides**: Step-by-step setup instructions
- **Contributing Guidelines**: Development setup and guidelines

### 🛠 **Project Bootstrap**
- **`inteli-packs init`**: Bootstrap clean Node.js repos with best practices
- **Pre-configured Setup**: ESLint, Prettier, Jest, Husky, and more
- **Git Integration**: Automatic git initialization and hooks
- **Modern Tooling**: Latest development tools and configurations

## 🤖 AI Provider Architecture

Inteli-Packs uses a pluggable AI provider system that supports multiple models with automatic fallback:

### **Supported Providers**

| Provider | Type | API Key | Description |
|----------|------|---------|-------------|
| **Gemini** | Cloud | `GEMINI_API_KEY` | Google's Gemini 1.5 Flash (default) |
| **GPT-4** | Cloud | `OPENAI_API_KEY` | OpenAI's GPT-4 model |
| **Claude** | Cloud | `ANTHROPIC_API_KEY` | Anthropic's Claude 3 Sonnet |
| **Ollama** | Local | None | Local Ollama server |
| **LLaMA** | Local | None | Local LLaMA models |

### **Fallback Chain**

The system automatically tries providers in this order:
1. **Gemini** (default) - Fast, cost-effective
2. **GPT-4** - High quality, reliable
3. **Claude** - Good reasoning capabilities
4. **Ollama** - Local, privacy-focused
5. **LLaMA** - Local, customizable

### **Auto-Detection**

The system automatically detects available providers based on:
- Environment variables
- Network connectivity
- Local service availability

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g inteli-packs

# Or use with npx (no installation required)
npx inteli-packs

# Homebrew (macOS)
brew install yourusername/inteli-packs/inteli-packs
```

### Setup

#### AI Model Configuration

Inteli-Packs supports multiple AI providers with automatic fallback:

**Default: Gemini 1.5 Flash**
```bash
# Set Gemini API key
echo "GEMINI_API_KEY=your_gemini_api_key" > .env
```

**Alternative Providers:**
```bash
# OpenAI GPT-4
echo "OPENAI_API_KEY=your_openai_api_key" >> .env

# Anthropic Claude
echo "ANTHROPIC_API_KEY=your_anthropic_api_key" >> .env

# Local Ollama (requires Ollama installation)
echo "OLLAMA_BASE_URL=http://localhost:11434" >> .env
echo "OLLAMA_MODEL=llama2" >> .env

# Local LLaMA (requires llama.cpp)
echo "LLAMA_MODEL_PATH=/path/to/your/model.gguf" >> .env
```

**Model Selection:**
```bash
# Use specific model
inteli-packs --model gemini
inteli-packs --model gpt4
inteli-packs --model claude
inteli-packs --model ollama

# List available models
inteli-packs --list-models

# Test all models
inteli-packs --test-models
```

3. **Run Your First Analysis**
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

### Bootstrap a New Project

```bash
# Create a new Node.js project with best practices
inteli-packs init my-awesome-project

# Navigate to the project
cd my-awesome-project

# Start development
npm start
```

## 📖 Usage

### Interactive Mode

```bash
inteli-packs
```

Choose from the interactive menu:
- 📦 **Analyze dependencies** - AI-powered dependency analysis
- 🧹 **Clean up unused packages** - Remove unused dependencies
- 📄 **Generate README boilerplate** - AI-generated documentation
- 🛠 **Auto-fix common project issues** - Fix missing configs
- 🔒 **Security analysis** - Vulnerability and security scanning
- 🧪 **Testing analysis** - Test coverage and framework detection
- 🚀 **DevOps generation** - GitHub Actions and Docker files
- ⚡ **Automation tools** - Code refactoring and migration
- 🔌 **Plugin management** - Extensibility and customization
- 📚 **Documentation generation** - Complete docs folder

### Command Line Options

```bash
# Basic usage
inteli-packs

# Auto mode (non-interactive)
inteli-packs --auto

# Specific analyses
inteli-packs --security
inteli-packs --testing
inteli-packs --devops
inteli-packs --documentation
inteli-packs --automation

# Advanced options
inteli-packs --profile detailed
inteli-packs --plugins security,performance
inteli-packs --verbose

# Help
inteli-packs --help
```

### Programmatic Usage

```javascript
const { ProjectAnalyzer, GeminiAPI } = require('inteli-packs');

// Analyze dependencies
const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

// Generate README
const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development  # Optional: for verbose logging
```

### Plugin Configuration

Create custom plugins in `.inteli-packs/plugins/`:

```javascript
// .inteli-packs/plugins/my-plugin.js
module.exports = {
  id: 'my-plugin',
  name: 'My Custom Plugin',
  description: 'Custom analysis plugin',
  hooks: ['pre-analysis', 'post-analysis'],
  execute: async (hook, context) => {
    // Your plugin logic here
    return { data: { custom: 'data' } };
  }
};
```

### Prompt Profiles

Create custom prompt profiles in `.inteli-packs/profiles/`:

```json
// .inteli-packs/profiles/custom.json
{
  "id": "custom",
  "name": "Custom Profile",
  "description": "Custom analysis profile",
  "prompts": {
    "dependencyAnalysis": "Custom dependency analysis prompt",
    "readmeGeneration": "Custom README generation prompt"
  }
}
```

## 📊 Example Output

### Dependency Analysis

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

### Security Analysis

```
🔒 Security Analysis Results:
──────────────────────────────────────────────────
✅ No vulnerabilities detected
⚠️  Suspicious packages: 1
  • test-package@1.0.0 (score: 0.8)

🔍 Security issues in code: 2
  • src/config.js:15 - Hardcoded secret detected
  • src/utils.js:42 - Potentially dangerous code pattern: eval(

💡 Security Recommendations:
  • Use environment variables for secrets
  • Review suspicious packages
  • Implement proper input validation
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test scenarios
node test/cli.test.js

# Validate CLI entrypoint
npm run validate
```

## 🔌 Plugin Development

### Creating a Plugin

1. Create a plugin file in `.inteli-packs/plugins/`
2. Export a plugin object with required properties
3. Implement the `execute` function

```javascript
module.exports = {
  id: 'my-plugin',
  name: 'My Plugin',
  description: 'Custom analysis plugin',
  hooks: ['pre-analysis', 'post-analysis'],
  execute: async (hook, context) => {
    switch (hook) {
      case 'pre-analysis':
        // Pre-analysis logic
        return { data: { preCheck: true } };
      case 'post-analysis':
        // Post-analysis logic
        return { data: { postCheck: true } };
    }
  }
};
```

### Available Hooks

- `pre-analysis`: Before dependency analysis
- `post-analysis`: After dependency analysis
- `pre-generation`: Before documentation generation
- `post-generation`: After documentation generation

## 📚 Documentation

### Local Development

```bash
# Set up documentation site
npm run setup-docs

# Start documentation development server
npm run docs:dev

# Build documentation
npm run docs:build

# Serve built documentation
npm run docs:serve
```

### Documentation Features

- **Interactive Guides**: Step-by-step tutorials
- **API Reference**: Complete API documentation
- **Examples**: Real-world usage examples
- **Blog**: Updates and announcements
- **Search**: Full-text search capabilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   npm run validate
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/inteli-packs.git
cd inteli-packs

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Gemini API key to .env

# Run in development mode
npm run dev

# Set up documentation
npm run setup-docs
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for providing the AI capabilities
- [Commander.js](https://github.com/tj/commander.js) for CLI framework
- [Inquirer.js](https://github.com/SBoudal/Inquirer.js) for interactive prompts
- [Chalk](https://github.com/chalk/chalk) for terminal styling
- [Docusaurus](https://docusaurus.io/) for documentation site

## 📞 Support

- 📧 **Email**: your.email@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/inteli-packs/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/yourusername/inteli-packs/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/inteli-packs/discussions)

## 🚀 Roadmap

- [ ] **Gemini Pro Vision Support**: Analyze code with images
- [ ] **TypeScript Support**: Native TypeScript analysis
- [ ] **Monorepo Enhancement**: Advanced workspace analysis
- [ ] **Performance Profiling**: Runtime performance analysis
- [ ] **Database Integration**: Support for database schemas
- [ ] **Cloud Deployment**: Auto-deploy to cloud platforms
- [ ] **Team Collaboration**: Multi-user project analysis
- [ ] **Custom Rules Engine**: User-defined analysis rules

---

**Made with ❤️ by the Inteli-Packs Team** 
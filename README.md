# 🚀 Inteli-Packs

**Smart developer assistant for Node.js project optimization using AI**

[![npm version](https://badge.fury.io/js/inteli-packs.svg)](https://badge.fury.io/js/inteli-packs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![CI](https://github.com/Nom-nom-hub/inteli-packs/workflows/CI/badge.svg)](https://github.com/Nom-nom-hub/inteli-packs/actions)

Inteli-Packs is a comprehensive AI-powered developer assistant that analyzes, optimizes, and manages Node.js project dependencies and configuration files using **12+ AI providers** with automatic fallback.

## ✨ Features

### 🤖 **AI-Powered Analysis**
- **12+ AI Providers**: Gemini, OpenAI, Claude, OpenRouter, Azure OpenAI, Cohere, Hugging Face, Replicate, Together AI, Perplexity, Ollama, LLaMA
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

Inteli-Packs uses a pluggable AI provider system that supports **12+ models** with automatic fallback:

### **Supported Providers**

| Provider | Type | API Key | Description |
|----------|------|---------|-------------|
| **Gemini** | Cloud | `GEMINI_API_KEY` | Google's Gemini 1.5 Flash (default) |
| **OpenAI** | Cloud | `OPENAI_API_KEY` | OpenAI's GPT-4 and other models |
| **Claude** | Cloud | `ANTHROPIC_API_KEY` | Anthropic's Claude 3 Sonnet |
| **OpenRouter** | Cloud | `OPENROUTER_API_KEY` | Access to multiple models, cost-effective |
| **Azure OpenAI** | Cloud | `AZURE_OPENAI_API_KEY` | Enterprise integration, compliance |
| **Cohere** | Cloud | `COHERE_API_KEY` | Text generation, summarization |
| **Hugging Face** | Cloud | `HUGGINGFACE_API_KEY` | Thousands of specialized models |
| **Replicate** | Cloud | `REPLICATE_API_KEY` | Easy model deployment, async processing |
| **Together AI** | Cloud | `TOGETHER_API_KEY` | Open source models, cost-effective |
| **Perplexity** | Cloud | `PERPLEXITY_API_KEY` | Fast inference, real-time analysis |
| **Ollama** | Local | None | Local privacy-focused models |
| **LLaMA** | Local | None | Local customizable models |

### **Fallback Chain**

The system automatically tries providers in this order:
1. **Gemini** (default) - Fast, cost-effective
2. **OpenAI** - High quality, reliable
3. **Claude** - Good reasoning capabilities
4. **OpenRouter** - Model comparison, cost optimization
5. **Azure OpenAI** - Enterprise environments, compliance
6. **Cohere** - Text generation, summarization
7. **Ollama** - Local, privacy-focused
8. **Together AI** - Open source models, cost-effective
9. **Perplexity** - Real-time analysis, quick responses
10. **Hugging Face** - Specialized models, research
11. **Replicate** - Custom models, batch processing
12. **LLaMA** - Local, customizable

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
brew install Nom-nom-hub/inteli-packs/inteli-packs
```

### Setup

```bash
# Set up your preferred AI provider
export GEMINI_API_KEY="your_gemini_api_key"
export OPENAI_API_KEY="your_openai_api_key"
export ANTHROPIC_API_KEY="your_anthropic_api_key"
export OPENROUTER_API_KEY="your_openrouter_api_key"

# Or use any other provider
export AZURE_OPENAI_API_KEY="your_azure_key"
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
export AZURE_OPENAI_DEPLOYMENT_NAME="your-deployment"
```

### Usage

```bash
# Interactive mode
inteli-packs

# Auto mode with all features
inteli-packs --auto

# Use specific AI provider
inteli-packs --model openrouter --auto
inteli-packs --model azure --auto
inteli-packs --model cohere --auto

# Bootstrap new project
inteli-packs init my-new-project

# List available AI models
inteli-packs --list-models

# Test all AI models
inteli-packs --test-models
```

## 📖 Documentation

📚 **[Full Documentation](https://nom-nom-hub.github.io/inteli-packs/)** - Complete guides, API reference, and examples

### Key Documentation Sections:
- **[Installation Guide](https://nom-nom-hub.github.io/inteli-packs/docs/installation)** - Setup instructions for all platforms
- **[Quick Start](https://nom-nom-hub.github.io/inteli-packs/docs/quick-start)** - Get up and running in minutes
- **[AI Analysis](https://nom-nom-hub.github.io/inteli-packs/docs/features/ai-analysis)** - Complete guide to AI providers
- **[Security Analysis](https://nom-nom-hub.github.io/inteli-packs/docs/features/security)** - Security scanning and recommendations
- **[Testing Analysis](https://nom-nom-hub.github.io/inteli-packs/docs/features/testing)** - Test coverage and framework analysis
- **[DevOps & Automation](https://nom-nom-hub.github.io/inteli-packs/docs/features/devops)** - CI/CD and automation tools
- **[Automation Tools](https://nom-nom-hub.github.io/inteli-packs/docs/features/automation)** - Code refactoring and optimization

## 🎯 Use Cases

### **For Developers**
- **Dependency Management**: Clean up unused packages, find alternatives
- **Security Audits**: Scan for vulnerabilities and suspicious packages
- **Code Quality**: Analyze patterns and get improvement suggestions
- **Project Setup**: Bootstrap new projects with best practices

### **For Teams**
- **CI/CD Integration**: Automated analysis in GitHub Actions
- **Code Reviews**: AI-powered code analysis and suggestions
- **Documentation**: Auto-generate comprehensive documentation
- **Standards**: Enforce consistent project structure and tooling

### **For Enterprises**
- **Compliance**: Azure OpenAI for enterprise environments
- **Privacy**: Local models with Ollama and LLaMA
- **Cost Optimization**: OpenRouter and Together AI for cost-effective analysis
- **Custom Models**: Hugging Face and Replicate for specialized needs

## 🔧 Configuration

### Environment Variables

```bash
# Core providers
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# New providers
OPENROUTER_API_KEY=your_openrouter_api_key
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
COHERE_API_KEY=your_cohere_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
REPLICATE_API_KEY=your_replicate_api_key
TOGETHER_API_KEY=your_together_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key

# Local providers
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
LLAMA_MODEL_PATH=/path/to/your/model.gguf
```

### CLI Options

```bash
# AI Model Selection
--model gemini|openai|claude|openrouter|azure|cohere|huggingface|replicate|together|perplexity|ollama|llama

# Analysis Types
--security          # Security analysis only
--testing           # Testing analysis only
--devops            # DevOps generation only
--documentation     # Documentation generation only
--automation        # Automation tools only

# Utility
--list-models       # List available AI models
--test-models       # Test all AI models
--verbose           # Enable verbose logging
--auto              # Run in non-interactive mode
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://nom-nom-hub.github.io/inteli-packs/docs/contributing) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Nom-nom-hub/inteli-packs.git
cd inteli-packs

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build documentation
npm run docs:build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AI Providers**: Google, OpenAI, Anthropic, OpenRouter, Microsoft, Cohere, Hugging Face, Replicate, Together AI, Perplexity
- **Open Source**: Ollama, LLaMA, and the open source AI community
- **Contributors**: All contributors who help improve Inteli-Packs

## 📞 Support

- **Documentation**: [https://nom-nom-hub.github.io/inteli-packs/](https://nom-nom-hub.github.io/inteli-packs/)
- **Issues**: [GitHub Issues](https://github.com/Nom-nom-hub/inteli-packs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nom-nom-hub/inteli-packs/discussions)

---

**Made with ❤️ by the Inteli-Packs team** 
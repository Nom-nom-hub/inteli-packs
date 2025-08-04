---
sidebar_position: 1
---

# AI-Powered Analysis

Inteli-Packs provides comprehensive AI-powered analysis capabilities using multiple AI providers with automatic fallback.

## Overview

The AI analysis system is the core of Inteli-Packs, providing intelligent insights into your Node.js projects through advanced AI models.

## Supported AI Providers

### 🤖 Gemini 1.5 Flash (Default)
- **Provider**: Google Gemini
- **API Key**: `GEMINI_API_KEY`
- **Advantages**: Fast, cost-effective, good reasoning
- **Best For**: General analysis, dependency insights

### 🧠 GPT-4
- **Provider**: OpenAI
- **API Key**: `OPENAI_API_KEY`
- **Advantages**: High quality, reliable, comprehensive
- **Best For**: Complex analysis, detailed recommendations

### 🎯 Claude 3 Sonnet
- **Provider**: Anthropic
- **API Key**: `ANTHROPIC_API_KEY`
- **Advantages**: Excellent reasoning, safety-focused
- **Best For**: Security analysis, code review

### 🏠 Ollama (Local)
- **Provider**: Local Ollama server
- **Configuration**: `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- **Advantages**: Privacy, no API costs, customizable
- **Best For**: Sensitive projects, offline work

### 🦙 LLaMA (Local)
- **Provider**: Local LLaMA models
- **Configuration**: `LLAMA_MODEL_PATH`
- **Advantages**: Complete privacy, customizable models
- **Best For**: Enterprise environments, custom models

## Configuration

### Environment Variables

```bash
# Gemini (Default)
GEMINI_API_KEY=your_gemini_api_key

# OpenAI GPT-4
OPENAI_API_KEY=your_openai_api_key

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# Local Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Local LLaMA
LLAMA_MODEL_PATH=/path/to/your/model.gguf
```

### CLI Options

```bash
# Use specific model
inteli-packs --model gemini
inteli-packs --model gpt4
inteli-packs --model claude
inteli-packs --model ollama
inteli-packs --model llama

# List available models
inteli-packs --list-models

# Test all models
inteli-packs --test-models
```

## Analysis Features

### 📦 Dependency Analysis

AI-powered dependency analysis goes beyond static analysis:

```bash
# Run dependency analysis
inteli-packs --auto
```

**What it analyzes:**
- **Unused Dependencies**: Detect packages not imported anywhere
- **Missing Dependencies**: Find imports without package.json entries
- **Outdated Packages**: Identify packages with newer versions
- **Security Vulnerabilities**: Check for known security issues
- **Performance Impact**: Analyze bundle size and performance
- **Alternative Packages**: Suggest better alternatives

**Example Output:**
```
🔍 AI Analysis Results:

📦 Dependencies Analysis:
✅ Used packages: 45/50
❌ Unused packages: 5
⚠️  Outdated packages: 3
🔒 Vulnerable packages: 1

💡 AI Recommendations:
- Remove: lodash (use native methods)
- Update: express@4.18.2 → express@4.19.0
- Replace: moment → date-fns (smaller bundle)
- Add: helmet (security headers)
```

### 🧠 Smart Code Analysis

The AI analyzes your codebase for patterns and improvements:

**Code Pattern Detection:**
- Import/export patterns
- Unused variables and functions
- Code duplication
- Performance anti-patterns
- Security vulnerabilities

**Refactoring Suggestions:**
- Modern JavaScript features
- Better package alternatives
- Code organization improvements
- Performance optimizations

### 📊 Context-Aware Analysis

The AI maintains conversation context for better analysis:

```bash
# The AI remembers previous analysis
inteli-packs --auto
# Later...
inteli-packs --security  # Builds on previous context
```

**Context Features:**
- Previous analysis results
- Project-specific patterns
- Custom configurations
- Historical recommendations

## Advanced Features

### 🔄 Automatic Fallback

The system automatically switches between providers:

1. **Primary Provider**: Gemini (default)
2. **Fallback Chain**: GPT-4 → Claude → Ollama → LLaMA
3. **Error Handling**: Automatic retry with different provider
4. **Rate Limiting**: Smart provider rotation

### 🎛️ Custom Profiles

Create custom analysis profiles:

```javascript
// .inteli-packs/profiles/detailed.js
export default {
  name: 'detailed',
  description: 'Comprehensive analysis with detailed recommendations',
  prompts: {
    dependencyAnalysis: 'Analyze dependencies with detailed explanations...',
    securityCheck: 'Perform thorough security analysis...',
    performanceReview: 'Review performance implications...'
  },
  options: {
    includeDevDependencies: true,
    checkPeerDependencies: true,
    analyzeTestFiles: true
  }
};
```

### 🔌 Plugin Integration

AI analysis integrates with plugins:

```bash
# Use specific plugins
inteli-packs --plugins security,performance,documentation
```

**Available Plugins:**
- **Security Plugin**: Enhanced security analysis
- **Performance Plugin**: Bundle size and performance analysis
- **Documentation Plugin**: Auto-generate documentation
- **Custom Plugins**: Extend with your own analysis

## Usage Examples

### Basic Analysis

```bash
# Interactive mode
inteli-packs

# Auto mode with all features
inteli-packs --auto

# Specific analysis
inteli-packs --security
inteli-packs --testing
```

### Advanced Usage

```bash
# Use specific AI model
inteli-packs --model gpt4 --auto

# With custom profile
inteli-packs --profile detailed --auto

# With specific plugins
inteli-packs --plugins security,performance --auto

# Verbose output
inteli-packs --verbose --auto
```

### Programmatic Usage

```javascript
import { AIProvider } from 'inteli-packs';

const ai = new AIProvider();

// Set up providers
ai.registerProvider('gemini', { apiKey: process.env.GEMINI_API_KEY });
ai.registerProvider('gpt4', { apiKey: process.env.OPENAI_API_KEY });

// Run analysis
const result = await ai.analyzeProject({
  model: 'gemini',
  features: ['dependencies', 'security', 'performance']
});
```

## Best Practices

### 🎯 Choosing the Right Model

- **Gemini**: General analysis, cost-effective
- **GPT-4**: Complex analysis, detailed insights
- **Claude**: Security-focused analysis
- **Ollama**: Privacy-sensitive projects
- **LLaMA**: Custom models, enterprise use

### 🔧 Configuration Tips

1. **Set up multiple providers** for reliability
2. **Use environment variables** for API keys
3. **Test providers** before production use
4. **Monitor usage** and costs
5. **Customize profiles** for your needs

### 📈 Performance Optimization

- Use local models for large codebases
- Cache analysis results
- Batch multiple analyses
- Use specific analysis types when possible

## Troubleshooting

### Common Issues

**API Key Errors:**
```bash
# Check environment variables
echo $GEMINI_API_KEY
echo $OPENAI_API_KEY

# Test provider
inteli-packs --test-models
```

**Rate Limiting:**
```bash
# Use fallback providers
inteli-packs --model claude

# Or use local models
inteli-packs --model ollama
```

**Network Issues:**
```bash
# Use local models
inteli-packs --model llama

# Check connectivity
curl https://generativelanguage.googleapis.com
```

### Debug Mode

```bash
# Enable verbose logging
inteli-packs --verbose --auto

# Test specific provider
inteli-packs --test-models --model gemini
```

## API Reference

### AIProvider Class

```javascript
class AIProvider {
  // Register a new provider
  registerProvider(name, config)
  
  // Set primary provider
  setPrimaryProvider(providerName)
  
  // Set fallback chain
  setFallbackChain(providerNames)
  
  // Query AI with fallback
  async query(prompt, options)
  
  // Test provider availability
  async testProvider(providerName)
  
  // Get provider status
  getProviderStatus()
}
```

### Analysis Options

```javascript
const options = {
  model: 'gemini',           // AI model to use
  profile: 'detailed',       // Analysis profile
  plugins: ['security'],     // Enabled plugins
  timeout: 30000,           // Request timeout
  maxRetries: 3,            // Retry attempts
  includeDevDeps: true,     // Include dev dependencies
  analyzeTests: true,       // Analyze test files
  verbose: false            // Verbose output
};
```

This comprehensive AI analysis system provides intelligent insights into your Node.js projects with multiple provider support and automatic fallback capabilities. 
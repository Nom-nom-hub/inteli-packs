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

### 🧠 OpenAI GPT-4
- **Provider**: OpenAI
- **API Key**: `OPENAI_API_KEY`
- **Advantages**: High quality, reliable, comprehensive
- **Best For**: Complex analysis, detailed recommendations

### 🎯 Claude 3 Sonnet
- **Provider**: Anthropic
- **API Key**: `ANTHROPIC_API_KEY`
- **Advantages**: Excellent reasoning, safety-focused
- **Best For**: Security analysis, code review

### 🌐 OpenRouter
- **Provider**: OpenRouter
- **API Key**: `OPENROUTER_API_KEY`
- **Advantages**: Access to multiple models, cost-effective
- **Best For**: Model comparison, cost optimization

### ☁️ Azure OpenAI
- **Provider**: Microsoft Azure
- **API Key**: `AZURE_OPENAI_API_KEY`
- **Endpoint**: `AZURE_OPENAI_ENDPOINT`
- **Deployment**: `AZURE_OPENAI_DEPLOYMENT_NAME`
- **Advantages**: Enterprise integration, compliance
- **Best For**: Enterprise environments, compliance requirements

### 🎨 Cohere
- **Provider**: Cohere
- **API Key**: `COHERE_API_KEY`
- **Advantages**: Good for text generation, summarization
- **Best For**: Documentation generation, text analysis

### 🤗 Hugging Face
- **Provider**: Hugging Face
- **API Key**: `HUGGINGFACE_API_KEY`
- **Advantages**: Access to thousands of models
- **Best For**: Specialized models, research applications

### 🔄 Replicate
- **Provider**: Replicate
- **API Key**: `REPLICATE_API_KEY`
- **Advantages**: Easy model deployment, async processing
- **Best For**: Custom model deployment, batch processing

### 🌟 Together AI
- **Provider**: Together AI
- **API Key**: `TOGETHER_API_KEY`
- **Advantages**: Open source models, cost-effective
- **Best For**: Open source models, cost optimization

### 🔍 Perplexity
- **Provider**: Perplexity
- **API Key**: `PERPLEXITY_API_KEY`
- **Advantages**: Fast inference, good for real-time
- **Best For**: Real-time analysis, quick responses

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

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4

# Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name

# Cohere
COHERE_API_KEY=your_cohere_api_key
COHERE_MODEL=command

# Hugging Face
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_MODEL=meta-llama/Llama-2-70b-chat-hf

# Replicate
REPLICATE_API_KEY=your_replicate_api_key
REPLICATE_MODEL=meta/llama-2-70b-chat:02e509c789ffa4e38dc4c3c8c0b5c7c0b5c7c0b5c7c0b5c7c0b5c7c0b5c7c0b5c7c0b5

# Together AI
TOGETHER_API_KEY=your_together_api_key
TOGETHER_MODEL=togethercomputer/llama-2-70b

# Perplexity
PERPLEXITY_API_KEY=your_perplexity_api_key
PERPLEXITY_MODEL=llama-3.1-8b-instant

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
inteli-packs --model openai
inteli-packs --model claude
inteli-packs --model openrouter
inteli-packs --model azure
inteli-packs --model cohere
inteli-packs --model huggingface
inteli-packs --model replicate
inteli-packs --model together
inteli-packs --model perplexity
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
2. **Fallback Chain**: OpenAI → Claude → OpenRouter → Azure → Cohere → Ollama → Together → Perplexity → Hugging Face → Replicate → LLaMA
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
inteli-packs --model openai --auto

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
ai.registerProvider('openai', { apiKey: process.env.OPENAI_API_KEY });
ai.registerProvider('openrouter', { apiKey: process.env.OPENROUTER_API_KEY });

// Run analysis
const result = await ai.analyzeProject({
  model: 'openrouter',
  features: ['dependencies', 'security', 'performance']
});
```

## Best Practices

### 🎯 Choosing the Right Model

- **Gemini**: General analysis, cost-effective
- **OpenAI**: Complex analysis, detailed insights
- **Claude**: Security-focused analysis
- **OpenRouter**: Model comparison, cost optimization
- **Azure**: Enterprise environments, compliance
- **Cohere**: Text generation, summarization
- **Hugging Face**: Specialized models, research
- **Replicate**: Custom models, batch processing
- **Together AI**: Open source models, cost-effective
- **Perplexity**: Real-time analysis, quick responses
- **Ollama**: Privacy-sensitive projects, offline work
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
echo $OPENROUTER_API_KEY

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
  model: 'openrouter',        // AI model to use
  profile: 'detailed',        // Analysis profile
  plugins: ['security'],      // Enabled plugins
  timeout: 30000,            // Request timeout
  maxRetries: 3,             // Retry attempts
  includeDevDeps: true,      // Include dev dependencies
  analyzeTests: true,        // Analyze test files
  verbose: false             // Verbose output
};
```

This comprehensive AI analysis system provides intelligent insights into your Node.js projects with multiple provider support and automatic fallback capabilities. 
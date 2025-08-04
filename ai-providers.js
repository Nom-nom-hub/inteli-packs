/**
 * AI Providers System
 * Supports multiple AI models with automatic fallback
 */

const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

class AIProvider {
  constructor() {
    this.providers = new Map();
    this.currentProvider = null;
    this.fallbackChain = [];
    this.conversationHistory = [];
  }

  /**
   * Register an AI provider
   * @param {string} name - Provider name
   * @param {Object} config - Provider configuration
   */
  registerProvider(name, config) {
    this.providers.set(name, {
      name,
      config,
      isAvailable: false,
      lastUsed: null,
      errorCount: 0
    });
  }

  /**
   * Set the primary provider
   * @param {string} providerName - Provider name
   */
  setPrimaryProvider(providerName) {
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider '${providerName}' not found`);
    }
    this.currentProvider = providerName;
  }

  /**
   * Set fallback chain
   * @param {Array} providerNames - Array of provider names in fallback order
   */
  setFallbackChain(providerNames) {
    this.fallbackChain = providerNames.filter(name => this.providers.has(name));
  }

  /**
   * Get available providers
   * @returns {Array} - List of available provider names
   */
  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }

  /**
   * Test provider availability
   * @param {string} providerName - Provider name
   * @returns {Promise<boolean>} - Whether provider is available
   */
  async testProvider(providerName) {
    const provider = this.providers.get(providerName);
    if (!provider) return false;

    try {
      const testPrompt = "Hello, this is a test message.";
      await this.query(testPrompt, { provider: providerName, timeout: 5000 });
      provider.isAvailable = true;
      provider.errorCount = 0;
      return true;
    } catch (error) {
      provider.isAvailable = false;
      provider.errorCount++;
      return false;
    }
  }

  /**
   * Query AI with automatic fallback
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - AI response
   */
  async query(prompt, options = {}) {
    const providers = options.provider ? [options.provider] : this.fallbackChain;
    
    for (const providerName of providers) {
      try {
        console.log(chalk.blue(`🤖 Using ${providerName}...`));
        const result = await this.queryProvider(providerName, prompt, options);
        
        // Update provider stats
        const provider = this.providers.get(providerName);
        if (provider) {
          provider.lastUsed = new Date();
          provider.isAvailable = true;
          provider.errorCount = 0;
        }
        
        return result;
      } catch (error) {
        console.log(chalk.yellow(`⚠️  ${providerName} failed: ${error.message}`));
        
        // Update provider stats
        const provider = this.providers.get(providerName);
        if (provider) {
          provider.isAvailable = false;
          provider.errorCount++;
        }
        
        // Continue to next provider in fallback chain
        continue;
      }
    }
    
    throw new Error('All AI providers failed');
  }

  /**
   * Query specific provider
   * @param {string} providerName - Provider name
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - AI response
   */
  async queryProvider(providerName, prompt, options = {}) {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`);
    }

    const config = provider.config;
    
    switch (providerName) {
      case 'gemini':
        return await this.queryGemini(prompt, config, options);
      case 'gpt4':
        return await this.queryGPT4(prompt, config, options);
      case 'claude':
        return await this.queryClaude(prompt, config, options);
      case 'ollama':
        return await this.queryOllama(prompt, config, options);
      case 'llama':
        return await this.queryLlama(prompt, config, options);
      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
  }

  /**
   * Query Gemini API
   */
  async queryGemini(prompt, config, options = {}) {
    const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2048,
        topP: 0.8,
        topK: 40
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: options.timeout || 30000
    });

    const text = response.data.candidates[0].content.parts[0].text;
    return { text, provider: 'gemini' };
  }

  /**
   * Query GPT-4 API
   */
  async queryGPT4(prompt, config, options = {}) {
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: options.timeout || 30000
    });

    const text = response.data.choices[0].message.content;
    return { text, provider: 'gpt4' };
  }

  /**
   * Query Claude API
   */
  async queryClaude(prompt, config, options = {}) {
    const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: options.maxTokens || 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      timeout: options.timeout || 30000
    });

    const text = response.data.content[0].text;
    return { text, provider: 'claude' };
  }

  /**
   * Query Ollama (local)
   */
  async queryOllama(prompt, config, options = {}) {
    const model = config.model || 'llama2';
    const baseURL = config.baseURL || 'http://localhost:11434';

    const response = await axios.post(`${baseURL}/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        num_predict: options.maxTokens || 2048
      }
    }, {
      timeout: options.timeout || 60000 // Longer timeout for local models
    });

    const text = response.data.response;
    return { text, provider: 'ollama' };
  }

  /**
   * Query local LLaMA
   */
  async queryLlama(prompt, config, options = {}) {
    const modelPath = config.modelPath || process.env.LLAMA_MODEL_PATH;
    if (!modelPath) {
      throw new Error('LLAMA_MODEL_PATH not configured');
    }

    // This would require llama.cpp or similar library
    // For now, we'll throw an error indicating it needs implementation
    throw new Error('Local LLaMA support requires additional setup');
  }

  /**
   * Auto-detect available providers
   * @returns {Promise<Array>} - List of available providers
   */
  async autoDetectProviders() {
    const available = [];
    
    for (const [name, provider] of this.providers) {
      if (await this.testProvider(name)) {
        available.push(name);
      }
    }
    
    return available;
  }

  /**
   * Get provider status
   * @returns {Object} - Provider status information
   */
  getProviderStatus() {
    const status = {};
    
    for (const [name, provider] of this.providers) {
      status[name] = {
        available: provider.isAvailable,
        lastUsed: provider.lastUsed,
        errorCount: provider.errorCount
      };
    }
    
    return status;
  }

  /**
   * Add to conversation history
   * @param {string} context - Conversation context
   */
  addToMemory(context) {
    this.conversationHistory.push({
      timestamp: new Date().toISOString(),
      context: context
    });
    
    // Keep only last 10 conversations
    if (this.conversationHistory.length > 10) {
      this.conversationHistory.shift();
    }
  }

  /**
   * Get conversation context
   * @returns {string} - Formatted conversation history
   */
  getConversationContext() {
    if (this.conversationHistory.length === 0) return '';
    
    return `Previous conversation context:\n${this.conversationHistory
      .slice(-3)
      .map(conv => `- ${conv.context}`)
      .join('\n')}\n\n`;
  }
}

// Create and configure the AI provider system
const aiProvider = new AIProvider();

// Register default providers
aiProvider.registerProvider('gemini', {
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-1.5-flash'
});

aiProvider.registerProvider('gpt4', {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
});

aiProvider.registerProvider('claude', {
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-sonnet-20240229'
});

aiProvider.registerProvider('ollama', {
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama2'
});

aiProvider.registerProvider('llama', {
  modelPath: process.env.LLAMA_MODEL_PATH
});

// Set default fallback chain
aiProvider.setFallbackChain(['gemini', 'gpt4', 'claude', 'ollama']);

module.exports = aiProvider; 
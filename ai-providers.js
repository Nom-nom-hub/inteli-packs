/**
 * AI Providers System
 * Supports multiple AI models with automatic fallback
 */

import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

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
    // Check if provider has required configuration
    let isAvailable = false;
    
    if (name === 'gemini' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'openai' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'claude' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'ollama') {
      isAvailable = true; // Ollama is local, always available if running
    } else if (name === 'llama' && config.modelPath) {
      isAvailable = true;
    } else if (name === 'openrouter' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'azure' && config.apiKey && config.endpoint && config.deploymentName) {
      isAvailable = true;
    } else if (name === 'cohere' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'huggingface' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'replicate' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'together' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'perplexity' && config.apiKey) {
      isAvailable = true;
    } else if (name === 'groq' && config.apiKey) {
      isAvailable = true;
    }
    
    this.providers.set(name, {
      name,
      config,
      isAvailable,
      lastUsed: null,
      errorCount: 0,
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
      const testPrompt = 'Hello, this is a test message.';
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

    const { config } = provider;
    const timeout = options.timeout || 30000;

    switch (providerName) {
      case 'gemini':
        return await this.queryGemini(prompt, config, options);
      case 'gpt4':
      case 'openai':
        return await this.queryOpenAI(prompt, config, options);
      case 'claude':
      case 'anthropic':
        return await this.queryClaude(prompt, config, options);
      case 'ollama':
        return await this.queryOllama(prompt, config, options);
      case 'llama':
        return await this.queryLlama(prompt, config, options);
      case 'openrouter':
        return await this.queryOpenRouter(prompt, config, options);
      case 'azure':
        return await this.queryAzureOpenAI(prompt, config, options);
      case 'cohere':
        return await this.queryCohere(prompt, config, options);
      case 'huggingface':
        return await this.queryHuggingFace(prompt, config, options);
      case 'replicate':
        return await this.queryReplicate(prompt, config, options);
      case 'together':
        return await this.queryTogetherAI(prompt, config, options);
      case 'perplexity':
        return await this.queryPerplexity(prompt, config, options);
      case 'groq':
        return await this.queryGroq(prompt, config, options);
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  }

  /**
   * Query Gemini API
   */
  async queryGemini(prompt, config, options = {}) {
    const { apiKey } = config;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required for Gemini provider');
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 2048,
        }
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.candidates[0].content.parts[0].text,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      usage: response.data.usageMetadata
    };
  }

  /**
   * Query OpenAI API
   */
  async queryOpenAI(prompt, config, options = {}) {
    const { apiKey, model = 'gpt-4' } = config;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required for OpenAI provider');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: 'openai',
      model: model,
      usage: response.data.usage
    };
  }

  /**
   * Query Claude API
   */
  async queryClaude(prompt, config, options = {}) {
    const { apiKey, model = 'claude-3-sonnet-20240229' } = config;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required for Claude provider');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: model,
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return {
      text: response.data.content[0].text,
      provider: 'claude',
      model: model,
      usage: response.data.usage
    };
  }

  /**
   * Query Ollama API
   */
  async queryOllama(prompt, config, options = {}) {
    const { baseUrl = 'http://localhost:11434', model = 'llama2' } = config;

    const response = await axios.post(
      `${baseUrl}/api/generate`,
      {
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || 2048,
        }
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.response,
      provider: 'ollama',
      model: model,
      usage: {
        prompt_tokens: response.data.prompt_eval_count,
        completion_tokens: response.data.eval_count,
        total_tokens: response.data.prompt_eval_count + response.data.eval_count
      }
    };
  }

  /**
   * Query LLaMA API
   */
  async queryLlama(prompt, config, options = {}) {
    const { modelPath } = config;
    if (!modelPath) {
      throw new Error('LLAMA_MODEL_PATH is required for LLaMA provider');
    }

    // This would require llama.cpp integration
    // For now, we'll throw an error indicating local setup required
    throw new Error('LLaMA local inference requires llama.cpp setup. Please configure llama.cpp separately.');
  }

  /**
   * Query OpenRouter API
   */
  async queryOpenRouter(prompt, config, options = {}) {
    const { apiKey, model = 'openai/gpt-4' } = config;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required for OpenRouter provider');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/Nom-nom-hub/inteli-packs',
          'X-Title': 'Inteli-Packs'
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: 'openrouter',
      model: model,
      usage: response.data.usage
    };
  }

  /**
   * Query Azure OpenAI API
   */
  async queryAzureOpenAI(prompt, config, options = {}) {
    const { apiKey, endpoint, deploymentName } = config;
    if (!apiKey || !endpoint || !deploymentName) {
      throw new Error('AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, and AZURE_OPENAI_DEPLOYMENT_NAME are required for Azure OpenAI provider');
    }

    const response = await axios.post(
      `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`,
      {
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: 'azure',
      model: deploymentName,
      usage: response.data.usage
    };
  }

  /**
   * Query Cohere API
   */
  async queryCohere(prompt, config, options = {}) {
    const { apiKey, model = 'command' } = config;
    if (!apiKey) {
      throw new Error('COHERE_API_KEY is required for Cohere provider');
    }

    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: model,
        prompt: prompt,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.generations[0].text,
      provider: 'cohere',
      model: model,
      usage: {
        prompt_tokens: response.data.meta.input_tokens,
        completion_tokens: response.data.meta.output_tokens,
        total_tokens: response.data.meta.input_tokens + response.data.meta.output_tokens
      }
    };
  }

  /**
   * Query Hugging Face API
   */
  async queryHuggingFace(prompt, config, options = {}) {
    const { apiKey, model = 'meta-llama/Llama-2-70b-chat-hf' } = config;
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is required for Hugging Face provider');
    }

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          temperature: options.temperature || 0.7,
          max_new_tokens: options.maxTokens || 2048,
        }
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data[0].generated_text,
      provider: 'huggingface',
      model: model,
      usage: {
        prompt_tokens: 0, // HF doesn't provide token usage
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  }

  /**
   * Query Replicate API
   */
  async queryReplicate(prompt, config, options = {}) {
    const { apiKey, model = 'meta/llama-2-70b-chat:02e509c789ffa4e38dc4c3c8c0b5c7c0b5c7c0b5c7c0b5c7c0b5c7c0b5c7c0b5' } = config;
    if (!apiKey) {
      throw new Error('REPLICATE_API_KEY is required for Replicate provider');
    }

    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: model,
        input: {
          prompt: prompt,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048,
        }
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Replicate is async, so we need to poll for results
    const predictionId = response.data.id;
    let result;
    
    for (let i = 0; i < 30; i++) {
      const statusResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${apiKey}`,
          }
        }
      );

      if (statusResponse.data.status === 'succeeded') {
        result = statusResponse.data.output;
        break;
      } else if (statusResponse.data.status === 'failed') {
        throw new Error('Replicate prediction failed');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!result) {
      throw new Error('Replicate prediction timed out');
    }

    return {
      text: Array.isArray(result) ? result.join('') : result,
      provider: 'replicate',
      model: model,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  }

  /**
   * Query Together AI API
   */
  async queryTogetherAI(prompt, config, options = {}) {
    const { apiKey, model = 'togethercomputer/llama-2-70b' } = config;
    if (!apiKey) {
      throw new Error('TOGETHER_API_KEY is required for Together AI provider');
    }

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: 'together',
      model: model,
      usage: response.data.usage
    };
  }

  /**
   * Query Perplexity API
   */
  async queryPerplexity(prompt, config, options = {}) {
    const { apiKey, model = 'llama-3.1-8b-instant' } = config;
    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY is required for Perplexity provider');
    }

    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: 'perplexity',
      model: model,
      usage: response.data.usage
    };
  }

  /**
   * Query Groq API
   */
  async queryGroq(prompt, config, options = {}) {
    const { apiKey, model = 'llama3-8b-8192' } = config;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is required for Groq provider');
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      },
      {
        timeout: options.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: 'groq',
      model: model,
      usage: response.data.usage
    };
  }

  /**
   * Auto-detect available providers
   */
  async autoDetectProviders() {
    const availableProviders = [];
    
    for (const [name, provider] of this.providers) {
      if (await this.testProvider(name)) {
        availableProviders.push(name);
      }
    }

    return availableProviders;
  }

  /**
   * Get provider status
   */
  getProviderStatus() {
    const status = {};
    
    for (const [name, provider] of this.providers) {
      status[name] = {
        available: provider.isAvailable,
        lastUsed: provider.lastUsed,
        errorCount: provider.errorCount,
        config: {
          hasApiKey: !!provider.config.apiKey,
          model: provider.config.model || 'default'
        }
      };
    }

    return status;
  }

  /**
   * Add context to memory
   */
  addToMemory(context) {
    this.conversationHistory.push({
      timestamp: new Date(),
      context
    });

    // Keep only last 10 conversations
    if (this.conversationHistory.length > 10) {
      this.conversationHistory.shift();
    }
  }

  /**
   * Get conversation context
   */
  getConversationContext() {
    return this.conversationHistory.map(entry => entry.context).join('\n\n');
  }
}

// Initialize with default providers
const AIProviderInstance = new AIProvider();

// Function to register all providers
const registerProviders = () => {
  AIProviderInstance.registerProvider('gemini', {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash'
  });

  AIProviderInstance.registerProvider('openai', {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  });

  AIProviderInstance.registerProvider('claude', {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-sonnet-20240229'
  });

  AIProviderInstance.registerProvider('ollama', {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama2'
  });

  AIProviderInstance.registerProvider('llama', {
    modelPath: process.env.LLAMA_MODEL_PATH
  });

  // Register new providers
  AIProviderInstance.registerProvider('openrouter', {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-4'
  });

  AIProviderInstance.registerProvider('azure', {
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
  });

  AIProviderInstance.registerProvider('cohere', {
    apiKey: process.env.COHERE_API_KEY,
    model: process.env.COHERE_MODEL || 'command'
  });

  AIProviderInstance.registerProvider('huggingface', {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-2-70b-chat-hf'
  });

  AIProviderInstance.registerProvider('replicate', {
    apiKey: process.env.REPLICATE_API_KEY,
    model: process.env.REPLICATE_MODEL || 'meta/llama-2-70b-chat:02e509c789ffa4e38dc4c3c8c0b5c7c0b5c7c0b5c7c0b5c7c0b5c7c0b5c7c0b5'
  });

  AIProviderInstance.registerProvider('together', {
    apiKey: process.env.TOGETHER_API_KEY,
    model: process.env.TOGETHER_MODEL || 'togethercomputer/llama-2-70b'
  });

  AIProviderInstance.registerProvider('perplexity', {
    apiKey: process.env.PERPLEXITY_API_KEY,
    model: process.env.PERPLEXITY_MODEL || 'llama-3.1-8b-instant'
  });

  AIProviderInstance.registerProvider('groq', {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama3-8b-8192'
  });
};

// Register providers initially
registerProviders();

// Export a function to re-register providers (useful when env vars change)
AIProviderInstance.reregisterProviders = registerProviders;

// Set default fallback chain
AIProviderInstance.setFallbackChain([
  'gemini',
  'openai',
  'claude',
  'openrouter',
  'azure',
  'cohere',
  'ollama',
  'together',
  'perplexity',
  'groq',
  'huggingface',
  'replicate',
  'llama'
]);

export default AIProviderInstance;

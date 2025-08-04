/**
 * Gemini API Wrapper (Legacy)
 * Handles communication with Google's Gemini 1.5 Flash API
 * @deprecated Use AIProvider from ai-providers.js instead
 */

import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

class GeminiAPI {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.conversationHistory = [];
    this.promptMemory = new Map();

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
  }

  /**
   * Store conversation context for memory
   * @param {string} context - Conversation context
   */
  addToMemory(context) {
    this.conversationHistory.push({
      timestamp: new Date().toISOString(),
      context: context,
    });

    // Keep only last 10 conversations for memory
    if (this.conversationHistory.length > 10) {
      this.conversationHistory.shift();
    }
  }

  /**
   * Get conversation context for memory
   * @returns {string} - Formatted conversation history
   */
  getConversationContext() {
    if (this.conversationHistory.length === 0) return '';

    return `Previous conversation context:\n${this.conversationHistory
      .slice(-3)
      .map(conv => `- ${conv.context}`)
      .join('\n')}\n\n`;
  }

  /**
   * Generate code snippet suggestions
   * @param {string} codeContext - Current code context
   * @param {string} language - Programming language
   * @returns {Promise<Array>} - Code suggestions
   */
  async generateCodeSuggestions(codeContext, language = 'javascript') {
    const prompt = `
Analyze this code and suggest improvements or alternative implementations:

Code Context:
${codeContext}

Language: ${language}

Provide 3-5 specific code suggestions with explanations. Focus on:
- Performance improvements
- Modern syntax
- Best practices
- Security considerations

Format as JSON array:
[
  {
    "suggestion": "Use optional chaining",
    "code": "const value = obj?.prop?.nested",
    "explanation": "Safer property access",
    "impact": "high"
  }
]
`;

    const response = await this.query(prompt);

    try {
      return JSON.parse(response.text);
    } catch (error) {
      return [
        {
          suggestion: 'Could not parse suggestions',
          code: '',
          explanation: 'Error parsing AI response',
          impact: 'low',
        },
      ];
    }
  }

  /**
   * Parse natural language CLI commands
   * @param {string} naturalCommand - Natural language command
   * @returns {Promise<Object>} - Parsed command structure
   */
  async parseNaturalCommand(naturalCommand) {
    const prompt = `
Parse this natural language command into structured CLI actions:

Command: "${naturalCommand}"

Return a JSON object with the following structure:
{
  "action": "analyze|cleanup|generate|autofix",
  "target": "dependencies|files|readme|config",
  "options": {
    "auto": boolean,
    "verbose": boolean,
    "force": boolean
  },
  "confidence": 0.0-1.0
}

Examples:
- "clean up unused packages" → {"action": "cleanup", "target": "dependencies", "options": {"auto": false}}
- "generate readme" → {"action": "generate", "target": "readme", "options": {"auto": true}}
- "fix everything automatically" → {"action": "autofix", "target": "all", "options": {"auto": true, "force": true}}
`;

    const response = await this.query(prompt);

    try {
      return JSON.parse(response.text);
    } catch (error) {
      return { action: 'unknown', target: 'unknown', options: {}, confidence: 0.0 };
    }
  }

  /**
   * Clean up AI response to remove markdown formatting
   * @param {string} text - Raw AI response
   * @returns {string} - Cleaned response
   */
  cleanResponse(text) {
    // Remove markdown code blocks
    text = text.replace(/```(?:json|javascript|js)?\s*\n?/g, '');
    text = text.replace(/```\s*$/g, '');

    // Remove leading/trailing whitespace
    text = text.trim();

    return text;
  }

  /**
   * Query Gemini API with structured prompts
   * @param {string} prompt - The prompt to send to Gemini
   * @param {Object} options - Additional options for the request
   * @returns {Promise<Object>} - Gemini API response
   */
  async query(prompt, options = {}) {
    const startTime = Date.now();

    try {
      // Log API call for rate tracking
      const { logApiCall } = await import('./utils.js');
      const apiLog = logApiCall('gemini-1.5-flash:generateContent', options);

      // Add conversation context for memory
      const contextPrompt = this.getConversationContext() + prompt;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: contextPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: options.temperature || 0.3,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxOutputTokens || 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      };

      const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      const duration = Date.now() - startTime;

      if (response.data.candidates?.[0]) {
        const rawText = response.data.candidates[0].content.parts[0].text;

        // Store in memory
        this.addToMemory(
          `Query: ${prompt.substring(0, 100)}... Response: ${rawText.substring(0, 100)}...`,
        );

        // Log successful API call
        if (process.env.NODE_ENV === 'development' || process.argv.includes('--verbose')) {
          const { formatDuration } = await import('./utils.js');
          console.log(chalk.gray(`✅ API call completed in ${formatDuration(duration)}`));
        }

        return {
          success: true,
          text: this.cleanResponse(rawText),
          usage: response.data.usageMetadata,
          duration,
        };
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      // Handle rate limiting
      if (error.response?.status === 429) {
        console.warn(
          chalk.yellow('⚠️  Rate limit exceeded. Please wait before making more requests.'),
        );
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      // Handle API key issues
      if (error.response?.status === 400) {
        console.error(chalk.red('❌ Invalid API key or request format'));
        throw new Error('Invalid API key. Please check your GEMINI_API_KEY environment variable.');
      }

      // Handle timeout
      if (error.code === 'ECONNABORTED') {
        console.warn(chalk.yellow('⚠️  API request timed out'));
        throw new Error('Gemini API request timed out. Please try again.');
      }

      // Handle network errors
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.error(chalk.red('❌ Network error. Please check your internet connection.'));
        throw new Error('Network error. Please check your internet connection.');
      }

      // Log error details in development
      if (process.env.NODE_ENV === 'development' || process.argv.includes('--verbose')) {
        console.error(chalk.red('❌ API Error Details:'), {
          status: error.response?.status,
          message: error.message,
          duration: `${duration}ms`,
        });
      }

      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }

  /**
   * Analyze package.json dependencies
   * @param {Object} packageJson - The package.json content
   * @param {Array} sourceFiles - Array of source file contents
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeDependencies(packageJson, sourceFiles = []) {
    const prompt = `
Analyze this Node.js project's dependencies and provide optimization recommendations.

Package.json:
${JSON.stringify(packageJson, null, 2)}

Source files (first 1000 chars each):
${sourceFiles.map((file, index) => `File ${index + 1}:\n${file.substring(0, 1000)}`).join('\n\n')}

Please provide a JSON response with the following structure:
{
  "unusedDependencies": ["package1", "package2"],
  "missingDependencies": ["package3", "package4"],
  "outdatedPackages": [
    {
      "name": "package5",
      "currentVersion": "1.0.0",
      "suggestedVersion": "2.0.0",
      "reason": "Security updates"
    }
  ],
  "suggestedReplacements": [
    {
      "oldPackage": "moment",
      "newPackage": "dayjs",
      "reason": "Smaller bundle size"
    }
  ],
  "recommendations": [
    "Consider using dayjs instead of moment for smaller bundle size",
    "lodash can be replaced with native JavaScript methods"
  ]
}

Focus on practical, actionable recommendations. Be concise and specific.
`;

    const response = await this.query(prompt);

    try {
      return JSON.parse(response.text);
    } catch (parseError) {
      console.warn(chalk.yellow('⚠️  Could not parse Gemini response as JSON, returning raw text'));
      return { rawResponse: response.text };
    }
  }

  /**
   * Generate README boilerplate
   * @param {Object} packageJson - The package.json content
   * @returns {Promise<string>} - Generated README content
   */
  async generateReadme(packageJson) {
    const prompt = `
Generate a professional README.md for this Node.js project:

Package.json:
${JSON.stringify(packageJson, null, 2)}

Create a comprehensive README with:
1. Project title and description
2. Installation instructions
3. Usage examples
4. API documentation (if applicable)
5. Contributing guidelines
6. License information

Use markdown formatting and make it production-ready.
`;

    const response = await this.query(prompt);
    return response.text;
  }

  /**
   * Generate ESLint configuration
   * @param {Object} packageJson - The package.json content
   * @returns {Promise<string>} - Generated ESLint config
   */
  async generateEslintConfig(packageJson) {
    const prompt = `
Generate an ESLint configuration for this Node.js project:

Package.json:
${JSON.stringify(packageJson, null, 2)}

Create a .eslintrc.js file with appropriate rules for:
- Modern JavaScript/Node.js development
- Common best practices
- TypeScript support (if applicable)
- React support (if applicable)

IMPORTANT: Return ONLY the raw JavaScript configuration object without any markdown formatting, code blocks, or backticks. The response should be pure JavaScript that can be directly written to a .eslintrc.js file.

Example format:
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  rules: {
    'no-unused-vars': 'error'
  }
};
`;

    const response = await this.query(prompt);
    return response.text;
  }

  /**
   * Generate Prettier configuration
   * @returns {Promise<string>} - Generated Prettier config
   */
  async generatePrettierConfig() {
    const prompt = `
Generate a Prettier configuration file (.prettierrc) for a Node.js project.

Include common settings for:
- Code formatting
- Consistent style
- Modern JavaScript practices

IMPORTANT: Return ONLY the raw JSON configuration without any markdown formatting, code blocks, or backticks. The response should be pure JSON that can be directly written to a .prettierrc file.

Example format:
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all"
}
`;

    const response = await this.query(prompt);
    return response.text;
  }
}

export default GeminiAPI;

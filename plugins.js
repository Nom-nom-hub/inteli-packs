/**
 * Plugin System Module
 * Handles plugin support and custom prompt profiles
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.promptProfiles = new Map();
    this.pluginDir = '.inteli-packs/plugins';
    this.profilesDir = '.inteli-packs/profiles';
  }

  /**
   * Initialize plugin system
   */
  async initialize() {
    try {
      await fs.ensureDir(this.pluginDir);
      await fs.ensureDir(this.profilesDir);
      
      // Load built-in plugins
      await this.loadBuiltInPlugins();
      
      // Load custom plugins
      await this.loadCustomPlugins();
      
      // Load prompt profiles
      await this.loadPromptProfiles();
      
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Plugin system initialization failed:'), error.message);
    }
  }

  /**
   * Load built-in plugins
   */
  async loadBuiltInPlugins() {
    const builtInPlugins = {
      'security': {
        name: 'Security Analyzer',
        description: 'Enhanced security analysis',
        hooks: ['pre-analysis', 'post-analysis'],
        execute: this.securityPlugin.bind(this)
      },
      'performance': {
        name: 'Performance Optimizer',
        description: 'Performance analysis and optimization',
        hooks: ['pre-analysis', 'post-analysis'],
        execute: this.performancePlugin.bind(this)
      },
      'documentation': {
        name: 'Documentation Generator',
        description: 'Enhanced documentation generation',
        hooks: ['pre-generation', 'post-generation'],
        execute: this.documentationPlugin.bind(this)
      }
    };

    for (const [id, plugin] of Object.entries(builtInPlugins)) {
      this.plugins.set(id, plugin);
    }
  }

  /**
   * Load custom plugins from plugins directory
   */
  async loadCustomPlugins() {
    try {
      const pluginFiles = await fs.readdir(this.pluginDir);
      
      for (const file of pluginFiles) {
        if (file.endsWith('.js')) {
          try {
            const { join: pluginPath } = path(this.pluginDir, file);
            const plugin = require(pluginPath);
            
            if (plugin.plugin?.name && plugin.execute) {
              this.plugins.set(plugin.id, plugin);
              console.log(chalk.green(`✅ Loaded plugin: ${plugin.name}`));
            }
          } catch (error) {
            console.warn(chalk.yellow(`⚠️  Failed to load plugin ${file}:`), error.message);
          }
        }
      }
    } catch (error) {
      // Plugin directory doesn't exist yet
    }
  }

  /**
   * Load prompt profiles
   */
  async loadPromptProfiles() {
    const defaultProfiles = {
      'default': {
        name: 'Default',
        description: 'Standard analysis prompts',
        prompts: {
          dependencyAnalysis: 'Analyze dependencies and provide optimization recommendations',
          readmeGeneration: 'Generate a professional README.md',
          securityAnalysis: 'Check for security vulnerabilities and issues'
        }
      },
      'detailed': {
        name: 'Detailed Analysis',
        description: 'Comprehensive analysis with detailed explanations',
        prompts: {
          dependencyAnalysis: 'Provide detailed analysis of dependencies with explanations for each recommendation',
          readmeGeneration: 'Generate a comprehensive README with detailed sections',
          securityAnalysis: 'Perform thorough security analysis with detailed findings'
        }
      },
      'minimal': {
        name: 'Minimal',
        description: 'Quick analysis with minimal output',
        prompts: {
          dependencyAnalysis: 'Quick dependency analysis with essential recommendations only',
          readmeGeneration: 'Generate a minimal README with basic sections',
          securityAnalysis: 'Quick security check for critical issues only'
        }
      }
    };

    for (const [id, profile] of Object.entries(defaultProfiles)) {
      this.promptProfiles.set(id, profile);
    }

    // Load custom profiles
    try {
      const profileFiles = await fs.readdir(this.profilesDir);
      
      for (const file of profileFiles) {
        if (file.endsWith('.json')) {
          try {
            const { join: profilePath } = path(this.profilesDir, file);
            const profile = JSON.parse(await fs.readFile(profilePath, 'utf8'));
            
            if (profile.profile?.name && profile.prompts) {
              this.promptProfiles.set(profile.id, profile);
              console.log(chalk.green(`✅ Loaded profile: ${profile.name}`));
            }
          } catch (error) {
            console.warn(chalk.yellow(`⚠️  Failed to load profile ${file}:`), error.message);
          }
        }
      }
    } catch (error) {
      // Profiles directory doesn't exist yet
    }
  }

  /**
   * Execute plugins for a specific hook
   * @param {string} hook - Hook name
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} - Plugin execution results
   */
  async executePlugins(hook, context) {
    const results = {
      executed: [],
      errors: [],
      data: {}
    };

    for (const [id, plugin] of this.plugins) {
      if (plugin.plugin?.hooks.includes(hook)) {
        try {
          const result = await plugin.execute(hook, context);
          results.executed.push({
            plugin: id,
            name: plugin.name,
            result: result
          });
          
          if (result.data) {
            results.data[id] = result.data;
          }
        } catch (error) {
          results.errors.push({
            plugin: id,
            name: plugin.name,
            error: error.message
          });
        }
      }
    }

    return results;
  }

  /**
   * Get prompt for specific task and profile
   * @param {string} task - Task name
   * @param {string} profileId - Profile ID
   * @returns {string} - Customized prompt
   */
  getPrompt(task, profileId = 'default') {
    const { promptProfiles: profile } = this.get(profileId);
    
    if (profile?.prompts && profile.prompts[task]) {
      return profile.prompts[task];
    }
    
    // Return default prompt if profile not found
    return this.getDefaultPrompt(task);
  }

  /**
   * Get default prompt for task
   * @param {string} task - Task name
   * @returns {string} - Default prompt
   */
  getDefaultPrompt(task) {
    const defaultPrompts = {
      dependencyAnalysis: 'Analyze dependencies and provide optimization recommendations',
      readmeGeneration: 'Generate a professional README.md',
      securityAnalysis: 'Check for security vulnerabilities and issues',
      codeSuggestions: 'Provide code improvement suggestions',
      testGeneration: 'Generate test cases for the code'
    };

    return defaultPrompts[task] || 'Perform analysis and provide recommendations';
  }

  /**
   * Create custom plugin
   * @param {Object} pluginConfig - Plugin configuration
   * @returns {Promise<Object>} - Plugin creation result
   */
  async createPlugin(pluginConfig) {
    const result = {
      success: false,
      path: null,
      errors: []
    };

    try {
      const { id, name, description, hooks, execute } = pluginConfig;
      
      if (!id || !name || !execute) {
        result.errors.push('Plugin must have id, name, and execute function');
        return result;
      }

      const pluginContent = `/**
 * ${name}
 * ${description || 'Custom plugin for inteli-packs'}
 */

module.exports = {
  id: '${id}',
  name: '${name}',
  description: '${description || 'Custom plugin'}',
  hooks: ${JSON.stringify(hooks || [], null, 2)},
  execute: ${execute.toString()}
};
`;

      const { join: pluginPath } = path(this.pluginDir, `${id}.js`);
      await fs.writeFile(pluginPath, pluginContent);
      
      result.success = true;
      result.path = pluginPath;
      
      // Reload plugins
      await this.loadCustomPlugins();
      
    } catch (error) {
      result.errors.push(`Failed to create plugin: ${error.message}`);
    }

    return result;
  }

  /**
   * Create custom prompt profile
   * @param {Object} profileConfig - Profile configuration
   * @returns {Promise<Object>} - Profile creation result
   */
  async createPromptProfile(profileConfig) {
    const result = {
      success: false,
      path: null,
      errors: []
    };

    try {
      const { id, name, description, prompts } = profileConfig;
      
      if (!id || !name || !prompts) {
        result.errors.push('Profile must have id, name, and prompts');
        return result;
      }

      const profileContent = JSON.stringify({
        id,
        name,
        description: description || 'Custom prompt profile',
        prompts
      }, null, 2);

      const { join: profilePath } = path(this.profilesDir, `${id}.json`);
      await fs.writeFile(profilePath, profileContent);
      
      result.success = true;
      result.path = profilePath;
      
      // Reload profiles
      await this.loadPromptProfiles();
      
    } catch (error) {
      result.errors.push(`Failed to create profile: ${error.message}`);
    }

    return result;
  }

  /**
   * Built-in security plugin
   * @param {string} hook - Hook name
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} - Plugin result
   */
  async securityPlugin(hook, context) {
    if (hook === 'pre-analysis') {
      return {
        data: {
          securityChecks: ['vulnerability_scan', 'suspicious_packages', 'code_analysis']
        }
      };
    } else if (hook === 'post-analysis') {
      return {
        data: {
          securityRecommendations: [
            'Run npm audit regularly',
            'Keep dependencies updated',
            'Use security scanning tools'
          ]
        }
      };
    }
    
    return { data: {} };
  }

  /**
   * Built-in performance plugin
   * @param {string} hook - Hook name
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} - Plugin result
   */
  async performancePlugin(hook, context) {
    if (hook === 'pre-analysis') {
      return {
        data: {
          performanceChecks: ['bundle_size', 'runtime_performance', 'memory_usage']
        }
      };
    } else if (hook === 'post-analysis') {
      return {
        data: {
          performanceRecommendations: [
            'Use tree shaking',
            'Implement code splitting',
            'Optimize bundle size'
          ]
        }
      };
    }
    
    return { data: {} };
  }

  /**
   * Built-in documentation plugin
   * @param {string} hook - Hook name
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} - Plugin result
   */
  async documentationPlugin(hook, context) {
    if (hook === 'pre-generation') {
      return {
        data: {
          documentationSections: ['api', 'examples', 'contributing', 'changelog']
        }
      };
    } else if (hook === 'post-generation') {
      return {
        data: {
          documentationEnhancements: [
            'Add API documentation',
            'Include usage examples',
            'Add contributing guidelines'
          ]
        }
      };
    }
    
    return { data: {} };
  }

  /**
   * List all available plugins
   * @returns {Array} - Array of plugin information
   */
  listPlugins() {
    const plugins = [];
    
    for (const [id, plugin] of this.plugins) {
      plugins.push({
        id,
        name: plugin.name,
        description: plugin.description,
        hooks: plugin.hooks || []
      });
    }
    
    return plugins;
  }

  /**
   * List all available prompt profiles
   * @returns {Array} - Array of profile information
   */
  listPromptProfiles() {
    const profiles = [];
    
    for (const [id, profile] of this.promptProfiles) {
      profiles.push({
        id,
        name: profile.name,
        description: profile.description,
        tasks: Object.keys(profile.prompts || {})
      });
    }
    
    return profiles;
  }

  /**
   * Get plugin information
   * @param {string} pluginId - Plugin ID
   * @returns {Object|null} - Plugin information
   */
  getPlugin(pluginId) {
    const plugin = this.plugins.get(pluginId);
    
    if (plugin) {
      return {
        id: pluginId,
        name: plugin.name,
        description: plugin.description,
        hooks: plugin.hooks || []
      };
    }
    
    return null;
  }

  /**
   * Get prompt profile information
   * @param {string} profileId - Profile ID
   * @returns {Object|null} - Profile information
   */
  getPromptProfile(profileId) {
    const profile = this.promptProfiles.get(profileId);
    
    if (profile) {
      return {
        id: profileId,
        name: profile.name,
        description: profile.description,
        tasks: Object.keys(profile.prompts || {})
      };
    }
    
    return null;
  }

  /**
   * Enable specific plugins
   */
  async enablePlugins(pluginIds) {
    try {
      for (const pluginId of pluginIds) {
        if (this.plugins.has(pluginId)) {
          console.log(chalk.green(`✅ Enabled plugin: ${pluginId}`));
        } else {
          console.warn(chalk.yellow(`⚠️  Plugin not found: ${pluginId}`));
        }
      }
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Failed to enable plugins:'), error.message);
    }
  }
}

export default PluginManager; 
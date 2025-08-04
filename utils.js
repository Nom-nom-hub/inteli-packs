#!/usr/bin/env node

/**
 * Utility functions for Inteli-Packs
 */

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Load environment variables
 */
const loadEnvironment = () => {
  try {
    // Load .env file if it exists
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }

    // Check for required environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.warn(chalk.yellow('⚠️  GEMINI_API_KEY not found in environment variables'));
      console.warn(chalk.gray('Please create a .env file with your Gemini API key:'));
      console.warn(chalk.gray('GEMINI_API_KEY=your_api_key_here'));
    }
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not load .env file:'), error.message);
  }
}

/**
 * Log information message
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
const logInfo = (message, ...args) => {
  console.log(chalk.blue('ℹ️  ' + message), ...args);
}

/**
 * Log success message
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
const logSuccess = (message, ...args) => {
  console.log(chalk.green('✅ ' + message), ...args);
}

/**
 * Log warning message
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
const logWarning = (message, ...args) => {
  console.warn(chalk.yellow('⚠️  ' + message), ...args);
}

/**
 * Log error message
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
const logError = (message, ...args) => {
  console.error(chalk.red('❌ ' + message), ...args);
}

/**
 * Log API call for rate tracking
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Call options
 */
const logApiCall = (endpoint, options = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    endpoint,
    options: {
      temperature: options.temperature || 'default',
      maxTokens: options.maxOutputTokens || 'default',
      model: 'gemini-1.5-flash'
    }
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--verbose')) {
    console.log(chalk.gray(`🔗 API Call [${timestamp}]: ${endpoint}`));
  }
  
  // Could be extended to log to file for rate tracking
  return logEntry;
}

/**
 * Check if file exists
 * @param {string} filePath - File path to check
 * @returns {boolean} - True if file exists
 */
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file extension
 * @param {string} filePath - File path
 * @returns {string} - File extension
 */
const getFileExtension = (filePath) => {
  return path.extname(filePath).toLowerCase();
}

/**
 * Is source file
 * @param {string} filePath - File path
 * @returns {boolean} - True if source file
 */
const isSourceFile = (filePath) => {
  const sourceExtensions = ['.js', '.ts', '.mjs', '.jsx', '.tsx'];
  return sourceExtensions.includes(getFileExtension(filePath));
}

/**
 * Safe file read with error handling
 * @param {string} filePath - File path to read
 * @returns {Promise<string>} - File content or empty string
 */
const safeReadFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    logWarning(`Could not read file: ${filePath}`, error.message);
    return '';
  }
}

/**
 * Safe file write with error handling
 * @param {string} filePath - File path to write
 * @param {string} content - Content to write
 * @returns {Promise<boolean>} - Success status
 */
const safeWriteFile = async (filePath, content) => {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
    return true;
  } catch (error) {
    logError(`Could not write file: ${filePath}`, error.message);
    return false;
  }
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} - Formatted duration
 */
const formatDuration = (milliseconds) => {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
  return `${(milliseconds / 60000).toFixed(1)}m`;
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - True if valid format
 */
const validateApiKey = (apiKey) => {
  if (!apiKey) return false;
  // Basic validation for Gemini API key format
  return apiKey.startsWith('AIza') && apiKey.length > 30;
}

/**
 * Get project root directory
 * @returns {string} - Project root path
 */
const getProjectRoot = () => {
  return process.cwd();
}

/**
 * Check if running in development mode
 * @returns {boolean} - True if development mode
 */
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || process.argv.includes('--verbose');
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<any>} - Function result
 */
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Rate limiter for API calls
 * @param {number} maxCalls - Maximum calls per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} - Rate limited function
 */
const createRateLimiter = (maxCalls = 10, windowMs = 60000) => {
  let calls = [];
  let inThrottle = false;
  
  return async (fn) => {
    const now = Date.now();
    
    // Remove old calls outside the window
    calls = calls.filter(timestamp => now - timestamp < windowMs);
    
    if (calls.length >= maxCalls) {
      if (!inThrottle) {
        logWarning(`Rate limit reached. Waiting ${windowMs}ms...`);
        inThrottle = true;
      }
      
      const oldestCall = calls[0];
      const waitTime = windowMs - (now - oldestCall);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      inThrottle = false;
      calls = [];
    }
    
    calls.push(now);
    return await fn();
  };
}

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
const debounce = (fn, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
const throttle = (fn, delay = 300) => {
  let lastCall = 0;
  
  return (...args) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn(...args);
    }
  };
}

/**
 * Deep clone object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} - Merged object
 */
const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
}

/**
 * Check if value is object
 * @param {any} item - Value to check
 * @returns {boolean} - True if object
 */
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string} - Random string
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize filename
 * @param {string} filename - Filename to sanitize
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

/**
 * Get file size
 * @param {string} filePath - File path
 * @returns {Promise<number>} - File size in bytes
 */
const getFileSize = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    logWarning(`Could not get file size: ${filePath}`, error.message);
    return 0;
  }
}

/**
 * Check if directory is empty
 * @param {string} dirPath - Directory path
 * @returns {Promise<boolean>} - True if empty
 */
const isDirectoryEmpty = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch (error) {
    logWarning(`Could not check directory: ${dirPath}`, error.message);
    return true;
  }
}

export {
  loadEnvironment,
  logInfo,
  logSuccess,
  logWarning,
  logError,
  logApiCall,
  fileExists,
  getFileExtension,
  isSourceFile,
  safeReadFile,
  safeWriteFile,
  formatFileSize,
  formatDuration,
  validateApiKey,
  getProjectRoot,
  isDevelopment,
  retryWithBackoff,
  createRateLimiter,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  isObject,
  generateRandomString,
  validateEmail,
  sanitizeFilename,
  getFileSize,
  isDirectoryEmpty
}; 
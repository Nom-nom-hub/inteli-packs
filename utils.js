/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');

/**
 * Load environment variables
 */
function loadEnvironment() {
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
function logInfo(message, ...args) {
  console.log(chalk.blue('ℹ️  ' + message), ...args);
}

/**
 * Log success message
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
function logSuccess(message, ...args) {
  console.log(chalk.green('✅ ' + message), ...args);
}

/**
 * Log warning message
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
function logWarning(message, ...args) {
  console.warn(chalk.yellow('⚠️  ' + message), ...args);
}

/**
 * Log error message
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
function logError(message, ...args) {
  console.error(chalk.red('❌ ' + message), ...args);
}

/**
 * Log API call for rate tracking
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Call options
 */
function logApiCall(endpoint, options = {}) {
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
async function fileExists(filePath) {
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
function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

/**
 * Is source file
 * @param {string} filePath - File path
 * @returns {boolean} - True if source file
 */
function isSourceFile(filePath) {
  const sourceExtensions = ['.js', '.ts', '.mjs', '.jsx', '.tsx'];
  return sourceExtensions.includes(getFileExtension(filePath));
}

/**
 * Safe file read with error handling
 * @param {string} filePath - File path to read
 * @returns {Promise<string>} - File content or empty string
 */
async function safeReadFile(filePath) {
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
async function safeWriteFile(filePath, content) {
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
function formatFileSize(bytes) {
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
function formatDuration(milliseconds) {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
  return `${(milliseconds / 60000).toFixed(1)}m`;
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - True if valid format
 */
function validateApiKey(apiKey) {
  if (!apiKey) return false;
  // Basic validation for Gemini API key format
  return apiKey.startsWith('AIza') && apiKey.length > 30;
}

/**
 * Get project root directory
 * @returns {string} - Project root path
 */
function getProjectRoot() {
  return process.cwd();
}

/**
 * Check if running in development mode
 * @returns {boolean} - True if development mode
 */
function isDevelopment() {
  return process.env.NODE_ENV === 'development' || process.argv.includes('--verbose');
}

/**
 * Create progress bar
 * @param {number} total - Total items
 * @param {string} description - Progress description
 * @returns {Object} - Progress bar object
 */
function createProgressBar(total, description = 'Processing') {
  let current = 0;
  
  return {
    update: (increment = 1) => {
      current += increment;
      const percentage = Math.round((current / total) * 100);
      const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
      process.stdout.write(`\r${description}: [${bar}] ${percentage}% (${current}/${total})`);
    },
    complete: () => {
      process.stdout.write('\n');
    }
  };
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<any>} - Function result
 */
async function retry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      logWarning(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

module.exports = {
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
  createProgressBar,
  retry,
  debounce,
  throttle
}; 
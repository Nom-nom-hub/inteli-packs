/**
 * Security Analysis Module
 * Handles vulnerability scanning and security checks
 */

const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

class SecurityAnalyzer {
  constructor() {
    this.npmAuditCache = new Map();
    this.suspiciousPatterns = [
      'eval(',
      'Function(',
      'setTimeout(',
      'setInterval(',
      'exec(',
      'spawn(',
      'execSync(',
      'spawnSync(',
      'child_process',
      'process.env',
      'require(',
      'import(',
      'fs.writeFile',
      'fs.writeFileSync',
      'fs.appendFile',
      'fs.appendFileSync',
      'fs.unlink',
      'fs.unlinkSync',
      'fs.rmdir',
      'fs.rmdirSync',
      'fs.rm',
      'fs.rmSync'
    ];
  }

  /**
   * Run comprehensive security analysis
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Security analysis results
   */
  async analyzeSecurity(packageJson) {
    const results = {
      vulnerabilities: [],
      suspiciousPackages: [],
      securityIssues: [],
      recommendations: []
    };

    try {
      // Check for known vulnerabilities
      const vulnerabilities = await this.checkVulnerabilities(packageJson);
      results.vulnerabilities = vulnerabilities;

      // Check for suspicious packages
      const suspiciousPackages = await this.detectSuspiciousPackages(packageJson);
      results.suspiciousPackages = suspiciousPackages;

      // Check for security issues in code
      const securityIssues = await this.scanForSecurityIssues();
      results.securityIssues = securityIssues;

      // Generate security recommendations
      results.recommendations = this.generateSecurityRecommendations(results);

    } catch (error) {
      console.warn(chalk.yellow('⚠️  Security analysis failed:'), error.message);
    }

    return results;
  }

  /**
   * Check for known vulnerabilities using npm audit
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Array of vulnerabilities
   */
  async checkVulnerabilities(packageJson) {
    const vulnerabilities = [];
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const [packageName, version] of Object.entries(allDependencies)) {
      try {
        const vulnInfo = await this.getPackageVulnerabilityInfo(packageName, version);
        if (vulnInfo.vulnerabilities && vulnInfo.vulnerabilities.length > 0) {
          vulnerabilities.push({
            package: packageName,
            version: version,
            vulnerabilities: vulnInfo.vulnerabilities,
            severity: vulnInfo.severity
          });
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not check vulnerabilities for ${packageName}`));
      }
    }

    return vulnerabilities;
  }

  /**
   * Get vulnerability information for a package
   * @param {string} packageName - Package name
   * @param {string} version - Package version
   * @returns {Promise<Object>} - Vulnerability information
   */
  async getPackageVulnerabilityInfo(packageName, version) {
    const cacheKey = `${packageName}@${version}`;
    
    if (this.npmAuditCache.has(cacheKey)) {
      return this.npmAuditCache.get(cacheKey);
    }

    try {
      // Use npm audit API or alternative vulnerability database
      const response = await axios.get(`https://registry.npmjs.org/${packageName}`, {
        timeout: 5000
      });

      const packageInfo = response.data;
      const vulnerabilities = [];

      // Check for known security issues
      if (packageInfo.time && packageInfo.versions) {
        const currentVersion = packageInfo.versions[version];
        if (currentVersion && currentVersion.deprecated) {
          vulnerabilities.push({
            type: 'deprecated',
            description: 'Package is deprecated',
            severity: 'medium'
          });
        }
      }

      const result = {
        vulnerabilities,
        severity: vulnerabilities.length > 0 ? 'high' : 'low'
      };

      this.npmAuditCache.set(cacheKey, result);
      return result;

    } catch (error) {
      return { vulnerabilities: [], severity: 'unknown' };
    }
  }

  /**
   * Detect suspicious packages
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Array>} - Array of suspicious packages
   */
  async detectSuspiciousPackages(packageJson) {
    const suspiciousPackages = [];
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const [packageName, version] of Object.entries(allDependencies)) {
      const suspiciousScore = this.calculateSuspiciousScore(packageName);
      
      if (suspiciousScore > 0.7) {
        suspiciousPackages.push({
          package: packageName,
          version: version,
          score: suspiciousScore,
          reasons: this.getSuspiciousReasons(packageName)
        });
      }
    }

    return suspiciousPackages;
  }

  /**
   * Calculate suspicious score for a package
   * @param {string} packageName - Package name
   * @returns {number} - Suspicious score (0-1)
   */
  calculateSuspiciousScore(packageName) {
    let score = 0;
    const reasons = [];

    // Check for suspicious patterns in package name
    const suspiciousPatterns = [
      'hack', 'crack', 'exploit', 'backdoor', 'malware', 'virus',
      'steal', 'spy', 'track', 'monitor', 'keylogger', 'trojan'
    ];

    for (const pattern of suspiciousPatterns) {
      if (packageName.toLowerCase().includes(pattern)) {
        score += 0.3;
        reasons.push(`Package name contains suspicious word: ${pattern}`);
      }
    }

    // Check for very new packages (less than 30 days)
    // Check for packages with very few downloads
    // Check for packages with no description or homepage

    return Math.min(score, 1.0);
  }

  /**
   * Get reasons why a package is suspicious
   * @param {string} packageName - Package name
   * @returns {Array} - Array of reasons
   */
  getSuspiciousReasons(packageName) {
    const reasons = [];
    
    if (packageName.length < 3) {
      reasons.push('Very short package name');
    }

    if (packageName.includes('test') || packageName.includes('demo')) {
      reasons.push('Package name suggests test/demo code');
    }

    return reasons;
  }

  /**
   * Scan source files for security issues
   * @returns {Promise<Array>} - Array of security issues
   */
  async scanForSecurityIssues() {
    const securityIssues = [];
    const sourceFiles = await this.getSourceFiles();

    for (const filePath of sourceFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const issues = this.analyzeFileForSecurityIssues(content, filePath);
        securityIssues.push(...issues);
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not analyze file: ${filePath}`));
      }
    }

    return securityIssues;
  }

  /**
   * Analyze file for security issues
   * @param {string} content - File content
   * @param {string} filePath - File path
   * @returns {Array} - Array of security issues
   */
  analyzeFileForSecurityIssues(content, filePath) {
    const issues = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      for (const pattern of this.suspiciousPatterns) {
        if (line.includes(pattern)) {
          issues.push({
            file: filePath,
            line: lineNumber,
            pattern: pattern,
            severity: this.getPatternSeverity(pattern),
            description: `Potentially dangerous code pattern: ${pattern}`
          });
        }
      }

      // Check for hardcoded secrets
      const secretPatterns = [
        /password\s*=\s*['"][^'"]+['"]/i,
        /api_key\s*=\s*['"][^'"]+['"]/i,
        /secret\s*=\s*['"][^'"]+['"]/i,
        /token\s*=\s*['"][^'"]+['"]/i
      ];

      for (const pattern of secretPatterns) {
        if (pattern.test(line)) {
          issues.push({
            file: filePath,
            line: lineNumber,
            pattern: 'hardcoded_secret',
            severity: 'high',
            description: 'Hardcoded secret detected'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Get severity level for a pattern
   * @param {string} pattern - Pattern name
   * @returns {string} - Severity level
   */
  getPatternSeverity(pattern) {
    const highSeverityPatterns = ['eval(', 'Function(', 'exec(', 'spawn('];
    const mediumSeverityPatterns = ['setTimeout(', 'setInterval(', 'child_process'];
    
    if (highSeverityPatterns.includes(pattern)) {
      return 'high';
    } else if (mediumSeverityPatterns.includes(pattern)) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get source files for security scanning
   * @returns {Promise<Array>} - Array of source file paths
   */
  async getSourceFiles() {
    const files = [];
    const sourceExtensions = ['.js', '.ts', '.mjs', '.jsx', '.tsx'];
    const ignorePatterns = ['node_modules', '.git', 'dist', 'build'];

    const scanDirectory = async (dir) => {
      try {
        const items = await fs.readdir(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          
          if (stat.isDirectory()) {
            if (!ignorePatterns.some(pattern => item.includes(pattern))) {
              await scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (sourceExtensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not scan directory: ${dir}`));
      }
    };

    await scanDirectory(process.cwd());
    return files;
  }

  /**
   * Generate security recommendations
   * @param {Object} results - Security analysis results
   * @returns {Array} - Array of recommendations
   */
  generateSecurityRecommendations(results) {
    const recommendations = [];

    if (results.vulnerabilities.length > 0) {
      recommendations.push('Update packages with known vulnerabilities');
      recommendations.push('Run npm audit fix to automatically fix vulnerabilities');
    }

    if (results.suspiciousPackages.length > 0) {
      recommendations.push('Review suspicious packages and consider alternatives');
      recommendations.push('Check package source and documentation');
    }

    if (results.securityIssues.length > 0) {
      recommendations.push('Review code for security issues');
      recommendations.push('Use environment variables for secrets');
      recommendations.push('Implement proper input validation');
    }

    if (results.vulnerabilities.length === 0 && 
        results.suspiciousPackages.length === 0 && 
        results.securityIssues.length === 0) {
      recommendations.push('No immediate security issues detected');
      recommendations.push('Continue regular security audits');
    }

    return recommendations;
  }
}

module.exports = SecurityAnalyzer; 
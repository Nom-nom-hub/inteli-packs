/**
 * Automation Module
 * Handles auto-refactoring, changelog generation, and ESM migration
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

class AutomationEngine {
  constructor() {
    this.refactoringPatterns = {
      'const to const/let': /var\s+(\w+)/g,
      'function to arrow': /function\s+(\w+)\s*\(/g,
      'template literals': /['"]\s*\+\s*['"]/g,
      destructuring: /const\s+(\w+)\s*=\s*(\w+)\.(\w+)/g,
      'optional chaining': /(\w+)\s*&&\s*(\w+)\.(\w+)/g,
    };
  }

  /**
   * Auto-refactor code based on modern JavaScript patterns
   * @param {string} filePath - File to refactor
   * @returns {Promise<Object>} - Refactoring results
   */
  async autoRefactor(filePath) {
    const results = {
      file: filePath,
      changes: [],
      errors: [],
    };

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const newContent = content;
      const changeCount = 0;

      // Apply refactoring patterns
      for (const [patternName, pattern] of Object.entries(this.refactoringPatterns)) {
        const { match: matches } = content(pattern);
        if (matches) {
          newContent = this.applyRefactoringPattern(newContent, patternName, pattern);
          changeCount += matches.length;
          results.changes.push({
            pattern: patternName,
            count: matches.length,
          });
        }
      }

      // Additional modern JavaScript improvements
      newContent = this.applyModernJavaScript(newContent);

      if (newContent !== content) {
        await fs.writeFile(filePath, newContent);
        results.changes.push({
          pattern: 'modern_js_improvements',
          count: changeCount,
        });
      }
    } catch (error) {
      results.errors.push(`Failed to refactor ${filePath}: ${error.message}`);
    }

    return results;
  }

  /**
   * Apply specific refactoring pattern
   * @param {string} content - File content
   * @param {string} patternName - Pattern name
   * @param {RegExp} pattern - Regex pattern
   * @returns {string} - Refactored content
   */
  applyRefactoringPattern(content, patternName, pattern) {
    switch (patternName) {
      case 'const to const/let':
        return content.replace(/var\s+(\w+)/g, 'const $1');

      case 'function to arrow':
        return content.replace(/function\s+(\w+)\s*\(/g, 'const $1 = (');

      case 'template literals':
        return content.replace(/['"]\s*\+\s*['"]/g, '`${$1}`');

      case 'destructuring':
        return content.replace(/const\s+(\w+)\s*=\s*(\w+)\.(\w+)/g, 'const { $3: $1 } = $2');

      case 'optional chaining':
        return content.replace(/(\w+)\s*&&\s*(\w+)\.(\w+)/g, '$2?.$3');

      default:
        return content;
    }
  }

  /**
   * Apply modern JavaScript improvements
   * @param {string} content - File content
   * @returns {string} - Improved content
   */
  applyModernJavaScript(content) {
    const improved = content;

    // Convert forEach to for...of where appropriate
    improved = improved.replace(
      /\.forEach\(\((\w+)\)\s*=>\s*{([^}]+)}\)/g,
      'for (const $1 of items) {$2}',
    );

    // Convert map to more efficient patterns
    improved = improved.replace(/\.map\(\((\w+)\)\s*=>\s*(\w+)\)/g, '.map($1 => $2)');

    // Add const where possible
    improved = improved.replace(/let\s+(\w+)\s*=\s*([^;]+);/g, (match, varName, value) => {
      if (!value.includes('++') && !value.includes('--')) {
        return `const ${varName} = ${value};`;
      }
      return match;
    });

    return improved;
  }

  /**
   * Generate changelog from git history
   * @param {Object} options - Changelog options
   * @returns {Promise<Object>} - Changelog generation results
   */
  async generateChangelog(options = {}) {
    const results = {
      changelog: '',
      commits: [],
      errors: [],
    };

    try {
      // Get git log
      const gitLog = execSync('git log --oneline --pretty=format:"%h|%s|%an|%ad" --date=short', {
        encoding: 'utf8',
      });
      const { split: commits } = gitLog('\n').filter(line => line.trim());

      // Categorize commits
      const { categorizeCommits: categorized } = this(commits);

      // Generate changelog content
      results.changelog = this.formatChangelog(categorized, options);
      results.commits = commits;

      // Write changelog file
      const { output: changelogPath } = options || 'CHANGELOG.md';
      await fs.writeFile(changelogPath, results.changelog);
    } catch (error) {
      results.errors.push(`Failed to generate changelog: ${error.message}`);
    }

    return results;
  }

  /**
   * Categorize commits by type
   * @param {Array} commits - Array of commit strings
   * @returns {Object} - Categorized commits
   */
  categorizeCommits(commits) {
    const categories = {
      Features: [],
      'Bug Fixes': [],
      'Breaking Changes': [],
      Documentation: [],
      Performance: [],
      Refactoring: [],
      Other: [],
    };

    for (const commit of commits) {
      const [hash, message, author, date] = commit.split('|');

      if (message.match(/^feat|^add|^new/i)) {
        categories['Features'].push({ hash, message, author, date });
      } else if (message.match(/^fix|^bug|^patch/i)) {
        categories['Bug Fixes'].push({ hash, message, author, date });
      } else if (message.match(/^breaking|^major/i)) {
        categories['Breaking Changes'].push({ hash, message, author, date });
      } else if (message.match(/^docs|^readme|^documentation/i)) {
        categories['Documentation'].push({ hash, message, author, date });
      } else if (message.match(/^perf|^performance|^optimize/i)) {
        categories['Performance'].push({ hash, message, author, date });
      } else if (message.match(/^refactor|^cleanup/i)) {
        categories['Refactoring'].push({ hash, message, author, date });
      } else {
        categories['Other'].push({ hash, message, author, date });
      }
    }

    return categories;
  }

  /**
   * Format changelog content
   * @param {Object} categorized - Categorized commits
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted changelog
   */
  formatChangelog(categorized, options = {}) {
    const { version: version } = options || 'Unreleased';
    const { date: date } = options || new Date().toISOString().split('T')[0];

    const changelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${date}

`;

    for (const [category, commits] of Object.entries(categorized)) {
      if (commits.length > 0) {
        changelog += `### ${category}\n\n`;

        for (const commit of commits) {
          const { message: cleanMessage } = commit.replace(/^[a-z]+:?\s*/i, '');
          changelog += `- ${cleanMessage} (${commit.hash})\n`;
        }

        changelog += '\n';
      }
    }

    return changelog;
  }

  /**
   * Migrate project to ESM (ES Modules)
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Migration results
   */
  async migrateToESM(packageJson) {
    const results = {
      changes: [],
      errors: [],
      files: [],
    };

    try {
      // Update package.json
      const updatedPackageJson = { ...packageJson };
      updatedPackageJson.type = 'module';

      // Update scripts to use .mjs or node --experimental-modules
      if (updatedPackageJson.scripts) {
        for (const [scriptName, scriptCommand] of Object.entries(updatedPackageJson.scripts)) {
          if (scriptCommand.includes('node ') && !scriptCommand.includes('.mjs')) {
            updatedPackageJson.scripts[scriptName] = scriptCommand.replace(
              'node ',
              'node --experimental-modules ',
            );
          }
        }
      }

      await fs.writeFile('package.json', JSON.stringify(updatedPackageJson, null, 2));
      results.changes.push('Updated package.json for ESM');

      // Convert .js files to .mjs or update import/export syntax
      const sourceFiles = await this.getSourceFiles();

      for (const filePath of sourceFiles) {
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const { convertToESM: updatedContent } = this(content);

          if (updatedContent !== content) {
            await fs.writeFile(filePath, updatedContent);
            results.files.push(filePath);
            results.changes.push(`Converted ${filePath} to ESM`);
          }
        } catch (error) {
          results.errors.push(`Failed to convert ${filePath}: ${error.message}`);
        }
      }
    } catch (error) {
      results.errors.push(`ESM migration failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Convert CommonJS to ESM syntax
   * @param {string} content - File content
   * @returns {string} - ESM content
   */
  convertToESM(content) {
    const converted = content;

    // Convert require to import
    converted = converted.replace(
      /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g,
      'import $1 from "$2"',
    );

    // Convert module.exports to export default
    converted = converted.replace(/module\.exports\s*=\s*(\w+)/g, 'export default $1');

    // Convert exports. to export
    converted = converted.replace(/exports\.(\w+)\s*=\s*(\w+)/g, 'export { $2 as $1 }');

    // Convert require with destructuring
    converted = converted.replace(
      /const\s*{\s*([^}]+)\s*}\s*=\s*require\(['"]([^'"]+)['"]\)/g,
      'import { $1 } from "$2"',
    );

    return converted;
  }

  /**
   * Get source files for ESM migration
   * @returns {Promise<Array>} - Array of source file paths
   */
  async getSourceFiles() {
    const files = [];
    const sourceExtensions = ['.js', '.ts'];
    const ignorePatterns = ['node_modules', '.git', 'dist', 'build', 'coverage'];

    const scanDirectory = async dir => {
      try {
        const items = await fs.readdir(dir);

        for (const item of items) {
          const { join: fullPath } = path(dir, item);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory()) {
            if (!ignorePatterns.some(pattern => item.includes(pattern))) {
              await scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const { extname: ext } = path(item).toLowerCase();
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
   * Auto-format code using Prettier
   * @param {Array} filePaths - Files to format
   * @returns {Promise<Object>} - Formatting results
   */
  async autoFormat(filePaths) {
    const results = {
      formatted: [],
      errors: [],
    };

    for (const filePath of filePaths) {
      try {
        // Check if Prettier is available
        const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
        const hasPrettier = packageJson?.devDependencies?.prettier || packageJson?.dependencies?.prettier;

        if (hasPrettier) {
          execSync(`npx prettier --write "${filePath}"`, { stdio: 'pipe' });
          results.formatted.push(filePath);
        } else {
          results.errors.push('Prettier not found in dependencies');
        }
      } catch (error) {
        results.errors.push(`Failed to format ${filePath}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Run comprehensive automation
   * @param {Object} options - Automation options
   * @returns {Promise<Object>} - Complete automation results
   */
  async runAutomation(options = {}) {
    const results = {
      refactoring: [],
      changelog: null,
      esmMigration: null,
      formatting: null,
      errors: [],
    };

    try {
      // Auto-refactor if requested
      if (options.refactor) {
        const sourceFiles = await this.getSourceFiles();
        for (const filePath of sourceFiles) {
          const refactorResult = await this.autoRefactor(filePath);
          results.refactoring.push(refactorResult);
        }
      }

      // Generate changelog if requested
      if (options.changelog) {
        results.changelog = await this.generateChangelog(options.changelogOptions);
      }

      // Migrate to ESM if requested
      if (options.esm) {
        const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
        results.esmMigration = await this.migrateToESM(packageJson);
      }

      // Auto-format if requested
      if (options.format) {
        const sourceFiles = await this.getSourceFiles();
        results.formatting = await this.autoFormat(sourceFiles);
      }
    } catch (error) {
      results.errors.push(`Automation failed: ${error.message}`);
    }

    return results;
  }
}

export default AutomationEngine;

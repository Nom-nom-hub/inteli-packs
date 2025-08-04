/**
 * Project Analysis Engine
 * Analyzes package.json and source files for dependency optimization
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class ProjectAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.sourceExtensions = ['.js', '.ts', '.mjs', '.jsx', '.tsx'];
    this.ignorePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      '.output'
    ];
  }

  /**
   * Check if we're in a Node.js project
   * @returns {boolean} - True if package.json exists
   */
  isNodeProject() {
    return fs.existsSync(this.packageJsonPath);
  }

  /**
   * Load and parse package.json
   * @returns {Object} - Parsed package.json content
   */
  loadPackageJson() {
    try {
      const content = fs.readFileSync(this.packageJsonPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load package.json: ${error.message}`);
    }
  }

  /**
   * Get all source files in the project
   * @returns {Array} - Array of file paths
   */
  async getSourceFiles() {
    const files = [];
    
    try {
      await this.scanDirectory(this.projectRoot, files);
      return files;
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Warning: Could not scan all directories'), error.message);
      return files;
    }
  }

  /**
   * Recursively scan directory for source files
   * @param {string} dir - Directory to scan
   * @param {Array} files - Array to collect file paths
   */
  async scanDirectory(dir, files) {
    const items = await fs.readdir(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        // Skip ignored directories
        if (!this.ignorePatterns.some(pattern => item.includes(pattern))) {
          await this.scanDirectory(fullPath, files);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (this.sourceExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  /**
   * Read and analyze source files
   * @param {Array} filePaths - Array of file paths
   * @returns {Object} - Analysis results
   */
  async analyzeSourceFiles(filePaths) {
    const analysis = {
      totalFiles: filePaths.length,
      totalLines: 0,
      imports: new Set(),
      usedPackages: new Set(),
      unusedImports: [],
      missingDependencies: []
    };

    for (const filePath of filePaths) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const fileAnalysis = this.analyzeFile(content, filePath);
        
        analysis.totalLines += fileAnalysis.lines;
        fileAnalysis.imports.forEach(imp => analysis.imports.add(imp));
        fileAnalysis.usedPackages.forEach(pkg => analysis.usedPackages.add(pkg));
        analysis.unusedImports.push(...fileAnalysis.unusedImports);
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not read file: ${filePath}`), error.message);
      }
    }

    return analysis;
  }

  /**
   * Analyze a single source file
   * @param {string} content - File content
   * @param {string} filePath - File path
   * @returns {Object} - File analysis results
   */
  analyzeFile(content, filePath) {
    const lines = content.split('\n');
    const imports = new Set();
    const usedPackages = new Set();
    const unusedImports = [];
    
    // Extract imports and used packages
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match import statements
      const importMatches = line.match(/import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/);
      if (importMatches) {
        const packageName = importMatches[1];
        imports.add(packageName);
        
        // Check if it's a local import or external package
        if (!packageName.startsWith('.') && !packageName.startsWith('/')) {
          const mainPackage = packageName.split('/')[0];
          usedPackages.add(mainPackage);
        }
      }
      
      // Match require statements
      const requireMatches = line.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      if (requireMatches) {
        const packageName = requireMatches[1];
        imports.add(packageName);
        
        if (!packageName.startsWith('.') && !packageName.startsWith('/')) {
          const mainPackage = packageName.split('/')[0];
          usedPackages.add(mainPackage);
        }
      }
    }

    return {
      filePath,
      lines: lines.length,
      imports,
      usedPackages,
      unusedImports
    };
  }

  /**
   * Compare package.json dependencies with actual usage
   * @param {Object} packageJson - Package.json content
   * @param {Set} usedPackages - Set of actually used packages
   * @returns {Object} - Comparison results
   */
  compareDependencies(packageJson, usedPackages) {
    const allDependencies = new Set([
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {})
    ]);

    const unusedDependencies = [];
    const missingDependencies = [];

    // Find unused dependencies
    for (const dep of allDependencies) {
      if (!usedPackages.has(dep)) {
        unusedDependencies.push(dep);
      }
    }

    // Find missing dependencies
    for (const usedPkg of usedPackages) {
      if (!allDependencies.has(usedPkg)) {
        missingDependencies.push(usedPkg);
      }
    }

    return {
      unusedDependencies,
      missingDependencies,
      totalDependencies: allDependencies.size,
      usedDependencies: usedPackages.size
    };
  }

  /**
   * Perform comprehensive project analysis
   * @returns {Promise<Object>} - Complete analysis results
   */
  async analyzeProject() {
    if (!this.isNodeProject()) {
      throw new Error('No package.json found in current directory');
    }

    console.log(chalk.blue('🔍 Analyzing project structure...'));
    
    const packageJson = this.loadPackageJson();
    const sourceFiles = await this.getSourceFiles();
    const sourceAnalysis = await this.analyzeSourceFiles(sourceFiles);
    const dependencyComparison = this.compareDependencies(packageJson, sourceAnalysis.usedPackages);

    console.log(chalk.green(`✅ Found ${sourceFiles.length} source files`));
    console.log(chalk.green(`✅ Analyzed ${sourceAnalysis.totalLines} lines of code`));

    return {
      packageJson,
      sourceFiles: sourceFiles.length,
      sourceAnalysis,
      dependencyComparison,
      summary: {
        totalFiles: sourceAnalysis.totalFiles,
        totalLines: sourceAnalysis.totalLines,
        totalDependencies: dependencyComparison.totalDependencies,
        unusedDependencies: dependencyComparison.unusedDependencies.length,
        missingDependencies: dependencyComparison.missingDependencies.length,
        usedDependencies: dependencyComparison.usedDependencies
      }
    };
  }

  /**
   * Get workspace packages (for monorepo support)
   * @returns {Array} - Array of workspace package paths
   */
  async getWorkspacePackages() {
    const packageJson = this.loadPackageJson();
    const workspaces = packageJson.workspaces || [];
    const workspacePackages = [];

    for (const workspace of workspaces) {
      const workspacePath = path.join(this.projectRoot, workspace);
      if (await fs.pathExists(workspacePath)) {
        const packages = await fs.readdir(workspacePath);
        for (const pkg of packages) {
          const pkgPath = path.join(workspacePath, pkg);
          const pkgJsonPath = path.join(pkgPath, 'package.json');
          if (await fs.pathExists(pkgJsonPath)) {
            workspacePackages.push(pkgPath);
          }
        }
      }
    }

    return workspacePackages;
  }

  /**
   * Check for common project issues
   * @returns {Object} - Issues found
   */
  async checkCommonIssues() {
    const issues = [];
    const packageJson = this.loadPackageJson();

    // Check for missing README
    if (!await fs.pathExists(path.join(this.projectRoot, 'README.md'))) {
      issues.push('Missing README.md file');
    }

    // Check for missing .gitignore
    if (!await fs.pathExists(path.join(this.projectRoot, '.gitignore'))) {
      issues.push('Missing .gitignore file');
    }

    // Check for missing ESLint config
    const eslintConfigs = ['.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml'];
    const hasEslintConfig = eslintConfigs.some(config => fs.existsSync(path.join(this.projectRoot, config)));
    if (!hasEslintConfig) {
      issues.push('Missing ESLint configuration');
    }

    // Check for missing Prettier config
    const prettierConfigs = ['.prettierrc', '.prettierrc.js', '.prettierrc.json'];
    const hasPrettierConfig = prettierConfigs.some(config => fs.existsSync(path.join(this.projectRoot, config)));
    if (!hasPrettierConfig) {
      issues.push('Missing Prettier configuration');
    }

    // Check for outdated scripts
    const scripts = packageJson.scripts || {};
    if (!scripts.test && !scripts['test:unit'] && !scripts['test:integration']) {
      issues.push('Missing test scripts');
    }

    return {
      issues,
      totalIssues: issues.length
    };
  }

  /**
   * Detect dead files (unused files)
   * @returns {Promise<Array>} - Array of dead files
   */
  async detectDeadFiles() {
    const allFiles = await this.getAllFiles();
    const sourceFiles = await this.getSourceFiles();
    const usedFiles = new Set();
    const deadFiles = [];

    // Build dependency graph
    for (const sourceFile of sourceFiles) {
      try {
        const content = await fs.readFile(sourceFile, 'utf8');
        const imports = this.extractImports(content);
        
        for (const importPath of imports) {
          if (importPath.startsWith('.')) {
            // Resolve relative imports
            const resolvedPath = this.resolveImportPath(sourceFile, importPath);
            if (resolvedPath) {
              usedFiles.add(resolvedPath);
            }
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not analyze file: ${sourceFile}`));
      }
    }

    // Find dead files
    for (const file of allFiles) {
      if (!usedFiles.has(file) && !this.isEntryPoint(file)) {
        deadFiles.push(file);
      }
    }

    return deadFiles;
  }

  /**
   * Detect circular imports
   * @returns {Promise<Array>} - Array of circular import chains
   */
  async detectCircularImports() {
    const sourceFiles = await this.getSourceFiles();
    const importGraph = new Map();
    const circularImports = [];

    // Build import graph
    for (const sourceFile of sourceFiles) {
      try {
        const content = await fs.readFile(sourceFile, 'utf8');
        const imports = this.extractImports(content);
        importGraph.set(sourceFile, imports);
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not analyze file: ${sourceFile}`));
      }
    }

    // Detect cycles using DFS
    const visited = new Set();
    const recursionStack = new Set();

    for (const file of sourceFiles) {
      if (!visited.has(file)) {
        this.dfsDetectCycle(file, importGraph, visited, recursionStack, [], circularImports);
      }
    }

    return circularImports;
  }

  /**
   * DFS to detect cycles in import graph
   * @param {string} file - Current file
   * @param {Map} importGraph - Import graph
   * @param {Set} visited - Visited files
   * @param {Set} recursionStack - Recursion stack
   * @param {Array} path - Current path
   * @param {Array} circularImports - Array to store cycles
   */
  dfsDetectCycle(file, importGraph, visited, recursionStack, path, circularImports) {
    if (recursionStack.has(file)) {
      // Found a cycle
      const cycleStart = path.indexOf(file);
      const cycle = path.slice(cycleStart);
      circularImports.push([...cycle, file]);
      return;
    }

    if (visited.has(file)) {
      return;
    }

    visited.add(file);
    recursionStack.add(file);
    path.push(file);

    const imports = importGraph.get(file) || [];
    for (const importPath of imports) {
      if (importPath.startsWith('.')) {
        const resolvedPath = this.resolveImportPath(file, importPath);
        if (resolvedPath) {
          this.dfsDetectCycle(resolvedPath, importGraph, visited, recursionStack, path, circularImports);
        }
      }
    }

    recursionStack.delete(file);
    path.pop();
  }

  /**
   * Extract imports from file content
   * @param {string} content - File content
   * @returns {Array} - Array of import paths
   */
  extractImports(content) {
    const imports = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Match ES6 imports
      const importMatches = line.match(/import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/);
      if (importMatches) {
        imports.push(importMatches[1]);
      }

      // Match require statements
      const requireMatches = line.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      if (requireMatches) {
        imports.push(requireMatches[1]);
      }
    }

    return imports;
  }

  /**
   * Resolve import path relative to source file
   * @param {string} sourceFile - Source file path
   * @param {string} importPath - Import path
   * @returns {string|null} - Resolved path or null
   */
  resolveImportPath(sourceFile, importPath) {
    try {
      const sourceDir = path.dirname(sourceFile);
      const resolvedPath = path.resolve(sourceDir, importPath);
      
      // Try different extensions
      const extensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs'];
      for (const ext of extensions) {
        const fullPath = resolvedPath + ext;
        if (fs.existsSync(fullPath)) {
          return fullPath;
        }
      }

      // Try index files
      for (const ext of extensions) {
        const indexPath = path.join(resolvedPath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
          return indexPath;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if file is an entry point
   * @param {string} filePath - File path
   * @returns {boolean} - True if entry point
   */
  isEntryPoint(filePath) {
    const entryPoints = ['index.js', 'index.ts', 'main.js', 'app.js', 'server.js'];
    const fileName = path.basename(filePath);
    return entryPoints.includes(fileName);
  }

  /**
   * Get all files in project
   * @returns {Promise<Array>} - Array of all file paths
   */
  async getAllFiles() {
    const files = [];
    
    try {
      await this.scanDirectory(this.projectRoot, files);
      return files;
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Warning: Could not scan all directories'), error.message);
      return files;
    }
  }
}

module.exports = ProjectAnalyzer; 
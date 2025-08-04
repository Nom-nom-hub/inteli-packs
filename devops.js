/**
 * DevOps Generation Module
 * Handles GitHub Actions and Dockerfile generation
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class DevOpsGenerator {
  constructor() {
    this.githubWorkflowsDir = '.github/workflows';
    this.dockerfilePath = 'Dockerfile';
  }

  /**
   * Generate GitHub Actions workflows
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Generation results
   */
  async generateGitHubActions(packageJson) {
    const results = {
      workflows: [],
      errors: []
    };

    try {
      // Ensure workflows directory exists
      await fs.ensureDir(this.githubWorkflowsDir);

      // Generate CI workflow
      const ciWorkflow = await this.generateCIWorkflow(packageJson);
      if (ciWorkflow) {
        results.workflows.push(ciWorkflow);
      }

      // Generate CD workflow
      const cdWorkflow = await this.generateCDWorkflow(packageJson);
      if (cdWorkflow) {
        results.workflows.push(cdWorkflow);
      }

      // Generate security workflow
      const securityWorkflow = await this.generateSecurityWorkflow(packageJson);
      if (securityWorkflow) {
        results.workflows.push(securityWorkflow);
      }

    } catch (error) {
      results.errors.push(`Failed to generate GitHub Actions: ${error.message}`);
    }

    return results;
  }

  /**
   * Generate CI workflow
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Workflow result
   */
  async generateCIWorkflow(packageJson) {
    const workflowContent = `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint || echo "No lint script found"
    
    - name: Run tests
      run: npm test || echo "No test script found"
    
    - name: Run security audit
      run: npm audit --audit-level=moderate || echo "Security audit failed"
    
    - name: Build project
      run: npm run build || echo "No build script found"
`;

    const workflowPath = path.join(this.githubWorkflowsDir, 'ci.yml');
    
    try {
      await fs.writeFile(workflowPath, workflowContent);
      return {
        name: 'CI Workflow',
        path: workflowPath,
        status: 'created'
      };
    } catch (error) {
      return {
        name: 'CI Workflow',
        path: workflowPath,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generate CD workflow
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Workflow result
   */
  async generateCDWorkflow(packageJson) {
    const workflowContent = `name: CD

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Publish to NPM
      run: npm publish
      env:
        NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
    
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: \${{ github.ref }}
        release_name: Release \${{ github.ref }}
        body: |
          Changes in this Release:
          \${{ github.event.head_commit.message }}
        draft: false
        prerelease: false
`;

    const workflowPath = path.join(this.githubWorkflowsDir, 'cd.yml');
    
    try {
      await fs.writeFile(workflowPath, workflowContent);
      return {
        name: 'CD Workflow',
        path: workflowPath,
        status: 'created'
      };
    } catch (error) {
      return {
        name: 'CD Workflow',
        path: workflowPath,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generate security workflow
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Workflow result
   */
  async generateSecurityWorkflow(packageJson) {
    const workflowContent = `name: Security

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run security audit
      run: npm audit --audit-level=moderate
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
    
    - name: Check for secrets
      uses: trufflesecurity/trufflehog@main
      with:
        path: .
        base: HEAD~1
`;

    const workflowPath = path.join(this.githubWorkflowsDir, 'security.yml');
    
    try {
      await fs.writeFile(workflowPath, workflowContent);
      return {
        name: 'Security Workflow',
        path: workflowPath,
        status: 'created'
      };
    } catch (error) {
      return {
        name: 'Security Workflow',
        path: workflowPath,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generate Dockerfile
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Dockerfile result
   */
  async generateDockerfile(packageJson) {
    const dockerfileContent = `# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (adjust if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js || exit 1

# Start the application
CMD ["npm", "start"]
`;

    try {
      await fs.writeFile(this.dockerfilePath, dockerfileContent);
      return {
        name: 'Dockerfile',
        path: this.dockerfilePath,
        status: 'created'
      };
    } catch (error) {
      return {
        name: 'Dockerfile',
        path: this.dockerfilePath,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generate docker-compose.yml
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Docker Compose result
   */
  async generateDockerCompose(packageJson) {
    const composeContent = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Add database if needed
  # db:
  #   image: postgres:15-alpine
  #   environment:
  #     POSTGRES_DB: myapp
  #     POSTGRES_USER: myapp
  #     POSTGRES_PASSWORD: myapp
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   restart: unless-stopped

volumes:
  postgres_data:
`;

    const composePath = 'docker-compose.yml';
    
    try {
      await fs.writeFile(composePath, composeContent);
      return {
        name: 'Docker Compose',
        path: composePath,
        status: 'created'
      };
    } catch (error) {
      return {
        name: 'Docker Compose',
        path: composePath,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generate .dockerignore
   * @returns {Promise<Object>} - Dockerignore result
   */
  async generateDockerignore() {
    const dockerignoreContent = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
.cache
.parcel-cache
.next
.nuxt
.vuepress/dist
.serverless
.fusebox/
.dynamodb/
.tern-port
.vscode
.idea
*.swp
*.swo
*~

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript v1 declaration files
typings/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

    const dockerignorePath = '.dockerignore';
    
    try {
      await fs.writeFile(dockerignorePath, dockerignoreContent);
      return {
        name: '.dockerignore',
        path: dockerignorePath,
        status: 'created'
      };
    } catch (error) {
      return {
        name: '.dockerignore',
        path: dockerignorePath,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generate all DevOps files
   * @param {Object} packageJson - Package.json content
   * @returns {Promise<Object>} - Complete DevOps generation results
   */
  async generateAllDevOps(packageJson) {
    const results = {
      workflows: [],
      docker: [],
      errors: []
    };

    try {
      // Generate GitHub Actions
      const githubResults = await this.generateGitHubActions(packageJson);
      results.workflows = githubResults.workflows;
      results.errors.push(...githubResults.errors);

      // Generate Docker files
      const dockerfile = await this.generateDockerfile(packageJson);
      results.docker.push(dockerfile);

      const dockerCompose = await this.generateDockerCompose(packageJson);
      results.docker.push(dockerCompose);

      const dockerignore = await this.generateDockerignore();
      results.docker.push(dockerignore);

    } catch (error) {
      results.errors.push(`DevOps generation failed: ${error.message}`);
    }

    return results;
  }
}

module.exports = DevOpsGenerator; 
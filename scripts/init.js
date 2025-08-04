#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync  } from "child_process";
import chalk from "chalk";

console.log(chalk.blue('🚀 Inteli-Packs Init: Bootstrap a clean Node.js repository'));
console.log(chalk.gray('Creating a new project with best practices...\n'));

// Get project name from command line or use current directory
const { argv: projectName } = process[2] || path.basename(process.cwd());
const { resolve: projectPath } = path(process.cwd(), projectName);

// Create project directory if it doesn't exist
if (!fs.existsSync(projectPath)) {
  fs.mkdirSync(projectPath, { recursive: true });
}

// Change to project directory
process.chdir(projectPath);

console.log(chalk.green(`📁 Creating project: ${projectName}`));

// Initialize package.json
const packageJson = {
  name: projectName,
  version: "1.0.0",
  description: "A Node.js project created with Inteli-Packs",
  main: "index.js",
  scripts: {
    "start": "node index.js",
    "dev": "node index.js --dev",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky install"
  },
  keywords: ["nodejs", "javascript"],
  author: "Your Name <your.email@example.com>",
  license: "MIT",
  engines: {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  dependencies: {},
  devDependencies: {
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log(chalk.green('✅ Created package.json'));

// Create .gitignore
const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

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
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`;

fs.writeFileSync('.gitignore', gitignore);
console.log(chalk.green('✅ Created .gitignore'));

// Create .eslintrc.js
const eslintConfig = `module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'no-console': 'off',
  },
};`;

fs.writeFileSync('.eslintrc.js', eslintConfig);
console.log(chalk.green('✅ Created .eslintrc.js'));

// Create .prettierrc
const prettierConfig = `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}`;

fs.writeFileSync('.prettierrc', prettierConfig);
console.log(chalk.green('✅ Created .prettierrc'));

// Create .editorconfig
const editorConfig = `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false`;

fs.writeFileSync('.editorconfig', editorConfig);
console.log(chalk.green('✅ Created .editorconfig'));

// Create jest.config.js
const jestConfig = `module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};`;

fs.writeFileSync('jest.config.js', jestConfig);
console.log(chalk.green('✅ Created jest.config.js'));

// Create main index.js
const mainFile = `#!/usr/bin/env node

import chalk from "chalk";

console.log(chalk.blue('🚀 Welcome to your new Node.js project!'));
console.log(chalk.gray('Created with Inteli-Packs'));

// Your application code here
const main = () {
  console.log(chalk.green('✅ Application is running'));
}

if (require.main === module) {
  main();
}

module.exports = { main };
`;

fs.writeFileSync('index.js', mainFile);
console.log(chalk.green('✅ Created index.js'));

// Create README.md
const readme = `# ${projectName}

A Node.js project created with Inteli-Packs.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
# Start development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
\`\`\`

### Production

\`\`\`bash
npm start
\`\`\`

## 📁 Project Structure

\`\`\`
${projectName}/
├── index.js          # Main application entry point
├── package.json      # Project configuration
├── .eslintrc.js      # ESLint configuration
├── .prettierrc       # Prettier configuration
├── jest.config.js    # Jest configuration
├── .gitignore        # Git ignore rules
└── README.md         # This file
\`\`\`

## 🧪 Testing

This project uses Jest for testing. Tests are located in the \`__tests__\` directory or files ending with \`.test.js\` or \`.spec.js\`.

\`\`\`bash
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
\`\`\`

## 📝 Code Quality

This project uses ESLint and Prettier for code quality and formatting.

\`\`\`bash
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues automatically
npm run format        # Format code with Prettier
npm run format:check  # Check if code is formatted
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Created with [Inteli-Packs](https://github.com/Nom-nom-hub/inteli-packs)
`;

fs.writeFileSync('README.md', readme);
console.log(chalk.green('✅ Created README.md'));

// Create LICENSE
const license = `MIT License

Copyright (c) ${new Date().getFullYear()} ${projectName}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

fs.writeFileSync('LICENSE', license);
console.log(chalk.green('✅ Created LICENSE'));

// Create __tests__ directory and sample test
const { join: testDir } = path(projectPath, '__tests__');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

const sampleTest = `import { main  } from "../index";

describe('${projectName}', () => {
  test('main function exists', () => {
    expect(typeof main).toBe('function');
  });

  test('main function can be called', () => {
    expect(() => main()).not.toThrow();
  });
});
`;

fs.writeFileSync(path.join(testDir, 'index.test.js'), sampleTest);
console.log(chalk.green('✅ Created sample test'));

// Initialize git repository
try {
  execSync('git init', { stdio: 'pipe' });
  console.log(chalk.green('✅ Initialized git repository'));
} catch (error) {
  console.warn(chalk.yellow('⚠️  Could not initialize git repository'));
}

// Install dependencies
console.log(chalk.blue('\n📦 Installing dependencies...'));
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log(chalk.green('✅ Dependencies installed'));
} catch (error) {
  console.error(chalk.red('❌ Failed to install dependencies'));
  console.error(error.message);
}

// Setup husky for git hooks
try {
  execSync('npx husky install', { stdio: 'pipe' });
  execSync('npx husky add .husky/pre-commit "npx lint-staged"', { stdio: 'pipe' });
  console.log(chalk.green('✅ Git hooks configured'));
} catch (error) {
  console.warn(chalk.yellow('⚠️  Could not configure git hooks'));
}

console.log(chalk.blue('\n🎉 Project created successfully!'));
console.log(chalk.green(`📁 Project location: ${projectPath}`));
console.log(chalk.blue('\nNext steps:'));
console.log(chalk.gray('1. cd ' + projectName));
console.log(chalk.gray('2. npm start'));
console.log(chalk.gray('3. npm test'));
console.log(chalk.gray('4. Start coding! 🚀')); 
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'indent': 'off', // Disable indentation checks
    'linebreak-style': 'off', // Disable line ending checks
    'quotes': 'off', // Disable quote style checks
    'semi': 'off', // Disable semicolon checks
    'comma-dangle': 'off', // Disable trailing comma checks
    'no-unused-vars': 'warn', // Warn about unused variables
    'object-shorthand': 'off', // Disable object shorthand
    'prefer-template': 'off', // Disable template literal preference
    'max-len': 'off', // Disable line length checks
    'no-console': 'off', // Allow console.log for CLI tool
    'complexity': 'off', // Disable complexity checks
    'max-depth': 'off', // Disable depth checks
    'no-await-in-loop': 'off', // Allow await in loops
    'no-case-declarations': 'off', // Allow declarations in case blocks
  },
}; 
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "no-var": "error",
    "prefer-const": "warn",
    "eqeqeq": ["warn", "always"],
    "curly": ["warn", "all"],
    "semi": ["warn", "always"],
    "indent": ["warn", 2],
    "quotes": ["warn", "single"],
    "space-before-function-paren": ["warn", "never"],
    "object-curly-spacing": ["warn", "always"],
    "array-bracket-spacing": ["warn", "never"],
    "comma-dangle": ["warn", "always-multiline"]
  },
};

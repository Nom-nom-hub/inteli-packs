# Examples

This section contains practical examples of how to use docs-test.

## Basic Usage

### Dependency Analysis

```javascript
const { ProjectAnalyzer } = require('docs-test');

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
const { GeminiAPI } = require('docs-test');

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx docs-test --analyze

# Clean up unused packages
npx docs-test --cleanup

# Generate README
npx docs-test --generate-readme

# Auto-fix issues
npx docs-test --auto-fix
```

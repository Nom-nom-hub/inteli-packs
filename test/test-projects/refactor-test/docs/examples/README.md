# Examples

This section contains practical examples of how to use refactor-test.

## Basic Usage

### Dependency Analysis

```javascript
import { ProjectAnalyzer  } from "refactor-test";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
import { GeminiAPI  } from "refactor-test";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx refactor-test --analyze

# Clean up unused packages
npx refactor-test --cleanup

# Generate README
npx refactor-test --generate-readme

# Auto-fix issues
npx refactor-test --auto-fix
```

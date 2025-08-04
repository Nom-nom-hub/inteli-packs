# Examples

This section contains practical examples of how to use memory-test.

## Basic Usage

### Dependency Analysis

```javascript
import { ProjectAnalyzer  } from "memory-test";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
import { GeminiAPI  } from "memory-test";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx memory-test --analyze

# Clean up unused packages
npx memory-test --cleanup

# Generate README
npx memory-test --generate-readme

# Auto-fix issues
npx memory-test --auto-fix
```

# Examples

This section contains practical examples of how to use dependency-test.

## Basic Usage

### Dependency Analysis

```javascript
import { ProjectAnalyzer  } from "dependency-test";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
import { GeminiAPI  } from "dependency-test";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx dependency-test --analyze

# Clean up unused packages
npx dependency-test --cleanup

# Generate README
npx dependency-test --generate-readme

# Auto-fix issues
npx dependency-test --auto-fix
```

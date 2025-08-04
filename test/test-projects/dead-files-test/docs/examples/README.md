# Examples

This section contains practical examples of how to use dead-files-test.

## Basic Usage

### Dependency Analysis

```javascript
import { ProjectAnalyzer  } from "dead-files-test";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
import { GeminiAPI  } from "dead-files-test";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx dead-files-test --analyze

# Clean up unused packages
npx dead-files-test --cleanup

# Generate README
npx dead-files-test --generate-readme

# Auto-fix issues
npx dead-files-test --auto-fix
```

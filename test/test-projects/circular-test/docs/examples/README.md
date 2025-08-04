# Examples

This section contains practical examples of how to use circular-test.

## Basic Usage

### Dependency Analysis

```javascript
import { ProjectAnalyzer  } from "circular-test";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
import { GeminiAPI  } from "circular-test";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx circular-test --analyze

# Clean up unused packages
npx circular-test --cleanup

# Generate README
npx circular-test --generate-readme

# Auto-fix issues
npx circular-test --auto-fix
```

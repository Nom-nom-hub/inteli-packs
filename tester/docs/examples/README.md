# Examples

This section contains practical examples of how to use tester.

## Basic Usage

### Dependency Analysis

```javascript
import { ProjectAnalyzer  } from "tester";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
import { GeminiAPI  } from "tester";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx tester --analyze

# Clean up unused packages
npx tester --cleanup

# Generate README
npx tester --generate-readme

# Auto-fix issues
npx tester --auto-fix
```

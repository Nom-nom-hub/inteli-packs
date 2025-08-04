# Examples

This section contains practical examples of how to use inteli-packs.

## Basic Usage

### Dependency Analysis

```javascript
import { ProjectAnalyzer  } from "inteli-packs";

const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();

console.log('Unused dependencies:', results.unusedDependencies);
console.log('Missing dependencies:', results.missingDependencies);
```

### README Generation

```javascript
import { GeminiAPI  } from "inteli-packs";

const gemini = new GeminiAPI();
const readme = await gemini.generateReadme(packageJson);

await fs.writeFile('README.md', readme);
```

### CLI Usage

```bash
# Analyze dependencies
npx inteli-packs --analyze

# Clean up unused packages
npx inteli-packs --cleanup

# Generate README
npx inteli-packs --generate-readme

# Auto-fix issues
npx inteli-packs --auto-fix
```

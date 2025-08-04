# Core API

## Classes

### ProjectAnalyzer

Analyzes Node.js project dependencies and structure.

#### Methods

##### `analyzeDependencies()`

Analyzes package.json dependencies and source files.

**Returns:** Promise<Object>

**Example:**
```javascript
const analyzer = new ProjectAnalyzer();
const results = await analyzer.analyzeDependencies();
```

##### `detectDeadFiles()`

Detects unused files in the project.

**Returns:** Promise<Array>

**Example:**
```javascript
const deadFiles = await analyzer.detectDeadFiles();
```

### GeminiAPI

Handles communication with Google's Gemini AI API.

#### Methods

##### `query(prompt, options)`

Sends a query to the Gemini API.

**Parameters:**
- `prompt` (string): The prompt to send
- `options` (Object): Additional options

**Returns:** Promise<Object>

**Example:**
```javascript
const gemini = new GeminiAPI();
const response = await gemini.query('Analyze this code');
```

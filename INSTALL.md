# Installation Guide

## Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Gemini API key from Google AI Studio

## Quick Installation

### Option 1: Global Installation
```bash
npm install -g inteli-packs
```

### Option 2: NPX (No Installation)
```bash
npx inteli-packs
```

### Option 3: Local Development
```bash
# Clone the repository
git clone https://github.com/Nom-nom-hub/inteli-packs.git
cd inteli-packs

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Gemini API key

# Run in development
npm start
```

## Getting Your API Keys

### Gemini API Key (Google AI)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Groq API Key (Free Tier Available)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Create a new API key
4. Copy the generated API key

### Adding API Keys to Your Project
Add your API keys to your `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

## Configuration

### Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your API keys:**
   ```env
   # Required: At least one AI provider API key
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   
   # Optional: Model configurations
   GEMINI_MODEL=gemini-1.5-flash
   GROQ_MODEL=llama3-8b-8192
   ```

### Project Structure

Your Node.js project should have:
- `package.json` file
- Source files (`.js`, `.ts`, `.mjs`, `.jsx`, `.tsx`)
- Optional: `.env` file with API key

## Usage Examples

### Basic Analysis
```bash
# Navigate to your Node.js project
cd your-project

# Run the CLI
inteli-packs
```

### Auto Mode
```bash
# Run full optimization automatically
inteli-packs --auto
```

### Verbose Mode
```bash
# Enable detailed logging
inteli-packs --verbose
```

## Testing the Installation

1. Navigate to the `example/` directory
2. Run the CLI:
   ```bash
   cd example
   inteli-packs
   ```
3. Follow the interactive prompts to analyze the example project

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Ensure you have a `.env` file with your API key
   - Check that the API key is valid

2. **"No package.json found"**
   - Make sure you're in a Node.js project directory
   - Ensure `package.json` exists in the current directory

3. **"Gemini API Error"**
   - Check your internet connection
   - Verify your API key is correct
   - Ensure you have sufficient API quota

### Getting Help

- Check the [README.md](README.md) for detailed documentation
- Open an issue on GitHub for bugs
- Join discussions for feature requests

## Next Steps

After installation:

1. **Set up your API key** in the `.env` file
2. **Navigate to your Node.js project**
3. **Run the CLI** and explore the features
4. **Try auto mode** for quick optimization
5. **Review the analysis results** and apply recommendations

Happy optimizing! 🚀 
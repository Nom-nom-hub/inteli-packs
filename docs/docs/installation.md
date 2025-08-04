---
sidebar_position: 2
---

# Installation

## Prerequisites

Before installing Inteli-Packs, make sure you have:

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Git** (for version control)

## Installation Methods

### Method 1: Global Installation (Recommended)

Install Inteli-Packs globally to use it from anywhere:

```bash
npm install -g inteli-packs
```

After installation, you can use the `inteli-packs` command directly:

```bash
inteli-packs --help
```

### Method 2: npx (No Installation Required)

Use Inteli-Packs without installing it globally:

```bash
npx inteli-packs
```

This is useful for one-time usage or CI/CD environments.

### Method 3: Local Installation

Install Inteli-Packs as a dev dependency in your project:

```bash
npm install --save-dev inteli-packs
```

Then use it via npx:

```bash
npx inteli-packs
```

## Homebrew Installation (macOS)

If you're on macOS and have Homebrew installed:

```bash
brew install yourusername/inteli-packs/inteli-packs
```

## Setup

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 2. Configure Your Project

Create a `.env` file in your project root:

```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

### 3. Verify Installation

Test that Inteli-Packs is working correctly:

```bash
inteli-packs --version
inteli-packs --help
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Project Configuration

Inteli-Packs can be configured through:

1. **Environment variables** (recommended for API keys)
2. **Command line arguments** (for one-time options)
3. **Configuration files** (for project-specific settings)

## Troubleshooting

### Common Issues

#### "Command not found"
If you get a "command not found" error after global installation:

1. Check your PATH: `echo $PATH`
2. Find npm's global bin: `npm config get prefix`
3. Add to PATH if needed: `export PATH="$(npm config get prefix)/bin:$PATH"`

#### API Key Issues
If you get authentication errors:

1. Verify your API key is correct
2. Check that the key has the necessary permissions
3. Ensure the `.env` file is in the correct location

#### Permission Issues
If you get permission errors on Unix-like systems:

```bash
sudo npm install -g inteli-packs
```

## Next Steps

Now that Inteli-Packs is installed, check out the [Quick Start Guide](./quick-start.md) to run your first analysis.

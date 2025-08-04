# Troubleshooting

## Common Issues

### API Key Issues

**Problem:** "GEMINI_API_KEY environment variable is required"

**Solution:**
1. Create a `.env` file in your project root
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key
   ```
3. Restart your terminal or reload environment variables

### Network Issues

**Problem:** "Gemini API request timed out"

**Solution:**
1. Check your internet connection
2. Verify your API key is valid
3. Try again in a few minutes

### Permission Issues

**Problem:** "Cannot write to file"

**Solution:**
1. Check file permissions
2. Ensure you have write access to the directory
3. Run with appropriate permissions

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [API Documentation](../api/README.md)
3. Try the [Examples](../examples/README.md)

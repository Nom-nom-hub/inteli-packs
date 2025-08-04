# API Reference

## Overview

This document provides detailed API documentation for tester.

## Modules

- [Core API](./core.md)
- [CLI Interface](./cli.md)
- [Configuration](./config.md)

## Quick Reference

```javascript
import { analyzeDependencies, generateReadme  } from "tester";

// Analyze dependencies
const analysis = await analyzeDependencies(packageJson, sourceFiles);

// Generate README
const readme = await generateReadme(packageJson);
```

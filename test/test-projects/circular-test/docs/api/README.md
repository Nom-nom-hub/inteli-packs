# API Reference

## Overview

This document provides detailed API documentation for circular-test.

## Modules

- [Core API](./core.md)
- [CLI Interface](./cli.md)
- [Configuration](./config.md)

## Quick Reference

```javascript
import { analyzeDependencies, generateReadme  } from "circular-test";

// Analyze dependencies
const analysis = await analyzeDependencies(packageJson, sourceFiles);

// Generate README
const readme = await generateReadme(packageJson);
```

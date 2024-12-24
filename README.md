# License Scout

A powerful tool for scanning and analyzing license information in your projects. This tool helps you track and manage licenses across your project dependencies.

## Features

- Scans project directories for license information
- Supports multiple package manager ecosystems
- Generates detailed license reports
- Easy to use command-line interface
- Supports both text and JSON output formats

## Installation

### As a Package Dependency

```bash
deno add jsr:@mrdevx/license-scout
```

### Global Installation

```bash
deno install --global --force -A -n license-scout jsr:@mrdevx/license-scout
```

After global installation, you can run the tool from anywhere using:

```bash
license-scout [options] [directory]
```

## Command Line Interface

```bash
License Scout
A tool for scanning and analyzing license information in projects.

Usage:
  license-scout [options] [directory]

Options:
  -h, --help                Show this help message
  -v, --version            Show version information
  -o, --output <file>      Output file path (default: license-check-results.[txt|json])
  -f, --format <format>    Output format (text|json) (default: text)
  -e, --exclude <dirs>     Directories to exclude (comma-separated)
  --include-dev           Include dev dependencies in analysis
  --fail-missing          Exit with error if licenses are missing
  --exclude-licenses      Licenses to exclude from report (comma-separated)
  --depth <number>        Maximum directory depth to scan (default: Infinity)
```

### Examples

```bash
# Basic scan of current directory
license-scout

# Scan specific directory with JSON output
license-scout -f json -o licenses.json ./my-project

# Exclude multiple directories
license-scout -e "node_modules,dist,build"

# Include dev dependencies and fail on missing licenses
license-scout --include-dev --fail-missing

# Exclude specific licenses
license-scout --exclude-licenses "GPL-3.0,LGPL-3.0"

# Limit scan depth
license-scout --depth 2
```

### Output Formats

The tool supports two output formats:

- **Text** (default): Human-readable format (`.txt`)
- **JSON**: Machine-readable format (`.json`)

> **Note:** When using JSON format (`-f json`), it's recommended to use the `.json` file extension for better compatibility with other tools.

### Required Permissions

The tool needs the following permissions to run:

- `--allow-read`: For reading project files and directories
- `--allow-write`: For writing the output report
- `--allow-run`: For executing system commands

You can combine these using the `-A` flag for all permissions.

## Output Example

```text
Project: my-awesome-project
Version: 1.0.0
Path: ./projects/my-awesome-project
Description: An awesome project
Author: John Doe
Repository: https://github.com/johndoe/my-awesome-project
Package License: MIT

Dependencies:
  express: ^4.17.1
  lodash: ^4.17.21

Dev Dependencies:
  typescript: ^4.5.4
  jest: ^27.4.7

Dependencies Licenses:
MIT: 45
ISC: 12
Apache-2.0: 5
=====================================
```

## API Usage

You can also use License Scout programmatically:

```typescript
import { checkLicenses } from "@mrdevx/license-scout";

await checkLicenses("./projects", "licenses.txt", { outputFormat: "json" });
```

## Runtime Support

- Deno (>= 1.37)
- Node.js (>= 18)
- Bun (>= 1.0)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

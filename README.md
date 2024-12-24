# License Scout

A powerful tool for scanning and analyzing license information in your projects. This tool helps you track and manage licenses across your project dependencies.

## Features

- Scans project directories for license information
- Supports multiple package manager ecosystems
- Generates detailed license reports
- Easy to use command-line interface

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
license-scout [directory] [output-file]
```

## Usage

### Command Line Options

```bash
License Scout v3.0.0
A tool for scanning and analyzing license information in projects.

Usage:
  license-scout [options] [directory]

Options:
  -h, --help              Show this help message
  -v, --version           Show version information
  -o, --output <file>     Output file path (default: license-check-results.[txt|json])
  -f, --format <format>   Output format (text|json) (default: text)
```

### Basic Commands

**Show help:**

```bash
license-scout --help
```

**Show version:**

```bash
license-scout --version
```

**Scan current directory with default output:**

```bash
deno run -A license-scout.ts
```

**Scan specific directory:**

```bash
deno run -A license-scout.ts ./my-project
```

**Scan and output to specific file:**

```bash
deno run -A license-scout.ts ./my-project licenses.txt
```

### Output Formats

The tool supports two output formats:

- **Text** (default): Human-readable format (`.txt`)
- **JSON**: Machine-readable format (`.json`)

**Text format example:**

```bash
deno run -A license-scout.ts ./my-project licenses.txt
```

**JSON format example:**

```bash
deno run -A license-scout.ts --format json ./my-project licenses.json
```

> **Note:** When using `--format json`, it's recommended to use the `.json` file extension for better compatibility with other tools.

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

## Configuration

You can configure the tool using `deno.json` in your project:

```json
{
  "tasks": {
    "start": "deno run -A license-scout.ts"
  }
}
```

## API Usage

You can also use License Scout programmatically:

```typescript
import { checkLicenses } from "@mrdevx/license-scout";

await checkLicenses("./projects", "licenses.txt", { outputFormat: "json" });
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Runtime Support

- Deno (>= 1.37)
- Node.js (>= 18)
- Bun (>= 1.0)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

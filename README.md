# License Scout

A powerful tool for scanning and analyzing license information in your projects. This tool helps you track and manage licenses across your project dependencies.

## Features

- Scans project directories for license information
- Supports multiple package manager ecosystems
- Generates detailed license reports
- Easy to use command-line interface

## Installation

```bash
deno add jsr:@mrdevx/license-scout
```

## Usage

### Basic Commands

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

- **Text** (default): Human-readable format
- **JSON**: Machine-readable format

```bash
deno run -A license-scout.ts --format json ./my-project
```

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

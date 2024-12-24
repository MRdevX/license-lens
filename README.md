# License Lens

A powerful tool for scanning and analyzing license information in your projects. This tool helps you track and manage licenses across your project dependencies.

## Features

- Scans project directories for license information
- Supports multiple package manager ecosystems
- Generates detailed license reports
- Easy to use command-line interface
- Supports both text and JSON output formats
- Checks libraries and dependencies for commercial use

## Installation

### As a Package Dependency

```bash
deno add jsr:@mrdevx/license-lens
```

### Global Installation

```bash
deno install --global --force -A -n license-lens jsr:@mrdevx/license-lens
```

After global installation, you can run the tool from anywhere using:

```bash
license-lens [options] [directory]
```

## Command Line Interface

```bash
License Lens
A tool for scanning and analyzing license information in projects.

Usage:
  license-lens [options] [directory]

Options:
  -h, --help                Show this help message
  -v, --version             Show version information
  -o, --output <file>       Output file path (default: license-lens-[date].[txt|json])
  -f, --format <format>     Output format (text|json) (default: text)
  -e, --exclude <dirs>      Directories to exclude (comma-separated)
  --include-dev             Include dev dependencies in analysis
  --fail-missing            Exit with error if licenses are missing
  --exclude-licenses        Licenses to exclude from report (comma-separated)
  --depth <number>          Maximum directory depth to scan (default: Infinity)
```

### Examples

```bash
# Basic scan of current directory
license-lens

# Scan specific directory with JSON output
license-lens -f json -o licenses.json ./my-project

# Exclude multiple directories
license-lens -e "node_modules,dist,build"

# Include dev dependencies and fail on missing licenses
license-lens --include-dev --fail-missing

# Exclude specific licenses
license-lens --exclude-licenses "GPL-3.0,LGPL-3.0"

# Limit scan depth
license-lens --depth 2
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

## Checking Libraries and Dependencies for Commercial Use

License Lens provides detailed information about the licenses of your project's dependencies, including whether they are safe for commercial use. The tool categorizes licenses into two main categories:

Safe for commercial use: These licenses are generally considered safe for commercial use.
Review license terms: These licenses may have restrictions or conditions that require further review before using them in a commercial project.

## Example Output

```text
Project: my-awesome-project
Version: 1.0.0
Path: ./projects/my-awesome-project
Description: An awesome project
Author: John Doe
Repository: https://github.com/johndoe/my-awesome-project
Package License: MIT
Commercial Use: ✓ Safe for commercial use

Dependencies:
  express: ^4.17.1
  lodash: ^4.17.21

Dev Dependencies:
  typescript: ^4.5.4
  jest: ^27.4.7

Dependencies License Summary:
✓ ├─ MIT: 45 (Safe for commercial use)
✓ ├─ ISC: 12 (Safe for commercial use)
✓ ├─ Apache-2.0: 5 (Safe for commercial use)
⚠ ├─ BlueOak-1.0.0: 3 (Review license terms)
⚠ ├─ CC-BY-4.0: 2 (Review license terms)
⚠ ├─ Unlicense: 2 (Review license terms)
✓ └─ 0BSD: 1 (Safe for commercial use)
```

In the example above, the tool provides a summary of the licenses for all dependencies, indicating whether each license is safe for commercial use or requires further review.

## API Usage

You can also use License Lens programmatically:

```typescript
import { checkLicenses } from "@mrdevx/license-lens";

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

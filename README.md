# License Scout

A Deno-based tool for scanning and analyzing license information in your projects. This tool helps you track and manage licenses across your project dependencies.

## Features

- Scans project directories for license information
- Supports multiple package manager ecosystems
- Generates detailed license reports
- Easy to use command-line interface

## Installation

```bash
deno install -A -n license-scout https://raw.githubusercontent.com/mrdevx/license-scout/main/license-scout.ts
```

## Usage

Basic usage:

```bash
Scan current directory with default output
deno run -A license-scout.ts
Scan specific directory
deno run -A license-scout.ts ./my-project
Scan and output to specific file
deno run -A license-scout.ts ./my-project licenses.txt
```

### Required Permissions

The tool needs the following permissions to run:

- `--allow-read`: For reading project files and directories
- `--allow-write`: For writing the output report
- `--allow-run`: For executing system commands to gather license information

## Configuration

You can configure the tool using `deno.json` in your project:

```json
{
  "name": "@mrdevx/license-scout",
  "version": "0.1.0",
  "license": "MIT",
  "exports": "./license-scout.ts"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

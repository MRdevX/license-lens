import { parseArgs } from "jsr:@std/cli@1/parse-args";
import { checkLicenses } from "./services/license-checker.ts";
import packageData from "../deno.json" with { type: "json" };

/**
 * Displays the help message for the CLI.
 */
const showHelp = () => {
  console.log(`
License Scout v${packageData.version}
A tool for scanning and analyzing license information in projects.

Usage: 
  license-lens [options] [directory]

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

Examples:
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

Output Formats:
  text                    Human-readable text format (default)
  json                    Machine-readable JSON format

Environment Variables:
  NO_COLOR               Disable colored output
  DEBUG                  Enable debug logging

For more information, visit: https://jsr.io/@mrdevx/license-lens
`);
};

/**
 * Displays the version information for the CLI.
 */
const showVersion = () => {
  console.log(`License Scout v${packageData.version}`);
  console.log(`
Runtime: Deno ${Deno.version.deno}
V8: ${Deno.version.v8}
TypeScript: ${Deno.version.typescript}
`);
};

/**
 * Main CLI entry point for license-lens.
 * 
 * @example Basic usage
 * ```ts
 * license-lens ./my-project
 * ```
 * 
 * @example With options
 * ```ts
 * license-lens -f json -o licenses.json ./my-project
 * ```
 */
export const main = async () => {
  const flags = parseArgs(Deno.args, {
    string: ["output", "format", "exclude"],
    boolean: ["help", "version", "include-dev", "fail-on-missing"],
    alias: {
      h: "help",
      v: "version",
      o: "output",
      f: "format",
      e: "exclude",
    },
    default: {
      format: "text",
      output: "license-check-results",
    },
  });

  if (flags.help) {
    showHelp();
    Deno.exit(0);
  }

  if (flags.version) {
    showVersion();
    Deno.exit(0);
  }

  const rootDir = flags._[0]?.toString() || "./";
  await checkLicenses(rootDir, flags.output, { outputFormat: flags.format as "text" | "json" });
};
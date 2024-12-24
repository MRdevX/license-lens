import { parseArgs } from "jsr:@std/cli@1/parse-args";
import { checkLicenses } from "./services/license-checker.ts";
import packageData from "../deno.json" with { type: "json" };

const showHelp = () => {
  console.log(`
License Scout v${packageData.version}
A tool for scanning and analyzing license information in projects.

Usage: 
  license-scout [options] [directory]

Options:
  -h, --help              Show this help message
  -v, --version           Show version information
  -o, --output <file>     Output file path (default: license-check-results.[txt|json])
  -f, --format <format>   Output format (text|json) (default: text)

Examples:
  license-scout ./my-project
  license-scout --format json ./my-project licenses.json
  license-scout -f json -o licenses.json ./my-project
  `);
};

const showVersion = () => {
  console.log(`License Scout v${packageData.version}`);
};

/**
 * Main CLI entry point for license-scout
 * 
 * @example Basic usage
 * ```ts
 * license-scout ./my-project
 * ```
 * 
 * @example With options
 * ```ts
 * license-scout -f json -o licenses.json ./my-project
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

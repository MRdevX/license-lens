import { parseArgs } from "jsr:@std/cli@1/parse-args";
import { checkLicenses } from "./services/license-checker.ts";

export const main = async () => {
  const flags = parseArgs(Deno.args, {
    string: ["output", "format"],
    boolean: ["help"],
    default: {
      format: "text",
      output: "license-check-results.txt",
    },
  });

  if (flags.help) {
    console.log(`
Usage: license-scout [options] [directory]

Options:
  --output    Output file path (default: license-check-results.txt)
  --format    Output format (text|json) (default: text)
  --help      Show this help message
    `);
    Deno.exit(0);
  }

  const rootDir = flags._[0]?.toString() || "./";
  await checkLicenses(rootDir, flags.output, { outputFormat: flags.format as "text" | "json" });
};

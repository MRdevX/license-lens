import type { ProjectInfo } from "../interfaces/index.ts";
import { relative } from "node:path";

// Define commercially safe licenses
const COMMERCIAL_SAFE_LICENSES = new Set(["MIT", "Apache-2.0", "BSD-3-Clause", "BSD-2-Clause", "ISC", "0BSD"]);

/**
 * Formats the project information into a human-readable text output.
 *
 * @param projects Array of project information.
 * @returns Formatted text output.
 */
const formatTextOutput = (projects: ProjectInfo[]): string => {
  const lines: string[] = [];
  const separator = "=".repeat(80);

  for (const project of projects) {
    lines.push(separator);
    lines.push(`Project: ${project.name}`);
    lines.push(`Version: ${project.version}`);
    lines.push(`Path: ${project.path}`);

    if (project.description) {
      lines.push(`Description: ${project.description}`);
    }

    if (project.author) {
      lines.push(`Author: ${project.author}`);
    }

    if (project.repository) {
      lines.push(`Repository: ${project.repository}`);
    }

    // License Information
    const isCommercialSafe = Array.from(COMMERCIAL_SAFE_LICENSES).some((safeLicense) =>
      (project.license || "").includes(safeLicense)
    );
    const licenseStatus = isCommercialSafe ? "✓ Safe for commercial use" : "⚠ Review license terms";
    lines.push("");
    lines.push("License Information:");
    lines.push(`Package License: ${project.license || "Unknown"}`);
    lines.push(`Commercial Use: ${licenseStatus}`);

    // Dependencies
    if (project.dependencies && Object.keys(project.dependencies).length > 0) {
      lines.push("");
      lines.push("Dependencies:");
      for (const [dep, version] of Object.entries(project.dependencies)) {
        lines.push(`  ${dep}: ${version}`);
      }
    }

    // Dev Dependencies
    if (project.devDependencies && Object.keys(project.devDependencies).length > 0) {
      lines.push("");
      lines.push("Dev Dependencies:");
      for (const [dep, version] of Object.entries(project.devDependencies)) {
        lines.push(`  ${dep}: ${version}`);
      }
    }

    // License Summary
    if (project.licenses) {
      lines.push("");
      lines.push("Dependencies License Summary:");
      const licenseCounts = parseLicenseSummary(project.licenses);
      for (const [license, count] of Object.entries(licenseCounts)) {
        const isSafe = Array.from(COMMERCIAL_SAFE_LICENSES).some((safeLicense) => license.includes(safeLicense));
        const marker = isSafe ? "✓" : "⚠";
        const commercialUseStatus = isSafe ? "Safe for commercial use" : "Review license terms";
        lines.push(`${marker} ${license}: ${count} (${commercialUseStatus})`);
      }
    }

    lines.push("");
  }

  lines.push(separator);
  return lines.join("\n");
};

/**
 * Parses the license summary output into a record of license counts.
 *
 * @param summary License summary output.
 * @returns Record of license counts.
 */
const parseLicenseSummary = (summary: string): Record<string, number> => {
  const counts: Record<string, number> = {};
  const lines = summary.split("\n");
  for (const line of lines) {
    const match = line.match(/([^:]+):\s*(\d+)/);
    if (match) {
      counts[match[1].trim()] = parseInt(match[2]);
    }
  }
  return counts;
};

/**
 * Writes the project information results to a file.
 *
 * @param results Array of project information.
 * @param outputFile Path to the output file.
 * @param format Output format (text or json).
 */
export const writeResults = async (results: ProjectInfo[], outputFile: string, format: "text" | "json"): Promise<void> => {
  const content = format === "json" ? JSON.stringify(results, null, 2) : formatTextOutput(results);

  await Deno.writeTextFile(outputFile, content);
};

/**
 * Gets the relative path from the root directory.
 *
 * @param path Absolute path.
 * @param rootDir Root directory.
 * @returns Relative path.
 */
export const getRelativePath = (path: string, rootDir: string): string => {
  return relative(rootDir, path);
};

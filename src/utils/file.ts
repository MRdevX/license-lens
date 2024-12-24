import { green, yellow, bold, dim } from "https://deno.land/std@0.224.0/fmt/colors.ts";
import type { ProjectInfo } from "../interfaces/index.ts";
import { relative } from "node:path";

// Define commercially safe licenses
const COMMERCIAL_SAFE_LICENSES = new Set(["MIT", "Apache-2.0", "BSD-3-Clause", "BSD-2-Clause", "ISC", "0BSD"]);

const formatTextOutput = (projects: ProjectInfo[]): string => {
  const lines: string[] = [];
  const separator = "=".repeat(80);

  for (const project of projects) {
    lines.push(separator);
    lines.push(bold(`Project: ${project.name}`));
    lines.push(dim(`Version: ${project.version}`));
    lines.push(dim(`Path: ${project.path}`));

    if (project.description) {
      lines.push(dim(`Description: ${project.description}`));
    }

    if (project.author) {
      lines.push(dim(`Author: ${project.author}`));
    }

    if (project.repository) {
      lines.push(dim(`Repository: ${project.repository}`));
    }

    // License Information
    const isCommercialSafe = COMMERCIAL_SAFE_LICENSES.has(project.license || "");
    const licenseColor = isCommercialSafe ? green : yellow;
    lines.push("");
    lines.push(bold("License Information:"));
    lines.push(`Package License: ${licenseColor(project.license || "Unknown")}`);
    lines.push(
      `Commercial Use: ${isCommercialSafe ? green("✓ Safe for commercial use") : yellow("⚠ Review license terms")}`
    );

    // Dependencies
    if (project.dependencies && Object.keys(project.dependencies).length > 0) {
      lines.push("");
      lines.push(bold("Dependencies:"));
      for (const [dep, version] of Object.entries(project.dependencies)) {
        lines.push(dim(`  ${dep}: ${version}`));
      }
    }

    // Dev Dependencies
    if (project.devDependencies && Object.keys(project.devDependencies).length > 0) {
      lines.push("");
      lines.push(bold("Dev Dependencies:"));
      for (const [dep, version] of Object.entries(project.devDependencies)) {
        lines.push(dim(`  ${dep}: ${version}`));
      }
    }

    // License Summary
    if (project.licenses) {
      lines.push("");
      lines.push(bold("Dependencies License Summary:"));
      const licenseCounts = parseLicenseSummary(project.licenses);
      for (const [license, count] of Object.entries(licenseCounts)) {
        const isSafe = COMMERCIAL_SAFE_LICENSES.has(license);
        const marker = isSafe ? green("✓") : yellow("⚠");
        lines.push(`${marker} ${license}: ${count}`);
      }
    }

    lines.push("");
  }

  lines.push(separator);
  return lines.join("\n");
};

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

export const writeResults = async (results: ProjectInfo[], outputFile: string, format: "text" | "json"): Promise<void> => {
  const content = format === "json" ? JSON.stringify(results, null, 2) : formatTextOutput(results);

  await Deno.writeTextFile(outputFile, content);
};

export const getRelativePath = (path: string, rootDir: string): string => {
  return relative(rootDir, path);
};

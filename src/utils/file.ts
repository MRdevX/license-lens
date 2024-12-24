import type { ProjectInfo } from "../interfaces/index.ts";

/** Get the relative path from the root directory */
export const getRelativePath = (fullPath: string, rootDir: string): string =>
  fullPath.replace(rootDir, "").replace(/^\//, "");

/**
 * Formats and writes license check results to a file
 * @param results Array of project information to write
 * @param outputFile Path to write the results
 * @param format Output format (text or JSON)
 *
 * @example
 * ```ts
 * await writeResults(results, "licenses.txt", "text");
 * ```
 */
export const writeResults = async (results: ProjectInfo[], outputFile: string, format: "text" | "json"): Promise<void> => {
  const content = format === "json" ? JSON.stringify(results, null, 2) : formatTextResults(results);

  await Deno.writeTextFile(outputFile, content);
};

/**
 * Formats dependencies into a readable string
 * @param deps Record of dependencies and their versions
 * @returns Formatted string of dependencies
 */
const formatDependencies = (deps?: Record<string, string>): string => {
  if (!deps || Object.keys(deps).length === 0) return "";
  return Object.entries(deps)
    .map(([name, version]) => `  ${name}: ${version}`)
    .join("\n");
};

const formatTextResults = (results: ProjectInfo[]): string =>
  results
    .map((r) =>
      [
        `Project: ${r.name}`,
        `Version: ${r.version}`,
        `Path: ${r.path}`,
        r.description ? `Description: ${r.description}` : "",
        r.author ? `Author: ${r.author}` : "",
        r.repository ? `Repository: ${r.repository}` : "",
        r.license ? `Package License: ${r.license}` : "",
        r.dependencies ? `Dependencies:\n${formatDependencies(r.dependencies)}` : "",
        r.devDependencies ? `Dev Dependencies:\n${formatDependencies(r.devDependencies)}` : "",
        r.licenses ? `Dependencies Licenses:\n${r.licenses}` : "",
        "=".repeat(80),
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");

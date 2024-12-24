import { basename, join } from "node:path";
import type { ProjectInfo, PackageJson } from "../interfaces/index.ts";
import { DEFAULT_CONFIG } from "../interfaces/index.ts";
import { runCommand } from "../utils/command.ts";
import { getRelativePath, writeResults } from "../utils/file.ts";
import { findProjects } from "./project-finder.ts";

/**
 * Analyzes projects for license information
 * @module
 */

/**
 * Analyzes a list of projects and extracts their license information
 * @param projects Array of project paths to analyze
 * @param rootDir Root directory for relative path calculation
 * @returns Array of project information including licenses
 */
const analyzeProjects = async (projects: string[], rootDir: string): Promise<ProjectInfo[]> => {
  const results: ProjectInfo[] = [];

  for (const [index, project] of projects.entries()) {
    const projectName = basename(project);
    console.log(`\n[${index + 1}/${projects.length}] Analyzing ${projectName}...`);

    try {
      const packageJsonPath = join(project, "package.json");
      const packageJson: PackageJson = JSON.parse(await Deno.readTextFile(packageJsonPath));

      const repoUrl =
        typeof packageJson.repository === "string" ? packageJson.repository : packageJson.repository?.url || "";

      results.push({
        name: packageJson.name || projectName,
        version: packageJson.version || "N/A",
        path: getRelativePath(project, rootDir),
        description: packageJson.description,
        author: packageJson.author,
        repository: repoUrl,
        license: packageJson.license,
        dependencies: packageJson.dependencies,
        devDependencies: packageJson.devDependencies,
      });

      const licenseOutput = await runCommand("npx license-checker-rseidelsohn --summary", project);
      results[results.length - 1].licenses = licenseOutput;
    } catch (error) {
      results.push({
        name: projectName,
        version: "N/A",
        path: getRelativePath(project, rootDir),
        licenses: `Error checking project: ${error}`,
      });
    }
  }

  return results;
};

/**
 * Main function to check licenses in a directory
 * @param rootDir Directory to scan for projects
 * @param outputFile Path to write the results
 * @param config Configuration options for the scan
 *
 * @example
 * ```ts
 * await checkLicenses("./projects", "licenses.txt", { outputFormat: "json" });
 * ```
 */
export const checkLicenses = async (
  rootDir: string,
  outputFile: string,
  config: { outputFormat: "text" | "json" }
): Promise<void> => {
  try {
    console.log("🔍 Starting license scan...");
    const projects = await findProjects(rootDir, DEFAULT_CONFIG);

    console.log(`📦 Found ${projects.length} projects to analyze`);
    const results = await analyzeProjects(projects, rootDir);

    console.log("\n✅ License scan complete!");
    await writeResults(results, outputFile, config.outputFormat);
    console.log(`License check results written to: ${outputFile}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error:", errorMessage);
    Deno.exit(1);
  }
};

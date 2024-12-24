// Node.js built-ins
import { basename, join } from "node:path";

// Types
import type { ProjectInfo, PackageJson } from "../interfaces/index.ts";

// Project imports
import { DEFAULT_CONFIG } from "../interfaces/index.ts";
import { LicenseCheckerError } from "../utils/errors.ts";
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
const analyzeProjects = async (
  projects: string[],
  rootDir: string,
  onProgress?: (info: ProgressInfo) => void
): Promise<ProjectInfo[]> => {
  const results: ProjectInfo[] = [];

  for (const [index, project] of projects.entries()) {
    const projectName = basename(project);
    console.log(`\n[${index + 1}/${projects.length}] Analyzing ${projectName}...`);

    onProgress?.({
      current: index + 1,
      total: projects.length,
      projectName,
    });

    try {
      const packageJsonPath = join(project, "package.json");
      const packageJson = await readPackageJson(packageJsonPath);

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
export interface ProgressInfo {
  current: number;
  total: number;
  projectName: string;
}

/**
 * Main function to check licenses in a directory.
 *
 * @param rootDir Directory to scan for projects.
 * @param outputFile Path to write the results.
 * @param config Configuration options for the scan.
 * @param onProgress Optional callback for progress updates.
 *
 * @example
 * ```ts
 * await checkLicenses("./projects", "licenses.txt", { outputFormat: "json" });
 * ```
 */
export const checkLicenses = async (
  rootDir: string,
  outputFile: string,
  config: { outputFormat: "text" | "json" },
  onProgress?: (info: ProgressInfo) => void
): Promise<void> => {
  try {
    // Ensure correct file extension
    const fileExtension = config.outputFormat === "json" ? ".json" : ".txt";
    const finalOutputFile = outputFile.endsWith(fileExtension) ? outputFile : `${outputFile}${fileExtension}`;

    console.log("🔍 Starting license scan...");
    const projects = await findProjects(rootDir, DEFAULT_CONFIG);

    console.log(`📦 Found ${projects.length} projects to analyze`);
    const results = await analyzeProjects(projects, rootDir, onProgress);

    console.log("\n✅ License scan complete!");
    await writeResults(results, finalOutputFile, config.outputFormat);
    console.log(`License check results written to: ${finalOutputFile}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error:", errorMessage);
    Deno.exit(1);
  }
};

/**
 * Reads and parses a package.json file.
 *
 * @param path Path to the package.json file.
 * @returns Parsed package.json content.
 * @throws LicenseCheckerError if the package.json file is not found.
 */
const readPackageJson = async (path: string): Promise<PackageJson> => {
  try {
    const content = await Deno.readTextFile(path);
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new LicenseCheckerError("package.json not found", "PKG_NOT_FOUND");
    }
    throw error;
  }
};

import { join, basename } from "node:path";
import { parseArgs } from "https://deno.land/std/cli/parse_args.ts";

/**
 * Add interfaces for better type safety
 */
interface ProjectInfo {
  name: string;
  version: string;
  path: string;
  description?: string;
  author?: string;
  repository?: string;
  license?: string;
  licenses?: string;
}

interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  repository?: { url?: string } | string;
  license?: string;
}

interface Config {
  excludeDirs: string[];
  outputFormat: "text" | "json";
  depth?: number;
}

const DEFAULT_CONFIG: Config = {
  excludeDirs: ["node_modules", ".git"],
  outputFormat: "text",
  depth: Infinity,
};

/**
 * Execute a shell command and return the result as a Promise.
 */
const runCommand = async (command: string, cwd: string): Promise<string> => {
  try {
    const [cmd, ...args] = command.split(" ");
    const process = new Deno.Command(cmd, {
      args,
      cwd,
      stdout: "piped",
      stderr: "piped",
    });

    const { success, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(success ? stdout : stderr);

    if (!success) {
      throw new Error(`Command failed: ${output}`);
    }

    return output;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to execute command: ${errorMessage}`);
  }
};

/**
 * Recursively fetch all folders containing a `package.json`.
 */
const findProjects = async (dir: string, config = DEFAULT_CONFIG): Promise<string[]> => {
  const projects: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    if (config.excludeDirs.includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      try {
        // Check if the folder contains a package.json
        await Deno.stat(join(fullPath, "package.json"));
        projects.push(fullPath);
      } catch {
        // If no package.json, continue searching subdirectories
        const nestedProjects = await findProjects(fullPath);
        projects.push(...nestedProjects);
      }
    }
  }
  return projects;
};

/**
 * Main script to check licenses and write results to a file.
 */
const checkLicenses = async (rootDir: string, outputFile: string, config: { outputFormat: "text" | "json" }) => {
  try {
    console.log("🔍 Starting license scan...");
    const projects = await findProjects(rootDir);

    console.log(`📦 Found ${projects.length} projects to analyze`);
    const results: ProjectInfo[] = [];

    const getRelativePath = (fullPath: string) => fullPath.replace(rootDir, "").replace(/^\//, "");

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
          path: getRelativePath(project),
          description: packageJson.description,
          author: packageJson.author,
          repository: repoUrl,
          license: packageJson.license,
        });

        // Run the license checker command
        const licenseOutput = await runCommand("npx license-checker-rseidelsohn --summary", project);
        results[results.length - 1].licenses = licenseOutput;
      } catch (error) {
        // Log any errors
        results.push({
          name: projectName,
          version: "N/A",
          path: getRelativePath(project),
          licenses: `Error checking project: ${error}`,
        });
      }
    }

    console.log("\n✅ License scan complete!");

    // Write the results to a file
    await writeResults(results, outputFile, config.outputFormat);
    console.log(`License check results written to: ${outputFile}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error:", errorMessage);
    Deno.exit(1);
  }
};

const writeResults = async (results: ProjectInfo[], outputFile: string, format: "text" | "json") => {
  const content =
    format === "json"
      ? JSON.stringify(results, null, 2)
      : results
          .map((r) =>
            [
              `Project: ${r.name}`,
              `Version: ${r.version}`,
              `Path: ${r.path}`,
              r.description ? `Description: ${r.description}` : "",
              r.author ? `Author: ${r.author}` : "",
              r.repository ? `Repository: ${r.repository}` : "",
              r.license ? `Package License: ${r.license}` : "",
              r.licenses ? `Dependencies Licenses:\n${r.licenses}` : "",
              "=".repeat(80),
            ]
              .filter(Boolean)
              .join("\n")
          )
          .join("\n\n");

  await Deno.writeTextFile(outputFile, content);
};

const main = async () => {
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

if (import.meta.main) {
  main();
}

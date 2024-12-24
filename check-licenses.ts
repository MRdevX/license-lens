import { join, basename } from "node:path";

/**
 * Execute a shell command and return the result as a Promise.
 */
const runCommand = async (command: string, cwd: string): Promise<string> => {
  const [cmd, ...args] = command.split(" ");
  const process = new Deno.Command(cmd, {
    args,
    cwd,
    stdout: "piped",
    stderr: "piped",
  });

  const { success, stdout, stderr } = await process.output();

  if (success) {
    return new TextDecoder().decode(stdout);
  } else {
    throw new TextDecoder().decode(stderr);
  }
};

/**
 * Recursively fetch all folders containing a `package.json`.
 */
const findProjects = async (dir: string): Promise<string[]> => {
  const projects: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
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
const checkLicenses = async (rootDir: string, outputFile: string) => {
  try {
    // Find all projects with package.json
    console.log(`Scanning for projects in: ${rootDir}`);
    const projects = await findProjects(rootDir);

    console.log(`Found ${projects.length} projects. Checking licenses...`);

    const results: string[] = [];

    for (const project of projects) {
      const projectName = basename(project);

      try {
        // Read project details from package.json
        const packageJsonPath = join(project, "package.json");
        const packageJson = JSON.parse(await Deno.readTextFile(packageJsonPath));

        // Append project name and details
        results.push(`Project: ${packageJson.name || projectName}`);
        results.push(`Version: ${packageJson.version || "N/A"}`);
        results.push(`Path: ${project}\n`);

        // Run the license checker command
        const licenseOutput = await runCommand("npx license-checker-rseidelsohn --summary", project);
        results.push(licenseOutput);
      } catch (error) {
        // Log any errors
        results.push(`Error checking project: ${projectName}\n${error}\n`);
      }

      results.push("-".repeat(80));
    }

    // Write the results to a file
    await Deno.writeTextFile(outputFile, results.join("\n"));
    console.log(`License check results written to: ${outputFile}`);
  } catch (error) {
    console.error(`Failed to complete license check: ${error}`);
  }
};

// Usage
const rootDirectory = Deno.args[0] || "./"; // Pass the root folder as an argument or use current directory
const outputFilePath = Deno.args[1] || "license-check-results.txt"; // Output file path

checkLicenses(rootDirectory, outputFilePath);

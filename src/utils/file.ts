import type { ProjectInfo } from "../interfaces/index.ts";

export const getRelativePath = (fullPath: string, rootDir: string): string =>
  fullPath.replace(rootDir, "").replace(/^\//, "");

export const writeResults = async (results: ProjectInfo[], outputFile: string, format: "text" | "json"): Promise<void> => {
  const content = format === "json" ? JSON.stringify(results, null, 2) : formatTextResults(results);

  await Deno.writeTextFile(outputFile, content);
};

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

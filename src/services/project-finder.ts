import { join } from "node:path";

export interface FindProjectsOptions {
  excludeDirs: string[];
  depth?: number;
}

/**
 * Recursively finds all projects containing a package.json
 * @param dir Directory to start searching from
 * @param config Configuration options for the search
 * @returns Promise resolving to array of project paths
 *
 * @example
 * ```ts
 * const projects = await findProjects("./", { excludeDirs: ["node_modules"] });
 * ```
 */
export const findProjects = async (dir: string, options: FindProjectsOptions): Promise<string[]> => {
  const projects: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    if (options.excludeDirs.includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      try {
        await Deno.stat(join(fullPath, "package.json"));
        projects.push(fullPath);
      } catch {
        const nestedProjects = await findProjects(fullPath, options);
        projects.push(...nestedProjects);
      }
    }
  }
  return projects;
};

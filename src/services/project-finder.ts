import { join } from "node:path";
import type { Config } from "../interfaces/config.ts";

export const findProjects = async (dir: string, config: Config): Promise<string[]> => {
  const projects: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    if (config.excludeDirs.includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      try {
        await Deno.stat(join(fullPath, "package.json"));
        projects.push(fullPath);
      } catch {
        const nestedProjects = await findProjects(fullPath, config);
        projects.push(...nestedProjects);
      }
    }
  }
  return projects;
};

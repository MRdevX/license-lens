export interface Config {
  excludeDirs: string[];
  outputFormat: "text" | "json";
  depth?: number;
}

export const DEFAULT_CONFIG: Config = {
  excludeDirs: ["node_modules", ".git"],
  outputFormat: "text",
  depth: Infinity,
};

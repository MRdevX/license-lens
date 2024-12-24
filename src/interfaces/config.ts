/** Configuration options for license scanning */
export interface Config {
  /** Directories to skip during scanning */
  excludeDirs: string[];
  /** Output format for the results */
  outputFormat: "text" | "json";
  /** Maximum depth to scan for projects */
  depth?: number;
}

/** Default configuration settings */
export const DEFAULT_CONFIG: Config = {
  excludeDirs: ["node_modules", ".git"],
  outputFormat: "text",
  depth: Infinity,
};

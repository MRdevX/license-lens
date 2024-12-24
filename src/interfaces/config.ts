/** Configuration options for license scanning */
export interface Config {
  /** Directories to skip during scanning */
  excludeDirs: string[];
  /** Maximum depth to scan for projects */
  depth?: number;
  /** Output format for the results */
  outputFormat: OutputFormat;
  /** Fail on missing licenses */
  failOnMissing: boolean;
  /** Include development dependencies */
  includeDev: boolean;
  /** Exclude specific licenses */
  excludeLicenses: string[];
}

export type OutputFormat = "text" | "json";

/** Default configuration settings */
export const DEFAULT_CONFIG: Config = {
  excludeDirs: ["node_modules", ".git"],
  outputFormat: "text",
  depth: Infinity,
  failOnMissing: false,
  includeDev: false,
  excludeLicenses: [],
};

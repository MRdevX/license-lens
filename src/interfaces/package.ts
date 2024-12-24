/** Information about a project's package and its licenses */
export interface ProjectInfo {
  /** Package name from package.json or directory name */
  name: string;
  /** Package version or "N/A" if not found */
  version: string;
  /** Relative path to the project */
  path: string;
  /** Package description from package.json */
  description?: string;
  /** Package author information */
  author?: string;
  /** Repository URL */
  repository?: string;
  /** Package's own license */
  license?: string;
  /** Aggregated licenses information from dependencies */
  licenses?: string;
  /** Map of package dependencies and their versions */
  dependencies?: Record<string, string>;
  /** Map of package development dependencies and their versions */
  devDependencies?: Record<string, string>;
}

/** Structure of a package.json file */
export interface PackageJson {
  /** Package name */
  name?: string;
  /** Package version */
  version?: string;
  /** Package description */
  description?: string;
  /** Package author */
  author?: string;
  /** Repository information */
  repository?: { url?: string } | string;
  /** Package license */
  license?: string;
  /** Package dependencies */
  dependencies?: Record<string, string>;
  /** Package development dependencies */
  devDependencies?: Record<string, string>;
}

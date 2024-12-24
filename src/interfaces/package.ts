export interface ProjectInfo {
  name: string;
  version: string;
  path: string;
  description?: string;
  author?: string;
  repository?: string;
  license?: string;
  licenses?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  repository?: { url?: string } | string;
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

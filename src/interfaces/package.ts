export interface ProjectInfo {
  name: string;
  version: string;
  path: string;
  description?: string;
  author?: string;
  repository?: string;
  license?: string;
  licenses?: string;
}

export interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  repository?: { url?: string } | string;
  license?: string;
}

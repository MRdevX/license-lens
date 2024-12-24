export class LicenseCheckerError extends Error {
  constructor(message: string, public code: LicenseErrorCode, public details?: Record<string, unknown>) {
    super(message);
    this.name = "LicenseCheckerError";
  }
}

export type LicenseErrorCode = "PKG_NOT_FOUND" | "INVALID_JSON" | "INVALID_CONFIG" | "SCAN_FAILED";

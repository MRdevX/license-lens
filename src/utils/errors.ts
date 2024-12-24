/**
 * Custom error class for license checker errors.
 */
export class LicenseCheckerError extends Error {
  constructor(message: string, public code: LicenseErrorCode, public details?: Record<string, unknown>) {
    super(message);
    this.name = "LicenseCheckerError";
  }
}

/**
 * Error codes for license checker errors.
 */
export type LicenseErrorCode = "PKG_NOT_FOUND" | "INVALID_JSON" | "INVALID_CONFIG" | "SCAN_FAILED";

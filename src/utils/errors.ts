export class LicenseCheckerError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "LicenseCheckerError";
  }
}

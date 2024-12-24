/**
 * Main entry point for the License Scout tool.
 *
 * This module exports all necessary interfaces, services, and utilities for
 * scanning and analyzing license information in projects.
 *
 * @module
 */

export * from "./src/interfaces/index.ts";
export * from "./src/services/index.ts";
export * from "./src/utils/index.ts";

import { main } from "./src/cli.ts";

if (import.meta.main) {
  main();
}

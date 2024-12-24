export * from "./src/interfaces/index.ts";
export * from "./src/services/index.ts";
export * from "./src/utils/index.ts";

import { main } from "./src/cli.ts";

if (import.meta.main) {
  main();
}

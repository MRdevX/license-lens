/**
 * Executes a shell command and returns its output
 * @param command Command to execute
 * @param cwd Working directory for command execution
 * @returns Promise resolving to command output
 * @throws Error if command execution fails
 *
 * @example
 * ```ts
 * const output = await runCommand("npm list", "./project");
 * ```
 */
export const runCommand = async (command: string, cwd: string): Promise<string> => {
  try {
    const [cmd, ...args] = command.split(" ");
    const process = new Deno.Command(cmd, {
      args,
      cwd,
      stdout: "piped",
      stderr: "piped",
    });

    const { success, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(success ? stdout : stderr);

    if (!success) {
      throw new Error(`Command failed: ${output}`);
    }

    return output;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to execute command: ${errorMessage}`);
  }
};

import { invoke } from "@tauri-apps/api/core";

export const isTauriRuntime = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in (window as unknown as Record<string, unknown>);

export async function invokeIfAvailable<T>(
  command: string,
  args?: Record<string, unknown>,
): Promise<T | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<T>(command, args);
}

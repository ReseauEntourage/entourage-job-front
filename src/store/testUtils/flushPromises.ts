/**
 * Waits a macrotask tick so that pending saga effects (API calls awaited via
 * `call`, and the `put`s that follow) have settled before assertions run.
 */
export function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

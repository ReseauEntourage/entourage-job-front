/**
 * Makes every random value of a screenshot run reproducible, so that two runs of the same
 * spec give the exact same pixels (cypress/pr-screenshots/compare.mjs relies on it).
 *
 * - Faker draws its initial seed from Math.random() when it is imported: seeding Math.random()
 *   of the spec window before any import makes all the faker fixtures deterministic.
 * - The app itself (shuffled lists, random cards...) uses the Math.random() of the page under
 *   test, re-seeded at every page load.
 */
export const SEED = 20260101;

/** mulberry32: small seeded PRNG returning floats in [0, 1). */
export function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

Math.random = seededRandom(SEED);

Cypress.on('window:before:load', (win) => {
  win.Math.random = seededRandom(SEED);
});

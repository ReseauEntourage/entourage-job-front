import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'cypress';

/**
 * PR screenshots (cypress/pr-screenshots/*.shot.ts), see cypress/pr-screenshots/README.md.
 *
 * Same mocked back end as the E2E suite (cy.intercept + generated fixtures), but a spec is
 * run once per device: `cypress/pr-screenshots/run.mjs` sets SHOT_DEVICE and launches
 * Cypress twice. PNGs are flattened into cypress/pr-screenshots/output/.
 */
const DEVICES = {
  desktop: { viewportWidth: 1440, viewportHeight: 900 },
  // Below BREAKPOINTS.desktop, with a mobile user agent so the SSR pass of
  // useIsDesktop() (mobile-detect) already renders the mobile layout.
  mobile: {
    viewportWidth: 390,
    viewportHeight: 844,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
} as const;

type Device = keyof typeof DEVICES;

const device: Device =
  process.env.SHOT_DEVICE === 'mobile' ? 'mobile' : 'desktop';
const OUTPUT_DIR = path.resolve(__dirname, 'cypress/pr-screenshots/output');

module.exports = defineConfig({
  ...DEVICES[device],
  video: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  scrollBehavior: 'center',
  screenshotsFolder: 'cypress/pr-screenshots/.raw',
  // Both device runs write into the same output folder: run.mjs cleans it once.
  trashAssetsBeforeRuns: false,
  screenshotOnRunFailure: false,
  retries: 1,
  expose: { device },
  allowCypressEnv: false,
  e2e: {
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    specPattern: 'cypress/pr-screenshots/**/*.shot.ts',
    supportFile: 'cypress/pr-screenshots/support.ts',
    blockHosts: [
      '*.ytimg.com',
      '*.youtube.com',
      '*.gvt1.com',
      '*.google.com',
      '*.googlevideo.com',
    ],
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        // The capture is bounded by the (headless) window: support.ts grows the viewport
        // to the page height, so the window must be taller than any captured page.
        if (browser.name === 'electron') {
          launchOptions.preferences.width = 1600;
          launchOptions.preferences.height = 10000;
        }
        return launchOptions;
      });
      // Flatten `<screenshotsFolder>/<spec>/<name>.png` into the output folder.
      on('after:screenshot', (details) => {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        const target = path.join(OUTPUT_DIR, `${details.name}.png`);
        fs.renameSync(details.path, target);
        return { path: target };
      });
    },
  },
});

// Runs the PR screenshot specs once per device (desktop, then mobile) against the app
// already served on NEXT_PUBLIC_SERVER_URL. PNG + JSON land in cypress/pr-screenshots/output/.
// Usage: node cypress/pr-screenshots/run.mjs [spec ...]   (no spec = every *.shot.ts)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cypress from 'cypress';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const specs = process.argv.slice(2);

for (const dir of ['output', '.raw']) {
  fs.rmSync(path.join(root, 'cypress/pr-screenshots', dir), {
    recursive: true,
    force: true,
  });
}

let failed = false;
for (const device of ['desktop', 'mobile']) {
  console.log(`\n📸 ${device}`);
  // Read by cypress.screenshots.config.ts (viewport, user agent).
  process.env.SHOT_DEVICE = device;

  const result = await cypress.run({
    project: root,
    configFile: 'cypress.screenshots.config.ts',
    browser: 'electron',
    ...(specs.length ? { spec: specs.join(',') } : {}),
  });
  if (result.status === 'failed' || result.totalFailed > 0) {
    failed = true;
  }
}

process.exit(failed ? 1 : 0);

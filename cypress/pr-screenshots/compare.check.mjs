// Checks of compare.mjs: `pnpm screenshots:compare:check` (node:test, no browser needed).
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { PNG } from 'pngjs';
import { compareImages } from './compare.mjs';

const script = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'compare.mjs'
);

function solid(width, height, [r, g, b]) {
  const png = new PNG({ width, height });
  for (let i = 0; i < width * height; i++) {
    png.data.set([r, g, b, 255], i * 4);
  }
  return PNG.sync.write(png);
}

test('identical images are identical', () => {
  const result = compareImages(solid(4, 4, [0, 0, 0]), solid(4, 4, [0, 0, 0]));
  assert.equal(result.status, 'identical');
  assert.equal(result.pixels, 0);
});

test('different images are reported with their pixel count', () => {
  const result = compareImages(
    solid(4, 4, [0, 0, 0]),
    solid(4, 4, [255, 255, 255])
  );
  assert.equal(result.status, 'different');
  assert.equal(result.pixels, 16);
});

test('a different size is reported as a size mismatch', () => {
  const result = compareImages(solid(4, 4, [0, 0, 0]), solid(4, 8, [0, 0, 0]));
  assert.equal(result.status, 'size-mismatch');
});

test('the CLI exits 0 on identical folders and 1 on a difference', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'compare-check-'));
  const [baseline, output, diff] = ['baseline', 'output', 'diff'].map(
    (name) => {
      const target = path.join(dir, name);
      fs.mkdirSync(target);
      return target;
    }
  );
  fs.writeFileSync(
    path.join(baseline, 'page.desktop.png'),
    solid(4, 4, [0, 0, 0])
  );
  fs.writeFileSync(
    path.join(output, 'page.desktop.png'),
    solid(4, 4, [0, 0, 0])
  );
  const run = () =>
    spawnSync(
      'node',
      [script, '--baseline', baseline, '--output', output, '--diff', diff],
      { encoding: 'utf8' }
    );

  assert.equal(run().status, 0);

  fs.writeFileSync(
    path.join(output, 'page.desktop.png'),
    solid(4, 4, [255, 255, 255])
  );
  const failing = run();
  assert.equal(failing.status, 1);
  assert.match(failing.stdout, /page\.desktop\.png: 16 different pixels/);
  assert.ok(fs.existsSync(path.join(diff, 'page.desktop.png')));
});

test('captures listed in the ignore file are skipped', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'compare-ignore-'));
  const [baseline, output, diff] = ['baseline', 'output', 'diff'].map(
    (name) => {
      const target = path.join(dir, name);
      fs.mkdirSync(target);
      return target;
    }
  );
  fs.writeFileSync(path.join(baseline, 'flaky.png'), solid(4, 4, [0, 0, 0]));
  fs.writeFileSync(
    path.join(output, 'flaky.png'),
    solid(4, 4, [255, 255, 255])
  );
  const ignore = path.join(dir, 'ignore.txt');
  fs.writeFileSync(ignore, '# unstable capture\nflaky.png\n');
  const run = spawnSync(
    'node',
    [
      script,
      '--baseline',
      baseline,
      '--output',
      output,
      '--diff',
      diff,
      '--ignore',
      ignore,
    ],
    { encoding: 'utf8' }
  );
  assert.equal(run.status, 0);
  assert.match(run.stdout, /1 ignored/);
});

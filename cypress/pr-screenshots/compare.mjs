/* global process, console */
// Compares the PNGs of a screenshot run (output/) with a reference run (baseline/).
// Usage: node cypress/pr-screenshots/compare.mjs [--baseline <dir>] [--output <dir>]
//          [--diff <dir>] [--threshold <0-1>] [--max-pixels <n>] [--ignore <file>] [name-prefix ...]
// `--ignore` points to a text file listing, one per line, the PNG names to skip (captures that
// are not reproducible even between two runs of the same code, see README.md).
// Exit code 0 when every compared image is identical (within the tolerance), 1 otherwise.
// Used to prove that a refactor (e.g. removing UIkit) leaves every screen pixel-identical.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Compares two PNG buffers.
 * @returns {{ status: 'identical' | 'different' | 'size-mismatch', pixels: number, diff?: PNG }}
 */
export function compareImages(
  baselineBuffer,
  currentBuffer,
  { threshold = 0.1, maxPixels = 0 } = {}
) {
  const baseline = PNG.sync.read(baselineBuffer);
  const current = PNG.sync.read(currentBuffer);
  if (baseline.width !== current.width || baseline.height !== current.height) {
    return {
      status: 'size-mismatch',
      pixels: Math.abs(
        baseline.width * baseline.height - current.width * current.height
      ),
      sizes: [
        `${baseline.width}x${baseline.height}`,
        `${current.width}x${current.height}`,
      ],
    };
  }
  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const pixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold }
  );
  return {
    status: pixels > maxPixels ? 'different' : 'identical',
    pixels,
    diff,
  };
}

/** Compares every PNG of `baselineDir` with the PNG of the same name in `outputDir`. */
export function compareDirectories({
  baselineDir,
  outputDir,
  diffDir,
  threshold,
  maxPixels,
  prefixes = [],
  ignored = [],
}) {
  const matches = (name) =>
    !ignored.includes(name) &&
    (prefixes.length === 0 ||
      prefixes.some((prefix) => name.startsWith(prefix)));
  const list = (dir) =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.endsWith('.png') && matches(f))
      : [];
  const baselineFiles = list(baselineDir);
  const outputFiles = list(outputDir);
  const problems = [];

  fs.rmSync(diffDir, { recursive: true, force: true });
  for (const file of baselineFiles) {
    if (!outputFiles.includes(file)) {
      problems.push({ file, status: 'missing', pixels: 0 });
      continue;
    }
    const result = compareImages(
      fs.readFileSync(path.join(baselineDir, file)),
      fs.readFileSync(path.join(outputDir, file)),
      { threshold, maxPixels }
    );
    if (result.status !== 'identical') {
      problems.push({ file, ...result, diff: undefined });
      if (result.diff) {
        fs.mkdirSync(diffDir, { recursive: true });
        fs.writeFileSync(path.join(diffDir, file), PNG.sync.write(result.diff));
      }
    }
  }
  for (const file of outputFiles) {
    if (!baselineFiles.includes(file)) {
      problems.push({ file, status: 'new', pixels: 0 });
    }
  }
  return { compared: baselineFiles.length, problems };
}

function parseArgs(argv) {
  const options = {
    baselineDir: path.join(here, 'baseline'),
    outputDir: path.join(here, 'output'),
    diffDir: path.join(here, 'diff'),
    threshold: 0.1,
    maxPixels: 0,
    prefixes: [],
    ignored: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--baseline') options.baselineDir = path.resolve(argv[++i]);
    else if (arg === '--output') options.outputDir = path.resolve(argv[++i]);
    else if (arg === '--diff') options.diffDir = path.resolve(argv[++i]);
    else if (arg === '--threshold') options.threshold = Number(argv[++i]);
    else if (arg === '--max-pixels') options.maxPixels = Number(argv[++i]);
    else if (arg === '--ignore')
      options.ignored = fs
        .readFileSync(path.resolve(argv[++i]), 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'));
    else options.prefixes.push(arg);
  }
  return options;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(options.baselineDir)) {
    console.error(`No baseline found in ${options.baselineDir}.`);
    process.exit(2);
  }
  const { compared, problems } = compareDirectories(options);
  for (const problem of problems) {
    const detail =
      problem.status === 'size-mismatch'
        ? `size ${problem.sizes.join(' -> ')}`
        : problem.status === 'different'
          ? `${problem.pixels} different pixels`
          : problem.status;
    console.log(`✗ ${problem.file}: ${detail}`);
  }
  console.log(
    `\n${compared} baseline image(s) compared` +
      (options.ignored.length ? ` (${options.ignored.length} ignored)` : '') +
      `, ${problems.length} difference(s).` +
      (problems.some((p) => p.diff !== undefined || p.status === 'different')
        ? ` Diff images in ${path.relative(process.cwd(), options.diffDir)}.`
        : '')
  );
  process.exit(problems.length > 0 ? 1 : 0);
}

// Runs `next <args>` after loading ./.env into the environment.
// `next dev` / `next start` only read PORT from process.env (not from .env), and Node's
// --env-file flag cannot be used: next re-spawns workers with it in NODE_OPTIONS, which Node rejects.
// Variables already set in the environment win over .env.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

try {
  process.loadEnvFile('.env');
} catch {
  // No .env (e.g. CI): keep the current environment.
}

const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)));

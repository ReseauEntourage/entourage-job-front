// Builds the "Captures" Markdown block injected into the PR description
// by .github/workflows/pr-screenshots.yml.
// Usage: node cypress/pr-screenshots/render-markdown.mjs <PNG folder> <images base URL>
import fs from 'node:fs';
import path from 'node:path';

const [outputDir, baseUrl] = process.argv.slice(2);
if (!outputDir || !baseUrl) {
  console.error(
    'Usage: node cypress/pr-screenshots/render-markdown.mjs <outputDir> <baseUrl>'
  );
  process.exit(1);
}

const DEVICES = [
  { name: 'desktop', label: '🖥️ Desktop', width: 560 },
  { name: 'mobile', label: '📱 Mobile', width: 220 },
];

const metas = fs
  .readdirSync(outputDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) =>
    JSON.parse(fs.readFileSync(path.join(outputDir, file), 'utf8'))
  );

const shots = new Map();
for (const meta of metas) {
  const shot = shots.get(meta.slug) ?? { ...meta, files: {} };
  shot.files[meta.device] = meta.file;
  shots.set(meta.slug, shot);
}

const ordered = [...shots.values()].sort(
  (a, b) => a.spec.localeCompare(b.spec) || a.index - b.index
);

// `?raw=true`: GitHub serves the raw file behind a blob/ URL.
const url = (file) => `${baseUrl}/${file}?raw=true`;
const image = (file, width) =>
  file
    ? `<a href="${url(file)}"><img src="${url(file)}" width="${width}" alt="${file}"></a>`
    : '—';

const sections = ordered.map((shot) => {
  const lines = [`#### ${shot.title}`, ''];
  if (shot.caption) lines.push(`_${shot.caption}_`, '');
  lines.push(
    `| ${DEVICES.map((d) => d.label).join(' | ')} |`,
    `| ${DEVICES.map(() => ':---:').join(' | ')} |`,
    `| ${DEVICES.map((d) => image(shot.files[d.name], d.width)).join(' | ')} |`
  );
  return lines.join('\n');
});

process.stdout.write(
  sections.length ? sections.join('\n\n') : '_Aucune capture produite._'
);

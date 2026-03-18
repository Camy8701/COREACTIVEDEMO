import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const blockedPatterns = [
  /https?:\/\/ballinfit\.nl/i,
  /\/\/ballinfit\.nl/i,
  /https?:\\\/\\\/ballinfit\.nl/i,
  /https?:\/\/cdn\.shopify\.com/i,
  /https?:\\\/\\\/cdn\.shopify\.com/i,
  /https?:\/\/fonts\.shopifycdn\.com/i,
  /https?:\\\/\\\/fonts\.shopifycdn\.com/i,
  /https?:\/\/fonts\.shopify\.com/i,
  /https?:\\\/\\\/fonts\.shopify\.com/i,
  /https?:\/\/monorail-edge\.shopifysvc\.com/i,
  /https?:\\\/\\\/monorail-edge\.shopifysvc\.com/i,
];

const ignoredRoots = new Set(['node_modules', '.git', 'capture', 'scripts']);

async function main() {
  const findings = [];
  await walk(projectRoot, findings);

  if (!findings.length) {
    console.log('No blocked remote dependencies found.');
    return;
  }

  for (const finding of findings) {
    console.log(`${finding.file}: ${finding.pattern}`);
  }

  process.exitCode = 1;
}

async function walk(directory, findings) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoredRoots.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(absolutePath, findings);
      continue;
    }

    if (!/\.(?:html|css|js|json|xml|txt|svg)$/i.test(entry.name)) {
      continue;
    }

    const content = await fs.readFile(absolutePath, 'utf8');
    for (const pattern of blockedPatterns) {
      if (pattern.test(content)) {
        findings.push({
          file: path.relative(projectRoot, absolutePath),
          pattern: pattern.toString(),
        });
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

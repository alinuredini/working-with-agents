import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detect, runScript } from '../src/detect.js';

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), 'wa-detect-'));
  for (const [rel, content] of Object.entries(files)) {
    const p = join(dir, rel);
    mkdirSync(join(p, '..'), { recursive: true });
    writeFileSync(p, content);
  }
  return dir;
}

test('detect reads description, scripts, design, tool', () => {
  const dir = fixture({
    'package.json': JSON.stringify({
      description: 'A test app',
      scripts: { dev: 'vite', test: 'vitest', build: 'vite build' },
      devDependencies: { tailwindcss: '^4' },
    }),
    'components.json': '{}',
  });
  const d = detect(dir);
  assert.equal(d.overview, 'A test app');
  assert.equal(d.dev, 'npm run dev');
  assert.equal(d.test, 'npm run test');
  assert.equal(d.build, 'npm run build');
  assert.equal(d.design, true);
  assert.equal(d.tool, 'claude'); // no CLAUDE.md/.cursor/AGENTS.md → default
});

test('detect handles empty dir', () => {
  const dir = fixture({});
  const d = detect(dir);
  assert.equal(d.overview, '');
  assert.equal(d.dev, '');
  assert.equal(d.design, false);
  assert.equal(d.tool, 'claude');
});

test('runScript formats per package manager', () => {
  assert.equal(runScript('pnpm', 'dev'), 'pnpm dev');
  assert.equal(runScript('yarn', 'build'), 'yarn build');
  assert.equal(runScript('bun', 'test'), 'bun run test');
  assert.equal(runScript('npm', 'dev'), 'npm run dev');
});

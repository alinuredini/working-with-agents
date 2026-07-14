import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init } from '../src/init.js';

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'wa-init-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    description: 'Sample app',
    scripts: { dev: 'vite', test: 'vitest', build: 'vite build' },
  }));
  writeFileSync(join(dir, 'components.json'), '{}'); // → design default true
  return dir;
}

test('init --yes scaffolds filled AGENTS.md + DESIGN.md + CLAUDE.md', async () => {
  const dir = repo();
  const { results } = await init({ dir, yes: true });

  const agents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
  assert.match(agents, /Sample app/);
  assert.match(agents, /npm run dev/);
  assert.match(agents, /npm run build/);
  assert.doesNotMatch(agents, /wa:/);

  assert.ok(existsSync(join(dir, 'DESIGN.md')));
  assert.match(readFileSync(join(dir, 'DESIGN.md'), 'utf8'), /Read my design system from this repo/);

  assert.match(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), /@AGENTS\.md/);

  assert.ok(results.some((r) => r.file === 'AGENTS.md' && r.written));
});

test('init --yes re-run skips existing files', async () => {
  const dir = repo();
  await init({ dir, yes: true });
  writeFileSync(join(dir, 'AGENTS.md'), 'HAND-EDITED');
  await init({ dir, yes: true }); // no force
  assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), 'HAND-EDITED');
});

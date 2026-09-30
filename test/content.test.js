import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

function contentFiles() {
  const dirs = ['playbooks', 'looks', 'templates', 'examples'];
  const files = dirs.flatMap((d) =>
    existsSync(join(ROOT, d))
      ? readdirSync(join(ROOT, d)).filter((f) => f.endsWith('.md')).map((f) => `${d}/${f}`)
      : []);
  return [...files, 'README.md'];
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('private names never appear in public content', (t) => {
  const listPath = join(ROOT, '.private-names');
  if (!existsSync(listPath)) return t.skip('no local .private-names denylist');
  const terms = readFileSync(listPath, 'utf8').split('\n')
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  assert.ok(terms.length > 0, '.private-names is empty');
  const hits = [];
  for (const f of contentFiles()) {
    const text = read(f);
    for (const term of terms)
      if (new RegExp(`\\b${escape(term)}\\b`, 'i').test(text)) hits.push(`${f}: ${term}`);
  }
  assert.deepEqual(hits, []);
});

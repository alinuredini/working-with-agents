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

const REPO_URL = 'https://github.com/alinuredini/working-with-agents/blob/main/';

test('DESIGN template carries the universal rules and keeps its markers', () => {
  const t = read('templates/DESIGN.md');
  assert.match(t, /^## Universal rules$/m);
  for (const rule of [/eyebrow/i, /one-sided/i, /gradient text/i, /identical icon cards/i, /loud/i, /normal-width/i])
    assert.match(t, rule);
  assert.match(t, /Read my design system from this repo/);
  assert.match(t, /<path to your globals\.css \/ @theme block>/);
  assert.match(t, /<!-- wa:fill:designsource -->/);
  assert.ok(t.includes(`${REPO_URL}looks/`), 'must link the looks folder absolutely');
});

test('AGENTS template points at STACK.md and keeps its markers', () => {
  const t = read('templates/AGENTS.md');
  assert.match(t, /STACK\.md/);
  for (const m of ['<!-- wa:fill:overview -->', '<!-- wa:fill:commands -->', '<!-- wa:optional:design -->'])
    assert.ok(t.includes(m), `missing ${m}`);
});

test('STACK template asks the five questions and makes the agent wait', () => {
  const t = read('templates/STACK.md');
  for (const h of [/What are you building/i, /time/i, /money/i, /upkeep/i, /special needs/i]) assert.match(t, h);
  assert.match(t, /^## Rules for whoever picks the stack$/m);
  for (const r of [/preview/i, /build settings/i, /static/i, /pin/i, /migration/i]) assert.match(t, r);
  assert.match(t, /propose 2.{1,3}3 stacks/i);
  assert.match(t, /wait/i);
});

test('first prompt reads the three docs, plans first, mocks before code', () => {
  const t = read('templates/first-prompt.md');
  for (const f of ['AGENTS.md', 'DESIGN.md', 'STACK.md']) assert.ok(t.includes(f), `missing ${f}`);
  assert.match(t, /wait/i);
  assert.match(t, /HTML mock/i);
});

test('templates never use relative links to repo-only content', () => {
  for (const f of ['templates/DESIGN.md', 'templates/AGENTS.md', 'templates/STACK.md', 'templates/first-prompt.md']) {
    const rel = [...read(f).matchAll(/\]\((?!https?:|#)([^)]+)\)/g)].map((m) => m[1]);
    assert.deepEqual(rel, [], `${f} has relative links`);
  }
});

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

const LOOKS = ['ink-and-paper', 'editorial', 'soft-pastel', 'calm-enterprise', 'friendly-bold', 'atelier'];
const TOKENS = ['--canvas', '--surface', '--ink', '--muted', '--hairline', '--accent', '--on-accent', '--loud', '--radius', '--shadow'];
const LOOK_SECTIONS = ['## Fits', '## Tokens', '## Type', '## Component rules', '## What would break this look', '## Dark mode'];

function tokensOf(md) {
  const css = md.match(/```css\n([\s\S]*?)```/);
  assert.ok(css, 'no css block');
  return Object.fromEntries([...css[1].matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

function luminance(hex) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('contrast helper matches known WCAG values', () => {
  assert.equal(Math.round(contrast('#000000', '#ffffff') * 10) / 10, 21);
  assert.ok(contrast('#ffffff', '#ff5a1f') < 4.5); // the trap this guard exists for
});

for (const slug of LOOKS) {
  test(`look ${slug}: sections, tokens, universal-rules link`, () => {
    const md = read(`looks/${slug}.md`);
    for (const s of LOOK_SECTIONS) assert.ok(md.includes(s), `missing ${s}`);
    const tk = tokensOf(md);
    for (const name of TOKENS) assert.ok(tk[name], `missing ${name}`);
    assert.match(md, /templates\/DESIGN\.md#universal-rules/);
  });

  test(`look ${slug}: text pairs pass 4.5:1`, () => {
    const tk = tokensOf(read(`looks/${slug}.md`));
    const pairs = [['--ink', '--canvas'], ['--muted', '--canvas'], ['--ink', '--surface'],
                   ['--on-accent', '--accent'], ['--on-accent', '--loud']];
    for (const [fg, bg] of pairs) {
      const c = contrast(tk[fg], tk[bg]);
      assert.ok(c >= 4.5, `${fg} on ${bg} = ${c.toFixed(2)}`);
    }
  });
}

test('examples/DESIGN.md points at the Ink & Paper look', () => {
  assert.match(read('examples/DESIGN.md'), /looks\/ink-and-paper\.md/);
});

const PLAYBOOK_SECTIONS = ['## The short version', '## Why', '## Paste this to your agent', '## Traps we hit'];

function checkPlaybook(rel) {
  const md = read(rel);
  let last = -1;
  for (const s of PLAYBOOK_SECTIONS) {
    const i = md.indexOf(s);
    assert.ok(i > last, `${rel}: "${s}" missing or out of order`);
    last = i;
  }
  const short = md.slice(md.indexOf('## The short version'), md.indexOf('## Why'));
  const bullets = short.split('\n').filter((l) => /^[-*] /.test(l)).length;
  assert.ok(bullets >= 3 && bullets <= 5, `${rel}: short version has ${bullets} bullets (want 3–5)`);
  const prompt = md.slice(md.indexOf('## Paste this to your agent'), md.indexOf('## Traps we hit'));
  assert.match(prompt, /```text\n[\s\S]+?```/, `${rel}: prompt must be a fenced text block`);
  return md;
}

test('playbook: ui-that-doesnt-look-ai', () => {
  const md = checkPlaybook('playbooks/ui-that-doesnt-look-ai.md');
  for (const r of [/eyebrow/i, /one-sided/i, /gradient text/i, /identical icon cards/i, /loud accent/i, /\(i\)/])
    assert.match(md, r);
  for (const slug of LOOKS) assert.ok(md.includes(`../looks/${slug}.md`), `missing link to ${slug}`);
});

test('playbook: mockup-to-build', () => {
  const md = checkPlaybook('playbooks/mockup-to-build.md');
  for (const r of [/Figma/, /Claude Design/, /HTML mock/i, /founder/i, /designer/i, /fictional/i, /light\/dark/i])
    assert.match(md, r);
  assert.ok(md.includes('../looks/'), 'founders start from a look — must link looks/');
});

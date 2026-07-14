import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init } from '../src/init.js';
import { runSkillSetup, TOOL_CHOICES } from '../src/init.js';
import { mkdirSync as mkdir2, writeFileSync as wf2, readFileSync as rf2, existsSync as ex2 } from 'node:fs';

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

  const designOut = readFileSync(join(dir, 'DESIGN.md'), 'utf8');
  assert.match(designOut, /\n\n\| Token \| Value/); // blank line before token table (GitHub needs it)
  assert.match(agents, /^# AGENTS\.md/);             // AGENTS.md starts at the H1, no leading blank line

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

function fakeHomeForInit() { // mirrors skills fixture
  const home = mkdtempSync(join(tmpdir(), 'wa-ihome-'));
  const c = join(home, '.claude');
  const w = (rel, obj) => { const p = join(c, rel); mkdir2(join(p, '..'), { recursive: true }); wf2(p, typeof obj === 'string' ? obj : JSON.stringify(obj)); };
  w('settings.json', { enabledPlugins: { 'ponytail@ponytail': true }, extraKnownMarketplaces: { ponytail: { source: { source: 'github', repo: 'DietrichGebert/ponytail' } } } });
  w('plugins/known_marketplaces.json', { ponytail: { source: { source: 'github', repo: 'DietrichGebert/ponytail' } } });
  w('plugins/marketplaces/ponytail/.claude-plugin/marketplace.json', { plugins: [{ name: 'ponytail', source: './' }] });
  return home;
}

test('init: bare --yes skips the skills step (no .claude/settings.json)', async () => {
  const dir = repo(); // existing helper: package.json + components.json
  await init({ dir, yes: true, home: fakeHomeForInit() });
  assert.equal(ex2(join(dir, '.claude', 'settings.json')), false);
});

test('init: --install-skills (claude) writes merged .claude/settings.json', async () => {
  const dir = repo();
  await init({ dir, yes: true, installSkills: true, home: fakeHomeForInit(), log: () => {} });
  const s = JSON.parse(rf2(join(dir, '.claude', 'settings.json'), 'utf8'));
  assert.equal(s.enabledPlugins['ponytail@ponytail'], true);
  assert.ok(s.extraKnownMarketplaces.ponytail);
});

test('runSkillSetup: installer runs when binary present, prints when absent', async () => {
  const home = fakeHomeForInit();
  const dir = mkdtempSync(join(tmpdir(), 'wa-run-'));
  const calls = []; const logs = [];
  const selected = [{ plugin: 'ponytail', marketplace: 'ponytail' }];
  // present
  runSkillSetup({ home, repoDir: dir, tool: 'antigravity', selectedPlugins: selected, selectedLocalSkills: [], which: () => true, exec: (argv) => calls.push(argv), log: (m) => logs.push(m) });
  assert.deepEqual(calls[0], ['agy', 'plugin', 'install', 'https://github.com/DietrichGebert/ponytail']);
  // absent
  calls.length = 0;
  runSkillSetup({ home, repoDir: dir, tool: 'antigravity', selectedPlugins: selected, selectedLocalSkills: [], which: () => false, exec: (argv) => calls.push(argv), log: (m) => logs.push(m) });
  assert.equal(calls.length, 0);
  assert.ok(logs.some((m) => /agy plugin install/.test(m)));
});

test('TOOL_CHOICES offers Pi and Gemini so installer tools are reachable', () => {
  const vals = TOOL_CHOICES.map((c) => c.value);
  assert.ok(vals.includes('pi'));
  assert.ok(vals.includes('gemini'));
});

test('runSkillSetup: gemini runs the gemini installer when present', () => {
  const home = fakeHomeForInit();
  const dir = mkdtempSync(join(tmpdir(), 'wa-gem-'));
  const calls = [];
  runSkillSetup({ home, repoDir: dir, tool: 'gemini', selectedPlugins: [{ plugin: 'ponytail', marketplace: 'ponytail' }], selectedLocalSkills: [], which: () => true, exec: (argv) => calls.push(argv), log: () => {} });
  assert.deepEqual(calls[0], ['gemini', 'extensions', 'install', 'https://github.com/DietrichGebert/ponytail']);
});

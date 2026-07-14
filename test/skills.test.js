import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readGlobalClaudeConfig, readKnownMarketplaces, listLocalSkills, resolveSkillRepo, commandExists } from '../src/skills.js';

// Build a fake ~/.claude home
export function fakeHome() {
  const home = mkdtempSync(join(tmpdir(), 'wa-home-'));
  const c = join(home, '.claude');
  const write = (rel, obj) => { const p = join(c, rel); mkdirSync(join(p, '..'), { recursive: true }); writeFileSync(p, typeof obj === 'string' ? obj : JSON.stringify(obj)); };
  write('settings.json', {
    enabledPlugins: { 'superpowers@claude-plugins-official': true, 'ponytail@ponytail': true },
    extraKnownMarketplaces: { ponytail: { source: { source: 'github', repo: 'DietrichGebert/ponytail' } } },
  });
  write('plugins/known_marketplaces.json', {
    'claude-plugins-official': { source: { source: 'github', repo: 'anthropics/claude-plugins-official' } },
    ponytail: { source: { source: 'github', repo: 'DietrichGebert/ponytail' } },
  });
  write('plugins/marketplaces/claude-plugins-official/.claude-plugin/marketplace.json', {
    plugins: [{ name: 'superpowers', source: { source: 'url', url: 'https://github.com/obra/superpowers.git' } }],
  });
  write('plugins/marketplaces/ponytail/.claude-plugin/marketplace.json', {
    plugins: [{ name: 'ponytail', source: './' }],
  });
  write('skills/impeccable/SKILL.md', '# impeccable');
  mkdirSync(join(c, 'skills', 'not-a-skill'), { recursive: true }); // no SKILL.md
  return home;
}

test('readGlobalClaudeConfig reads enabledPlugins + marketplaces', () => {
  const cfg = readGlobalClaudeConfig(fakeHome());
  assert.equal(cfg.enabledPlugins['superpowers@claude-plugins-official'], true);
  assert.ok(cfg.extraKnownMarketplaces.ponytail);
});

test('readGlobalClaudeConfig is safe on missing home', () => {
  const cfg = readGlobalClaudeConfig(join(tmpdir(), 'nope-' + Math.random().toString(36).slice(2)));
  assert.deepEqual(cfg, { enabledPlugins: {}, extraKnownMarketplaces: {} });
});

test('listLocalSkills returns only dirs with SKILL.md', () => {
  const skills = listLocalSkills(fakeHome());
  assert.deepEqual(skills.map((s) => s.name), ['impeccable']);
});

test('resolveSkillRepo: url source -> owner/repo', () => {
  assert.equal(resolveSkillRepo(fakeHome(), 'superpowers', 'claude-plugins-official'), 'obra/superpowers');
});

test('resolveSkillRepo: relative source -> marketplace repo', () => {
  assert.equal(resolveSkillRepo(fakeHome(), 'ponytail', 'ponytail'), 'DietrichGebert/ponytail');
});

test('resolveSkillRepo: unknown -> null', () => {
  assert.equal(resolveSkillRepo(fakeHome(), 'ghost', 'ponytail'), null);
});

test('commandExists finds a binary on a fake PATH', () => {
  const home = fakeHome();
  const bindir = join(home, 'bin'); mkdirSync(bindir, { recursive: true }); writeFileSync(join(bindir, 'agy'), '');
  assert.equal(commandExists('agy', bindir), true);
  assert.equal(commandExists('nope', bindir), false);
});

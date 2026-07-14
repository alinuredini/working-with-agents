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

import { buildProjectSettings, mergeProjectSettings, installCommand, vendorSkill, enabledPluginList, planSkillSetup } from '../src/skills.js';
import { existsSync, readFileSync, mkdtempSync as mkd } from 'node:fs';

test('buildProjectSettings keys plugins and omits official marketplace', () => {
  const km = { ponytail: { source: { source: 'github', repo: 'DietrichGebert/ponytail' } } };
  const s = buildProjectSettings([
    { plugin: 'superpowers', marketplace: 'claude-plugins-official' },
    { plugin: 'ponytail', marketplace: 'ponytail' },
  ], km);
  assert.equal(s.enabledPlugins['superpowers@claude-plugins-official'], true);
  assert.equal(s.enabledPlugins['ponytail@ponytail'], true);
  assert.ok(s.extraKnownMarketplaces.ponytail);
  assert.ok(!s.extraKnownMarketplaces['claude-plugins-official']);
});

test('mergeProjectSettings preserves existing keys, merges plugins', () => {
  const existing = { permissions: { allow: ['x'] }, enabledPlugins: { 'a@m': true } };
  const merged = mergeProjectSettings(existing, { enabledPlugins: { 'b@m': true } });
  assert.deepEqual(merged.permissions, { allow: ['x'] });
  assert.equal(merged.enabledPlugins['a@m'], true);
  assert.equal(merged.enabledPlugins['b@m'], true);
});

test('installCommand builds correct argv per tool', () => {
  assert.deepEqual(installCommand('antigravity', 'o/r'), ['agy', 'plugin', 'install', 'https://github.com/o/r']);
  assert.deepEqual(installCommand('pi', 'o/r'), ['pi', 'install', 'git:github.com/o/r']);
  assert.deepEqual(installCommand('gemini', 'o/r'), ['gemini', 'extensions', 'install', 'https://github.com/o/r']);
  assert.deepEqual(installCommand('codex', 'o/r'), ['codex', 'plugin', 'marketplace', 'add', 'o/r']);
  assert.equal(installCommand('claude', 'o/r'), null);
  assert.equal(installCommand('cursor', 'o/r'), null);
});

test('enabledPluginList splits plugin@marketplace', () => {
  const list = enabledPluginList({ enabledPlugins: { 'superpowers@claude-plugins-official': true, 'off@m': false } });
  assert.deepEqual(list, [{ plugin: 'superpowers', marketplace: 'claude-plugins-official' }]);
});

test('vendorSkill copies tree and skips existing without force', () => {
  const home = fakeHome();
  const repo = mkd(join(tmpdir(), 'wa-vend-'));
  const r1 = vendorSkill(home, repo, 'impeccable', {});
  assert.equal(r1.vendored, true);
  assert.ok(existsSync(join(repo, '.claude', 'skills', 'impeccable', 'SKILL.md')));
  const r2 = vendorSkill(home, repo, 'impeccable', {});
  assert.equal(r2.vendored, false);
  assert.equal(r2.reason, 'exists');
});

test('planSkillSetup: claude → settings + vendor, no commands', () => {
  const home = fakeHome();
  const plan = planSkillSetup({ home, tool: 'claude', selectedPlugins: enabledPluginList(readGlobalClaudeConfig(home)), selectedLocalSkills: ['impeccable'] });
  assert.ok(plan.settings.enabledPlugins['superpowers@claude-plugins-official']);
  assert.deepEqual(plan.vendor, ['impeccable']);
  assert.equal(plan.commands.length, 0);
});

test('planSkillSetup: antigravity → resolved install commands', () => {
  const home = fakeHome();
  const plan = planSkillSetup({ home, tool: 'antigravity', selectedPlugins: enabledPluginList(readGlobalClaudeConfig(home)), selectedLocalSkills: ['impeccable'] });
  const repos = plan.commands.map((c) => c.repo).sort();
  assert.deepEqual(repos, ['DietrichGebert/ponytail', 'obra/superpowers']);
  assert.deepEqual(plan.commands.find((c) => c.repo === 'obra/superpowers').argv, ['agy', 'plugin', 'install', 'https://github.com/obra/superpowers']);
  assert.ok(plan.notes.some((n) => /Local skills/.test(n))); // local skills note for non-claude
});

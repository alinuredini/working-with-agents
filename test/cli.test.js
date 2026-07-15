import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from '../bin/cli.js';

const CLI = resolve('bin/cli.js');

test('parseArgs reads flags and subcommand', () => {
  const a = parseArgs(['init', '--yes', '--force', '--dir', '/tmp/x']);
  assert.equal(a._[0], 'init');
  assert.equal(a.yes, true);
  assert.equal(a.force, true);
  assert.equal(a.dir, '/tmp/x');
});

test('--version prints version', () => {
  const out = execFileSync('node', [CLI, '--version'], { encoding: 'utf8' });
  assert.match(out.trim(), /^\d+\.\d+\.\d+$/);
});

test('init --yes creates files in target dir', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wa-cli-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ description: 'x', scripts: { dev: 'vite' } }));
  execFileSync('node', [CLI, 'init', '--yes', '--dir', dir], { encoding: 'utf8' });
  assert.ok(existsSync(join(dir, 'AGENTS.md')));
  assert.ok(existsSync(join(dir, 'CLAUDE.md')));
});

test('unknown command exits non-zero', () => {
  assert.throws(() => execFileSync('node', [CLI, 'bogus'], { encoding: 'utf8', stdio: 'pipe' }));
});

test('parseArgs reads --install-skills and --no-skills', () => {
  const a = parseArgs(['init', '--install-skills']);
  assert.equal(a.installSkills, true);
  assert.equal(a.noSkills, false);
  const b = parseArgs(['init', '--no-skills']);
  assert.equal(b.noSkills, true);
});

test('cli: quitting the confirm writes nothing and exits 0', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wa-cliq-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'x' }));
  const out = execFileSync('node', [CLI, 'init', '--dir', dir], { input: 'q\n', encoding: 'utf8' });
  assert.equal(existsSync(join(dir, 'AGENTS.md')), false);
  assert.match(out, /Cancelled/);
  assert.doesNotMatch(out, /Next:/);
});

test('cli: Enter accepts the summary and scaffolds', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wa-clia-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'x', scripts: { dev: 'vite' } }));
  execFileSync('node', [CLI, 'init', '--dir', dir, '--no-skills'], { input: '\n', encoding: 'utf8' });
  assert.ok(existsSync(join(dir, 'AGENTS.md')));
});

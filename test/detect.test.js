import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detect, runScript } from '../src/detect.js';
import { basename } from 'node:path';
import { detectFramework, detectLanguage, synthesizeOverview } from '../src/detect.js';

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
  assert.equal(d.overview, basename(dir));
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

test('detectPackageManager drives dev/build command per lockfile', () => {
  const pnpm = fixture({ 'package.json': JSON.stringify({ scripts: { dev: 'vite' } }), 'pnpm-lock.yaml': '' });
  assert.equal(detect(pnpm).dev, 'pnpm dev');
  const yarn = fixture({ 'package.json': JSON.stringify({ scripts: { dev: 'vite' } }), 'yarn.lock': '' });
  assert.equal(detect(yarn).dev, 'yarn dev');
  const bun = fixture({ 'package.json': JSON.stringify({ scripts: { build: 'x' } }), 'bun.lockb': '' });
  assert.equal(detect(bun).build, 'bun run build');
});

test('tool detection: cursor and codex branches', () => {
  const cur = fixture({ '.cursor/rules/agents.mdc': '' });
  assert.equal(detect(cur).tool, 'cursor');
  const cdx = fixture({ 'AGENTS.md': '# a' });
  assert.equal(detect(cdx).tool, 'codex');
});

test('name: package.json name, else dir basename', () => {
  assert.equal(detect(fixture({ 'package.json': JSON.stringify({ name: 'coolpkg' }) })).name, 'coolpkg');
  const d = fixture({ 'package.json': '{}' });
  assert.equal(detect(d).name, basename(d));
});

test('detectFramework: priority + fallback', () => {
  assert.equal(detectFramework({ next: '1', react: '1' }), 'Next.js');
  assert.equal(detectFramework({ '@sveltejs/kit': '1', svelte: '1' }), 'SvelteKit');
  assert.equal(detectFramework({ react: '1' }), 'React');
  assert.equal(detectFramework({ vite: '1' }), 'Vite');
  assert.equal(detectFramework({}), '');
});

test('detectLanguage: tsconfig/ts dep → TypeScript, else JS, else empty', () => {
  const ts = fixture({ 'package.json': '{}', 'tsconfig.json': '{}' });
  assert.equal(detectLanguage(ts, {}), 'TypeScript');
  assert.equal(detectLanguage(fixture({ 'package.json': '{}' }), { typescript: '5' }), 'TypeScript');
  assert.equal(detectLanguage(fixture({ 'package.json': '{}' }), {}), 'JavaScript');
  assert.equal(detectLanguage(fixture({}), {}), '');
});

test('synthesizeOverview', () => {
  assert.equal(synthesizeOverview('acme', 'Next.js', 'TypeScript'), 'acme — a Next.js + TypeScript project');
  assert.equal(synthesizeOverview('acme', '', ''), 'acme');
  assert.equal(synthesizeOverview('', 'Next.js', 'TypeScript'), '');
});

test('overview prefers description, else synthesized', () => {
  assert.equal(detect(fixture({ 'package.json': JSON.stringify({ name: 'a', description: 'Real desc', dependencies: { next: '1' } }) })).overview, 'Real desc');
  assert.equal(detect(fixture({ 'package.json': JSON.stringify({ name: 'acme', dependencies: { next: '1' }, devDependencies: { typescript: '5' } }) })).overview, 'acme — a Next.js + TypeScript project');
});

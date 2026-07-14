import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applyAgentsFills, applyDesignFills, writeTarget, wireTool } from '../src/scaffold.js';

const AGENTS = `<!--
leading authoring guidance — should be stripped
-->

# AGENTS.md

## Overview

<!-- guidance -->

<!-- wa:fill:overview -->
> Example: "Acme is a React app. There
> is no local backend."

## Run / test / build

<!-- wa:fill:commands -->
\`\`\`bash
<cmd> dev      # start
<cmd> test     # test
<cmd> build    # build
\`\`\`

## Cross-cutting rules

- Security first.
- UI / design work — follow \`DESIGN.md\`; delete if no UI. <!-- wa:optional:design -->
`;

test('applyAgentsFills fills overview + commands, keeps design, strips markers', () => {
  const out = applyAgentsFills(AGENTS, {
    overview: 'My project overview.', dev: 'npm run dev', test: 'npm run test', build: 'npm run build', design: true,
  });
  assert.match(out, /My project overview\./);
  assert.doesNotMatch(out, /Example: "Acme/);
  assert.match(out, /npm run dev/);
  assert.match(out, /npm run build/);
  assert.match(out, /UI \/ design work/);         // kept
  assert.doesNotMatch(out, /wa:/);                // no markers survive
  assert.doesNotMatch(out, /leading authoring guidance/); // leading block stripped
});

test('applyAgentsFills removes design bullet when design=false', () => {
  const out = applyAgentsFills(AGENTS, { overview: '', dev: '', test: '', build: '', design: false });
  assert.doesNotMatch(out, /UI \/ design work/);
  assert.doesNotMatch(out, /wa:/);
});

test('applyDesignFills injects source path and strips marker', () => {
  const tpl = 'Source of truth: `<path to your globals.css / @theme block>` <!-- wa:fill:designsource -->\n';
  const out = applyDesignFills(tpl, { designSource: 'src/index.css' });
  assert.match(out, /Source of truth: `src\/index\.css`/);
  assert.doesNotMatch(out, /wa:/);
});

test('writeTarget skips existing without force', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wa-write-'));
  const p = join(dir, 'AGENTS.md');
  writeFileSync(p, 'original');
  const r1 = writeTarget(p, 'new', { force: false });
  assert.equal(r1.written, false);
  assert.equal(readFileSync(p, 'utf8'), 'original');
  const r2 = writeTarget(p, 'new', { force: true });
  assert.equal(r2.written, true);
  assert.equal(readFileSync(p, 'utf8'), 'new');
});

test('wireTool writes CLAUDE.md and cursor rule', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wa-wire-'));
  const c = wireTool(dir, 'claude', {});
  assert.equal(c.written, true);
  assert.match(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), /@AGENTS\.md/);
  const cur = wireTool(dir, 'cursor', {});
  assert.ok(existsSync(join(dir, '.cursor/rules/agents.mdc')));
  const other = wireTool(dir, 'codex', {});
  assert.equal(other.file, null);
  assert.match(other.note, /natively/);
});

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function readJSON(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

export function detectPackageManager(dir) {
  if (existsSync(join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(dir, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(dir, 'bun.lockb'))) return 'bun';
  return 'npm';
}

export function runScript(pm, script) {
  if (pm === 'pnpm') return `pnpm ${script}`;
  if (pm === 'yarn') return `yarn ${script}`;
  if (pm === 'bun') return `bun run ${script}`;
  return `npm run ${script}`;
}

export function detect(dir) {
  const pkg = readJSON(join(dir, 'package.json')) || {};
  const scripts = pkg.scripts || {};
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const pm = detectPackageManager(dir);

  const dev = scripts.dev ? runScript(pm, 'dev') : (scripts.start ? runScript(pm, 'start') : '');
  const test = scripts.test ? runScript(pm, 'test') : '';
  const build = scripts.build ? runScript(pm, 'build') : '';

  const design = existsSync(join(dir, 'components.json')) || 'tailwindcss' in deps;

  const designSource = [
    'src/app/globals.css', 'app/globals.css', 'src/styles/globals.css', 'src/index.css',
  ].find((p) => existsSync(join(dir, p))) || '';

  let tool = 'claude';
  if (existsSync(join(dir, 'CLAUDE.md'))) tool = 'claude';
  else if (existsSync(join(dir, '.cursor'))) tool = 'cursor';
  else if (existsSync(join(dir, 'AGENTS.md'))) tool = 'codex';

  return {
    overview: pkg.description || '',
    dev, test, build,
    design, designSource, tool,
    existing: {
      agents: existsSync(join(dir, 'AGENTS.md')),
      design: existsSync(join(dir, 'DESIGN.md')),
      claude: existsSync(join(dir, 'CLAUDE.md')),
      cursor: existsSync(join(dir, '.cursor/rules/agents.mdc')),
    },
  };
}

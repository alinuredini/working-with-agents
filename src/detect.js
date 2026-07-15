import { existsSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

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

const FRAMEWORKS = [
  ['next', 'Next.js'], ['nuxt', 'Nuxt'], ['@sveltejs/kit', 'SvelteKit'],
  ['astro', 'Astro'], ['@remix-run/react', 'Remix'], ['remix', 'Remix'],
  ['@nestjs/core', 'NestJS'], ['vue', 'Vue'], ['svelte', 'Svelte'],
  ['react', 'React'], ['vite', 'Vite'], ['express', 'Express'],
];

export function detectFramework(deps = {}) {
  for (const [dep, label] of FRAMEWORKS) if (dep in deps) return label;
  return '';
}

export function detectLanguage(dir, deps = {}) {
  if (existsSync(join(dir, 'tsconfig.json')) || 'typescript' in deps) return 'TypeScript';
  if (existsSync(join(dir, 'package.json'))) return 'JavaScript';
  return '';
}

export function synthesizeOverview(name, framework, language) {
  if (!name) return '';
  const bits = [framework, language].filter(Boolean);
  return bits.length ? `${name} — a ${bits.join(' + ')} project` : name;
}

export function detect(dir) {
  const pkg = readJSON(join(dir, 'package.json')) || {};
  const scripts = pkg.scripts || {};
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const pm = detectPackageManager(dir);

  const dev = scripts.dev ? runScript(pm, 'dev') : (scripts.start ? runScript(pm, 'start') : '');
  const test = scripts.test ? runScript(pm, 'test') : '';
  const build = scripts.build ? runScript(pm, 'build') : '';

  const name = pkg.name || basename(dir);
  const framework = detectFramework(deps);
  const language = detectLanguage(dir, deps);
  const overview = pkg.description || synthesizeOverview(name, framework, language);

  const design = existsSync(join(dir, 'components.json')) || 'tailwindcss' in deps;
  const designSource = [
    'src/app/globals.css', 'app/globals.css', 'src/styles/globals.css', 'src/index.css',
  ].find((p) => existsSync(join(dir, p))) || '';

  let tool = 'claude';
  if (existsSync(join(dir, 'CLAUDE.md'))) tool = 'claude';
  else if (existsSync(join(dir, '.cursor'))) tool = 'cursor';
  else if (existsSync(join(dir, 'AGENTS.md'))) tool = 'codex';

  return {
    name, overview, framework, language, packageManager: pm,
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

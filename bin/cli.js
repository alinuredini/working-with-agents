#!/usr/bin/env node
import { readFileSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { init } from '../src/init.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(HERE, '..', 'package.json'), 'utf8'));

const HELP = `working-with-agents — onboard coding agents like a senior hire

Usage:
  npx working-with-agents init [--force] [--yes] [--dir <path>]

Options:
  --yes, -y      Accept detected defaults (non-interactive)
  --force        Overwrite existing files
  --dir <path>   Target directory (default: current directory)
  --help, -h     Show this help
  --version, -v  Show version
`;

export function parseArgs(argv) {
  const args = { _: [], force: false, yes: false, dir: undefined, help: false, version: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') args.force = true;
    else if (a === '--yes' || a === '-y') args.yes = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--version' || a === '-v') args.version = true;
    else if (a === '--dir') args.dir = argv[++i];
    else args._.push(a);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.version) { console.log(pkg.version); return 0; }
  if (args.help) { console.log(HELP); return 0; }
  if (args._[0] !== 'init') { console.error(HELP); return 1; }

  console.log('Onboarding this repo…\n');
  const { results } = await init({ dir: args.dir || process.cwd(), yes: args.yes, force: args.force });
  for (const r of results) {
    if (r.written) console.log(`  created ${r.file}`);
    else if (r.reason === 'exists') console.log(`  skipped ${r.file} (exists; --force to overwrite)`);
    else if (r.note) console.log(`  ${r.note}`);
  }
  console.log('\nNext: fill the AGENTS.md blanks. For DESIGN.md, paste the recipe at its top to your agent.');
  return 0;
}

// Run main() only when executed directly. realpathSync resolves the npm/npx
// `.bin` symlink so this still matches when invoked via `npx working-with-agents`.
function isMain() {
  try {
    return !!process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch { return false; }
}

if (isMain()) {
  main().then((code) => process.exit(code)).catch((err) => { console.error(err.message); process.exit(1); });
}

import * as readline from 'node:readline/promises';

export function resolveText(ans, def) {
  return (ans ?? '').trim() || def;
}

export function parseConfirm(ans, def) {
  const a = (ans ?? '').trim().toLowerCase();
  if (!a) return def;
  return a === 'y' || a === 'yes';
}

export function parseSelect(ans, choices, defaultIndex) {
  const raw = (ans ?? '').trim();
  const n = raw ? parseInt(raw, 10) : defaultIndex + 1;
  const idx = Number.isInteger(n) && n >= 1 && n <= choices.length ? n - 1 : defaultIndex;
  return choices[idx].value;
}

export function parseMultiselect(ans, choices, defaultSelected = []) {
  const raw = (ans ?? '').trim();
  if (!raw) return defaultSelected.slice();
  const low = raw.toLowerCase();
  if (low === 'none') return [];
  if (low === 'all' || raw === '*') return choices.map((c) => c.value);
  const idxs = raw.split(/[\s,]+/).map((s) => parseInt(s, 10)).filter((n) => Number.isInteger(n) && n >= 1 && n <= choices.length);
  return idxs.map((n) => choices[n - 1].value);
}

export function createPrompter(input = process.stdin, output = process.stdout) {
  const rl = readline.createInterface({ input, output });
  return {
    async text(question, def = '') {
      const hint = def ? ` (${def})` : '';
      return resolveText(await rl.question(`${question}${hint}: `), def);
    },
    async confirm(question, def = false) {
      const hint = def ? ' (Y/n)' : ' (y/N)';
      return parseConfirm(await rl.question(`${question}${hint} `), def);
    },
    async select(question, choices, defaultIndex = 0) {
      output.write(`${question}\n`);
      choices.forEach((c, i) => output.write(`  ${i + 1}) ${c.label}${i === defaultIndex ? ' (default)' : ''}\n`));
      return parseSelect(await rl.question(`Choose 1-${choices.length} (${defaultIndex + 1}): `), choices, defaultIndex);
    },
    async multiselect(question, choices, defaultSelected = []) {
      output.write(`${question}\n`);
      choices.forEach((c, i) => output.write(`  ${i + 1}) ${c.label}${defaultSelected.includes(c.value) ? ' *' : ''}\n`));
      output.write('(comma-separated numbers, "all", or "none"; empty keeps the * defaults)\n');
      return parseMultiselect(await rl.question('> '), choices, defaultSelected);
    },
    close() { rl.close(); },
  };
}

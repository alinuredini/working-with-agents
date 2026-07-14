import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEMPLATES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates');

export function readTemplate(name) {
  return readFileSync(join(TEMPLATES_DIR, name), 'utf8');
}

function stripLeadingComment(text) {
  const m = text.match(/^\s*<!--[\s\S]*?-->\n*/);
  return m ? text.slice(m[0].length) : text;
}

function stripAllMarkers(text) {
  return text.replace(/[ \t]*<!-- wa:[^>]*-->/g, '');
}

export function applyAgentsFills(text, answers) {
  let out = stripLeadingComment(text);

  if (answers.overview) {
    out = out.replace(/<!-- wa:fill:overview -->\n(?:>.*\n)*/, () => `${answers.overview}\n`);
  } else {
    out = out.replace(/<!-- wa:fill:overview -->\n/, '');
  }

  const cmds = [];
  if (answers.dev) cmds.push(`${answers.dev}      # start it locally`);
  if (answers.test) cmds.push(`${answers.test}      # run tests`);
  if (answers.build) cmds.push(`${answers.build}      # the gate before shipping`);
  if (cmds.length) {
    const block = '```bash\n' + cmds.join('\n') + '\n```';
    out = out.replace(/<!-- wa:fill:commands -->\n```bash\n[\s\S]*?\n```/, () => block);
  } else {
    out = out.replace(/<!-- wa:fill:commands -->\n/, '');
  }

  if (answers.design) {
    out = out.replace(/[ \t]*<!-- wa:optional:design -->/, '');
  } else {
    out = out.replace(/^.*<!-- wa:optional:design -->.*\n/m, '');
  }

  return stripAllMarkers(out);
}

export function applyDesignFills(text, answers) {
  let out = text;
  if (answers.designSource) {
    out = out.replace('<path to your globals.css / @theme block>', () => answers.designSource);
  }
  return stripAllMarkers(out);
}

export function writeTarget(path, content, { force = false } = {}) {
  if (existsSync(path) && !force) return { written: false, reason: 'exists' };
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return { written: true };
}

export function wireTool(dir, tool, { force = false } = {}) {
  if (tool === 'claude') {
    return { file: 'CLAUDE.md', ...writeTarget(join(dir, 'CLAUDE.md'), '# CLAUDE.md\n@AGENTS.md\n', { force }) };
  }
  if (tool === 'cursor') {
    const content = `---\ndescription: Project operating rules\nalwaysApply: true\n---\nFollow the conventions, area map, and gotchas in AGENTS.md at the repo root.\n`;
    return { file: '.cursor/rules/agents.mdc', ...writeTarget(join(dir, '.cursor/rules/agents.mdc'), content, { force }) };
  }
  return { file: null, note: 'reads AGENTS.md natively — you are set' };
}

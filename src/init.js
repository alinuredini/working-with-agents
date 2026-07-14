import { join } from 'node:path';
import { detect } from './detect.js';
import { createPrompter } from './prompts.js';
import { readTemplate, applyAgentsFills, applyDesignFills, writeTarget, wireTool } from './scaffold.js';

export const TOOL_CHOICES = [
  { label: 'Claude Code', value: 'claude' },
  { label: 'Codex', value: 'codex' },
  { label: 'Cursor', value: 'cursor' },
  { label: 'Antigravity', value: 'antigravity' },
  { label: 'Other', value: 'other' },
];

async function ask(defaults, io) {
  const p = createPrompter(io?.input, io?.output);
  try {
    const overview = await p.text('Project one-liner (Overview)', defaults.overview);
    const dev = await p.text('Dev command', defaults.dev);
    const test = await p.text('Test command', defaults.test);
    const build = await p.text('Build command', defaults.build);
    const di = TOOL_CHOICES.findIndex((c) => c.value === defaults.tool);
    const tool = await p.select('Primary agent tool', TOOL_CHOICES, di < 0 ? 0 : di);
    const design = await p.confirm('Include the design chapter (DESIGN.md)?', defaults.design);
    return { overview, dev, test, build, tool, design, designSource: defaults.designSource };
  } finally {
    p.close();
  }
}

export async function init({ dir = process.cwd(), yes = false, force = false, io } = {}) {
  const d = detect(dir);
  const answers = yes
    ? { overview: d.overview, dev: d.dev, test: d.test, build: d.build, tool: d.tool, design: d.design, designSource: d.designSource }
    : await ask(d, io);

  const results = [];

  const agents = applyAgentsFills(readTemplate('AGENTS.md'), answers);
  results.push({ file: 'AGENTS.md', ...writeTarget(join(dir, 'AGENTS.md'), agents, { force }) });

  if (answers.design) {
    const design = applyDesignFills(readTemplate('DESIGN.md'), answers);
    results.push({ file: 'DESIGN.md', ...writeTarget(join(dir, 'DESIGN.md'), design, { force }) });
  }

  results.push(wireTool(dir, answers.tool, { force }));

  return { answers, results };
}

import { join } from 'node:path';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { detect } from './detect.js';
import { createPrompter } from './prompts.js';
import { readTemplate, applyAgentsFills, applyDesignFills, writeTarget, wireTool } from './scaffold.js';
import { readGlobalClaudeConfig, listLocalSkills, enabledPluginList, planSkillSetup, mergeProjectSettings, vendorSkill, commandExists } from './skills.js';

export const TOOL_CHOICES = [
  { label: 'Claude Code', value: 'claude' },
  { label: 'Codex', value: 'codex' },
  { label: 'Cursor', value: 'cursor' },
  { label: 'Antigravity', value: 'antigravity' },
  { label: 'Pi', value: 'pi' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Other', value: 'other' },
];

const TOOL_LABEL = Object.fromEntries(TOOL_CHOICES.map((c) => [c.value, c.label]));

function readJSONSafe(path) { try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; } }
function defaultExec(argv) { execFileSync(argv[0], argv.slice(1), { stdio: 'inherit' }); }

function pick(d) {
  return { overview: d.overview, dev: d.dev, test: d.test, build: d.build, tool: d.tool, design: d.design, designSource: d.designSource };
}

export function formatSummary(d) {
  const or = (v) => (v && String(v).trim() ? v : '—');
  const stack = [d.framework, d.language, d.packageManager].filter(Boolean).join(' · ') || '—';
  const design = d.design
    ? `DESIGN.md${d.designSource ? ` (source: ${d.designSource})` : ' (Tailwind/shadcn detected)'}`
    : 'skip';
  return [
    'Detected this repo:',
    `  Name     ${or(d.name)}`,
    `  Stack    ${stack}`,
    `  Dev      ${or(d.dev)}`,
    `  Test     ${or(d.test)}`,
    `  Build    ${or(d.build)}`,
    `  Tool     ${TOOL_LABEL[d.tool] || d.tool}`,
    `  Design   ${design}`,
  ].join('\n');
}

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
  } finally { p.close(); }
}

export function runSkillSetup({ home = homedir(), repoDir, tool, selectedPlugins = [], selectedLocalSkills = [], force = false, which = commandExists, exec = defaultExec, log = console.log }) {
  const plan = planSkillSetup({ home, tool, selectedPlugins, selectedLocalSkills });
  const out = { settingsWritten: false, vendored: [], ran: [], printed: [], notes: plan.notes };
  if (plan.settings) {
    const p = join(repoDir, '.claude', 'settings.json');
    const merged = mergeProjectSettings(readJSONSafe(p), plan.settings);
    mkdirSync(join(repoDir, '.claude'), { recursive: true });
    writeFileSync(p, JSON.stringify(merged, null, 2) + '\n');
    out.settingsWritten = true;
    log(`  wrote .claude/settings.json (${Object.keys(plan.settings.enabledPlugins).length} plugin(s) declared)`);
  }
  for (const name of plan.vendor) {
    const r = vendorSkill(home, repoDir, name, { force });
    out.vendored.push(r);
    log(r.vendored ? `  vendored .claude/skills/${name}` : `  skipped skill ${name} (${r.reason})`);
  }
  for (const c of plan.commands) {
    if (which(c.argv[0])) {
      log(`  running: ${c.argv.join(' ')}`);
      try { exec(c.argv); out.ran.push({ ...c, ok: true }); }
      catch (e) { log(`  (failed) run manually: ${c.argv.join(' ')}`); out.ran.push({ ...c, ok: false, error: e.message }); }
    } else {
      log(`  to install ${c.plugin}: ${c.argv.join(' ')}`);
      out.printed.push(c);
    }
  }
  for (const n of plan.notes) log(`  note: ${n}`);
  return out;
}

export async function init({ dir = process.cwd(), yes = false, force = false, io, installSkills = false, noSkills = false, home = homedir(), which = commandExists, exec = defaultExec, log = console.log } = {}) {
  const d = detect(dir);
  let answers;
  if (yes) {
    answers = pick(d);
  } else {
    log(formatSummary(d));
    const p = createPrompter(io?.input, io?.output);
    let choice;
    try { choice = await p.choice('\nUse these? [Y]es · [e]dit · [q]uit ›', ['y', 'e', 'q'], 'y'); } finally { p.close(); }
    if (choice === 'q') { log('Cancelled — nothing written.'); return { answers: null, results: [], cancelled: true }; }
    answers = choice === 'e' ? await ask(d, io) : pick(d);
  }

  const results = [];
  const agents = applyAgentsFills(readTemplate('AGENTS.md'), answers);
  results.push({ file: 'AGENTS.md', ...writeTarget(join(dir, 'AGENTS.md'), agents, { force }) });
  if (answers.design) {
    const design = applyDesignFills(readTemplate('DESIGN.md'), answers);
    results.push({ file: 'DESIGN.md', ...writeTarget(join(dir, 'DESIGN.md'), design, { force }) });
  }
  results.push(wireTool(dir, answers.tool, { force }));

  // --- skills step (opt-in) ---
  if (!noSkills) {
    let run = installSkills;
    if (!run && !yes) {
      const p = createPrompter(io?.input, io?.output);
      try { run = await p.confirm('Set up your agent skills for this repo?', false); } finally { p.close(); }
    }
    if (run) {
      const cfg = readGlobalClaudeConfig(home);
      let selectedPlugins = enabledPluginList(cfg);
      let selectedLocalSkills = [];
      if (!yes && !installSkills) {
        const p = createPrompter(io?.input, io?.output);
        try {
          const choices = selectedPlugins.map((s) => ({ label: `${s.plugin}@${s.marketplace}`, value: s }));
          selectedPlugins = await p.multiselect('Which skills to declare for this repo?', choices, selectedPlugins);
          if (answers.tool === 'claude') {
            const localChoices = listLocalSkills(home).map((l) => ({ label: l.name, value: l.name }));
            selectedLocalSkills = await p.multiselect('Vendor which local skills into the repo?', localChoices, []);
          }
        } finally { p.close(); }
      }
      const skills = runSkillSetup({ home, repoDir: dir, tool: answers.tool, selectedPlugins, selectedLocalSkills, force, which, exec, log });
      results.push({ file: '.claude (skills)', skills });
    }
  }

  return { answers, results, cancelled: false };
}

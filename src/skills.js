import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, cpSync } from 'node:fs';
import { join, delimiter, dirname } from 'node:path';
import { homedir } from 'node:os';

function readJSON(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

export function readGlobalClaudeConfig(home = homedir()) {
  const s = readJSON(join(home, '.claude', 'settings.json')) || {};
  return { enabledPlugins: s.enabledPlugins || {}, extraKnownMarketplaces: s.extraKnownMarketplaces || {} };
}

export function readKnownMarketplaces(home = homedir()) {
  return readJSON(join(home, '.claude', 'plugins', 'known_marketplaces.json')) || {};
}

export function listLocalSkills(home = homedir()) {
  const dir = join(home, '.claude', 'skills');
  let names;
  try { names = readdirSync(dir); } catch { return []; }
  const out = [];
  for (const name of names) {
    const p = join(dir, name);
    try { if (statSync(p).isDirectory() && existsSync(join(p, 'SKILL.md'))) out.push({ name, path: p }); } catch { /* skip */ }
  }
  return out;
}

function githubOwnerRepo(url) {
  const m = String(url).match(/github\.com[:/]+([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/#?].*)?$/i);
  return m ? `${m[1]}/${m[2]}` : null;
}

export function resolveSkillRepo(home, plugin, marketplace, deps = {}) {
  const km = deps.knownMarketplaces || readKnownMarketplaces(home);
  const manifest = readJSON(join(home, '.claude', 'plugins', 'marketplaces', marketplace, '.claude-plugin', 'marketplace.json'));
  const entry = manifest && Array.isArray(manifest.plugins) ? manifest.plugins.find((p) => p && p.name === plugin) : null;
  if (!entry) return null;
  const src = entry.source;
  if (src && typeof src === 'object') {
    if (src.source === 'url' && src.url) { const r = githubOwnerRepo(src.url); if (r) return r; }
    if (src.source === 'github' && src.repo) return src.repo;
    return null;
  }
  if (typeof src === 'string') { // relative/self source → plugin lives in the marketplace repo
    const repo = km[marketplace] && km[marketplace].source && km[marketplace].source.repo;
    return repo || null;
  }
  return null;
}

export function commandExists(bin, pathValue = process.env.PATH || '') {
  for (const dir of pathValue.split(delimiter)) {
    if (dir && existsSync(join(dir, bin))) return true;
  }
  return false;
}

const OFFICIAL_MARKETPLACE = 'claude-plugins-official';

export function buildProjectSettings(selected, knownMarketplaces = {}) {
  const enabledPlugins = {};
  const extraKnownMarketplaces = {};
  for (const { plugin, marketplace } of selected) {
    enabledPlugins[`${plugin}@${marketplace}`] = true;
    if (marketplace !== OFFICIAL_MARKETPLACE && knownMarketplaces[marketplace]) {
      extraKnownMarketplaces[marketplace] = { source: knownMarketplaces[marketplace].source };
    }
  }
  const out = { enabledPlugins };
  if (Object.keys(extraKnownMarketplaces).length) out.extraKnownMarketplaces = extraKnownMarketplaces;
  return out;
}

export function mergeProjectSettings(existing, additions) {
  const out = { ...(existing || {}) };
  out.enabledPlugins = { ...((existing && existing.enabledPlugins) || {}), ...(additions.enabledPlugins || {}) };
  if (additions.extraKnownMarketplaces) {
    out.extraKnownMarketplaces = { ...((existing && existing.extraKnownMarketplaces) || {}), ...additions.extraKnownMarketplaces };
  }
  return out;
}

export function installCommand(tool, repo) {
  switch (tool) {
    case 'antigravity': return ['agy', 'plugin', 'install', `https://github.com/${repo}`];
    case 'pi': return ['pi', 'install', `git:github.com/${repo}`];
    case 'gemini': return ['gemini', 'extensions', 'install', `https://github.com/${repo}`];
    case 'codex': return ['codex', 'plugin', 'marketplace', 'add', repo];
    default: return null;
  }
}

export function enabledPluginList(cfg) {
  return Object.entries((cfg && cfg.enabledPlugins) || {})
    .filter(([, on]) => on)
    .map(([key]) => { const at = key.lastIndexOf('@'); return { plugin: key.slice(0, at), marketplace: key.slice(at + 1) }; });
}

export function vendorSkill(home, repoDir, name, { force = false } = {}) {
  const src = join(home, '.claude', 'skills', name);
  const dest = join(repoDir, '.claude', 'skills', name);
  if (!existsSync(src)) return { name, vendored: false, reason: 'not-found' };
  if (existsSync(dest) && !force) return { name, vendored: false, reason: 'exists' };
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  return { name, vendored: true };
}

export function planSkillSetup({ home = homedir(), tool, selectedPlugins = [], selectedLocalSkills = [], knownMarketplaces } = {}) {
  const km = knownMarketplaces || readKnownMarketplaces(home);
  const plan = { settings: null, vendor: [], commands: [], notes: [] };
  if (tool === 'claude') {
    plan.settings = buildProjectSettings(selectedPlugins, km);
    plan.vendor = [...selectedLocalSkills];
    return plan;
  }
  for (const { plugin, marketplace } of selectedPlugins) {
    const repo = resolveSkillRepo(home, plugin, marketplace, { knownMarketplaces: km });
    if (!repo) { plan.notes.push(`Install ${plugin} manually — could not resolve its repo.`); continue; }
    const argv = installCommand(tool, repo);
    if (argv) plan.commands.push({ plugin, repo, argv });
    else plan.notes.push(`${plugin}: your tool reads AGENTS.md; for full rules see https://github.com/${repo}`);
  }
  if (selectedLocalSkills.length) plan.notes.push(`Local skills (${selectedLocalSkills.join(', ')}) are Claude-specific — not applied to ${tool}.`);
  return plan;
}

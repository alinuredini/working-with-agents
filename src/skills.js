import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, delimiter } from 'node:path';
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

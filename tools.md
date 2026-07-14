# Mounting one AGENTS.md into every tool

The goal: keep `AGENTS.md` as the single source of truth and have each tool read
it, instead of maintaining separate config files that drift apart.

| Tool | Config file it looks for | Reads `AGENTS.md`? | Delegation model |
| --- | --- | --- | --- |
| **Codex** | `AGENTS.md` | Yes, natively | — |
| **Antigravity** | `AGENTS.md` / workspace rules | Yes | — |
| **Cursor** | `.cursor/rules/*.mdc` (legacy: `.cursorrules`) | Not by default | — |
| **Claude Code** | `CLAUDE.md` | Via `@` import | sub-agents, skills, hooks |

> Tool behavior changes fast. Verify against each tool's current docs and correct
> this table when it drifts — that's the whole spirit of the guide.

## Claude Code

Keep everything in `AGENTS.md` and make `CLAUDE.md` a one-line import, so there's
no second copy to maintain:

```markdown
# CLAUDE.md
@AGENTS.md
```

Put Claude-Code-only rules (sub-agent routing, skills, hooks) below the import.

## Cursor

Cursor reads rules from `.cursor/rules/`. Point them at `AGENTS.md` rather than
duplicating it. A minimal `.cursor/rules/agents.mdc`:

```markdown
---
description: Project operating rules
alwaysApply: true
---
Follow the conventions, area map, and gotchas in AGENTS.md at the repo root.
```

## Codex / Antigravity

Both read `AGENTS.md` at the repo root directly. Drop the file in — done.

## The one rule

Whatever the tool, don't fork your context. One file is the truth; every other
config points at it. Two sources of truth means one of them is already wrong.

<!--
This file is the agent's onboarding doc. Any coding agent (Codex, Cursor,
Antigravity, Claude Code via a CLAUDE.md import) reads it at the start of a
session. Keep it useful:

- Terse beats thorough. One sharp sentence per point.
- Write what the code does NOT already show: gotchas, the "why", commands.
- Update it in the same change as the code. A stale line is worse than no line.

Delete these comments once you've filled it in.
-->

# AGENTS.md

## Overview

<!-- One paragraph: what this project is, the stack, and anything an agent must
know before touching code. No history, no marketing. -->

<!-- wa:fill:overview -->
> Example: "Acme is a React + TypeScript SPA (Vite) backed by Supabase. There is
> no local backend — only the Vite dev server. Edge functions run on Deno under
> `supabase/functions/`."

## Run / test / build

<!-- The exact commands. Highest-value section in the file: an agent that can run
and verify its own work is worth ten that can't. Flag any command that's a trap
(a no-op, a lie, slower than it looks). -->

<!-- wa:fill:commands -->
```bash
<cmd> dev      # how to start it locally + which port
<cmd> test     # how to run tests
<cmd> build    # the real gate before shipping
```

## How we work

<!-- Your operating rules. Keep the ones that matter; cut the rest. -->

- **Shortest working change wins.** No new abstractions, dependencies, or config
  the task didn't ask for. Prefer deleting code to adding it.
- **Verify before "done".** Run the real command and show the output. No "should
  pass."
- **Name the phase.** Brainstorm / plan / debug / build — say which before writing
  code.
- **Push back.** If the approach is wrong, say so before implementing it.
- **Keep this doc current.** Update the relevant section in the same change as the
  code.

## Area map

<!-- The single biggest time-saver: tell the agent WHERE things are so it routes
instead of grepping blindly. One row per area; link to a deeper doc if you have
one. -->

| Area | Where | Notes |
| --- | --- | --- |
| _Auth_ | `src/auth/`, `docs/auth.md` | _SSO via X; RLS rules in Y_ |
| _Billing_ | `src/billing/` | _webhooks are idempotency-keyed_ |
| _..._ | | |

## Gotchas / footguns

<!-- The traps that cost you (or an agent) real time. This section pays for the
whole file. Be specific: name the file, the symptom, the fix. -->

> Example: "`npm run typecheck` passes on missing-dependency imports that the
> production build fails on. Always run `npm run build` before pushing."
>
> Example: "Migrations do not auto-deploy. Apply the DB change before shipping the
> frontend, or the new endpoint 404s in prod."

## Cross-cutting rules

<!-- Security/RLS, realtime, i18n, deployment — whatever an agent could break
without knowing it exists. Link to the real doc; don't inline it here. -->

- Security / auth changes: read `docs/SECURITY.md` first, run a security review
  after.
- UI / design work — follow `DESIGN.md` (tokens, components, archetypes); delete if no UI. <!-- wa:optional:design -->
- Stack choices and hosting rules — follow `STACK.md`; delete if you don't have one.
- _..._

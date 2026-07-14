# Working with agents

A small, opinionated guide to getting real work out of coding agents — Claude
Code, Codex, Cursor, Antigravity, and whatever ships next.

It is not a list of prompts. Prompts are the least durable thing about working
with an agent. This is about the setup *around* the agent: the written context,
the operating rules, and the feedback loop that separate an agent that guesses
from one that ships.

## The thesis

Stop prompting the agent. **Onboard it like a senior hire.**

A capable agent that keeps producing the wrong thing is almost never a prompting
problem. It's an onboarding problem. It doesn't know your stack, your
conventions, your traps, or your definition of done, because none of that is
written down where it can read it. Fix that once, in the repo, and every session
after starts from the same baseline.

The tool is interchangeable. The operating model is not.

## The principles

**1. Context lives in the repo, not the chat.**
Put your stack, commands, conventions, and gotchas in a file the agent reads
every session (`AGENTS.md`). Re-explaining your codebase in each new chat is the
most common waste there is. Write it down once, version it, and update it in the
same change as the code so it never goes stale.

**2. One agent-doc, mounted everywhere.**
`AGENTS.md` is becoming the cross-tool convention. Keep it as your single source
of truth and have each tool's own config point at it, instead of maintaining
four copies that drift apart. See [tools.md](tools.md).

**3. Run the agent like a lead runs a team.**
Size the task, use the lightest approach that fits, and delegate the broad or
parallel work. But you own the integration and the review. Don't let it free-solo
a big feature; don't micromanage a one-line change. The shared failure mode of
both is that you stop reading the diff.

**4. Shortest working change wins (YAGNI).**
Models love to generate. Left alone they add abstractions, options, and
dependencies nobody asked for. Push the other way by default: prefer deletion,
prefer the standard library, prefer the boring version. Say "do the minimal
version" and mean it.

**5. "Done" means verified, and you name your own traps.**
Make the agent run the real command and show you the real output. Never accept
"this should work." And write down the footguns that have bitten you: the check
that passes but shouldn't, the deploy step that isn't automatic, the version
mismatch in CI. Those few lines save more time than any clever prompt.

**6. Name the phase before the code.**
Decide out loud whether you're brainstorming, planning, debugging, or building
before the agent touches anything. Most bad output comes from an agent that
jumped to a fix on a bug it never reproduced, or built a feature you were still
scoping.

**7. Let it push back.**
An agent optimized to agree with you is a worse collaborator than one allowed to
say "this is the wrong approach." Ask for the disagreement explicitly. You want a
sparring partner, not a yes-machine.

**8. Design is context too.**
Taste is something an agent re-guesses every session — component library, spacing,
color, motion. Write it down like everything else: put your tokens, component
conventions, and design non-negotiables in a doc the agent reads (`DESIGN.md`) and
point `AGENTS.md` at it. Don't author it by hand — have the agent read your
existing styles and draft it. See [templates/DESIGN.md](templates/DESIGN.md).

## What's in here

- **[templates/AGENTS.md](templates/AGENTS.md)** — the drop-in file. Copy it into
  any repo, fill the blanks, and your agent onboards itself. This is the important
  one.
- **[templates/DESIGN.md](templates/DESIGN.md)** — the design chapter: a scaffold
  (with a one-time generator) for your tokens, component conventions, and design
  non-negotiables. Point `AGENTS.md` at it.
- **[examples/DESIGN.md](examples/DESIGN.md)** — a complete, filled-in design
  chapter to crib the shape from.
- **[templates/verification-checklist.md](templates/verification-checklist.md)** —
  a short "before you call it done" list to paste into a PR or an agent doc.
- **[tools.md](tools.md)** — where each tool reads its config, and how to mount one
  `AGENTS.md` into all of them.

## Quick start

**Fastest — the CLI:**

```bash
npx working-with-agents init
```

It detects your stack, asks a handful of pre-filled questions, and writes a
filled `AGENTS.md` (+ optional `DESIGN.md`) wired to your agent tool.

**Or by hand:**

1. Copy [templates/AGENTS.md](templates/AGENTS.md) into the root of your repo.
2. Fill in the blanks — stack, run/test/build commands, the map to your code, and
   your known traps. Twenty minutes, once.
3. Mount it into your tool (see [tools.md](tools.md)). For most tools that's zero
   extra work; for Claude Code, add a one-line `CLAUDE.md` that imports it.
4. For design work, add [templates/DESIGN.md](templates/DESIGN.md) too — generate
   it (paste the recipe at the top of the file to your agent) or fill it by hand.
   The `AGENTS.md` template already points at it.

That's the whole system. Everything else is refinement.

## Portable vs. tool-specific

The principles above are universal. They're good management applied to a fast,
literal, forgetful teammate. Only the mechanics differ per tool: where the config
file lives, how sub-agents work, how verification hooks in. Keep those details in
[tools.md](tools.md) and out of your head.

## License

MIT. Do what you want with it. If you improve it, a PR back is appreciated.

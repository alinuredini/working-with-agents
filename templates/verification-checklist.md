# Verification checklist

Paste into a PR description, or into your `AGENTS.md` under "How we work." The
point is to make "done" mean something.

Before an agent (or you) calls a change done:

- [ ] The real build/test command was run — not a typecheck stub, the actual
      gate. Output pasted, not summarized.
- [ ] The change was exercised end to end — the feature was used, or the bug was
      reproduced and then confirmed fixed — not just compiled.
- [ ] The diff is the smallest one that works. No stray abstractions, dead code,
      or unrequested dependencies.
- [ ] Docs touched in the same change if behavior or setup changed.
- [ ] Anything skipped, mocked, or faked is stated plainly, with the reason.

If a box can't be checked, the honest status is "not done." Say so.

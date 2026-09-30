# Mockup to build

For designers and founders: how to get from an idea on screen to working product
without drawing every screen by hand — or letting the agent guess.

## The short version

- **Figma defines the brand rules, not the screens** — colours, type, core components.
- **Claude Design holds the system**, so the design agent composes with your real parts.
- **One plain HTML mock per feature**, before any app code is written.
- **Stop drawing every screen.** Once the system exists, new variations are cheap to generate.
- **Founders skip Figma** until they have a brand — start from a look instead.

## Why

Most redesigns that go wrong skip a step: the agent jumps from a vague idea
straight into editing the real app, and you only see the result once it's built.
Four stages keep each decision where it's cheapest to change.

1. **Figma — the brand rules.** Tokens (the named colours, sizes and fonts every
   screen reads from), type, and the core components: buttons, inputs, cards.
   Not screens. This is where taste gets decided once.
2. **Claude Design — the system.** The brand rules translated into a design
   system the design agent can use, so it builds with your real components
   instead of inventing lookalikes.
3. **HTML mock — one feature.** A single static page you open in a browser: real
   tokens, fictional people and companies, and a light/dark toggle. You react to
   it before any code is written. Small fixes don't need a mock.
4. **Build.** The agent builds what you approved. For a big rework, go through a
   clickable prototype, then a written spec, then a plan, then the build.

Drawing every screen in Figma is the expensive habit. Once the system lives in
Claude Design, a new page variation takes minutes to generate and review; the
same screen drawn by hand takes an afternoon — and still has to be rebuilt in
code.

Mocks are scaffolding. Delete them, or move them to an archive folder, before the
work is committed.

## Paste this to your agent

```text
Before touching any app code, build ONE static HTML mock of <the feature>.
Use the tokens in DESIGN.md, fictional people and companies, and add a light/dark
toggle. Put it in a single file I can open in a browser. Then stop and wait for my
reaction — no component changes until I say go.
```

## Traps we hit

**The agent skipped the mock.** Asked for a page redesign, the agent went straight
to editing components. The result had to be unpicked. Now the first question on
any redesign is "where's the mock?"

**Designing from a stale copy.** A marketing site was matched to a local copy of
the app's design system that was hundreds of changes out of date. Always read the
system from the latest version of the main branch, not whatever copy is lying
around.

**Invented styles render blank.** In Claude Design, style classes the codebase
doesn't already use come out unstyled — the build only includes classes the code
actually uses. Stick to the components and classes that exist.

**Thumbnails lie about size.** Sizes judged from a contact sheet of small previews
were wrong. Compare real, full-size screenshots.

**"Verified" on the wrong file.** A check passed on a retyped copy of a file, not
the real one. Test the actual file you're shipping.

## Where you start

### If you're a designer

You have Figma. Put the brand rules there — tokens, type, core components — then
move them into Claude Design. Don't hand the agent finished screens to copy; hand
it the system and ask for a mock of one feature at a time.

### If you're a founder

No brand yet? Skip Figma for now. Pick one of the [curated looks](../looks/), drop
it into your project as your DESIGN.md, and go straight to an HTML mock of your
first screen. Come back to Figma when there's a brand worth defining.

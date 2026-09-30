<!--
This is your design chapter — the taste an agent otherwise re-guesses every
session: component library, tokens, spacing, color, motion. Fill it once, keep it
in the repo, and point AGENTS.md at it (that pointer ships in the AGENTS.md template).

DON'T WRITE THIS BY HAND — GENERATE IT. Paste the recipe below to your coding
agent and let it read your existing styles:

    Read my design system from this repo and fill out DESIGN.md:
    - Open the global CSS / @theme / :root token block, the Tailwind config,
      components.json, and 2-3 real components.
    - Extract the ACTUAL token values (canvas, text/ink, primary, accent,
      border, radius, type scale, shadow, motion eases), the component library
      + style, the variant pattern, and the directory layout.
    - Infer the taste signals (density, roundedness, contrast, motion) from code.
    - Fill the sections below with my real values — don't invent. Mark anything
      you're unsure about with TODO.
    - Keep the Universal rules section as-is; add project-specific bans
      under "Never do this".

No existing styles yet? Start from a curated look instead and copy its tokens:
https://github.com/alinuredini/working-with-agents/blob/main/looks/

The "Start here" sections are enough to be useful on day one; the rest are
optional — add them once you have more than one surface. Terse beats thorough.
Update it in the same change as the design. Delete these comments when done.
-->

# DESIGN.md

<!-- ───────────────────────  START HERE (the minimum)  ─────────────────────── -->

## Credo

<!-- One or two lines: your take on design. What does "good" mean in this repo? -->

> Example: "Quiet by default. Content leads, chrome recedes, one accent used rarely."

## Non-negotiables

<!-- The rules that always hold in your style. State YOUR answers — there is no
house default here. Cover at least primary-vs-accent, canvas, borders/shadows, type. -->

- **Primary vs. accent:** _..._ <!-- e.g. "primary = near-black; brand is accent-only" — or "brand-colored primary is fine" -->
- **Canvas:** _..._
- **Borders / shadows:** _..._
- **Type:** _..._

## Tokens — source of truth

<!-- Where the tokens live (point at the real file) + the core set. Everything reads
from these: swap the token, not the component. -->

Source of truth: `<path to your globals.css / @theme block>` <!-- wa:fill:designsource -->

| Token | Value | Notes |
| --- | --- | --- |
| Canvas / background | _..._ | |
| Text / ink | _..._ | |
| Primary | _..._ | |
| Accent | _..._ | reserved for _..._ |
| Border | _..._ | |
| Radius | _..._ | |
| Type — display / body | _..._ | |
| Shadow | _..._ | |

## Never do this

<!-- Anti-patterns an agent should treat as hard rules. Be specific. -->

- _..._
- _..._

## Universal rules

<!-- These hold for every look. They're what keeps UI from reading as AI-made.
Keep them unless you have a reason; add your own under "Never do this". -->

- **No eyebrow labels** — no small uppercase line above a heading. Let the heading speak.
- **No one-sided borders or accent bars** — no colored left edge on a tile, no gradient strip on top of a card. Use a tinted fill, a filled chip, or full hairline borders.
- **No gradient text, glass effects, or glow blobs.**
- **No grids of identical icon cards** — vary the layout or cut the section.
- **Headlines use a font's normal-width cut** — never condensed or extended.
- **Calm needs a few loud accents** — the one status that matters gets a saturated solid pill; everything secondary stays soft. If everything is muted, nothing is visible.
- **Visible copy is one clause.** Explanations go behind an (i) hint; security warnings stay visible.
- **Motion is quick and optional** — feedback ≤150ms, never blocking, every animation respects reduced-motion, and nothing above the fold waits for scripts to appear.

<!-- ─────────────────────  OPTIONAL — add later  ───────────────────── -->

## Component conventions

<!-- Library + style, how variants are done, the class-merge helper, where things live. -->

> Example: "shadcn (customized style, not stock); variants via cva; `cn` in
> `@/lib/utils`; primitives in `components/ui/`, features in their own dirs."

## Archetypes / modes

<!-- Only if you have more than one surface. Name each and list what it OVERRIDES
vs. the tokens/rules above (radius, type, motion, density). -->

> Example:
> - **Product app** — dense, dark mode, generous radius.
> - **Marketing** — airy, pastel section surfaces, pill CTAs, light-only.
> - **Editorial** — serif + mono, zero radius, no shadow, print devices.

## Motion & accessibility

<!-- Your motion rules and the accessibility floor. -->

> Example: "Custom eases; every animation guarded by prefers-reduced-motion; no
> ambient/looping motion. WCAG 4.5:1 contrast; real touch targets."

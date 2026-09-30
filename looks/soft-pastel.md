# Soft Pastel

## Fits

Marketing sites and consumer products: friendly, light-first.

## Tokens

```css
:root {
  --canvas: #eef3ea;    /* soft green page */
  --surface: #fdf0e4;   /* peach section / card tone */
  --tone-2: #e6e0f5;    /* lavender — second section tone only */
  --ink: #1d2a22;
  --muted: #4d5c52;
  --hairline: #d9e2d3;
  --accent: #2e6b4a;
  --on-accent: #ffffff;
  --loud: #2e6b4a;
  --radius: 16px;
  --shadow: none;
}
```

Sections alternate between `--canvas`, `--surface` and `--tone-2` backgrounds.
`--tone-2` is only ever a section background, never text or a button.

## Type

- **Everything:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — 400 / 600 / 700.
- Scale: 14 / 16 / 20 / 32 / 48px. Headlines 700 with −0.025em tracking, in the
  normal-width cut.

## Component rules

- **Primary call to action:** a dark pill — `--ink` fill, white text, fully rounded
  (`999px`).
- **Secondary button:** the same pill shape, 1.5px ink outline.
- **Cards:** a pastel tone on a different pastel, `--radius` corners, no border,
  no shadow.
- **Status pills:** the one that matters is solid `--accent`; the rest use a soft
  lavender or peach fill.
- **Sections:** generous vertical space — at least 96px between sections on desktop.

## What would break this look

- Saturated section backgrounds.
- Square buttons.
- More than three tones on one page (the canvas plus the two section tones).
- Shadows.

## Universal rules

These hold for every look — keep them as-is. Source: https://github.com/alinuredini/working-with-agents/blob/main/templates/DESIGN.md#universal-rules

- **No eyebrow labels** — no small uppercase line above a heading. Let the heading speak.
- **No one-sided borders or accent bars** — no colored left edge on a tile, no gradient strip on top of a card. Use a tinted fill, a filled chip, or full hairline borders.
- **No gradient text, glass effects, or glow blobs.**
- **No grids of identical icon cards** — vary the layout or cut the section.
- **Headlines use a font's normal-width cut** — never condensed or extended.
- **Calm needs a few loud accents** — the one status that matters gets a saturated solid pill; everything secondary stays soft. If everything is muted, nothing is visible.
- **Visible copy is one clause.** Explanations go behind an (i) hint; security warnings stay visible.
- **Motion is quick and optional** — feedback ≤150ms, never blocking, every animation respects reduced-motion, and nothing above the fold waits for scripts to appear.

## Dark mode

Not recommended — this look is light-first. If you need it, make deep,
desaturated versions of each tone, keep the ink pill as a light pill, and re-check
that every text colour passes 4.5:1 contrast.

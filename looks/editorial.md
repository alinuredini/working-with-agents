# Editorial

## Fits

Portfolios, studios, writing, and personal sites.

## Tokens

```css
:root {
  --canvas: #fbfaf7;    /* paper */
  --surface: #fbfaf7;   /* no separate card colour — borders do the work */
  --ink: #1a1a1a;
  --muted: #444444;
  --hairline: #1a1a1a;  /* borders are full ink, 1px */
  --accent: #c8341f;    /* one red, used rarely */
  --on-accent: #ffffff;
  --loud: #c8341f;
  --radius: 0;
  --shadow: none;
}
```

Structure comes from type and 1px ink lines, not from colour or depth.

## Type

- **Headlines and body copy:** [Newsreader](https://fonts.google.com/specimen/Newsreader) — 400, large.
- **UI text, buttons, labels, numbers:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono).
- Scale: 12 / 16 / 20 / 28 / 44px. Headlines 400 with −0.01em tracking, in the
  normal-width cut.

## Component rules

- **Buttons:** square, mono text; primary is an ink fill, secondary is a 1px ink outline.
- **Cards:** a 1px ink border and nothing else — no fill change, no shadow.
- **Status pills:** square; the one that matters is solid red, the rest are grey outlines.
- **Links:** underlined in ink; red only for the one thing you want clicked.
- **Dividers:** full-width 1px ink rules.

## What would break this look

- Rounded corners.
- Any shadow.
- A second accent colour.
- Sans-serif headlines.

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

Ink page (`#111111`), paper-coloured text and rules, and the red lightened until
links in it pass 4.5:1 contrast on the dark page.

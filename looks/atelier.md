# Atelier

## Fits

Fashion, interiors, hospitality, premium services: clean luxury.

## Tokens

```css
:root {
  --canvas: #efebe4;    /* stone */
  --surface: #efebe4;   /* no boxes — hairlines separate things */
  --ink: #231f1a;       /* espresso */
  --muted: #6b635a;
  --hairline: #d6cfc4;
  --accent: #6e2a2a;    /* oxblood, used sparingly */
  --on-accent: #f5efe6;
  --loud: #6e2a2a;
  --radius: 0;
  --shadow: none;
}
```

Luxury here means space and restraint: more whitespace than feels necessary, one
precious accent, nothing boxed in.

## Type

- **Headlines:** [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) — 400, 34px and up.
- **Body and UI:** [Manrope](https://fonts.google.com/specimen/Manrope) — 400 / 500.
- Scale: 11.5 / 14 / 18 / 34 / 56px. Headlines thin and large, in the normal-width cut.

## Component rules

- **Buttons:** square, uppercase, tracked (0.12em), small text; primary is an
  espresso fill, secondary a 1px espresso outline.
- **Lists and cards:** no boxes — items are separated by hairline rules above and below.
- **Numbers and prices:** set in the headline serif.
- **Status pills:** square; the one that matters is solid oxblood, the rest a hairline outline.
- **Spacing:** generous — whenever in doubt, add space rather than a divider.

## What would break this look

- Rounded corners.
- Boxed cards with fills or shadows.
- Bold sans-serif headlines.
- More than one accent colour.

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

Espresso page (`#1a1714`), stone-coloured text and hairlines, and the oxblood
lightened until text on it still passes contrast.

# Friendly Bold

## Fits

Consumer apps, communities, education: playful and confident.

## Tokens

```css
:root {
  --canvas: #fff7ef;    /* warm cream */
  --surface: #ffffff;
  --ink: #221a14;
  --muted: #6a5a4d;
  --hairline: #221a14;  /* outlines are ink, 2px */
  --accent: #ff5a1f;    /* orange */
  --on-accent: #221a14; /* dark text on orange — white fails contrast */
  --loud: #ff5a1f;
  --radius: 14px;
  --shadow: 3px 3px 0 #221a14; /* hard offset, no blur */
}
```

Every raised thing gets a 2px ink outline and the hard offset shadow. Text on
orange is always dark.

## Type

- **Everything:** [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) — 400 / 600 / 700.
- Scale: 14 / 16 / 20 / 28 / 40px. Headlines 700 with −0.03em tracking, in the
  normal-width cut.

## Component rules

- **Buttons:** primary is an orange fill with dark text, a 2px ink outline and a
  2px offset shadow; secondary is a 2px ink outline on white.
- **Cards:** white, 2px ink outline, `--radius` corners, `--shadow`.
- **Pressed state:** the shadow collapses to zero and the element moves 2px down
  and right, like it's being pushed in.
- **Status pills:** the one that matters is solid orange; the rest use a pale
  orange fill with brown text.

## What would break this look

- Soft, blurred shadows.
- Thin 1px borders.
- White text on the orange.
- More than one bright colour.

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

Ink page (`#1a1410`), cream outlines, and the offset shadow in cream; keep the
orange with dark text on it, and re-check that orange text on the dark page passes
4.5:1 contrast.

# Calm Enterprise

## Fits

B2B tools, internal tools, anything with tables and forms.

## Tokens

```css
:root {
  --canvas: #f7f8fa;
  --surface: #ffffff;
  --ink: #111827;
  --muted: #4b5563;
  --hairline: #e3e6eb;
  --accent: #2447d6;    /* primary buttons and links */
  --on-accent: #ffffff;
  --loud: #b42318;      /* only for the status that needs action */
  --radius: 6px;
  --shadow: 0 1px 2px rgb(16 24 40 / 0.05);
}
```

Blue is for actions; red is reserved for the one thing that needs someone's
attention. Everything else stays grey.

## Type

- **UI:** [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) — 400 / 500 / 600.
- **Numbers and IDs:** [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono).
- Scale: 13 / 14 / 16 / 20 / 24px — a 13–14px base keeps tables dense. Headings 600,
  in the normal-width cut.

## Component rules

- **Buttons:** primary is a solid blue fill; secondary is white with a hairline border.
- **Tables:** hairline row dividers, no zebra stripes, numbers right-aligned in mono.
- **Cards and panels:** white on the grey canvas, hairline border, `--shadow`.
- **Status pills:** small (`4px` radius); the one that needs action is solid red,
  the rest are soft grey.
- **Forms:** labels above fields, never floating inside them.

## What would break this look

- Large radii or pill-shaped buttons.
- Decorative illustrations inside the app.
- Colour-coding more than three statuses.
- Centred, marketing-style layouts on app screens.

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

Slate page (`#0f172a`), slightly lighter slate for panels, and the blue and red
lightened until links and labels in them pass 4.5:1 contrast on the dark page.

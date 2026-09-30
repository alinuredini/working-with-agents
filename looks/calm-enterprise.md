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

Also follow the universal rules: https://github.com/alinuredini/working-with-agents/blob/main/templates/DESIGN.md#universal-rules

## Dark mode

Slate page (`#0f172a`), slightly lighter slate for panels, and the blue and red
kept at the same lightness so they read the same.

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
- More than two pastel tones on one page.
- Shadows.

Also follow the universal rules: https://github.com/alinuredini/working-with-agents/blob/main/templates/DESIGN.md#universal-rules

## Dark mode

Not recommended — this look is light-first. If you need it, make deep,
desaturated versions of each tone and keep the ink pill as a light pill.

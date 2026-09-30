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

Also follow the universal rules: https://github.com/alinuredini/working-with-agents/blob/main/templates/DESIGN.md#universal-rules

## Dark mode

Ink page (`#1a1410`), cream outlines, and the offset shadow in cream; keep the
orange with dark text on it.

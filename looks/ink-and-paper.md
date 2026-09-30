# Ink & Paper

## Fits

Product apps and dashboards: calm, warm, serious.

## Tokens

```css
:root {
  --canvas: #f6f3ee;    /* warm off-white page — never pure white */
  --surface: #ffffff;   /* cards sit on the canvas */
  --ink: #161513;       /* text AND the primary button fill */
  --muted: #5f5b55;
  --hairline: #e6e1d9;
  --accent: #1f7a4d;    /* selected state + the one status that matters */
  --on-accent: #ffffff;
  --loud: #1f7a4d;
  --radius: 10px;
  --shadow: 0 1px 2px rgb(0 0 0 / 0.12);
}
```

The primary button is **ink**, not the accent. The green accent is for what's
selected and the one status that needs attention — never for the main button.

## Type

- **UI:** [Geist](https://fonts.google.com/specimen/Geist) — 400 / 500 / 600.
- **Numbers, amounts, codes:** [Geist Mono](https://fonts.google.com/specimen/Geist+Mono).
- Scale: 13 / 15 / 18 / 24 / 32px. Headings 600 with −0.02em tracking, in the
  normal-width cut.

## Component rules

- **Buttons are tactile:** ink fill, canvas-coloured text, a 1px light highlight
  along the inside top edge, plus `--shadow`. Secondary buttons: transparent with a
  hairline border.
- **Cards:** white `--surface` on the warm canvas, a full 1px `--hairline` border,
  `--radius` corners.
- **Status pills:** the status that matters is a solid `--loud` pill; everything
  else is a soft chip (a hairline-coloured fill with muted text).
- **Selected segment / tab:** solid green fill with white text.
- **Inputs:** white fill, hairline border, ink focus ring.

## What would break this look

- A pure-white page background.
- The brand colour as the primary button.
- Heavy or blurred shadows.
- Pills in more than one saturated colour.

Also follow the universal rules: https://github.com/alinuredini/working-with-agents/blob/main/templates/DESIGN.md#universal-rules

## Dark mode

Swap canvas and ink, using a warm near-black (around `#161513`, never `#000`) for
the page and a slightly lighter warm grey for cards; keep the green accent.

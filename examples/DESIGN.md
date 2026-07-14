<!--
A complete, filled-in design chapter — the maintainer's own style — to show what
"done" looks like. Copy the shape, not the values. Product names are omitted and
the accent is a neutral placeholder; everything else is real.
-->

# DESIGN.md

## Credo

One taste, many dialects — the rules hold; radius, type, and motion flex per surface.

## Non-negotiables

The DNA that holds across every surface:

1. **Token-first, always.** Everything reads from CSS variables (`:root` / `@theme`). Swap the token, not the component.
2. **Warm off-white canvas — never pure white** (`oklch(0.992 …)`, not `#fff`).
3. **Hairline borders; whisper-soft or zero shadows.** No heavy elevation.
4. **Primary = near-black ink; the brand color is accent-only, never the primary fill.** (Hard rule — see *Never do this*.)
5. **Type is a display + body/mono pairing**, self-hosted variable fonts, negative tracking on headings. (Product: Plus Jakarta Sans + Manrope. Editorial: Newsreader + JetBrains Mono.)
6. **Motion is disciplined** — custom eases, a `prefers-reduced-motion` guard on every animation, no ambient/looping motion.
7. **Accessibility is the floor, not a feature** — WCAG 4.5:1 contrast, real touch targets.
8. **Tailwind v4, CSS-first (`@theme`).** shadcn only when it earns it, and always a customized style (not stock new-york/default).
9. **Modern color** — oklch + `color-mix`.

## Tokens — source of truth

Source of truth: `src/index.css` (or `src/app/globals.css`). The accent below is a
**neutral placeholder** — swap in your brand by editing the three HSL parts.

```css
:root {
  /* accent = brand, from 3 parts so the whole UI recolors at runtime. SWAP THESE. */
  --brand-primary-h: 220; --brand-primary-s: 12%; --brand-primary-l: 42%;  /* PLACEHOLDER */

  --background: oklch(0.992 0.0015 95);   /* warm off-white, not pure white */
  --foreground: oklch(0.18 0.01 150);     /* near-black */
  --ink:        oklch(0.21 0.012 150);    /* text + PRIMARY buttons (not the accent) */
  --primary:    hsl(var(--brand-primary-h) var(--brand-primary-s) var(--brand-primary-l)); /* accent, reserved */
  --border:     oklch(0.93 0.003 150);    /* hairline */

  --radius: 0.625rem;                     /* 10px base */
  --radius-card: 0.875rem; --radius-shell: 1.125rem;

  /* shadows: color-mix(in oklch, var(--foreground) 4-14%, transparent) — very subtle */
  /* type: Plus Jakarta Sans (display) + Manrope (body); micro-labels 11/10px;
     stat numerals 26/34px */
}
```

| Token | Value | Notes |
| --- | --- | --- |
| Canvas | `oklch(0.992 0.0015 95)` | warm off-white |
| Ink (text + primary) | `oklch(0.21 0.012 150)` | near-black |
| Accent | 3-part HSL (placeholder) | reserved; never the primary fill |
| Border | `oklch(0.93 0.003 150)` | hairline |
| Radius | `0.625rem` base → `1.125rem` shells | |
| Type | Plus Jakarta Sans / Manrope | variable, self-hosted |
| Shadow | `color-mix(oklch)`, 4-14% | whisper-soft |

## Never do this

- **Pure white backgrounds + heavy drop shadows / card elevation.** Use warm canvas + hairlines.
- **Stock, uncustomized shadcn** (default slate/zinc, no token warming, no variant work).
- **Unguarded or ambient motion** — nothing loops; nothing animates without a `prefers-reduced-motion` guard.
- **Brand-filling the primary button** — primary is ink; the brand color stays an accent.

## Component conventions

- **shadcn**, a customized style (not stock new-york/default), `baseColor: neutral`, `cssVariables: true`, `iconLibrary: hugeicons`.
- **Variants via cva** with `data-slot` and `asChild` (Radix Slot); `cn` lives in `@/lib/utils`.
- **Layout:** primitives in `components/ui/` (each ships a `.stories.tsx`), features in their own dirs.
- **Signature customizations:** Button adds `brand` / `field` / `loading` variants + touch hit-area pads + `icon-xs/sm/lg`; Card adds an `elevation` prop (flat/raised); Badge adds `success` / `warning` / `info`.

## Archetypes / modes

One taste, three dialects — each lists what it OVERRIDES vs. the DNA above.

- **Product app.** shadcn + Radix, oklch tokens, runtime accent theming from the 3-part HSL vars (ship a few WCAG-bound presets), dense-but-breathable, dark mode, a full motion-token system. *Neutral themeable-shell variant:* keep the shell zinc-neutral and let everything read `var(--radius)`/`var(--shadow)`/`var(--accent)` so it theme-swaps at runtime; `data-*` attributes can morph layout mode.
- **Marketing / landing.** Airy and editorial; pastel section-tint surfaces (mint / cool / rose / soft warm-neutrals) instead of hard dividers; a deep, low-chroma ink scale for primary; ~18px cards, **pill dark CTA**; light-first; a hand-authored `@utility` layer with `class:list` variant maps (no cva); realistic mock product UI as hero proof; an animated-gradient heading.
- **Editorial / personal.** Hand-written CSS, no component lib; serif (Newsreader) + mono (JetBrains Mono) with optical-size axes; warm paper canvas, near-black ink, a single restrained accent used sparingly (placeholder — e.g. a muted warm accent); **zero border-radius, no shadows**; 18px base, ~36rem measure, hairline `<hr>` rules; print devices (drop cap, pull quotes, mono eyebrows); a signature **strike-through animation** on the "reverts" list.

## Motion & accessibility

- **Eases:** custom cubic-beziers (e.g. `cubic-bezier(0.22, 1, 0.36, 1)`) and a `linear()` bounce; no default/linear easing on meaningful motion.
- **Reduced motion:** every animation wrapped in `@media (prefers-reduced-motion: reduce)`; no ambient/looping motion anywhere.
- **Contrast & targets:** WCAG 4.5:1 (darken `--muted-foreground` where needed); invisible `::after` hit-areas to keep small controls touch-friendly.

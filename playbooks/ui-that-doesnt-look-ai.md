# UI that doesn't look AI-made

For founders and designers: a handful of rules that separate a designed product
from a generated one — and how to get your agent to follow them.

## The short version

- **Pick a look, don't invent colours.** Start from one of the six curated looks below.
- **Follow the universal rules** — no eyebrow labels, no one-sided borders, no gradient text or glass, no grids of identical icon cards.
- **Calm, with one loud accent.** Keep almost everything quiet so the one thing that matters stands out.
- **One clause of visible copy.** Put explanations behind an (i) hint.
- **Mock before you build** — see [Mockup to build](mockup-to-build.md).

## Why

Agents learned design from millions of web pages, so left alone they reach for the
same handful of decorations. Each one is harmless alone; together they read as
"an AI made this". These rules live in your DESIGN.md
([universal rules](../templates/DESIGN.md#universal-rules)) so the agent reads them every
session.

**Eyebrow labels.** *Before:* a small grey "FEATURES" line in capitals above every
heading. *After:* just the heading — it already says what the section is.

**One-sided borders and accent bars.** *Before:* a coloured stripe down the left
edge of every tile, or a gradient strip along the top of a card. *After:* a
tinted background, a filled chip, or a plain border all the way round.

**Gradient text, glass, and glow blobs.** *Before:* a headline that fades from
purple to blue, frosted see-through panels, soft coloured blobs floating behind
everything. *After:* solid text in your ink colour on a plain background.

**Grids of identical icon cards.** *Before:* six boxes, each with an icon, a bold
title and two lines of text. *After:* fewer, more specific points — a list, a
comparison, a real screenshot — or cut the section.

**Headline fonts.** Use a font's normal-width cut. Condensed (squashed) or
extended (stretched) versions of a font look like a template.

**Calm needs a loud accent.** Quiet design is good until everything is quiet —
then nothing stands out. Use two tiers: the one status that needs attention
(overdue, failed, action needed) is a saturated solid pill; everything secondary
is a soft chip.

**One-clause copy.** Visible text says one thing in one short line. The
explanation, the legal note, the "how this works" goes behind a small (i) hint
people can open. The exception is security warnings: those stay visible.

**Quick, optional motion.** Feedback within 150ms, never blocking. Every animation
turns off for people who've asked their device to reduce motion. And nothing at
the top of the page should stay hidden until scripts load — that's how a headline
ends up taking seconds to appear.

**Tokens, not one-off colours.** Tokens are the named colours, sizes and fonts every
screen reads from (`--ink`, `--accent`, `--radius`…). When the agent uses tokens,
changing your look is one edit; when it invents a colour per screen, it's a hunt.

## Paste this to your agent

```text
Read DESIGN.md. Review the screen I'm about to describe (or the files I point you at)
against its Universal rules and its look. List every violation as: where it is,
which rule it breaks, and the fix. Don't change anything yet — wait for my OK.
```

## Traps we hit

**Too calm to see.** A SaaS app muted every colour to feel calm — and the
"overdue" status became invisible next to everything else. The fix was the two
tiers: one saturated solid pill for what needs action, soft chips for the rest.

**Too many choices.** A theme picker offered 36 combinations of colour and style.
The combinations nobody tested broke at the edges — unreadable text, clashing
borders. Five curated looks replaced it, and every one of them is checked.

**Navigation rebuilt twice, reverted twice.** Two navigation redesigns were built
and then thrown away because each added a click to every page, and the people using
the app daily felt it immediately. Mock navigation changes and try them with real
users before rebuilding.

**A headline that took seven seconds.** A marketing page hid its hero until the
animation scripts loaded, so on a normal phone the headline appeared after about
seven seconds. Plain CSS animation fixed it: the content is there from the first
frame and the motion is a bonus.

## Pick a look

- **[Ink & Paper](../looks/ink-and-paper.md)** — Product apps and dashboards: calm, warm, serious.
- **[Editorial](../looks/editorial.md)** — Portfolios, studios, writing, and personal sites.
- **[Soft Pastel](../looks/soft-pastel.md)** — Marketing sites and consumer products: friendly, light-first.
- **[Calm Enterprise](../looks/calm-enterprise.md)** — B2B tools, internal tools, anything with tables and forms.
- **[Friendly Bold](../looks/friendly-bold.md)** — Consumer apps, communities, education: playful and confident.
- **[Atelier](../looks/atelier.md)** — Fashion, interiors, hospitality, premium services: clean luxury.

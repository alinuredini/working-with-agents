<!--
This is your stack brief — not a stack. Fill in the five answers in plain words,
then give the whole file to your agent with the prompt at the bottom. The agent
proposes options; you pick. There is no best stack, only a fit.

Why these five questions and what the answers usually lead to:
https://github.com/alinuredini/working-with-agents/blob/main/playbooks/pick-your-stack.md
-->

# STACK.md

## What are you building?

<!-- One or two sentences. Who uses it, what do they do in it? -->

> Example: "A booking app for small yoga studios — owners set classes, members book and pay."

## How much time can you put in?

<!-- A weekend · a month · ongoing. Be honest; it changes the answer. -->

> Example: "Evenings for a month, then an hour a week."

## How much money per month?

<!-- Free · under $50 · more. Include what happens if it grows. -->

> Example: "Free while testing, up to $50 once studios pay."

## Who handles upkeep?

<!-- When it breaks at 2am, who fixes it? "Me, but I can't code" is a valid answer —
it means fewer moving parts. -->

> Example: "Me, with an agent. No engineer."

## Special needs

<!-- Anything unusual: company logins (SSO), sensitive data (health, money, kids),
many languages, offline use, and on mobile: widgets, Live Activities, Apple Watch. -->

> Example: "Payments. Must work well on phones. No widgets needed."

## Rules for whoever picks the stack

- **Check whether preview deploys share the live database.** If they do, pushing a branch runs its database changes on real data.
- **Check build settings before the first public deploy.** A static host with missing settings can publish your source code instead of your site.
- **Prefer static pages** unless a page truly needs live data — per-request pages cost server time on every visit and burn through free plans.
- **Pin runtime versions** (Node, framework) so a host update can't break a deploy overnight.
- **Database migrations ship before the code that needs them.**

## For the agent

Read this file. Propose 2–3 stacks that fit the answers above. For each: what it is
in one line, monthly cost at launch and at 10× usage, upkeep (what breaks, who fixes
it), and lock-in (how hard it is to leave). Recommend one and say why. Then wait for
my pick before writing any code.

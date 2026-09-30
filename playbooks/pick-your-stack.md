# Pick your stack

For founders and designers: there is no best stack, only a fit. Answer five
questions, then let your agent propose options — and you pick.

## The short version

- **There is no best stack, only a fit** for what you're building, your time, your money, and your upkeep.
- **Answer five questions first:** what you're building, how much time, how much money per month, who handles upkeep, and any special needs.
- **Fill in [STACK.md](../templates/STACK.md)** and let the agent propose 2–3 options with cost, upkeep, and lock-in.
- **Pick on upkeep, not hype.** The stack you can keep running beats the one that's trending.
- **Check the traps below** before your first public deploy.

## Why

A "stack" is the set of tools your product runs on: the framework the screens are
built with, where it's hosted, where the data lives, how people log in. Agents
will happily build on anything, so the choice has to come from you — from your
answers, not from what's popular this month.

**What are you building?** A marketing site is mostly pages that rarely change; an
app has logins, data, and screens that change per person. They want very
different tools, and picking an app stack for a marketing site (or the reverse)
is the most common expensive mistake.

**How much time?** A weekend project should use one service that does most things.
Something you'll run for years can afford more pieces, each best at its job.

**How much money per month?** Free plans are great until a limit hits. Ask what it
costs at launch *and* at ten times the usage, so growth isn't a surprise bill.

**Who handles upkeep?** If nobody technical will fix it when it breaks at 2am,
fewer moving parts beats more features. Every extra service is another thing that
can go down, change its pricing, or need an update.

**Special needs.** A few needs change the answer outright. Company logins (SSO —
signing in with a work account, which businesses often require) push you towards
a dedicated identity service. Sensitive data (health, money, children) needs more
care about where data is stored. On iPhone, widgets, Live Activities (the live
updates on the lock screen) and Apple Watch push you towards a native app.

A few more terms you'll meet: a **CMS** is the admin screen where you edit site
text and images without code. A **static page** is built once and served as-is —
fast and nearly free — while a dynamic page is rebuilt on every visit. A
**preview deploy** is a temporary copy of your site for each change you're testing.
A **migration** is a change to the shape of your database. **Lock-in** is how hard
it would be to move to something else later.

## Paste this to your agent

```text
Read STACK.md. Propose 2–3 stacks that fit my answers. For each: what it is in one
line, monthly cost at launch and at 10× usage, upkeep (what breaks and who fixes it),
and lock-in (how hard it is to leave). Recommend one and say why. Then wait for my
pick — don't install or write anything yet.
```

## Traps we hit

**Four CMSs for one website.** A marketing site moved through four different CMSs
chasing easier editing — and the homepage ended up hand-built outside the CMS
anyway. Choose a CMS for how your editors actually work (live, on-the-page
editing won), and keep your most designed page out of it.

**Previews that touched real data.** Preview deploys shared the live database, so
pushing a branch with a database change effectively ran that change on real
customer data. Check this before anything else.

**Source code published by accident.** A static host with missing build settings
served a private project's source code publicly instead of the built site. Check
the build settings before the first public deploy.

**A free plan burned by one line.** A site hit its hosting plan's CPU limit
because pages were rebuilt on every visit when they could have been static.
Prefer static pages unless a page truly needs live data.

**An overnight break.** A hosting platform updated its default runtime and a
deploy broke until the version was pinned. Pin your runtime versions.

## Worked examples

These show how the answers lead to a choice. They're examples, not defaults.

### Marketing site or portfolio

- **Situation:** a handful of pages, updated occasionally, one editor.
- **Starting point:** Astro with a simple git-based CMS, on a static host.
- **Why:** static pages are fast and nearly free, and there's almost nothing to maintain.
- **When it changes:** several people edit content daily — see the next example.

### Content-heavy site edited by non-developers

- **Situation:** a team updates pages, posts, and landing pages every day.
- **Starting point:** a CMS with live, on-page editing.
- **Why:** editors see exactly what they're changing; block-by-block forms slow them down.
- **When it changes:** a page needs custom design — build that page by hand and keep it out of the CMS.

### Solo founder MVP with logins and data

- **Situation:** one person, a few months, needs logins, a database, and file uploads.
- **Starting point:** Supabase for logins, database, and file storage in one place, with a mainstream web framework on top.
- **Why:** one service covers most of the backend, its free plan is generous, and agents know it well.
- **When it changes:** big-company customers ask for company logins, or you outgrow the plan's limits.

### B2B app selling to companies

- **Situation:** customers are businesses that want their staff to sign in with work accounts, plus audit trails.
- **Starting point:** a dedicated identity service such as Auth0 or Keycloak alongside your app.
- **Why:** company logins (SSO) and access rules are what these customers check first; identity services do them properly.
- **When it changes:** you're still validating the idea — start simpler and add this when the first company asks.

### Mobile app

- **Situation:** you need an app in the App Store and Google Play.
- **Starting point:** React Native (with Expo) — one codebase for iPhone and Android, and web skills carry over.
- **Why:** one team, one codebase, faster releases.
- **When it changes:** widgets, Live Activities, or Apple Watch are core to the product — then native iOS (Swift) is worth it.

Fill in your own brief: [STACK.md template](../templates/STACK.md).

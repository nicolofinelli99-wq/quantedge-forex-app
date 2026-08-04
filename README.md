# BE4 Trading — Forex Strategy Subscription Platform

Full-stack Next.js prototype for a subscription business selling written forex trading
strategies across three tiers (Basic / Premium / Ultimate). Built to be shown to a real
prospective client — real database, real access-revocation logic, no mock data faked in
the browser.

## Stack

- **Next.js 14** (App Router, TypeScript, Server Components)
- **Tailwind CSS** + **Framer Motion** for the UI/animations
- **Postgres**, queried with parameterized SQL via the `postgres` driver (no ORM binary,
  fast cold starts on serverless)
- Deployed on **Vercel**

## What's real vs. placeholder

Real: the database, the publish/revoke flows, the checkout → member record → dashboard
access flow, the plan-gated content logic.

Placeholder (by design, for a prototype): payment processing (checkout simulates a Stripe
charge but does not move real money), login (one-click demo accounts, no passwords), copy
and legal disclaimers (flagged inline, review with a compliance advisor before launch),
brand name and logo.

## Local development

```bash
npm install
# set DATABASE_URL in .env to a real Postgres connection string
npm run dev
```

## Demo accounts

From `/login`: "Continue as Demo Client" and "Continue as Desk Admin" create/reuse real
rows in the `members` table — no password needed for this prototype.

## Seeding sample data

After deploying with a real `DATABASE_URL` and `SEED_SECRET` set, call:

```
POST /api/seed?secret=<SEED_SECRET>
```

once, to populate a few sample strategies and subscriber rows.

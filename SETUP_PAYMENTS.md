# Going live: connecting real payments and email

The app already has full signup/login (with real passwords + reset flow), a Stripe
Checkout + webhook integration, and transactional emails wired in. Everything below
is **flip-a-switch** work — no more code changes needed, just pasting values into
Vercel's environment variables (Project → Settings → Environment Variables) and
redeploying.

## 1. Stripe (payments)

1. Create/log into the client's Stripe account.
2. **Product catalog** → create 3 products: *Research*, *Strategy*, *Complete*.
   For each product, add two recurring **Prices**: one Monthly, one Yearly.
   Use these exact amounts (USD):

   | Plan     | Monthly | Yearly |
   |----------|---------|--------|
   | Research | $20     | $200   |
   | Strategy | $40     | $400   |
   | Complete | $50     | $500   |

3. Copy each Price's ID (`price_...`) into the matching Vercel env var:
   `STRIPE_PRICE_RESEARCH_MONTHLY`, `STRIPE_PRICE_RESEARCH_YEARLY`,
   `STRIPE_PRICE_STRATEGY_MONTHLY`, `STRIPE_PRICE_STRATEGY_YEARLY`,
   `STRIPE_PRICE_COMPLETE_MONTHLY`, `STRIPE_PRICE_COMPLETE_YEARLY`.
4. **Developers → API keys** → copy the **Secret key** into `STRIPE_SECRET_KEY`.
5. **Developers → Webhooks** → Add endpoint:
   `https://<your-domain>/api/stripe/webhook`
   Subscribe to these events: `checkout.session.completed`,
   `invoice.payment_failed`, `invoice.payment_succeeded`,
   `customer.subscription.updated`, `customer.subscription.deleted`.
   Copy the endpoint's **Signing secret** into `STRIPE_WEBHOOK_SECRET`.
6. Redeploy. Checkout, activation, renewals, failed-payment suspension, and
   cancellation are now fully live — the webhook handler in
   `src/app/api/stripe/webhook/route.ts` takes care of all of it automatically.

Until these are set, the "Continue to secure payment" button on `/checkout` shows a
friendly "payments aren't set up yet" message instead of erroring — nothing breaks.

## 2. Resend (transactional email)

1. Create a Resend account, verify the sending domain (or skip this step and use
   the shared test sender for now).
2. **API Keys** → create a key → paste into `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to something like `BE4 Trading <no-reply@be4trading.com>`
   (must match a verified domain in Resend, otherwise leave `EMAIL_FROM` unset and
   it will fall back to Resend's shared `onboarding@resend.dev` sender, which works
   with zero setup for testing).
4. Redeploy. Welcome emails, payment-failed notices, renewal receipts, cancellation
   notices, and password-reset emails will start sending automatically — until then
   they're silently skipped (logged, not sent) so nothing crashes.

## 3. Turn off demo mode before public launch

Set `DEMO_MODE` to `false` (or delete the variable) in Vercel. This disables:
- The "Continue as Desk Admin" one-click demo login on `/login`.
- The client dashboard's "simulate payment failed" toggle.

Real customer signup/login and the admin account you create yourself keep working
exactly the same — only the demo shortcuts disappear.

## What's already done (no action needed)

- `SESSION_SECRET` — generated and set already; session cookies are signed and
  can't be forged.
- Real signup (`/signup`) with hashed passwords, real login (`/login`), and a full
  forgot/reset password flow with expiring, single-use email links.
- Stripe Checkout (hosted, PCI compliance handled by Stripe) instead of a fake card
  form.
- Webhook-driven account activation, renewal, past-due suspension, and
  cancellation — no manual admin work required.
- A "Manage billing" button in the client dashboard (Stripe Customer Portal) so
  subscribers can update their card or cancel without contacting support.

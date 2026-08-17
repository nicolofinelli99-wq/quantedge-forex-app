import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// resend.dev's shared test sender works immediately with no domain setup —
// good enough until a real domain is verified in the Resend dashboard.
const FROM = process.env.EMAIL_FROM || "BE4 Trading <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping email to ${to}: "${subject}"`);
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    return { sent: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { sent: false, error: String(err) };
  }
}

function layout(title: string, bodyHtml: string): string {
  return `
  <div style="font-family:Helvetica,Arial,sans-serif;background:#f5f5f7;padding:32px 16px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5ea;">
      <div style="background:#0e0a17;padding:24px 28px;">
        <span style="font-family:Helvetica,Arial,sans-serif;font-weight:800;font-size:18px;color:#ffffff;letter-spacing:.2px;">BE4<span style="color:#d66aee;">TRADING</span></span>
      </div>
      <div style="padding:28px;">
        <h1 style="margin:0 0 14px;font-size:19px;color:#111114;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px;border-top:1px solid #e5e5ea;color:#8a8a92;font-size:11.5px;">
        BE4 Trading publishes market analysis and educational strategies for informational purposes only — not personalized financial advice.
      </div>
    </div>
  </div>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.6;color:#3a3a42;">${text}</p>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin:6px 0 18px;padding:12px 22px;border-radius:10px;background:linear-gradient(135deg,#d66aee,#886af9);color:#12071f;font-weight:700;font-size:14px;text-decoration:none;">${label}</a>`;
}

export function welcomeEmailHtml(name: string, planLabel: string): string {
  return layout(
    `Welcome aboard, ${name.split(" ")[0]}`,
    p(`Your <b>${planLabel}</b> subscription is now active. Your dashboard is unlocked and today's strategies are ready to read.`) +
      p("You'll get an email like this every time your subscription renews or if we ever need your attention.")
  );
}

export function paymentFailedEmailHtml(name: string): string {
  return layout(
    "We couldn't process your payment",
    p(`Hi ${name.split(" ")[0]}, your last renewal payment didn't go through. Your dashboard access is paused until it's resolved.`) +
      p("Update your payment method from your dashboard and access will resume automatically as soon as the charge succeeds.")
  );
}

export function subscriptionCancelledEmailHtml(name: string): string {
  return layout(
    "Your subscription has been cancelled",
    p(`Hi ${name.split(" ")[0]}, your subscription is now cancelled and dashboard access has ended.`) +
      p("You're welcome back any time — just choose a plan again from the pricing page.")
  );
}

export function renewalReceiptEmailHtml(name: string, planLabel: string, amount: number): string {
  return layout(
    "Payment received — thank you",
    p(`Hi ${name.split(" ")[0]}, we've received your renewal payment of <b>$${amount}</b> for the <b>${planLabel}</b> plan.`) +
      p("Your dashboard access continues uninterrupted.")
  );
}

export function passwordResetEmailHtml(name: string, resetUrl: string): string {
  return layout(
    "Reset your password",
    p(`Hi ${name.split(" ")[0]}, click the button below to choose a new password. This link expires in 1 hour and can only be used once.`) +
      button(resetUrl, "Reset password") +
      p("If you didn't request this, you can safely ignore this email.")
  );
}

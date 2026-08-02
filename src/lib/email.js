// =============================================================
// Email delivery via EmailJS (free, ~200 emails/month).
// The admin panel emails the unlock code to the buyer after
// verifying their NayaPay payment.
//
// Setup (one time, ~5 min):
//   1. Create a free account at https://www.emailjs.com
//   2. Add an Email Service (e.g. Gmail) -> gives Service ID
//   3. Email Templates -> New Template, use these variables:
//        {{to_email}}, {{code}}, {{plan}}, {{days}}, {{site}}
//   4. Copy Service ID, Template ID, and Public Key into config.js
// =============================================================
import { siteConfig } from "./config.js";

export function isEmailConfigured() {
  return !!(siteConfig.emailjs?.serviceId && siteConfig.emailjs?.templateId && siteConfig.emailjs?.publicKey);
}

export async function emailUnlockCode({ toEmail, code, plan, days }) {
  if (!isEmailConfigured()) {
    throw new Error("Email is not configured yet. Use WhatsApp to send the code.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    throw new Error("Please enter a valid email address.");
  }
  const { serviceId, templateId, publicKey } = siteConfig.emailjs;
  const emailjs = await import("@emailjs/browser");
  const params = {
    to_email: toEmail,
    code,
    plan,
    days,
    site: window.location.href.split("#")[0],
  };
  const res = await emailjs.send(serviceId, templateId, params, { publicKey });
  return res;
}

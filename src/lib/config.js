// =============================================================
// MONETIZATION CONFIG — edit these to start earning
// =============================================================
//
// Payments are collected via EasyPaisa (Pakistan). The buyer sees
// your account details on the checkout popup, transfers the money,
// then taps "I've paid" to confirm on WhatsApp — you verify and
// they're upgraded.

export const siteConfig = {
  name: "CareerUp AI",
  tagline: "Resume optimizer, cover letters & ATS checker powered by AI",

  // WhatsApp number in international format, digits only.
  // Used for sales chat + payment confirmation.
  whatsapp: "923028344138",

  // EasyPaisa receiving account — shown to buyers on the paywall.
  easypaisa: {
    accountName: "ASMA RAZA",
    accountNumber: "PK48TMFB0000000085237253",
    amountPKR: "1,500", // premium price in PKR
    proAmountPKR: "3,000", // pro price in PKR
  },

  // Card checkout (LemonSqueezy). Optional — leave "your-store" and
  // card payments stay hidden; EasyPaisa + WhatsApp are used instead.
  premiumCheckout: "https://your-store.lemonsqueezy.com/buy/xxxxxx",
  proCheckout: "https://your-store.lemonsqueezy.com/buy/xxxxxx",

  // SECRET for unlock codes. CHANGE THIS to any long random string —
  // the admin page uses it to generate codes after a EasyPaisa payment.
  // Keep it private (anyone with it can create free premium codes).
  unlockSecret: "careerup-dade1ecd42be1586d491102221a0ce0efe429db0af2784f6",

  // EmailJS — delivers unlock codes to buyers by email.
  // See src/lib/email.js for the 5-minute setup. Leave empty to
  // keep WhatsApp delivery only.
  emailjs: {
    serviceId: "", // e.g. "service_abc123"
    templateId: "", // e.g. "template_x9y8z7"
    publicKey: "", // e.g. "AbCdEf123456789"
  },

  // Social links used in the footer.
  socials: {
    linkedin: "https://www.linkedin.com/in/syed-hassan-a15a5537b",
    github: "#",
  },

  // Free tier limits
  freeDailyRewrites: 1,
  freeDailyCoverLetters: 0, // 0 = locked on free tier
};

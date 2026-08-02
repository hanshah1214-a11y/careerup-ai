// =============================================================
// MONETIZATION CONFIG — edit these to start earning
// =============================================================
//
// Payments are collected via NayaPay (Pakistan). The buyer sees
// your account details on the checkout popup, transfers the money,
// then taps "I've paid" to confirm on WhatsApp — you verify and
// they're upgraded.

export const siteConfig = {
  name: "CareerUp AI",
  tagline: "Resume optimizer, cover letters & ATS checker powered by AI",

  // WhatsApp number in international format, digits only.
  // Used for sales chat + payment confirmation.
  whatsapp: "923028344138",

  // NayaPay receiving account — shown to buyers on the paywall.
  nayaPay: {
    accountName: "SYED M HASSAN NAWAJ BUKHARI",
    accountNumber: "03028344138",
    amountPKR: "1,500", // premium price in PKR
    proAmountPKR: "3,000", // pro price in PKR
  },

  // Card checkout (LemonSqueezy). Optional — leave "your-store" and
  // card payments stay hidden; NayaPay + WhatsApp are used instead.
  premiumCheckout: "https://your-store.lemonsqueezy.com/buy/xxxxxx",
  proCheckout: "https://your-store.lemonsqueezy.com/buy/xxxxxx",

  // SECRET for unlock codes. CHANGE THIS to any long random string —
  // the admin page uses it to generate codes after a NayaPay payment.
  // Keep it private (anyone with it can create free premium codes).
  unlockSecret: "careerup-dade1ecd42be1586d491102221a0ce0efe429db0af2784f6",

  // Social links used in the footer.
  socials: {
    linkedin: "#",
    instagram: "#",
    github: "#",
  },

  // Free tier limits
  freeDailyRewrites: 1,
  freeDailyCoverLetters: 0, // 0 = locked on free tier
};

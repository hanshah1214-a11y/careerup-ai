// =============================================================
// MONETIZATION CONFIG — edit these to start earning
// =============================================================
//
// To start making money you need ONE of these:
//   A) Create a free LemonSqueezy store (lemonsqueezy.com) and
//      paste your checkout links below. It handles global card
//      payments, VAT, taxes and email delivery. Zero setup fee.
//   B) Or a Gumroad product link.
//   C) Or accept payments manually via WhatsApp/Bank and deliver
//      the premium unlock code by hand.
//
// Every "premium" button on the site will redirect to your
// checkout link so users can pay immediately.

export const siteConfig = {
  name: "CareerUp AI",
  tagline: "Resume optimizer, cover letters & ATS checker powered by AI",

  // WhatsApp number in international format, digits only.
  // Used for sales chat + manual payment checkout.
  whatsapp: "92XXXXXXXXXX",

  // Payment links (create a product called "CareerUp Premium").
  premiumCheckout: "https://your-store.lemonsqueezy.com/buy/xxxxxx",
  proCheckout: "https://your-store.lemonsqueezy.com/buy/xxxxxx",

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

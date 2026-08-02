# CareerUp AI — Resume Optimizer SaaS

AI resume optimizer, cover letter generator and ATS checker. Free tier + premium
subscription. Runs 100% client-side (zero AI API cost).

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Deploy to GitHub Pages (free, 3 steps)

1. Create a free repo at https://github.com/new (name it e.g. `careerup-ai`, keep it public).
2. In this folder run:
   ```bash
   git init
   git add -A
   git commit -m "initial"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/careerup-ai.git
   git push -u origin main
   ```
3. Install GitHub CLI once, login, then deploy:
   ```bash
   winget install GitHub.cli
   gh auth login
   npm run deploy
   ```
   Or skip the CLI and push manually, then in your repo go to
   **Settings → Pages → Branch: `gh-pages` → Save** and run `npm run deploy`.

Your site is live at `https://YOUR_USERNAME.github.io/careerup-ai/`

## Make money (5-minute setup)

Edit **`src/lib/config.js`**:

| Field | What to set |
|---|---|
| `whatsapp` | Your WhatsApp number, international digits only. Users pay you directly here. |
| `premiumCheckout` | Your free LemonSqueezy checkout link (lemonsqueezy.com — no setup fee, global card payments). |
| `proCheckout` | Your LemonSqueezy "Pro" checkout link. |
| `socials` | Your LinkedIn / Instagram / GitHub links. |

Then push and redeploy. All "Upgrade" buttons on the site point to your links.

## How the free→paid flow works

- Free: 1 resume rewrite / day. No account, no card.
- When the free limit is hit → paywall → pays on LemonSqueezy (card) **or** WhatsApp (manual).
- `sessionStorage` marks the user as premium for the session. Swap in a real
  license-check endpoint later if you want to lock it down harder.

## Monetization tips to earn in week 1

1. Post the live link on LinkedIn + student/HR Facebook groups daily.
2. Add a "Free vs Premium" comparison to your WhatsApp status.
3. Reach out to university career centers and placement offices (offers bulk deals).
4. Offer a one-time $5 lifetime code via WhatsApp to early users to bank quick cash.

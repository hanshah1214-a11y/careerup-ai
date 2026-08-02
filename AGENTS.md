# CareerUp AI — Project Memory (updated Aug 2026)

This file persists the working context across chats. Read it first before working on this project.

## What this is
CareerUp AI — resume optimizer + ATS checker + cover letter generator for Pakistani job seekers. Single-page React app, no backend (everything runs in-browser).

## Live URLs
- **Site (live):** https://hanshah1214-a11y.github.io/careerup-ai/ (GitHub Pages, HashRouter)
- **Repo:** https://github.com/hanshah1214-a11y/careerup-ai (branch `main`)
- **Admin panel:** `/#/admin` (footer "Seller Admin" link)

## Credentials / Secrets
- **Admin secret:** `careerup-dade1ecd42be1586d491102221a0ce0efe429db0af2784f6`
- **Payments:** EasyPaisa IBAN `PK48TMFB0000000085237253`, account title `ASMA RAZA`
- **WhatsApp (seller):** `923028344138` (+92 302 8344138)
- **Prices:** Premium Rs 1,500 / Pro Rs 3,000 (monthly)
- **EmailJS:** NOT configured — `src/lib/config.js` `emailjs.{serviceId,templateId,publicKey}` are empty. "Email code" button stays disabled until user supplies keys. WhatsApp code delivery works meanwhile.

## Owner / Seller
- GitHub: `hanshah1214-a11y`, LinkedIn: https://www.linkedin.com/in/syed-hassan-a15a5537b

## Monetization flow
1. Buyer clicks "Get Premium" → 3-step checkout wizard (`CheckoutModal.jsx`): Pay → Confirm (WhatsApp) → Redeem code.
2. Buyer transfers via EasyPaisa, taps "I've paid", WhatsApp opens with a prefilled confirmation.
3. Seller verifies in Admin (`src/pages/Admin.jsx`) and generates an HMAC-signed unlock code (`src/lib/unlock.js`): `CAREERUP-<PLAN>.<YYYY-MM-DD>.<NONCE>.<SIG>`.
4. Buyer pastes code on the site → premium activates (`src/lib/usePremium.js` reads `careerup_entitlement_v1` in localStorage).

## Tech / Stack
- React 19 + Vite 8 + Tailwind CSS 4 (via `@tailwindcss/vite`) + React Router 7 (HashRouter)
- `framer-motion` v12 for 3D tilt cards, scroll reveals, animated counters, page transitions, particles, aurora gradients
- `lucide-react` icons
- `mammoth.browser.js` + `pdfjs-dist` — lazy-loaded in `src/lib/engine.js` for .docx / .pdf parsing
- `@emailjs/browser` installed (unused until keys provided)
- Lint: `npm run lint` (oxlint). No test framework — engine/unlock verified via ad-hoc `node --input-type=module` runs.

## Key commands
- Dev server: `npm run dev` (defaults to 5173; starts at 5174 if 5173 busy)
- Build: `npm run build`
- **Deploy (IMPORTANT):**
  1. `Remove-Item -Recurse -Force node_modules\.cache\gh-pages` (only if "branch already exists" error)
  2. `$env:GIT_CONFIG_NOSYSTEM = "1"`
  3. `npx gh-pages -d dist --dotfiles`
- **Push with auth workaround:** `git -c credential.helper= -c credential.helper="!C:/Users/bombaytraders/AppData/Local/Temp/opencode/gh/bin/gh.exe auth git-credential" push origin main`
- gh CLI portable at `C:\Users\bombaytraders\AppData\Local\Temp\opencode\gh\bin\gh.exe` (logged in as `hanshah1214-a11y`)

## Features implemented
- AI resume rewrite to match job description; skill-gap chips (missing keywords)
- ATS score 0–100 + issues + keyword match + **keyword density** panel
- Cover letter generator with 3 styles (professional / short & punchy / enthusiastic)
- Interview Prep tab: behavioral/technical/fit + **STAR** method outline
- LinkedIn Toolkit tab
- PDF export with 3 templates (modern / professional / minimal) + .txt download
- Version history (save/load/delete, `careerup_versions`)
- Application tracker (Applied/Interview/Offer/Rejected, `careerup_apps`)
- ATS score history / Progress tab (`careerup_history`)
- Try-a-sample button (fills sample resume + job)
- Admin dashboard: secret login, plan/days picker, Generate/Copy/Email/WhatsApp delivery
- Homepage: PKR pricing, how-to-pay (4 steps), trust section (stats + testimonials), FAQ, 3D animated hero (tilt resume card, particles, aurora)

## Gotchas
- `inferJobRole` in engine.js uses `[role, ...keys]` destructure — do NOT change back to `[role, keys]` (was a crash bug).
- Blank white screen reported once = dev server had died (ERR_CONNECTION_REFUSED). Restart it.
- Respect `prefers-reduced-motion` (already handled in index.css).
- Testimonials array in Home.jsx: strings already contain curly quotes; do NOT wrap again with `“` in JSX (caused `““double quotes` bug — already fixed).

## Recent git log (latest first)
- `276097e` Switch payments to EasyPaisa: IBAN PK48TMFB0000000085237253, account ASMA RAZA
- `b886164` Add 3D animations and motion effects
- `bd2c97b` Add power features: sample resume, cover letter styles, PDF templates, app tracker, score history, keyword density, STAR questions, homepage trust section

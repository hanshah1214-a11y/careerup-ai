import { useState } from "react";
import {
  Lock, Sparkles, MessageCircle, CreditCard, ShieldCheck, X,
  CheckCircle2, KeyRound, Copy, Check, Mail, ChevronRight,
} from "lucide-react";
import { siteConfig } from "../lib/config.js";
import { verifyUnlockCode } from "../lib/unlock.js";

export function isCheckoutConfigured() {
  return (
    siteConfig.premiumCheckout &&
    /^https:\/\//.test(siteConfig.premiumCheckout) &&
    !siteConfig.premiumCheckout.includes("your-store")
  );
}

export function whatsappUrl(message) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

const STEPS = [
  { n: 1, label: "Pay" },
  { n: 2, label: "Confirm" },
  { n: 3, label: "Unlock" },
];

export default function CheckoutModal({ open, plan = "Premium", price = "$4", onClose, onUpgraded }) {
  const [step, setStep] = useState(1);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [busy, setBusy] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [redeemPlan, setRedeemPlan] = useState(plan);

  if (!open) return null;

  const cardReady = isCheckoutConfigured();
  const pkr = plan === "Pro" ? siteConfig.easypaisa.proAmountPKR : siteConfig.easypaisa.amountPKR;

  const handleCard = () => {
    if (cardReady) {
      window.open(siteConfig.premiumCheckout, "_blank", "noopener");
    }
  };

  const confirmWhatsApp = () => {
    const msg = `Hi! I have paid for CareerUp AI ${plan} (Rs ${pkr}) via EasyPaisa.\n\nAccount: ${siteConfig.easypaisa.accountName}\nIBAN: ${siteConfig.easypaisa.accountNumber}\n\nMy email for the unlock code: ${buyerEmail || "not provided"}\n\nHere is my payment screenshot/transaction ID. Please send my unlock code.`;
    window.open(whatsappUrl(msg), "_blank", "noopener");
  };

  const handleRedeem = async () => {
    if (!code.trim()) {
      setCodeError("Enter your code first.");
      return;
    }
    setBusy(true);
    setCodeError("");
    const res = await verifyUnlockCode(code);
    setBusy(false);
    if (res.ok) {
      setRedeemPlan(res.plan);
      onUpgraded?.(res.plan, res.expiresAt);
      setRedeemed(true);
    } else {
      setCodeError(res.error);
    }
  };

  const reset = () => {
    setStep(1);
    setCode("");
    setCodeError("");
    setRedeemed(false);
    setBuyerEmail("");
    setCopiedAcc(false);
    onClose();
  };

  const activeStep = redeemed ? 3 : step;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl fade-up my-auto">
        {/* Header */}
        <div className="px-7 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                  {redeemed ? `${redeemPlan} Active` : `Upgrade to ${plan}`}
                </h3>
                <p className="text-sm text-slate-500">
                  {redeemed ? "You're all set" : `${price} — unlimited everything`}
                </p>
              </div>
            </div>
            <button onClick={reset} className="text-slate-400 hover:text-slate-700 transition-colors" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Steps */}
          {!redeemed && (
            <div className="mt-5 flex items-center">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step > s.n
                          ? "bg-emerald-500 text-white"
                          : step === s.n
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {step > s.n ? <Check size={14} /> : s.n}
                    </div>
                    <span className={`mt-1.5 text-[11px] font-medium ${step >= s.n ? "text-slate-700" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full ${step > s.n ? "bg-emerald-500" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {redeemed ? (
            /* ---------- STEP 3 DONE ---------- */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={34} className="text-emerald-500" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 mb-1">Premium Unlocked!</h4>
              <p className="text-sm text-slate-500 mb-6">
                Unlimited rewrites, cover letters and ATS fixes are now active.
              </p>
              <button
                onClick={reset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
              >
                Start Using Premium
              </button>
            </div>
          ) : step === 1 ? (
            /* ---------- STEP 1: PAY ---------- */
            <div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">EasyPaisa (Pakistan)</p>
                    <p className="text-sm text-slate-500 mt-0.5">Send the exact amount below</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-slate-900">Rs {pkr}</p>
                    <p className="text-[11px] text-slate-400">{plan}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account title</span>
                    <span className="font-semibold text-slate-800">{siteConfig.easypaisa.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">EasyPaisa IBAN</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-800">{siteConfig.easypaisa.accountNumber}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(siteConfig.easypaisa.accountNumber);
                          setCopiedAcc(true);
                          setTimeout(() => setCopiedAcc(false), 1500);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        {copiedAcc ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        {copiedAcc ? "Copied" : "Copy"}
                      </button>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
                >
                  I've sent the payment <ChevronRight size={18} />
                </button>
              </div>

              {cardReady && (
                <>
                  <div className="flex items-center gap-3 my-4">
                    <span className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">or pay with card</span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <button
                    onClick={handleCard}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 font-bold px-5 py-3.5 rounded-xl transition-colors"
                  >
                    <CreditCard size={18} /> Pay with Card
                  </button>
                </>
              )}

              <button
                onClick={() => setStep(3)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                <KeyRound size={14} /> I already have an unlock code
              </button>
            </div>
          ) : step === 2 ? (
            /* ---------- STEP 2: CONFIRM ---------- */
            <div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                  <CheckCircle2 size={18} /> Payment sent — almost done
                </div>
                <p className="text-sm text-slate-600">
                  Confirm on WhatsApp with your screenshot. We'll send your unlock code to your email.
                </p>
              </div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Your email (for the unlock code)
              </label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={confirmWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
              >
                <MessageCircle size={18} /> Confirm on WhatsApp
              </button>
              <p className="text-xs text-slate-400 text-center mt-3">
                WhatsApp opens with a ready message — just add your screenshot and send.
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-3 w-full text-sm text-slate-500 hover:text-slate-800 font-medium"
              >
                ← Back to payment details
              </button>
            </div>
          ) : (
            /* ---------- STEP 3: UNLOCK ---------- */
            <div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-1">
                  <KeyRound size={18} /> Enter your unlock code
                </div>
                <p className="text-sm text-slate-600">
                  Check your email or WhatsApp — paste the code we sent you to activate premium.
                </p>
              </div>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                placeholder="CAREERUP-...-...-..."
                autoFocus
                className="w-full border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-mono mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {codeError && <p className="text-sm text-rose-600 mb-3">{codeError}</p>}
              <button
                onClick={handleRedeem}
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 rounded-xl transition-colors disabled:opacity-60"
              >
                <KeyRound size={18} /> {busy ? "Verifying…" : "Activate Premium"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="mt-3 w-full text-sm text-slate-500 hover:text-slate-800 font-medium"
              >
                ← Pay instead
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!redeemed && (
          <div className="px-7 pb-6">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-4">
              <ShieldCheck size={14} className="text-emerald-600" />
              7-day money-back guarantee · Instant access after verification
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

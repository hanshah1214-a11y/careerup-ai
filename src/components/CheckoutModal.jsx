import { useState } from "react";
import { Lock, Sparkles, MessageCircle, CreditCard, ShieldCheck, X, CheckCircle2, KeyRound } from "lucide-react";
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

export default function CheckoutModal({ open, plan = "Premium", price = "$4", onClose, onUpgraded }) {
  const [paid, setPaid] = useState(false);
  const [mode, setMode] = useState("pay");
  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState("");
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  const cardReady = isCheckoutConfigured();
  const pkr = plan === "Pro" ? siteConfig.nayaPay.proAmountPKR : siteConfig.nayaPay.amountPKR;

  const handleCard = () => {
    if (cardReady) {
      window.open(siteConfig.premiumCheckout, "_blank", "noopener");
      onUpgraded?.();
    }
  };

  const handleRedeem = async () => {
    if (!code.trim()) {
      setCodeStatus("Enter your code first.");
      return;
    }
    setBusy(true);
    setCodeStatus("");
    const res = await verifyUnlockCode(code);
    setBusy(false);
    if (res.ok) {
      setCodeStatus("");
      onUpgraded?.(res.plan, res.expiresAt);
      setMode("redeemed");
    } else {
      setCodeStatus(res.error);
    }
  };

  const confirmMessage = `Hi! I have paid for CareerUp AI ${plan} (Rs ${pkr}) via NayaPay.\n\nAccount: ${siteConfig.nayaPay.accountName}\nTo: ${siteConfig.nayaPay.accountNumber}\n\nHere is my payment screenshot/transaction ID. Please upgrade my account.`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-7 fade-up">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lock size={24} />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Upgrade to {plan}</h3>
        <p className="text-sm text-slate-600 mb-5">
          Unlimited rewrites, unlimited cover letters, and detailed ATS fixes.
        </p>

        {mode === "redeemed" ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Premium unlocked!</h4>
            <p className="text-sm text-slate-600 mb-4">
              Your account is now {plan}. Enjoy unlimited rewrites and cover letters.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
            >
              Start using Premium
            </button>
          </div>
        ) : mode === "code" ? (
          <>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5">
                <KeyRound size={12} className="text-indigo-500" /> Have an unlock code?
              </p>
              <p className="text-sm text-slate-600 mb-3">
                Paid via NayaPay or got a code from the seller? Enter it below.
              </p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                placeholder="CAREERUP-..."
                autoFocus
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              />
              {codeStatus && (
                <p className={`text-sm mb-3 ${codeStatus.includes("unlocked") ? "text-emerald-600" : "text-rose-600"}`}>{codeStatus}</p>
              )}
              <button
                onClick={handleRedeem}
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                <KeyRound size={16} /> {busy ? "Verifying…" : "Redeem Code"}
              </button>
            </div>
            <button
              onClick={() => setMode("pay")}
              className="w-full text-sm text-slate-500 hover:text-slate-800 font-medium"
            >
              ← Pay instead
            </button>
          </>
        ) : paid ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Almost done!</h4>
            <p className="text-sm text-slate-600 mb-4">
              Open WhatsApp and send your payment screenshot. I'll upgrade you the moment it's verified.
            </p>
            <a
              href={whatsappUrl(confirmMessage)}
              target="_blank"
              rel="noreferrer"
              onClick={onUpgraded}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
            >
              <MessageCircle size={18} /> Send confirmation on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="mt-3 w-full text-sm text-slate-500 hover:text-slate-800 font-medium"
            >
              I'll come back later
            </button>
          </div>
        ) : (
          <>
            {/* NayaPay — primary method */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-500" /> Pay via NayaPay (Pakistan)
              </p>
              <div className="text-sm space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-slate-900">Rs {pkr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account title</span>
                  <span className="font-medium text-slate-800">{siteConfig.nayaPay.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NayaPay no.</span>
                  <span className="font-mono font-medium text-slate-800">{siteConfig.nayaPay.accountNumber}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(siteConfig.nayaPay.accountNumber);
                  }}
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                  Copy NayaPay no.
                </button>
                <button
                  onClick={() => setPaid(true)}
                  className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                  I've paid — confirm
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Send the exact amount, then tap "I've paid" to confirm on WhatsApp.
              </p>
            </div>

            {/* Card — only when configured */}
            {cardReady && (
              <>
                <button
                  onClick={handleCard}
                  className={`w-full flex items-center justify-center gap-2 font-bold px-5 py-3.5 rounded-xl mb-3 transition-colors bg-indigo-600 hover:bg-indigo-700 text-white`}
                >
                  <CreditCard size={18} /> Pay with Card
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span className="flex-1 h-px bg-slate-200" /> or <span className="flex-1 h-px bg-slate-200" />
                </div>
              </>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-emerald-600" />
              7-day money-back guarantee. Instant access after verification.
            </div>

            <button
              onClick={() => setMode("code")}
              className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              <KeyRound size={14} /> I have an unlock code
            </button>
          </>
        )}

        {!paid && mode !== "code" && mode !== "redeemed" && (
          <button
            onClick={onClose}
            className="mt-4 w-full text-sm text-slate-500 hover:text-slate-800 font-medium"
          >
            Not now — I'll use the free tier
          </button>
        )}
      </div>
    </div>
  );
}

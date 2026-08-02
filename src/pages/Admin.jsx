import { useState } from "react";
import { KeyRound, Copy, Check, ShieldCheck, Lock, Clock } from "lucide-react";
import { generateUnlockCode } from "../lib/unlock.js";
import { siteConfig } from "../lib/config.js";

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("careerup_admin") === "1");
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [plan, setPlan] = useState("premium");
  const [days, setDays] = useState(30);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (pin.trim() === siteConfig.unlockSecret) {
      sessionStorage.setItem("careerup_admin", "1");
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Wrong secret. Use the one in src/lib/config.js");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    const c = await generateUnlockCode(plan, Number(days) || 30);
    setCode(c);
    setGenerating(false);
    setCopied(false);
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Seller Admin</h1>
          <p className="text-sm text-slate-500 mb-5">
            Enter your unlock secret to generate premium codes after a NayaPay payment.
          </p>
          <form onSubmit={handleAuth} className="space-y-3">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Your secret"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            {authError && <p className="text-sm text-rose-600">{authError}</p>}
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-xl transition-colors">
              Unlock Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <KeyRound className="text-indigo-600" /> Generate Unlock Code
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            After a buyer pays via NayaPay, create a code and send it to them on WhatsApp.
          </p>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("careerup_admin"); setAuthed(false); }}
          className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
        >
          Lock
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Plan</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlan("premium")}
                className={`text-center font-semibold px-4 py-2.5 rounded-xl border transition-colors ${
                  plan === "premium" ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400"
                }`}
              >
                Premium — Rs 1,500
              </button>
              <button
                type="button"
                onClick={() => setPlan("pro")}
                className={`text-center font-semibold px-4 py-2.5 rounded-xl border transition-colors ${
                  plan === "pro" ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400"
                }`}
              >
                Pro — Rs 3,000
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock size={14} /> Valid for (days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <KeyRound size={16} /> {generating ? "Generating…" : "Generate Code"}
          </button>
        </form>
      </div>

      {code && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-2">
            <ShieldCheck size={16} /> Code generated — send it to the buyer on WhatsApp
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl p-4 font-mono text-sm text-slate-800 break-all mb-3 select-all">
            {code}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Code"}
            </button>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Here is your CareerUp AI unlock code:\n\n" + code + "\n\nEnter it on the site (Pay > I have an unlock code) to activate " + (plan === "pro" ? "Pro" : "Premium") + ". Valid " + days + " days.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Send via WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500">
        <p className="font-semibold text-slate-600 mb-1">How it works</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Buyer sends Rs {plan === "pro" ? "3,000" : "1,500"} to your NayaPay account.</li>
          <li>They confirm on WhatsApp and send the screenshot.</li>
          <li>Verify the payment, then generate a code above and send it back.</li>
          <li>They redeem it on the site and premium activates instantly.</li>
        </ol>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  KeyRound, Copy, Check, ShieldCheck, Lock, Clock, Mail, Send,
  LayoutDashboard, LogOut, Package, User, QrCode,
} from "lucide-react";
import { generateUnlockCode } from "../lib/unlock.js";
import { emailUnlockCode, isEmailConfigured } from "../lib/email.js";
import { siteConfig } from "../lib/config.js";

function LoginCard({ pin, setPin, authError, handleAuth }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm fade-up">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-5">
          <Lock size={22} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Seller Dashboard</h1>
        <p className="text-sm text-slate-500 mb-6">
          Generate unlock codes for buyers after verifying their EasyPaisa payment.
        </p>
        <form onSubmit={handleAuth} className="space-y-3">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your secret key"
            className="w-full border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {authError && <p className="text-sm text-rose-600">{authError}</p>}
          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-xl transition-colors">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("careerup_admin") === "1");
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [plan, setPlan] = useState("premium");
  const [days, setDays] = useState(30);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [sending, setSending] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (pin.trim() === siteConfig.unlockSecret) {
      sessionStorage.setItem("careerup_admin", "1");
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Wrong secret key. Try again.");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    const c = await generateUnlockCode(plan, Number(days) || 30);
    setCode(c);
    setGenerating(false);
    setCopied(false);
    setEmailStatus("");
  };

  const handleEmail = async () => {
    if (!code) {
      setEmailStatus("Generate a code first.");
      return;
    }
    setSending(true);
    setEmailStatus("");
    try {
      await emailUnlockCode({
        toEmail: buyerEmail.trim(),
        code,
        plan: plan === "pro" ? "Pro" : "Premium",
        days,
      });
      setEmailStatus("Code sent to buyer's email.");
    } catch (err) {
      setEmailStatus(err.message);
    }
    setSending(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!authed) {
    return <LoginCard pin={pin} setPin={setPin} authError={authError} handleAuth={handleAuth} />;
  }

  const amount = plan === "pro" ? "Rs 3,000" : "Rs 1,500";
  const planLabel = plan === "pro" ? "Pro" : "Premium";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">Seller Dashboard</h1>
            <p className="text-sm text-slate-500">CareerUp AI · unlock code manager</p>
          </div>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("careerup_admin"); setAuthed(false); }}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 font-semibold"
        >
          <LogOut size={15} /> Lock
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: generate */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Package size={18} className="text-indigo-600" /> New code
            </h2>
            <p className="text-sm text-slate-500 mb-5">Create a code for a verified payment.</p>
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Plan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlan("premium")}
                    className={`text-center font-semibold px-4 py-3 rounded-xl border transition-colors ${
                      plan === "premium" ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400"
                    }`}
                  >
                    Premium
                    <span className={`block text-[11px] font-normal mt-0.5 ${plan === "premium" ? "text-indigo-200" : "text-slate-400"}`}>Rs 1,500</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlan("pro")}
                    className={`text-center font-semibold px-4 py-3 rounded-xl border transition-colors ${
                      plan === "pro" ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400"
                    }`}
                  >
                    Pro
                    <span className={`block text-[11px] font-normal mt-0.5 ${plan === "pro" ? "text-indigo-200" : "text-slate-400"}`}>Rs 3,000</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5">
                  <Clock size={12} /> Valid for (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3.5 rounded-xl transition-colors disabled:opacity-60"
              >
                <QrCode size={16} /> {generating ? "Generating…" : "Generate Code"}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-500">
            <p className="font-bold text-slate-600 mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> How to use
            </p>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Buyer pays <b>{amount}</b> to your EasyPaisa account.</li>
              <li>They confirm on WhatsApp with a screenshot.</li>
              <li>Verify the money, then generate a code here.</li>
              <li>Email it or send on WhatsApp — buyer pastes it on the site.</li>
            </ol>
          </div>
        </div>

        {/* Right: result / delivery */}
        <div className="lg:col-span-3">
          {!code ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <QrCode size={26} />
              </div>
              <p className="font-semibold text-slate-700">No code yet</p>
              <p className="text-sm text-slate-400 mt-1 max-w-xs">
                Generate a code and it will appear here ready to deliver.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" /> Code ready
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {planLabel} · {days} days · expires {new Date(Date.now() + days * 864e5).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <Check size={12} /> Active
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-800 break-all select-all mb-5">
                {code}
              </div>

              {/* Email delivery */}
              <div className="border border-slate-200 rounded-xl p-4 mb-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5">
                  <Mail size={12} className="text-indigo-500" /> Buyer's email
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="buyer@email.com"
                    className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleEmail}
                    disabled={sending || !isEmailConfigured()}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Send size={14} /> {sending ? "Sending…" : "Email Code"}
                  </button>
                </div>
                {emailStatus && (
                  <p className={`text-sm mt-2 ${emailStatus.includes("sent") ? "text-emerald-600" : "text-amber-600"}`}>{emailStatus}</p>
                )}
                {!isEmailConfigured() && (
                  <p className="text-[11px] text-slate-400 mt-2">
                    Email not configured — see src/lib/email.js. WhatsApp works meanwhile.
                  </p>
                )}
              </div>

              {/* Manual delivery */}
              <div className="flex gap-2">
                <button
                  onClick={copyCode}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Code"}
                </button>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Here is your CareerUp AI unlock code:\n\n" + code + "\n\nEnter it on the site (Pay > I already have an unlock code) to activate " + planLabel + ". Valid " + days + " days.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
                >
                  <User size={16} /> Send via WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

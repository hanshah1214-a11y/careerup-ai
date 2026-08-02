import { useRef, useState } from "react";
import {
  Upload, Wand2, Copy, Check, Download, Lock, Sparkles,
  MessageCircle, FileText, Gauge, AlertTriangle,
} from "lucide-react";
import {
  readResumeFile, parseResume, optimizeResume, generateCoverLetter, scoreResume,
} from "../lib/engine.js";
import { usePremium } from "../lib/usePremium.js";
import { siteConfig } from "../lib/config.js";

export default function Builder() {
  const { isPremium, upgrade, remaining, consume } = usePremium();
  const [step, setStep] = useState(1);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("resume");
  const [copied, setCopied] = useState("");
  const [editableResume, setEditableResume] = useState("");
  const [company, setCompany] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [featureGate, setFeatureGate] = useState("");
  const fileRef = useRef(null);

  const freeLeft = remaining("rewrites", siteConfig.freeDailyRewrites);
  const coverLeft = remaining("covers", siteConfig.freeDailyCoverLetters);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const text = await readResumeFile(file);
      setResumeText(text);
      setFileName(file.name);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
    e.target.value = "";
  };

  const canOptimize = !isPremium && freeLeft <= 0;

  const handleOptimize = () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      setError("Please add your resume and a job description first.");
      return;
    }
    if (canOptimize) {
      setFeatureGate("Unlimited resume rewrites");
      setShowPaywall(true);
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      try {
        const parsed = parseResume(resumeText);
        const optimized = optimizeResume(parsed, jobDesc);
        const score = scoreResume(parsed, jobDesc);
        const cover = generateCoverLetter(parsed, optimized, jobDesc, company);
        setResult({ parsed, optimized, score, cover });
        setEditableResume(formatResume(optimized));
        setStep(3);
        if (!isPremium) consume("rewrites");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        setError("Something went wrong. Check your input and try again.");
      }
      setLoading(false);
    }, 900);
  };

  const handleCover = () => {
    if (!result) return;
    if (!isPremium && coverLeft <= 0) {
      setFeatureGate("Unlimited cover letters");
      setShowPaywall(true);
      return;
    }
    setTab("cover");
    if (!isPremium) consume("covers");
  };

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([editableResume], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "optimized-resume.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const gaugeColor = result?.score.score >= 75 ? "text-emerald-500" : result?.score.score >= 50 ? "text-amber-500" : "text-rose-500";
  const gaugeStroke = result?.score.score >= 75 ? "#10b981" : result?.score.score >= 50 ? "#f59e0b" : "#f43f5e";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Resume Optimizer</h1>
      <p className="text-slate-500 mb-8">
        {isPremium
          ? "Premium active — unlimited optimizations. Enjoy!"
          : `Free tier: ${freeLeft} rewrite${freeLeft === 1 ? "" : "s"} left today.`}
      </p>

      {step === 1 && (
        <div className="fade-up grid gap-6 lg:grid-cols-2">
          {/* Resume input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><FileText size={18} className="text-indigo-600" /> 1. Your resume</h2>
            <p className="text-sm text-slate-500 mb-4">Upload a PDF/TXT or paste your resume below.</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl py-8 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Upload size={24} />
              <span className="font-medium">{fileName || "Click to upload PDF / TXT"}</span>
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.md,.rtf,.doc,.docx" className="hidden" onChange={handleFile} />
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="…or paste your full resume text here"
              rows={10}
              className="mt-4 w-full border border-slate-300 rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Job description input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Sparkles size={18} className="text-indigo-600" /> 2. The job</h2>
            <p className="text-sm text-slate-500 mb-4">Paste the full job description you're applying to.</p>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description here…"
              rows={10}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name (for cover letter) — optional"
              className="mt-4 w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {error && (
              <div className="mt-4 flex items-start gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-60"
            >
              <Wand2 size={18} /> {loading ? "Optimizing…" : "Optimize My Resume"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="fade-up space-y-6">
          {/* ATS score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 grid gap-6 md:grid-cols-3 items-center">
            <div className="flex items-center gap-4">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="48" cy="48" r="40" fill="none"
                  stroke={gaugeStroke} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(result.score.score / 100) * 251.3} 251.3`}
                  transform="rotate(-90 48 48)"
                />
              </svg>
              <div>
                <div className={`text-4xl font-extrabold ${gaugeColor}`}>{result.score.score}</div>
                <div className="text-sm text-slate-500">ATS score</div>
                <div className="text-xs text-slate-400 mt-1">{result.score.matched}/{result.score.total} keywords matched</div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Gauge size={16} className="text-indigo-600" /> How to improve</h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {result.score.issues.slice(0, 4).map((issue) => (
                  <li key={issue} className="flex items-start gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" /> {issue}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.optimized.keywords.slice(0, 8).map((k) => (
                  <span key={k} className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Output tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setTab("resume")}
                className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors ${tab === "resume" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Optimized Resume
              </button>
              <button
                onClick={() => setTab("cover")}
                className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors ${tab === "cover" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Cover Letter
              </button>
            </div>

            <div className="p-5">
              {tab === "resume" && (
                <>
                  <textarea
                    value={editableResume}
                    onChange={(e) => setEditableResume(e.target.value)}
                    rows={18}
                    className="w-full border border-slate-300 rounded-xl p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-y"
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => copy(editableResume, "resume")} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                      {copied === "resume" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} {copied === "resume" ? "Copied!" : "Copy Resume"}
                    </button>
                    <button onClick={download} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                      <Download size={16} /> Download .txt
                    </button>
                    <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                      <FileText size={16} /> Print / Save PDF
                    </button>
                  </div>
                </>
              )}

              {tab === "cover" && (
                <div className="space-y-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 border border-slate-200 rounded-xl p-5 leading-relaxed text-slate-800">
                    {result.cover}
                  </pre>
                  <button onClick={() => copy(result.cover, "cover")} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                    {copied === "cover" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} {copied === "cover" ? "Copied!" : "Copy Cover Letter"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              onClick={handleOptimize}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition-colors"
            >
              <Wand2 size={16} /> Optimize Again
            </button>
            <button onClick={handleCover} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 font-bold px-4 py-3 rounded-xl transition-colors">
              <Sparkles size={16} /> Generate Cover Letter
            </button>
            <button onClick={() => { setStep(1); setResult(null); }} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 font-bold px-4 py-3 rounded-xl transition-colors">
              <Upload size={16} /> New Resume
            </button>
          </div>
        </div>
      )}

      {/* Paywall modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 fade-up">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Unlock {featureGate}</h3>
            <p className="text-sm text-slate-600 mb-5">
              Upgrade to Premium for just <span className="font-bold">$4/month</span> and get unlimited
              rewrites, unlimited cover letters, and detailed ATS fixes.
            </p>
            <a
              href={siteConfig.premiumCheckout}
              target="_blank"
              rel="noreferrer"
              onClick={upgrade}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 rounded-xl mb-3 transition-colors"
            >
              <Sparkles size={18} /> Upgrade — Pay with Card
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi! I want to subscribe to CareerUp AI Premium.")}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
            >
              <MessageCircle size={18} /> Pay via WhatsApp
            </a>
            <button
              onClick={() => setShowPaywall(false)}
              className="mt-4 w-full text-sm text-slate-500 hover:text-slate-800 font-medium"
            >
              Not now — I'll use the free tier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatResume(opt) {
  const parts = [opt.name.toUpperCase()];
  if (opt.contact.length) parts.push(opt.contact.join("  |  "));
  parts.push("");
  parts.push("PROFESSIONAL SUMMARY");
  parts.push(opt.summary);
  parts.push("");
  parts.push("CORE SKILLS");
  parts.push(opt.skills.join(", "));
  if (opt.experience.length) {
    parts.push("");
    parts.push("PROFESSIONAL EXPERIENCE");
    opt.experience.forEach((b) => parts.push("• " + b));
  }
  if (opt.projects.length) {
    parts.push("");
    parts.push("PROJECTS");
    opt.projects.forEach((b) => parts.push("• " + b));
  }
  if (opt.education.length) {
    parts.push("");
    parts.push("EDUCATION");
    opt.education.forEach((b) => parts.push("• " + b));
  }
  return parts.join("\n");
}

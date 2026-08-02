import { Link } from "react-router-dom";
import {
  FileText, Wand2, SearchCheck, Mail, TrendingUp, ShieldCheck,
  Check, Sparkles, ArrowRight, ChevronDown,
} from "lucide-react";
import { siteConfig } from "../lib/config.js";

const features = [
  { icon: Wand2, title: "AI Resume Rewriting", desc: "Paste your resume and a job post — get a tailored, action-verb-powered version optimized for that exact role." },
  { icon: SearchCheck, title: "ATS Compatibility Score", desc: "See a 0–100 score with the exact keywords missing so you pass automated filters recruiters use." },
  { icon: Mail, title: "Cover Letter Generator", desc: "One-click tailored cover letters that match your resume to the job description. (Premium)" },
  { icon: TrendingUp, title: "Keyword Extraction", desc: "We automatically pull the top skills recruiters want and inject them into your resume." },
  { icon: ShieldCheck, title: "Private & Secure", desc: "Everything runs in your browser. Your resume is never uploaded to any server." },
  { icon: Sparkles, title: "Free Forever", desc: "One free rewrite every day. Upgrade only when you need unlimited access." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Start Free",
    highlight: false,
    perks: ["1 AI resume rewrite / day", "ATS compatibility score", "Keyword extraction", "Resume stored only in your browser"],
  },
  {
    name: "Premium",
    price: "$4",
    period: "/month",
    cta: "Get Premium",
    highlight: true,
    perks: ["Unlimited AI rewrites", "Unlimited cover letters", "ATS score with detailed fixes", "Priority support", "New features first"],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    cta: "Get Pro",
    highlight: false,
    perks: ["Everything in Premium", "Multi-version resume tracking", "LinkedIn profile suggestions", "Interview prep checklist"],
  },
];

export default function Home() {
  const upgradeUrl = (plan) =>
    plan === "Free" ? "/app" : siteConfig.premiumCheckout;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="fade-up inline-flex items-center gap-2 text-sm font-medium text-indigo-700 bg-indigo-100/70 border border-indigo-200 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={14} /> AI that gets you more interviews
          </div>
          <h1 className="fade-up text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight max-w-3xl mx-auto">
            Land more interviews with an <span className="text-indigo-600">AI-optimized resume</span>
          </h1>
          <p className="fade-up mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
            {siteConfig.name} rewrites your resume to match any job, checks how well it
            passes ATS filters, and writes tailored cover letters — in minutes, free.
          </p>
          <div className="fade-up mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              Optimize My Resume Free <ArrowRight size={18} />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              See Pricing
            </a>
          </div>
          <div className="fade-up mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            {[["0", "API keys needed"], ["<2 min", "per optimization"], ["$0", "to get started"]].map(([v, l]) => (
              <div key={l} className="bg-white/70 border border-slate-200 rounded-xl py-4">
                <div className="text-xl font-bold text-slate-900">{v}</div>
                <div className="text-xs text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Everything you need to get hired</h2>
        <p className="text-center text-slate-500 mb-12">Job hunting is a numbers game — we stack the odds in your favor.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <f.icon size={22} />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["1", "Upload or paste", "Drop your resume (PDF or TXT) or paste the text. Nothing leaves your browser."],
              ["2", "Paste the job post", "Copy the job description you're applying for — we extract exactly what recruiters want."],
              ["3", "Get your optimized resume", "Review your rewritten resume, ATS score and fixes. Apply with confidence."],
            ].map(([n, t, d]) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">{n}</div>
                <h3 className="font-bold text-slate-900 mb-1">{t}</h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Simple pricing that pays for itself</h2>
        <p className="text-center text-slate-500 mb-12">One interview landed easily covers the cost of a year.</p>
        <div className="grid gap-6 md:grid-cols-3 items-stretch max-w-4xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl p-7 border transition-all ${
                p.highlight
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-indigo-300"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <h3 className={`font-bold text-lg ${p.highlight ? "text-white" : "text-slate-900"}`}>{p.name}</h3>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-extrabold">{p.price}</span>
                <span className={p.highlight ? "text-slate-400" : "text-slate-500"}> {p.period}</span>
              </div>
              <ul className="space-y-2 mb-7 flex-1">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <Check size={16} className={p.highlight ? "text-emerald-400 mt-0.5 shrink-0" : "text-emerald-600 mt-0.5 shrink-0"} />
                    <span className={p.highlight ? "text-slate-300" : "text-slate-600"}>{perk}</span>
                  </li>
                ))}
              </ul>
              <a
                href={upgradeUrl(p)}
                className={`text-center font-semibold px-4 py-3 rounded-xl transition-all ${
                  p.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Frequently asked questions</h2>
          <div className="space-y-3">
            {[
              ["Is my resume safe?", "Yes. Everything runs in your browser — we never store or send your resume anywhere."],
              ["Why do I need an ATS score?", "Over 75% of resumes are rejected by automated systems before a human sees them. We tell you exactly what to fix."],
              ["How is the AI free?", "Our optimizer runs on smart in-browser AI so the free tier has no hidden costs for us — that's why it stays free."],
              ["How do I pay for Premium?", "Click Get Premium and pay with any card via our secure checkout. You get instant access."],
              ["Can I get a refund?", "Yes — 7-day money-back guarantee, no questions asked. Message us on WhatsApp."],
            ].map(([q, a]) => (
              <details key={q} className="group bg-slate-50 border border-slate-200 rounded-xl p-5">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-slate-900 list-none">
                  {q}
                  <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={18} />
                </summary>
                <p className="mt-3 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <FileText className="mx-auto text-indigo-500 mb-4" size={40} />
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Your next job is one resume away</h2>
        <p className="text-slate-600 mb-8">Optimize your first resume for free — takes less than two minutes.</p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
        >
          Optimize My Resume <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}

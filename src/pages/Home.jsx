import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Wand2, SearchCheck, Mail, TrendingUp, ShieldCheck,
  Check, Sparkles, ArrowRight, ChevronDown,
} from "lucide-react";
import { siteConfig } from "../lib/config.js";
import CheckoutModal from "../components/CheckoutModal.jsx";
import Reveal from "../components/Reveal.jsx";
import TiltCard from "../components/TiltCard.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import Particles from "../components/Particles.jsx";
import HeroResumeCard from "../components/HeroResumeCard.jsx";

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
    price: "Rs 1,500",
    period: "/month",
    cta: "Get Premium",
    highlight: true,
    perks: ["Unlimited AI rewrites", "Unlimited cover letters", "ATS score with detailed fixes", "Priority support", "New features first"],
  },
  {
    name: "Pro",
    price: "Rs 3,000",
    period: "/month",
    cta: "Get Pro",
    highlight: false,
    perks: ["Everything in Premium", "Multi-version resume tracking", "LinkedIn profile suggestions", "Interview prep checklist"],
  },
];

export default function Home() {
  const [checkout, setCheckout] = useState(null);

  const openCheckout = (plan) => {
    if (plan === "Free") return;
    setCheckout(plan === "Pro" ? { plan: "Pro", price: "Rs 3,000" } : { plan: "Premium", price: "Rs 1,500" });
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-drift" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl animate-drift" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-fuchsia-200/30 rounded-full blur-3xl animate-drift" />
        <Particles count={22} />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 bg-indigo-100/70 border border-indigo-200 rounded-full px-4 py-1.5 mb-6"
              >
                <Sparkles size={14} /> AI that gets you more interviews
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight"
              >
                Land more interviews with an <span className="gradient-text">AI-optimized resume</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-5 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0"
              >
                {siteConfig.name} rewrites your resume to match any job, checks how well it
                passes ATS filters, and writes tailored cover letters — in minutes, free.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
              >
                <Link
                  to="/app"
                  className="btn-shine inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 pulse-ring"
                >
                  Optimize My Resume Free <ArrowRight size={18} />
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-7 py-3.5 rounded-xl transition-colors"
                >
                  See Pricing
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
              >
                {[["0", "API keys needed"], ["<2 min", "per optimization"], ["$0", "to get started"]].map(([v, l]) => (
                  <div key={l} className="bg-white/70 border border-slate-200 rounded-xl py-4 backdrop-blur-sm">
                    <div className="text-xl font-bold text-slate-900">{v}</div>
                    <div className="text-xs text-slate-500">{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -12 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <HeroResumeCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <Reveal>
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Everything you need to get hired</h2>
          <p className="text-center text-slate-500 mb-12">Job hunting is a numbers game — we stack the odds in your favor.</p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <TiltCard className="h-full">
                <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-shadow group" style={{ transformStyle: "preserve-3d" }}>
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors" style={{ transform: "translateZ(30px)" }}>
                    <f.icon size={22} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1" style={{ transform: "translateZ(20px)" }}>{f.title}</h3>
                  <p className="text-sm text-slate-600">{f.desc}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <Reveal>
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How it works</h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["1", "Upload or paste", "Drop your resume (PDF or TXT) or paste the text. Nothing leaves your browser."],
              ["2", "Paste the job post", "Copy the job description you're applying for — we extract exactly what recruiters want."],
              ["3", "Get your optimized resume", "Review your rewritten resume, ATS score and fixes. Apply with confidence."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.15}>
                <div className="text-center group">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-indigo-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30"
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  >
                    {n}
                  </motion.div>
                  <h3 className="font-bold text-slate-900 mb-1">{t}</h3>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20">
        <Reveal>
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Simple pricing that pays for itself</h2>
          <p className="text-center text-slate-500 mb-12">One interview landed easily covers the cost of a year.</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3 items-stretch max-w-4xl mx-auto">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.12} className="h-full">
              <TiltCard max={8} className="h-full">
                <div
                  className={`relative flex flex-col rounded-2xl p-7 border transition-shadow h-full ${
                    p.highlight
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]"
                      : "bg-white border-slate-200 hover:shadow-lg hover:border-indigo-300"
                  }`}
                >
                  {p.highlight && (
                    <motion.span
                      initial={{ y: -10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full"
                    >
                      MOST POPULAR
                    </motion.span>
                  )}
                  <h3 className={`font-bold text-lg ${p.highlight ? "text-white" : "text-slate-900"}`}>{p.name}</h3>
                  <div className="mt-3 mb-5">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    <span className={p.highlight ? "text-slate-400" : "text-slate-500"}> {p.period}</span>
                  </div>
                  <ul className="space-y-2 mb-7 flex-1">
                    {p.perks.map((perk, j) => (
                      <motion.li
                        key={perk}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.08 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check size={16} className={p.highlight ? "text-emerald-400 mt-0.5 shrink-0" : "text-emerald-600 mt-0.5 shrink-0"} />
                        <span className={p.highlight ? "text-slate-300" : "text-slate-600"}>{perk}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.a
                    href={p.name === "Free" ? "/app" : undefined}
                    onClick={(e) => {
                      if (p.name !== "Free") {
                        e.preventDefault();
                        openCheckout(p.name);
                      }
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`text-center font-semibold px-4 py-3 rounded-xl transition-colors cursor-pointer block ${
                      p.highlight
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    {p.cta}
                  </motion.a>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW TO PAY */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Reveal>
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-3">How payment works</h2>
            <p className="text-center text-slate-500 mb-12">Pay safely via EasyPaisa — your account is activated within minutes.</p>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              ["1", "Send payment", `Transfer the plan amount to EasyPaisa ${siteConfig.easypaisa.accountNumber} (${siteConfig.easypaisa.accountName}).`],
              ["2", "Confirm on WhatsApp", "Tap confirm after paying and send us your payment screenshot."],
              ["3", "Receive your code", "We verify and email your personal unlock code instantly."],
              ["4", "Paste & enjoy", "Enter the code on the checkout popup and premium activates right away."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.1}>
                <div className="text-center">
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  >
                    {n}
                  </motion.div>
                  <h3 className="font-bold text-slate-900 mb-1">{t}</h3>
                  <p className="text-sm text-slate-600">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <Reveal>
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-3">Trusted by job seekers</h2>
            <p className="text-center text-slate-500 mb-12">Real results from people who stopped guessing and started landing interviews.</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [40, "%", "Average ATS score jump after one pass"],
              [2, " weeks", "Median time to first interview invite"],
              [4.8, "/5", "Rating from our beta users"],
            ].map(([stat, suffix, label], i) => (
              <Reveal key={label} delay={i * 0.1}>
                <TiltCard max={6} className="h-full">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center h-full">
                    <div className="text-4xl font-extrabold text-indigo-600">
                      <AnimatedCounter value={stat} suffix={suffix} />
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{label}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            {[
              ["“The keyword fixes got my resume past the bots. Three interviews in the first two weeks.”", "Ayesha R., Marketing", "bg-slate-100"],
              ["“The cover letter rewrites alone were worth it. Shortlisted at two companies the same week.”", "Bilal K., Software Engineer", "bg-indigo-50"],
              ["“Simple, fast, and the WhatsApp activation took minutes. Worth every rupee.”", "Sana M., HR", "bg-emerald-50"],
            ].map(([quote, author, bg], i) => (
              <Reveal key={author} delay={i * 0.12}>
                <figure className={`rounded-2xl p-6 ${bg} h-full hover:shadow-lg transition-shadow`}>
                  <blockquote className="text-sm text-slate-700 leading-relaxed">“{quote}”</blockquote>
                  <figcaption className="text-sm font-semibold text-slate-900 mt-3">{author}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <Reveal>
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Frequently asked questions</h2>
          </Reveal>
          <div className="space-y-3">
            {[
              ["Is my resume safe?", "Yes. Everything runs in your browser — we never store or send your resume anywhere."],
              ["Why do I need an ATS score?", "Over 75% of resumes are rejected by automated systems before a human sees them. We tell you exactly what to fix."],
              ["How is the AI free?", "Our optimizer runs on smart in-browser AI so the free tier has no hidden costs for us — that's why it stays free."],
              ["How do I pay for Premium?", "Pay via EasyPaisa, confirm on WhatsApp with your screenshot, and your unlock code is emailed to you within minutes. Paste it on the site to activate premium."],
              ["Can I get a refund?", "Yes — 7-day money-back guarantee, no questions asked. Message us on WhatsApp."],
            ].map(([q, a], i) => (
              <Reveal key={q} delay={i * 0.06}>
                <details className="group bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-slate-900 list-none">
                    {q}
                    <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={18} />
                  </summary>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mt-3 text-sm text-slate-600">{a}</p>
                  </motion.div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <FileText className="mx-auto text-indigo-500 mb-4 animate-float" size={40} />
        </motion.div>
        <Reveal>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Your next job is one resume away</h2>
          <p className="text-slate-600 mb-8">Optimize your first resume for free — takes less than two minutes.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/app"
              className="btn-shine inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 pulse-ring"
            >
              Optimize My Resume <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Reveal>
      </section>

      {/* Checkout modal */}
      <CheckoutModal
        open={checkout !== null}
        plan={checkout?.plan || "Premium"}
        price={checkout?.price || "$4"}
        onClose={() => setCheckout(null)}
      />
    </>
  );
}

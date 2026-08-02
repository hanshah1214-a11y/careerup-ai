import { useRef, useState } from "react";
import {
  Upload, Wand2, Copy, Check, Download, Sparkles,
  FileText, Gauge, AlertTriangle, Briefcase, Share2, Save,
} from "lucide-react";
import {
  readResumeFile, parseResume, optimizeResume, generateCoverLetter, scoreResume,
  generateInterviewQuestions, generateLinkedInToolkit,
} from "../lib/engine.js";
import { usePremium } from "../lib/usePremium.js";
import { siteConfig } from "../lib/config.js";
import CheckoutModal from "../components/CheckoutModal.jsx";

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
  const [savedList, setSavedList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("careerup_saved") || "[]"); } catch { return []; }
  });
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
        const interview = generateInterviewQuestions(optimized, jobDesc);
        const linkedin = generateLinkedInToolkit(parsed, optimized, jobDesc, company);
        setResult({ parsed, optimized, score, cover, interview, linkedin });
        setEditableResume(formatResume(optimized));
        setTab("resume");
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
    openTab("cover");
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

  const downloadPdf = () => {
    if (!result) return;
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    const name = result.optimized.name.toUpperCase();
    const contact = result.optimized.contact.join("  |  ");
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    printWin.document.write(`<!doctype html><html><head><title>${esc(name)} — Resume</title><style>
      body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.45}
      h1{font-size:22px;margin:0 0 2px;letter-spacing:.5px} .contact{color:#444;font-size:13px;margin-bottom:18px}
      h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #333;padding-bottom:3px;margin:20px 0 8px}
      .skills{font-size:13px} ul{margin:4px 0 8px;padding-left:18px;font-size:13px} li{margin:3px 0} p{font-size:13px;margin:0 0 6px}
      @media print{body{margin:0}}
    </style></head><body><h1>${esc(name)}</h1>${contact ? `<div class="contact">${esc(contact)}</div>` : ""}
    <h2>Professional Summary</h2><p>${esc(result.optimized.summary)}</p>
    <h2>Core Skills</h2><div class="skills">${esc(result.optimized.skills.join(", "))}</div>
    ${result.optimized.experience.length ? `<h2>Professional Experience</h2><ul>${result.optimized.experience.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    ${result.optimized.projects.length ? `<h2>Projects</h2><ul>${result.optimized.projects.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    ${result.optimized.education.length ? `<h2>Education</h2><ul>${result.optimized.education.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    <p style="margin-top:28px;font-size:11px;color:#888">Optimized with CareerUp AI</p>
    <script>window.onload=function(){window.print()}<\/script></body></html>`);
    printWin.document.close();
  };

  const saveVersion = () => {
    if (!result) return;
    const name = result.optimized.name || "Resume";
    const item = {
      id: Date.now(),
      title: `${name} — ${result.optimized.role} (${new Date().toLocaleDateString()})`,
      text: editableResume,
    };
    const next = [item, ...savedList].slice(0, 20);
    setSavedList(next);
    localStorage.setItem("careerup_saved", JSON.stringify(next));
    setCopied("saved");
    setTimeout(() => setCopied(""), 1500);
  };

  const loadVersion = (text) => {
    setEditableResume(text);
    setCopied("loaded");
    setTimeout(() => setCopied(""), 1500);
  };

  const clearSaved = () => {
    setSavedList([]);
    localStorage.removeItem("careerup_saved");
  };

  const openTab = (target) => {
    const proTabs = ["interview", "linkedin"];
    if (proTabs.includes(target) && !isPremium && coverLeft <= 0) {
      setShowPaywall(true);
      return;
    }
    if (target === "cover" && !isPremium && coverLeft <= 0) {
      setShowPaywall(true);
      return;
    }
    setTab(target);
    if (!isPremium && (target === "cover" || proTabs.includes(target))) consume("covers");
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
              {result.score.missingKeywords.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Keywords missing from your resume</p>
                  <div className="flex flex-wrap gap-2">
                    {result.score.missingKeywords.slice(0, 10).map((k) => (
                      <span key={k} className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium px-2.5 py-1 rounded-full">+ {k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex border-b border-slate-200 overflow-x-auto">
              <button
                onClick={() => setTab("resume")}
                className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors shrink-0 ${tab === "resume" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Optimized Resume
              </button>
              <button
                onClick={() => openTab("cover")}
                className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors shrink-0 ${tab === "cover" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Cover Letter
              </button>
              <button
                onClick={() => openTab("interview")}
                className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors shrink-0 ${tab === "interview" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Interview Prep
              </button>
              <button
                onClick={() => openTab("linkedin")}
                className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors shrink-0 ${tab === "linkedin" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                LinkedIn Toolkit
              </button>
              <button
                onClick={() => setTab("versions")}
                className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors shrink-0 ${tab === "versions" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                Versions
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
                    <button onClick={downloadPdf} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                      <FileText size={16} /> Download PDF
                    </button>
                    <button onClick={saveVersion} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                      {copied === "saved" ? <Check size={16} className="text-emerald-600" /> : <Save size={16} />} {copied === "saved" ? "Saved!" : "Save Version"}
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

              {tab === "interview" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Briefcase size={16} className="text-indigo-600" /> Behavioral questions</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {result.interview.behavioral.map((q) => (
                        <li key={q} className="bg-slate-50 border border-slate-200 rounded-lg p-3">{q}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Sparkles size={16} className="text-indigo-600" /> Technical / role questions</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {result.interview.technical.map((q) => (
                        <li key={q} className="bg-slate-50 border border-slate-200 rounded-lg p-3">{q}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><AlertTriangle size={16} className="text-indigo-600" /> Questions to prep for</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {result.interview.fit.map((q) => (
                        <li key={q} className="bg-slate-50 border border-slate-200 rounded-lg p-3">{q}</li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => copy(`${result.interview.behavioral.join("\n\n")}\n\n${result.interview.technical.join("\n\n")}\n\n${result.interview.fit.join("\n\n")}`, "interview")} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                    {copied === "interview" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} Copy all questions
                  </button>
                </div>
              )}

              {tab === "linkedin" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Share2 size={16} className="text-indigo-600" /> Headline</h4>
                    <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed text-slate-800">{result.linkedin.headline}</pre>
                    <button onClick={() => copy(result.linkedin.headline, "li-head")} className="mt-2 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg text-sm transition-colors">
                      {copied === "li-head" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} Copy
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Share2 size={16} className="text-indigo-600" /> About section</h4>
                    <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed text-slate-800">{result.linkedin.about}</pre>
                    <button onClick={() => copy(result.linkedin.about, "li-about")} className="mt-2 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg text-sm transition-colors">
                      {copied === "li-about" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} Copy
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Share2 size={16} className="text-indigo-600" /> Skills (for your profile)</h4>
                    <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed text-slate-800">{result.linkedin.skillsSection}</pre>
                    <button onClick={() => copy(result.linkedin.skillsSection, "li-skills")} className="mt-2 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg text-sm transition-colors">
                      {copied === "li-skills" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} Copy
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Share2 size={16} className="text-indigo-600" /> Post / message</h4>
                    <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed text-slate-800">{result.linkedin.experiencePost}</pre>
                    <button onClick={() => copy(result.linkedin.experiencePost, "li-post")} className="mt-2 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-lg text-sm transition-colors">
                      {copied === "li-post" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} Copy
                    </button>
                  </div>
                </div>
              )}

              {tab === "versions" && (
                <div className="space-y-4">
                  {savedList.length === 0 ? (
                    <p className="text-sm text-slate-500 py-6 text-center">No saved versions yet. Edit your resume and hit "Save Version" to keep it here.</p>
                  ) : (
                    <>
                      {savedList.map((v) => (
                        <div key={v.id} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{v.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{v.text.length} characters</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => loadVersion(v.text)} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                              {copied === "loaded" ? <Check size={14} /> : <Copy size={14} />} Load
                            </button>
                            <button
                              onClick={() => {
                                const next = savedList.filter((x) => x.id !== v.id);
                                setSavedList(next);
                                localStorage.setItem("careerup_saved", JSON.stringify(next));
                              }}
                              className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={clearSaved} className="text-xs text-rose-500 hover:text-rose-700 font-semibold">Clear all saved versions</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid gap-3 sm:grid-cols-4">
            <button
              onClick={handleOptimize}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition-colors"
            >
              <Wand2 size={16} /> Optimize Again
            </button>
            <button onClick={handleCover} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 font-bold px-4 py-3 rounded-xl transition-colors">
              <Sparkles size={16} /> Cover Letter
            </button>
            <button onClick={() => openTab("interview")} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 font-bold px-4 py-3 rounded-xl transition-colors">
              <Briefcase size={16} /> Interview Prep
            </button>
            <button onClick={() => { setStep(1); setResult(null); }} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 font-bold px-4 py-3 rounded-xl transition-colors">
              <Upload size={16} /> New Resume
            </button>
          </div>
        </div>
      )}

      {/* Paywall modal */}
      <CheckoutModal
        open={showPaywall}
        plan="Premium"
        price="$4"
        onClose={() => setShowPaywall(false)}
        onUpgraded={(plan, expiresAt) => upgrade(plan, expiresAt)}
      />
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


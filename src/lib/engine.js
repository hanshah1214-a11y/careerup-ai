// =============================================================
// CareerUp AI engine — resume parsing, rewriting, ATS scoring
// Runs 100% in the browser. Zero API cost.
// =============================================================

const ACTION_VERBS = [
  "Delivered", "Engineered", "Launched", "Optimized", "Spearheaded",
  "Automated", "Accelerated", "Streamlined", "Transformed", "Architected",
  "Built", "Led", "Scaled", "Reduced", "Increased", "Drove", "Managed",
  "Designed", "Implemented", "Executed", "Orchestrated", "Maximized",
  "Generated", "Improved", "Boosted", "Cut", "Expanded", "Modernized",
];

const RESUME_SECTION_LABELS = {
  experience: ["experience", "work history", "professional experience", "employment", "work experience"],
  education: ["education", "academic", "qualification", "degree"],
  skills: ["skills", "technical skills", "core competencies", "competencies", "technologies", "languages"],
  projects: ["projects", "personal projects", "key projects"],
  contact: ["contact", "profile", "summary", "objective"],
};

let _pdfjs = null;
let _mammoth = null;

async function getPdfjs() {
  if (!_pdfjs) {
    const mod = await import("pdfjs-dist");
    mod.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    _pdfjs = mod;
  }
  return _pdfjs;
}

async function getMammoth() {
  if (!_mammoth) {
    const mod = await import("mammoth/mammoth.browser.js");
    _mammoth = mod.default || mod;
  }
  return _mammoth;
}

export async function extractTextFromPdf(arrayBuffer) {
  const pdfjsLib = await getPdfjs();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text.trim();
}

export async function extractTextFromDocx(arrayBuffer) {
  const mammoth = await getMammoth();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function readResumeFile(file) {
  if (!file) throw new Error("No file selected");
  const lower = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (lower.endsWith(".pdf")) return await extractTextFromPdf(buf);
  if (lower.endsWith(".docx")) return await extractTextFromDocx(buf);
  if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".rtf")) return await readFileAsText(file);
  if (lower.endsWith(".doc")) throw new Error("Old .doc files aren't supported. Save as .docx or .pdf instead, or paste your resume text.");
  throw new Error("Unsupported file. Upload .pdf, .docx, .txt, .md or paste text instead.");
}

export function parseResume(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const result = {
    raw: text,
    name: lines[0] || "Your Name",
    contact: [],
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    other: [],
  };

  let currentSection = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    let matched = null;
    for (const [key, labels] of Object.entries(RESUME_SECTION_LABELS)) {
      if (labels.some((l) => lower.includes(l)) && line.length < 60) {
        matched = key;
        break;
      }
    }
    if (matched) {
      currentSection = matched;
      continue;
    }

    if (/^[\w\.\-+]+@[\w\-]+(\.[\w\-]+)+$/.test(line)) {
      result.contact.push(line);
      continue;
    }
    if (/^\+?[\d\s\-\(\)]{7,}$/.test(line) && /\d/.test(line)) {
      result.contact.push(line);
      continue;
    }
    if (/^(linkedin|github|twitter|x|portfolio|website)[:/]/i.test(line)) {
      result.contact.push(line);
      continue;
    }

    if (!currentSection) {
      if (/^[\w\s\-\.]{2,40}$/.test(line) && i < Math.min(4, lines.length)) {
        continue;
      }
      result.other.push(line);
      continue;
    }

    if (currentSection === "skills") {
      line.split(/\s*[,|/]\s*/).forEach((s) => {
        const clean = s.replace(/[•·\-\*\s]+/g, " ").trim();
        if (clean.length > 1 && clean.length < 40) result.skills.push(clean);
      });
    } else if (currentSection === "summary" || currentSection === "contact") {
      result.summary += (result.summary ? " " : "") + line;
    } else if (currentSection === "experience") {
      result.experience.push(line);
    } else if (currentSection === "education") {
      result.education.push(line);
    } else if (currentSection === "projects") {
      result.projects.push(line);
    }
  }

  result.skills = [...new Set(result.skills)].slice(0, 60);
  return result;
}

function titleCase(s) {
  return s
    .replace(/[_\-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function inferJobRole(jd) {
  const lower = jd.toLowerCase();
  const roles = [
    ["software engineer", "developer", "engineer", "software", "programmer", "full-stack", "frontend", "backend", "react", "node"],
    ["data scientist", "data", "machine learning", "ai", "analyst", "ml"],
    ["marketing", "digital marketing", "seo", "growth", "content", "social media"],
    ["sales", "business development", "account executive", "bdm"],
    ["design", "ui", "ux", "product designer", "graphic"],
    ["product manager", "project manager", "program manager", "scrum"],
    ["finance", "accountant", "auditor", "financial"],
    ["customer support", "customer success", "support"],
  ];
  for (const [role, ...keys] of roles) {
    if (keys.some((k) => lower.includes(k))) return titleCase(role);
  }
  return "Professional";
}

function extractKeywords(jd) {
  const words = jd.toLowerCase().match(/[a-z][a-z0-9\-+\.#]{2,}/g) || [];
  const stop = new Set(["the", "and", "for", "with", "you", "will", "have", "are", "our", "your", "this", "that", "from", "who", "what", "where", "when", "how", "all", "can", "work", "role", "team", "job", "about", "looking", "strong", "good", "ability", "experience", "including", "able", "must", "within", "into", "them", "their", "they", "were", "been", "also", "any", "not", "but", "its", "well"]);
  const freq = new Map();
  for (const w of words) {
    if (stop.has(w) || w.length < 3 || /^\d+$/.test(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([w]) => w);
}

function rewriteBullet(bullet, jd, index, total) {
  let text = bullet.replace(/^[\s•·\-\*]+/, "");
  text = text.replace(/^I\s+/i, "");
  text = text.replace(/^([a-z])/, (m) => m.toUpperCase());
  const hasNumber = /\d/.test(text);
  const hasVerb = ACTION_VERBS.some((v) => text.toLowerCase().startsWith(v.toLowerCase()));

  if (!hasVerb) {
    const verb = ACTION_VERBS[Math.floor((index + text.length) % ACTION_VERBS.length)];
    text = `${verb} ${text.toLowerCase()}`;
  }

  if (!hasNumber) {
    const templates = [
      "cutting processing time by ~30%",
      "driving a 25% improvement in output",
      "reducing manual effort by roughly a third",
      "boosting efficiency by 30%",
      "improving quality scores by 20%",
      "saving ~10 hours per week",
      "raising customer satisfaction to 95%",
      "delivering projects ahead of schedule",
    ];
    const t = templates[(index + text.length) % templates.length];
    if (Math.random() < 0.85 || index === total - 1) {
      text = `${text} (${t})`;
    }
  }

  const jdWords = extractKeywords(jd);
  const keyword = jdWords.length > 0 && !jdWords.some((k) => text.toLowerCase().includes(k))
    ? ` — aligned with ${jdWords[0].charAt(0).toUpperCase() + jdWords[0].slice(1)} priorities`
    : "";
  text = text + keyword;

  if (text.length > 160) text = text.slice(0, 157) + "...";
  return text;
}

export function optimizeResume(parsed, jd) {
  const role = inferJobRole(jd);
  const keywords = extractKeywords(jd);
  const jdLower = jd.toLowerCase();

  const experience = parsed.experience.length
    ? parsed.experience.map((b, i) => rewriteBullet(b, jd, i, parsed.experience.length))
    : [`Delivered high-impact results aligned with ${role} role objectives`, "Collaborated cross-functionally to accelerate project delivery timelines"];

  const skills = parsed.skills.length
    ? parsed.skills
    : ["Communication", "Problem solving", "Team collaboration", "Time management", "Adaptability"];

  const matchedSkills = skills.filter((s) => jdLower.includes(s.toLowerCase()));

  const summary = parsed.summary
    ? parsed.summary
    : `${role} with a track record of delivering measurable results. Strong in ${skills.slice(0, 4).join(", ").toLowerCase()}. Seeking to apply hands-on experience to drive business outcomes in a fast-paced environment.`;

  const summaryWithKeywords = keywords.length
    ? summary + (summary.endsWith(".") ? "" : ".") + ` Skilled across ${keywords.slice(0, 5).join(", ")}.`
    : summary;

  return {
    name: parsed.name,
    contact: parsed.contact,
    summary: summaryWithKeywords,
    skills,
    matchedSkills,
    experience,
    education: parsed.education,
    projects: parsed.projects,
    role,
    keywords,
  };
}

export function generateCoverLetter(parsed, optimized, jd, company, style = "professional") {
  const companyName = company.trim() || "the Company";
  const role = optimized.role;
  const skills = optimized.skills.slice(0, 4).join(", ").toLowerCase();
  const kw = optimized.keywords.slice(0, 5).join(", ");
  const exp = optimized.experience[0] || "delivering measurable results";

  if (style === "short") {
    return `Dear Hiring Manager,

I'm ${parsed.name}, a ${role} applying for the open position at ${companyName}. I bring hands-on experience in ${skills} and a track record of ${exp}.

I'd love to discuss how I can help ${companyName}. Available for an interview any day.

Best,
${parsed.name}`;
  }

  if (style === "enthusiastic") {
    return `Dear Hiring Manager,

I couldn't be more excited to apply for the ${role} role at ${companyName}! As someone who genuinely loves ${kw}, I've spent my career turning ${skills} into real, measurable wins — including ${exp}.

Joining ${companyName} would be a dream come true. I'd be thrilled to bring my energy and experience to your team.

Warmly,
${parsed.name}`;
  }

  return `Dear Hiring Manager,

I am writing to apply for the ${role} position at ${companyName}. With hands-on experience in ${skills} and a consistent record of ${exp}, I am confident I can add immediate value to your team.

Your focus on ${kw} matches directly with my strengths. I enjoy turning complex problems into clear, measurable outcomes and have done so across previous roles by working closely with stakeholders and iterating quickly.

I would welcome the opportunity to discuss how my background can support ${companyName}'s goals. Thank you for your time and consideration.

Best regards,
${parsed.name}`;
}

export function scoreResume(parsed, jd) {
  const jdWords = extractKeywords(jd);
  const allText = (parsed.summary + " " + parsed.skills.join(" ") + " " + parsed.experience.join(" ") + " " + parsed.education.join(" ") + " " + parsed.projects.join(" ")).toLowerCase();

  let matched = 0;
  for (const w of jdWords) {
    if (allText.includes(w)) matched++;
  }
  const keywordMatch = jdWords.length ? Math.round((matched / jdWords.length) * 100) : 60;

  let points = keywordMatch * 0.6;
  if (parsed.contact.length >= 2) points += 15;
  if (/\d{1,3}%|\d{1,3} (hours|days|weeks|projects|clients|customers|users)/.test(allText)) points += 10;
  if (parsed.experience.length >= 4) points += 10;
  if (parsed.education.length > 0) points += 5;
  if (parsed.skills.length >= 8) points += 5;
  points = Math.max(30, Math.min(98, Math.round(points)));

  const issues = [];
  if (keywordMatch < 50) issues.push(`Only ${matched}/${jdWords.length} key skills from the job match your resume. Add keywords like: ${jdWords.slice(0, 6).join(", ")}.`);
  if (parsed.contact.length < 2) issues.push("Add a phone number, email, LinkedIn or portfolio link so recruiters can reach you.");
  if (!/\d{1,3}%|\d{1,3} (hours|days|weeks|projects|clients|customers|users)/.test(allText)) issues.push("Quantify achievements with numbers (%, hours saved, users served) to stand out.");
  if (parsed.experience.length < 4) issues.push("Keep bullet points concise and start each with a strong action verb.");
  if (parsed.skills.length < 8) issues.push("List 8+ relevant skills so ATS software can match you to more roles.");
  if (issues.length === 0) issues.push("Strong match! Keep tailoring your resume to each specific job description.");

  const missingKeywords = jdWords.filter((w) => !allText.includes(w));

  const density = jdWords.slice(0, 10).map((w) => {
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const count = (allText.match(re) || []).length;
    return { keyword: w, count };
  });

  return { score: points, keywordMatch, matched, total: jdWords.length, issues, missingKeywords, density };
}

export function generateInterviewQuestions(optimized, jd) {
  const role = optimized.role;
  const kw = optimized.keywords.slice(0, 6);
  const missing = jd ? extractKeywords(jd).filter((k) => !optimized.keywords.includes(k)).slice(0, 4) : [];

  const behavioral = [
    `Tell me about a time you solved a difficult problem related to ${role} work.`,
    "Describe a project where you had to work under a tight deadline. What did you do?",
    `Walk me through a time you used ${kw[0] || "your strongest skill"} to deliver a measurable result.`,
    "How do you prioritize tasks when everything is urgent? Give a concrete example.",
  ];
  const technical = kw.map((k) => `What real projects or examples can you share that demonstrate your experience with ${k}?`);
  const fit = missing.length
    ? missing.map((k) => `The job mentions ${k} — do you have experience with it, and how would you learn it quickly?`)
    : ["Why do you want to work here, and what makes you a good fit for this team?"];

  const star = [
    {
      s: `Situation — describe a project you owned that relates to ${role} work and mattered to the business.`,
      t: "Task — what specific goal were you responsible for?",
      a: `Action — walk through the steps you took using ${kw[0] || "your strongest skill"}.`,
      r: "Result — quantify the outcome (%, time saved, revenue, users helped).",
    },
  ];

  return { role, behavioral, technical, fit, star };
}

export function generateLinkedInToolkit(parsed, optimized, jd, company) {
  const role = optimized.role;
  const skills = optimized.skills.slice(0, 5).join(", ");
  const kw = optimized.keywords.slice(0, 5).join(", ");
  const exp = optimized.experience[0] || "delivering measurable results";
  const companyName = company.trim() || "your target company";

  const headline = `${role} | ${optimized.keywords.slice(0, 3).join(" • ")}`;
  const about = `${optimized.name || "Your Name"} — ${role} with hands-on experience in ${skills}. Known for ${exp}, with a focus on ${kw}. Passionate about building solutions that create real, measurable impact. Open to roles at ${companyName} and similar teams.`;
  const skillsSection = optimized.skills.slice(0, 12).join(", ");
  const experiencePost = `I'm looking for ${role} opportunities — if you know a team hiring for this, let's connect!`;

  return { headline, about, skillsSection, experiencePost };
}

import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "../lib/config.js";

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.3 0h4.4v1.9h.06c.61-1.16 2.11-2.39 4.35-2.39 4.65 0 5.51 3.06 5.51 7.04V22h-4.6v-6.5c0-1.55-.03-3.55-2.16-3.55-2.17 0-2.5 1.69-2.5 3.44V22H7.5V8z" />
  </svg>
);

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export default function Footer() {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}`;
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="text-white font-bold mb-2">{siteConfig.name}</h3>
          <p className="text-sm text-slate-400">{siteConfig.tagline}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2 text-sm">Product</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            <li><a href="#/app" className="hover:text-white">Open App</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2 text-sm">Contact & Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:hello@${siteConfig.name.toLowerCase().replace(/\s/g, "")}.com`} className="flex items-center gap-2 hover:text-white">
                <Mail size={16} /> Email us
              </a>
            </li>
            <li className="flex gap-3 pt-1">
              <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white"><LinkedinIcon /></a>
              <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white"><GithubIcon /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. ·{" "}
        <Link to="/admin" className="hover:text-slate-300">Seller Admin</Link>
      </div>
    </footer>
  );
}

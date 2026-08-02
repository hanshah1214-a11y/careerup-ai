import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { siteConfig } from "../lib/config.js";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </span>
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden sm:inline text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Pricing
          </a>
          <Link
            to="/app"
            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Start Free
          </Link>
        </div>
      </nav>
    </header>
  );
}

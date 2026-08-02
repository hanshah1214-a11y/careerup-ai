import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { siteConfig } from "../lib/config.js";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200"
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 group">
          <motion.span
            whileHover={{ rotate: 20, scale: 1.1 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30"
          >
            <Sparkles size={18} />
          </motion.span>
          <span className="group-hover:text-indigo-600 transition-colors">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden sm:inline text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
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
    </motion.header>
  );
}

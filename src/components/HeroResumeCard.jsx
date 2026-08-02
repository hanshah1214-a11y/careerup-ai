import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import TiltCard from "./TiltCard.jsx";

export default function HeroResumeCard() {
  return (
    <div className="relative mx-auto max-w-sm w-full" style={{ perspective: 1200 }}>
      <div className="absolute -inset-6 bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 opacity-30 blur-2xl rounded-full animate-drift" />
      <TiltCard max={18} className="relative">
        <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-500/20 border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Ahmed Khan</div>
              <div className="text-indigo-200 text-xs">Senior React Developer</div>
            </div>
            <div className="bg-white/20 rounded-lg px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1">
              <Sparkles size={11} /> AI
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-extrabold text-emerald-600 whitespace-nowrap">92%</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["React", "TypeScript", "Node.js", "Docker", "GraphQL"].map((s, i) => (
                <motion.span
                  key={s}
                  className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2 py-0.5"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
            <div className="space-y-1.5">
              {[
                "Led React dashboards serving 50k users",
                "Designed GraphQL APIs cutting load 40%",
                "Mentored 6 junior developers",
              ].map((b, i) => (
                <div key={b} className="flex items-center gap-2 text-[11px] text-slate-600">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>{b}</span>
                  {i === 0 && (
                    <span className="ml-auto text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 shrink-0">
                      <TrendingUp size={11} /> +35%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-extrabold rounded-xl px-3 py-1.5 shadow-lg shadow-emerald-500/40 rotate-6"
          animate={{ rotate: [6, 8, 6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          ATS ✓
        </motion.div>
      </TiltCard>
    </div>
  );
}

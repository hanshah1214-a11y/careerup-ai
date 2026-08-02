import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export default function AnimatedCounter({ value, suffix = "", prefix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    const controls = animate(0, numeric, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const formatted = Number.isInteger(display) ? Math.round(display).toLocaleString() : display.toFixed(1);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

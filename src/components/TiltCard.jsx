import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function TiltCard({ children, className = "", max = 14 }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

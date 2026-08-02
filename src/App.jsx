import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Builder from "./pages/Builder.jsx";
import Admin from "./pages/Admin.jsx";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<Builder />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </HashRouter>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADER_TEXT = "<Arghya />";

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // One full animation cycle = 4s (per keyframe).
    // We wait ~2.6s (enough for all letters to light up), then fade out.
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600); // give exit animation time to finish
    }, 2600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="loader-overlay"
        >
          <div className="loader-wrapper">
            <div className="loader" />
            <span aria-label={LOADER_TEXT}>
              {LOADER_TEXT.split("").map((char, i) => (
                <span
                  key={i}
                  className="loader-letter"
                  style={{ animationDelay: `${0.1 + i * 0.105}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

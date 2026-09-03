import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-surface-800 light:bg-surface-100 hover:bg-surface-700 light:hover:bg-surface-200 transition-colors cursor-pointer"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-surface-700" />
        )}
      </motion.div>
    </motion.button>
  );
}

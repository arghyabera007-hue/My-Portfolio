import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "../data/navigation";
import { personalInfo } from "../data/personalInfo";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const sectionIds = navLinks.map((link) => link.href.replace("#", ""));
  const activeSection = useScrollSpy(sectionIds, 120);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isDark = theme === "dark";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <nav 
        className={`pointer-events-auto transition-all duration-300 rounded-full px-2 py-1.5 md:px-4 md:py-2 flex items-center justify-between shadow-xl backdrop-blur-md border ${
          isDark 
            ? "bg-[#161618]/90 border-white/10" 
            : "bg-white/90 border-black/10"
        }`}
      >
        <div className="flex items-center">
          {/* Logo */}
          <a
            href="#home"
            className={`text-lg md:text-xl font-bold mr-6 md:mr-10 ml-3 transition-opacity hover:opacity-80 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {personalInfo.firstName}<span className="text-red-500">.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              // Add special styling if the link is named "Resume"
              const isResume = link.name.toLowerCase() === "resume";

              let linkClasses = `relative px-4 py-2 text-[15px] font-medium rounded-full transition-colors duration-200 `;
              let textClasses = `relative z-10 transition-colors duration-200 `;
              
              if (isActive) {
                textClasses += isDark ? "text-white" : "text-red-700";
              } else if (isResume) {
                linkClasses += "text-red-500 hover:bg-red-500/10 hover:text-red-400";
              } else {
                linkClasses += isDark
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/5";
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={linkClasses}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className={`absolute inset-0 rounded-full ${
                        isDark ? "bg-[#3f1f1f]" : "bg-red-100"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={textClasses}>{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center ml-2 mr-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-colors ${
                isDark 
                  ? "text-gray-300 hover:bg-white/10" 
                  : "text-gray-600 hover:bg-black/5"
              }`}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-4 left-4 right-4 md:hidden overflow-hidden rounded-2xl shadow-xl backdrop-blur-xl border pointer-events-auto ${
              isDark 
                ? "bg-[#161618]/95 border-white/10" 
                : "bg-white/95 border-black/10"
            }`}
          >
            <div className="px-2 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                const isResume = link.name.toLowerCase() === "resume";
                
                let linkClasses = `block px-4 py-3 rounded-xl text-base font-medium transition-colors `;
                
                if (isActive) {
                  linkClasses += isDark
                    ? "bg-[#3f1f1f] text-white"
                    : "bg-red-100 text-red-700";
                } else if (isResume && !isActive) {
                  linkClasses += "text-red-500 hover:bg-red-500/10";
                } else {
                  linkClasses += isDark
                    ? "text-gray-300 hover:bg-white/5"
                    : "text-gray-600 hover:bg-black/5";
                }

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={linkClasses}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

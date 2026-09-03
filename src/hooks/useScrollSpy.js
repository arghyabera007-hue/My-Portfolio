import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds, offset = 100) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const top = section.offsetTop - offset;
          if (scrollY >= top) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
      setActiveSection(sectionIds[0] || "");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}

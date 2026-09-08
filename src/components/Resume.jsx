import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { personalInfo } from "../data/personalInfo";
import RadialRevealButton from "./RadialRevealButton";

export default function Resume() {
  return (
    <section id="resume" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icon */}
          <div className="inline-flex p-4 rounded-2xl bg-primary-500/10 mb-6">
            <FileText size={32} className="text-primary-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Want to know more?</span>
          </h2>

          <p className="text-surface-400 light:text-surface-600 text-base md:text-lg leading-relaxed mb-8">
            Check out my resume for a detailed overview of my experience,
            technical skills, projects, and academic background.
          </p>

          <RadialRevealButton
            label="Download Resume"
            link={personalInfo.resumeUrl}
            newTab
            fill="#6366f1"
            textColor="#ffffff"
            hoverFill="#ffffff"
            hoverTextColor="#6366f1"
            border={{ borderWidth: 2, borderStyle: "solid", borderColor: "#6366f1" }}
            padding="16px 36px"
            rounded={12}
            style={{ fontSize: "1rem", fontWeight: 600 }}
          />

          <p className="mt-4 text-sm text-surface-500 light:text-surface-400">
            PDF format • Updated regularly
          </p>
        </motion.div>
      </div>
    </section>
  );
}

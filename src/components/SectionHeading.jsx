import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-3">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-surface-400 light:text-surface-700 text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded-full gradient-bg ${center ? "mx-auto" : ""}`}
      />
    </motion.div>
  );
}

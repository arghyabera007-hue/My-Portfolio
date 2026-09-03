import { motion } from "framer-motion";
import { MapPin, GraduationCap, Target, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import AnimatedCounter from "./AnimatedCounter";
import { personalInfo } from "../data/personalInfo";

export default function About() {
  const highlights = [
    {
      icon: GraduationCap,
      label: "Education",
      value: `${personalInfo.degree} in ${personalInfo.department}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: personalInfo.location,
    },
    {
      icon: Target,
      label: "Goal",
      value: "Full-Stack Software Developer",
    },
    {
      icon: Sparkles,
      label: "Interest",
      value: "Web Dev, DSA, Open Source",
    },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Me"
          subtitle="Get to know me a little better"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — Bio & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-surface-300 light:text-surface-600 text-base md:text-lg leading-relaxed mb-8">
              {personalInfo.aboutBio}
            </p>

            {/* Highlight cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl card-dark"
                >
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400 shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 light:text-surface-400 font-medium uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm text-surface-200 light:text-surface-700 font-medium">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Strengths */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-surface-400 light:text-surface-500 uppercase tracking-wider mb-3">
                Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {personalInfo.strengths.map((strength) => (
                  <span
                    key={strength}
                    className="px-3 py-1.5 text-sm rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {personalInfo.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl card-dark text-center group hover:border-primary-500/30 transition-colors"
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                  <p className="mt-2 text-sm text-surface-400 light:text-surface-600 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Fun code snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-5 rounded-2xl card-dark"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <pre className="font-mono text-xs md:text-sm text-surface-300 light:text-surface-600 overflow-x-auto">
                <code>{`while (alive) {
  eat();
  sleep();
  code();
  repeat();
}`}</code>
              </pre>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

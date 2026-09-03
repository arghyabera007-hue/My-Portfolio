import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { skillCategories } from "../data/skills";

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-surface-900/50 light:bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Technologies and tools I work with"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: catIndex * 0.1 }}
              className="p-6 rounded-2xl card-dark group hover:border-primary-500/30 transition-all duration-300"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                  <category.icon size={20} />
                </div>
                <h3 className="font-semibold text-surface-200 light:text-surface-800">
                  {category.title}
                </h3>
              </div>

              {/* Skills grid */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800/60 light:bg-surface-100 border border-surface-700/50 light:border-surface-200 text-surface-300 light:text-surface-600 text-sm font-medium hover:border-primary-500/30 hover:text-primary-400 transition-colors cursor-default"
                  >
                    <span className="text-base">{skill.icon}</span>
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

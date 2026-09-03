import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { education } from "../data/education";

export default function Education() {
  return (
    <section id="education" className="section-padding bg-surface-900/50 light:bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Education"
          subtitle="My academic journey and qualifications"
        />

        <div className="max-w-3xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative pl-8 pb-10 last:pb-0"
            >
              {/* Timeline line */}
              {index !== education.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-surface-800 light:bg-surface-200" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <GraduationCap size={12} className="text-white" />
              </div>

              {/* Content card */}
              <div className="p-6 rounded-2xl card-dark hover:border-primary-500/30 transition-colors group">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-bold text-surface-100 light:text-surface-800 group-hover:text-primary-400 transition-colors">
                    {edu.degree}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 shrink-0">
                    <Calendar size={12} />
                    {edu.duration}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-surface-400 light:text-surface-600">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-primary-400" />
                    {edu.institution}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary-400" />
                    {edu.location}
                  </span>
                </div>

                <p className="text-sm text-surface-400 light:text-surface-600 leading-relaxed mb-4">
                  {edu.description}
                </p>

                {/* Coursework */}
                {edu.coursework.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                      Relevant Coursework
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.coursework.map((course) => (
                        <span
                          key={course}
                          className="px-2.5 py-1 text-xs rounded-md bg-surface-800/60 light:bg-surface-100 border border-surface-700/50 light:border-surface-200 text-surface-300 light:text-surface-600"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {edu.achievements.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                      Achievements
                    </p>
                    <ul className="space-y-1">
                      {edu.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="text-xs text-surface-400 light:text-surface-600 flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary-400 shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

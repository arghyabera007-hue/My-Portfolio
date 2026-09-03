import { motion } from "framer-motion";
import {
  Award,
  Trophy,
  BookOpen,
  Users,
  ExternalLink,
  Calendar,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { achievements } from "../data/achievements";

const typeConfig = {
  certification: { icon: Award, color: "text-blue-400", bg: "bg-blue-500/10" },
  achievement: { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  hackathon: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
  workshop: { icon: BookOpen, color: "text-green-400", bg: "bg-green-500/10" },
  competition: { icon: Trophy, color: "text-orange-400", bg: "bg-orange-500/10" },
};

export default function Achievements() {
  return (
    <section id="achievements" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Achievements & Certifications"
          subtitle="Recognition, certifications, and milestones"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, index) => {
            const config = typeConfig[item.type] || typeConfig.achievement;
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl card-dark group hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${config.bg} ${config.color}`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-surface-500 light:text-surface-400">
                    <Calendar size={12} />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-surface-100 light:text-surface-800 mb-1 group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-primary-400/80 font-medium mb-3">
                  {item.organization}
                </p>

                <p className="text-sm text-surface-400 light:text-surface-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Type badge */}
                <div className="flex items-center justify-between pt-4 border-t border-surface-800 light:border-surface-200">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-surface-800/60 light:bg-surface-100 text-surface-400 light:text-surface-600 capitalize">
                    {item.type}
                  </span>
                  {item.link && item.link !== "#" && item.link !== "" && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      View Certificate
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

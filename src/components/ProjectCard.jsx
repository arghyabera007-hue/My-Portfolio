import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./Icons";

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl card-dark overflow-hidden hover:border-primary-500/30 transition-all duration-300"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-surface-800 light:bg-surface-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center">
          <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
            💻
          </div>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-surface-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.github && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              aria-label={`View ${project.title} on GitHub`}
            >
              <GithubIcon size={20} />
            </motion.a>
          )}
          {project.liveDemo && project.liveDemo !== "#" && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              aria-label={`View ${project.title} live demo`}
            >
              <ExternalLink size={20} />
            </motion.a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-surface-100 light:text-surface-800 mb-2 group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-surface-400 light:text-surface-600 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-primary-500/10 text-primary-400 border border-primary-500/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="pt-4 border-t border-surface-800 light:border-surface-200">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
              Key Features
            </p>
            <ul className="space-y-1">
              {project.features.slice(0, 3).map((feature) => (
                <li
                  key={feature}
                  className="text-xs text-surface-400 light:text-surface-600 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-primary-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-surface-800 light:border-surface-200">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-surface-400 light:text-surface-600 hover:text-primary-400 transition-colors"
            >
              <GithubIcon size={14} />
              Source Code
            </a>
          )}
          {project.liveDemo && project.liveDemo !== "#" && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-surface-400 light:text-surface-600 hover:text-primary-400 transition-colors"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

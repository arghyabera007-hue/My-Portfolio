import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/projects";

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  const featuredProjects = projects.filter((p) => p.featured);
  const displayedProjects = showAll ? projects : featuredProjects;

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="My Projects"
          subtitle="A selection of projects I've worked on"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Show more/less toggle */}
        {projects.length > featuredProjects.length && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 text-sm font-medium rounded-xl border border-surface-700 light:border-surface-300 text-surface-300 light:text-surface-600 hover:border-primary-500/30 hover:text-primary-400 transition-colors cursor-pointer"
            >
              {showAll ? "Show Featured Only" : `View All Projects (${projects.length})`}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

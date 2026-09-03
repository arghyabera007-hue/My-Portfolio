import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  ExternalLink,
  Users,
  BookOpen,
} from "lucide-react";
import { GithubIcon } from "./Icons";
import SectionHeading from "./SectionHeading";
import { githubProfile, githubRepos } from "../data/github";

export default function Github() {
  return (
    <section id="github" className="section-padding bg-surface-900/50 light:bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="GitHub"
          subtitle="My open source work and repositories"
        />

        {/* GitHub Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl card-dark"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <GithubIcon size={36} />
            </div>

            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-bold text-surface-100 light:text-surface-800">
                @{githubProfile.username}
              </h3>
              <p className="text-sm text-surface-400 light:text-surface-600 mb-3">
                {githubProfile.bio}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-surface-400 light:text-surface-600">
                  <BookOpen size={14} className="text-primary-400" />
                  <strong className="text-surface-200 light:text-surface-800">{githubProfile.publicRepos}</strong> repos
                </span>
                <span className="flex items-center gap-1.5 text-surface-400 light:text-surface-600">
                  <Users size={14} className="text-primary-400" />
                  <strong className="text-surface-200 light:text-surface-800">{githubProfile.followers}</strong> followers
                </span>
                <span className="flex items-center gap-1.5 text-surface-400 light:text-surface-600">
                  <Users size={14} className="text-primary-400" />
                  <strong className="text-surface-200 light:text-surface-800">{githubProfile.following}</strong> following
                </span>
              </div>
            </div>

            <a
              href={githubProfile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-surface-700 light:border-surface-300 text-surface-300 light:text-surface-600 hover:border-primary-500/30 hover:text-primary-400 transition-colors shrink-0"
            >
              <GithubIcon size={16} />
              View Profile
            </a>
          </div>
        </motion.div>

        {/* Repository Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {githubRepos.map((repo, index) => (
            <motion.a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="block p-6 rounded-2xl card-dark group hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-primary-400">
                  <BookOpen size={16} />
                  <span className="font-semibold text-sm group-hover:text-primary-300 transition-colors">
                    {repo.name}
                  </span>
                </div>
                <ExternalLink
                  size={14}
                  className="text-surface-500 group-hover:text-primary-400 transition-colors shrink-0 mt-0.5"
                />
              </div>

              <p className="text-sm text-surface-400 light:text-surface-600 leading-relaxed mb-4 line-clamp-2">
                {repo.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-surface-500 light:text-surface-400">
                {/* Language */}
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  {repo.language}
                </span>

                {/* Stars */}
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {repo.stars}
                </span>

                {/* Forks */}
                <span className="flex items-center gap-1">
                  <GitFork size={12} />
                  {repo.forks}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

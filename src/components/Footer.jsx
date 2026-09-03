import { Mail, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { navLinks } from "../data/navigation";
import { personalInfo } from "../data/personalInfo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: GithubIcon, href: personalInfo.github, label: "GitHub" },
    { icon: LinkedinIcon, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  return (
    <footer className="border-t border-surface-800 light:border-surface-200 bg-surface-950 light:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <a
              href="#home"
              className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
            >
              &lt;{personalInfo.firstName} /&gt;
            </a>
            <p className="mt-3 text-sm text-surface-400 light:text-surface-600 leading-relaxed max-w-xs">
              {personalInfo.role}. Passionate about building impactful software
              and contributing to the developer community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 light:text-surface-800 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-surface-400 light:text-surface-600 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 light:text-surface-800 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.label !== "Email" ? "_blank" : undefined}
                  rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                  className="p-2.5 rounded-lg bg-surface-800/50 light:bg-surface-100 border border-surface-700/50 light:border-surface-200 text-surface-400 light:text-surface-600 hover:text-primary-400 hover:border-primary-500/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            <div className="mt-4">
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Download Resume →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-surface-800/50 light:border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500 light:text-surface-400">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p className="text-sm text-surface-500 light:text-surface-400 flex items-center gap-1.5">
            Built with <Heart size={14} className="text-red-400" fill="currentColor" /> using React
          </p>
        </div>
      </div>
    </footer>
  );
}

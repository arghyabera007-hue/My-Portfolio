import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import SectionHeading from "./SectionHeading";
import { personalInfo } from "../data/personalInfo";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("sending");

    // Simulate form submission — replace with actual service (EmailJS, Formspree, backend API)
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: GithubIcon,
      label: "GitHub",
      value: "View Profile",
      href: personalInfo.github,
    },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: "Connect",
      href: personalInfo.linkedin,
    },
    {
      icon: MapPin,
      label: "Location",
      value: personalInfo.location,
      href: null,
    },
  ];

  const inputClasses = (field) =>
    `w-full px-4 py-3 rounded-xl bg-surface-800/60 light:bg-surface-50 border text-surface-200 light:text-surface-800 placeholder-surface-500 light:placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors ${
      errors[field]
        ? "border-red-500/50"
        : "border-surface-700/50 light:border-surface-200 focus:border-primary-500/50"
    }`;

  return (
    <section id="contact" className="section-padding bg-surface-900/50 light:bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a question or want to work together? Let's connect!"
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-surface-300 light:text-surface-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClasses("name")}
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-surface-300 light:text-surface-700 mb-2"
                >
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputClasses("email")}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-surface-300 light:text-surface-700 mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, idea, or just say hello..."
                  rows={5}
                  className={`${inputClasses("message")} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-xl gradient-bg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 transition-shadow disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle size={16} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-surface-100 light:text-surface-800 mb-2">
                Let&apos;s talk about everything!
              </h3>
              <p className="text-sm text-surface-400 light:text-surface-600 leading-relaxed">
                Feel free to reach out to me for opportunities, collaborations,
                open source contributions, or just to say hello. I&apos;m always
                open to discussing new projects and creative ideas.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl card-dark group hover:border-primary-500/30 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 light:text-surface-400 font-medium uppercase tracking-wider">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.label !== "Email" ? "_blank" : undefined}
                        rel={item.label !== "Email" ? "noopener noreferrer" : undefined}
                        className="text-sm text-surface-200 light:text-surface-700 hover:text-primary-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm text-surface-200 light:text-surface-700">
                        {item.value}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

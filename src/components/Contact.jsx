import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import SectionHeading from "./SectionHeading";
import { personalInfo } from "../data/personalInfo";
import RadialRevealButton from "./RadialRevealButton";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    _gotcha: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!trimmedMessage) {
      newErrors.message = "Message is required";
    } else if (trimmedMessage.length < 10) {
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
    if (status === "error") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Anti-spam honeypot detection
    if (formData._gotcha) {
      setStatus("success");
      setStatusMessage("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "", _gotcha: "" });
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 5000);
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    try {
      const response = await fetch("https://formspree.io/f/mwlpklzr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (response.ok) {
        setStatus("success");
        setStatusMessage("Thank you! Your message has been sent. I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "", _gotcha: "" });
        setErrors({});
        setTimeout(() => {
          setStatus("idle");
          setStatusMessage("");
        }, 6000);
      } else {
        const data = await response.json().catch(() => null);
        let errorMsg = "Failed to send message. Please try again later.";
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMsg = data.errors.map((err) => err.message).join(", ");
        } else if (data?.error) {
          errorMsg = data.error;
        }
        setStatus("error");
        setStatusMessage(errorMsg);
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setStatusMessage("Network error. Please check your internet connection and try again.");
    }
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
    `w-full px-4 py-3 rounded-xl bg-surface-800/60 light:bg-surface-50 border text-surface-200 light:text-surface-800 placeholder-surface-500 light:placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
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
              {/* Formspree honeypot field for bot protection */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

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
                  disabled={status === "sending"}
                  placeholder="John Doe"
                  className={inputClasses("name")}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
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
                  disabled={status === "sending"}
                  placeholder="john@example.com"
                  className={inputClasses("email")}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-surface-300 light:text-surface-700"
                  >
                    Your Message
                  </label>
                  {formData.message.length > 0 && (
                    <span className="text-xs text-surface-500 light:text-surface-400">
                      {formData.message.trim().length} chars
                    </span>
                  )}
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === "sending"}
                  placeholder="Tell me about your project, idea, or just say hello..."
                  rows={5}
                  className={`${inputClasses("message")} resize-none`}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Status alerts */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  aria-live="polite"
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-3"
                >
                  <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-emerald-300">Message sent successfully!</p>
                    <p className="text-xs text-emerald-400/90 mt-0.5 leading-relaxed">
                      {statusMessage || "Thank you for reaching out! I will get back to you shortly."}
                    </p>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  aria-live="assertive"
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <p className="font-semibold text-red-300">Unable to send message</p>
                    <p className="text-xs text-red-400/90 mt-0.5 leading-relaxed">
                      {statusMessage || "Please check your network and try again, or reach out via email directly."}
                    </p>
                  </div>
                </motion.div>
              )}

              <RadialRevealButton
                type="submit"
                disabled={status === "sending"}
                showText
                fill={status === "error" ? "#ef4444" : status === "success" ? "#10b981" : "#6366f1"}
                textColor="#ffffff"
                hoverFill="#ffffff"
                hoverTextColor={status === "error" ? "#ef4444" : status === "success" ? "#10b981" : "#6366f1"}
                border={{
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: status === "error" ? "#ef4444" : status === "success" ? "#10b981" : "#6366f1",
                }}
                padding="14px 24px"
                rounded={12}
                style={{ width: "100%", fontSize: "0.875rem", fontWeight: 600 }}
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block mr-2" />
                    Sending Message...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle size={16} className="inline mr-2" />
                    Message Sent!
                  </>
                ) : status === "error" ? (
                  <>
                    <RefreshCw size={16} className="inline mr-2" />
                    Try Again
                  </>
                ) : (
                  <>
                    <Send size={16} className="inline mr-2" />
                    Send Message
                  </>
                )}
              </RadialRevealButton>
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

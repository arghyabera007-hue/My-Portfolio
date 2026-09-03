import { motion } from "framer-motion";
import { personalInfo } from "../data/personalInfo";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-600/8 rounded-full blur-[128px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-surface-200 light:text-surface-800">Hi, I&apos;m </span>
              <span className="gradient-text">{personalInfo.name}</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-400 font-medium mb-4">
              {personalInfo.role}
            </p>

            <p className="text-surface-400 light:text-surface-700 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              {personalInfo.bio}
            </p>

          </motion.div>

          {/* Right — Profile Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="hidden md:flex justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative overflow-hidden shadow-2xl rounded-2xl"
              style={{
                width: "300px",
                height: "370px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
                padding: "3px",
                marginTop: "-24px",
              }}
            >
              <div className="rounded-2xl overflow-hidden w-full h-full">
                <img
                  src="/images/profile.jpg"
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>


    </section>
  );
}

import {
  Code2,
  Globe,
  Database,
  Wrench,
  Brain,
} from "lucide-react";

export const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code2,
    skills: [
      { name: "Java", icon: "☕" },
      { name: "Python", icon: "🐍" },
      { name: "JavaScript", icon: "⚡" },
      { name: "C/C++", icon: "⚙️" },
    ],
  },
  {
    title: "Web Development",
    icon: Globe,
    skills: [
      { name: "HTML", icon: "🌐" },
      { name: "CSS", icon: "🎨" },
      { name: "JavaScript", icon: "⚡" },
      { name: "React", icon: "⚛️" },
      { name: "Tailwind CSS", icon: "💨" },
    ],
  },
  {
    title: "Database",
    icon: Database,
    skills: [
      { name: "MongoDB", icon: "🍃" },
      { name: "SQL", icon: "🗄️" },
    ],
  },
  {
    title: "Tools & Technologies",
    icon: Wrench,
    skills: [
      { name: "Git", icon: "🔀" },
      { name: "GitHub", icon: "🐙" },
      { name: "VS Code", icon: "📝" },
      { name: "Linux", icon: "🐧" },
    ],
  },
  {
    title: "Core Concepts",
    icon: Brain,
    skills: [
      { name: "Data Structures & Algorithms", icon: "🧮" },
      { name: "Object-Oriented Programming", icon: "🏗️" },
      { name: "DBMS", icon: "💾" },
      { name: "Computer Networks", icon: "🌍" },
      { name: "Operating Systems", icon: "🖥️" },
      { name: "Software Engineering", icon: "📐" },
    ],
  },
];

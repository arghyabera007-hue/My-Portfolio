// Mock GitHub data — replace with API call later via useGithubRepos hook
export const githubProfile = {
  username: "yourusername",
  profileUrl: "https://github.com/yourusername",
  avatarUrl: "https://github.com/identicons/yourusername.png",
  bio: "Computer Science Student | Aspiring Software Developer",
  publicRepos: 12,
  followers: 25,
  following: 30,
};

export const githubRepos = [
  {
    id: 1,
    name: "exam-registration-system",
    description:
      "A web-based system for online exam registration with student authentication and admin dashboard.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 5,
    forks: 2,
    url: "https://github.com/yourusername/exam-registration-system",
  },
  {
    id: 2,
    name: "image-metadata-classifier",
    description:
      "Python tool to extract and classify image metadata by device, location, and date.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 8,
    forks: 3,
    url: "https://github.com/yourusername/image-metadata-classifier",
  },
  {
    id: 3,
    name: "portfolio-website",
    description:
      "Modern personal portfolio built with React, Tailwind CSS, and Framer Motion.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 12,
    forks: 4,
    url: "https://github.com/yourusername/portfolio-website",
  },
  {
    id: 4,
    name: "weather-dashboard",
    description:
      "Real-time weather dashboard with forecasts and location search using REST API.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 3,
    forks: 1,
    url: "https://github.com/yourusername/weather-dashboard",
  },
  {
    id: 5,
    name: "dsa-solutions",
    description:
      "Collection of Data Structures & Algorithms solutions in Java and Python.",
    language: "Java",
    languageColor: "#b07219",
    stars: 15,
    forks: 6,
    url: "https://github.com/yourusername/dsa-solutions",
  },
  {
    id: 6,
    name: "java-mini-projects",
    description:
      "A collection of mini projects in Java covering OOP concepts and design patterns.",
    language: "Java",
    languageColor: "#b07219",
    stars: 4,
    forks: 2,
    url: "https://github.com/yourusername/java-mini-projects",
  },
];

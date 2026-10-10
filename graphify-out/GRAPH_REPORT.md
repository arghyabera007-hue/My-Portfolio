# Graph Report - My-Portfolio  (2026-10-04)

## Corpus Check
- 32 files · ~159,143 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 117 nodes · 222 edges · 11 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `30e4eb7b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- framer-motion
- App.jsx
- Contact.jsx
- Github.jsx
- dependencies
- RadialRevealButton.jsx
- .oxlintrc.json
- scripts
- Navbar.jsx
- React + Vite

## God Nodes (most connected - your core abstractions)
1. `framer-motion` - 15 edges
2. `lucide-react` - 11 edges
3. `react` - 11 edges
4. `SectionHeading()` - 8 edges
5. `GithubIcon()` - 7 edges
6. `scripts` - 6 edges
7. `RadialRevealButton()` - 6 edges
8. `personalInfo` - 6 edges
9. `LinkedinIcon()` - 5 edges
10. `useGithubProfile()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Contact()` --indirect_call--> `GithubIcon()`  [INFERRED]
  src/components/Contact.jsx → src/components/Icons.jsx
- `Contact()` --indirect_call--> `LinkedinIcon()`  [INFERRED]
  src/components/Contact.jsx → src/components/Icons.jsx
- `Footer()` --indirect_call--> `GithubIcon()`  [INFERRED]
  src/components/Footer.jsx → src/components/Icons.jsx
- `Footer()` --indirect_call--> `LinkedinIcon()`  [INFERRED]
  src/components/Footer.jsx → src/components/Icons.jsx
- `Github()` --calls--> `useGithubProfile()`  [EXTRACTED]
  src/components/Github.jsx → src/hooks/useGithubProfile.js

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+11 more)

### Community 1 - "framer-motion"
Cohesion: 0.20
Nodes (9): framer-motion, Achievements(), typeConfig, AnimatedCounter(), SectionHeading(), Skills(), achievements, education (+1 more)

### Community 2 - "App.jsx"
Cohesion: 0.16
Nodes (12): react, ref_react_dom_client, App(), About(), Education(), ProjectCard(), Projects(), ScrollToTop() (+4 more)

### Community 3 - "Contact.jsx"
Cohesion: 0.35
Nodes (7): lucide-react, Contact(), Footer(), Hero(), GithubIcon(), LinkedinIcon(), personalInfo

### Community 4 - "Github.jsx"
Cohesion: 0.36
Nodes (6): Github(), GITHUB_USERNAME, githubProfile, githubRepos, getInitialProfile(), useGithubProfile()

### Community 5 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, framer-motion, lucide-react, react, react-dom, styled-components, tailwindcss, @tailwindcss/vite

### Community 6 - "RadialRevealButton.jsx"
Cohesion: 0.48
Nodes (6): bandWidthsOf(), DEFAULT_TRANSITION, innerRadiusOf(), num(), RadialRevealButton(), radiusFromPercent()

### Community 7 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 8 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:watch, dev, lint, preview

### Community 9 - "Navbar.jsx"
Cohesion: 0.53
Nodes (3): Navbar(), navLinks, useScrollSpy()

### Community 10 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **36 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 40 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `framer-motion` connect `framer-motion` to `package.json`, `App.jsx`, `Contact.jsx`, `Github.jsx`, `RadialRevealButton.jsx`, `Navbar.jsx`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `package.json`, `framer-motion`, `Contact.jsx`, `Github.jsx`, `RadialRevealButton.jsx`, `Navbar.jsx`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Contact.jsx` to `package.json`, `framer-motion`, `App.jsx`, `Github.jsx`, `Navbar.jsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
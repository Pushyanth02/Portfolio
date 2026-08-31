import type { IconName } from "@/components/site/icons";

/**
 * Technologies — extracted verbatim from the latest resume
 * (public/Pushyanth_Reddy_Resume.pdf → TECHNICAL SKILLS), grouped for the
 * dedicated "Technologies" section that replaces the old AI Workbench.
 * The resume's five skill lines map onto four visible groups: its
 * "Frontend & UI" line (incl. Zustand + UI/UX accessibility) lives in
 * frameworks, and "Backend & Databases" (Node + SQL + client-side stores)
 * lives in backend. The resume's soft skills stay in the about prose —
 * a technologies section shouldn't list personality.
 */
export type TechCategory = {
  id: string;
  label: string;
  hint: string;
  items: string[];
};

export const TECHNOLOGIES: TechCategory[] = [
  {
    id: "languages",
    label: "Languages",
    hint: "typed · strict · daily",
    items: ["TypeScript", "JavaScript", "Python", "C", "C++", "HTML5", "CSS3", "SQL"],
  },
  {
    id: "frameworks",
    label: "Frontend & UI",
    hint: "the interface core",
    items: ["Next.js", "React", "Tailwind CSS", "Zustand", "UI/UX Accessibility"],
  },
  {
    id: "backend",
    label: "Backend & Data",
    hint: "api · sql · persistence",
    items: ["Node.js", "PostgreSQL", "MySQL", "SQLite", "IndexedDB"],
  },
  {
    id: "platform",
    label: "Tools & Platforms",
    hint: "ship · automate · deploy",
    items: ["Git", "GitHub", "GitHub Actions", "Docker", "Vercel", "VS Code"],
  },
];

export const TECH_TOTAL = TECHNOLOGIES.reduce((n, c) => n + c.items.length, 0);

/** The 13 daily-driver AI tools (former "AI Workbench") — kept as a compact
 *  footer row inside the Technologies section. */
export const TOOLS: { name: string; icon: IconName }[] = [
  { name: "Claude", icon: "claude" },
  { name: "ChatGPT", icon: "chatgpt" },
  { name: "Gemini", icon: "gemini" },
  { name: "Grok", icon: "grok" },
  { name: "Google AI Studio", icon: "aistudio" },
  { name: "Codex", icon: "codex" },
  { name: "Claude Code", icon: "claudecode" },
  { name: "VS Code", icon: "vscode" },
  { name: "Kiro", icon: "kiro" },
  { name: "Antigravity", icon: "antigravity" },
  { name: "Z.ai", icon: "zai" },
  { name: "Qwen", icon: "qwen" },
  { name: "NVIDIA NIM", icon: "nvidianim" },
];

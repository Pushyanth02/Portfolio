import type { IconName } from "@/components/site/icons";

/**
 * Technologies — extracted verbatim from the latest resume
 * (public/Pushyanth_Reddy_Resume.pdf → TECHNICAL SKILLS), grouped for the
 * dedicated "Technologies" section that replaces the old AI Workbench.
 * Four categories: Languages, Frontend, Client/Browser Systems, and Tools.
 * Soft skills are intentionally excluded — the technologies section lists
 * only project-proven technical capabilities.
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
    items: ["TypeScript", "JavaScript", "Python", "C", "C++", "SQL"],
  },
  {
    id: "frontend",
    label: "Frontend",
    hint: "the interface core",
    items: ["Next.js", "React", "Tailwind CSS", "Zustand", "HTML5", "CSS3"],
  },
  {
    id: "browser",
    label: "Client/Browser Systems",
    hint: "storage · audio · streaming",
    items: ["IndexedDB", "Web Audio API", "Server-Sent Events", "Zod (schema validation)"],
  },
  {
    id: "tools",
    label: "Tools",
    hint: "ship · automate · deploy",
    items: ["Git", "GitHub", "GitHub Actions (CI/CD)", "Vercel", "VS Code"],
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

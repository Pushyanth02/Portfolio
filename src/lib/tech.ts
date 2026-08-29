import type { IconName } from "@/components/site/icons";

/**
 * Technologies — extracted verbatim from the resume
 * (public/Pushyanth_Reddy_Resume.pdf → SKILLS SUMMARY), grouped for the
 * dedicated "Technologies" section that replaces the old AI Workbench.
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
    items: ["TypeScript", "JavaScript", "Python", "C", "C++", "HTML", "CSS", "SQL"],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    hint: "the full-stack core",
    items: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    id: "backend",
    label: "Backend & Data",
    hint: "api + persistence",
    items: ["Node.js", "PostgreSQL", "MySQL"],
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

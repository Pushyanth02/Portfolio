import { Icon, type IconName } from "./icons";

const TOOLS: { name: string; icon: IconName }[] = [
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

export function Workbench() {
  return (
    <section className="sec bench" id="stack">
      <div className="wrap">
        <p className="kicker reveal">the daily drivers</p>
        <h2 className="h2"><span className="lm"><span className="lm-in">My AI workbench.</span></span></h2>
        <p className="bench-sub reveal" style={{ "--d": ".1s" } as React.CSSProperties}>
          Models, agents and editors in active rotation — employed practically to enhance
          functionality and performance, evaluated on shipped outcomes, not hype.
        </p>
        <div className="sticker-wrap reveal" style={{ "--d": ".2s" } as React.CSSProperties}>
          {TOOLS.map((t) => (
            <span className="sticker" key={t.name}>
              <Icon name={t.icon} /> {t.name}
            </span>
          ))}
        </div>
        <p className="bench-note reveal" style={{ "--d": ".3s" } as React.CSSProperties}>
          {TOOLS.length} tools in rotation · hands-on, practical, daily
        </p>
      </div>
    </section>
  );
}

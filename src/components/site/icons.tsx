import type { SVGProps } from "react";

/**
 * Icon — inline SVG by name, matching the source sprite set.
 * Renders a <svg class="ic"> element so all source CSS (.ic, .ic.fill) applies.
 */
export type IconName =
  | "inf" | "mail" | "gh" | "in" | "check" | "bolt" | "award" | "id"
  | "graph" | "branch" | "spark" | "star" | "chip" | "term" | "code"
  | "compass" | "rocket" | "ufo" | "sliders" | "book" | "cube" | "robot" | "menu"
  | "claude" | "chatgpt" | "gemini" | "grok" | "aistudio" | "codex"
  | "claudecode" | "vscode" | "kiro" | "antigravity" | "zai" | "qwen" | "nvidianim";

const PATHS: Record<IconName, React.ReactNode> = {
  inf: <path d="M18.2 8c5 0 5 8 0 8-3.8 0-4.9-3.4-6.2-5-1.3-1.6-2.4-5-6.2-5-5 0-5 8 0 8 3.8 0 4.9-3.4 6.2-5 1.3-1.6 2.4-5 6.2-5z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7.5 12 13.5l8.5-6" /></>,
  gh: <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.66.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.2.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />,
  in: <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.28 2.37 4.28 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />,
  check: <path d="m20 6-11 11-5-5" />,
  bolt: <path d="M13 2 3.5 14H12l-1 8 9.5-12H12l1-8z" />,
  award: <><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></>,
  id: <><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="12" cy="10" r="2.4" /><path d="M8 17c.8-1.9 2.2-2.8 4-2.8s3.2.9 4 2.8" /></>,
  graph: <><circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="8" r="2.4" /><circle cx="10" cy="18" r="2.4" /><path d="M8.3 6.6 15.6 7.6M6.8 8.3l2.5 7.3M16.3 9.9l-4.6 6.3" /></>,
  branch: <><circle cx="6" cy="5" r="2.2" /><circle cx="6" cy="19" r="2.2" /><circle cx="18" cy="8" r="2.2" /><path d="M6 7.2v9.6M18 10.2c0 3.3-2.7 6-6 6H8.2" /></>,
  spark: <path d="M12 4l1.7 4.8L18.5 10l-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.2z" />,
  star: <path d="m12 3.5 2.1 4.6 5 .6-3.7 3.4 1 5-4.4-2.5-4.4 2.5 1-5L4.9 8.7l5-.6z" />,
  chip: <><rect x="7" y="7" width="10" height="10" rx="2" /><rect x="10.5" y="10.5" width="3" height="3" /><path d="M9 3v2.5M15 3v2.5M9 18.5V21M15 18.5V21M3 9h2.5M3 15h2.5M18.5 9H21M18.5 15H21" /></>,
  term: <path d="m4 17 6-6-6-6M12 19h8" />,
  code: <path d="m8 6-5 6 5 6M16 6l5 6-5 6" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15 9-1.5 4.5L9 15l1.5-4.5z" /></>,
  rocket: <path d="M12 2.5c2.6 1.8 3.8 4.6 3.8 7.6l-2.3 2.4h-3L8.2 10c0-3 1.2-5.7 3.8-7.5z" />,
  ufo: <path d="M8.5 10.6a4.2 4.2 0 0 1 7 0M9 18.2 7.5 20.8M15 18.2l1.5 2.6M12 18.5V21" />,
  sliders: <path d="M5 4v16M12 4v16M19 4v16" />,
  book: <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />,
  cube: <path d="M12 2.7 20.5 7.5v9L12 21.3 3.5 16.5v-9z" />,
  robot: <path d="M5 8h14v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  claude: (
    <>
      <path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M5.3 18.7l13.4-13.4" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  chatgpt: (
    <path d="M19.2 14.5a3.6 3.6 0 0 0-2.2-4.9 3.6 3.6 0 0 0-4.5-2.8 3.6 3.6 0 0 0-5.4 1.3 3.6 3.6 0 0 0-3.3 3.9 3.6 3.6 0 0 0 2.2 4.9 3.6 3.6 0 0 0 4.5 2.8 3.6 3.6 0 0 0 5.4-1.3 3.6 3.6 0 0 0 3.3-3.9z M12 8.4v7.2 M8.4 10l7.2 4 M8.4 14l7.2-4" />
  ),
  gemini: (
    <path d="M12 2C12 7.5 7.5 12 2 12c5.5 0 10 4.5 10 10 0-5.5 4.5-10 10-10-5.5 0-10-4.5-10-10z" />
  ),
  grok: (
    <>
      <path d="m4.5 3.5 10.5 17h4.5L9 3.5z" />
      <path d="m4.5 20.5 5.5-6.5-2.8-4.5-2.7 3.5z" />
    </>
  ),
  aistudio: (
    <>
      <path d="M8 2.5c0 3.6-2.9 6.5-6.5 6.5 3.6 0 6.5 2.9 6.5 6.5 0-3.6 2.9-6.5 6.5-6.5-3.6 0-6.5-2.9-6.5-6.5z" />
      <path d="M15 15h6M19 12v6M14 20h7M16.5 18.5v3" />
    </>
  ),
  codex: (
    <>
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" />
      <path d="m8 8.5-3.5 3.5 3.5 3.5M16 8.5l3.5 3.5-3.5 3.5M13 7.5l-2 9" />
    </>
  ),
  claudecode: (
    <>
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" />
      <path d="m6.5 9 3 3-3 3M11 15h3" />
      <path d="M17.5 8v3M16 9.5h3" />
    </>
  ),
  vscode: (
    <path d="M17.5 2.5 8.5 9.5 4 6 2 7.5v9L4 18l4.5-3.5 9 7 4.5-2.5V5zM17.5 7v10L9.5 12z" />
  ),
  kiro: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="12 5.5 15.5 15.5 12 13 8.5 15.5" />
    </>
  ),
  antigravity: (
    <>
      <path d="m12 2.5 7.5 13H4.5z" />
      <path d="M12 2.5v13M4.5 15.5l7.5-3.5 7.5 3.5" />
      <path d="M6 20.5h12" />
    </>
  ),
  zai: (
    <>
      <path d="M4 5.5h16L8.5 15H20" />
      <circle cx="5.5" cy="18.5" r="2" />
      <path d="M7.5 18.5H19" />
    </>
  ),
  qwen: (
    <>
      <path d="m12 2.5 7.5 4.3v8.6L12 19.7 4.5 15.4V6.8z" />
      <circle cx="12" cy="11.1" r="3.2" />
      <path d="m14.2 13.3 3.8 4.2" />
    </>
  ),
  nvidianim: (
    <>
      <rect x="5.5" y="5.5" width="13" height="13" rx="2.5" />
      <path d="M9.5 12a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-5 0" />
      <path d="M9.5 2.5v3M14.5 2.5v3M9.5 18.5v3M14.5 18.5v3M2.5 9.5h3M2.5 14.5h3M18.5 9.5h3M18.5 14.5h3" />
    </>
  ),
};

type IconProps = Omit<SVGProps<SVGSVGElement>, "fill"> & {
  name: IconName;
  fill?: boolean;
};

export function Icon({ name, fill, className, ...rest }: IconProps) {
  return (
    <svg
      className={`ic${fill ? " fill" : ""}${className ? ` ${className}` : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

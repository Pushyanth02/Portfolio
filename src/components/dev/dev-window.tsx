import type { ReactNode } from "react";

/**
 * DevWindow — the developer mode's terminal window chrome.
 * macOS traffic dots + a title bar + a dark code surface. Purely presentational.
 */
export function DevWindow({
  title,
  children,
  className = "",
  prompt,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  /** optional shell command rendered as the first line of the body */
  prompt?: string;
}) {
  return (
    <div className={`dv-win reveal ${className}`}>
      <div className="dv-win-bar">
        <span className="dv-win-dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="dv-win-title">{title}</span>
        <span className="dv-win-meta" aria-hidden="true">
          utf-8 · bash
        </span>
      </div>
      <div className="dv-win-body">
        {prompt && (
          <p className="dv-win-prompt" aria-hidden="true">
            <span className="dv-user">pushyanth</span>
            <span className="dv-at">@</span>
            <span className="dv-host">infinity</span>
            <span className="dv-dim">:~$</span> {prompt}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

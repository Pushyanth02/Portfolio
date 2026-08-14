"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

/**
 * Sonner toaster, themed to match the portfolio's warm sticker palette.
 * Uses the design tokens defined in globals.css (--ink, --cream, --coral).
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: "var(--ink)",
          color: "var(--cream)",
          border: "1.5px solid var(--ink)",
          borderRadius: "14px",
          boxShadow: "4px 4px 0 var(--coral)",
          fontFamily: "var(--mono), monospace",
          fontSize: "0.82rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

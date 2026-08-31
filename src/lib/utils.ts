import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function assetUrl(path: string): string {
  // Match the basePath in next.config.ts. During build this must be set
  // via NEXT_PUBLIC_BASE_PATH; at runtime on GitHub Pages it falls back
  // to the <base> tag injected by Next.js static export.
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Portfolio";
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

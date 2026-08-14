import type { NextConfig } from "next";

/**
 * Static-export configuration for GitHub Pages (and any static host).
 *
 * The site is a fully static export — no server runtime, no API routes,
 * no image optimization server. All state lives in the browser.
 *
 * basePath: derived from NEXT_PUBLIC_BASE_PATH so the same code works on
 *   - a root domain / user page  (basePath = "")  →  leave the env var unset
 *   - a GitHub Pages project site (basePath = "/repo-name")  → set at build time
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      ...(config.resolve.modules || []),
    ];
    return config;
  },
};

export default nextConfig;

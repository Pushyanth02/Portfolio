import type { NextConfig } from "next";

/**
 * Static-export configuration (GitHub Pages).
 *
 * The site is a fully client-side portfolio (no server runtime): it builds
 * with `next build` into the `out/` directory and deploys to GitHub Pages
 * via `.github/workflows/deploy.yml`. `public/.nojekyll` disables Jekyll
 * so underscore-prefixed assets and the `out/` tree are served verbatim.
 *
 * basePath: set NEXT_PUBLIC_BASE_PATH="/<repo>" when deploying a project
 * site (e.g. /pushyanth-portfolio). Leave empty for a user/org site
 * (<user>.github.io) — the GitHub Actions workflow wires this
 * automatically from the repository name.
 *
 * `next dev` ignores `output: "export"` — local development is unaffected.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves from pushyanth02.github.io/Portfolio/
  // In dev (Freebuff preview), NEXT_PUBLIC_BASE_PATH is empty so the app
  // serves from root and the preview proxy can reach it without a prefix.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "/Portfolio",
  images: {
    unoptimized: true, // static export — no image optimization server
    formats: ["image/avif", "image/webp"],
  },
  // Compress HTML/CSS/JS in production
  compress: true,
  // Omit x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;

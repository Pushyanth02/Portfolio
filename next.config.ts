import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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

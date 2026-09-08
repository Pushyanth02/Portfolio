import type { Metadata, Viewport } from "next";
import { Fraunces, Epilogue, Space_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ContentProtection } from "@/components/site/content-protection";
import { InfinityLoader } from "@/components/site/infinity-loader";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F5EFE3",
  width: "device-width",
  initialScale: 1,
};

const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://pushyanth02.github.io/Portfolio/"),
  title: "Pushyanth ∞ · Frontend-focused Software Engineer",
  description:
    "Pushyanth (Pushyanth02) · CS undergrad & frontend-focused software engineer building local-first, client-side applications. Archmage, Lemniscate, Dungeoncore Necromancer, and certificates.",
  keywords: [
    "Pushyanth",
    "Pushyanth02",
    "frontend software engineer",
    "systems builder",
    "software engineer",
    "Lemniscate",
    "Archmage",
    "Dungeoncore Necromancer",
    "AI-native",
    "deterministic",
    "self-hosted",
    "local-first",
  ],
  authors: [{ name: "Pushyanth" }],
  creator: "Pushyanth",
  publisher: "Pushyanth",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  manifest: `${bp}/site.webmanifest`,
  icons: {
    icon: [
      { url: `${bp}/favicon.ico`, sizes: "any" },
      { url: `${bp}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${bp}/favicon.svg`, type: "image/svg+xml" },
    ],
    shortcut: [`${bp}/favicon.ico`],
    apple: [{ url: `${bp}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Pushyanth ∞ · Frontend-focused Software Engineer",
    description:
      "CS undergrad & frontend-focused software engineer building local-first, client-side applications. Archmage, Lemniscate, Dungeoncore Necromancer, and certificates.",
    type: "website",
    siteName: "Pushyanth",
    locale: "en_US",
    images: [
      {
        url: `${bp}/art/doodle.webp`,
        width: 1024,
        height: 1024,
        alt: "Pushyanth Portfolio Mascot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pushyanth ∞ · Frontend-focused Software Engineer",
    description:
      "Frontend-focused software engineer building local-first, client-side applications. Archmage, Lemniscate, Dungeoncore Necromancer, and certificates.",
    images: [`${bp}/art/doodle.webp`],
  },
};

const year = new Date().getFullYear();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pushyanth",
  alternateName: "Pushyanth02",
  url: "https://pushyanth02.github.io/Portfolio/",
  jobTitle: "Frontend-focused Software Engineer",
  copyrightYear: year,
  copyrightHolder: { "@type": "Person", name: "Pushyanth" },
  license: "https://pushyanth02.github.io/Portfolio/ — All Rights Reserved",
  sameAs: [
    "https://github.com/Pushyanth02",
    "https://www.linkedin.com/in/pushyanth-reddy",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Full-Stack Web Development",
    "TypeScript",
    "React",
    "Next.js",
    "Data Structures & Algorithms",
    "Deterministic Systems",
    "Local-First Architectures",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* noscript fallback: ensure reveals are visible without JS */}
        <noscript>
          <style>{`.reveal,.lm .lm-in{opacity:1;transform:none}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${fraunces.variable} ${epilogue.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <InfinityLoader />
        <Suspense>
          {children}
        </Suspense>
        <ContentProtection />
        <SonnerToaster position="bottom-center" richColors={false} />
      </body>
    </html>
  );
}

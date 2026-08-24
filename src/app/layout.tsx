import type { Metadata, Viewport } from "next";
import { Fraunces, Epilogue, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ContentProtection } from "@/components/site/content-protection";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://pushyanth02.github.io/Portfolio/"),
  title: "Pushyanth ∞ — Full-Stack Developer & Systems Builder",
  description:
    "Pushyanth (Pushyanth02) — CS/DSA student & builder creating AI-powered, deterministic, self-hosted, explainable software. Lemniscate, Luck-O-Matic 9000, Dungeoncore Necromancer, and side quests.",
  keywords: [
    "Pushyanth",
    "Pushyanth02",
    "full-stack developer",
    "systems builder",
    "software engineer",
    "Lemniscate",
    "Luck-O-Matic 9000",
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Pushyanth ∞ — Full-Stack Developer & Systems Builder",
    description:
      "CS/DSA student & builder creating AI-powered, deterministic, self-hosted, explainable software. Lemniscate, Luck-O-Matic 9000, Dungeoncore Necromancer, and side quests.",
    type: "website",
    siteName: "Pushyanth",
    locale: "en_US",
    images: [
      {
        url: "/art/doodle.webp",
        width: 1024,
        height: 1024,
        alt: "Pushyanth Portfolio Mascot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pushyanth ∞ — Full-Stack Developer & Systems Builder",
    description:
      "AI-powered, deterministic, self-hosted, explainable software. Lemniscate, Luck-O-Matic 9000, Dungeoncore Necromancer, and side quests.",
    images: ["/art/doodle.webp"],
  },
};

const year = new Date().getFullYear();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pushyanth",
  alternateName: "Pushyanth02",
  url: "https://pushyanth02.github.io/Portfolio/",
  jobTitle: "Full-Stack Developer & Systems Builder",
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
        className={`${fraunces.variable} ${epilogue.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        {children}
        <ContentProtection />
        <SonnerToaster position="bottom-center" richColors={false} />
      </body>
    </html>
  );
}

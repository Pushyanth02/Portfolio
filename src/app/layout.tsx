import type { Metadata, Viewport } from "next";
import { Fraunces, Epilogue, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

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
    "Pushyanth (Pushyanth02) — CS/DSA student & builder creating AI-powered, deterministic, self-hosted, explainable software. Lemniscate, InfinityFG and other side quests.",
  keywords: [
    "Pushyanth",
    "Pushyanth02",
    "full-stack developer",
    "systems builder",
    "software engineer",
    "Lemniscate",
    "InfinityFG",
    "AI-native",
    "deterministic",
    "self-hosted",
  ],
  authors: [{ name: "Pushyanth" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Pushyanth ∞ — Full-Stack Developer & Systems Builder",
    description:
      "CS/DSA student & builder creating AI-powered, deterministic, self-hosted, explainable software. Lemniscate, InfinityFG and side quests.",
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
      "AI-powered, deterministic, self-hosted, explainable software. Lemniscate, InfinityFG and side quests.",
    images: ["/art/doodle.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pushyanth",
  alternateName: "Pushyanth02",
  url: "https://pushyanth02.github.io/Portfolio/",
  jobTitle: "Full-Stack Developer & Systems Builder",
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
        <SonnerToaster position="bottom-center" richColors={false} />
      </body>
    </html>
  );
}

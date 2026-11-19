import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shivam Singh – Full Stack Developer · GenAI",
  description:
    "Full Stack Developer building web products in Next.js, React, Node.js and Python, with RAG, agents and AI features. Open to Full Stack and GenAI roles.",
  openGraph: {
    title: "Shivam Singh – Full Stack Developer · GenAI",
    description: "Next.js, React, Node.js, Python and GenAI. Ask the AI assistant about my work.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
};

// Runs before first paint: saved theme, else the system preference. Prevents a light/dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

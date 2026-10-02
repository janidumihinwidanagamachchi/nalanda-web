import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.website),
  title: {
    default: `${SITE.name}, ${SITE.place}`,
    template: `%s · ${SITE.name}`,
  },
  description: `${SITE.name} is a national school in ${SITE.place}, ${SITE.country}, founded in ${SITE.establishedYear}. ${SITE.tagline}.`,
  applicationName: SITE.name,
  keywords: [
    "Nalanda College",
    "Colombo",
    "Sri Lanka",
    "national school",
    "education",
    "Ananda College",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name}, ${SITE.place}`,
    description: SITE.vision,
    locale: "en_LK",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}, ${SITE.place}`,
    description: SITE.vision,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#14100f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${newsreader.variable}`}>
      <body className="min-h-[100dvh] bg-surface text-ink antialiased">
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[400] focus:rounded-[2px] focus:bg-accent focus:px-4 focus:py-2 focus:text-surface-raised"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
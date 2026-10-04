import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/data/site";
import { organizationSchema, schoolSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.website),
  title: {
    default: `${SITE.name}, ${SITE.place}`,
    template: `%s · ${SITE.name}`,
  },
  description: `${SITE.name} is a ${SITE.category.toLowerCase()} in ${SITE.place}, ${SITE.country}, founded in ${SITE.establishedYear}. ${SITE.tagline}.`,
  applicationName: SITE.name,
  // Ananda College is the school Nalanda was founded as a section of, and it
  // appears in the history, but listing a different school as a keyword for this
  // one is how this list ended up with it: someone added a term that appears in
  // the copy without asking whether it describes this site. Removed — the terms
  // below are all things this site is actually about.
  keywords: [
    "Nalanda College",
    "Nalanda College Colombo",
    "Colombo",
    "Sri Lanka",
    `${SITE.category} school`,
    "boys school Sri Lanka",
    "education",
    SITE.tagline,
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  category: "education",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name}, ${SITE.place}`,
    description: SITE.vision,
    locale: "en_LK",
    url: SITE.website,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}, ${SITE.place}`,
    description: SITE.vision,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0b0c" },
  ],
  colorScheme: "light dark",
};

/**
 * Applies the stored theme before first paint.
 *
 * Without this the browser resolves `color-scheme` from the OS, paints once,
 * and only then would React discover a stored preference — so a dark-mode
 * visitor sees a white flash on every navigation to a fresh document. This has
 * to be a blocking inline script in `<head>` for that reason: deferring it to
 * after hydration defeats the purpose.
 *
 * Kept deliberately tiny and dependency-free. It only mirrors the stored value
 * onto the root element; all actual styling lives in globals.css via
 * `light-dark()`.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("nalanda-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`;

/**
 * The document shell: html, head and body, and nothing else.
 *
 * Chrome lives in `app/(site)/layout.tsx` instead of here so `/admin` can render
 * its own. This layout exists to set up `<html>`, inject the theme script before
 * first paint, and provide the skip link target that both shells render into.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /*
    Two graphs, emitted once here rather than per route: `School` describes the
    institution every page is about, and `Organization` carries the social
    accounts and the contact point. The news and calendar routes add
    `NewsArticle` and `Event` on top for their own pages.
  */
  const structuredData = [schoolSchema(), organizationSchema()];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          `suppressHydrationWarning` on <html> covers exactly one thing: this
          script mutating `data-theme` on the root element, which React cannot
          predict during hydration.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {structuredData.map((graph, index) => (
          <script
            key={index}
            type="application/ld+json"
            // The payload is assembled from SITE in this repository, not from a
            // request, so there is nothing here for a user to inject.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
          />
        ))}
      </head>
      <body className="min-h-[100dvh] bg-canvas text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-modal)] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
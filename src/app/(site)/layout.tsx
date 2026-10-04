import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/**
 * The public site chrome.
 *
 * Navbar, footer and the `#main` landmark live here rather than in the root
 * layout so that `/admin` can have its own shell. An editor working through a
 * form should not have the whole public navigation one stray click away, and the
 * panel has no business carrying the site's header.
 *
 * URLs are unchanged: a route group is invisible to the URL, so `(site)/about`
 * is still `/about`.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
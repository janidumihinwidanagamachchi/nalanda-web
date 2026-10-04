import type { MetadataRoute } from "next";
import { ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";
import { getArticles } from "@/lib/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.website;
  const now = new Date();

  const priority = (p: number) => ({ priority: p });

  // trailingSlash: true means the exported URLs end in a slash, so the
  // sitemap must too. Host stays SITE.website (the production domain) rather
  // than the temporary GitHub Pages subpath.
  const url = (p: string) => (p === "/" ? base : `${base}${p}/`);

  const staticRoutes = [
    { path: ROUTES.home, priority: 1 },
    { path: ROUTES.about, priority: 0.8 },
    { path: ROUTES.history, priority: 0.8 },
    { path: ROUTES.pastPrincipals, priority: 0.6 },
    { path: ROUTES.centenary, priority: 0.7 },
    { path: ROUTES.academics, priority: 0.9 },
    { path: ROUTES.admissions, priority: 0.9 },
    { path: ROUTES.announcements, priority: 0.9 },
    { path: ROUTES.news, priority: 0.8 },
    { path: ROUTES.extraCurricular, priority: 0.7 },
    { path: ROUTES.clubs, priority: 0.6 },
    { path: ROUTES.societies, priority: 0.6 },
    { path: ROUTES.sports, priority: 0.6 },
    { path: ROUTES.community, priority: 0.6 },
    { path: ROUTES.channels, priority: 0.6 },
    { path: ROUTES.downloads, priority: 0.7 },
    { path: ROUTES.gallery, priority: 0.5 },
    { path: ROUTES.calendar, priority: 0.5 },
    { path: ROUTES.alumni, priority: 0.6 },
    { path: ROUTES.campus, priority: 0.5 },
    { path: ROUTES.newsletter, priority: 0.4 },
    { path: ROUTES.contact, priority: 0.7 },
    { path: ROUTES.widgets, priority: 0.4 },
    { path: ROUTES.credits, priority: 0.3 },
  ];

  const articles = await getArticles();

  // ROUTES.admin is deliberately absent from staticRoutes. The panel is
  // noindex and should not be advertised in a sitemap; it is reachable by URL
  // and gated by Supabase Auth.
  return [
    ...staticRoutes.map((route) => ({
      url: url(route.path),
      lastModified: now,
      ...priority(route.priority),
    })),
    ...articles.map((article) => ({
      url: url(`${ROUTES.news}/${article.slug}`),
      lastModified: new Date(article.publishedAt),
      ...priority(0.6),
    })),
  ];
}
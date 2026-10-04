import type { NextConfig } from "next";

// Hosted on GitHub Pages at janidumihinwidanagamachchi.github.io/nalanda-web,
// which is served from a subpath, hence basePath/assetPrefix.
// trailingSlash makes the exporter emit out/<route>/index.html, which is what
// GitHub Pages resolves. Without it Pages would look for /history.html and 404.
// images.unoptimized is required because the image optimizer needs a server,
// and a static export has none.
//
// The `**.supabase.co` pattern is for photographs uploaded through /admin: the
// public Storage bucket serves them from the project's own hostname, and a
// wildcard is the only way to allowlist it without knowing the project
// reference at build time. It is safe because writes require an admins row, and
// because unoptimized means these are plain <img> tags — the only thing the
// pattern gates is which origins the markup will point at.
//
// There is deliberately no entry for a stock-photo host. Every image on the
// site is either a file in this repository or one the school has uploaded, so
// the build contacts no third-party image host at all.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nalanda-web",
  assetPrefix: "/nalanda-web",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
import type { NextConfig } from "next";

// Hosted on GitHub Pages at janidumihinwidanagamachchi.github.io/nalanda-web,
// which is served from a subpath, hence basePath/assetPrefix.
// trailingSlash makes the exporter emit out/<route>/index.html, which is what
// GitHub Pages resolves. Without it Pages would look for /history.html and 404.
// images.unoptimized is required because the image optimizer needs a server,
// and a static export has none.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nalanda-web",
  assetPrefix: "/nalanda-web",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
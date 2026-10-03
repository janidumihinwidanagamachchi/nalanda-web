#!/usr/bin/env node
// Serves the static export in out/ the way GitHub Pages will, so that
// `npm run verify` exercises the same URL shapes that go live.
//
// GitHub Pages behaviour being emulated:
//   - the site is mounted under a subpath (basePath), e.g. /nalanda-web
//   - /about/ resolves to out/about/index.html
//   - /about also resolves to out/about/index.html (pretty URLs)
//   - anything unmatched serves out/404.html with HTTP 404
//
// Usage: node scripts/serve-export.mjs [--port N] [--dir out]

import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const argOf = (flag, fallback) => {
  const i = argv.indexOf(flag);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const PORT = Number(argOf("--port", process.env.PORT ?? 3000));
const ROOT = path.resolve(argOf("--dir", "out"));

// Must match basePath in next.config.ts.
const BASE_PATH = argOf("--base", "/nalanda-web");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function contentType(file) {
  return MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

// Map a request path to a file inside ROOT, or null if nothing matches.
function resolveFile(urlPath) {
  // Strip the mount point. Requests outside it are not part of this site.
  if (BASE_PATH && !urlPath.startsWith(BASE_PATH)) return null;
  let rest = BASE_PATH ? urlPath.slice(BASE_PATH.length) : urlPath;
  if (rest === "" || rest === "/") rest = "/index.html";
  rest = decodeURIComponent(rest.split("?")[0]);

  // Block traversal outside ROOT.
  const candidate = path.join(ROOT, path.normalize(rest));
  if (!candidate.startsWith(ROOT)) return null;

  if (isFile(candidate)) return candidate;

  // Directory index: /about/ and /about both resolve to about/index.html
  const index = path.join(candidate, "index.html");
  if (isFile(index)) return index;

  return null;
}

export function createServer() {
  return http.createServer((req, res) => {
    const urlPath = (req.url ?? "/").split("?")[0];

    const file = resolveFile(urlPath);

    if (file) {
      res.writeHead(200, {
        "content-type": contentType(file),
        "cache-control": "no-store",
      });
      createReadStream(file).pipe(res);
      return;
    }

    const notFound = path.join(ROOT, "404.html");
    if (existsSync(notFound)) {
      res.writeHead(404, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      });
      createReadStream(notFound).pipe(res);
      return;
    }

    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  });
}

// Only listen when run directly, so verify.mjs can import createServer.
const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  if (!existsSync(ROOT)) {
    console.error(
      `No export found at ${ROOT}. Run "npm run build" first.`,
    );
    process.exit(1);
  }
  createServer().listen(PORT, "127.0.0.1", () => {
    console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}${BASE_PATH}/`);
    console.log("Ready");
  });
}
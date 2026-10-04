#!/usr/bin/env node
// Pre-push gate for nalanda-web. Runs build, lint, route walk with content
// markers, and link check. Browser-console checks are intentionally disabled —
// see stageBrowserConsole for why, and for what that leaves unverified.
// Non-zero exit on failure.

import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import http from "node:http";
import path from "node:path";

const VER = 1;

const MARKERS = {
  "/": "Wisdom Illuminates Character",
  "/about": "What the college sets out to do",
  "/history": "From a section of Ananda to a hundred years",
  "/past-principals": "The principals who shaped Nalanda",
  "/centenary": "A hundred years, and the works for the next hundred",
  "/academics": "Grades 1 to 13 on the national curriculum",
  "/admissions": "How entry to Nalanda works",
  "/announcements": "Current notices",
  "/news": "Achievements and school news",
  "/extra-curricular": "What happens outside the classroom",
  "/extra-curricular/clubs": "Clubs",
  "/extra-curricular/societies": "Societies",
  "/extra-curricular/sports": "Sport",
  "/community": "The bodies around the college",
  "/channels": "Every official channel",
  "/downloads": "Papers, circulars and governance",
  "/gallery": "A hundred years of the college",
  "/calendar": "Dates",
  "/alumni": "Old Nalandians",
  "/campus": "Siri Dhamma Mawatha",
  "/newsletter": "The Nalanda bulletin",
  "/contact": "Reach the college",
  "/widgets": "The short version",
  "/credits": "Photographs and licences",
};

const NEWS_SLUG = "national-cadet-band-championship";
const NEWS_SLUG_MARKER = "National Cadet Band Championship";

// Admin routes are walked separately from the public ones. They exist in the same
// static export, but they are not part of the site: no public navigation links to
// them, the sitemap omits them, and the only requirement on their markup is that
// it identifies itself. Checking them here means a broken import in the panel fails
// the deploy rather than shipping a 500-looking page nobody would notice.
const ADMIN_ROUTES = {
  "/admin": "Content administration",
  "/admin/announcements": "Content administration",
  "/admin/news": "Content administration",
  "/admin/media": "Content administration",
};

// Every /admin page must be noindex. A login form in a search index is a small,
// pointless invitation, and there is no server here to keep crawlers out later.
const NOINDEX = /<meta name="robots" content="[^"]*noindex/;

let serverHttp = null;
let serverPort = null;

// Must match basePath in next.config.ts.
const BASE_PATH = "/nalanda-web";

function log(msg = "") {
  console.log(msg);
}

function section(name) {
  log(`\n▶ ${name}`);
}

function run(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      env: process.env,
      ...opts,
    });
    let stdout = "";
    let stderr = "";
    let timer = null;

    child.stdout?.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr?.on("data", (d) => {
      stderr += d.toString();
    });

    const finish = (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    };

    if (opts.timeout) {
      timer = setTimeout(() => {
        try {
          child.kill("SIGTERM");
          setTimeout(() => child.kill("SIGKILL"), 5000);
        } catch {}
        reject(new Error(`"${cmd}" timed out after ${opts.timeout}ms`));
      }, opts.timeout);
    }

    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", finish);
  });
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = http.createServer();
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      s.close(() => resolve(addr.port));
    });
    s.on("error", reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, { timeout: 15_000 }, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body, headers: res.headers }),
        );
      })
      .on("error", reject);
  });
}

async function killServer() {
  if (!serverHttp) return Promise.resolve();
  return new Promise((resolve) => {
    serverHttp.close(() => {
      serverHttp = null;
      resolve();
    });
    // Drop keep-alive sockets so close() is not held open.
    serverHttp.closeAllConnections?.();
  });
}

async function stageEnv() {
  const node = process.version;
  const major = Number(node.split(".")[0].slice(1));
  if (major < 24 || major > 24) {
    return { ok: false, message: `Node must be 24.x, found ${node}` };
  }

  const gitignore = readFileSync(".gitignore", "utf8");
  if (!gitignore.includes("!.env.example")) {
    return {
      ok: false,
      message:
        ".env.example is not opted back into git; .gitignore missing !.env.example",
    };
  }
  if (!existsSync(".env.example")) {
    return { ok: false, message: ".env.example is missing" };
  }

  return { ok: true, message: `Node ${node}, .env.example tracked` };
}

async function stageBuild() {
  const { code, stdout, stderr } = await run("npm run build");
  if (code !== 0) {
    return {
      ok: false,
      message: "next build failed",
      detail: stderr.slice(-4000) || stdout.slice(-4000),
    };
  }
  return { ok: true, message: "next build passed" };
}

async function stageLint() {
  const { code, stdout, stderr } = await run("npm run lint");
  if (code !== 0) {
    return {
      ok: false,
      message: "eslint failed",
      detail: stderr || stdout,
    };
  }
  return { ok: true, message: "eslint passed" };
}

/**
 * The site is deliberately free of JS animation libraries. Motion, GSAP and
 * Lenis are gone; hover and focus affordances are CSS transitions. This gate
 * exists so the decision cannot quietly reverse: a dependency coming back, or
 * an import of one of the old modules, fails the run before the build does.
 */
const BANNED_DEPS = ["motion", "gsap", "@gsap/react", "lenis", "framer-motion"];
const BANNED_IMPORTS = [
  /from\s+["']motion(\/react)?["']/,
  /from\s+["']framer-motion(\/react)?["']/,
  /from\s+["']gsap(\/[\w-]+)?["']/,
  /from\s+["']@gsap\/react["']/,
  /from\s+["']lenis["']/,
  /@\/components\/motion\//,
  /@\/lib\/scroll["']/,
  /@\/lib\/pointer["']/,
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx|mjs|js|css)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function stageNoMotion() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const declared = Object.keys({
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  });
  const bannedDeps = BANNED_DEPS.filter((dep) => declared.includes(dep));

  const offenders = [];
  for (const file of walk("src")) {
    const body = readFileSync(file, "utf8");
    for (const pattern of BANNED_IMPORTS) {
      if (pattern.test(body)) {
        offenders.push(`${file}: matches ${pattern}`);
      }
    }
  }

  const failures = [
    ...bannedDeps.map((dep) => `package.json still depends on "${dep}"`),
    ...offenders,
  ];
  if (failures.length) {
    return {
      ok: false,
      message: `${failures.length} animation dependency/import(s) present`,
      detail: failures.join("\n"),
    };
  }
  return {
    ok: true,
    message: `no animation libraries in package.json or src (${declared.length} deps scanned)`,
  };
}

/**
   * Hydration safety: no client component may read the clock during render.
   *
   * A "use client" component is rendered twice on a statically exported site:
   * once by Node at build time, and again in the visitor's browser when React
   * hydrates. A `new Date()` or `Date.now()` evaluated during either render
   * gives the two different answers, React throws away the server HTML, and the
   * visitor sees a hydration error. There is no browser automation in this gate
   * to catch that, which is exactly why it is checked statically here.
   *
   * The safe pattern is to compute in an effect and render a stable placeholder
   * first, which is what the countdown and weather widgets do.
   *
   * `ALLOWED_CLOCK_IN_RENDER` is the one sanctioned exception. Each entry names a
   * component that is client-only under `output: "export"` and therefore has no
   * prerendered markup to disagree with. Adding to this list is a claim that the
   * component cannot become prerenderable without also removing the exemption,
   * so it has to be justified rather than done to silence the check.
   */
  const ALLOWED_CLOCK_IN_RENDER = new Set([
    // Announcements board: `useSearchParams` inside a Suspense boundary means
    // out/announcements/index.html contains only the skeleton, so there is no
    // server-rendered list for a clock read to contradict. See the component's
    // own comment before changing this.
    "src/components/announcements/board.tsx",
  ]);

  const CLOCK_IN_RENDER =
    /use(?:Memo|State)\(\s*(?:\(\)\s*=>\s*)?(?:new Date|Date\.now)/g;

  function stageHydrationSafety() {
    const offenders = [];
    let clientFiles = 0;

    // Normalise to forward slashes so the allowlist is written the same way on
    // every platform. walk() returns whatever path.join produced, which is
    // backslashes on Windows.
    const toPosix = (p) => p.replace(/\\/g, "/");
    const allowed = new Set([...ALLOWED_CLOCK_IN_RENDER].map(toPosix));

    for (const file of walk("src")) {
      if (!/\.tsx?$/.test(file)) continue;
      const body = readFileSync(file, "utf8");
      if (!body.includes("use client")) continue;
      clientFiles += 1;
      if (allowed.has(toPosix(file))) continue;

      for (const match of body.matchAll(CLOCK_IN_RENDER)) {
        offenders.push(`${file}: ${match[0].replace(/\s+/g, " ")} in render`);
      }
    }

    if (offenders.length) {
      return {
        ok: false,
        message: `${offenders.length} client component(s) read the clock during render`,
        detail: [
          ...offenders,
          "",
          "Compute it in an effect and render a stable placeholder first, or, if",
          "this component is client-only under static export, add it to",
          "ALLOWED_CLOCK_IN_RENDER in scripts/verify.mjs with a justification.",
        ].join("\n"),
      };
    }

    return {
      ok: true,
      message: `no render-time clock reads in ${clientFiles} client components (${ALLOWED_CLOCK_IN_RENDER.size} documented exception)`,
    };
  }

  async function stageRoutes() {
  if (!existsSync("out")) {
    return {
      ok: false,
      message: "No out/ directory. The build did not produce a static export.",
    };
  }

  serverPort = await getFreePort();
  section(`Serving out/ on port ${serverPort}`);
  const { createServer } = await import("./serve-export.mjs");
  serverHttp = createServer();
  await new Promise((resolve, reject) => {
    serverHttp.once("error", reject);
    serverHttp.listen(serverPort, "127.0.0.1", resolve);
  });

  const base = `http://127.0.0.1:${serverPort}${BASE_PATH}`;
  const failures = [];
  const routes = Object.keys(MARKERS);

  for (const route of routes) {
    try {
      const { status, body } = await fetchText(`${base}${route}/`);
      if (status !== 200) {
        failures.push(`${route}/: expected 200, got ${status}`);
        continue;
      }
      const marker = MARKERS[route];
      if (!body.includes(marker)) {
        failures.push(`${route}/: missing marker "${marker}"`);
      }
    } catch (err) {
      failures.push(`${route}/: ${err.message}`);
    }
  }

  // News [slug]
  try {
    const { status, body } = await fetchText(`${base}/news/${NEWS_SLUG}/`);
    if (status !== 200) {
      failures.push(`/news/${NEWS_SLUG}/: expected 200, got ${status}`);
    } else if (!body.includes(NEWS_SLUG_MARKER)) {
      failures.push(
        `/news/${NEWS_SLUG}/: missing marker "${NEWS_SLUG_MARKER}"`,
      );
    }
  } catch (err) {
    failures.push(`/news/${NEWS_SLUG}/: ${err.message}`);
  }

  // Admin routes. Checked in the same walk because it is the same server, and a
  // separate stage would mean paying to start it twice.
  for (const route of Object.keys(ADMIN_ROUTES)) {
    try {
      const { status, body } = await fetchText(`${base}${route}/`);
      if (status !== 200) {
        failures.push(`${route}/: expected 200, got ${status}`);
        continue;
      }
      const marker = ADMIN_ROUTES[route];
      if (!body.includes(marker)) {
        failures.push(`${route}/: missing marker "${marker}"`);
      }
      if (!NOINDEX.test(body)) {
        failures.push(`${route}/: missing a noindex robots meta tag`);
      }
    } catch (err) {
      failures.push(`${route}/: ${err.message}`);
    }
  }

  // 404
  try {
    const { status, body } = await fetchText(
      `${base}/no-such-page-verify-test/`,
    );
    if (status !== 404) {
      failures.push(`404 route: expected 404, got ${status}`);
    } else if (!body.includes("404")) {
      failures.push("404 route: status was 404 but body missing '404' marker");
    }
  } catch (err) {
    failures.push(`404 route: ${err.message}`);
  }

  // Assets must resolve under the basePath, and nothing may resolve outside it.
  try {
    const { body } = await fetchText(`${base}/`);
    const attrs = [
      ...body.matchAll(/(?:src|href)="(\/[^"]*_next\/static\/[^"]+)"/g),
    ].map((m) => m[1]);

    if (attrs.length === 0) {
      failures.push("no /_next/static asset references found in the home page");
    } else {
      const missingBase = attrs.filter((a) => !a.startsWith(`${BASE_PATH}/`));
      if (missingBase.length) {
        failures.push(
          `${missingBase.length} asset reference(s) missing the ${BASE_PATH} prefix, e.g. ${missingBase[0]}`,
        );
      }

      // Fetch a sample: first stylesheet, then first script chunk.
      const css = attrs.find((a) => a.endsWith(".css"));
      const js = attrs.find((a) => a.endsWith(".js"));
      for (const asset of [css, js].filter(Boolean)) {
        const { status } = await fetchText(`http://127.0.0.1:${serverPort}${asset}`);
        if (status !== 200) {
          failures.push(`asset ${asset}: expected 200, got ${status}`);
        }
      }
      if (!css || !js) {
        failures.push("could not find both a stylesheet and a script chunk to fetch");
      }
    }
  } catch (err) {
    failures.push(`asset check: ${err.message}`);
  }

  if (failures.length) {
    return {
      ok: false,
      message: `${failures.length} route(s) failed`,
      detail: failures.join("\n"),
    };
  }
  return {
    ok: true,
    message: `${routes.length} routes + ${Object.keys(ADMIN_ROUTES).length} admin + /news/[slug] + 404 + _next asset passed`,
  };
}

/**
 * Two invariants about how the admin panel is allowed to reach the database.
 *
 * 1. No client component may import the build-time content layer.
 *    `@/lib/content` reads the database during `next build`, in Node. Pull it into
 *    a "use client" module and its promises resolve in the visitor's browser, where
 *    the anon key is subject to RLS: the panel would see drafts and unpublished
 *    rows filtered out, or simply fail, and the component would ship an
 *    await-in-render that React cannot satisfy. The panel must go through
 *    `@/lib/supabase/*` and fetch in an effect instead.
 *
 * 2. No service-role key may appear anywhere in the source or the env example.
 *    This is a static site. Every NEXT_PUBLIC_ value is in the shipped bundle, so a
 *    service-role key here would not be a leak that needs noticing — it would be a
 *    published one, bypassing every RLS policy the schema works to enforce.
 */
const CLIENT_CONTENT_IMPORT =
  /import\s+(?:[\s\S]*?from\s+)?["']@\/lib\/content(?:\/[^"']*)?["']/;

const SERVICE_ROLE = /SUPABASE_SERVICE_ROLE|SERVICE_ROLE_KEY/;

function stageAdminBoundary() {
  const failures = [];

  for (const file of walk("src")) {
    if (!/\.tsx?$/.test(file)) continue;
    const body = readFileSync(file, "utf8");
    const isClient = body.includes("use client");

    if (isClient && CLIENT_CONTENT_IMPORT.test(body)) {
      failures.push(
        `${file}: client component imports @/lib/content, which only runs at build time`,
      );
    }
    if (SERVICE_ROLE.test(body)) {
      failures.push(
        `${file}: references a service-role key, which cannot exist on a static site`,
      );
    }
  }

  // The env example ships in the repo and is what someone copies from, so a
  // service-role key there would be the most likely way one gets introduced.
  for (const file of [".env.example"]) {
    if (!existsSync(file)) continue;
    const body = readFileSync(file, "utf8");
    if (/^[^#\n]*SUPABASE_SERVICE_ROLE[^=]*=/m.test(body)) {
      failures.push(`${file}: declares a service-role key variable`);
    }
  }

  // /admin must exist in the export, or these gates are checking nothing.
  if (!existsSync("out/admin/index.html")) {
    failures.push("out/admin/index.html missing; the panel did not build");
  }

  if (failures.length) {
    return {
      ok: false,
      message: `${failures.length} admin boundary violation(s)`,
      detail: failures.join("\n"),
    };
  }

  return {
    ok: true,
    message: "no client imports of the build-time content layer, no service-role keys",
  };
}

/**
 * Files under /public are served from the deployment subpath, so any src/href
 * in the exported HTML rooted at the domain instead of at BASE_PATH will 404 on
 * the deployed Pages site. next/image does not prepend basePath when
 * images.unoptimized is set, which is how the navbar crest and the gallery
 * photographs shipped broken for a long while without any gate noticing: the
 * route-walk asset check only looks at /_next/static.
 */
async function stagePublicAssets() {
  if (!serverHttp) {
    return { ok: false, message: "public asset check ran without a server" };
  }
  const base = `http://127.0.0.1:${serverPort}${BASE_PATH}`;
  const offenders = [];
  let checked = 0;

  for (const route of [...Object.keys(MARKERS), `/news/${NEWS_SLUG}`]) {
    let body;
    try {
      const res = await fetchText(`${base}${route}/`);
      if (res.status !== 200) continue;
      body = res.body;
    } catch {
      continue;
    }

    const refs = new Set(
      [...body.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1]),
    );

    for (const ref of refs) {
      if (ref.startsWith(`${BASE_PATH}/`)) continue;
      // Framework chunks are asserted by the route-walk stage.
      if (ref.startsWith("/_next/")) continue;
      checked += 1;
      offenders.push(`${route}/: ${ref}`);
    }
  }

  if (offenders.length) {
    return {
      ok: false,
      message: `${offenders.length} root-relative reference(s) missing the ${BASE_PATH} prefix`,
      detail: [...new Set(offenders)].slice(0, 20).join("\n"),
    };
  }
  return {
    ok: true,
    message: `${checked} public asset reference(s) all carry the ${BASE_PATH} prefix`,
  };
}

async function stageLinks() {
  const { code, stdout, stderr } = await run("npm run check-links");
  const out = stdout + stderr;
  // check-links exits 1 only on dead links; blocked/warnings are allowed.
  if (code !== 0) {
    return {
      ok: false,
      message: "link check reported dead links",
      detail: out.slice(-4000),
    };
  }
  return { ok: true, message: "link check passed" };
}

async function stageBrowserConsole() {
  // Disabled by decision, not by breakage.
  //
  // The original reason recorded here was that "agent-browser child-process
  // integration is unstable". That diagnosis was wrong and has been corrected.
  // `agent-browser doctor` reports a healthy install (Chrome 154, no failed
  // checks). What actually failed was this project's usage of it: per-session
  // state is keyed by a worktree hash that is identical for every session run
  // against this repo, so sessions collided, and `errors --clear` did not
  // reliably empty the buffer, which made error counts unattributable to any
  // route. Rather than add a browser dependency to fix a QA gap, browser QA was
  // dropped.
  //
  // Consequence, stated plainly: nothing here renders the site. Dark mode,
  // reduced motion, the mobile sheet, and filter-tab interaction are unverified
  // by machine and need a human with a real browser before launch.
  //
  // Hydration safety is instead enforced statically. Date rendering goes
  // through `formatDate` in src/lib/utils.ts (pinned to UTC), and no client
  // component reads the clock during render — `AnnouncementsBoard` takes the
  // instant from a prop. Re-enabling this stage means adding a real browser
  // Re-enabling this stage means adding a real browser driver (e.g. Playwright)
  // and walking the full route list under BASE_PATH on serverPort, asserting an
  // empty console on each.
  return {
    ok: true,
    warn: true,
    message:
      "Browser console checks are intentionally disabled (browser QA dropped; hydration safety enforced statically). Nothing in this gate renders the site — dark mode, reduced motion, the mobile sheet, and filter-tab interaction still need a human on a real browser.",
  };
}

async function main() {
  const start = Date.now();
  log(`Nalanda web verify v${VER}`);
  log(`Working directory: ${process.cwd()}`);

  const stages = [
    { name: "Environment", run: stageEnv },
    { name: "Build", run: stageBuild },
    { name: "Lint", run: stageLint },
    { name: "No animation deps", run: stageNoMotion },
    { name: "Hydration safety", run: stageHydrationSafety },
    { name: "Admin boundary", run: stageAdminBoundary },
    { name: "Route walk", run: stageRoutes },
    { name: "Public assets", run: stagePublicAssets },
    { name: "Link check", run: stageLinks },
    { name: "Browser console", run: stageBrowserConsole },
  ];

  const results = [];

  for (const stage of stages) {
    section(stage.name);
    let result;
    try {
      result = await stage.run();
    } catch (err) {
      result = { ok: false, message: err.message, detail: err.stack };
    }
    results.push({ name: stage.name, ...result });

    if (result.warn) {
      log(`  ⚠ ${result.message}`);
    } else if (result.ok) {
      log(`  ✓ ${result.message}`);
    } else {
      log(`  ✗ ${result.message}`);
      if (result.detail) {
        log(
          result.detail
            .split("\n")
            .map((l) => `    ${l}`)
            .join("\n"),
        );
      }
      // Do not short-circuit teardown of the server.
      break;
    }
  }

  section("Teardown");
  await killServer();
  log("  ✓ Server stopped");

  section("Summary");
  for (const r of results) {
    const icon = r.warn ? "⚠" : r.ok ? "✓" : "✗";
    log(`  ${icon} ${r.name}: ${r.message.split("\n")[0]}`);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`\nFinished in ${elapsed}s`);

  const failed = results.some((r) => !r.ok && !r.warn);
  process.exit(failed ? 1 : 0);
}

main();

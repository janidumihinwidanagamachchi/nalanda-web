#!/usr/bin/env node
// Environment triage for nalanda-web. Advisory by default; use --strict to fail.

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import http from "node:http";

const strict = process.argv.includes("--strict");

function log(msg = "") {
  console.log(msg);
}

function run(cmd) {
  return new Promise((resolve) => {
    const child = spawn(cmd, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => (stdout += d.toString()));
    child.stderr?.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", (err) =>
      resolve({ code: 1, stdout: "", stderr: err.message }),
    );
  });
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function canBind(port) {
  return new Promise((resolve) => {
    const s = http.createServer();
    s.once("error", () => resolve(false));
    s.listen(port, "127.0.0.1", () => {
      s.close(() => resolve(true));
    });
  });
}

async function checkNode() {
  const nvmrc = existsSync(".nvmrc")
    ? readFileSync(".nvmrc", "utf8").trim()
    : null;
  const pkg = readJson("package.json");
  const engines = pkg?.engines?.node;
  const node = process.version;
  const major = node.split(".")[0].slice(1);

  if (nvmrc === "24.x" && engines === "24.x" && major === "24") {
    return { ok: true, message: `Node ${node} matches .nvmrc and engines.node` };
  }

  return {
    ok: false,
    warn: true,
    message: `Node version mismatch: running ${node}, .nvmrc=${nvmrc ?? "missing"}, engines.node=${engines ?? "missing"}`,
    fix: "Install Node 24.x, then run: nvm use 24 && node --version",
  };
}

async function checkStaleNext() {
  if (!existsSync(".next")) {
    return { ok: true, message: "No .next directory (will be built fresh)" };
  }
  return {
    ok: false,
    warn: true,
    message: ".next directory exists; may contain stale artifacts from a different Node or dependency tree",
    fix: "rm -rf .next && npm run build",
  };
}

async function checkEnvLocal() {
  const hasLocal = existsSync(".env.local");
  const gitignore = existsSync(".gitignore")
    ? readFileSync(".gitignore", "utf8")
    : "";
  const ignored = gitignore.includes(".env.local");

  if (hasLocal && ignored) {
    return {
      ok: true,
      message: ".env.local exists and is gitignored",
    };
  }
  if (hasLocal && !ignored) {
    return {
      ok: false,
      message: ".env.local exists but is NOT gitignored — risk of committing secrets",
      fix: "Add '.env.local' to .gitignore",
    };
  }
  return {
    ok: true,
    warn: true,
    message: ".env.local is absent (optional; only needed for embed credentials)",
    fix: "cp .env.example .env.local && fill in any credentials you have",
  };
}

async function checkLockfile() {
  if (!existsSync("package-lock.json")) {
    return {
      ok: false,
      message: "package-lock.json is missing",
      fix: "npm install",
    };
  }

  const pkg = readJson("package.json");
  const lock = readJson("package-lock.json");
  if (!pkg || !lock) {
    return { ok: false, message: "Could not parse package.json or package-lock.json" };
  }

  if (pkg.name !== lock.name || pkg.version !== lock.version) {
    return {
      ok: false,
      warn: true,
      message: `package-lock.json identity mismatch: package=${pkg.name}@${pkg.version}, lock=${lock.name}@${lock.version}`,
      fix: "npm install --package-lock-only",
    };
  }

  const { code, stdout, stderr } = await run(
    "npm install --package-lock-only --dry-run",
  );
  const out = stdout + stderr;
  const wouldChange =
    /added|removed|changed|update/i.test(out) && !/up to date/i.test(out);

  if (code !== 0 || wouldChange) {
    return {
      ok: false,
      warn: true,
      message: "package-lock.json may be out of sync with package.json",
      fix: "npm install --package-lock-only && git diff package-lock.json",
    };
  }

  return { ok: true, message: "package-lock.json in sync" };
}

async function checkPorts() {
  const ports = [3000, 3001];
  const busy = [];
  for (const p of ports) {
    if (!(await canBind(p))) busy.push(p);
  }
  if (busy.length) {
    return {
      ok: false,
      warn: true,
      message: `Ports ${busy.join(", ")} are in use`,
      fix: `Find the processes: Get-NetTCPConnection -LocalPort ${busy.join(",")} (PowerShell) or lsof -i :${busy.join(" :")} (macOS/Linux), then stop them`,
    };
  }
  return { ok: true, message: "Ports 3000 and 3001 are free" };
}

async function checkRemote() {
  const { code, stdout } = await run("git remote get-url origin");
  if (code !== 0) {
    return {
      ok: false,
      message: "No git remote named 'origin'",
      fix: "gh repo create janidumihinwidanagamachchi/nalanda-web --private --source=. --remote=origin --push",
    };
  }
  const url = stdout.trim();

  const view = await run("gh repo view --json visibility --jq .visibility");
  if (view.code !== 0) {
    return {
      ok: false,
      warn: true,
      message: `Remote exists (${url}) but could not read visibility via gh`,
      fix: "gh auth status && gh repo view",
    };
  }

  const visibility = view.stdout.trim();
  if (visibility !== "PRIVATE") {
    return {
      ok: false,
      message: `GitHub repo is ${visibility}, expected PRIVATE`,
      fix: "gh repo edit --visibility private --accept-visibility-change-consequences",
    };
  }

  return { ok: true, message: `Remote origin is ${url} and repo is private` };
}

async function checkWorkingTree() {
  const { stdout } = await run("git status --porcelain=v1");
  if (stdout.trim()) {
    return {
      ok: false,
      warn: true,
      message: "Working tree has uncommitted changes",
      fix: "git status",
    };
  }
  return { ok: true, message: "Working tree is clean" };
}

async function main() {
  log("Nalanda web doctor");
  log(`Working directory: ${process.cwd()}`);
  log(`Mode: ${strict ? "strict (fails on warnings)" : "advisory"}\n`);

  const checks = [
    { name: "Node version", run: checkNode },
    { name: "Stale .next", run: checkStaleNext },
    { name: ".env.local", run: checkEnvLocal },
    { name: "Lockfile sync", run: checkLockfile },
    { name: "Ports 3000/3001", run: checkPorts },
    { name: "Git remote", run: checkRemote },
    { name: "Working tree", run: checkWorkingTree },
  ];

  let failures = 0;
  let warnings = 0;

  for (const check of checks) {
    const result = await check.run();
    const icon = result.ok ? "✓" : result.warn ? "⚠" : "✗";
    log(`${icon} ${check.name}: ${result.message}`);
    if (result.fix) log(`  → ${result.fix}`);
    if (!result.ok) {
      if (result.warn) warnings += 1;
      else failures += 1;
    }
  }

  log("\n---");
  if (failures === 0 && warnings === 0) {
    log("All checks passed.");
  } else {
    log(`${failures} error(s), ${warnings} warning(s).`);
  }

  if (strict && (failures > 0 || warnings > 0)) {
    process.exit(1);
  }
  process.exit(0);
}

main();

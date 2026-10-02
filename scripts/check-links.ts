import { CHANNELS } from "../src/data/channels";

const TIMEOUT_MS = 20_000;
const CONCURRENCY = 6;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type Verdict = "live" | "dead" | "blocked" | "unexpected";

interface Result {
  href: string;
  status: number;
  verdict: Verdict;
  reason?: string;
}

const uniqueUrls = new Set(
  CHANNELS.filter((c) => c.tier === "A").map((c) => c.href),
);
const tierA = Array.from(uniqueUrls);

const verdictFor = (status: number): Verdict => {
  if (status >= 200 && status < 300) return "live";
  if (status === 404 || status === 410) return "dead";
  if (status === 401 || status === 403 || status === 429) return "blocked";
  return "unexpected";
};

async function check(href: string): Promise<Result> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(href, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": USER_AGENT },
    });
    return { href, status: response.status, verdict: verdictFor(response.status) };
  } catch (error) {
    return {
      href,
      status: 0,
      verdict: "unexpected",
      reason: error instanceof Error ? error.message : "unknown",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  console.log(`Checking ${tierA.length} tier A links\n`);

  const results: Result[] = [];
  for (let i = 0; i < tierA.length; i += CONCURRENCY) {
    const batch = tierA.slice(i, i + CONCURRENCY);
    results.push(...(await Promise.all(batch.map(check))));
  }

  const order: Record<Verdict, number> = {
    dead: 0,
    unexpected: 1,
    blocked: 2,
    live: 3,
  };

  let dead = 0;
  for (const result of results.sort(
    (a, b) => order[a.verdict] - order[b.verdict] || a.status - b.status,
  )) {
    console.log(
      `  ${result.verdict.padEnd(11)}${String(result.status).padEnd(6)}${result.href}`,
    );
    if (result.verdict === "dead") dead += 1;
  }

  const live = results.filter((r) => r.verdict === "live").length;
  const blocked = results.filter((r) => r.verdict === "blocked").length;
  const tierB = CHANNELS.filter((c) => c.tier === "B").length;

  console.log(`\n${live} live, ${blocked} blocked by bot protection, ${dead} dead.`);
  console.log(
    `${tierB} tier B links skipped: Facebook and Instagram return success for pages that do not exist, so they cannot be machine-checked and must be confirmed by hand.`,
  );
  console.log(
    "\nA 403 is a WAF answering a bot, not proof that a page is gone. Treat blocked links as unconfirmed, not dead.",
  );

  if (dead > 0) process.exitCode = 1;
}

main();
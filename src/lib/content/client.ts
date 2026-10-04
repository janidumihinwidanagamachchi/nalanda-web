import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The build-time Supabase client.
 *
 * It is created with the *anon* key on purpose, not the service-role key.
 *
 * The service role bypasses row-level security, which would mean a single
 * missing `.eq("published", true)` in a query ships drafts to the public site
 * with nothing to stop it. Reading as an anonymous visitor means the policies in
 * supabase/migrations are the thing actually being enforced during a build, so
 * the deploy fails closed if a policy is wrong rather than publishing by luck.
 *
 * It also means the project needs one fewer secret: nothing in this repository
 * ever holds a service-role key.
 *
 * Never import this from a "use client" module. It reads a publishable key, but
 * it is a build-time reader and has no session, and scripts/verify.mjs fails
 * the build if a client component reaches for it.
 */
export function buildClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "CONTENT_SOURCE=supabase but NEXT_PUBLIC_SUPABASE_URL or " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add both to .env.local, or " +
        "unset CONTENT_SOURCE to build from src/data instead. See " +
        "docs/admin-panel.md.",
    );
  }

  // No session and no persistence: this client is used once per build, in Node.
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Whether the site reads content from Supabase or from src/data. */
export const readsSupabase = () => process.env.CONTENT_SOURCE === "supabase";
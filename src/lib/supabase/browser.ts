import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The browser Supabase client, used only by /admin.
 *
 * It carries the publishable (anon) key, which is designed to be public: every
 * read and write it can do is bounded by the row-level security policies in
 * supabase/migrations. Nothing here holds a service-role key, and nothing here
 * should ever be given one — a browser bundle is readable by anyone who opens
 * devtools.
 *
 * Returns null when the project is not configured, rather than throwing. That is
 * what lets the whole site, /admin included, build and prerender on a machine
 * with no Supabase environment at all: the panel then renders setup instructions
 * instead of a stack trace.
 */
let client: SupabaseClient | null = null;

export function browserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  // Created once per page load. The default storage adapter persists the session
  // in localStorage, which is what keeps an editor signed in across a refresh.
  client ??= createClient(url, key);
  return client;
}

/** True when the build has the environment the panel needs. */
export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
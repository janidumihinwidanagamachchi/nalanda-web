"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { SignInForm } from "@/components/admin/sign-in-form";
import {
  browserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

/**
 * Authentication gate and shell for /admin.
 *
 * Two things are worth being explicit about.
 *
 * First, the security here is entirely the database's. This component hides the
 * UI from someone who is not signed in, and every policy in
 * supabase/migrations independently refuses the read and the write. A gate that
 * were the only defence would be a gate that a visitor could walk around with
 * devtools open.
 *
 * Second, membership is checked against the `admins` table, not against a list
 * of email addresses in the bundle. The table has no INSERT policy, so rows are
 * granted by hand in the Supabase dashboard; nothing that runs in a browser can
 * add one, including this panel.
 */

type Status =
  | { kind: "checking" }
  | { kind: "signed-out" }
  | { kind: "not-authorised"; email: string | null }
  | { kind: "ready"; email: string | null; role: string | null };

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/media", label: "Photographs" },
];

export function AdminGate({ children }: { children: ReactNode }) {
  // Whether the project is configured is a build-time constant, not something to
  // discover in an effect. Deriving it during render also means an unconfigured
  // build renders its setup instructions straight into the static HTML, instead of
  // flashing "Checking your session…" at someone who can never sign in.
  const configured = isSupabaseConfigured();
  const [status, setStatus] = useState<Status>({ kind: "checking" });

  const resolve = useCallback(async (session: Session | null) => {
    const supabase = browserClient();
    // Unreachable in practice: an unconfigured build returns <Unconfigured />
    // above before this runs. Left as a guard rather than an assumption.
    if (!supabase) return;

    if (!session) {
      setStatus({ kind: "signed-out" });
      return;
    }

    // Read through RLS, which only ever returns the caller's own row. A null
    // here therefore means "signed in, but not on the admins table" — the same
    // answer a forged panel would get.
    const { data } = await supabase
      .from("admins")
      .select("email, role")
      .eq("user_id", session.user.id)
      .maybeSingle();

    setStatus(
      data
        ? { kind: "ready", email: data.email, role: data.role }
        : { kind: "not-authorised", email: session.user.email ?? null },
    );
  }, []);

  useEffect(() => {
    const supabase = browserClient();
    if (!supabase) return;

    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (active) void resolve(data.session);
    });

    // Keeps the panel honest if a session is revoked or expires while it is open,
    // rather than leaving a stale editor at a keyboard that no longer works.
    //
    // The lookup is deferred with setTimeout rather than awaited inline. Supabase
    // holds an internal lock while it dispatches this event, so calling back into
    // the client synchronously — which `resolve` does, to read the admins table —
    // can deadlock on some paths. Yielding first puts the query outside that lock.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setTimeout(() => {
          if (active) void resolve(session);
        }, 0);
      },
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [resolve]);

  if (!configured) return <Unconfigured />;
  if (status.kind === "checking") return <Checking />;
  if (status.kind === "signed-out") return <SignInForm />;
  if (status.kind === "not-authorised") {
    return <NotAuthorised email={status.email} />;
  }

  return (
    <div className="min-h-[100dvh]">
      <header className="border-b border-line bg-panel/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="field">Nalanda College</p>
            <p className="font-serif text-lg leading-tight">
              Content administration
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-quiet-ink underline-offset-4 hover:text-brand hover:underline"
            >
              View site
            </Link>
            <SignOutButton email={status.email} role={status.role} />
          </div>
        </div>

        <nav aria-label="Sections" className="mx-auto max-w-6xl px-6">
          <ul className="flex flex-wrap gap-1 pb-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  // Exact match for the overview so it does not stay highlighted on every page.
  const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-block rounded-t-lg px-3 py-2 text-sm transition-colors duration-[var(--motion-fast)]",
        active
          ? "bg-brand text-brand-ink"
          : "text-quiet-ink hover:bg-highlight hover:text-highlight-ink",
      )}
    >
      {label}
    </Link>
  );
}

function SignOutButton({
  email,
  role,
}: {
  email: string | null;
  role: string | null;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-quiet-ink sm:inline">
        {email}
        {role ? ` · ${role}` : ""}
      </span>
      <button
        type="button"
        onClick={async () => {
          await browserClient()?.auth.signOut();
          router.refresh();
        }}
        className="rounded-lg border px-3 py-1.5 text-xs text-ink transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        Sign out
      </button>
    </div>
  );
}

/**
 * The state a configured build prerenders.
 *
 * Authentication cannot happen on the server — a static export has no server —
 * so this is what ends up in each admin route's prerendered index.html. It uses
 * the same Frame as the other states deliberately: a visitor whose JavaScript
 * fails to load should still be told which panel they reached, rather than
 * staring at a line that never resolves. `npm run verify` asserts that
 * "Content administration" appears on every admin route in every one of these
 * states.
 */
function Checking() {
  return (
    <Frame>
      <h1 className="font-serif text-2xl">Checking your session</h1>
      <p className="measure mt-4 text-sm text-quiet-ink">
        This panel needs JavaScript. Signing in happens in your browser against
        Supabase, so there is nothing for a static page to do until the page is
        running — reload, and if it stays here, check that JavaScript is enabled.
      </p>
    </Frame>
  );
}

function Unconfigured() {
  return (
    <Frame>
      <h1 className="font-serif text-2xl">The panel is not configured</h1>
      <p className="measure mt-4 text-sm text-quiet-ink">
        This deployment has no Supabase project attached, so there is nothing to
        sign in to. That is expected for a local build and for any fork that has
        not set the environment up.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-lg border bg-panel p-4 font-mono text-xs">
        {`NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>`}
      </pre>
      <p className="mt-6 text-sm text-quiet-ink">
        Add both to <code className="font-mono text-xs">.env.local</code> and
        restart the dev server. See{" "}
        <code className="font-mono text-xs">docs/admin-panel.md</code> for the
        full setup, including applying the schema and granting yourself a row in{" "}
        <code className="font-mono text-xs">admins</code>.
      </p>
    </Frame>
  );
}

function NotAuthorised({ email }: { email: string | null }) {
  const router = useRouter();

  return (
    <Frame>
      <h1 className="font-serif text-2xl">Not on the editors list</h1>
      <p className="measure mt-4 text-sm text-quiet-ink">
        {email ? (
          <>
            <span className="font-mono text-xs">{email}</span> is signed in,
            but it has no row in the{" "}
            <code className="font-mono text-xs">admins</code> table. Ask whoever
            runs the Supabase project to insert one, then sign in again.
          </>
        ) : (
          <>
            This account has no row in the{" "}
            <code className="font-mono text-xs">admins</code> table.
          </>
        )}
      </p>
      <button
        type="button"
        onClick={async () => {
          await browserClient()?.auth.signOut();
          router.refresh();
        }}
        className="mt-6 rounded-lg border px-4 py-2 text-sm transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        Sign out
      </button>
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] place-items-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <p className="field">Nalanda College</p>
        {/* Named on every signed-out state, so someone who lands here by typing
            the path knows what they have reached. */}
        <p className="-mt-1 font-serif text-sm text-quiet-ink">
          Content administration
        </p>
        {children}
      </div>
    </div>
  );
}
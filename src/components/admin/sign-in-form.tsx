"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/admin/fields";
import { browserClient } from "@/lib/supabase/browser";

/**
 * Email and password sign-in.
 *
 * There is no sign-up link, and that is deliberate rather than an omission:
 * accounts are created in the Supabase dashboard by whoever administers the
 * project, and the `admins` table has no INSERT policy, so a self-registered
 * account would authenticate and then find itself able to do nothing. Offering a
 * sign-up form would only create that dead end.
 *
 * Supabase can reject a valid-looking password that fails its own strength rules
 * (this project requires a minimum length), so the error is surfaced verbatim
 * rather than replaced with something friendlier and less accurate.
 */
export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = browserClient();
    if (!supabase) return;

    setBusy(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setBusy(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // The gate's onAuthStateChange listener picks the session up, but a refresh
    // here also re-runs the server render so the panel is not sitting behind a
    // stale "checking your session" frame.
    router.refresh();
  }

  return (
    <div className="grid min-h-[100dvh] place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="field">Nalanda College</p>
        <h1 className="mt-2 font-serif text-2xl">Content administration</h1>
        <p className="mt-3 text-sm text-quiet-ink">
          Sign in with an account that has been added to the editors list.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <Field label="Email" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <TextInput
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}